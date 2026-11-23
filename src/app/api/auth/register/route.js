import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword, createSession } from '@/lib/auth';

export async function POST(request) {
  try {
    const { name, email, password, role = 'student', bio = '' } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nama, email, dan kata sandi wajib diisi.' },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 100) {
      return NextResponse.json(
        { error: 'Nama harus memiliki panjang antara 2 hingga 100 karakter.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail) || normalizedEmail.length > 150) {
      return NextResponse.json(
        { error: 'Format email tidak valid atau terlalu panjang.' },
        { status: 400 }
      );
    }

    if (password.length < 6 || password.length > 100) {
      return NextResponse.json(
        { error: 'Kata sandi harus antara 6 hingga 100 karakter.' },
        { status: 400 }
      );
    }

    const trimmedBio = typeof bio === 'string' ? bio.trim() : '';
    if (trimmedBio.length > 500) {
      return NextResponse.json(
        { error: 'Bio maksimal 500 karakter.' },
        { status: 400 }
      );
    }

    // Pastikan peran hanya student atau teacher (admin hanya melalui seed)
    if (!['student', 'teacher'].includes(role)) {
      return NextResponse.json(
        { error: 'Peran pendaftaran tidak valid.' },
        { status: 400 }
      );
    }

    // Cek apakah email sudah terdaftar
    const existing = await query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar. Silakan gunakan email lain atau masuk.' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const teacherStatus = role === 'teacher' ? 'pending' : null;

    const result = await query(
      `INSERT INTO users (name, email, password_hash, role, teacher_status, bio)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, email, role, teacher_status, bio, created_at`,
      [name.trim(), normalizedEmail, passwordHash, role, teacherStatus, bio.trim() || null]
    );

    const newUser = result.rows[0];

    // Otomatis buat sesi login
    await createSession(newUser.id);

    return NextResponse.json(
      {
        success: true,
        message: role === 'teacher' 
          ? 'Pendaftaran berhasil! Akun pengajar Anda sedang menunggu peninjauan admin.'
          : 'Pendaftaran berhasil! Selamat datang di KursusDeh.',
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register API Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server saat mendaftar.' },
      { status: 500 }
    );
  }
}
