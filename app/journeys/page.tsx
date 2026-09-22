import prisma from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin, Camera, Compass, Mountain } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nepal Expeditions Archive — Travel Journal',
  description: 'Complete photographic archive of journeys across Nepal: Pokhara, Mustang, Kathmandu, Namche, Bandipur, and Chitwan.',
};

export const revalidate = 0;

export default async function JourneysArchivePage() {
  const journeys = await prisma.journey.findMany({
    where: { published: true },
    orderBy: { travelDate: 'desc' },
    include: {
      photos: { select: { id: true } },
    },
  });

  return (
    <div className="min-h-screen bg-white text-[#0D0E12] pt-32 pb-24 px-6 sm:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-16 border-b border-neutral-200 pb-12">
        <div className="flex items-center gap-2 mb-3">
          <Compass className="w-4 h-4 text-[#A87428]" />
          <span className="text-xs uppercase tracking-[0.3em] text-[#A87428] font-mono font-semibold">
            Nepal Expeditions Folio
          </span>
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-display text-[#0D0E12] font-extrabold tracking-tight">
          JOURNEY CATALOGUE
        </h1>
        <p className="mt-4 text-neutral-600 font-serif italic text-xl sm:text-2xl max-w-2xl text-balance">
          An ongoing chronology of remote Himalayan passes, ancient Newari towns, and quiet mornings beside glacial lakes.
        </p>

        {/* Stats Strip */}
        <div className="mt-8 flex flex-wrap items-center gap-8 text-xs font-mono text-neutral-500">
          <div>
            <span className="text-[#0D0E12] text-xl font-display font-bold">{journeys.length}</span>{' '}
            <span className="uppercase tracking-widest text-[#A87428]">Chapters</span>
          </div>
          <div>
            <span className="text-[#0D0E12] text-xl font-display font-bold">150m — 3,840m</span>{' '}
            <span className="uppercase tracking-widest text-[#A87428]">Altitude Range</span>
          </div>
          <div>
            <span className="text-[#0D0E12] text-xl font-display font-bold">
              {journeys.reduce((acc, j) => acc + (j.photos?.length || 0), 0)}
            </span>{' '}
            <span className="uppercase tracking-widest text-[#A87428]">Archived Exposures</span>
          </div>
        </div>
      </div>

      {/* Journeys List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {journeys.map((journey) => {
          const year = new Date(journey.travelDate).getFullYear();
          const photoCount = journey.photos?.length || 6;

          return (
            <Link
              key={journey.id}
              href={`/journeys/${journey.slug}`}
              className="group glass-card-light glass-card-light-hover rounded-2xl overflow-hidden flex flex-col"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                <Image
                  src={journey.coverImage}
                  alt={journey.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-mono uppercase tracking-widest text-[#0D0E12] font-semibold shadow-xs">
                  {journey.cityName} · {year}
                </div>

                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-white flex items-center gap-1">
                  <Camera className="w-3 h-3 text-[#C28E46]" />
                  {photoCount}
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 mb-1">
                    <MapPin className="w-3 h-3 text-[#A87428]" />
                    <span>{journey.cityName}</span>
                    <span>·</span>
                    <span>{journey.daysCount} Days</span>
                  </div>

                  <h3 className="text-2xl font-display font-bold text-[#0D0E12] group-hover:text-[#A87428] transition-colors">
                    {journey.title}
                  </h3>

                  <p className="mt-2 text-sm text-neutral-600 font-serif italic line-clamp-2 leading-relaxed">
                    &ldquo;{journey.excerpt}&rdquo;
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 group-hover:text-[#0D0E12] transition-colors font-medium">
                  <span className="font-mono uppercase tracking-wider text-[11px]">Open Folio</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#A87428] group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
