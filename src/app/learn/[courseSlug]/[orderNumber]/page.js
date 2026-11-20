'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import ProgressBar from '@/components/ui/ProgressBar';
import Button from '@/components/ui/Button';
import {
  CheckCircle2,
  Circle,
  PlayCircle,
  ArrowLeft,
  ArrowRight,
  MessageSquare,
  Award,
  Send,
  CornerDownRight,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export default function LearnRoomPage() {
  const params = useParams();
  const router = useRouter();
  const { courseSlug, orderNumber } = params;

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Diskusi form state
  const [commentText, setCommentText] = useState('');
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Tandai selesai state
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [earnedCertCode, setEarnedCertCode] = useState(null);

  const fetchMaterial = async () => {
    try {
      const res = await fetch(`/api/learn/${courseSlug}/${orderNumber}`);
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || 'Gagal memuat materi.');
      } else {
        setData(json);
        if (json.certificateCode) {
          setEarnedCertCode(json.certificateCode);
        }
      }
    } catch (err) {
      setError('Gangguan jaringan saat memuat materi.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const res = await fetch(`/api/learn/${courseSlug}/${orderNumber}`);
        const json = await res.json();

        if (!isMounted) return;

        if (!res.ok) {
          setError(json.error || 'Gagal memuat materi.');
        } else {
          setData(json);
          if (json.certificateCode) {
            setEarnedCertCode(json.certificateCode);
          }
        }
      } catch (err) {
        if (isMounted) setError('Gangguan jaringan saat memuat materi.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [courseSlug, orderNumber]);

  const handleMarkComplete = async () => {
    setIsMarkingComplete(true);
    try {
      const res = await fetch(`/api/learn/${courseSlug}/${orderNumber}/complete`, {
        method: 'POST',
      });
      const resJson = await res.json();

      if (res.ok) {
        setData((prev) => ({
          ...prev,
          isCurrentCompleted: true,
          completedMaterialIds: [
            ...(prev.completedMaterialIds || []),
            prev.material.id,
          ],
          progressPercentage: resJson.progressPercentage,
          certificateCode: resJson.certificateCode || prev.certificateCode,
        }));

        if (resJson.certificateCode) {
          setEarnedCertCode(resJson.certificateCode);
          setShowCertificateModal(true);
        } else if (data.nextMaterial) {
          // Beralih ke materi selanjutnya
          router.push(`/learn/${courseSlug}/${data.nextMaterial.order_number}`);
        }
      }
    } catch (err) {
      console.error('Complete error:', err);
    } finally {
      setIsMarkingComplete(false);
    }
  };

  const handlePostComment = async (parentId = null) => {
    const text = parentId ? replyText : commentText;
    if (!text.trim()) return;

    setIsSubmittingComment(true);
    try {
      const res = await fetch(`/api/learn/${courseSlug}/${orderNumber}/discussions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text, parentId }),
      });

      if (res.ok) {
        if (parentId) {
          setReplyText('');
          setReplyingToId(null);
        } else {
          setCommentText('');
        }
        await fetchMaterial();
      }
    } catch (err) {
      console.error('Discussion post error:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-24 text-center text-slate-500 font-medium">
          Memuat ruang belajar interaktif...
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Navbar />
        <div className="flex-1 max-w-lg mx-auto px-4 py-20 text-center space-y-4">
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-[#B91C1C] text-sm font-semibold">
            {error || 'Materi tidak dapat dimuat.'}
          </div>
          <Link
            href={`/courses/${courseSlug}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0F766E] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Halaman Kursus</span>
          </Link>
        </div>
      </div>
    );
  }

  const {
    course,
    material,
    allMaterials = [],
    prevMaterial,
    nextMaterial,
    completedMaterialIds = [],
    isCurrentCompleted,
    progressPercentage = 0,
    discussions = [],
    userRole,
  } = data;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      {/* Main Split-Screen Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* KOLOM KIRI: SIDEBAR DAFTAR MATERI */}
          <aside className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 lg:sticky lg:top-28">
            <div className="space-y-3">
              <Link
                href={`/courses/${course.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F766E] hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Detail Kursus</span>
              </Link>
              <h2 className="text-lg font-extrabold text-[#0F172A] leading-snug">
                {course.title}
              </h2>
            </div>

            {/* Progress Bar Persentase */}
            {userRole === 'student' && (
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 space-y-2">
                <ProgressBar percentage={progressPercentage} />
                <div className="text-xs text-slate-500 font-medium text-right">
                  {completedMaterialIds.length} dari {allMaterials.length} materi selesai
                </div>
              </div>
            )}

            {/* Daftar Materi Berurutan Bernomor */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Daftar Materi ({allMaterials.length} Bab)
              </div>
              <div className="space-y-1.5 max-h-[50vh] overflow-y-auto pr-1">
                {allMaterials.map((m) => {
                  const isActive = m.order_number === material.order_number;
                  const isDone = completedMaterialIds.includes(m.id);

                  return (
                    <Link
                      key={m.id}
                      href={`/learn/${courseSlug}/${m.order_number}`}
                      className={`flex items-center justify-between p-3 rounded-2xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-[#0F766E] text-white shadow-md'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <span
                          className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-white border border-slate-200 text-[#0F766E]'
                          }`}
                        >
                          {m.order_number}
                        </span>
                        <span className="truncate">{m.title}</span>
                      </div>

                      <div className="shrink-0 ml-2">
                        {isDone ? (
                          <CheckCircle2
                            className={`w-5 h-5 ${
                              isActive ? 'text-[#F59E0B]' : 'text-[#15803D]'
                            }`}
                          />
                        ) : (
                          <Circle
                            className={`w-4 h-4 ${
                              isActive ? 'text-white/60' : 'text-slate-300'
                            }`}
                          />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Tombol Sertifikat Jika Sudah 100% */}
            {earnedCertCode && (
              <Link
                href={`/certificate/${earnedCertCode}`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#F59E0B] hover:bg-amber-600 text-[#1C1917] font-bold rounded-xl text-sm shadow-md transition-all"
              >
                <Award className="w-4 h-4" />
                <span>Lihat Sertifikat Kelulusan</span>
              </Link>
            )}
          </aside>

          {/* KOLOM KANAN: KONTEN MATERI UTAMA & DISKUSI */}
          <main className="lg:col-span-8 space-y-8">
            
            {/* Header & Konten Teks Materi */}
            <article className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <span className="px-3 py-1 bg-teal-50 border border-teal-200 text-[#0F766E] text-xs font-bold rounded-full">
                  Bab ke-{material.order_number}
                </span>
                {isCurrentCompleted && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#15803D] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Materi Ini Selesai</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                {material.title}
              </h1>

              {/* Teks Materi Edukasi */}
              <div className="prose max-w-none text-slate-700 text-base sm:text-lg leading-relaxed whitespace-pre-line py-2 border-y border-slate-100">
                {material.content}
              </div>

              {/* Bar Navigasi & Aksi Materi */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  {prevMaterial ? (
                    <Link
                      href={`/learn/${courseSlug}/${prevMaterial.order_number}`}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-colors text-sm"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Sebelumnya</span>
                    </Link>
                  ) : (
                    <div />
                  )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {userRole === 'student' && (
                    <Button
                      variant={isCurrentCompleted ? 'secondary' : 'primary'}
                      onClick={handleMarkComplete}
                      isLoading={isMarkingComplete}
                      className="w-full sm:w-auto shadow-sm text-sm"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      <span>{isCurrentCompleted ? 'Selesai (Perbarui)' : 'Tandai Selesai'}</span>
                    </Button>
                  )}

                  {nextMaterial && (
                    <Link
                      href={`/learn/${courseSlug}/${nextMaterial.order_number}`}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-amber-600 text-[#1C1917] font-bold transition-colors text-sm shadow-sm"
                    >
                      <span>Selanjutnya</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            </article>

            {/* SEKSI FORUM DISKUSI MATERI (FR-20) */}
            <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-teal-100 text-[#0F766E] flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-[#0F172A]">Forum Diskusi Materi</h3>
                  <p className="text-xs text-slate-500">
                    Ajukan pertanyaan atau diskusikan topik bab ini bersama pengajar dan siswa lainnya
                  </p>
                </div>
              </div>

              {/* Form Tulis Komentar Utama */}
              <div className="space-y-3">
                <textarea
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Tuliskan pertanyaan atau tanggapan Anda di sini..."
                  className="w-full p-4 bg-slate-50 border border-slate-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:bg-white"
                />
                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handlePostComment(null)}
                    isLoading={isSubmittingComment && !replyingToId}
                    disabled={!commentText.trim()}
                  >
                    <Send className="w-4 h-4 mr-1.5" />
                    <span>Kirim Pertanyaan</span>
                  </Button>
                </div>
              </div>

              {/* Daftar Komentar & Balasan */}
              <div className="space-y-6 pt-4">
                {discussions.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    Belum ada diskusi untuk materi ini. Jadilah yang pertama bertanya!
                  </div>
                ) : (
                  discussions.map((disc) => (
                    <div
                      key={disc.id}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4"
                    >
                      {/* Diskusi Induk */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center text-sm">
                            {disc.user_name ? disc.user_name.charAt(0) : 'U'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-800">{disc.user_name}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold uppercase">
                                {disc.user_role}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400">
                              {new Date(disc.created_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => setReplyingToId(replyingToId === disc.id ? null : disc.id)}
                          className="text-xs font-bold text-[#0F766E] hover:underline cursor-pointer"
                        >
                          {replyingToId === disc.id ? 'Batal Balas' : 'Balas'}
                        </button>
                      </div>

                      <p className="text-slate-700 text-sm pl-12 leading-relaxed">
                        {disc.content}
                      </p>

                      {/* Form Balasan */}
                      {replyingToId === disc.id && (
                        <div className="pl-12 pt-2 space-y-2">
                          <textarea
                            rows={2}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`Balas komentar ${disc.user_name}...`}
                            className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
                          />
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                setReplyingToId(null);
                                setReplyText('');
                              }}
                            >
                              Batal
                            </Button>
                            <Button
                              variant="cta"
                              size="sm"
                              onClick={() => handlePostComment(disc.id)}
                              isLoading={isSubmittingComment}
                              disabled={!replyText.trim()}
                            >
                              Kirim Balasan
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Balasan Bersarang (Replies) */}
                      {disc.replies && disc.replies.length > 0 && (
                        <div className="pl-10 space-y-3 pt-2 border-l-2 border-teal-200/60 ml-4">
                          {disc.replies.map((reply) => (
                            <div
                              key={reply.id}
                              className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2"
                            >
                              <div className="flex items-center gap-2">
                                <CornerDownRight className="w-3.5 h-3.5 text-teal-600" />
                                <span className="font-bold text-xs text-slate-800">{reply.user_name}</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-teal-100 text-[#0F766E] font-semibold uppercase">
                                  {reply.user_role}
                                </span>
                              </div>
                              <p className="text-xs text-slate-700 pl-5 leading-relaxed">
                                {reply.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* POPUP MODAL SELAMAT KELULUSAN 100% */}
      {showCertificateModal && earnedCertCode && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl border-4 border-[#F59E0B]">
            <div className="w-20 h-20 rounded-full bg-amber-100 text-[#F59E0B] flex items-center justify-center mx-auto shadow-md">
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#15803D]">
                🎉 Selamat, Anda Telah Lulus!
              </span>
              <h3 className="text-2xl font-extrabold text-[#0F172A]">
                Kursus Selesai 100%
              </h3>
              <p className="text-slate-600 text-sm">
                Anda telah menyelesaikan seluruh materi pada kursus <strong>{course.title}</strong>. Sertifikat kelulusan digital Anda telah diterbitkan!
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-700">
              Kode Sertifikat: <span className="text-[#0F766E]">{earnedCertCode}</span>
            </div>

            <div className="flex flex-col gap-2.5">
              <Link
                href={`/certificate/${earnedCertCode}`}
                className="w-full py-3.5 bg-[#F59E0B] hover:bg-amber-600 text-[#1C1917] font-bold rounded-xl transition-all shadow-md text-sm"
              >
                Buka & Cetak Sertifikat
              </Link>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-700 font-semibold cursor-pointer"
              >
                Tutup Sementara
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
