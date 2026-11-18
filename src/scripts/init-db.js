import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:imam173@localhost:5432/kursusdeh';

const pool = new Pool({
  connectionString,
});

async function run() {
  console.log('--- Inisialisasi Basis Data KursusDeh ---');
  console.log(`Menghubungkan ke: ${connectionString.replace(/:[^:@]+@/, ':****@')}`);

  try {
    const client = await pool.connect();
    console.log('✓ Terhubung ke PostgreSQL');

    const schemaPath = path.join(process.cwd(), 'database', 'schema.sql');
    const seedPath = path.join(process.cwd(), 'database', 'seed.sql');

    console.log('Menjalankan schema.sql...');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schemaSql);
    console.log('✓ Skema tabel berhasil dibuat (9 tabel & tipe ENUM)');

    console.log('Menjalankan seed.sql...');
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    await client.query(seedSql);
    console.log('✓ Data seed berhasil dimasukkan');

    client.release();
    console.log('--- Basis Data Berhasil Diinisialisasi! ---');
  } catch (err) {
    console.error('✗ Gagal menginisialisasi basis data:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
