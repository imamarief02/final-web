'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import CourseCard from '@/components/course/CourseCard';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import {
  Search,
  CheckCircle2,
  Users,
  Award,
  Sparkles,
  Layers,
  ArrowRight,
  Code,
  Palette,
  Database,
  Languages,
  Briefcase,
  Smile,
  PlayCircle,
  BookOpen,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [popularCourses, setPopularCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userCourses, setUserCourses] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [courseRes, catRes, authRes] = await Promise.all([
          fetch('/api/courses/popular'),
          fetch('/api/categories'),
          fetch('/api/auth/me'),
        ]);

        if (courseRes.ok) {
          const courseData = await courseRes.json();
          setPopularCourses(courseData.courses || []);
        }

        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData.categories || []);
        }

        if (authRes.ok) {
          const authData = await authRes.json();
          const currentUser = authData.user || null;
          setUser(currentUser);

          if (currentUser?.role === 'student') {
            try {
              const studentRes = await fetch('/api/student/courses');
              if (studentRes.ok) {
                const sData = await studentRes.json();
                setUserCourses(sData.courses || []);
              }
            } catch (err) {
              console.error('Student courses load error:', err);
            }
          }
        }
      } catch (err) {
        console.error('Home load error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/courses?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/courses');
    }
  };

  const getCategoryIcon = (slug) => {
    switch (slug) {
      case 'web-development':
        return <Code className="w-6 h-6 text-[#0F766E]" />;
      case 'ui-ux-design':
        return <Palette className="w-6 h-6 text-[#0F766E]" />;
      case 'data-science':
        return <Database className="w-6 h-6 text-[#0F766E]" />;
      case 'bahasa-asing':
        return <Languages className="w-6 h-6 text-[#0F766E]" />;
      case 'bisnis-karir':
        return <Briefcase className="w-6 h-6 text-[#0F766E]" />;
      default:
        return <Layers className="w-6 h-6 text-[#0F766E]" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/70 via-white to-[#F8FAFC] pt-3 sm:pt-6 pb-8 sm:pb-12 border-b border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              {/* Kolom Kiri: Teks & Form Pencarian */}
              <div className="lg:col-span-7 space-y-4 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-[#0F766E] text-xs font-bold shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>Platform Kursus Online Ramah Segala Usia</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0F172A] tracking-tight leading-tight">
                  Belajar Skill Baru,{' '}
                  <span className="text-[#0F766E] underline decoration-[#F59E0B] decoration-wavy decoration-2">
                    Selangkah Demi Selangkah
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                  Materi pembelajaran terstruktur yang disusun berurutan, indikator progres visual yang jelas, dan pengajar terverifikasi. Belajar jadi mudah dan menyenangkan!
                </p>

                {/* Search Bar Form */}
                <form
                  onSubmit={handleSearchSubmit}
                  className="p-1.5 sm:p-2 bg-white border-2 border-slate-200 rounded-2xl shadow-md shadow-teal-900/5 flex flex-col sm:flex-row items-center gap-2 max-w-xl focus-within:border-[#0F766E] transition-all"
                >
                  <div className="flex items-center gap-2.5 w-full px-3 py-1">
                    <Search className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari materi HTML, Tailwind, UI/UX..."
                      className="w-full bg-transparent text-[#0F172A] placeholder-slate-400 text-sm sm:text-base border-0 border-none outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 shadow-none"
                      style={{ outline: 'none', border: 'none', boxShadow: 'none' }}
                      suppressHydrationWarning
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="cta"
                    size="sm"
                    className="w-full sm:w-auto shrink-0 shadow-xs text-xs sm:text-sm py-2 px-4"
                    suppressHydrationWarning
                  >
                    Cari Kursus
                  </Button>
                </form>

                {/* Social Proof Badges */}
                <div className="pt-1 flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-600 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                    <span>Materi Berurutan & Praktis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#0F766E]" />
                    <span>Dipercaya 10.000+ Pelajar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#F59E0B]" />
                    <span>Sertifikat Resmi</span>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: Kartu Dinamis (Adaptif Status Login) */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-md">
                  {/* Decorative blur backdrop */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-teal-400 to-amber-300 rounded-3xl blur-2xl opacity-30 -z-10" />

                  {!user ? (
                    /* Kondisi 1: Belum Login (Guest) - Kartu Ajakan & Keunggulan Platform */
                    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-lg space-y-4 sm:space-y-5">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div>
                          <div className="text-base font-bold text-slate-800">Mulai Belajar Hari Ini</div>
                          <div className="text-xs text-slate-500">Platform ramah segala usia</div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                          100% Gratis
                        </span>
                      </div>

                      {/* Benefit Highlights */}
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                        <div className="flex items-start gap-2.5 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                          <span><strong className="text-slate-800">Materi Bertahap:</strong> Disusun berurutan dari level paling dasar.</span>
                        </div>
                        <div className="flex items-start gap-2.5 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                          <span><strong className="text-slate-800">Pantau Progres:</strong> Indikator belajar visual yang mudah dipahami.</span>
                        </div>
                        <div className="flex items-start gap-2.5 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                          <span><strong className="text-slate-800">Sertifikat Resmi:</strong> Bukti kelulusan setelah menuntaskan materi.</span>
                        </div>
                      </div>

                      {/* CTA Buttons */}
                      <div className="space-y-2 pt-0.5">
                        <Link
                          href="/register"
                          className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-[#F59E0B] hover:bg-amber-600 text-[#1C1917] font-bold text-sm shadow-sm transition-all group"
                        >
                          <span>Daftar Akun Gratis</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                          href="/courses"
                          className="flex items-center justify-center gap-1.5 w-full p-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-[#0F766E] font-bold text-xs transition-colors"
                        >
                          <span>Jelajahi Semua Kursus</span>
                        </Link>
                      </div>
                    </div>
                  ) : user.role === 'student' ? (
                    /* Kondisi 2: Login sebagai Siswa */
                    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-lg space-y-4 sm:space-y-5">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#CCFBF1] flex items-center justify-center text-[#0F766E]">
                            <Smile className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-800">Ruang Belajar Anda</div>
                            <div className="text-xs text-slate-500">Halo, {user.name} 👋</div>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-[#0F766E]">
                          Siswa
                        </span>
                      </div>

                      {userCourses.length > 0 ? (
                        <>
                          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                            <div className="flex justify-between items-center text-xs font-bold">
                              <span className="text-slate-800 line-clamp-1">{userCourses[0].title}</span>
                              <span className="text-[#0F766E] shrink-0 ml-2">
                                {userCourses[0].progress_percentage}%
                              </span>
                            </div>
                            <ProgressBar
                              percentage={userCourses[0].progress_percentage}
                              showLabel={false}
                              height="h-2"
                            />
                            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                              <span>
                                {userCourses[0].completed_materials} dari {userCourses[0].total_materials} materi selesai
                              </span>
                              {userCourses[0].progress_percentage === 100 ? (
                                <span className="text-[#15803D] font-bold">Lulus</span>
                              ) : userCourses[0].certificate_code ? (
                                <span className="text-amber-700 font-bold">Lulus (Ada Materi Baru)</span>
                              ) : null}
                            </div>
                          </div>

                          <div className="space-y-2 pt-0.5">
                            <Link
                              href={`/learn/${userCourses[0].slug}/1`}
                              className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-[#0F766E] hover:bg-[#134E4A] text-white font-bold text-sm shadow-sm transition-all group"
                            >
                              <PlayCircle className="w-4 h-4" />
                              <span>
                                {userCourses[0].progress_percentage === 100
                                  ? 'Ulas Materi'
                                  : userCourses[0].certificate_code
                                  ? 'Pelajari Materi Baru'
                                  : 'Lanjutkan Belajar'}
                              </span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform ml-auto" />
                            </Link>
                            <Link
                              href="/dashboard/student"
                              className="flex items-center justify-center gap-1.5 w-full p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                            >
                              <span>Ke Dashboard Belajar</span>
                            </Link>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-center py-5">
                            <BookOpen className="w-7 h-7 text-[#0F766E] mx-auto opacity-80" />
                            <p className="text-sm font-bold text-slate-800">Belum Ada Kursus Aktif</p>
                            <p className="text-xs text-slate-500">
                              Pilih topik yang Anda minati di katalog kursus dan mulai belajar langkah demi langkah.
                            </p>
                          </div>
                          <div className="space-y-2 pt-0.5">
                            <Link
                              href="/courses"
                              className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-[#0F766E] hover:bg-[#134E4A] text-white font-bold text-sm shadow-sm transition-all group"
                            >
                              <span>Pilih Kursus Sekarang</span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                              href="/dashboard/student"
                              className="flex items-center justify-center gap-1.5 w-full p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                            >
                              <span>Ke Dashboard Siswa</span>
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    /* Kondisi 3: Login sebagai Pengajar / Admin */
                    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-lg space-y-4 sm:space-y-5">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#CCFBF1] flex items-center justify-center text-[#0F766E]">
                            <Smile className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-800">
                              {user.role === 'teacher' ? 'Panel Pengajar' : 'Panel Administrator'}
                            </div>
                            <div className="text-xs text-slate-500">Halo, {user.name} 👋</div>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 capitalize">
                          {user.role}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {user.role === 'teacher'
                            ? 'Kelola materi pembelajaran Anda, terbitkan kursus baru, dan pantau perkembangan siswa.'
                            : 'Kelola verifikasi pengajar, kurasi kategori, pantau seluruh kursus dan statistik platform.'}
                        </p>
                      </div>

                      <div className="space-y-2 pt-0.5">
                        <Link
                          href={user.role === 'teacher' ? '/dashboard/teacher' : '/dashboard/admin'}
                          className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-[#0F766E] hover:bg-[#134E4A] text-white font-bold text-sm shadow-sm transition-all group"
                        >
                          <span>Buka Dashboard {user.role === 'teacher' ? 'Pengajar' : 'Admin'}</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION KATEGORI */}
        <section className="py-16 bg-white border-b border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                  Kategori Kursus Pilihan
                </h2>
                <p className="text-slate-600 text-sm sm:text-base mt-1">
                  Pilih bidang keterampilan yang ingin Anda pelajari hari ini
                </p>
              </div>
              <Link
                href="/courses"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0F766E] hover:underline"
              >
                <span>Lihat Semua Kategori</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/courses?category=${cat.slug}`}
                  className="group p-5 rounded-2xl bg-[#CCFBF1]/50 border border-teal-200/70 hover:bg-[#CCFBF1] hover:border-teal-300 hover:shadow-md transition-all duration-200 flex flex-col items-center text-center space-y-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    {getCategoryIcon(cat.slug)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-800 group-hover:text-[#0F766E]">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {cat.course_count || 0} Kursus
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5 KURSUS TERPOPULER */}
        <section className="py-20 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0F766E] mb-2">
                  <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                  <span>Rekomendasi Terbaik</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                  5 Kursus Terpopuler Saat Ini
                </h2>
                <p className="text-slate-600 text-sm sm:text-base mt-1">
                  Kursus dengan jumlah peminat terbanyak dan ulasan positif
                </p>
              </div>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-[#0F766E] text-[#0F766E] font-bold hover:bg-[#0F766E] hover:text-white transition-all text-sm"
              >
                <span>Buka Katalog Lengkap</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white border border-slate-200 rounded-2xl p-6 h-80 animate-pulse" />
                ))}
              </div>
            ) : popularCourses.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
                <p className="text-slate-500">Belum ada kursus yang dipublikasikan.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {popularCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SECTION KEUNGGULAN (Hanya untuk pengunjung yang belum login) */}
        {!isLoading && !user && (
          <section className="py-20 bg-white border-y border-slate-200/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                  Kenapa Memilih KursusDeh?
                </h2>
                <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
                  Platform pembelajaran yang dirancang khusus agar belajar tidak lagi membingungkan, ramah bagi pemula, anak-anak, hingga lansia.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Pilar 1 */}
                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-teal-300 hover:shadow-lg transition-all duration-200">
                  <div className="w-14 h-14 rounded-2xl bg-[#0F766E] text-white flex items-center justify-center shadow-md mb-6">
                    <Layers className="w-7 h-7 text-[#F59E0B]" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">
                    1. Materi Belajar Bertahap
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Setiap materi disusun secara terurut dengan nomor bab yang jelas. Siswa tidak akan tersesat dan dapat mengikuti kurikulum langkah demi langkah.
                  </p>
                </div>

                {/* Pilar 2 */}
                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-teal-300 hover:shadow-lg transition-all duration-200">
                  <div className="w-14 h-14 rounded-2xl bg-[#0F766E] text-white flex items-center justify-center shadow-md mb-6">
                    <CheckCircle2 className="w-7 h-7 text-[#F59E0B]" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">
                    2. Progres Belajar Visual Jelas
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Lacak pencapaian belajar Anda setiap saat dengan progress bar interaktif dan tombol &quot;Tandai Selesai&quot; untuk memotivasi penyelesaian kursus.
                  </p>
                </div>

                {/* Pilar 3 */}
                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-teal-300 hover:shadow-lg transition-all duration-200">
                  <div className="w-14 h-14 rounded-2xl bg-[#0F766E] text-white flex items-center justify-center shadow-md mb-6">
                    <Award className="w-7 h-7 text-[#F59E0B]" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">
                    3. Pengajar Terverifikasi Admin
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Semua pengajar yang menerbitkan materi telah melalui proses kurasi dan persetujuan oleh tim admin untuk menjamin kualitas materi belajar.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION CTA BANNER (Hanya untuk pengunjung yang belum login) */}
        {!isLoading && !user && (
          <section className="py-20 bg-gradient-to-r from-[#0F766E] to-[#134E4A] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight">
                Siap Memulai Perjalanan Belajar Anda Sekarang?
              </h2>
              <p className="text-teal-100 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                Daftar gratis tanpa biaya tersembunyi. Bergabunglah dengan ribuan siswa lainnya dan pelajari keterampilan digital masa depan.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#F59E0B] hover:bg-amber-600 text-[#1C1917] font-bold text-lg shadow-lg shadow-amber-900/20 transition-all"
                >
                  Daftar Sebagai Siswa
                </Link>
                <Link
                  href="/register?role=teacher"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl border-2 border-white/80 text-white hover:bg-white hover:text-[#0F766E] font-bold text-lg transition-all"
                >
                  Gabung Menjadi Pengajar
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer user={user} />
    </div>
  );
}
