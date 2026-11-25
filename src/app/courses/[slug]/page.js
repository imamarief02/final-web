'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import ContactTeacherModal from '@/components/course/ContactTeacherModal';
import {
  Users,
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  Lock,
  PlayCircle,
  Award,
  Sparkles,
  AlertCircle,
  Mail,
  Calendar,
} from 'lucide-react';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  const [courseData, setCourseData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [courseRes, authRes] = await Promise.all([
          fetch(`/api/courses/${slug}`),
          fetch('/api/auth/me'),
        ]);

        if (courseRes.ok) {
          const cData = await courseRes.json();
          setCourseData(cData);
        } else {
          setCourseData(null);
        }

        if (authRes.ok) {
          const uData = await authRes.json();
          setCurrentUser(uData.user);
        }
      } catch (err) {
        console.error('Course detail fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) loadData();
  }, [slug]);

  const handleEnroll = async () => {
    if (!currentUser) {
      router.push(`/login?redirect=/courses/${slug}`);
      return;
    }

    setIsEnrolling(true);
    setEnrollError('');

    try {
      const res = await fetch(`/api/courses/${slug}/enroll`, {
        method: 'POST',
      });
      const data = await res.json();

      if (!res.ok) {
        setEnrollError(data.error || 'Gagal mendaftar kursus.');
        setIsEnrolling(false);
        return;
      }

      // Berhasil mendaftar, arahkan langsung ke materi pertama
      router.push(`/learn/${slug}/${data.firstMaterialOrder || 1}`);
    } catch (err) {
      setEnrollError('Terjadi kesalahan jaringan saat mendaftar.');
      setIsEnrolling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-page">
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-20 text-center text-slate-500">
          Memuat detail kursus...
        </div>
        <Footer />
      </div>
    );
  }

  if (!courseData || !courseData.course) {
    return (
      <div className="min-h-screen flex flex-col bg-page">
        <Navbar />
        <div className="flex-1 max-w-xl mx-auto px-4 py-24 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-danger mx-auto" />
          <h2 className="text-2xl font-bold text-slate-800">Kursus Tidak Ditemukan</h2>
          <p className="text-slate-600 text-sm">
            Kursus yang Anda cari mungkin telah dihapus atau belum dipublikasikan.
          </p>
          <Button variant="primary" onClick={() => router.push('/courses')}>
            Kembali ke Katalog
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const { course, materials = [], enrollment } = courseData;
  const isEnrolled = enrollment && enrollment.is_enrolled;
  const isTeacherOwner = currentUser && currentUser.role === 'teacher' && course.teacher_id === currentUser.id;

  const completedSet = new Set(enrollment?.completed_material_ids || []);
  const nextMat = materials.find((m) => !completedSet.has(m.id));
  const nextOrderNumber = nextMat ? nextMat.order_number : (materials[0]?.order_number || 1);

  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Navbar />

      <main className="flex-1">
        {/* Course Hero Banner */}
        <section className="bg-linear-to-b from-teal-900 to-primary-dark text-white py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 text-teal-200 hover:text-white text-sm font-semibold mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Katalog Kursus</span>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={course.level}>
                    Level {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                  </Badge>
                  <Badge variant="category">
                    {course.category_name}
                  </Badge>
                  {course.start_date && course.end_date ? (
                    <span className="px-3 py-1 bg-slate-900/60 border border-teal-300/30 rounded-full text-xs font-semibold text-teal-200 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>
                        {new Date(course.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - {new Date(course.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-slate-900/60 border border-teal-300/30 rounded-full text-xs font-semibold text-teal-200">
                      Akses Selamanya
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  {course.title}
                </h1>

                <p className="text-teal-100 text-base sm:text-lg leading-relaxed max-w-3xl">
                  {course.description}
                </p>

                {/* Course Meta Info */}
                <div className="flex flex-wrap items-center gap-6 pt-2 text-sm text-teal-100">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-accent" />
                    <span>{course.student_count || 0} Siswa Terdaftar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-teal-300" />
                    <span>{materials.length} Materi Pembelajaran</span>
                  </div>
                </div>

                {/* Pengajar */}
                <div className="flex items-center justify-between gap-4 pt-4 border-t border-teal-800/80 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-teal-800 text-teal-100 flex items-center justify-center font-bold text-lg border-2 border-teal-600">
                      {course.teacher_name ? course.teacher_name.charAt(0) : 'P'}
                    </div>
                    <div>
                      <div className="text-xs text-teal-300">Pengajar Kursus:</div>
                      <div className="font-bold text-white text-base">{course.teacher_name}</div>
                    </div>
                  </div>

                  {!isTeacherOwner && (
                    <button
                      type="button"
                      onClick={() => setShowContactModal(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-800/80 hover:bg-teal-700 text-teal-100 hover:text-white border border-teal-600/70 font-bold text-xs transition-colors cursor-pointer shadow-xs"
                    >
                      <Mail className="w-3.5 h-3.5 text-accent" />
                      <span>Hubungi Pengajar</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Action Card (Sisi Kanan) */}
              <div className="lg:col-span-4">
                <div className="bg-white text-slate-800 rounded-2xl p-6 sm:p-8 shadow-md border border-slate-300/80 space-y-6">
                  {course.thumbnail_url && (
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 -mt-2">
                      <Image
                        src={course.thumbnail_url}
                        alt={course.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 380px"
                        className="object-cover"
                        unoptimized={Boolean(course.thumbnail_url && !course.thumbnail_url.startsWith('/') && !course.thumbnail_url.includes('images.unsplash.com'))}
                      />
                    </div>
                  )}

                  {isEnrolled ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-primary">Anda Sudah Terdaftar</span>
                          <span className="text-emerald-700 font-extrabold">{enrollment.progress_percentage}%</span>
                        </div>
                        <ProgressBar percentage={enrollment.progress_percentage} showLabel={false} />
                        <p className="text-xs text-slate-600">
                          {enrollment.completed_count} dari {enrollment.total_materials} materi telah diselesaikan.
                        </p>
                      </div>

                      <Link
                        href={`/learn/${slug}/${nextOrderNumber}`}
                        className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all shadow-md text-base"
                      >
                        <PlayCircle className="w-5 h-5" />
                        <span>{enrollment.progress_percentage === 100 ? 'Ulas Materi' : 'Lanjutkan Belajar'}</span>
                      </Link>
                    </div>
                  ) : isTeacherOwner ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
                        Anda adalah pemilik kursus ini. Anda dapat mengelola materi dan memantau siswa melalui dashboard.
                      </div>
                      <Link
                        href="/dashboard/teacher"
                        className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all text-base"
                      >
                        Kelola Kursus Ini
                      </Link>
                    </div>
                  ) : currentUser?.role === 'teacher' ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
                        Anda sedang masuk dengan akun Pengajar. Pendaftaran kursus hanya berlaku untuk akun Siswa.
                      </div>
                      <Link
                        href="/dashboard/teacher"
                        className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all text-base"
                      >
                        Buka Dashboard Pengajar
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-center space-y-1">
                        <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                          Biaya Pendaftaran
                        </div>
                        <div className="text-3xl font-extrabold text-primary">GRATIS</div>
                        <div className="text-xs text-emerald-700 font-medium">Akses seumur hidup</div>
                      </div>

                      {enrollError && (
                        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-danger text-xs font-semibold">
                          {enrollError}
                        </div>
                      )}

                      {materials.length === 0 ? (
                        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs text-center font-medium">
                          Materi kursus sedang dipersiapkan oleh pengajar. Pendaftaran akan segera dibuka.
                        </div>
                      ) : (
                        <Button
                          variant="cta"
                          size="lg"
                          onClick={handleEnroll}
                          isLoading={isEnrolling}
                          className="w-full text-base font-bold shadow-md"
                        >
                          Ikuti Kursus Sekarang
                        </Button>
                      )}

                      <div className="space-y-2 pt-2 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-success" />
                          <span>Materi langkah demi langkah</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-success" />
                          <span>Forum diskusi interaktif</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-accent" />
                          <span>Sertifikat kelulusan resmi</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Silabus Materi Berurutan (PRD UC-06, BR-04) */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-8">
              {/* Tentang Kursus */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
                <h2 className="text-2xl font-bold text-text-main">Tentang Kursus</h2>
                <div className="text-slate-700 leading-relaxed space-y-3 text-base">
                  <p>{course.description}</p>
                </div>

                {course.teacher_bio && (
                  <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-teal-100 text-primary flex items-center justify-center font-bold text-xl shrink-0">
                        {course.teacher_name ? course.teacher_name.charAt(0) : 'P'}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-base">{course.teacher_name}</h4>
                        <p className="text-slate-600 text-sm mt-1">{course.teacher_bio}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowContactModal(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-primary rounded-xl text-xs font-bold transition-colors shrink-0 border border-slate-200 cursor-pointer"
                    >
                      <Mail className="w-4 h-4 text-primary" />
                      <span>Hubungi Pengajar</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Daftar Silabus Materi */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-text-main">Silabus Pembelajaran</h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Materi disusun berurutan dari dasar hingga mahir ({materials.length} Materi)
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-teal-50 text-primary border border-teal-200 rounded-full text-xs font-bold">
                    Berurutan
                  </span>
                </div>

                {materials.length === 0 ? (
                  <p className="text-slate-500 text-sm py-4">Materi belum diunggah oleh pengajar.</p>
                ) : (
                  <div className="space-y-3">
                    {materials.map((mat) => {
                      const isCompleted =
                        enrollment &&
                        enrollment.completed_material_ids &&
                        enrollment.completed_material_ids.includes(mat.id);

                      return (
                        <div
                          key={mat.id}
                          className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-300 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-primary text-sm shrink-0">
                              {mat.order_number}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 text-base">
                                {mat.title}
                              </h4>
                              <div className="text-xs text-slate-500">Bab ke-{mat.order_number}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {isEnrolled ? (
                              isCompleted ? (
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-success bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>Selesai</span>
                                </span>
                              ) : (
                                <Link
                                  href={`/learn/${slug}/${mat.order_number}`}
                                  className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-xl border border-teal-200 transition-colors"
                                >
                                  <PlayCircle className="w-4 h-4" />
                                  <span>Pelajari</span>
                                </Link>
                              )
                            ) : (
                              <div className="inline-flex items-center gap-1 text-xs text-slate-400">
                                <Lock className="w-4 h-4" />
                                <span>Terkunci</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Kolom Kanan: Keuntungan Kursus */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-lg text-slate-800">Yang Anda Dapatkan</h3>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                    <span>Akses seluruh materi tanpa batas waktu</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                    <span>Latihan dan materi teks terstruktur</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                    <span>Tanya jawab langsung di forum diskusi materi</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Award className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span>Sertifikat kelulusan digital setelah 100% selesai</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* MODAL DIALOG HUBUNGI PENGAJAR */}
      {course && (
        <ContactTeacherModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          teacherName={course.teacher_name}
          teacherEmail={course.teacher_email}
          courseTitle={course.title}
        />
      )}

      <Footer />
    </div>
  );
}
