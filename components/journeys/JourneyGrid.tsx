'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar, MapPin, Camera, Mountain } from 'lucide-react';
import { motion } from 'motion/react';

interface JourneyItem {
  id: string;
  title: string;
  slug: string;
  countryName: string;
  cityName: string;
  travelDate: string | Date;
  daysCount: number;
  coverImage: string;
  excerpt: string;
  photos?: { id: string }[];
  _count?: { photos: number };
}

interface JourneyGridProps {
  journeys: JourneyItem[];
}

export default function JourneyGrid({ journeys }: JourneyGridProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="py-24 px-6 sm:px-8 max-w-7xl mx-auto">
      {/* Section Headline */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-neutral-200 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#A87428]" />
            <span className="text-xs uppercase tracking-[0.3em] text-[#A87428] font-mono font-semibold">
              Folio Chapters
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display text-[#0D0E12] tracking-tight font-bold">
            NEPAL EXPEDITIONS
          </h2>
        </div>

        <p className="text-neutral-600 font-serif italic text-lg sm:text-xl max-w-md">
          Each journey documented as an individual chapter. Unfold the geography of Annapurna dawns, ancient Mustang cliffs, and Newari brickwork.
        </p>
      </div>

      {/* Chapters Grid - Asymmetrical Editorial Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {journeys.map((j, idx) => {
          const isWide = idx % 3 === 0;
          const colSpan = isWide ? 'lg:col-span-8' : 'lg:col-span-4';
          const photoCount = j._count?.photos || j.photos?.length || 8;
          const year = new Date(j.travelDate).getFullYear();

          return (
            <div
              key={j.id}
              className={`${colSpan} flex flex-col`}
              onMouseEnter={() => setHoveredId(j.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Link
                href={`/journeys/${j.slug}`}
                className="group relative rounded-3xl overflow-hidden glass-card-light glass-card-light-hover flex flex-col h-full"
              >
                {/* Image Container with depth zoom */}
                <div
                  className={`relative w-full overflow-hidden bg-neutral-100 ${
                    isWide ? 'aspect-[16/10] sm:aspect-[16/9]' : 'aspect-[4/3] sm:aspect-[4/4]'
                  }`}
                >
                  <Image
                    src={j.coverImage}
                    alt={j.title}
                    fill
                    sizes={isWide ? '(max-width: 1024px) 100vw, 66vw' : '(max-width: 1024px) 100vw, 33vw'}
                    className="object-cover object-center filter transition-transform duration-1000 ease-out group-hover:scale-106"
                  />

                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-70 transition-opacity duration-500 group-hover:opacity-85" />

                  {/* Top badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-mono tracking-widest text-[#0D0E12] font-semibold uppercase shadow-xs">
                      {j.cityName} · {year}
                    </span>

                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono tracking-wider text-white flex items-center gap-1.5">
                      <Camera className="w-3 h-3 text-[#C28E46]" />
                      {photoCount} Frames
                    </span>
                  </div>

                  {/* Hover Floating Action indicator */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                    <span className="px-6 py-3 rounded-full bg-white text-[#0D0E12] text-xs uppercase font-mono tracking-[0.2em] font-semibold shadow-2xl flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <span>Open Folio</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#A87428]" />
                    </span>
                  </div>
                </div>

                {/* Content Footer */}
                <div className="p-6 sm:p-8 flex flex-col justify-between flex-grow bg-white">
                  <div>
                    <div className="flex items-center gap-3 text-xs font-mono text-neutral-500 mb-2">
                      <span className="flex items-center gap-1 text-[#A87428] font-medium">
                        <MapPin className="w-3 h-3" />
                        {j.cityName}
                      </span>
                      <span>·</span>
                      <span>{j.daysCount} Days Expedition</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-display font-bold text-[#0D0E12] group-hover:text-[#A87428] transition-colors">
                      {j.title}
                    </h3>

                    <p className="mt-3 text-sm text-neutral-600 font-serif italic leading-relaxed line-clamp-2">
                      &ldquo;{j.excerpt}&rdquo;
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 group-hover:text-[#0D0E12] transition-colors font-medium">
                    <span className="font-mono tracking-widest uppercase text-[11px]">
                      View Photographs & Memoir
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#A87428] group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
