/**
 * Upload tyre product photos to Supabase Storage and wire them to products.image_url.
 *
 * Folder convention — drop files into a folder and name each file:
 *   <BRAND>__<MODEL>.<ext>          e.g. DUNLOP__SP_LM705.jpg
 * Brand/model matching is case-insensitive and ignores extra whitespace/underscores.
 * One photo is applied to every product whose name starts with that brand + model
 * (i.e. every size variant of that model shares the same tread photo).
 *
 * Run:  node --env-file=.env.local scripts/upload-product-images.mjs <path-to-folder>
 */

import { createClient } from '@supabase/supabase-js';
import { readdirSync, readFileSync } from 'fs';
import { extname, basename, join } from 'path';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = 'product-images';

const FOLDER = process.argv[2];
if (!FOLDER) {
  console.error('Usage: node --env-file=.env.local scripts/upload-product-images.mjs <path-to-folder>');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Same brand+model stripping logic used to count distinct models — keep in sync.
function brandModelKey(name) {
  return name
    .replace(/\s*\d{2,3}\/\d{2}R\d{2}.*$/i, '')
    .trim()
    .toUpperCase()
    .replace(/[\s_]+/g, ' ');
}

async function main() {
  const files = readdirSync(FOLDER).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
  if (files.length === 0) {
    console.log('No image files found in', FOLDER);
    return;
  }

  const { data: products, error: fetchErr } = await supabase
    .from('products')
    .select('id, brand, name');
  if (fetchErr) throw fetchErr;

  for (const file of files) {
    const stem = basename(file, extname(file));
    const [brandPart, ...modelParts] = stem.split('__');
    if (modelParts.length === 0) {
      console.warn(`Skipping "${file}" — expected BRAND__MODEL naming`);
      continue;
    }
    const wantKey = brandModelKey(`${brandPart} ${modelParts.join(' ')}`);

    const matches = products.filter((p) => brandModelKey(p.name).startsWith(wantKey) || wantKey.startsWith(brandModelKey(p.name)));
    if (matches.length === 0) {
      console.warn(`No product matches "${file}" (key: "${wantKey}") — skipped`);
      continue;
    }

    const ext = extname(file).toLowerCase();
    const storagePath = `${brandPart.toLowerCase()}/${modelParts.join('-').toLowerCase()}${ext}`;
    const fileBuffer = readFileSync(join(FOLDER, file));

    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, fileBuffer, { contentType: `image/${ext === '.jpg' ? 'jpeg' : ext.slice(1)}`, upsert: true });
    if (uploadErr) {
      console.error(`Upload failed for "${file}":`, uploadErr.message);
      continue;
    }

    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
    const publicUrl = pub.publicUrl;

    const { error: updateErr } = await supabase
      .from('products')
      .update({ image_url: publicUrl })
      .in('id', matches.map((m) => m.id));
    if (updateErr) {
      console.error(`DB update failed for "${file}":`, updateErr.message);
      continue;
    }

    console.log(`✓ ${file} → ${matches.length} product(s) updated (${publicUrl})`);
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
