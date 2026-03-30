import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pg from 'pg';

const { Pool } = pg;
const __dirname = dirname(fileURLToPath(import.meta.url));

if (!process.env.DATABASE_URL) {
  console.error('Error: DATABASE_URL is not set.');
  console.error('Run: node --env-file=.env.local scripts/init-db.mjs');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const schema = readFileSync(join(__dirname, '../sql/schema.sql'), 'utf-8');
const seed   = readFileSync(join(__dirname, '../sql/seed.sql'),   'utf-8');

async function init() {
  const client = await pool.connect();
  try {
    console.log('📦 Creating schema...');
    await client.query(schema);
    console.log('✅ Schema ready');

    const { rows } = await client.query('SELECT COUNT(*) AS cnt FROM products');
    if (Number(rows[0].cnt) > 0) {
      console.log('ℹ️  Seed data already exists — skipping');
      return;
    }

    console.log('🌱 Seeding data...');
    await client.query(seed);
    console.log('✅ Seed complete');
  } finally {
    client.release();
    await pool.end();
  }
}

init().catch(err => {
  console.error('❌ DB initialization failed:', err.message);
  process.exit(1);
});
