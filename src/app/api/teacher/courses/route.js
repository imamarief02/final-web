import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole } from '@/lib/auth';

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// GET: Mengambil daftar kursus milik pengajar yang login (atau semua jika admin)
export async function GET(request) {
  try {
    const { user, error, status } = await requireRole(['teacher', 'admin']);
    if (error) return NextResponse.json({ error }, { status });

    const { searchParams } = new URL(request.url);
    const filterAll = searchParams.get('all') === 'true' && user.role === 'admin';

    let sql = `
      SELECT c.id, c.title, c.slug, c.description, c.thumbnail_url, c.level, c.status,
             c.start_date, c.end_date, c.teacher_id,
             c.created_at, c.updated_at,
             u.name AS teacher_name, u.email AS teacher_email,
             cat.name AS category_name, cat.id AS category_id,
             COUNT(DISTINCT e.id)::int AS student_count,
             COUNT(DISTINCT m.id)::int AS material_count
      FROM courses c
      JOIN users u ON c.teacher_id = u.id
      JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN enrollments e ON c.id = e.course_id
      LEFT JOIN materials m ON c.id = m.course_id
    `;
    const params = [];

    if (!filterAll) {
      params.push(user.id);
      sql += ` WHERE c.teacher_id = $1`;
    }

    sql += `
      GROUP BY c.id, u.name, u.email, cat.name, cat.id
      ORDER BY c.created_at DESC
    `;

    const result = await query(sql, params);
    return NextResponse.json({ courses: result.rows });
  } catch (error) {
    console.error('Teacher courses GET Error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil daftar kursus.' },
      { status: 500 }
    );
  }
}

// POST: Membuat kursus baru (oleh Teacher atau Admin)
export async function POST(request) {
  try {
    const { user, error, status } = await requireRole(['teacher', 'admin']);
    if (error) return NextResponse.json({ error }, { status });

    const {
      title,
      description,
      categoryId,
      level = 'pemula',
      thumbnailUrl = '',
      status: courseStatus = 'draft',
      startDate = null,
      endDate = null,
      teacherId = null,
    } = await request.json();

    if (!title || !description || !categoryId) {
      return NextResponse.json(
        { error: 'Nama kursus, deskripsi, dan kategori wajib diisi.' },
        { status: 400 }
      );
    }

    if (title.trim().length > 150) {
      return NextResponse.json(
        { error: 'Judul kursus maksimal 150 karakter.' },
        { status: 400 }
      );
    }

    if (!['pemula', 'menengah', 'lanjutan'].includes(level)) {
      return NextResponse.json(
        { error: 'Level kursus harus berupa pemula, menengah, atau lanjutan.' },
        { status: 400 }
      );
    }

    if (!['draft', 'published'].includes(courseStatus)) {
      return NextResponse.json(
        { error: 'Status kursus harus berupa draft atau published.' },
        { status: 400 }
      );
    }

    const catCheck = await query(`SELECT id FROM categories WHERE id = $1`, [categoryId]);
    if (catCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Kategori yang dipilih tidak valid.' },
        { status: 400 }
      );
    }

    // Validasi Rentang Waktu Kursus (Jika diisi)
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return NextResponse.json(
          { error: 'Format tanggal mulai atau tanggal selesai tidak valid.' },
          { status: 400 }
        );
      }
      if (start > end) {
        return NextResponse.json(
          { error: 'Tanggal mulai tidak boleh lebih akhir daripada tanggal selesai kursus.' },
          { status: 400 }
        );
      }
    }

    // Penentuan Pengajar:
    // Jika Admin membuat, bisa memilih teacherId dari dropdown. Jika Teacher membuat, otomatis ID pengajar login.
    let targetTeacherId = user.id;
    if (user.role === 'admin' && teacherId) {
      const parsedTeacherId = parseInt(teacherId, 10);
      const tCheck = await query(`SELECT id FROM users WHERE id = $1 AND role IN ('teacher', 'admin')`, [parsedTeacherId]);
      if (tCheck.rows.length === 0) {
        return NextResponse.json(
          { error: 'Pengajar yang dipilih tidak ditemukan atau belum terverifikasi.' },
          { status: 400 }
        );
      }
      targetTeacherId = parsedTeacherId;
    }

    let slug = slugify(title);
    const slugCheck = await query(`SELECT id FROM courses WHERE slug = $1`, [slug]);
    if (slugCheck.rows.length > 0) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const insertRes = await query(
      `INSERT INTO courses (
         teacher_id, category_id, title, slug, description,
         thumbnail_url, level, status, start_date, end_date
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, teacher_id, category_id, title, slug, description, thumbnail_url, level, status, start_date, end_date, created_at`,
      [
        targetTeacherId,
        categoryId,
        title.trim(),
        slug,
        description.trim(),
        thumbnailUrl.trim() || null,
        level,
        courseStatus,
        startDate || null,
        endDate || null,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Kursus berhasil dibuat.',
        course: insertRes.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create course API Error:', error);
    return NextResponse.json(
      { error: 'Gagal membuat kursus baru.' },
      { status: 500 }
    );
  }
}
