import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function GET() {
  try {
    const { error, status } = await requireRole(['admin']);
    if (error) return NextResponse.json({ error }, { status });

    const [
      userStats,
      courseStats,
      enrollmentStats,
      certStats,
    ] = await Promise.all([
      query(`
        SELECT 
          COUNT(id)::int AS total_users,
          COUNT(id) FILTER (WHERE role = 'teacher')::int AS total_teachers,
          COUNT(id) FILTER (WHERE role = 'teacher' AND teacher_status = 'pending')::int AS pending_teachers,
          COUNT(id) FILTER (WHERE role = 'student')::int AS total_students
        FROM users
      `),
      query(`
        SELECT 
          COUNT(id)::int AS total_courses,
          COUNT(id) FILTER (WHERE status = 'published')::int AS published_courses,
          COUNT(id) FILTER (WHERE status = 'draft')::int AS draft_courses
        FROM courses
      `),
      query(`
        SELECT 
          COUNT(id)::int AS total_enrollments,
          COUNT(id) FILTER (WHERE completed_at IS NOT NULL)::int AS completed_enrollments
        FROM enrollments
      `),
      query(`
        SELECT COUNT(id)::int AS total_certificates FROM certificates
      `),
    ]);

    return NextResponse.json({
      stats: {
        ...userStats.rows[0],
        ...courseStats.rows[0],
        ...enrollmentStats.rows[0],
        ...certStats.rows[0],
      },
    });
  } catch (error) {
    console.error('Admin stats GET Error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil statistik platform.' },
      { status: 500 }
    );
  }
}
