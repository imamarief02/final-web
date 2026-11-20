'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardDispatcher() {
  const router = useRouter();

  useEffect(() => {
    async function redirectRole() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.replace('/login');
          return;
        }

        const data = await res.json();
        const role = data.user?.role;

        if (role === 'admin') {
          router.replace('/dashboard/admin');
        } else if (role === 'teacher') {
          router.replace('/dashboard/teacher');
        } else {
          router.replace('/dashboard/student');
        }
      } catch (err) {
        router.replace('/login');
      }
    }

    redirectRole();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0F766E]" />
        <span className="text-sm font-semibold text-slate-600">Membuka Dashboard Anda...</span>
      </div>
    </div>
  );
}
