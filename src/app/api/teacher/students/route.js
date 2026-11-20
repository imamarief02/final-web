import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function GET() {
  try {
    const { user, error, status } = await requireRole(['teacher', 'admin']);
    if (error) return NextResponse.json({ error }, { status });

    const sql = `
      SELECT e.id AS enrollment_id, e.enrolled_at, e.completed_at,
             u.id AS student_id, u.name AS student_name, u.email AS student_email,
             c.id AS course_id, c.title AS course_title, c.slug AS course_slug,
             COUNT(DISTINCT m.id)::int AS total_materials,
             COUNT(DISTINCT mp.id) FILTER (WHERE mp.is_completed = TRUE)::int AS completed_materials
      FROM enrollments e
      JOIN users u ON e.student_id = u.id
      JOIN courses c ON e.course_id = c.id
      LEFT JOIN materials m ON c.id = m.course_id
      LEFT JOIN material_progress mp ON e.id = mp.enrollment_id
      WHERE c.teacher_id = $1
      GROUP BY e.id, u.id, c.id
      ORDER BY e.enrolled_at DESC
    `;

    const result = await query(sql, [user.id]);

    const students = result.rows.map((row) => {
      const total = row.total_materials || 0;
      const completed = row.completed_materials || 0;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      return {
        ...row,
        progress_percentage: percentage,
      };
    });

    return NextResponse.json({ students });
  } catch (error) {
    console.error('Teacher students GET Error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data siswa.' },
      { status: 500 }
    );
  }
}
