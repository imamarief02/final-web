import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const courseId = parseInt(id, 10);

    const { user, error, status } = await requireRole(['teacher', 'admin']);
    if (error) return NextResponse.json({ error }, { status });

    const checkRes = await query(`SELECT id, teacher_id, title FROM courses WHERE id = $1`, [courseId]);
    if (checkRes.rows.length === 0) {
      return NextResponse.json({ error: 'Kursus tidak ditemukan.' }, { status: 404 });
    }

    if (user.role !== 'admin' && checkRes.rows[0].teacher_id !== user.id) {
      return NextResponse.json({ error: 'Akses ditolak.' }, { status: 403 });
    }

    const materialsRes = await query(
      `SELECT id, course_id, title, content, order_number, created_at, updated_at
       FROM materials
       WHERE course_id = $1
       ORDER BY order_number ASC`,
      [courseId]
    );

    return NextResponse.json({
      course: checkRes.rows[0],
      materials: materialsRes.rows,
    });
  } catch (error) {
    console.error('Teacher materials GET Error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil materi kursus.' },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const courseId = parseInt(id, 10);

    const { user, error, status } = await requireRole(['teacher', 'admin']);
    if (error) return NextResponse.json({ error }, { status });

    const checkRes = await query(`SELECT id, teacher_id FROM courses WHERE id = $1`, [courseId]);
    if (checkRes.rows.length === 0) {
      return NextResponse.json({ error: 'Kursus tidak ditemukan.' }, { status: 404 });
    }

    if (user.role !== 'admin' && checkRes.rows[0].teacher_id !== user.id) {
      return NextResponse.json({ error: 'Akses ditolak.' }, { status: 403 });
    }

    const { title, content, orderNumber } = await request.json();

    if (!title || !content || orderNumber === undefined) {
      return NextResponse.json(
        { error: 'Judul, isi materi, dan nomor urut wajib diisi.' },
        { status: 400 }
      );
    }

    const parsedOrder = parseInt(orderNumber, 10);
    if (isNaN(parsedOrder) || parsedOrder <= 0) {
      return NextResponse.json(
        { error: 'Nomor urut harus berupa angka positif lebih dari 0.' },
        { status: 400 }
      );
    }

    // Cek keunikan order_number pada kursus ini (BR-04)
    const duplicateCheck = await query(
      `SELECT id FROM materials WHERE course_id = $1 AND order_number = $2`,
      [courseId, parsedOrder]
    );

    if (duplicateCheck.rows.length > 0) {
      return NextResponse.json(
        { error: `Nomor urut ${parsedOrder} sudah digunakan pada kursus ini. Silakan gunakan nomor lain.` },
        { status: 409 }
      );
    }

    const insertRes = await query(
      `INSERT INTO materials (course_id, title, content, order_number)
       VALUES ($1, $2, $3, $4)
       RETURNING id, course_id, title, order_number, created_at`,
      [courseId, title.trim(), content.trim(), parsedOrder]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Materi berhasil ditambahkan.',
        material: insertRes.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Teacher materials POST Error:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan materi kursus.' },
      { status: 500 }
    );
  }
}
