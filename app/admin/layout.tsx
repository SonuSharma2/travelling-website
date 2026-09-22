import { ReactNode } from 'react';
import Link from 'next/link';
import { getAdminSession } from '@/lib/auth';
import { logoutAdmin } from '@/app/actions/auth';
import { redirect } from 'next/navigation';
import { Compass, PlusCircle, ExternalLink, LogOut, Shield } from 'lucide-react';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getAdminSession();

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#0D0E12] flex flex-col font-sans">
      {/* Top Admin Bar */}
      <header className="border-b border-neutral-200 bg-white/95 backdrop-blur-md px-6 py-3.5 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-[#A87428]/15 border border-[#A87428]/30 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-[#A87428]" />
              </span>
              <span className="text-xs uppercase tracking-[0.25em] font-mono text-[#0D0E12] font-semibold">
                Nepal Studio
              </span>
            </Link>

            <nav className="hidden sm:flex items-center gap-4 text-xs font-mono text-neutral-600">
              <Link href="/admin" className="hover:text-[#0D0E12] transition-colors py-1">
                Overview
              </Link>
              <Link href="/admin/journeys" className="hover:text-[#0D0E12] transition-colors py-1">
                Expeditions
              </Link>
              <Link href="/admin/journeys/new" className="text-[#A87428] hover:text-[#8C5C18] transition-colors py-1 flex items-center gap-1 font-semibold">
                <PlusCircle className="w-3.5 h-3.5" />
                New Expedition
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 text-neutral-700 hover:text-black transition-colors px-3 py-1.5 rounded-lg border border-neutral-200 bg-white shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#A87428]" />
              <span className="hidden sm:inline">View Public Website</span>
            </Link>

            {session && (
              <form
                action={async () => {
                  'use server';
                  await logoutAdmin();
                  redirect('/admin/login');
                }}
              >
                <button
                  type="submit"
                  className="flex items-center gap-1 text-neutral-500 hover:text-red-600 transition-colors cursor-pointer"
                  title="Log out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Log out</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-10 sm:py-12">{children}</main>
    </div>
  );
}
