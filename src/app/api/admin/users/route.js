import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole, hashPassword } from '@/lib/auth';

// GET: Mengambil seluruh pengguna terdaftar (dengan dukungan filter pencarian & peran)
export async function GET(request) {
  try {
    const { error, status } = await requireRole(['admin']);
    if (error) return NextResponse.json({ error }, { status });

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q') || '';
    const roleFilter = searchParams.get('role') || '';

    let sql = `
      SELECT id, name, email, role, teacher_status, bio, avatar_url, approved_at, created_at
      FROM users
      WHERE 1=1
    `;
    const params = [];

    if (search.trim()) {
      params.push(`%${search.trim()}%`);
      sql += ` AND (name ILIKE $${params.length} OR email ILIKE $${params.length})`;
    }

    if (roleFilter.trim() && ['admin', 'teacher', 'student'].includes(roleFilter.trim())) {
      params.push(roleFilter.trim());
      sql += ` AND role = $${params.length}`;
    }

    sql += ` ORDER BY created_at DESC`;

    const result = await query(sql, params);
    return NextResponse.json({ users: result.rows });
  } catch (error) {
    console.error('Admin users GET Error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data pengguna.' },
      { status: 500 }
    );
  }
}

// POST: Membuat pengguna baru oleh Admin
export async function POST(request) {
  try {
    const { error, status } = await requireRole(['admin']);
    if (error) return NextResponse.json({ error }, { status });

    const { name, email, password, role = 'student', bio = '' } = await request.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Nama/username, email, password, dan role wajib diisi.' },
        { status: 400 }
      );
    }

    if (!['admin', 'teacher', 'student'].includes(role)) {
      return NextResponse.json(
        { error: 'Peran harus berupa admin, teacher, atau student.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password minimal 6 karakter.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format email tidak valid.' },
        { status: 400 }
      );
    }

    // Cek duplikasi email
    const existing = await query(`SELECT id FROM users WHERE email = $1`, [email.toLowerCase().trim()]);
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'Email sudah digunakan oleh akun lain.' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const teacherStatus = role === 'teacher' ? 'approved' : null;
    const approvedAt = role === 'teacher' ? new Date() : null;

    const insertRes = await query(
      `INSERT INTO users (name, email, password_hash, role, teacher_status, approved_at, bio)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, name, email, role, teacher_status, approved_at, created_at`,
      [name.trim(), email.toLowerCase().trim(), passwordHash, role, teacherStatus, approvedAt, bio.trim() || null]
    );

    return NextResponse.json({
      success: true,
      message: 'Pengguna berhasil dibuat.',
      user: insertRes.rows[0],
    }, { status: 201 });
  } catch (error) {
    console.error('Admin users POST Error:', error);
    return NextResponse.json(
      { error: 'Gagal membuat pengguna baru.' },
      { status: 500 }
    );
  }
}

// PUT: Mengubah data pengguna oleh Admin
export async function PUT(request) {
  try {
    const { user: adminUser, error, status } = await requireRole(['admin']);
    if (error) return NextResponse.json({ error }, { status });

    const { id, name, email, role, password, bio } = await request.json();
    const userId = parseInt(id, 10);

    if (!userId || !name || !email || !role) {
      return NextResponse.json(
        { error: 'ID, nama, email, dan role wajib diisi.' },
        { status: 400 }
      );
    }

    if (!['admin', 'teacher', 'student'].includes(role)) {
      return NextResponse.json(
        { error: 'Role tidak valid.' },
        { status: 400 }
      );
    }

    const checkUser = await query(`SELECT id, role, teacher_status, approved_at FROM users WHERE id = $1`, [userId]);
    if (checkUser.rows.length === 0) {
      return NextResponse.json({ error: 'Pengguna tidak ditemukan.' }, { status: 404 });
    }

    // Cek keunikan email jika berubah
    const dupCheck = await query(`SELECT id FROM users WHERE email = $1 AND id <> $2`, [email.toLowerCase().trim(), userId]);
    if (dupCheck.rows.length > 0) {
      return NextResponse.json({ error: 'Email sudah digunakan akun lain.' }, { status: 409 });
    }

    let teacherStatus = checkUser.rows[0].teacher_status;
    let approvedAt = checkUser.rows[0].approved_at;

    if (role === 'teacher') {
      if (teacherStatus !== 'approved') {
        teacherStatus = 'approved';
        approvedAt = new Date();
      }
    } else {
      teacherStatus = null;
      approvedAt = null;
    }

    if (password && password.trim().length >= 6) {
      const passwordHash = await hashPassword(password);
      const updateRes = await query(
        `UPDATE users
         SET name = $1, email = $2, role = $3, teacher_status = $4, approved_at = $5,
             password_hash = $6, bio = COALESCE($7, bio)
         WHERE id = $8
         RETURNING id, name, email, role, teacher_status, approved_at, bio, created_at`,
        [name.trim(), email.toLowerCase().trim(), role, teacherStatus, approvedAt, passwordHash, bio !== undefined ? bio.trim() : null, userId]
      );
      return NextResponse.json({
        success: true,
        message: 'Pengguna dan password berhasil diperbarui.',
        user: updateRes.rows[0],
      });
    } else {
      const updateRes = await query(
        `UPDATE users
         SET name = $1, email = $2, role = $3, teacher_status = $4, approved_at = $5,
             bio = COALESCE($6, bio)
         WHERE id = $7
         RETURNING id, name, email, role, teacher_status, approved_at, bio, created_at`,
        [name.trim(), email.toLowerCase().trim(), role, teacherStatus, approvedAt, bio !== undefined ? bio.trim() : null, userId]
      );
      return NextResponse.json({
        success: true,
        message: 'Pengguna berhasil diperbarui.',
        user: updateRes.rows[0],
      });
    }
  } catch (error) {
    console.error('Admin users PUT Error:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui pengguna.' },
      { status: 500 }
    );
  }
}

// DELETE: Menghapus pengguna oleh Admin
export async function DELETE(request) {
  try {
    const { user: adminUser, error, status } = await requireRole(['admin']);
    if (error) return NextResponse.json({ error }, { status });

    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get('id'), 10);

    if (!userId) {
      return NextResponse.json({ error: 'ID pengguna wajib disertakan.' }, { status: 400 });
    }

    if (userId === adminUser.id) {
      return NextResponse.json(
        { error: 'Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif.' },
        { status: 400 }
      );
    }

    const delRes = await query(`DELETE FROM users WHERE id = $1 RETURNING id, name, email`, [userId]);
    if (delRes.rows.length === 0) {
      return NextResponse.json({ error: 'Pengguna tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Pengguna ${delRes.rows[0].name} berhasil dihapus.`,
    });
  } catch (error) {
    console.error('Admin users DELETE Error:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus pengguna.' },
      { status: 500 }
    );
  }
}
