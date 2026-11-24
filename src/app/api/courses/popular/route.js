import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const currentUser = await getSessionUser();

    const result = await query(
      `SELECT c.id, c.teacher_id, c.title, c.slug, c.description, c.thumbnail_url, c.level, c.created_at,
              c.start_date, c.end_date,
              u.name AS teacher_name,
              u.email AS teacher_email,
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
       GROUP BY c.id, u.name, u.email, cat.name, cat.slug
       ORDER BY student_count DESC, c.created_at DESC
       LIMIT 5`
    );

    let courses = result.rows;

    if (currentUser) {
      const userEnrollmentsRes = await query(
        `SELECT e.id AS enrollment_id, e.course_id,
                COUNT(mp.id) FILTER (WHERE mp.is_completed = TRUE)::int AS completed_materials,
                (SELECT MIN(order_number) FROM materials WHERE course_id = e.course_id AND id NOT IN (
                  SELECT material_id FROM material_progress WHERE enrollment_id = e.id AND is_completed = TRUE
                )) AS next_order
         FROM enrollments e
         LEFT JOIN material_progress mp ON e.id = mp.enrollment_id
         WHERE e.student_id = $1
         GROUP BY e.id, e.course_id`,
        [currentUser.id]
      );

      const enrollmentMap = new Map();
      userEnrollmentsRes.rows.forEach(item => {
        enrollmentMap.set(item.course_id, item);
      });

      courses = courses.map(course => {
        const enrollData = enrollmentMap.get(course.id);
        const isEnrolled = !!enrollData;
        const completed = enrollData ? enrollData.completed_materials : 0;
        const total = course.material_count || 0;
        const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        const nextOrder = enrollData?.next_order || 1;

        return {
          ...course,
          user_role: currentUser.role,
          is_owner: currentUser.id === course.teacher_id,
          is_enrolled: isEnrolled,
          completed_materials: completed,
          progress_percentage: progressPercentage,
          next_order: nextOrder,
        };
      });
    } else {
      courses = courses.map(course => ({
        ...course,
        user_role: 'guest',
        is_owner: false,
        is_enrolled: false,
        progress_percentage: 0,
        completed_materials: 0,
        next_order: 1,
      }));
    }

    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Popular courses API Error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil kursus terpopuler.' },
      { status: 500 }
    );
  }
}
