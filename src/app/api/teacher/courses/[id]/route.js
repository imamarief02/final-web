import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const courseId = parseInt(id, 10);

    const { user, error, status } = await requireRole(['teacher', 'admin']);
    if (error) return NextResponse.json({ error }, { status });

    // Cek kepemilikan kursus (BR-02)
    const checkRes = await query(`SELECT id, teacher_id FROM courses WHERE id = $1`, [courseId]);
    if (checkRes.rows.length === 0) {
      return NextResponse.json({ error: 'Kursus tidak ditemukan.' }, { status: 404 });
    }

    if (user.role !== 'admin' && checkRes.rows[0].teacher_id !== user.id) {
      return NextResponse.json(
        { error: 'Anda hanya dapat mengubah kursus milik Anda sendiri.' },
        { status: 403 }
      );
    }

    const {
      title,
      description,
      categoryId,
      level,
      thumbnailUrl,
      status: courseStatus,
      startDate,
      endDate,
      teacherId,
    } = await request.json();

    if (level && !['pemula', 'menengah', 'lanjutan'].includes(level)) {
      return NextResponse.json(
        { error: 'Level kursus harus berupa pemula, menengah, atau lanjutan.' },
        { status: 400 }
      );
    }

    if (courseStatus && !['draft', 'published'].includes(courseStatus)) {
      return NextResponse.json(
        { error: 'Status kursus harus berupa draft atau published.' },
        { status: 400 }
      );
    }

    if (categoryId) {
      const catCheck = await query(`SELECT id FROM categories WHERE id = $1`, [categoryId]);
      if (catCheck.rows.length === 0) {
        return NextResponse.json(
          { error: 'Kategori yang dipilih tidak valid.' },
          { status: 400 }
        );
      }
    }

    if (title && title.trim().length > 150) {
      return NextResponse.json(
        { error: 'Judul kursus maksimal 150 karakter.' },
        { status: 400 }
      );
    }

    // Validasi Rentang Waktu Kursus (Jika diisi)
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return NextResponse.json(
          { error: 'Format tanggal mulai atau tanggal selesai tidak valid.' },
          { status: 400 }
        );
      }
      if (start > end) {
        return NextResponse.json(
          { error: 'Tanggal mulai tidak boleh lebih akhir daripada tanggal selesai kursus.' },
          { status: 400 }
        );
      }
    }

    // Jika admin mengubah guru pengajar
    let newTeacherId = checkRes.rows[0].teacher_id;
    if (user.role === 'admin' && teacherId) {
      const parsedTeacherId = parseInt(teacherId, 10);
      const tCheck = await query(`SELECT id FROM users WHERE id = $1 AND role IN ('teacher', 'admin')`, [parsedTeacherId]);
      if (tCheck.rows.length > 0) {
        newTeacherId = parsedTeacherId;
      }
    }

    const updateRes = await query(
      `UPDATE courses
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           category_id = COALESCE($3, category_id),
           level = COALESCE($4, level),
           thumbnail_url = COALESCE($5, thumbnail_url),
           status = COALESCE($6, status),
           start_date = $7,
           end_date = $8,
           teacher_id = $9,
           updated_at = NOW()
       WHERE id = $10
       RETURNING id, teacher_id, category_id, title, slug, level, status, start_date, end_date, updated_at`,
      [
        title ? title.trim() : null,
        description ? description.trim() : null,
        categoryId || null,
        level || null,
        thumbnailUrl !== undefined ? thumbnailUrl : null,
        courseStatus || null,
        startDate !== undefined ? (startDate || null) : null,
        endDate !== undefined ? (endDate || null) : null,
        newTeacherId,
        courseId,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Kursus berhasil diperbarui.',
      course: updateRes.rows[0],
    });
  } catch (error) {
    console.error('Update course API Error:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui kursus.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
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
      return NextResponse.json(
        { error: 'Anda hanya dapat menghapus kursus milik Anda sendiri.' },
        { status: 403 }
      );
    }

    await query(`DELETE FROM courses WHERE id = $1`, [courseId]);

    return NextResponse.json({
      success: true,
      message: 'Kursus berhasil dihapus.',
    });
  } catch (error) {
    console.error('Delete course API Error:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus kursus.' },
      { status: 500 }
    );
  }
}
