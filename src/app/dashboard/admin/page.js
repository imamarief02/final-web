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
  Layers,
  Trash2,
  Edit,
  Plus,
  ShieldCheck,
  AlertCircle,
  Calendar,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
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

  // Modal User Management (Create / Edit)
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    bio: '',
  });
  const [userError, setUserError] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [userPage, setUserPage] = useState(1);
  const usersPerPage = 5;

  // Modal Course Management (Admin Create / Edit)
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    teacherId: '',
    level: 'pemula',
    thumbnailUrl: '',
    status: 'published',
    startDate: '',
    endDate: '',
  });
  const [courseError, setCourseError] = useState('');

  // Kunci scroll halaman belakang saat salah satu modal admin sedang terbuka
  useEffect(() => {
    if (showUserModal || showCourseModal || showCategoryModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showUserModal, showCourseModal, showCategoryModal]);

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

  // Handle Kategori (Create / Update)
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setCatError('');

    try {
      const url = '/api/admin/categories';
      const method = editingCatId ? 'PUT' : 'POST';
      const payload = editingCatId
        ? { id: editingCatId, name: catName, description: catDesc }
        : { name: catName, description: catDesc };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
      setCatError('Terjadi kesalahan jaringan.');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kategori ini?')) return;

    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await refreshAdminData();
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal menghapus kategori.');
      }
    } catch (err) {
      alert('Terjadi kesalahan saat menghapus kategori.');
    }
  };

  // Handle User Management (Create / Update / Delete)
  const handleOpenUserModal = (user = null) => {
    if (user) {
      setEditingUserId(user.id);
      setUserForm({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        bio: user.bio || '',
      });
    } else {
      setEditingUserId(null);
      setUserForm({
        name: '',
        email: '',
        password: '',
        role: 'student',
        bio: '',
      });
    }
    setUserError('');
    setShowUserModal(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setUserError('');

    try {
      const method = editingUserId ? 'PUT' : 'POST';
      const payload = editingUserId
        ? { id: editingUserId, ...userForm }
        : userForm;

      const res = await fetch('/api/admin/users', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setUserError(data.error || 'Gagal menyimpan pengguna.');
        return;
      }

      setShowUserModal(false);
      await refreshAdminData();
    } catch (err) {
      setUserError('Terjadi kesalahan jaringan saat menyimpan user.');
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!confirm(`Hapus pengguna "${name}"? Tindakan ini tidak dapat dibatalkan.`)) return;

    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        await refreshAdminData();
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal menghapus pengguna.');
      }
    } catch (err) {
      alert('Kesalahan jaringan saat menghapus pengguna.');
    }
  };

  // Handle Course Management (Admin Create / Edit / Delete)
  const handleOpenCourseModal = (course = null) => {
    if (course) {
      setEditingCourseId(course.id);
      setCourseForm({
        title: course.title,
        description: course.description || '',
        categoryId: course.category_id || '',
        teacherId: course.teacher_id || '',
        level: course.level || 'pemula',
        thumbnailUrl: course.thumbnail_url || '',
        status: course.status || 'published',
        startDate: course.start_date ? course.start_date.slice(0, 10) : '',
        endDate: course.end_date ? course.end_date.slice(0, 10) : '',
      });
    } else {
      setEditingCourseId(null);
      setCourseForm({
        title: '',
        description: '',
        categoryId: categories[0]?.id || '',
        teacherId: teachers.find(t => t.teacher_status === 'approved')?.id || '',
        level: 'pemula',
        thumbnailUrl: '',
        status: 'published',
        startDate: '',
        endDate: '',
      });
    }
    setCourseError('');
    setShowCourseModal(true);
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    setCourseError('');

    // Validasi rentang waktu kursus
    if (courseForm.startDate && courseForm.endDate && new Date(courseForm.startDate) > new Date(courseForm.endDate)) {
      setCourseError('Tanggal mulai tidak boleh lebih akhir daripada tanggal selesai kursus.');
      return;
    }

    try {
      const url = editingCourseId
        ? `/api/teacher/courses/${editingCourseId}`
        : '/api/teacher/courses';
      const method = editingCourseId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseForm),
      });

      const data = await res.json();
      if (!res.ok) {
        setCourseError(data.error || 'Gagal menyimpan kursus.');
        return;
      }

      setShowCourseModal(false);
      await refreshAdminData();
    } catch (err) {
      setCourseError('Kesalahan jaringan saat menyimpan kursus.');
    }
  };

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
      console.error('Toggle status error:', err);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kursus ini beserta seluruh materi di dalamnya?')) return;

    try {
      const res = await fetch(`/api/admin/courses?id=${courseId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await refreshAdminData();
      }
    } catch (err) {
      console.error('Delete course error:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-page">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="flex items-center gap-3 text-slate-500 font-semibold">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span>Memuat data dasbor administrator...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const pendingTeachers = teachers.filter((t) => t.teacher_status === 'pending');
  const approvedTeachers = teachers.filter((t) => t.teacher_status === 'approved');

  const filteredUsers = users.filter((u) => {
    if (!userSearch) return true;
    const term = userSearch.toLowerCase();
    return u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term) || u.role.toLowerCase().includes(term);
  });

  const totalUserPages = Math.ceil(filteredUsers.length / usersPerPage) || 1;
  const paginatedUsers = filteredUsers.slice(
    (userPage - 1) * usersPerPage,
    userPage * usersPerPage
  );

  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* HEADER PANEL ADMIN */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-teal-100 text-primary">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <span className="text-xs font-bold text-primary tracking-wider uppercase">
                  Pusat Kendali Admin
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Dashboard Manajemen KursusDeh
              </h1>
              <p className="text-sm text-slate-500">
                Kelola hak akses pengguna, verifikasi calon guru, kategori silabus, dan seluruh konten kursus
              </p>
            </div>
          </div>
        </div>

        {/* STATISTIK RINGKAS PLATFORM */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-primary flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900">{stats.total_users || 0}</div>
                <div className="text-xs font-medium text-slate-500">Total Pengguna</div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900">{stats.total_courses || 0}</div>
                <div className="text-xs font-medium text-slate-500">Total Kursus</div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900">{stats.total_enrollments || 0}</div>
                <div className="text-xs font-medium text-slate-500">Pendaftaran Siswa</div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900">{pendingTeachers.length}</div>
                <div className="text-xs font-medium text-slate-500">Guru Menunggu Verifikasi</div>
              </div>
            </div>
          </div>
        )}

        {/* NAVIGASI TAB MODUL CMS */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('teachers')}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'teachers'
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verifikasi Pengajar</span>
            {pendingTeachers.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-900 text-xs flex items-center justify-center font-extrabold">
                {pendingTeachers.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'users'
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Manajemen Pengguna</span>
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'courses'
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Manajemen Kursus</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'categories'
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Manajemen Kategori</span>
          </button>
        </div>

        {/* TAB 1: VERIFIKASI PENGAJAR */}
        {activeTab === 'teachers' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                  <span>Permohonan Akun Pengajar Baru</span>
                  {pendingTeachers.length > 0 && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-extrabold">
                      {pendingTeachers.length} Menunggu Persetujuan
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Calon pengajar wajib disetujui Admin sebelum dapat mempublikasikan kursus
                </p>
              </div>

              {pendingTeachers.length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-sm">
                  Tidak ada permohonan pengajar baru yang sedang menunggu verifikasi.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-700">
                    <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Nama Lengkap</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Bio / Portofolio</th>
                        <th className="py-3 px-4">Tanggal Mendaftar</th>
                        <th className="py-3 px-4 text-right">Keputusan Admin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pendingTeachers.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50/50">
                          <td className="py-4 px-4 font-bold text-slate-800">{t.name}</td>
                          <td className="py-4 px-4 text-slate-600 text-xs">{t.email}</td>
                          <td className="py-4 px-4 text-xs text-slate-600 max-w-xs truncate">
                            {t.bio || 'Tidak ada bio yang dilampirkan.'}
                          </td>
                          <td className="py-4 px-4 text-xs text-slate-500">
                            {new Date(t.created_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => handleTeacherAction(t.id, 'approved')}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                              >
                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                <span>Setujui (Approve)</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => handleTeacherAction(t.id, 'rejected')}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                <span>Tolak</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* DAFTAR GURU TERVERIFIKASI */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="font-bold text-xl text-slate-800">Daftar Pengajar Terverifikasi (Approved)</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Guru yang telah memiliki izin membuat materi dan kursus
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Nama Lengkap</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Tanggal Disetujui</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {approvedTeachers.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/50">
                        <td className="py-3.5 px-4 font-bold text-slate-800">{t.name}</td>
                        <td className="py-3.5 px-4 text-slate-600 text-xs">{t.email}</td>
                        <td className="py-3.5 px-4">
                          <Badge variant="approved">Aktif Mengajar</Badge>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-500">
                          {t.approved_at ? new Date(t.approved_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          }) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MANAJEMEN PENGGUNA (CMS USER MANAGEMENT - CRUD) */}
        {activeTab === 'users' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-xl text-slate-800">Manajemen Pengguna (User Management)</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Kelola data seluruh akun (Admin, Teacher, Student) dengan fitur Create, Edit, dan Delete
                </p>
              </div>
              <Button variant="primary" onClick={() => handleOpenUserModal()}>
                <Plus className="w-4 h-4 mr-1.5" />
                <span>Tambah Pengguna Baru</span>
              </Button>
            </div>

            {/* PENCARIAN PENGGUNA */}
            <div className="relative max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder="Cari nama, email, atau role..."
                value={userSearch}
                onChange={(e) => {
                  setUserSearch(e.target.value);
                  setUserPage(1);
                }}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 w-16">No.</th>
                    <th className="py-3 px-4">Nama Lengkap</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Peran (Role)</th>
                    <th className="py-3 px-4">Status Pengajar</th>
                    <th className="py-3 px-4">Tgl Daftar</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                        Tidak ada data pengguna yang sesuai dengan pencarian.
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((u, idx) => (
                      <tr key={u.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 text-xs font-semibold text-slate-500">
                          {(userPage - 1) * usersPerPage + idx + 1}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800">{u.name}</td>
                        <td className="py-3 px-4 text-xs text-slate-500">{u.email}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                              u.role === 'admin'
                                ? 'bg-purple-100 text-purple-800'
                                : u.role === 'teacher'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-teal-100 text-primary'
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
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenUserModal(u)}
                              className="p-1.5 text-slate-600 hover:text-primary rounded-lg hover:bg-slate-100 cursor-pointer"
                              title="Edit Pengguna"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id, u.name)}
                              className="p-1.5 text-slate-400 hover:text-danger rounded-lg hover:bg-red-50 cursor-pointer"
                              title="Hapus Pengguna"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* NAVIGASI PAGINATION USER MANAGEMENT */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs text-slate-500">
              <div>
                Menampilkan{' '}
                <span className="font-bold text-slate-800">
                  {filteredUsers.length > 0 ? (userPage - 1) * usersPerPage + 1 : 0}
                </span>{' '}
                sampai{' '}
                <span className="font-bold text-slate-800">
                  {Math.min(userPage * usersPerPage, filteredUsers.length)}
                </span>{' '}
                dari <span className="font-bold text-slate-800">{filteredUsers.length}</span> pengguna
              </div>

              {totalUserPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setUserPage((p) => Math.max(p - 1, 1))}
                    disabled={userPage === 1}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Sebelumnya</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalUserPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setUserPage(p)}
                        className={`w-8 h-8 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                          userPage === p
                            ? 'bg-primary text-white shadow-xs'
                            : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setUserPage((p) => Math.min(p + 1, totalUserPages))}
                    disabled={userPage === totalUserPages}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <span>Selanjutnya</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: MANAJEMEN KURSUS (COURSE MANAGEMENT - ADMIN & TEACHER) */}
        {activeTab === 'courses' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-xl text-slate-800">Manajemen Kursus (Course Management)</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Admin dapat membuat kursus baru (menunjuk guru pengajar), mengatur rentang waktu, dan mengedit konten
                </p>
              </div>
              <Button variant="primary" onClick={() => handleOpenCourseModal()}>
                <Plus className="w-4 h-4 mr-1.5" />
                <span>Buat Kursus Baru</span>
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Judul Kursus</th>
                    <th className="py-3 px-4">Pengajar</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4">Rentang Waktu</th>
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
                      <td className="py-3.5 px-4 text-xs text-slate-600">
                        {course.start_date && course.end_date ? (
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                            <span>
                              {new Date(course.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - {new Date(course.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Akses Selamanya</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={course.status}>{course.status}</Badge>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-slate-600">
                        {course.student_count || 0} Siswa
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleToggleCourseStatus(course.id, course.status)}
                            className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-100 cursor-pointer"
                          >
                            {course.status === 'published' ? 'Draft' : 'Publish'}
                          </button>
                          <button
                            onClick={() => handleOpenCourseModal(course)}
                            className="p-1.5 text-slate-600 hover:text-primary rounded-lg hover:bg-slate-100 cursor-pointer"
                            title="Edit Kursus"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            className="p-1.5 text-slate-400 hover:text-danger rounded-lg hover:bg-red-50 cursor-pointer"
                            title="Hapus Kursus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: MANAJEMEN KATEGORI (CATEGORY MANAGEMENT - ADMIN CRUD) */}
        {activeTab === 'categories' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-xl text-slate-800">Manajemen Kategori (Category Management)</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Kategori yang dikelola di modul ini menjadi sumber data pilihan dropdown saat membuat kursus
                </p>
              </div>
              <Button
                variant="primary"
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
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 text-primary border border-teal-200">
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
                          className="p-1.5 text-slate-600 hover:text-primary rounded-lg hover:bg-slate-100 mr-1 cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(c.id)}
                          className="p-1.5 text-slate-400 hover:text-danger rounded-lg hover:bg-red-50 cursor-pointer"
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
      </main>

      {/* MODAL USER MANAGEMENT (CREATE / EDIT) */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h3 className="font-extrabold text-xl text-slate-800">
                {editingUserId ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setShowUserModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form id="userFormAdmin" onSubmit={handleSaveUser} className="p-6 overflow-y-auto space-y-4 overscroll-contain flex-1">
              {userError && (
                <div className="p-3 rounded-xl bg-red-50 text-danger text-xs font-semibold">
                  {userError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nama / Username
                </label>
                <input
                  type="text"
                  required
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  placeholder="Nama lengkap atau username"
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  placeholder="email@kursusdeh.com"
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Password {editingUserId && <span className="text-slate-400 font-normal">(Kosongkan jika tidak diubah)</span>}
                </label>
                <input
                  type="password"
                  required={!editingUserId}
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  placeholder="Minimal 6 karakter"
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Peran (Role)
                </label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                >
                  <option value="student">Student (Siswa)</option>
                  <option value="teacher">Teacher (Pengajar)</option>
                  <option value="admin">Admin (Administrator)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Bio / Keterangan (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={userForm.bio}
                  onChange={(e) => setUserForm({ ...userForm, bio: e.target.value })}
                  placeholder="Bio singkat pengguna..."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>
            </form>

            {/* Sticky Action Footer */}
            <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0 rounded-b-3xl">
              <Button variant="secondary" onClick={() => setShowUserModal(false)}>
                Batal
              </Button>
              <Button variant="primary" type="submit" form="userFormAdmin">
                Simpan Pengguna
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL COURSE MANAGEMENT (ADMIN CREATE / EDIT) */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h3 className="font-extrabold text-xl text-slate-800">
                {editingCourseId ? 'Edit Kursus' : 'Buat Kursus Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setShowCourseModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form id="courseFormAdmin" onSubmit={handleSaveCourse} className="p-6 overflow-y-auto space-y-4 overscroll-contain flex-1">
              {courseError && (
                <div className="p-3 rounded-xl bg-red-50 text-danger text-xs font-semibold">
                  {courseError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Judul Kursus
                </label>
                <input
                  type="text"
                  required
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  placeholder="Contoh: Pemrograman Flutter Modern"
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Kategori (Category)
                  </label>
                  <select
                    required
                    value={courseForm.categoryId}
                    onChange={(e) => setCourseForm({ ...courseForm, categoryId: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Nama Pengajar (Teacher)
                  </label>
                  <select
                    required
                    value={courseForm.teacherId}
                    onChange={(e) => setCourseForm({ ...courseForm, teacherId: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  >
                    <option value="">Pilih Pengajar</option>
                    {teachers.filter(t => t.teacher_status === 'approved' || t.role === 'admin').map((t) => (
                      <option key={t.id} value={t.id}>{t.name} ({t.role})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Deskripsi Kursus
                </label>
                <textarea
                  rows={3}
                  required
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  placeholder="Rangkuman kurikulum dan materi yang akan dipelajari..."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              {/* RENTANG WAKTU (OPSIONAL / NULLABLE) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>Rentang Waktu Kursus (Opsional)</span>
                  </span>
                  <span className="text-[11px] text-slate-400">Kosongkan jika Lifetime Access</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Tanggal Mulai</label>
                    <input
                      type="date"
                      value={courseForm.startDate}
                      onChange={(e) => setCourseForm({ ...courseForm, startDate: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Tanggal Selesai</label>
                    <input
                      type="date"
                      value={courseForm.endDate}
                      onChange={(e) => setCourseForm({ ...courseForm, endDate: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Level Kursus
                  </label>
                  <select
                    value={courseForm.level}
                    onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  >
                    <option value="pemula">Pemula</option>
                    <option value="menengah">Menengah</option>
                    <option value="lanjutan">Lanjutan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Status Publikasi
                  </label>
                  <select
                    value={courseForm.status}
                    onChange={(e) => setCourseForm({ ...courseForm, status: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  >
                    <option value="published">Published (Tayang)</option>
                    <option value="draft">Draft (Disembunyikan)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Thumbnail URL (Opsional)
                </label>
                <input
                  type="text"
                  value={courseForm.thumbnailUrl}
                  onChange={(e) => setCourseForm({ ...courseForm, thumbnailUrl: e.target.value })}
                  placeholder="https://... atau /images/courses/..."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>
            </form>

            {/* Sticky Action Footer */}
            <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0 rounded-b-3xl">
              <Button variant="secondary" onClick={() => setShowCourseModal(false)}>
                Batal
              </Button>
              <Button variant="primary" type="submit" form="courseFormAdmin">
                Simpan Kursus
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KATEGORI */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h3 className="font-extrabold text-xl text-slate-800">
                {editingCatId ? 'Edit Kategori' : 'Tambah Kategori'}
              </h3>
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form id="catFormAdmin" onSubmit={handleSaveCategory} className="p-6 overflow-y-auto space-y-4 overscroll-contain flex-1">
              {catError && (
                <div className="p-3 rounded-xl bg-red-50 text-danger text-xs font-semibold">
                  {catError}
                </div>
              )}

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
            </form>

            {/* Sticky Action Footer */}
            <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0 rounded-b-3xl">
              <Button variant="secondary" onClick={() => setShowCategoryModal(false)}>
                Batal
              </Button>
              <Button variant="primary" type="submit" form="catFormAdmin">
                Simpan Kategori
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
