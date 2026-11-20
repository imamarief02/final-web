import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function GET() {
  try {
    const { user, error, status } = await requireRole(['student', 'teacher', 'admin']);
    if (error) return NextResponse.json({ error }, { status });

    const sql = `
      SELECT e.id AS enrollment_id, e.enrolled_at, e.completed_at,
             c.id AS course_id, c.title, c.slug, c.description, c.thumbnail_url, c.level,
             u.name AS teacher_name,
             cat.name AS category_name,
             COUNT(DISTINCT m.id)::int AS total_materials,
             COUNT(DISTINCT mp.id) FILTER (WHERE mp.is_completed = TRUE)::int AS completed_materials,
             cert.certificate_code
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      JOIN users u ON c.teacher_id = u.id
      JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN materials m ON c.id = m.course_id
      LEFT JOIN material_progress mp ON e.id = mp.enrollment_id
      LEFT JOIN certificates cert ON e.id = cert.enrollment_id
      WHERE e.student_id = $1
      GROUP BY e.id, c.id, u.name, cat.name, cert.certificate_code
      ORDER BY e.enrolled_at DESC
    `;

    const result = await query(sql, [user.id]);

    const enrolledCourses = result.rows.map((row) => {
      const total = row.total_materials || 0;
      const completed = row.completed_materials || 0;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      return {
        ...row,
        progress_percentage: percentage,
      };
    });

    return NextResponse.json({ courses: enrolledCourses });
  } catch (error) {
    console.error('Student courses GET Error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data kursus siswa.' },
      { status: 500 }
    );
  }
}
