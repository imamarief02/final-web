import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function POST(request, { params }) {
  try {
    const { courseSlug, orderNumber } = await params;
    const orderNum = parseInt(orderNumber, 10);

    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Harap masuk terlebih dahulu untuk berdiskusi.' },
        { status: 401 }
      );
    }

    const { content, parentId = null } = await request.json();

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Pesan diskusi tidak boleh kosong.' },
        { status: 400 }
      );
    }

    const trimmedContent = content.trim();
    if (trimmedContent.length > 1000) {
      return NextResponse.json(
        { error: 'Pesan diskusi maksimal 1000 karakter.' },
        { status: 400 }
      );
    }

    // Ambil materi id dan info kursus
    const materialRes = await query(
      `SELECT m.id, m.course_id, c.teacher_id, c.status
       FROM materials m
       JOIN courses c ON m.course_id = c.id
       WHERE c.slug = $1 AND m.order_number = $2`,
      [courseSlug, orderNum]
    );

    if (materialRes.rows.length === 0) {
      return NextResponse.json(
        { error: 'Materi tidak ditemukan.' },
        { status: 404 }
      );
    }

    const material = materialRes.rows[0];
    const materialId = material.id;
    const courseId = material.course_id;

    // Validasi otorisasi hak akses ke forum diskusi kursus
    if (user.role === 'student') {
      const enrollRes = await query(
        `SELECT id FROM enrollments WHERE student_id = $1 AND course_id = $2`,
        [user.id, courseId]
      );
      if (enrollRes.rows.length === 0 || material.status !== 'published') {
        return NextResponse.json(
          { error: 'Anda harus terdaftar pada kursus ini untuk berpartisipasi dalam diskusi.' },
          { status: 403 }
        );
      }
    } else if (user.role === 'teacher' && material.teacher_id !== user.id) {
      return NextResponse.json(
        { error: 'Pengajar hanya dapat berdiskusi pada kursus miliknya sendiri.' },
        { status: 403 }
      );
    }

    // Jika membalas diskusi (parent), pastikan parent_id valid
    if (parentId) {
      const parentCheck = await query(
        `SELECT id FROM discussions WHERE id = $1 AND material_id = $2`,
        [parentId, materialId]
      );
      if (parentCheck.rows.length === 0) {
        return NextResponse.json(
          { error: 'Diskusi induk tidak ditemukan.' },
          { status: 404 }
        );
      }
    }

    const insertRes = await query(
      `INSERT INTO discussions (material_id, user_id, parent_id, content)
       VALUES ($1, $2, $3, $4)
       RETURNING id, material_id, user_id, parent_id, content, created_at`,
      [materialId, user.id, parentId || null, trimmedContent]
    );

    const newDisc = insertRes.rows[0];

    return NextResponse.json(
      {
        success: true,
        message: 'Pesan berhasil dikirim.',
        discussion: {
          ...newDisc,
          user_name: user.name,
          user_role: user.role,
          replies: [],
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Discussion post API Error:', error);
    return NextResponse.json(
      { error: 'Gagal mengirim pesan diskusi.' },
      { status: 500 }
    );
  }
}
