'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import {
  BookOpen,
  Award,
  CheckCircle2,
  PlayCircle,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function StudentDashboardPage() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStudentData() {
      try {
        const [authRes, coursesRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/student/courses'),
        ]);

        if (!authRes.ok) {
          router.replace('/login');
          return;
        }

        const authData = await authRes.json();
        setUser(authData.user);

        if (coursesRes.ok) {
          const coursesData = await coursesRes.json();
          setCourses(coursesData.courses || []);
        }
      } catch (err) {
        console.error('Student dashboard error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadStudentData();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-page">
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-24 text-center text-slate-500">
          Memuat data belajar Anda...
        </div>
        <Footer />
      </div>
    );
  }

  const completedCourses = courses.filter((c) => c.progress_percentage === 100 || c.certificate_code);
  const inProgressCourses = courses.filter((c) => c.progress_percentage < 100 && !c.certificate_code);
  const totalCertificates = courses.filter((c) => c.certificate_code).length;

  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Welcome Greeting Banner */}
        <div className="bg-linear-to-r from-primary to-primary-dark rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-800/80 text-teal-200 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Ruang Belajar Siswa</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Selamat Datang Kembali, {user?.name || 'Siswa'}!
            </h1>
            <p className="text-teal-100 text-sm sm:text-base max-w-xl">
              Terus tingkatkan keahlian Anda. Setiap langkah kecil membawa Anda lebih dekat pada keberhasilan.
            </p>
          </div>

          <Link href="/courses">
            <Button variant="cta" size="md" className="shadow-md whitespace-nowrap">
              Cari Kursus Baru
            </Button>
          </Link>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 text-primary flex items-center justify-center shrink-0">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-text-main">{courses.length}</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">Kursus Terdaftar</div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-success flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-text-main">{completedCourses.length}</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">Kursus Selesai</div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-accent flex items-center justify-center shrink-0">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-text-main">{totalCertificates}</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">Sertifikat Kelulusan</div>
            </div>
          </div>
        </div>

        {/* Section: Kursus yang Sedang Diikuti */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-text-main">
              Kursus yang Sedang Anda Pelajari
            </h2>
            <span className="text-xs font-bold text-slate-500">
              {courses.length} Kursus
            </span>
          </div>

          {courses.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">
                Anda Belum Mengikuti Kursus Apa Pun
              </h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                Pilih topik yang Anda minati di katalog kursus gratis kami dan mulai belajar langkah demi langkah.
              </p>
              <Link href="/courses" className="inline-block pt-2">
                <Button variant="primary">Buka Katalog Kursus</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((c) => {
                const isComplete = c.progress_percentage === 100;
                const hasCertificate = Boolean(c.certificate_code);
                const hasNewMaterials = hasCertificate && !isComplete;

                return (
                  <div
                    key={c.enrollment_id}
                    className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow space-y-6 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant={c.level}>{c.level}</Badge>
                          <Badge variant="category">{c.category_name}</Badge>
                        </div>
                        {isComplete ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-success bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Lulus</span>
                          </span>
                        ) : hasNewMaterials ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                            <span>Lulus (Ada Materi Baru)</span>
                          </span>
                        ) : null}
                      </div>

                      <h3 className="font-bold text-xl text-text-main line-clamp-2">
                        {c.title}
                      </h3>

                      <div className="text-xs text-slate-500">
                        Pengajar: <span className="font-semibold text-slate-700">{c.teacher_name}</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1.5 pt-2">
                        <ProgressBar percentage={c.progress_percentage} />
                        <div className="flex justify-between text-xs text-slate-500 font-medium">
                          <span>
                            {c.completed_materials} dari {c.total_materials} materi selesai
                          </span>
                          {hasNewMaterials && (
                            <span className="text-amber-700 font-semibold text-[11px]">
                              Kurikulum diperbarui
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      <Link
                        href={`/learn/${c.slug}/${c.next_order || 1}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-sm transition-all"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>{isComplete ? 'Ulas Materi' : hasNewMaterials ? 'Pelajari Materi Baru' : 'Lanjutkan Belajar'}</span>
                      </Link>

                      {c.certificate_code && (
                        <Link
                          href={`/certificate/${c.certificate_code}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3.5 py-2 rounded-xl border border-amber-200 transition-colors"
                          title="Lihat & Unduh Sertifikat Kelulusan"
                        >
                          <Award className="w-4 h-4 text-accent" />
                          <span>Sertifikat</span>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
