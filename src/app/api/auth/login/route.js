import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { comparePassword, createSession } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan kata sandi wajib diisi.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const userResult = await query(
      `SELECT id, name, email, password_hash, role, teacher_status, bio, avatar_url
       FROM users
       WHERE email = $1`,
      [normalizedEmail]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Email atau kata sandi tidak sesuai.' },
        { status: 401 }
      );
    }

    const user = userResult.rows[0];
    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Email atau kata sandi tidak sesuai.' },
        { status: 401 }
      );
    }

    // Buat sesi login baru
    await createSession(user.id);

    return NextResponse.json({
      success: true,
      message: 'Berhasil masuk.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        teacher_status: user.teacher_status,
        bio: user.bio,
        avatar_url: user.avatar_url,
      },
    });
  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server saat memproses login.' },
      { status: 500 }
    );
  }
}
