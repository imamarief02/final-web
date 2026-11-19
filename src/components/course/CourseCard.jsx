import React from 'react';
import Link from 'next/link';
import Badge from '../ui/Badge';
import { Users, BookOpen, ArrowRight } from 'lucide-react';

export default function CourseCard({ course }) {
  const {
    title,
    slug,
    description,
    thumbnail_url,
    level = 'pemula',
    category_name,
    teacher_name,
    student_count = 0,
    material_count = 0,
  } = course;

  const fallbackImage = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-teal-200 transition-all duration-300 flex flex-col h-full">
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={thumbnail_url || fallbackImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <Badge variant={level}>
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </Badge>
          {category_name && (
            <Badge variant="category">
              {category_name}
            </Badge>
          )}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-bold text-xl text-[#0F172A] group-hover:text-[#0F766E] transition-colors line-clamp-2 mb-2">
          {title}
        </h3>
        
        <p className="text-slate-600 text-sm line-clamp-2 mb-4 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center gap-2 mb-4 text-xs text-slate-500">
          <div className="w-6 h-6 rounded-full bg-teal-100 text-[#0F766E] font-bold flex items-center justify-center">
            {teacher_name ? teacher_name.charAt(0) : 'G'}
          </div>
          <span className="font-medium text-slate-700 truncate">{teacher_name || 'Pengajar KursusDeh'}</span>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-teal-600" />
              <span>{student_count} Siswa</span>
            </span>
            {material_count > 0 && (
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-500" />
                <span>{material_count} Materi</span>
              </span>
            )}
          </div>

          <Link
            href={`/courses/${slug}`}
            className="inline-flex items-center gap-1 text-sm font-bold text-[#0F766E] group-hover:text-[#134E4A] hover:underline"
          >
            <span>Detail</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
