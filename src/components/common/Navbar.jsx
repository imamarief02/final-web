'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { BookOpen, Menu, X } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const roleLabels = {
    admin: 'Admin',
    teacher: 'Pengajar',
    student: 'Siswa',
  };

  const navItems = [
    { label: 'Beranda', href: '/', isActive: pathname === '/' },
    { label: 'Katalog Kursus', href: '/courses', isActive: pathname.startsWith('/courses') },
    ...(user ? [{ label: 'Dashboard', href: '/dashboard', isActive: pathname.startsWith('/dashboard') || pathname.startsWith('/learn') }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#0F766E] flex items-center justify-center text-white shadow-sm shadow-teal-900/10 group-hover:scale-105 transition-transform duration-200">
              <BookOpen className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#0F766E]">
                Kursus<span className="text-[#F59E0B]">Deh</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium -mt-1 hidden sm:block">
                Belajar Langkah Demi Langkah
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm transition-all duration-200 ${
                  item.isActive
                    ? 'bg-teal-50 border-2 border-[#0F766E] text-[#0F766E] font-extrabold shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/70 font-semibold'
                }`}
              >
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Auth Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {!isLoading && (
              <>
                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="text-right select-none">
                      <div className="text-sm font-bold text-slate-800 leading-tight">
                        {user.name}
                      </div>
                      <div className="text-xs text-slate-500 capitalize">{roleLabels[user.role]}</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-[#B91C1C] border border-red-200 text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5">
                    <Link
                      href="/login"
                      className="px-4 py-2 rounded-xl border-2 border-[#0F766E] text-[#0F766E] text-sm font-bold hover:bg-[#0F766E] hover:text-white transition-all duration-200"
                    >
                      Masuk
                    </Link>
                    <Link
                      href="/register"
                      className="px-4 py-2 rounded-xl bg-[#F59E0B] hover:bg-amber-600 text-[#1C1917] text-sm font-bold transition-all duration-200 shadow-sm"
                    >
                      Daftar Akun
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all ${
                  item.isActive
                    ? 'bg-teal-50 border-2 border-[#0F766E] text-[#0F766E] font-extrabold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-semibold'
                }`}
              >
                <span>{item.label}</span>
                {item.isActive && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#0F766E] text-white">
                    Sedang Dibuka
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="pt-2">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div>
                    <div className="font-bold text-slate-800">{user.name}</div>
                    <div className="text-xs text-slate-500">{user.email} • {roleLabels[user.role]}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center justify-center w-full py-2.5 text-[#B91C1C] font-semibold border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 border-2 border-[#0F766E] text-[#0F766E] font-bold rounded-xl"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 bg-[#F59E0B] text-[#1C1917] font-bold rounded-xl"
                >
                  Daftar Akun Baru
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
