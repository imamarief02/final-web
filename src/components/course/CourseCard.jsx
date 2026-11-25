'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Badge from '../ui/Badge';
import ContactTeacherModal from './ContactTeacherModal';
import { Users, BookOpen, ArrowRight, Mail, Calendar, PlayCircle, CheckCircle2, Settings } from 'lucide-react';

export default function CourseCard({ course }) {
  const [showContactModal, setShowContactModal] = useState(false);

  const {
    title,
    slug,
    description,
    thumbnail_url,
    level = 'pemula',
    category_name,
    teacher_name,
    teacher_email,
    student_count = 0,
    material_count = 0,
    start_date,
    end_date,
    is_enrolled = false,
    progress_percentage = 0,
    completed_materials = 0,
    next_order = 1,
    user_role = 'guest',
    is_owner = false,
  } = course;

  const fallbackImage = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';

  const mailtoSubject = encodeURIComponent(`Tanya Seputar Kursus: ${title}`);
  const mailtoBody = encodeURIComponent(`Halo ${teacher_name || 'Bapak/Ibu Pengajar'},\n\nSaya tertarik dengan kursus "${title}" di KursusDeh dan ingin bertanya mengenai...`);

  return (
    <div className="group bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl hover:border-teal-300 transition-all duration-300 flex flex-col h-full">
      {/* THUMBNAIL CONTAINER */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <Image
          src={thumbnail_url || fallbackImage}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          unoptimized={Boolean(thumbnail_url && !thumbnail_url.startsWith('/') && !thumbnail_url.includes('images.unsplash.com'))}
        />

        {/* Level & Category Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <Badge variant={level}>
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </Badge>
          {category_name && (
            <Badge variant="category">
              {category_name}
            </Badge>
          )}
        </div>

        {/* Status Progres Badge (Melayang di kanan atas jika sudah daftar) */}
        {is_enrolled && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-slate-900/85 backdrop-blur-xs text-white border border-white/20 shadow-xs flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${progress_percentage === 100 ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
              <span>{progress_percentage === 100 ? 'Lulus' : `${progress_percentage}% Selesai`}</span>
            </span>
          </div>
        )}

        {/* Rentang Waktu Badge (Kanan bawah thumbnail) */}
        {start_date && end_date && (
          <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-lg flex items-center gap-1 z-10">
            <Calendar className="w-3 h-3 text-amber-400" />
            <span>
              {new Date(start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - {new Date(end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        )}

        {/* Accent Progress Line (Garis Tipis di Dasar Gambar jika Terdaftar) */}
        {is_enrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-900/50 z-20 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ease-out ${
                progress_percentage === 100 ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
              style={{ width: `${progress_percentage}%` }}
            />
          </div>
        )}
      </div>

      {/* KONTEN KARTU */}
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        {/* Judul dengan Tinggi Tetap 2 Baris agar Semua Kartu Rata */}
        <h3 className="font-extrabold text-lg text-text-main group-hover:text-primary transition-colors line-clamp-2 h-13 flex items-start mb-2 leading-snug">
          {title}
        </h3>
        
        {/* Deskripsi dengan Tinggi Tetap 2 Baris */}
        <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 h-10 mb-4 leading-relaxed">
          {description}
        </p>

        {/* BARIS PENGAJAR & TOMBOL HUBUNGI GURU */}
        <div className="flex items-center justify-between gap-2 mb-4 py-2.5 border-y border-slate-100 text-xs">
          <div className="flex items-center gap-2 truncate">
            <div className="w-6 h-6 rounded-full bg-teal-100 text-primary font-bold flex items-center justify-center shrink-0 text-xs">
              {teacher_name ? teacher_name.charAt(0) : 'G'}
            </div>
            <span className="font-bold text-slate-800 truncate">{teacher_name || 'Pengajar KursusDeh'}</span>
          </div>

          {is_owner ? (
            <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-primary font-extrabold text-[11px] border border-teal-200">
              Kursus Anda
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setShowContactModal(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-teal-50 hover:text-primary transition-colors font-semibold text-xs shrink-0 border border-slate-200/60 cursor-pointer"
              title={`Hubungi ${teacher_name || 'Pengajar'}`}
            >
              <Mail className="w-3.5 h-3.5 text-primary" />
              <span>Hubungi Guru</span>
            </button>
          )}
        </div>

        {/* FOOTER KARTU (STATISTIK & TOMBOL AKSI) */}
        <div className="mt-auto pt-1 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-medium">
              <Users className="w-4 h-4 text-teal-600" />
              <span>{student_count} Siswa</span>
            </span>

            {material_count > 0 && (
              <span className="flex items-center gap-1 font-medium">
                <BookOpen className="w-4 h-4 text-amber-500" />
                <span>
                  {is_enrolled ? `${completed_materials}/${material_count} Bab` : `${material_count} Bab`}
                </span>
              </span>
            )}
          </div>

          {/* DYNAMIC ACTION BUTTON */}
          {user_role === 'teacher' ? (
            is_owner ? (
              <Link
                href="/dashboard/teacher"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Kelola Kursus</span>
              </Link>
            ) : (
              <Link
                href={`/courses/${slug}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-xs border border-slate-200"
              >
                <span>Lihat Detail</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )
          ) : user_role === 'admin' ? (
            <Link
              href={`/courses/${slug}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-xs border border-slate-200"
            >
              <span>Lihat Detail</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : is_enrolled ? (
            <Link
              href={`/learn/${slug}/${next_order || 1}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Lanjutkan Belajar</span>
            </Link>
          ) : (
            <Link
              href={`/courses/${slug}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <span>Ikuti Course</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* MODAL DIALOG HUBUNGI PENGAJAR */}
      <ContactTeacherModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        teacherName={teacher_name}
        teacherEmail={teacher_email}
        courseTitle={title}
      />
    </div>
  );
}
