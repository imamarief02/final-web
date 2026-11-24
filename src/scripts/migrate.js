import { query } from '../lib/db.js';

async function migrate() {
  console.log('--- Menjalankan Migrasi Basis Data ---');
  try {
    // 1. Tambah approved_at ke tabel users
    await query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
    `);
    console.log('✓ Kolom approved_at pada tabel users siap.');

    // 2. Tambah start_date & end_date ke tabel courses
    await query(`
      ALTER TABLE courses 
      ADD COLUMN IF NOT EXISTS start_date DATE,
      ADD COLUMN IF NOT EXISTS end_date DATE;
    `);
    console.log('✓ Kolom start_date dan end_date pada tabel courses siap.');

    // Berikan approved_at default untuk guru yang sudah approved sebelumnya
    await query(`
      UPDATE users 
      SET approved_at = created_at 
      WHERE role = 'teacher' AND teacher_status = 'approved' AND approved_at IS NULL;
    `);
    console.log('✓ Data approved_at guru lama disinkronkan.');

    console.log('--- Migrasi Selesai dengan Sukses ---');
    process.exit(0);
  } catch (err) {
    console.error('✗ Migrasi Gagal:', err);
    process.exit(1);
  }
}

migrate();
