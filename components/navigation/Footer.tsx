'use client';

import Link from 'next/link';
import { ArrowUp, Compass, Camera, Mountain } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-neutral-200 bg-[#FAF9F6] text-neutral-600 py-16 px-6 sm:px-8 mt-24">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand & Manifesto */}
          <div className="md:col-span-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full border border-[#A87428]/30 flex items-center justify-center bg-[#A87428]/10 shadow-xs">
                <Compass className="w-4 h-4 text-[#A87428]" />
              </span>
              <span className="text-sm font-display tracking-widest uppercase text-[#0D0E12] font-bold">
                Sonu Sharma — Nepal Travel World
              </span>
            </div>
            <p className="text-neutral-600 text-sm max-w-md font-serif italic leading-relaxed text-balance">
              An intimate visual anthology of Nepal. Documenting Himalayan altitudes, Newar courtyard courtyards, Buddhist prayer rituals, and morning mist over sacred lakes.
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-neutral-500 pt-2">
              <span className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#A87428]" /> Leica Q2 & Hasselblad 907X
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Mountain className="w-3.5 h-3.5 text-[#A87428]" /> 150m — 3,840m Elevation
              </span>
            </div>
          </div>

          {/* Quick Index */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="text-xs uppercase tracking-[0.2em] text-[#A87428] font-mono font-semibold">
              Nepal Expeditions
            </span>
            <div className="flex flex-col gap-2 text-sm font-sans">
              <Link href="/journeys/pokhara" className="hover:text-[#0D0E12] transition-colors">
                Pokhara (Phewa Lake)
              </Link>
              <Link href="/journeys/mustang" className="hover:text-[#0D0E12] transition-colors">
                Upper Mustang (Lo Manthang)
              </Link>
              <Link href="/journeys/kathmandu" className="hover:text-[#0D0E12] transition-colors">
                Kathmandu Valley
              </Link>
              <Link href="/journeys/namche-bazaar" className="hover:text-[#0D0E12] transition-colors">
                Namche Bazaar (Khumbu)
              </Link>
              <Link href="/journeys/bandipur" className="hover:text-[#0D0E12] transition-colors">
                Bandipur (Tanahun Hills)
              </Link>
              <Link href="/journeys/chitwan" className="hover:text-[#0D0E12] transition-colors">
                Chitwan (Rapti Plains)
              </Link>
            </div>
          </div>

          {/* Navigation & Controls */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="text-xs uppercase tracking-[0.2em] text-[#A87428] font-mono font-semibold">
              Explore
            </span>
            <div className="flex flex-col gap-2 text-sm font-sans">
              <Link href="/journeys" className="hover:text-[#0D0E12] transition-colors">
                All Chapters
              </Link>
              <Link href="/map" className="hover:text-[#0D0E12] transition-colors">
                Interactive Nepal Map
              </Link>
              <Link href="/about" className="hover:text-[#0D0E12] transition-colors">
                About The Journal
              </Link>
              <Link href="/admin" className="hover:text-[#A87428] transition-colors font-mono">
                Admin Studio
              </Link>
            </div>

            <button
              onClick={scrollToTop}
              className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#A87428] hover:text-[#0D0E12] font-mono transition-colors group cursor-pointer"
            >
              Back to Top
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500">
          <div>
            © {new Date().getFullYear()} Sonu Sharma. All photographs and writings copyright protected.
          </div>
          <div className="flex items-center gap-2">
            <span>Places I&apos;ve been. Moments I&apos;ve kept.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
