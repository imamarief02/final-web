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

// GET: Mengambil daftar kursus milik pengajar yang login
export async function GET() {
  try {
    const { user, error, status } = await requireRole(['teacher', 'admin']);
    if (error) return NextResponse.json({ error }, { status });

    const result = await query(
      `SELECT c.id, c.title, c.slug, c.description, c.thumbnail_url, c.level, c.status,
              c.created_at, c.updated_at,
              cat.name AS category_name, cat.id AS category_id,
              COUNT(DISTINCT e.id)::int AS student_count,
              COUNT(DISTINCT m.id)::int AS material_count
       FROM courses c
       JOIN categories cat ON c.category_id = cat.id
       LEFT JOIN enrollments e ON c.id = e.course_id
       LEFT JOIN materials m ON c.id = m.course_id
       WHERE c.teacher_id = $1
       GROUP BY c.id, cat.name, cat.id
       ORDER BY c.created_at DESC`,
      [user.id]
    );

    return NextResponse.json({ courses: result.rows });
  } catch (error) {
    console.error('Teacher courses GET Error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil daftar kursus.' },
      { status: 500 }
    );
  }
}

// POST: Membuat kursus baru
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
    } = await request.json();

    if (!title || !description || !categoryId) {
      return NextResponse.json(
        { error: 'Judul, deskripsi, dan kategori wajib diisi.' },
        { status: 400 }
      );
    }

    let slug = slugify(title);
    // Pastikan keunikan slug
    const checkSlug = await query('SELECT id FROM courses WHERE slug = $1', [slug]);
    if (checkSlug.rows.length > 0) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const insertRes = await query(
      `INSERT INTO courses (teacher_id, category_id, title, slug, description, thumbnail_url, level, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, title, slug, status, created_at`,
      [user.id, categoryId, title.trim(), slug, description.trim(), thumbnailUrl.trim() || null, level, courseStatus]
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
    console.error('Teacher course POST Error:', error);
    return NextResponse.json(
      { error: 'Gagal membuat kursus.' },
      { status: 500 }
    );
  }
}
