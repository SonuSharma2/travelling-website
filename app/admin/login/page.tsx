'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '@/app/actions/auth';
import { Compass, ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@traveljournal.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await loginAdmin(email, password);
      if (res.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(res.error || 'Authentication failed');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white border border-neutral-200 rounded-3xl p-8 sm:p-10 shadow-xl relative">
        <div className="flex flex-col items-center text-center mb-8">
          <span className="w-12 h-12 rounded-full border border-[#A87428]/30 flex items-center justify-center bg-[#A87428]/10 mb-4 shadow-xs">
            <ShieldCheck className="w-6 h-6 text-[#A87428]" />
          </span>
          <span className="text-xs uppercase tracking-[0.3em] text-[#A87428] font-mono font-semibold">
            Nepal Travel Studio
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#0D0E12] mt-1">
            Administrator Access
          </h1>
          <p className="text-xs text-neutral-500 mt-2 font-serif italic">
            Curate your personal Nepal anthology, upload photographs, and publish new journeys.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs text-center font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-xs uppercase font-mono tracking-wider text-neutral-600 block mb-2 font-medium">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-50 border border-neutral-300 text-[#0D0E12] text-sm focus:outline-none focus:border-[#A87428] transition-colors"
                placeholder="admin@traveljournal.com"
              />
            </div>
          </div>

          <div>
            <label className="text-xs uppercase font-mono tracking-wider text-neutral-600 block mb-2 font-medium">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-50 border border-neutral-300 text-[#0D0E12] text-sm focus:outline-none focus:border-[#A87428] transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-3.5 rounded-xl bg-[#0D0E12] text-white font-semibold text-xs uppercase tracking-[0.2em] font-mono hover:bg-[#A87428] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Enter Studio</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-100 text-center text-xs text-neutral-400 font-mono">
          <span>Demo Access: admin@traveljournal.com / admin123</span>
        </div>
      </div>
    </div>
  );
}
