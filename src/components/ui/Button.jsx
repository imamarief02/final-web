import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  isLoading = false,
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer min-h-[44px]';

  const variants = {
    primary: 'bg-[#0F766E] hover:bg-[#134E4A] text-white focus:ring-[#0F766E] shadow-sm',
    cta: 'bg-[#F59E0B] hover:bg-amber-600 text-[#1C1917] font-bold focus:ring-[#F59E0B] shadow-sm',
    secondary: 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 focus:ring-slate-400',
    danger: 'bg-[#B91C1C] hover:bg-red-800 text-white focus:ring-[#B91C1C]',
    ghost: 'text-[#0F766E] hover:bg-[#CCFBF1]/40 focus:ring-[#0F766E]',
    outline: 'border-2 border-[#0F766E] text-[#0F766E] hover:bg-[#0F766E] hover:text-white focus:ring-[#0F766E]',
  };

  const sizes = {
    sm: 'text-sm py-2 px-3 min-h-[38px] rounded-lg',
    md: 'text-base py-2.5 px-5 min-h-[44px] rounded-xl',
    lg: 'text-lg py-3 px-7 min-h-[50px] rounded-2xl',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Memuat...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
