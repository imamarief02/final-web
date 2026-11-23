import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('Variabel lingkungan DATABASE_URL belum diatur. Harap definisikan DATABASE_URL pada berkas .env.local.');
}

// Inisialisasi pool PostgreSQL
let pool;

if (!global._pgPool) {
  pool = new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });
  if (process.env.NODE_ENV !== 'production') {
    global._pgPool = pool;
  }
} else {
  pool = global._pgPool;
}

export async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      // console.log('Executed query', { text: text.substring(0, 80), duration, rows: res.rowCount });
    }
    return res;
  } catch (error) {
    console.error('Database query error:', error.message, 'Query:', text);
    throw error;
  }
}

export default pool;
