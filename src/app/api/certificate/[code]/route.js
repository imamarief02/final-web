import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { code } = await params;

    const result = await query(
      `SELECT cert.id, cert.certificate_code, cert.issued_at,
              u.name AS student_name,
              c.title AS course_title, c.slug AS course_slug,
              cat.name AS category_name,
              t.name AS teacher_name
       FROM certificates cert
       JOIN enrollments e ON cert.enrollment_id = e.id
       JOIN users u ON e.student_id = u.id
       JOIN courses c ON e.course_id = c.id
       JOIN categories cat ON c.category_id = cat.id
       JOIN users t ON c.teacher_id = t.id
       WHERE cert.certificate_code = $1`,
      [code.toUpperCase()]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Sertifikat tidak ditemukan atau kode tidak valid.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ certificate: result.rows[0] });
  } catch (error) {
    console.error('Certificate API Error:', error);
    return NextResponse.json(
      { error: 'Gagal memverifikasi sertifikat.' },
      { status: 500 }
    );
  }
}
