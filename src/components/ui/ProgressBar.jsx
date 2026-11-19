import React from 'react';

export default function ProgressBar({
  percentage = 0,
  showLabel = true,
  height = 'h-3',
  className = '',
}) {
  const clamped = Math.min(100, Math.max(0, Math.round(percentage)));

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5 text-sm font-semibold text-slate-700">
          <span>Progres Belajar</span>
          <span className="text-[#0F766E] font-bold">{clamped}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-200 rounded-full overflow-hidden ${height}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            clamped === 100 ? 'bg-[#15803D]' : 'bg-[#0F766E]'
          }`}
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
    </div>
  );
}
