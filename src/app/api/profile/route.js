import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Harap masuk terlebih dahulu.' }, { status: 401 });
    }

    const userRes = await query(
      `SELECT id, name, email, role, teacher_status, bio, avatar_url, approved_at, created_at,
              CASE 
                WHEN approved_at IS NOT NULL AND approved_at >= NOW() - INTERVAL '24 hours' THEN TRUE
                ELSE FALSE
              END AS is_recent_approved
       FROM users 
       WHERE id = $1`,
      [user.id]
    );

    if (userRes.rows.length === 0) {
      return NextResponse.json({ error: 'Pengguna tidak ditemukan.' }, { status: 404 });
    }

    const userData = userRes.rows[0];

    // Data Kursus yang diikuti (Sebagai Siswa)
    const enrollmentsRes = await query(
      `SELECT e.id AS enrollment_id, e.enrolled_at, e.completed_at,
              c.id AS course_id, c.title AS course_title, c.slug AS course_slug,
              c.thumbnail_url, c.level, cat.name AS category_name,
              u.name AS teacher_name,
              COUNT(DISTINCT m.id)::int AS total_materials,
              COUNT(DISTINCT mp.id) FILTER (WHERE mp.is_completed = TRUE)::int AS completed_materials,
              cert.certificate_code,
              (SELECT MIN(order_number) FROM materials WHERE course_id = c.id AND id NOT IN (
                SELECT material_id FROM material_progress WHERE enrollment_id = e.id AND is_completed = TRUE
              )) AS next_order
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       JOIN users u ON c.teacher_id = u.id
       JOIN categories cat ON c.category_id = cat.id
       LEFT JOIN materials m ON c.id = m.course_id
       LEFT JOIN material_progress mp ON e.id = mp.enrollment_id
       LEFT JOIN certificates cert ON e.id = cert.enrollment_id
       WHERE e.student_id = $1
       GROUP BY e.id, c.id, cat.name, u.name, cert.certificate_code
       ORDER BY e.enrolled_at DESC`,
      [user.id]
    );

    const enrolledCourses = enrollmentsRes.rows.map(item => {
      const total = item.total_materials || 0;
      const completed = item.completed_materials || 0;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
      return {
        ...item,
        progress_percentage: progress,
        next_order: item.next_order || 1,
      };
    });

    // Data Kursus yang Diajarkan (Khusus Pengajar)
    let taughtCourses = [];
    let studentsProgress = [];

    if (userData.role === 'teacher') {
      const taughtRes = await query(
        `SELECT c.id, c.title, c.slug, c.level, c.status, c.start_date, c.end_date, c.created_at,
                cat.name AS category_name,
                COUNT(DISTINCT e.id)::int AS student_count,
                COUNT(DISTINCT m.id)::int AS material_count
         FROM courses c
         JOIN categories cat ON c.category_id = cat.id
         LEFT JOIN enrollments e ON c.id = e.course_id
         LEFT JOIN materials m ON c.id = m.course_id
         WHERE c.teacher_id = $1
         GROUP BY c.id, cat.name
         ORDER BY c.created_at DESC`,
        [user.id]
      );
      taughtCourses = taughtRes.rows;

      const progressRes = await query(
        `SELECT e.id AS enrollment_id, e.enrolled_at, e.completed_at,
                u.id AS student_id, u.name AS student_name, u.email AS student_email,
                c.id AS course_id, c.title AS course_title,
                COUNT(DISTINCT m.id)::int AS total_materials,
                COUNT(DISTINCT mp.id) FILTER (WHERE mp.is_completed = TRUE)::int AS completed_materials
         FROM enrollments e
         JOIN users u ON e.student_id = u.id
         JOIN courses c ON e.course_id = c.id
         LEFT JOIN materials m ON c.id = m.course_id
         LEFT JOIN material_progress mp ON e.id = mp.enrollment_id
         WHERE c.teacher_id = $1
         GROUP BY e.id, u.id, c.id
         ORDER BY e.enrolled_at DESC`,
        [user.id]
      );

      studentsProgress = progressRes.rows.map(item => {
        const total = item.total_materials || 0;
        const completed = item.completed_materials || 0;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
        return {
          ...item,
          progress_percentage: progress,
        };
      });
    }

    return NextResponse.json({
      user: userData,
      enrolled_courses: enrolledCourses,
      taught_courses: taughtCourses,
      students_progress: studentsProgress,
    });
  } catch (error) {
    console.error('Profile GET Error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data profil.' },
      { status: 500 }
    );
  }
}
