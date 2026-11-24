'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import ProgressBar from '@/components/ui/ProgressBar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import {
  User,
  Mail,
  Shield,
  BookOpen,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Calendar,
  X,
  PlayCircle,
  Users,
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  // Kunci scroll halaman belakang saat modal terbuka
  useEffect(() => {
    if (showWelcomeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showWelcomeModal]);

  useEffect(() => {
    let isMounted = true;
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile');
        if (!res.ok) {
          router.replace('/login');
          return;
        }

        const data = await res.json();
        if (isMounted) {
          setProfileData(data);
          // Jika akun pengajar baru disetujui dalam 24 jam terakhir, buka pop-up welcome alert
          if (data.user?.is_recent_approved) {
            setShowWelcomeModal(true);
          }
        }
      } catch (err) {
        console.error('Fetch profile error:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-page">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="flex items-center gap-3 text-slate-500 font-semibold">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span>Memuat informasi profil pengguna...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!profileData?.user) {
    return null;
  }

  const { user, enrolled_courses = [], taught_courses = [], students_progress = [] } = profileData;
  const isTeacherPending = user.teacher_status === 'pending';
  const isTeacherApproved = user.role === 'teacher' && user.teacher_status === 'approved';

  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Navbar />

      {/* POP-UP / ALERT WELCOME TEACHER (< 24 JAM SETELAH DI-APPROVE) */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border-2 border-amber-300 my-auto">
            <button
              onClick={() => setShowWelcomeModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Tutup Notifikasi"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
              <Sparkles className="w-8 h-8 animate-bounce" />
            </div>

            <div className="text-center space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 uppercase tracking-wider">
                Pengajar Terverifikasi
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Selamat Datang di Tim Pengajar, {user.name}! 🎉
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Permohonan akun Anda telah <strong>disetujui oleh Administrator</strong> dalam kurun waktu kurang dari 24 jam terakhir. Sekarang Anda memiliki akses penuh untuk membuat kursus baru, mengunggah modul materi berurutan, dan memantau progres belajar siswa Anda.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-primary font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Status akun: Aktif Mengajar ({new Date(user.approved_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })})</span>
            </div>

            <div className="flex gap-3">
              <Button
                variant="primary"
                onClick={() => {
                  setShowWelcomeModal(false);
                  router.push('/dashboard/teacher');
                }}
                className="w-full justify-center"
              >
                Buka Dashboard Pengajar
              </Button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* BANNER NOTIFIKASI PENDING TEACHER (JIKA MENDAFTAR GURU & BELUM DI-APPROVE) */}
        {isTeacherPending && (
          <div className="p-5 sm:p-6 rounded-3xl bg-amber-50 border-2 border-amber-300 text-amber-900 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-200 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm sm:text-base text-amber-950">
                    Akun Pengajar Anda Sedang Menunggu Verifikasi Admin
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-200 text-amber-900 uppercase">
                    Status: Pending
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                  Permohonan pendaftaran Anda sebagai pengajar telah diterima oleh sistem dan sedang ditinjau oleh Admin. Selama masa peninjauan, Anda dapat belajar dan mengakses kursus dengan hak akses Siswa.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* KARTU INFORMASI PENGGUNA */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-teal-600 to-teal-400 text-white font-extrabold text-3xl flex items-center justify-center shadow-lg shadow-teal-700/20">
                {user.name.charAt(0).toUpperCase()}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {user.name}
                  </h1>
                  <span
                    className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      user.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : user.role === 'teacher'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-teal-100 text-primary'
                    }`}
                  >
                    {user.role}
                  </span>
                  {user.teacher_status === 'approved' && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Terverifikasi</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>{user.email}</span>
                </div>

                <div className="text-xs text-slate-400 flex items-center gap-1 pt-0.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Bergabung sejak {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {user.role === 'admin' && (
                <Link href="/dashboard/admin" className="w-full sm:w-auto">
                  <Button variant="primary" className="w-full justify-center">
                    Dashboard Admin
                  </Button>
                </Link>
              )}
              {(user.role === 'teacher' && user.teacher_status === 'approved') && (
                <Link href="/dashboard/teacher" className="w-full sm:w-auto">
                  <Button variant="primary" className="w-full justify-center">
                    Dashboard Pengajar
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {user.bio && (
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Bio / Keahlian</h4>
              <p className="text-sm text-slate-700 leading-relaxed">{user.bio}</p>
            </div>
          )}
        </div>

        {/* TAMPILAN SISWA (STUDENT VIEW): KURSUS YANG DIIKUTI & PROGRESS */}
        {user.role === 'student' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <span>Kursus yang Saya Ikuti</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 text-primary font-bold border border-teal-200">
                    {enrolled_courses.length} Kursus
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Lacak kemajuan belajar Anda selangkah demi selangkah
                </p>
              </div>

              <Link href="/courses" className="text-xs font-bold text-primary hover:underline">
                Jelajahi Kursus Lain
              </Link>
            </div>

            {enrolled_courses.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <BookOpen className="w-6 h-6" />
                </div>
                <p className="text-sm text-slate-500">Anda belum mendaftar di kursus manapun saat ini.</p>
                <Link href="/courses">
                  <Button variant="cta" size="sm">Cari Kursus Sekarang</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolled_courses.map((c) => {
                  const isComplete = c.progress_percentage === 100;
                  const hasCertificate = Boolean(c.certificate_code);
                  const hasNewMaterials = hasCertificate && !isComplete;

                  return (
                    <div
                      key={c.enrollment_id}
                      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Badge variant="category">{c.category_name}</Badge>
                            <Badge variant={c.level}>{c.level}</Badge>
                          </div>

                          {isComplete ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shrink-0">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Lulus</span>
                            </span>
                          ) : hasNewMaterials ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 shrink-0">
                              <CheckCircle2 className="w-3 h-3 text-amber-600" />
                              <span>Lulus (Materi Baru)</span>
                            </span>
                          ) : null}
                        </div>

                        <h4 className="font-bold text-base text-slate-800 line-clamp-2 hover:text-primary transition-colors">
                          {c.course_title}
                        </h4>

                        <div className="text-xs text-slate-500 font-medium">
                          Pengajar: <span className="text-slate-700 font-semibold">{c.teacher_name}</span>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <ProgressBar percentage={c.progress_percentage} height="h-2" className="text-xs" />
                        <div className="flex justify-between items-center text-[11px] font-semibold text-slate-500">
                          <span>{c.completed_materials} dari {c.total_materials} Bab Selesai</span>
                          <div className="flex items-center gap-2">
                            {hasNewMaterials && (
                              <span className="text-amber-700 font-extrabold text-[11px] bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                Kurikulum diperbarui
                              </span>
                            )}
                            <span className="text-primary font-bold">{c.progress_percentage}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between gap-2">
                        {c.certificate_code ? (
                          <Link
                            href={`/certificate/${c.certificate_code}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200 hover:bg-emerald-100 transition-colors"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>Lihat Sertifikat</span>
                          </Link>
                        ) : (
                          <span className="text-[11px] text-slate-400">Sertifikat belum terbit</span>
                        )}

                        <Link
                          href={`/learn/${c.course_slug}/${c.next_order || 1}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-white bg-primary hover:bg-primary-dark px-3 py-1.5 rounded-xl transition-all shadow-xs ml-auto"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span>{isComplete ? 'Pelajari Ulang' : hasNewMaterials ? 'Pelajari Materi Baru' : 'Lanjutkan'}</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAMPILAN GURU (TEACHER VIEW): KURSUS YANG DIAJARKAN & PROGRESS SISWA */}
        {user.role === 'teacher' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-amber-500" />
                  <span>Kursus yang Diajarkan & Progres Siswa</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold border border-amber-200">
                    {taught_courses.length} Kursus
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Pantau kelas yang Anda asuh dan pencapaian belajar para murid
                </p>
              </div>

              <Link href="/dashboard/teacher">
                <Button variant="primary" size="sm">
                  Kelola di Dashboard
                </Button>
              </Link>
            </div>

            {/* TABEL PROGRES SISWA */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                Aktivitas Belajar Siswa Terbaru
              </h4>

              {students_progress.length === 0 ? (
                <p className="text-xs text-slate-400 py-4">Belum ada siswa yang mendaftar pada kursus Anda.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-700">
                    <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Nama Siswa</th>
                        <th className="py-3 px-4">Kursus</th>
                        <th className="py-3 px-4">Progres Materi</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {students_progress.slice(0, 10).map((sp) => (
                        <tr key={sp.enrollment_id} className="hover:bg-slate-50/50">
                          <td className="py-3.5 px-4 font-bold text-slate-800">
                            {sp.student_name}
                            <div className="text-xs text-slate-400 font-normal">{sp.student_email}</div>
                          </td>
                          <td className="py-3.5 px-4 text-xs font-medium text-slate-700">
                            {sp.course_title}
                          </td>
                          <td className="py-3.5 px-4 w-48">
                            <div className="space-y-1">
                              <ProgressBar percentage={sp.progress_percentage} height="h-1.5" showLabel={false} />
                              <div className="text-[11px] text-slate-500 font-semibold">
                                {sp.completed_materials} dari {sp.total_materials} Bab ({sp.progress_percentage}%)
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            {sp.progress_percentage === 100 ? (
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                                Lulus
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-primary">
                                Sedang Belajar
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
