import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { PlusCircle, Compass, Camera, MapPin, Layers, ExternalLink, Edit, CheckCircle } from 'lucide-react';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const [journeysCount, photosCount, publishedCount, recentJourneys] =
    await Promise.all([
      prisma.journey.count(),
      prisma.photo.count(),
      prisma.journey.count({ where: { published: true } }),
      prisma.journey.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 6,
        include: {
          _count: { select: { photos: true } },
        },
      }),
    ]);

  return (
    <div className="flex flex-col gap-10">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-8">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-[#A87428] font-semibold block mb-1">
            Welcome back, {session.name}
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#0D0E12]">
            Nepal Travel Journal Studio
          </h1>
        </div>

        <Link
          href="/admin/journeys/new"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0D0E12] text-white font-mono text-xs uppercase tracking-widest font-semibold hover:bg-[#A87428] transition-colors shadow-md"
        >
          <PlusCircle className="w-4 h-4 text-[#C28E46]" />
          <span>New Expedition</span>
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card-light p-6 rounded-2xl">
          <div className="flex items-center justify-between text-neutral-500 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider font-medium">Nepal Chapters</span>
            <Compass className="w-4 h-4 text-[#A87428]" />
          </div>
          <div className="text-3xl font-display font-bold text-[#0D0E12]">{journeysCount}</div>
          <span className="text-[11px] font-mono text-neutral-500 mt-1 block">
            {publishedCount} live on website
          </span>
        </div>

        <div className="glass-card-light p-6 rounded-2xl">
          <div className="flex items-center justify-between text-neutral-500 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider font-medium">Archived Photos</span>
            <Camera className="w-4 h-4 text-[#A87428]" />
          </div>
          <div className="text-3xl font-display font-bold text-[#0D0E12]">{photosCount}</div>
          <span className="text-[11px] font-mono text-neutral-500 mt-1 block">
            Curated 35mm exposures
          </span>
        </div>

        <div className="glass-card-light p-6 rounded-2xl">
          <div className="flex items-center justify-between text-neutral-500 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider font-medium">Country Focus</span>
            <MapPin className="w-4 h-4 text-[#A87428]" />
          </div>
          <div className="text-2xl font-display font-bold text-[#0D0E12]">Nepal (100%)</div>
          <span className="text-[11px] font-mono text-neutral-500 mt-1 block">
            Himalayas · Hills · Terai
          </span>
        </div>

        <div className="glass-card-light p-6 rounded-2xl">
          <div className="flex items-center justify-between text-neutral-500 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider font-medium">Media Pipeline</span>
            <Layers className="w-4 h-4 text-[#A87428]" />
          </div>
          <div className="text-base font-display font-bold text-[#0D0E12]">Cloudinary / Local</div>
          <span className="text-[11px] font-mono text-emerald-600 mt-1 flex items-center gap-1 font-medium">
            <CheckCircle className="w-3.5 h-3.5" /> Engine Ready
          </span>
        </div>
      </div>

      {/* Recent Journeys Table */}
      <div className="glass-card-light rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-lg font-display font-bold text-[#0D0E12]">All Documented Expeditions</h2>
          <Link
            href="/admin/journeys"
            className="text-xs font-mono uppercase tracking-wider text-[#A87428] hover:underline font-semibold"
          >
            Manage All ({journeysCount})
          </Link>
        </div>

        <div className="divide-y divide-neutral-100">
          {recentJourneys.map((j) => (
            <div key={j.id} className="p-4 sm:p-6 flex items-center justify-between gap-4 hover:bg-neutral-50/60 transition-colors">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-200">
                  <Image src={j.coverImage} alt={j.title} fill className="object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-display font-bold text-[#0D0E12]">{j.title}</h3>
                    {j.published ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-mono border border-emerald-200 font-medium">
                        Live
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-mono border border-amber-200 font-medium">
                        Draft
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-neutral-500">
                    {j.cityName} · {j._count.photos} photographs · {j.daysCount} days
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/admin/journeys/${j.id}/photos`}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-neutral-100 border border-neutral-200 text-xs font-mono text-[#0D0E12] flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Camera className="w-3.5 h-3.5 text-[#A87428]" />
                  <span className="hidden sm:inline">Photos</span>
                </Link>

                <Link
                  href={`/admin/journeys/${j.id}`}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-neutral-100 border border-neutral-200 text-xs font-mono text-[#0D0E12] flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Edit</span>
                </Link>

                <Link
                  href={`/journeys/${j.slug}`}
                  target="_blank"
                  className="p-1.5 text-neutral-400 hover:text-black transition-colors"
                  title="View Public Folio"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
