import React from 'react';

export default function Badge({ children, variant = 'default', className = '' }) {
  const styles = {
    pemula: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    menengah: 'bg-sky-100 text-sky-800 border-sky-200',
    lanjutan: 'bg-purple-100 text-purple-800 border-purple-200',
    published: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    draft: 'bg-slate-100 text-slate-700 border-slate-200',
    approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
    category: 'bg-soft text-primary border-teal-200',
    default: 'bg-slate-100 text-slate-800 border-slate-200',
  };

  const selectedStyle = styles[variant.toLowerCase()] || styles.default;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${selectedStyle} ${className}`}
    >
      {children}
    </span>
  );
}
