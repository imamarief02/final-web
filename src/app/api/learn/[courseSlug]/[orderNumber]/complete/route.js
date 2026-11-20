import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { query } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function POST(request, { params }) {
  try {
    const { courseSlug, orderNumber } = await params;
    const orderNum = parseInt(orderNumber, 10);

    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Harap masuk terlebih dahulu.' },
        { status: 401 }
      );
    }

    if (user.role !== 'student') {
      return NextResponse.json(
        { error: 'Hanya siswa yang dapat menandai progres belajar.' },
        { status: 403 }
      );
    }

    // Ambil data kursus dan enrollment
    const courseRes = await query(
      `SELECT c.id, e.id AS enrollment_id
       FROM courses c
       JOIN enrollments e ON c.id = e.course_id
       WHERE c.slug = $1 AND e.student_id = $2`,
      [courseSlug, user.id]
    );

    if (courseRes.rows.length === 0) {
      return NextResponse.json(
        { error: 'Anda belum terdaftar pada kursus ini.' },
        { status: 403 }
      );
    }

    const { id: courseId, enrollment_id: enrollmentId } = courseRes.rows[0];

    // Ambil material id
    const materialRes = await query(
      `SELECT id FROM materials WHERE course_id = $1 AND order_number = $2`,
      [courseId, orderNum]
    );

    if (materialRes.rows.length === 0) {
      return NextResponse.json(
        { error: 'Materi tidak ditemukan.' },
        { status: 404 }
      );
    }

    const materialId = materialRes.rows[0].id;

    // Catat / Perbarui progres materi (UC-08)
    await query(
      `INSERT INTO material_progress (enrollment_id, material_id, is_completed, completed_at)
       VALUES ($1, $2, TRUE, NOW())
       ON CONFLICT (enrollment_id, material_id)
       DO UPDATE SET is_completed = TRUE, completed_at = NOW()`,
      [enrollmentId, materialId]
    );

    // Hitung ulang progres (BR-05)
    const totalMaterialsRes = await query(
      `SELECT COUNT(id)::int AS total FROM materials WHERE course_id = $1`,
      [courseId]
    );
    const totalCount = totalMaterialsRes.rows[0].total;

    const completedMaterialsRes = await query(
      `SELECT COUNT(id)::int AS completed
       FROM material_progress
       WHERE enrollment_id = $1 AND is_completed = TRUE`,
      [enrollmentId]
    );
    const completedCount = completedMaterialsRes.rows[0].completed;

    const progressPercentage = totalCount > 0
      ? Math.round((completedCount / totalCount) * 100)
      : 0;

    let certificateCode = null;

    // Jika telah menyelesaikan 100% materi kursus
    if (completedCount >= totalCount && totalCount > 0) {
      // Tandai kursus selesai di tabel enrollments
      await query(
        `UPDATE enrollments SET completed_at = NOW() WHERE id = $1 AND completed_at IS NULL`,
        [enrollmentId]
      );

      // Cek apakah sudah memiliki sertifikat
      const certCheck = await query(
        `SELECT certificate_code FROM certificates WHERE enrollment_id = $1`,
        [enrollmentId]
      );

      if (certCheck.rows.length > 0) {
        certificateCode = certCheck.rows[0].certificate_code;
      } else {
        const randomCode = 'KD-' + crypto.randomBytes(4).toString('hex').toUpperCase();
        await query(
          `INSERT INTO certificates (enrollment_id, certificate_code)
           VALUES ($1, $2)
           ON CONFLICT (enrollment_id) DO NOTHING`,
          [enrollmentId, randomCode]
        );
        certificateCode = randomCode;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Materi berhasil ditandai selesai!',
      isCompleted: true,
      completedCount,
      totalCount,
      progressPercentage,
      certificateCode,
    });
  } catch (error) {
    console.error('Complete material API Error:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui progres materi.' },
      { status: 500 }
    );
  }
}
