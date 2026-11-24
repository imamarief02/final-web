'use client';

import React, { useState, useEffect } from 'react';
import { Mail, X, Copy, Check, ExternalLink } from 'lucide-react';

export default function ContactTeacherModal({
  isOpen,
  onClose,
  teacherName = 'Pengajar KursusDeh',
  teacherEmail = 'pengajar@kursusdeh.com',
  courseTitle = 'Kursus',
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const mailtoSubject = encodeURIComponent(`Tanya Seputar Kursus: ${courseTitle}`);
  const mailtoBody = encodeURIComponent(
    `Halo ${teacherName || 'Bapak/Ibu Pengajar'},\n\nSaya tertarik dengan kursus "${courseTitle}" di KursusDeh dan ingin bertanya mengenai...`
  );

  const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(teacherEmail)}&su=${mailtoSubject}&body=${mailtoBody}`;
  const defaultMailtoUrl = `mailto:${teacherEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(teacherEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative border border-slate-200 text-slate-800 my-auto animate-in zoom-in-95 duration-200 space-y-5">
        {/* Tombol Tutup */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          title="Tutup Dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Dialog */}
        <div className="space-y-1">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary">
            Kontak Pengajar
          </span>
          <h3 className="text-xl font-extrabold text-slate-900">
            Hubungi Guru Kursus
          </h3>
          <p className="text-xs text-slate-500">
            Kirimkan pertanyaan seputar kurikulum, materi, atau bimbingan belajar.
          </p>
        </div>

        {/* Profil Guru */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-primary font-black text-lg flex items-center justify-center shrink-0 shadow-xs">
            {teacherName ? teacherName.charAt(0).toUpperCase() : 'G'}
          </div>
          <div className="space-y-0.5 min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="font-extrabold text-sm text-slate-900 truncate">
                {teacherName || 'Pengajar KursusDeh'}
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                Terverifikasi
              </span>
            </div>
            <div className="text-xs text-slate-500 font-mono truncate">
              {teacherEmail}
            </div>
          </div>
        </div>

        {/* Informasi Kursus yang Ditanyakan */}
        <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-100 text-xs text-slate-700">
          <span className="font-bold text-primary block mb-0.5">Mengenai Kursus:</span>
          <span className="font-medium line-clamp-1">{courseTitle}</span>
        </div>

        {/* Pilihan Cara Menghubungi */}
        <div className="space-y-2.5 pt-1">
          {/* Opsi 1: Buka Gmail Web (Paling Populer & Praktis di Browser, Tanpa Popup Windows) */}
          <a
            href={gmailWebUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Mail className="w-4 h-4 text-accent" />
            <span>Kirim Pesan via Gmail (Tab Baru)</span>
            <ExternalLink className="w-3.5 h-3.5 ml-auto text-teal-200" />
          </a>

          {/* Opsi 2: Salin Alamat Email */}
          <button
            type="button"
            onClick={handleCopyEmail}
            className="w-full py-2.5 px-4 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Email Berhasil Disalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                <span>Salin Alamat Email Pengajar</span>
              </>
            )}
          </button>

          {/* Opsi 3: Buka Aplikasi Email Komputer */}
          <a
            href={defaultMailtoUrl}
            onClick={onClose}
            className="block text-center text-[11px] text-slate-400 hover:text-slate-600 font-medium pt-1 underline"
          >
            Gunakan aplikasi email di komputer saya (Outlook / Mail)
          </a>
        </div>
      </div>
    </div>
  );
}
