'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen } from 'lucide-react';

export default function Footer({ user: propUser = null }) {
  const pathname = usePathname();
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    if (propUser !== null) return;
    let isMounted = true;
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok && isMounted) {
          const data = await res.json();
          setAuthUser(data.user);
        }
      } catch (err) {
        // Abaikan
      }
    }
    checkAuth();
    return () => {
      isMounted = false;
    };
  }, [propUser]);

  const user = propUser || authUser;
  return (
    <footer className="bg-primary-dark text-white pt-8 pb-6 mt-auto border-t-2 border-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 mb-6">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-primary shadow-xs">
                <BookOpen className="w-4 h-4 text-accent" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Kursus<span className="text-accent">Deh</span>
              </span>
            </div>
            <p className="text-teal-100/80 text-xs leading-relaxed max-w-sm">
              Platform kursus daring terstruktur untuk mendukung pembelajaran interaktif antara guru dan siswa.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-teal-200 mb-2.5">
              Navigasi
            </h4>
            <ul className="space-y-1.5 text-xs text-teal-100">
              <li>
                <Link
                  href="/"
                  className={`transition-colors ${pathname === '/' ? 'text-accent font-semibold' : 'hover:text-accent'}`}
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/courses"
                  className={`transition-colors ${pathname?.startsWith('/courses') ? 'text-accent font-semibold' : 'hover:text-accent'}`}
                >
                  Katalog Kursus
                </Link>
              </li>
              {user ? (
                <li>
                  <Link
                    href="/dashboard"
                    className={`transition-colors ${pathname?.startsWith('/dashboard') || pathname?.startsWith('/learn') ? 'text-accent font-semibold' : 'hover:text-accent'}`}
                  >
                    Dashboard
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link
                      href="/login"
                      className={`transition-colors ${pathname === '/login' ? 'text-accent font-semibold' : 'hover:text-accent'}`}
                    >
                      Masuk Akun
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/register"
                      className={`transition-colors ${pathname === '/register' ? 'text-accent font-semibold' : 'hover:text-accent'}`}
                    >
                      Daftar Belajar
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Kategori Populer */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-teal-200 mb-2.5">
              Kategori
            </h4>
            <ul className="space-y-1.5 text-xs text-teal-100">
              <li>
                <Link href="/courses?category=web-development" className="hover:text-accent transition-colors">
                  Web Development
                </Link>
              </li>
              <li>
                <Link href="/courses?category=ui-ux-design" className="hover:text-accent transition-colors">
                  UI/UX Design
                </Link>
              </li>
              <li>
                <Link href="/courses?category=data-science" className="hover:text-accent transition-colors">
                  Data Science
                </Link>
              </li>
              <li>
                <Link href="/courses?category=bahasa-asing" className="hover:text-accent transition-colors">
                  Bahasa Asing
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-4 border-t border-teal-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-teal-300/80">
          <div>
            &copy; {new Date().getFullYear()} KursusDeh. Seluruh hak cipta dilindungi undang-undang.
          </div>
          <div>
            Belajar Langkah Demi Langkah
          </div>
        </div>
      </div>
    </footer>
  );
}
