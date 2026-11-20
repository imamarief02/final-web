import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function GET() {
  try {
    const { error, status } = await requireRole(['admin']);
    if (error) return NextResponse.json({ error }, { status });

    const sql = `
      SELECT c.id, c.title, c.slug, c.level, c.status, c.created_at,
             u.name AS teacher_name, u.email AS teacher_email,
             cat.name AS category_name,
             COUNT(DISTINCT e.id)::int AS student_count,
             COUNT(DISTINCT m.id)::int AS material_count
      FROM courses c
      JOIN users u ON c.teacher_id = u.id
      JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN enrollments e ON c.id = e.course_id
      LEFT JOIN materials m ON c.id = m.course_id
      GROUP BY c.id, u.name, u.email, cat.name
      ORDER BY c.created_at DESC
    `;

    const result = await query(sql);
    return NextResponse.json({ courses: result.rows });
  } catch (error) {
    console.error('Admin courses GET Error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data seluruh kursus.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const { error, status } = await requireRole(['admin']);
    if (error) return NextResponse.json({ error }, { status });

    const { courseId, newStatus } = await request.json();

    if (!courseId || !['draft', 'published'].includes(newStatus)) {
      return NextResponse.json(
        { error: 'ID kursus dan status baru tidak valid.' },
        { status: 400 }
      );
    }

    const updateRes = await query(
      `UPDATE courses
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, title, status, updated_at`,
      [newStatus, courseId]
    );

    if (updateRes.rows.length === 0) {
      return NextResponse.json({ error: 'Kursus tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Status kursus berhasil diubah menjadi ${newStatus}.`,
      course: updateRes.rows[0],
    });
  } catch (error) {
    console.error('Admin courses PATCH Error:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui status kursus.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { error, status } = await requireRole(['admin']);
    if (error) return NextResponse.json({ error }, { status });

    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'), 10);

    if (!id) {
      return NextResponse.json({ error: 'ID kursus wajib disertakan.' }, { status: 400 });
    }

    await query(`DELETE FROM courses WHERE id = $1`, [id]);

    return NextResponse.json({
      success: true,
      message: 'Kursus berhasil dihapus oleh admin.',
    });
  } catch (error) {
    console.error('Admin courses DELETE Error:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus kursus.' },
      { status: 500 }
    );
  }
}
