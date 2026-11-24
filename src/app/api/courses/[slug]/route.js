import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const { slug } = await params;

    // Ambil data kursus beserta guru dan kategori
    const courseRes = await query(
      `SELECT c.id, c.teacher_id, c.category_id, c.title, c.slug, c.description, c.thumbnail_url,
              c.level, c.status, c.start_date, c.end_date, c.created_at, c.updated_at,
              u.name AS teacher_name, u.email AS teacher_email, u.bio AS teacher_bio, u.avatar_url AS teacher_avatar,
              cat.name AS category_name, cat.slug AS category_slug,
              COUNT(DISTINCT e.id)::int AS student_count
       FROM courses c
       JOIN users u ON c.teacher_id = u.id
       JOIN categories cat ON c.category_id = cat.id
       LEFT JOIN enrollments e ON c.id = e.course_id
       WHERE c.slug = $1
       GROUP BY c.id, u.name, u.email, u.bio, u.avatar_url, cat.name, cat.slug`,
      [slug]
    );

    if (courseRes.rows.length === 0) {
      return NextResponse.json(
        { error: 'Kursus tidak ditemukan.' },
        { status: 404 }
      );
    }

    const course = courseRes.rows[0];

    // Ambil daftar materi berurutan
    const materialsRes = await query(
      `SELECT id, title, order_number, created_at
       FROM materials
       WHERE course_id = $1
       ORDER BY order_number ASC`,
      [course.id]
    );

    const materials = materialsRes.rows;

    // Periksa status enrollment jika pengguna sudah login
    let enrollment = null;
    const currentUser = await getSessionUser();

    if (currentUser) {
      const enrollRes = await query(
        `SELECT id, enrolled_at, completed_at
         FROM enrollments
         WHERE student_id = $1 AND course_id = $2`,
        [currentUser.id, course.id]
      );

      if (enrollRes.rows.length > 0) {
        const enrollData = enrollRes.rows[0];

        // Ambil materi yang telah diselesaikan
        const progressRes = await query(
          `SELECT material_id, is_completed
           FROM material_progress
           WHERE enrollment_id = $1 AND is_completed = TRUE`,
          [enrollData.id]
        );

        const completedMaterialIds = progressRes.rows.map((r) => r.material_id);
        const totalMaterials = materials.length;
        const completedCount = completedMaterialIds.length;
        const progressPercentage = totalMaterials > 0 
          ? Math.round((completedCount / totalMaterials) * 100) 
          : 0;

        enrollment = {
          id: enrollData.id,
          enrolled_at: enrollData.enrolled_at,
          completed_at: enrollData.completed_at,
          is_enrolled: true,
          completed_material_ids: completedMaterialIds,
          completed_count: completedCount,
          total_materials: totalMaterials,
          progress_percentage: progressPercentage,
        };
      }
    }

    return NextResponse.json({
      course,
      materials,
      enrollment,
    });
  } catch (error) {
    console.error('Course detail API Error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil detail kursus.' },
      { status: 500 }
    );
  }
}
