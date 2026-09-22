import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { PlusCircle, Edit, Camera, Trash2, Copy, ExternalLink, Globe, Lock } from 'lucide-react';
import { deleteJourney, duplicateJourney, togglePublishJourney } from '@/app/actions/journeys';

export const revalidate = 0;

export default async function AdminJourneysListPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const journeys = await prisma.journey.findMany({
    orderBy: { travelDate: 'desc' },
    include: {
      _count: { select: { photos: true } },
    },
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-[#A87428] font-semibold block mb-1">
            Expedition Archives
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#0D0E12]">Nepal Journeys</h1>
        </div>

        <Link
          href="/admin/journeys/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0D0E12] text-white font-mono text-xs uppercase tracking-widest font-semibold hover:bg-[#A87428] transition-colors shadow-sm"
        >
          <PlusCircle className="w-4 h-4 text-[#C28E46]" />
          <span>New Expedition</span>
        </Link>
      </div>

      {/* Journeys Table / List */}
      <div className="glass-card-light rounded-2xl overflow-hidden">
        <div className="divide-y divide-neutral-100">
          {journeys.length === 0 ? (
            <div className="p-12 text-center text-neutral-500 font-mono text-xs">
              No journeys created yet. Click &ldquo;New Expedition&rdquo; to begin documenting.
            </div>
          ) : (
            journeys.map((j) => (
              <div
                key={j.id}
                className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-neutral-50/70 transition-colors"
              >
                {/* Info block */}
                <div className="flex items-center gap-5">
                  <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-200">
                    <Image src={j.coverImage} alt={j.title} fill className="object-cover" />
                  </div>

                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-display font-bold text-[#0D0E12]">{j.title}</h3>
                      {j.published ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-mono border border-emerald-200 flex items-center gap-1 font-medium">
                          <Globe className="w-3 h-3" /> Live
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-mono border border-amber-200 flex items-center gap-1 font-medium">
                          <Lock className="w-3 h-3" /> Draft
                        </span>
                      )}
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-500">
                      <span>Nepal</span>
                      <span>·</span>
                      <span>{j.cityName}</span>
                      <span>·</span>
                      <span>{new Date(j.travelDate).getFullYear()}</span>
                      <span>·</span>
                      <span className="text-[#A87428] font-semibold">{j._count.photos} photos</span>
                      <span>·</span>
                      <span>/{j.slug}</span>
                    </div>
                  </div>
                </div>

                {/* Operations Toolbar */}
                <div className="flex items-center gap-2 self-end md:self-center">
                  {/* Toggle publish button */}
                  <form
                    action={async () => {
                      'use server';
                      await togglePublishJourney(j.id, j.published);
                    }}
                  >
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-100 text-xs font-mono text-neutral-700 transition-colors cursor-pointer shadow-xs"
                      title={j.published ? 'Unpublish to Draft' : 'Publish to Live'}
                    >
                      {j.published ? 'Unpublish' : 'Publish'}
                    </button>
                  </form>

                  {/* Manage Photos */}
                  <Link
                    href={`/admin/journeys/${j.id}/photos`}
                    className="px-3.5 py-1.5 rounded-lg bg-[#A87428]/10 hover:bg-[#A87428]/20 border border-[#A87428]/30 text-xs font-mono text-[#A87428] font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Photos ({j._count.photos})</span>
                  </Link>

                  {/* Edit details */}
                  <Link
                    href={`/admin/journeys/${j.id}`}
                    className="p-2 rounded-lg bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-700 transition-colors shadow-xs"
                    title="Edit Details"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>

                  {/* Duplicate */}
                  <form
                    action={async () => {
                      'use server';
                      await duplicateJourney(j.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="p-2 rounded-lg bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-700 transition-colors cursor-pointer shadow-xs"
                      title="Duplicate Journey"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </form>

                  {/* View Public Page */}
                  <Link
                    href={`/journeys/${j.slug}`}
                    target="_blank"
                    className="p-2 rounded-lg bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-700 transition-colors shadow-xs"
                    title="View live folio"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  {/* Delete */}
                  <form
                    action={async () => {
                      'use server';
                      await deleteJourney(j.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="p-2 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 transition-colors cursor-pointer shadow-xs"
                      title="Delete Journey"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
