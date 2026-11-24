import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function POST(request, { params }) {
  try {
    const { slug } = await params;
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Harap masuk terlebih dahulu untuk mengikuti kursus.' },
        { status: 401 }
      );
    }

    if (user.role !== 'student') {
      return NextResponse.json(
        { error: 'Hanya akun Siswa yang dapat mendaftar kursus.' },
        { status: 403 }
      );
    }

    // Ambil data kursus
    const courseRes = await query(
      `SELECT id, status, title FROM courses WHERE slug = $1`,
      [slug]
    );

    if (courseRes.rows.length === 0) {
      return NextResponse.json(
        { error: 'Kursus tidak ditemukan.' },
        { status: 404 }
      );
    }

    const course = courseRes.rows[0];

    if (course.status !== 'published') {
      return NextResponse.json(
        { error: 'Kursus ini belum dipublikasikan.' },
        { status: 400 }
      );
    }

    // Cek apakah sudah terdaftar
    const existing = await query(
      `SELECT id FROM enrollments WHERE student_id = $1 AND course_id = $2`,
      [user.id, course.id]
    );

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'Anda sudah terdaftar pada kursus ini.' },
        { status: 400 }
      );
    }

    // Cek apakah kursus sudah memiliki materi
    const firstMaterialRes = await query(
      `SELECT order_number FROM materials WHERE course_id = $1 ORDER BY order_number ASC LIMIT 1`,
      [course.id]
    );

    if (firstMaterialRes.rows.length === 0) {
      return NextResponse.json(
        { error: 'Kursus ini belum memiliki materi pembelajaran. Pendaftaran belum dibuka.' },
        { status: 400 }
      );
    }

    const firstOrderNumber = firstMaterialRes.rows[0].order_number;

    // Simpan pendaftaran
    const enrollRes = await query(
      `INSERT INTO enrollments (student_id, course_id)
       VALUES ($1, $2)
       RETURNING id, enrolled_at`,
      [user.id, course.id]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Pendaftaran kursus berhasil! Selamat belajar.',
        enrollmentId: enrollRes.rows[0].id,
        firstMaterialOrder: firstOrderNumber,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Enroll course API Error:', error);
    return NextResponse.json(
      { error: 'Gagal memproses pendaftaran kursus.' },
      { status: 500 }
    );
  }
}
