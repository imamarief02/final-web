import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(
      `SELECT c.id, c.title, c.slug, c.description, c.thumbnail_url, c.level, c.created_at,
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
       GROUP BY c.id, u.name, cat.name, cat.slug
       ORDER BY student_count DESC, c.created_at DESC
       LIMIT 5`
    );

    return NextResponse.json({ courses: result.rows });
  } catch (error) {
    console.error('Popular courses API Error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil kursus terpopuler.' },
      { status: 500 }
    );
  }
}
