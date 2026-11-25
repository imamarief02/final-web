import { Pool } from 'pg';

const pool = new Pool({ connectionString: 'postgresql://postgres:imam173@localhost:5432/kursusdeh' });

async function check() {
  const res = await pool.query(`SELECT id, name, email, role, teacher_status, approved_at FROM users WHERE role = 'teacher'`);
  console.table(res.rows);
  await pool.end();
}

check();
