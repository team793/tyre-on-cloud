/**
 * Run:  node --env-file=.env.local scripts/migrate.mjs <migration-file>
 * Example: node --env-file=.env.local scripts/migrate.mjs 0002_rename_winter_to_rainy.sql
 */
import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { Client } = pg;
const __dirname = dirname(fileURLToPath(import.meta.url));

const migrationFile = process.argv[2] || '0001_init.sql';
const sql = readFileSync(
  join(__dirname, '../supabase/migrations', migrationFile),
  'utf8'
);

const client = new Client({
  connectionString: process.env.DIRECT_URL,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  console.log('Connected to Supabase database');
  await client.query(sql);
  console.log('Migration completed successfully');
} catch (err) {
  console.error('Migration failed:', err.message);
  process.exit(1);
} finally {
  await client.end();
}
