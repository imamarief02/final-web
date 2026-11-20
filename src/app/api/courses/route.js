import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const categorySlug = searchParams.get('category') || '';
    const level = searchParams.get('level') || '';

    let sql = `
      SELECT c.id, c.title, c.slug, c.description, c.thumbnail_url, c.level, c.created_at,
             u.name AS teacher_name,
             cat.name AS category_name,
             cat.slug AS category_slug,
             COUNT(DISTINCT e.id)::int AS student_count,
             COUNT(DISTINCT m.id)::int AS material_count
      FROM courses c
      JOIN users u ON c.teacher_id = u.id
      JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN enrollments e ON c.id = e.course_id
      LEFT JOIN materials m ON c.id = m.course_id
      WHERE c.status = 'published'
    `;

    const params = [];

    if (q.trim()) {
      params.push(`%${q.trim()}%`);
      sql += ` AND (c.title ILIKE $${params.length} OR c.description ILIKE $${params.length})`;
    }

    if (categorySlug.trim()) {
      params.push(categorySlug.trim());
      sql += ` AND cat.slug = $${params.length}`;
    }

    if (level.trim() && ['pemula', 'menengah', 'lanjutan'].includes(level.trim())) {
      params.push(level.trim());
      sql += ` AND c.level = $${params.length}`;
    }

    sql += `
      GROUP BY c.id, u.name, cat.name, cat.slug
      ORDER BY c.created_at DESC
    `;

    const result = await query(sql, params);

    return NextResponse.json({ courses: result.rows });
  } catch (error) {
    console.error('Courses catalog API Error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil katalog kursus.' },
      { status: 500 }
    );
  }
}
