import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole } from '@/lib/auth';

// GET: Mengambil daftar pengajar (bisa difilter status)
export async function GET(request) {
  try {
    const { error, status } = await requireRole(['admin']);
    if (error) return NextResponse.json({ error }, { status });

    const { searchParams } = new URL(request.url);
    const teacherStatus = searchParams.get('status');

    let sql = `
      SELECT id, name, email, role, teacher_status, bio, avatar_url, approved_at, created_at
      FROM users
      WHERE role = 'teacher'
    `;
    const params = [];

    if (teacherStatus && ['pending', 'approved', 'rejected'].includes(teacherStatus)) {
      params.push(teacherStatus);
      sql += ` AND teacher_status = $1`;
    }

    sql += ` ORDER BY created_at DESC`;

    const result = await query(sql, params);

    return NextResponse.json({ teachers: result.rows });
  } catch (error) {
    console.error('Admin teachers GET Error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data pengajar.' },
      { status: 500 }
    );
  }
}

// PATCH: Menyetujui atau menolak pendaftaran pengajar (UC-20, FR-07)
export async function PATCH(request) {
  try {
    const { error, status } = await requireRole(['admin']);
    if (error) return NextResponse.json({ error }, { status });

    const { teacherId, newStatus } = await request.json();

    if (!teacherId || !['approved', 'rejected', 'pending'].includes(newStatus)) {
      return NextResponse.json(
        { error: 'ID pengajar dan status baru tidak valid.' },
        { status: 400 }
      );
    }

    let sql = '';
    let params = [];

    if (newStatus === 'approved') {
      sql = `
        UPDATE users
        SET teacher_status = 'approved',
            role = 'teacher',
            approved_at = NOW()
        WHERE id = $1
        RETURNING id, name, email, role, teacher_status, approved_at
      `;
      params = [teacherId];
    } else {
      sql = `
        UPDATE users
        SET teacher_status = $1
        WHERE id = $2
        RETURNING id, name, email, role, teacher_status, approved_at
      `;
      params = [newStatus, teacherId];
    }

    const updateRes = await query(sql, params);

    if (updateRes.rows.length === 0) {
      return NextResponse.json(
        { error: 'Data pengajar tidak ditemukan.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Status pengajar berhasil diubah menjadi ${newStatus}.`,
      teacher: updateRes.rows[0],
    });
  } catch (error) {
    console.error('Admin teachers PATCH Error:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui status pengajar.' },
      { status: 500 }
    );
  }
}

// DELETE: Menghapus akun pengajar
export async function DELETE(request) {
  try {
    const { error, status } = await requireRole(['admin']);
    if (error) return NextResponse.json({ error }, { status });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID pengajar wajib diisi.' }, { status: 400 });
    }

    const delRes = await query(
      `DELETE FROM users WHERE id = $1 AND role = 'teacher' RETURNING id, name, email`,
      [id]
    );

    if (delRes.rows.length === 0) {
      return NextResponse.json({ error: 'Pengajar tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Akun pengajar ${delRes.rows[0].name} berhasil dihapus.`,
    });
  } catch (error) {
    console.error('Admin teachers DELETE Error:', error);
    return NextResponse.json({ error: 'Gagal menghapus pengajar.' }, { status: 500 });
  }
}
