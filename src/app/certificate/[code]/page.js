'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Button from '@/components/ui/Button';
import { Award, CheckCircle2, Printer, ArrowLeft, BookOpen, ShieldCheck } from 'lucide-react';

export default function CertificatePage() {
  const params = useParams();
  const code = params.code;

  const [cert, setCert] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCert() {
      try {
        const res = await fetch(`/api/certificate/${code}`);
        const data = await res.json();
        if (res.ok) {
          setCert(data.certificate);
        } else {
          setError(data.error || 'Sertifikat tidak valid.');
        }
      } catch (err) {
        setError('Gagal memverifikasi sertifikat.');
      } finally {
        setIsLoading(false);
      }
    }
    if (code) loadCert();
  }, [code]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-page">
        <Navbar />
        <div className="flex-1 max-w-xl mx-auto px-4 py-24 text-center text-slate-500">
          Memverifikasi data sertifikat...
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !cert) {
    return (
      <div className="min-h-screen flex flex-col bg-page">
        <Navbar />
        <div className="flex-1 max-w-md mx-auto px-4 py-24 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-red-100 text-danger flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Sertifikat Tidak Valid</h2>
          <p className="text-slate-600 text-sm">{error || 'Kode sertifikat tidak ditemukan dalam sistem.'}</p>
          <Link href="/courses" className="inline-block">
            <Button variant="primary">Jelajahi Kursus</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-page">
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 print:hidden">
          <Link
            href="/dashboard/student"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard Siswa</span>
          </Link>

          <Button variant="cta" size="md" onClick={() => window.print()} className="shadow-md">
            <Printer className="w-4 h-4 mr-2" />
            <span>Cetak / Simpan PDF</span>
          </Button>
        </div>

        {/* Certificate Card Design */}
        <div className="relative bg-white border-8 border-double border-teal-800 rounded-3xl p-8 sm:p-14 shadow-2xl overflow-hidden print:border-4 print:shadow-none print:m-0">
          {/* Subtle Background Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
            <BookOpen className="w-[500px] h-[500px] text-teal-900" />
          </div>

          <div className="relative z-10 text-center space-y-8">
            {/* Header Platform */}
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-md">
                <BookOpen className="w-7 h-7 text-accent" />
              </div>
              <span className="text-3xl font-extrabold tracking-tight text-primary">
                Kursus<span className="text-accent">Deh</span>
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-widest text-accent">
                Sertifikat Kelulusan Resmi
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-text-main tracking-tight">
                Certificate of Completion
              </h1>
            </div>

            <p className="text-slate-500 text-sm italic">
              Dengan bangga menyatakan bahwa
            </p>

            {/* Nama Siswa */}
            <div className="py-2">
              <div className="text-3xl sm:text-5xl font-extrabold text-primary tracking-tight underline decoration-amber-400 decoration-2 underline-offset-8">
                {cert.student_name}
              </div>
            </div>

            <p className="text-slate-600 text-sm max-w-xl mx-auto leading-relaxed">
              Telah berhasil menyelesaikan seluruh rangkaian materi pembelajaran, tugas terstruktur, dan diskusi pada kursus online:
            </p>

            {/* Nama Kursus */}
            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 max-w-2xl mx-auto">
              <div className="text-xl sm:text-2xl font-bold text-slate-800">
                {cert.course_title}
              </div>
              <div className="text-xs font-semibold text-teal-700 mt-1">
                Kategori: {cert.category_name}
              </div>
            </div>

            {/* Tanda Tangan & Verifikasi */}
            <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-slate-200 max-w-2xl mx-auto items-end">
              <div className="space-y-1 text-center sm:text-left">
                <div className="font-serif italic text-xl text-slate-800 font-bold">
                  {cert.teacher_name}
                </div>
                <div className="text-xs text-slate-500 font-semibold border-t border-slate-300 pt-1">
                  Pengajar Kursus & Instruktur Ahli
                </div>
              </div>

              <div className="space-y-1 text-center sm:text-right">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-success">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Terverifikasi Secara Digital</span>
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  Kode ID: {cert.certificate_code}
                </div>
                <div className="text-xs text-slate-500">
                  Tanggal:{' '}
                  {new Date(cert.issued_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
