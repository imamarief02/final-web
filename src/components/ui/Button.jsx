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
    primary: 'bg-primary hover:bg-primary-dark text-white focus:ring-primary shadow-sm',
    cta: 'bg-accent hover:bg-amber-600 text-stone-900 font-bold focus:ring-accent shadow-sm',
    secondary: 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 focus:ring-slate-400',
    danger: 'bg-danger hover:bg-red-800 text-white focus:ring-danger',
    ghost: 'text-primary hover:bg-soft/40 focus:ring-primary',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
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
