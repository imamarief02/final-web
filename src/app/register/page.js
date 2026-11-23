'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Button from '@/components/ui/Button';
import { BookOpen, Lock, Mail, User, AlertCircle, CheckCircle2, Info } from 'lucide-react';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role') === 'teacher' ? 'teacher' : 'student';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(defaultRole);
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, bio }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Pendaftaran gagal. Periksa kembali data Anda.');
        setIsLoading(false);
        return;
      }

      // Berhasil daftar dan auto-login
      if (role === 'teacher') {
        router.push('/dashboard/teacher');
      } else {
        router.push('/dashboard/student');
      }
      router.refresh();
    } catch (err) {
      setError('Terjadi masalah jaringan. Silakan coba sesaat lagi.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg w-full mx-auto px-4 py-12">
      <div className="bg-white border border-slate-300/80 rounded-2xl p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white mx-auto shadow-md">
            <BookOpen className="w-7 h-7 text-accent" />
          </div>
          <h1 className="text-2xl font-extrabold text-text-main">Daftar Akun KursusDeh</h1>
          <p className="text-slate-500 text-sm">
            Mulai belajar atau bagikan keahlian Anda ke ribuan siswa
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-danger text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pilihan Peran */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Daftar Sebagai:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  role === 'student'
                    ? 'border-primary bg-teal-50/70 text-primary'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="font-bold text-sm">Siswa</div>
                <div className="text-xs text-slate-500 mt-0.5">Ingin belajar kursus</div>
              </button>

              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  role === 'teacher'
                    ? 'border-accent bg-amber-50/70 text-amber-900'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="font-bold text-sm">Pengajar</div>
                <div className="text-xs text-slate-500 mt-0.5">Membuat & mengajar</div>
              </button>
            </div>
          </div>

          {role === 'teacher' && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-start gap-2">
              <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <span>
                <strong>Catatan Admin:</strong> Akun pengajar akan ditinjau oleh admin terlebih dahulu sebelum dapat menerbitkan kursus ke katalog publik.
              </span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Budi Santoso"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-text-main placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-text-main placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Kata Sandi (Minimal 6 Karakter)
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-text-main placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white text-sm"
              />
            </div>
          </div>

          {role === 'teacher' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Bio / Bidang Keahlian
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tuliskan pengalaman mengajar atau bidang yang Anda kuasai..."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-text-main placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white text-sm"
              />
            </div>
          )}

          <Button
            type="submit"
            variant={role === 'teacher' ? 'cta' : 'primary'}
            size="lg"
            isLoading={isLoading}
            className="w-full font-bold shadow-md"
          >
            {role === 'teacher' ? 'Daftar Sebagai Pengajar' : 'Daftar Akun Belajar'}
          </Button>
        </form>

        <div className="text-center pt-2 text-sm text-slate-600">
          Sudah memiliki akun?{' '}
          <Link href="/login" className="font-bold text-primary hover:underline">
            Masuk Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <Suspense fallback={<div className="p-8 text-slate-500">Memuat form pendaftaran...</div>}>
          <RegisterForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
