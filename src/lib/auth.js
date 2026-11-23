import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { query } from './db';

const SESSION_COOKIE_NAME = 'kursusdeh_session';
const SESSION_EXPIRY_DAYS = 7;

// Fungsi hash token untuk disimpan di basis data
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// Password hashing
export async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, 10);
}

export async function comparePassword(plainPassword, hash) {
  return bcrypt.compare(plainPassword, hash);
}

// Membuat sesi baru dan menyimpan cookie httpOnly
export async function createSession(userId) {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

  // Bersihkan sesi yang sudah kedaluwarsa untuk menjaga efisiensi database
  await query(`DELETE FROM sessions WHERE expires_at <= NOW() OR (user_id = $1 AND expires_at <= NOW())`, [userId]);

  // Simpan ke database
  await query(
    `INSERT INTO sessions (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, tokenHash, expiresAt]
  );

  // Set cookie di browser
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, rawToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });

  return rawToken;
}

// Menghapus sesi (Logout)
export async function destroySession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (sessionCookie?.value) {
    const tokenHash = hashToken(sessionCookie.value);
    await query(`DELETE FROM sessions WHERE token_hash = $1`, [tokenHash]);
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

// Mengambil data pengguna dari sesi aktif
export async function getSessionUser() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie?.value) {
      return null;
    }

    const tokenHash = hashToken(sessionCookie.value);
    const result = await query(
      `SELECT u.id, u.name, u.email, u.role, u.teacher_status, u.bio, u.avatar_url, u.created_at
       FROM sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.token_hash = $1 AND s.expires_at > NOW()`,
      [tokenHash]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error fetching session user:', error);
    return null;
  }
}

// Helper otorisasi peran
export async function requireAuth() {
  const user = await getSessionUser();
  if (!user) {
    return { error: 'Unauthorized: Harap masuk terlebih dahulu', status: 401 };
  }
  return { user };
}

export async function requireRole(allowedRoles = []) {
  const { user, error, status } = await requireAuth();
  if (error) return { error, status };

  if (!allowedRoles.includes(user.role)) {
    return { error: 'Forbidden: Anda tidak memiliki akses ke fitur ini', status: 403 };
  }

  // Jika teacher, pastikan sudah approved jika dibutuhkan
  if (user.role === 'teacher' && user.teacher_status !== 'approved') {
    return { 
      error: 'Akun pengajar Anda masih menunggu persetujuan admin atau ditolak.', 
      status: 403, 
      user 
    };
  }

  return { user };
}
