'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import CourseCard from '@/components/course/CourseCard';
import Button from '@/components/ui/Button';
import { Search, Filter, RotateCcw, BookOpen } from 'lucide-react';

function CoursesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get('level') || '');
  const [isLoading, setIsLoading] = useState(true);

  // Sinkronkan state lokal ketika parameter URL berubah (misal klik kategori di footer atau beranda)
  useEffect(() => {
    const urlQ = searchParams.get('q') || '';
    const urlCategory = searchParams.get('category') || '';
    const urlLevel = searchParams.get('level') || '';

    setQ(urlQ);
    setSelectedCategory(urlCategory);
    setSelectedLevel(urlLevel);
  }, [searchParams]);

  // Ambil daftar kategori sekali di awal
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
        }
      } catch (err) {
        console.error('Fetch categories error:', err);
      }
    }
    fetchCategories();
  }, []);

  // Ambil daftar kursus sesuai filter
  useEffect(() => {
    async function fetchCourses() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (q.trim()) params.set('q', q.trim());
        if (selectedCategory) params.set('category', selectedCategory);
        if (selectedLevel) params.set('level', selectedLevel);

        const res = await fetch(`/api/courses?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setCourses(data.courses || []);
        }
      } catch (err) {
        console.error('Fetch courses error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchCourses();
    }, 250);

    return () => clearTimeout(timer);
  }, [q, selectedCategory, selectedLevel]);

  const updateUrl = (searchQ, cat, lvl) => {
    const params = new URLSearchParams();
    if (searchQ && searchQ.trim()) params.set('q', searchQ.trim());
    if (cat) params.set('category', cat);
    if (lvl) params.set('level', lvl);
    const qs = params.toString();
    router.replace(qs ? `/courses?${qs}` : '/courses', { scroll: false });
  };

  const handleCategoryChange = (newCat) => {
    setSelectedCategory(newCat);
    updateUrl(q, newCat, selectedLevel);
  };

  const handleLevelChange = (newLvl) => {
    setSelectedLevel(newLvl);
    updateUrl(q, selectedCategory, newLvl);
  };

  const handleResetFilters = () => {
    setQ('');
    setSelectedCategory('');
    setSelectedLevel('');
    router.replace('/courses', { scroll: false });
  };

  const levels = [
    { label: 'Semua Level', value: '' },
    { label: 'Pemula', value: 'pemula' },
    { label: 'Menengah', value: 'menengah' },
    { label: 'Lanjutan', value: 'lanjutan' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
          Katalog Kursus Online
        </h1>
        <p className="text-slate-600 text-base mt-2">
          Jelajahi beragam materi terstruktur dari pengajar berpengalaman
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-10 space-y-6">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari berdasarkan judul materi atau topik kursus..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:bg-white text-base"
          />
        </div>

        {/* Filter Row: Kategori & Level */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pt-2 border-t border-slate-100">
          {/* Level Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
              Level:
            </span>
            {levels.map((lvl) => (
              <button
                key={lvl.value}
                onClick={() => handleLevelChange(lvl.value)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedLevel === lvl.value
                    ? 'bg-[#0F766E] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>

          {/* Kategori Dropdown & Reset */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-500" />
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
              >
                <option value="">Semua Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {(q || selectedCategory || selectedLevel) && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#B91C1C] hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filter</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-white border border-slate-200 rounded-2xl p-6 h-88 animate-pulse"
            />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Tidak ada kursus yang ditemukan</h3>
          <p className="text-slate-500 max-w-md mx-auto text-sm">
            Coba gunakan kata kunci pencarian yang berbeda atau hapus filter kategori dan level.
          </p>
          <Button variant="secondary" onClick={handleResetFilters} className="mt-2">
            Reset Semua Filter
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-sm font-semibold text-slate-500">
            Menampilkan <span className="text-[#0F766E] font-bold">{courses.length}</span> kursus tersedia
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CoursesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="p-12 text-center text-slate-500">Memuat katalog...</div>}>
          <CoursesContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
