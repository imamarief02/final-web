'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import {
  Users,
  BookOpen,
  CheckCircle2,
  XCircle,
  Award,
  Layers,
  Trash2,
  Edit,
  Plus,
  ShieldCheck,
  AlertCircle,
  Eye,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Active Tab: 'teachers' | 'categories' | 'courses' | 'users'
  const [activeTab, setActiveTab] = useState('teachers');

  // Modal Kategori
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCatId, setEditingCatId] = useState(null);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catError, setCatError] = useState('');

  const refreshAdminData = async () => {
    try {
      const [statsRes, teachersRes, catRes, coursesRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/teachers'),
        fetch('/api/admin/categories'),
        fetch('/api/admin/courses'),
        fetch('/api/admin/users'),
      ]);

      if (statsRes.ok) setStats((await statsRes.json()).stats);
      if (teachersRes.ok) setTeachers((await teachersRes.json()).teachers || []);
      if (catRes.ok) setCategories((await catRes.json()).categories || []);
      if (coursesRes.ok) setCourses((await coursesRes.json()).courses || []);
      if (usersRes.ok) setUsers((await usersRes.json()).users || []);
    } catch (err) {
      console.error('Admin refresh error:', err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function init() {
      try {
        const [authRes, statsRes, teachersRes, catRes, coursesRes, usersRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/admin/stats'),
          fetch('/api/admin/teachers'),
          fetch('/api/admin/categories'),
          fetch('/api/admin/courses'),
          fetch('/api/admin/users'),
        ]);

        if (!authRes.ok) {
          router.replace('/login');
          return;
        }

        const authData = await authRes.json();
        if (authData.user?.role !== 'admin') {
          router.replace('/dashboard');
          return;
        }

        if (isMounted) {
          if (statsRes.ok) setStats((await statsRes.json()).stats);
          if (teachersRes.ok) setTeachers((await teachersRes.json()).teachers || []);
          if (catRes.ok) setCategories((await catRes.json()).categories || []);
          if (coursesRes.ok) setCourses((await coursesRes.json()).courses || []);
          if (usersRes.ok) setUsers((await usersRes.json()).users || []);
        }
      } catch (err) {
        console.error('Admin data load error:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    init();
    return () => {
      isMounted = false;
    };
  }, [router]);

  // Handle Teacher Approve / Reject (FR-07, UC-20)
  const handleTeacherAction = async (teacherId, newStatus) => {
    try {
      const res = await fetch('/api/admin/teachers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherId, newStatus }),
      });

      if (res.ok) {
        await refreshAdminData();
      }
    } catch (err) {
      console.error('Teacher action error:', err);
    }
  };

  // Handle Teacher Delete
  const handleDeleteTeacher = async (teacherId, teacherName) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus akun pengajar "${teacherName}"?`)) return;
    try {
      const res = await fetch(`/api/admin/teachers?id=${teacherId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await refreshAdminData();
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal menghapus akun pengajar.');
      }
    } catch (err) {
      console.error('Delete teacher error:', err);
      alert('Terjadi kesalahan koneksi saat menghapus.');
    }
  };

  // Handle Category CRUD
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setCatError('');

    try {
      const url = '/api/admin/categories';
      const method = editingCatId ? 'PUT' : 'POST';
      const body = editingCatId
        ? { id: editingCatId, name: catName, description: catDesc }
        : { name: catName, description: catDesc };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setCatError(data.error || 'Gagal menyimpan kategori.');
        return;
      }

      setShowCategoryModal(false);
      setEditingCatId(null);
      setCatName('');
      setCatDesc('');
      await refreshAdminData();
    } catch (err) {
      setCatError('Gangguan jaringan saat menyimpan kategori.');
    }
  };

  const handleDeleteCategory = async (catId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kategori ini?')) return;
    try {
      const res = await fetch(`/api/admin/categories?id=${catId}`, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Gagal menghapus kategori.');
        return;
      }

      await refreshAdminData();
    } catch (err) {
      console.error('Delete category error:', err);
    }
  };

  // Handle Course Status Toggle
  const handleToggleCourseStatus = async (courseId, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, newStatus }),
      });

      if (res.ok) {
        await refreshAdminData();
      }
    } catch (err) {
      console.error('Course status toggle error:', err);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!confirm('Hapus kursus ini secara permanen dari platform?')) return;
    try {
      const res = await fetch(`/api/admin/courses?id=${courseId}`, { method: 'DELETE' });
      if (res.ok) {
        await refreshAdminData();
      }
    } catch (err) {
      console.error('Delete course error:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-24 text-center text-slate-500 font-medium">
          Memuat Panel Administrasi...
        </div>
        <Footer />
      </div>
    );
  }

  const pendingTeachers = teachers.filter((t) => t.teacher_status === 'pending');

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Header Admin */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-800 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
              <span>Pusat Kendali Sistem</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
              Dashboard Administrator KursusDeh
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold border border-amber-200">
              {pendingTeachers.length} Guru Menunggu Persetujuan
            </span>
          </div>
        </div>

        {/* METRICS STATS CARDS (FR-11) */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-[#0F766E] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                {stats.total_users || 0}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Total Pengguna ({stats.total_students || 0} Siswa, {stats.total_teachers || 0} Guru)
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#F59E0B] flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                {stats.total_courses || 0}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Total Kursus ({stats.published_courses || 0} Publik, {stats.draft_courses || 0} Draft)
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#15803D] flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                {stats.total_enrollments || 0}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Pendaftaran Belajar ({stats.completed_enrollments || 0} Lulus)
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                {stats.total_certificates || 0}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Sertifikat Diterbitkan
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-6 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('teachers')}
            className={`pb-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'teachers'
                ? 'border-[#0F766E] text-[#0F766E]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Verifikasi Pengajar ({pendingTeachers.length} Menunggu)
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`pb-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'categories'
                ? 'border-[#0F766E] text-[#0F766E]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Kelola Kategori ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`pb-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'courses'
                ? 'border-[#0F766E] text-[#0F766E]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Pengawasan Kursus ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'users'
                ? 'border-[#0F766E] text-[#0F766E]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Daftar Pengguna ({users.length})
          </button>
        </div>

        {/* TAB 1: VERIFIKASI PENGAJAR (FR-07, UC-20, BR-01) */}
        {activeTab === 'teachers' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="font-bold text-xl text-slate-800">
                  Antrean Verifikasi Calon Pengajar
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Calon pengajar memerlukan persetujuan sebelum dapat membuat dan menerbitkan kursus
                </p>
              </div>

              {pendingTeachers.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-50 text-center text-slate-500 text-sm">
                  Tidak ada permohonan pengajar yang berstatus pending.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingTeachers.map((t) => (
                    <div
                      key={t.id}
                      className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-base text-slate-800">{t.name}</span>
                          <Badge variant="pending">Pending</Badge>
                        </div>
                        <div className="text-xs text-slate-500">{t.email}</div>
                        <div className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-amber-100">
                          {t.bio || 'Tidak ada bio yang dilampirkan.'}
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          onClick={() => handleTeacherAction(t.id, 'rejected')}
                          className="px-3 py-1.5 rounded-xl border border-red-200 text-[#B91C1C] hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer"
                        >
                          Tolak
                        </button>
                        <button
                          onClick={() => handleTeacherAction(t.id, 'approved')}
                          className="px-4 py-1.5 rounded-xl bg-[#0F766E] hover:bg-[#134E4A] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
                        >
                          Setujui Akun
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Daftar Seluruh Pengajar */}
              <div className="pt-6 border-t border-slate-100 space-y-4">
                <h4 className="font-bold text-base text-slate-800">
                  Seluruh Pengajar Terdaftar ({teachers.length})
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-700">
                    <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                      <tr>
                        <th className="py-2.5 px-3">Nama</th>
                        <th className="py-2.5 px-3">Email</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Terdaftar</th>
                        <th className="py-2.5 px-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {teachers.map((t) => (
                        <tr key={t.id}>
                          <td className="py-2.5 px-3 font-semibold text-slate-800">{t.name}</td>
                          <td className="py-2.5 px-3 text-slate-500">{t.email}</td>
                          <td className="py-2.5 px-3">
                            <Badge variant={t.teacher_status || 'draft'}>
                              {t.teacher_status}
                            </Badge>
                          </td>
                          <td className="py-2.5 px-3 text-slate-400">
                            {new Date(t.created_at).toLocaleDateString('id-ID')}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            {t.teacher_status !== 'approved' && (
                              <button
                                onClick={() => handleTeacherAction(t.id, 'approved')}
                                className="text-xs font-bold text-[#0F766E] hover:underline cursor-pointer mr-2.5"
                              >
                                Setujui
                              </button>
                            )}
                            {t.teacher_status !== 'rejected' && (
                              <button
                                onClick={() => handleTeacherAction(t.id, 'rejected')}
                                className="text-xs font-bold text-amber-700 hover:underline cursor-pointer mr-2.5"
                              >
                                Tolak
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteTeacher(t.id, t.name)}
                              className="text-xs font-bold text-[#B91C1C] hover:underline cursor-pointer"
                              title="Hapus akun pengajar"
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: KELOLA KATEGORI (FR-08, BR-07) */}
        {activeTab === 'categories' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-bold text-xl text-slate-800">Manajemen Kategori Kursus</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Kategori yang masih terhubung dengan kursus tidak dapat dihapus (BR-07)
                </p>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setEditingCatId(null);
                  setCatName('');
                  setCatDesc('');
                  setCatError('');
                  setShowCategoryModal(true);
                }}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                <span>Tambah Kategori Baru</span>
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Nama Kategori</th>
                    <th className="py-3 px-4">Slug</th>
                    <th className="py-3 px-4">Deskripsi</th>
                    <th className="py-3 px-4">Jumlah Kursus</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categories.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 font-bold text-slate-800">{c.name}</td>
                      <td className="py-3.5 px-4 text-xs font-mono text-slate-500">{c.slug}</td>
                      <td className="py-3.5 px-4 text-xs text-slate-600 max-w-xs truncate">
                        {c.description || '-'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 text-[#0F766E] border border-teal-200">
                          {c.total_courses || 0} Kursus
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setEditingCatId(c.id);
                            setCatName(c.name);
                            setCatDesc(c.description || '');
                            setCatError('');
                            setShowCategoryModal(true);
                          }}
                          className="p-1.5 text-slate-600 hover:text-[#0F766E] rounded-lg hover:bg-slate-100 mr-1 cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(c.id)}
                          className="p-1.5 text-slate-400 hover:text-[#B91C1C] rounded-lg hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PENGAWASAN KURSUS (FR-10) */}
        {activeTab === 'courses' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="font-bold text-xl text-slate-800">Daftar Seluruh Kursus Platform</h3>
              <p className="text-xs text-slate-500 mt-1">
                Admin memiliki hak akses penuh untuk mengelola publikasi seluruh kursus
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Judul Kursus</th>
                    <th className="py-3 px-4">Pengajar</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Siswa</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {course.title}
                        <div className="text-xs text-slate-400 font-mono">{course.slug}</div>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-medium text-slate-700">
                        {course.teacher_name}
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        <Badge variant="category">{course.category_name}</Badge>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={course.status}>{course.status}</Badge>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-slate-600">
                        {course.student_count || 0} Siswa
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleToggleCourseStatus(course.id, course.status)}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-100 mr-2 cursor-pointer"
                        >
                          {course.status === 'published' ? 'Jadikan Draft' : 'Publikasikan'}
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="p-1.5 text-slate-400 hover:text-[#B91C1C] rounded-lg hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: DAFTAR PENGGUNA (FR-09) */}
        {activeTab === 'users' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="font-bold text-xl text-slate-800">Direktori Pengguna Terdaftar</h3>
              <p className="text-xs text-slate-500 mt-1">
                Data seluruh akun pengguna pada basis data KursusDeh
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Nama Lengkap</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Peran (Role)</th>
                    <th className="py-3 px-4">Status Guru</th>
                    <th className="py-3 px-4">Tanggal Daftar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 text-xs font-mono text-slate-400">{u.id}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">{u.name}</td>
                      <td className="py-3 px-4 text-xs text-slate-500">{u.email}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : u.role === 'teacher'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-teal-100 text-[#0F766E]'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {u.teacher_status ? (
                          <Badge variant={u.teacher_status}>{u.teacher_status}</Badge>
                        ) : (
                          <span className="text-xs text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500">
                        {new Date(u.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* MODAL KATEGORI */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <h3 className="font-extrabold text-xl text-slate-800">
              {editingCatId ? 'Edit Kategori' : 'Tambah Kategori'}
            </h3>

            {catError && (
              <div className="p-3 rounded-xl bg-red-50 text-[#B91C1C] text-xs font-semibold">
                {catError}
              </div>
            )}

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nama Kategori
                </label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="Contoh: Mobile Development"
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Deskripsi Kategori
                </label>
                <textarea
                  rows={3}
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="Keterangan singkat tentang kategori ini..."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="secondary" onClick={() => setShowCategoryModal(false)}>
                  Batal
                </Button>
                <Button variant="primary" type="submit">
                  Simpan Kategori
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
