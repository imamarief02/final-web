import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const materialId = parseInt(id, 10);

    const { user, error, status } = await requireRole(['teacher', 'admin']);
    if (error) return NextResponse.json({ error }, { status });

    // Cek kepemilikan materi melalui course
    const matRes = await query(
      `SELECT m.id, m.course_id, m.order_number, c.teacher_id
       FROM materials m
       JOIN courses c ON m.course_id = c.id
       WHERE m.id = $1`,
      [materialId]
    );

    if (matRes.rows.length === 0) {
      return NextResponse.json({ error: 'Materi tidak ditemukan.' }, { status: 404 });
    }

    const mat = matRes.rows[0];

    if (user.role !== 'admin' && mat.teacher_id !== user.id) {
      return NextResponse.json(
        { error: 'Anda hanya dapat mengubah materi pada kursus Anda sendiri.' },
        { status: 403 }
      );
    }

    const { title, content, orderNumber } = await request.json();

    let newOrder = mat.order_number;
    if (orderNumber !== undefined) {
      newOrder = parseInt(orderNumber, 10);
      if (isNaN(newOrder) || newOrder <= 0) {
        return NextResponse.json(
          { error: 'Nomor urut harus berupa angka positif.' },
          { status: 400 }
        );
      }

      if (newOrder !== mat.order_number) {
        const dupCheck = await query(
          `SELECT id FROM materials WHERE course_id = $1 AND order_number = $2 AND id <> $3`,
          [mat.course_id, newOrder, materialId]
        );
        if (dupCheck.rows.length > 0) {
          return NextResponse.json(
            { error: `Nomor urut ${newOrder} sudah digunakan oleh materi lain.` },
            { status: 409 }
          );
        }
      }
    }

    const updateRes = await query(
      `UPDATE materials
       SET title = COALESCE($1, title),
           content = COALESCE($2, content),
           order_number = $3,
           updated_at = NOW()
       WHERE id = $4
       RETURNING id, course_id, title, order_number, updated_at`,
      [
        title ? title.trim() : null,
        content ? content.trim() : null,
        newOrder,
        materialId,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Materi berhasil diperbarui.',
      material: updateRes.rows[0],
    });
  } catch (error) {
    console.error('Update material API Error:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui materi.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const materialId = parseInt(id, 10);

    const { user, error, status } = await requireRole(['teacher', 'admin']);
    if (error) return NextResponse.json({ error }, { status });

    const matRes = await query(
      `SELECT m.id, c.teacher_id
       FROM materials m
       JOIN courses c ON m.course_id = c.id
       WHERE m.id = $1`,
      [materialId]
    );

    if (matRes.rows.length === 0) {
      return NextResponse.json({ error: 'Materi tidak ditemukan.' }, { status: 404 });
    }

    if (user.role !== 'admin' && matRes.rows[0].teacher_id !== user.id) {
      return NextResponse.json(
        { error: 'Anda hanya dapat menghapus materi pada kursus Anda sendiri.' },
        { status: 403 }
      );
    }

    await query(`DELETE FROM materials WHERE id = $1`, [materialId]);

    return NextResponse.json({
      success: true,
      message: 'Materi berhasil dihapus.',
    });
  } catch (error) {
    console.error('Delete material API Error:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus materi.' },
      { status: 500 }
    );
  }
}
