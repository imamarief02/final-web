import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const { courseSlug, orderNumber } = await params;
    const orderNum = parseInt(orderNumber, 10);

    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Harap masuk terlebih dahulu untuk mengakses materi.' },
        { status: 401 }
      );
    }

    // Ambil data kursus
    const courseRes = await query(
      `SELECT id, teacher_id, title, slug, status FROM courses WHERE slug = $1`,
      [courseSlug]
    );

    if (courseRes.rows.length === 0) {
      return NextResponse.json(
        { error: 'Kursus tidak ditemukan.' },
        { status: 404 }
      );
    }

    const course = courseRes.rows[0];

    // Jika status kursus bukan published, hanya admin dan guru pemilik yang diizinkan mengakses
    if (course.status !== 'published') {
      if (user.role !== 'admin' && (user.role !== 'teacher' || course.teacher_id !== user.id)) {
        return NextResponse.json(
          { error: 'Kursus ini belum dipublikasikan atau sedang ditinjau.' },
          { status: 403 }
        );
      }
    }

    // Otorisasi hak akses (PRD BR-09)
    let enrollment = null;
    if (user.role === 'student') {
      const enrollRes = await query(
        `SELECT id, completed_at FROM enrollments WHERE student_id = $1 AND course_id = $2`,
        [user.id, course.id]
      );
      if (enrollRes.rows.length === 0) {
        return NextResponse.json(
          { error: 'Anda harus mendaftar kursus ini terlebih dahulu.' },
          { status: 403 }
        );
      }
      enrollment = enrollRes.rows[0];
    } else if (user.role === 'teacher' && course.teacher_id !== user.id) {
      return NextResponse.json(
        { error: 'Pengajar hanya dapat mengakses materi pada kursus miliknya sendiri.' },
        { status: 403 }
      );
    }

    // Ambil materi saat ini
    const materialRes = await query(
      `SELECT id, title, content, order_number, created_at, updated_at
       FROM materials
       WHERE course_id = $1 AND order_number = $2`,
      [course.id, orderNum]
    );

    if (materialRes.rows.length === 0) {
      return NextResponse.json(
        { error: 'Materi tidak ditemukan.' },
        { status: 404 }
      );
    }

    const currentMaterial = materialRes.rows[0];

    // Ambil seluruh daftar materi untuk navigasi sidebar
    const allMaterialsRes = await query(
      `SELECT id, title, order_number
       FROM materials
       WHERE course_id = $1
       ORDER BY order_number ASC`,
      [course.id]
    );

    const allMaterials = allMaterialsRes.rows;

    // Progres belajar siswa
    let completedMaterialIds = [];
    let isCurrentCompleted = false;
    let progressPercentage = 0;
    let certificateCode = null;

    if (enrollment) {
      const progressRes = await query(
        `SELECT material_id, is_completed
         FROM material_progress
         WHERE enrollment_id = $1 AND is_completed = TRUE`,
        [enrollment.id]
      );

      completedMaterialIds = progressRes.rows.map((r) => r.material_id);
      isCurrentCompleted = completedMaterialIds.includes(currentMaterial.id);
      
      const totalCount = allMaterials.length;
      const completedCount = completedMaterialIds.length;
      progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

      // Cek apakah ada sertifikat
      const certRes = await query(
        `SELECT certificate_code FROM certificates WHERE enrollment_id = $1`,
        [enrollment.id]
      );
      if (certRes.rows.length > 0) {
        certificateCode = certRes.rows[0].certificate_code;
      }
    }

    // Navigasi prev dan next
    const currentIndex = allMaterials.findIndex((m) => m.order_number === orderNum);
    const prevMaterial = currentIndex > 0 ? allMaterials[currentIndex - 1] : null;
    const nextMaterial = currentIndex < allMaterials.length - 1 ? allMaterials[currentIndex + 1] : null;

    // Ambil forum diskusi untuk materi ini
    const discRes = await query(
      `SELECT d.id, d.material_id, d.user_id, d.parent_id, d.content, d.created_at,
              u.name AS user_name, u.role AS user_role
       FROM discussions d
       JOIN users u ON d.user_id = u.id
       WHERE d.material_id = $1
       ORDER BY d.created_at ASC`,
      [currentMaterial.id]
    );

    // Susun struktur diskusi bersarang (nested replies)
    const discussionMap = {};
    const discussions = [];

    discRes.rows.forEach((row) => {
      row.replies = [];
      discussionMap[row.id] = row;
      if (row.parent_id && discussionMap[row.parent_id]) {
        discussionMap[row.parent_id].replies.push(row);
      } else {
        discussions.push(row);
      }
    });

    return NextResponse.json({
      course,
      material: currentMaterial,
      allMaterials,
      prevMaterial,
      nextMaterial,
      completedMaterialIds,
      isCurrentCompleted,
      progressPercentage,
      certificateCode,
      discussions,
      userRole: user.role,
    });
  } catch (error) {
    console.error('Learn API Error:', error);
    return NextResponse.json(
      { error: 'Gagal memuat materi belajar.' },
      { status: 500 }
    );
  }
}
