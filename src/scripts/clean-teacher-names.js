import { Pool } from 'pg';

const pool = new Pool({ connectionString: 'postgresql://postgres:imam173@localhost:5432/kursusdeh' });

async function removeTitles() {
  await pool.query(`UPDATE users SET name = 'Budi Santoso' WHERE id = 2`);
  await pool.query(`UPDATE users SET name = 'Fajar Ramadhan' WHERE email = 'fajar@kursusdeh.com'`);
  await pool.query(`UPDATE users SET name = 'Sarah Wijaya' WHERE email = 'sarah@kursusdeh.com'`);

  const res = await pool.query(`SELECT id, name, email, role, teacher_status, bio FROM users WHERE role = 'teacher' ORDER BY id`);
  console.log('=== DAFTAR GURU SETELAH DIHAPUS GELARNYA ===');
  console.table(res.rows);

  await pool.end();
}

removeTitles().catch(err => {
  console.error(err);
  process.exit(1);
});
