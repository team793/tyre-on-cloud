/**
 * Import serialized inventory CSV into Supabase.
 *
 * What it does:
 *  1. Reads the CSV (one row = one physical tyre unit)
 *  2. Groups units into unique products (brand + pattern + size)
 *  3. Parses tyre size string → width / profile / rim / speed_rating
 *  4. Counts available stock per warehouse
 *  5. Upserts: warehouses → products → inventory
 *
 * Run:  node --env-file=.env.local scripts/import-stock.mjs <path-to-csv>
 */

import pg from 'pg';
import { createReadStream } from 'fs';
import { createInterface } from 'readline';

const { Client } = pg;

// ─── Config ────────────────────────────────────────────────────────────────
const DB_URL = process.env.DIRECT_URL;

const CSV_PATH =
  process.argv[2] ||
  'C:/Users/WINDOWS 11/Desktop/tyre on cloud/stock data/serialized_inventory_all_locations_2026-06-20.csv';

// Thai warehouse names → English labels
const WAREHOUSE_MAP = {
  'โกดัง':    'Warehouse 1',
  'โกดัง 2':  'Warehouse 2',
};

// ─── Parse tyre size string ────────────────────────────────────────────────
// Handles:
//   Standard metric:  235/50ZR18, 265/65R17PR, LT265/65R17, 205/70R15C
//   No-profile (van): 205R14, 195R14, 205R16  → profile defaults to 80
//   Imperial mud/AT:  30x9.50R15LT, 31x10.50R15LT, 33x12.50R18LT
function parseTyreSize(raw) {
  const str = raw.trim().toUpperCase().replace(/^(LT|P)/, '');
  const validSpeeds = new Set(['H', 'T', 'S', 'Q', 'N', 'V', 'W', 'Y', 'Z']);

  // 1. Standard metric with aspect ratio: 235/50ZR18
  const mMetric = str.match(/^(\d+)\/(\d+)([A-Z]?)R(\d+)/);
  if (mMetric) {
    const [, w, pr, letter, r] = mMetric;
    return {
      width:        parseInt(w,  10),
      profile:      parseInt(pr, 10),
      rim_size:     parseInt(r,  10),
      speed_rating: validSpeeds.has(letter) ? letter : 'R',
    };
  }

  // 2. No-profile commercial/van: 205R14, 195R14, 215R16
  const mNoProfile = str.match(/^(\d+)R(\d+)/);
  if (mNoProfile) {
    const [, w, r] = mNoProfile;
    return {
      width:        parseInt(w, 10),
      profile:      80,           // conventional default for no-profile designation
      rim_size:     parseInt(r, 10),
      speed_rating: 'R',
    };
  }

  // 3. Imperial mud/off-road: 30x9.50R15LT, 33x12.50R18LT
  const mImperial = str.match(/^(\d+(?:\.\d+)?)X(\d+(?:\.\d+)?)R(\d+)/);
  if (mImperial) {
    const [, overallIn, widthIn, r] = mImperial;
    const widthMm       = Math.round(parseFloat(widthIn) * 25.4);
    const rimMm         = parseInt(r, 10) * 25.4;
    const overallMm     = parseFloat(overallIn) * 25.4;
    const sidewallMm    = (overallMm - rimMm) / 2;
    const profile       = Math.round((sidewallMm / widthMm) * 100);
    // Clamp to valid DB range: rim 10–24, width 100–400
    const rim_size = parseInt(r, 10);
    if (rim_size < 10 || rim_size > 24 || widthMm < 100 || widthMm > 400) return null;
    return {
      width:        widthMm,
      profile:      profile,
      rim_size,
      speed_rating: 'R',
    };
  }

  return null;
}

// ─── Guess tyre type from pattern name ────────────────────────────────────
function getTyreType(pattern) {
  const p = pattern.toUpperCase();
  if (/WINTER|W[_-]|BLIZZAK|ICE|POLAR|NORDICA/.test(p)) return 'Rainy';
  if (/AT\d|A\/T|ALL.?TERR|AT\./.test(p)) return 'AllSeason';
  return 'Summer';
}

// ─── Read CSV ──────────────────────────────────────────────────────────────
async function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    const rl = createInterface({ input: createReadStream(filePath) });
    let header = true;

    rl.on('line', raw => {
      if (header) { header = false; return; }
      if (!raw.trim()) return;

      // Simple CSV parse (fields may be quoted)
      const cols = raw
        .split(',')
        .map(c => c.replace(/^"|"$/g, '').trim());

      const [
        serial, tireNum, brand, pattern, week, year,
        location, status, condition,
        cost, retailCash, retailInst, retailPromo, wsA, wsB,
        receivedDate,
      ] = cols;

      rows.push({
        serial, tireNum, brand, pattern,
        location, status,
        cost:       parseFloat(cost)        || 0,
        retailCash: parseFloat(retailCash)  || 0,
        wsA:        parseFloat(wsA)         || 0,
      });
    });

    rl.on('close', () => resolve(rows));
    rl.on('error', reject);
  });
}

// ─── Aggregate products & warehouse stock ─────────────────────────────────
function aggregate(rows) {
  const products = new Map();   // key → product meta + stock by warehouse
  const warehouses = new Set();

  rows.forEach(row => {
    const { serial, tireNum, brand, pattern, location, status, retailCash, wsA } = row;

    // Only include tyres that are somewhere physical
    const warehouse = WAREHOUSE_MAP[location];
    if (!warehouse) return;           // skip IN_TRANSIT / No Location
    warehouses.add(warehouse);

    const key = `${brand}||${pattern}||${tireNum}`;

    if (!products.has(key)) {
      const dims = parseTyreSize(tireNum);
      if (!dims) {
        console.warn(`  Skipping unparseable size: "${tireNum}"`);
        return;
      }
      products.set(key, {
        sku:          `${brand}-${pattern}-${tireNum}`.replace(/[^A-Z0-9\-\/]/gi, '-'),
        name:         `${brand} ${pattern} ${tireNum}`,
        brand,
        pattern,
        tireNum,
        ...dims,
        tyre_type:    getTyreType(pattern),
        price_retail: retailCash > 0 ? retailCash : 0,
        price_dealer: wsA        > 0 ? wsA        : 0,
        stock_by_wh:  {},
        total_stock:  0,
      });
    }

    const prod = products.get(key);
    if (status === 'AVAILABLE') {
      prod.stock_by_wh[warehouse] = (prod.stock_by_wh[warehouse] || 0) + 1;
      prod.total_stock++;
    }

    // Prefer non-zero prices if we see them later in the file
    if (retailCash > 0 && prod.price_retail === 0) prod.price_retail = retailCash;
    if (wsA        > 0 && prod.price_dealer === 0) prod.price_dealer = wsA;
  });

  return { products: [...products.values()], warehouses: [...warehouses] };
}

// ─── Main ──────────────────────────────────────────────────────────────────
async function main() {
  console.log('Reading CSV…');
  const rows = await readCSV(CSV_PATH);
  console.log(`  ${rows.length} rows read`);

  const { products, warehouses } = aggregate(rows);
  console.log(`  ${products.length} unique products | ${warehouses.length} warehouses`);

  const client = new Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log('Connected to Supabase');

  // 1. Upsert warehouses
  console.log('\nUpserting warehouses…');
  const whIdByName = {};
  for (const name of warehouses) {
    const res = await client.query(
      `INSERT INTO public.warehouses (name, region)
       VALUES ($1, 'Thailand')
       ON CONFLICT (name) DO UPDATE SET region = EXCLUDED.region
       RETURNING id`,
      [name]
    );
    whIdByName[name] = res.rows[0].id;
    console.log(`  ✓ ${name} → ${res.rows[0].id}`);
  }

  // 2. Upsert products + inventory
  console.log(`\nUpserting ${products.length} products…`);
  let inserted = 0, skipped = 0;

  for (const p of products) {
    // price constraint: price_dealer <= price_retail
    const price_retail = Math.max(p.price_retail, p.price_dealer, 0);
    const price_dealer = Math.min(p.price_dealer, price_retail);

    try {
      const res = await client.query(
        `INSERT INTO public.products
           (sku, name, brand, width, profile, rim_size, speed_rating, load_index,
            tyre_type, stock, price_retail, price_dealer, tags)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
         ON CONFLICT (sku) DO UPDATE SET
           stock         = EXCLUDED.stock,
           price_retail  = EXCLUDED.price_retail,
           price_dealer  = EXCLUDED.price_dealer,
           updated_at    = now()
         RETURNING id`,
        [
          p.sku, p.name, p.brand,
          p.width, p.profile, p.rim_size, p.speed_rating,
          91,                       // load_index placeholder
          p.tyre_type,
          p.total_stock,
          price_retail,
          price_dealer,
          [p.brand.toLowerCase(), p.pattern.toLowerCase(), p.tyre_type.toLowerCase()],
        ]
      );
      const productId = res.rows[0].id;

      // 3. Upsert inventory rows (per warehouse)
      for (const [whName, qty] of Object.entries(p.stock_by_wh)) {
        const whId = whIdByName[whName];
        await client.query(
          `INSERT INTO public.inventory (product_id, warehouse_id, quantity)
           VALUES ($1, $2, $3)
           ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity`,
          [productId, whId, qty]
        );
      }
      inserted++;
    } catch (err) {
      console.warn(`  Skipped "${p.sku}": ${err.message}`);
      skipped++;
    }
  }

  await client.end();

  console.log('\n──────────────────────────────────');
  console.log(`✓ Import complete`);
  console.log(`  Products inserted/updated : ${inserted}`);
  console.log(`  Products skipped (errors) : ${skipped}`);
  console.log(`  Warehouses                : ${warehouses.join(', ')}`);
  console.log('\nNote: prices show as 0 because the ERP export had no prices.');
  console.log('Update them in Supabase → Table Editor → products (price_retail, price_dealer).');
}

main().catch(err => { console.error(err); process.exit(1); });
