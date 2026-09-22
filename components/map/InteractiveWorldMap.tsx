'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Compass, ArrowRight, Mountain, Sparkles, Navigation, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface JourneySummary {
  id: string;
  title: string;
  slug: string;
  cityName: string;
  countryName: string;
  latitude: number;
  longitude: number;
  coverImage: string;
  travelDate: string | Date;
  daysCount: number;
  excerpt: string;
}

interface InteractiveWorldMapProps {
  journeys: JourneySummary[];
}

// Altitude & Geographic region metadata for Nepal destinations
const NEPAL_GEO_DATA: Record<string, { elevation: string; region: 'Himalayas' | 'Mid-Hills' | 'Terai'; district: string }> = {
  mustang: { elevation: '3,840m', region: 'Himalayas', district: 'Mustang District' },
  'namche-bazaar': { elevation: '3,440m', region: 'Himalayas', district: 'Solukhumbu District' },
  pokhara: { elevation: '822m', region: 'Mid-Hills', district: 'Kaski District' },
  kathmandu: { elevation: '1,400m', region: 'Mid-Hills', district: 'Kathmandu Valley' },
  bandipur: { elevation: '1,030m', region: 'Mid-Hills', district: 'Tanahun District' },
  chitwan: { elevation: '150m', region: 'Terai', district: 'Chitwan District' },
};

export default function InteractiveWorldMap({ journeys }: InteractiveWorldMapProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [hoveredPoint, setHoveredPoint] = useState<JourneySummary | null>(null);

  // Nepal Geographic Bounding Box:
  // Longitude: ~80.0°E (West) to ~88.2°E (East) -> Span: 8.2 deg
  // Latitude: ~26.3°N (South) to ~30.5°N (North) -> Span: 4.2 deg
  const getNepalCoordinates = (lat: number, lng: number) => {
    const minLng = 79.8;
    const maxLng = 88.4;
    const minLat = 26.2;
    const maxLat = 30.6;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    // Invert Y because latitude increases going north (upwards)
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;

    return { x: Math.max(5, Math.min(95, x)), y: Math.max(10, Math.min(90, y)) };
  };

  const regions = ['All', 'Himalayas', 'Mid-Hills', 'Terai'];

  const filteredJourneys = useMemo(() => {
    if (selectedRegion === 'All') return journeys;
    return journeys.filter((j) => {
      const geo = NEPAL_GEO_DATA[j.slug];
      return geo?.region === selectedRegion;
    });
  }, [journeys, selectedRegion]);

  return (
    <section id="map-section" className="py-24 sm:py-32 px-6 sm:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#A87428]" />
            <span className="text-xs uppercase tracking-[0.3em] text-[#A87428] font-mono font-medium">
              Geographic Expedition Map
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display text-[#0D0E12] tracking-tight font-bold">
            WHERE I&apos;VE BEEN IN NEPAL
          </h2>
          <p className="mt-3 text-neutral-600 font-serif italic text-lg sm:text-xl max-w-xl">
            From the high trans-Himalayan rain shadow of Mustang down to the subtropical sal forests of Chitwan.
          </p>
        </div>

        {/* Region Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-[#F5F5F4] p-1.5 rounded-full border border-neutral-200">
          {regions.map((region) => {
            const isSelected = selectedRegion === region;
            const count =
              region === 'All'
                ? journeys.length
                : journeys.filter((j) => NEPAL_GEO_DATA[j.slug]?.region === region).length;

            return (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-mono transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#0D0E12] text-white font-medium shadow-md'
                    : 'text-neutral-600 hover:text-[#0D0E12]'
                }`}
              >
                <span>{region}</span>
                <span className="text-[10px] opacity-60">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Map Stage */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] min-h-[440px] max-h-[640px] rounded-3xl overflow-hidden border border-neutral-200 bg-[#FAF9F6] shadow-xl shadow-black/5">
        {/* Topographic elevation contours pattern */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(#000000_1px,transparent_1px)] bg-[size:16px_16px]" />
        </div>

        {/* Realistic Nepal Geographic Outline (SVG) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-8">
          <svg
            viewBox="0 0 900 450"
            className="w-full h-full object-contain filter drop-shadow-sm opacity-90"
          >
            {/* Himalayan Mountain Ridge Range (North) */}
            <path
              d="M 120,130 Q 200,80 320,100 T 520,110 T 700,140 T 820,190 L 800,240 Q 680,260 520,270 T 300,280 T 130,260 Z"
              fill="#F0EDE6"
              stroke="#D6D1C4"
              strokeWidth="2"
            />
            {/* Topographic Relief Ridges */}
            <path
              d="M 160,145 Q 260,110 380,120 T 600,135 T 780,180"
              fill="none"
              stroke="#A87428"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.5"
            />
            <path
              d="M 150,180 Q 280,170 420,180 T 650,200 T 770,220"
              fill="none"
              stroke="#C2B8A3"
              strokeWidth="1"
              opacity="0.6"
            />
            {/* Label watermark */}
            <text
              x="50%"
              y="58%"
              textAnchor="middle"
              className="font-display text-4xl uppercase tracking-[0.35em] fill-neutral-300 font-bold select-none"
            >
              FEDERAL DEMOCRATIC REPUBLIC OF NEPAL
            </text>
          </svg>
        </div>

        {/* Interactive Markers Container */}
        <div className="absolute inset-0 w-full h-full p-4 sm:p-12">
          {journeys.map((j) => {
            const coords = getNepalCoordinates(j.latitude, j.longitude);
            const geo = NEPAL_GEO_DATA[j.slug] || { elevation: '1,000m', region: 'Mid-Hills', district: 'Nepal' };
            const isMatch = selectedRegion === 'All' || geo.region === selectedRegion;
            const isHovered = hoveredPoint?.id === j.id;

            return (
              <div
                key={j.id}
                style={{
                  left: `${coords.x}%`,
                  top: `${coords.y}%`,
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-500 ${
                  isMatch ? 'opacity-100 scale-100' : 'opacity-20 scale-90 pointer-events-none'
                }`}
                onMouseEnter={() => setHoveredPoint(j)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                {/* Outer pulsing ring */}
                <motion.div
                  animate={{
                    scale: [1, 2.4, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.8,
                    ease: 'easeInOut',
                  }}
                  className="absolute -inset-2 rounded-full bg-[#A87428]/30 pointer-events-none"
                />

                {/* Pin button */}
                <Link
                  href={`/journeys/${j.slug}`}
                  className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-md ${
                    isHovered
                      ? 'bg-[#A87428] text-white scale-125 ring-4 ring-[#A87428]/25 shadow-lg'
                      : 'bg-white text-[#0D0E12] border border-neutral-300 hover:border-[#A87428]'
                  }`}
                  aria-label={`Marker for ${j.cityName}, Nepal`}
                >
                  <MapPin className="w-4 h-4 fill-current" />
                </Link>

                {/* City name & Elevation HUD */}
                <div className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none flex flex-col items-center">
                  <span className="text-[11px] font-display font-semibold tracking-wider uppercase px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-[#0D0E12] shadow-sm">
                    {j.title}
                  </span>
                  <span className="text-[9px] font-mono text-[#A87428] font-medium mt-0.5">
                    {geo.elevation}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hover Destination Preview Popover */}
        <AnimatePresence>
          {hoveredPoint && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-6 right-6 z-30 w-80 bg-white rounded-2xl p-4 shadow-2xl border border-neutral-200 pointer-events-auto"
            >
              <div className="relative w-full h-36 rounded-xl overflow-hidden mb-3">
                <Image
                  src={hoveredPoint.coverImage}
                  alt={hoveredPoint.title}
                  fill
                  className="object-cover"
                  sizes="320px"
                />
                <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-white">
                  {NEPAL_GEO_DATA[hoveredPoint.slug]?.elevation || 'Himalayas'}
                </div>
                <div className="absolute bottom-2 right-2 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-mono text-[#0D0E12] font-semibold">
                  {hoveredPoint.daysCount} DAYS
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#A87428] mb-1">
                <span>{NEPAL_GEO_DATA[hoveredPoint.slug]?.district || 'Nepal'}</span>
                <span>{hoveredPoint.cityName}</span>
              </div>

              <h4 className="text-lg font-display font-bold text-[#0D0E12]">{hoveredPoint.title}</h4>
              <p className="text-xs text-neutral-600 line-clamp-2 mt-1 font-serif italic leading-relaxed">
                &ldquo;{hoveredPoint.excerpt}&rdquo;
              </p>

              <Link
                href={`/journeys/${hoveredPoint.slug}`}
                className="mt-3 flex items-center justify-between text-xs text-[#A87428] hover:text-[#0D0E12] pt-2 border-t border-neutral-100 transition-colors uppercase font-mono font-medium tracking-wider"
              >
                <span>Read Expedition Memoir</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Map Corner Status HUD */}
        <div className="absolute top-6 left-6 z-20 flex items-center gap-2.5 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-neutral-200 text-xs font-mono text-[#0D0E12] shadow-sm">
          <Mountain className="w-3.5 h-3.5 text-[#A87428]" />
          <span className="font-medium uppercase tracking-wider">
            {selectedRegion === 'All' ? 'ALL REGIONS OF NEPAL' : `${selectedRegion.toUpperCase()} REGION`}
          </span>
        </div>

        <div className="absolute bottom-6 left-6 z-20 hidden sm:flex items-center gap-2 text-[11px] font-mono text-neutral-500 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-neutral-200">
          <span>LAT 26.2°N — 30.6°N · LON 79.8°E — 88.4°E</span>
        </div>
      </div>

      {/* Selected Region Journey Cards Tray */}
      <div className="mt-14">
        <div className="flex items-center justify-between mb-6 border-b border-neutral-200 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-[0.2em] text-[#A87428] font-mono font-semibold">
              {selectedRegion === 'All' ? 'All Documented Nepal Expeditions' : `${selectedRegion} Expeditions`}
            </span>
            <span className="text-xs text-neutral-500 font-mono">
              ({filteredJourneys.length} {filteredJourneys.length === 1 ? 'chapter' : 'chapters'})
            </span>
          </div>

          {selectedRegion !== 'All' && (
            <button
              onClick={() => setSelectedRegion('All')}
              className="text-xs uppercase tracking-wider text-neutral-500 hover:text-black font-mono underline cursor-pointer"
            >
              Show All
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredJourneys.map((j) => {
            const geo = NEPAL_GEO_DATA[j.slug];
            return (
              <Link
                key={j.id}
                href={`/journeys/${j.slug}`}
                className="group glass-card-light glass-card-light-hover rounded-2xl overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                  <Image
                    src={j.coverImage}
                    alt={j.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] uppercase font-mono tracking-widest text-[#0D0E12] font-semibold shadow-sm">
                    {geo?.elevation || 'Nepal'}
                  </div>
                  <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] uppercase font-mono text-white">
                    {j.daysCount} DAYS
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#A87428] font-medium block">
                      {j.cityName} · {geo?.district || 'Nepal'}
                    </span>
                    <h3 className="text-2xl font-display font-bold text-[#0D0E12] group-hover:text-[#A87428] transition-colors mt-1">
                      {j.title}
                    </h3>
                    <p className="text-sm text-neutral-600 font-serif italic mt-2 line-clamp-2 leading-relaxed">
                      &ldquo;{j.excerpt}&rdquo;
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 group-hover:text-[#0D0E12] transition-colors">
                    <span className="font-mono tracking-wider uppercase text-[11px] font-medium">
                      Open Expedition Chapter
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#A87428] group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
