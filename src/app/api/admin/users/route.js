import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function GET() {
  try {
    const { error, status } = await requireRole(['admin']);
    if (error) return NextResponse.json({ error }, { status });

    const result = await query(
      `SELECT id, name, email, role, teacher_status, bio, created_at
       FROM users
       ORDER BY created_at DESC`
    );

    return NextResponse.json({ users: result.rows });
  } catch (error) {
    console.error('Admin users GET Error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data pengguna.' },
      { status: 500 }
    );
  }
}
