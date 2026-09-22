'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TimelineJourney {
  id: string;
  title: string;
  slug: string;
  cityName: string;
  countryName: string;
  travelDate: string | Date;
  daysCount: number;
  coverImage: string;
  excerpt: string;
}

interface TravelTimelineProps {
  journeys: TimelineJourney[];
}

export default function TravelTimeline({ journeys }: TravelTimelineProps) {
  const yearsMap: { [year: string]: TimelineJourney[] } = {};
  journeys.forEach((j) => {
    const year = new Date(j.travelDate).getFullYear().toString();
    if (!yearsMap[year]) {
      yearsMap[year] = [];
    }
    yearsMap[year].push(j);
  });

  const years = Object.keys(yearsMap).sort((a, b) => Number(b) - Number(a));
  const [activeYear, setActiveYear] = useState<string>(years[0] || '2026');

  const journeysForYear = yearsMap[activeYear] || [];

  return (
    <section className="py-24 px-6 sm:px-8 max-w-7xl mx-auto border-t border-neutral-200">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#A87428]" />
            <span className="text-xs uppercase tracking-[0.3em] text-[#A87428] font-mono font-semibold">
              Chronology of Wanderlust
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display text-[#0D0E12] tracking-tight font-bold">
            EXPEDITION TIMELINE
          </h2>
        </div>

        {/* Year Selector Pills */}
        <div className="flex items-center gap-3 bg-[#F5F5F4] p-1.5 rounded-full border border-neutral-200">
          {years.map((year) => {
            const isActive = activeYear === year;
            return (
              <button
                key={year}
                onClick={() => setActiveYear(year)}
                className={`px-6 py-2 rounded-full text-xs font-mono tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-[#0D0E12] text-white font-semibold shadow-md'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                {year}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Timeline Tree */}
      <div className="relative pl-6 sm:pl-10 border-l-2 border-neutral-200 flex flex-col gap-12">
        {/* Animated Year Node */}
        <div className="absolute -left-3.5 top-0 w-7 h-7 rounded-full bg-white border-2 border-[#A87428] flex items-center justify-center shadow-md">
          <div className="w-2 h-2 rounded-full bg-[#A87428] animate-ping" />
        </div>

        <div className="text-xs uppercase font-mono tracking-[0.25em] text-[#A87428] font-semibold mb-2">
          Expeditions Documented in {activeYear}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeYear}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {journeysForYear.map((journey) => (
              <Link
                key={journey.id}
                href={`/journeys/${journey.slug}`}
                className="group relative bg-white rounded-2xl overflow-hidden border border-neutral-200 hover:border-[#A87428]/50 transition-all duration-400 shadow-md hover:shadow-xl flex flex-col"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-100">
                  <Image
                    src={journey.coverImage}
                    alt={journey.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-mono text-[#0D0E12] font-semibold uppercase tracking-wider shadow-xs">
                    {journey.cityName}
                  </div>

                  <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-white">
                    {journey.daysCount} DAYS
                  </div>
                </div>

                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-medium">
                      {new Date(journey.travelDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} · Nepal
                    </span>
                    <h3 className="text-2xl font-display font-bold text-[#0D0E12] group-hover:text-[#A87428] transition-colors mt-1">
                      {journey.title}
                    </h3>
                    <p className="mt-2 text-xs text-neutral-600 font-serif italic leading-relaxed line-clamp-2">
                      &ldquo;{journey.excerpt}&rdquo;
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 group-hover:text-[#0D0E12] transition-colors font-medium">
                    <span className="font-mono uppercase tracking-wider text-[11px]">Read Chapter</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#A87428] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
