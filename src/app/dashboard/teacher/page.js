'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export default function TeacherDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Active Tab: 'courses' | 'materials' | 'students'
  const [activeTab, setActiveTab] = useState('courses');

  // Course Form Modal state
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    level: 'pemula',
    thumbnailUrl: '',
    status: 'draft',
  });
  const [courseFormError, setCourseFormError] = useState('');
  const [isSavingCourse, setIsSavingCourse] = useState(false);

  // Selected Course for Material Management
  const [selectedCourseForMat, setSelectedCourseForMat] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [editingMaterialId, setEditingMaterialId] = useState(null);
  const [materialForm, setMaterialForm] = useState({
    title: '',
    content: '',
    orderNumber: 1,
  });
  const [materialFormError, setMaterialFormError] = useState('');
  const [isSavingMaterial, setIsSavingMaterial] = useState(false);

  const refreshData = async () => {
    try {
      const [coursesRes, catRes, studentsRes] = await Promise.all([
        fetch('/api/teacher/courses'),
        fetch('/api/categories'),
        fetch('/api/teacher/students'),
      ]);

      if (coursesRes.ok) {
        const cData = await coursesRes.json();
        setCourses(cData.courses || []);
      }

      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData.categories || []);
      }

      if (studentsRes.ok) {
        const sData = await studentsRes.json();
        setStudents(sData.students || []);
      }
    } catch (err) {
      console.error('Refresh error:', err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function init() {
      try {
        const [authRes, coursesRes, catRes, studentsRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/teacher/courses'),
          fetch('/api/categories'),
          fetch('/api/teacher/students'),
        ]);

        if (!authRes.ok) {
          router.replace('/login');
          return;
        }

        const authData = await authRes.json();
        if (isMounted) setUser(authData.user);

        if (coursesRes.ok) {
          const cData = await coursesRes.json();
          if (isMounted) {
            setCourses(cData.courses || []);
            if (cData.courses?.length > 0) {
              setSelectedCourseForMat((prev) => prev || cData.courses[0]);
            }
          }
        }

        if (catRes.ok) {
          const catData = await catRes.json();
          if (isMounted) setCategories(catData.categories || []);
        }

        if (studentsRes.ok) {
          const sData = await studentsRes.json();
          if (isMounted) setStudents(sData.students || []);
        }
      } catch (err) {
        console.error('Teacher load error:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    init();
    return () => {
      isMounted = false;
    };
  }, [router]);

  // Ambil materi saat selectedCourseForMat berubah
  useEffect(() => {
    async function loadMaterials() {
      if (!selectedCourseForMat?.id) return;
      try {
        const res = await fetch(`/api/teacher/courses/${selectedCourseForMat.id}/materials`);
        if (res.ok) {
          const data = await res.json();
          setMaterials(data.materials || []);
        }
      } catch (err) {
        console.error('Materials load error:', err);
      }
    }
    loadMaterials();
  }, [selectedCourseForMat]);

  // Handle Course Create / Update
  const handleSaveCourse = async (e) => {
    e.preventDefault();
    setIsSavingCourse(true);
    setCourseFormError('');

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
        setCourseFormError(data.error || 'Gagal menyimpan kursus.');
        setIsSavingCourse(false);
        return;
      }

      setShowCourseModal(false);
      setEditingCourseId(null);
      setCourseForm({
        title: '',
        description: '',
        categoryId: categories[0]?.id || '',
        level: 'pemula',
        thumbnailUrl: '',
        status: 'draft',
      });
      await refreshData();
    } catch (err) {
      setCourseFormError('Gangguan jaringan saat menyimpan kursus.');
    } finally {
      setIsSavingCourse(false);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kursus ini beserta seluruh materinya?')) return;
    try {
      const res = await fetch(`/api/teacher/courses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await refreshData();
      }
    } catch (err) {
      console.error('Delete course error:', err);
    }
  };

  // Handle Material Create / Update
  const handleSaveMaterial = async (e) => {
    e.preventDefault();
    setIsSavingMaterial(true);
    setMaterialFormError('');

    try {
      const url = editingMaterialId
        ? `/api/teacher/materials/${editingMaterialId}`
        : `/api/teacher/courses/${selectedCourseForMat.id}/materials`;
      const method = editingMaterialId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(materialForm),
      });

      const data = await res.json();

      if (!res.ok) {
        setMaterialFormError(data.error || 'Gagal menyimpan materi.');
        setIsSavingMaterial(false);
        return;
      }

      setShowMaterialModal(false);
      setEditingMaterialId(null);
      setMaterialForm({
        title: '',
        content: '',
        orderNumber: materials.length + 1,
      });

      // Reload materials
      const matRes = await fetch(`/api/teacher/courses/${selectedCourseForMat.id}/materials`);
      if (matRes.ok) {
        const matData = await matRes.json();
        setMaterials(matData.materials || []);
      }
      await refreshData();
    } catch (err) {
      setMaterialFormError('Gangguan jaringan saat menyimpan materi.');
    } finally {
      setIsSavingMaterial(false);
    }
  };

  const handleDeleteMaterial = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus materi ini?')) return;
    try {
      const res = await fetch(`/api/teacher/materials/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMaterials((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error('Delete material error:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-page">
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-24 text-center text-slate-500 font-medium">
          Memuat Dashboard Pengajar...
        </div>
        <Footer />
      </div>
    );
  }

  // Jika akun pengajar masih pending (PRD BR-01)
  if (user?.teacher_status === 'pending') {
    return (
      <div className="min-h-screen flex flex-col bg-page">
        <Navbar />
        <main className="flex-1 max-w-3xl mx-auto px-4 py-20">
          <div className="bg-white border border-amber-200 rounded-3xl p-8 sm:p-12 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-accent flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Status: Menunggu Peninjauan Admin
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text-main">
                Pendaftaran Pengajar Sedang Diproses
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                Halo <strong>{user?.name}</strong>, terima kasih telah mendaftar sebagai pengajar di KursusDeh. Demi menjaga mutu materi platform, akun Anda sedang ditinjau oleh Administrator.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 max-w-md mx-auto">
              Setelah disetujui, Anda akan mendapatkan akses penuh untuk membuat kursus, mengunggah materi bertahap, dan memantau siswa.
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header Dashboard Pengajar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Pengajar Terverifikasi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-main">
              Panel Pengajar: {user?.name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="cta"
              size="md"
              onClick={() => {
                setEditingCourseId(null);
                setCourseForm({
                  title: '',
                  description: '',
                  categoryId: categories[0]?.id || '',
                  level: 'pemula',
                  thumbnailUrl: '',
                  status: 'draft',
                });
                setShowCourseModal(true);
              }}
              className="shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              <span>Buat Kursus Baru</span>
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-6">
          <button
            onClick={() => setActiveTab('courses')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'courses'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Kursus Saya ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'materials'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Kelola Materi Kursus
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'students'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Pantau Progres Siswa ({students.length})
          </button>
        </div>

        {/* TAB 1: KURSUS SAYA */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            {courses.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4">
                <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-xl font-bold text-slate-800">Anda Belum Membuat Kursus</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto">
                  Mulai bagikan pengetahuan Anda dengan membuat silabus kursus baru.
                </p>
                <Button
                  variant="primary"
                  onClick={() => {
                    setEditingCourseId(null);
                    setShowCourseModal(true);
                  }}
                >
                  Buat Kursus Pertama
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant={course.status}>{course.status}</Badge>
                        <Badge variant={course.level}>{course.level}</Badge>
                      </div>

                      <h3 className="font-bold text-lg text-slate-800 line-clamp-2">
                        {course.title}
                      </h3>

                      <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>

                      <div className="text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-teal-600" />
                          <span>{course.student_count || 0} Siswa</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-amber-500" />
                          <span>{course.material_count || 0} Materi</span>
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setSelectedCourseForMat(course);
                          setActiveTab('materials');
                        }}
                        className="text-xs font-bold text-primary hover:underline cursor-pointer"
                      >
                        Kelola Materi
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingCourseId(course.id);
                            setCourseForm({
                              title: course.title,
                              description: course.description,
                              categoryId: course.category_id,
                              level: course.level,
                              thumbnailUrl: course.thumbnail_url || '',
                              status: course.status,
                            });
                            setShowCourseModal(true);
                          }}
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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: KELOLA MATERI KURSUS (BR-04) */}
        {activeTab === 'materials' && (
          <div className="space-y-6">
            {/* Pemilih Kursus */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Pilih Kursus untuk Dikelola Materinya:
                </label>
                <select
                  value={selectedCourseForMat?.id || ''}
                  onChange={(e) => {
                    const picked = courses.find((c) => c.id === parseInt(e.target.value, 10));
                    setSelectedCourseForMat(picked);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold text-slate-800 text-sm focus:ring-2 focus:ring-primary"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.status})
                    </option>
                  ))}
                </select>
              </div>

              {selectedCourseForMat && (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    setEditingMaterialId(null);
                    setMaterialForm({
                      title: '',
                      content: '',
                      orderNumber: materials.length + 1,
                    });
                    setShowMaterialModal(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  <span>Tambah Materi Baru</span>
                </Button>
              )}
            </div>

            {/* Daftar Materi */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-lg text-slate-800">
                  Daftar Silabus Materi ({materials.length} Bab)
                </h3>
                <span className="text-xs text-slate-500">
                  Nomor urut bersifat unik (BR-04)
                </span>
              </div>

              {materials.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">
                  Belum ada materi pada kursus ini. Silakan klik tombol &quot;Tambah Materi Baru&quot;.
                </div>
              ) : (
                <div className="space-y-3">
                  {materials.map((mat) => (
                    <div
                      key={mat.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <span className="w-9 h-9 rounded-xl bg-teal-100 text-primary font-bold flex items-center justify-center text-sm shrink-0">
                          {mat.order_number}
                        </span>
                        <div>
                          <h4 className="font-bold text-slate-800 text-base">{mat.title}</h4>
                          <p className="text-xs text-slate-500 line-clamp-1">{mat.content}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingMaterialId(mat.id);
                            setMaterialForm({
                              title: mat.title,
                              content: mat.content,
                              orderNumber: mat.order_number,
                            });
                            setShowMaterialModal(true);
                          }}
                          className="p-2 text-slate-600 hover:text-primary rounded-lg hover:bg-white cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMaterial(mat.id)}
                          className="p-2 text-slate-400 hover:text-danger rounded-lg hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PEMANTAUAN SISWA & PROGRES BELAJAR (FR-14) */}
        {activeTab === 'students' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="font-bold text-xl text-slate-800">Pemantauan Siswa Terdaftar</h3>
              <p className="text-xs text-slate-500 mt-1">
                Lacak kemajuan belajar siswa pada seluruh kursus yang Anda ajarkan
              </p>
            </div>

            {students.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                Belum ada siswa yang mendaftar pada kursus Anda.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Nama Siswa</th>
                      <th className="py-3 px-4">Kursus</th>
                      <th className="py-3 px-4">Tanggal Daftar</th>
                      <th className="py-3 px-4">Progres Materi</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map((s) => (
                      <tr key={s.enrollment_id} className="hover:bg-slate-50/50">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-800">{s.student_name}</div>
                          <div className="text-xs text-slate-400">{s.student_email}</div>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-800">
                          {s.course_title}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-500">
                          {new Date(s.enrolled_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-3.5 px-4 w-44">
                          <ProgressBar percentage={s.progress_percentage} height="h-2" />
                          <div className="text-[10px] text-slate-500 text-right mt-1">
                            {s.completed_materials} / {s.total_materials} Bab
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          {s.progress_percentage === 100 ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-success bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Selesai</span>
                            </span>
                          ) : (
                            <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              Belajar
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
        )}
      </main>

      {/* MODAL BUAT / EDIT KURSUS */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <h3 className="font-extrabold text-xl text-slate-800">
              {editingCourseId ? 'Edit Kursus' : 'Buat Kursus Baru'}
            </h3>

            {courseFormError && (
              <div className="p-3 rounded-xl bg-red-50 text-danger text-xs font-semibold">
                {courseFormError}
              </div>
            )}

            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Judul Kursus
                </label>
                <input
                  type="text"
                  required
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  placeholder="Contoh: Belajar Next.js Dasar"
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Kategori
                </label>
                <select
                  value={courseForm.categoryId}
                  onChange={(e) => setCourseForm({ ...courseForm, categoryId: parseInt(e.target.value, 10) })}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Level
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
                    <option value="draft">Draft (Disembunyikan)</option>
                    <option value="published">Published (Tampil)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  URL Gambar Thumbnail (Opsional)
                </label>
                <input
                  type="url"
                  value={courseForm.thumbnailUrl}
                  onChange={(e) => setCourseForm({ ...courseForm, thumbnailUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Deskripsi Lengkap
                </label>
                <textarea
                  rows={4}
                  required
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  placeholder="Jelaskan apa yang akan dipelajari siswa..."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowCourseModal(false)}
                >
                  Batal
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  isLoading={isSavingCourse}
                >
                  Simpan Kursus
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH / EDIT MATERI (BR-04) */}
      {showMaterialModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <h3 className="font-extrabold text-xl text-slate-800">
              {editingMaterialId ? 'Edit Materi' : 'Tambah Materi Baru'}
            </h3>

            {materialFormError && (
              <div className="p-3 rounded-xl bg-red-50 text-danger text-xs font-semibold">
                {materialFormError}
              </div>
            )}

            <form onSubmit={handleSaveMaterial} className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    No. Urut
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={materialForm.orderNumber}
                    onChange={(e) => setMaterialForm({ ...materialForm, orderNumber: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-center"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Judul Materi
                  </label>
                  <input
                    type="text"
                    required
                    value={materialForm.title}
                    onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                    placeholder="Contoh: Pengenalan Sintaks Dasar"
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Isi Konten Pembelajaran
                </label>
                <textarea
                  rows={8}
                  required
                  value={materialForm.content}
                  onChange={(e) => setMaterialForm({ ...materialForm, content: e.target.value })}
                  placeholder="Tuliskan materi teks penjelasan langkah demi langkah di sini..."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowMaterialModal(false)}
                >
                  Batal
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  isLoading={isSavingMaterial}
                >
                  Simpan Materi
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
