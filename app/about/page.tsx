import Image from 'next/image';
import Link from 'next/link';
import { Camera, Compass, MapPin, Mountain, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About The Journal — Nepal Travel Anthology',
  description: 'Photographic memoir, philosophy of travel across Nepal, and camera notes.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-[#0D0E12] pt-32 pb-24 px-6 sm:px-8 max-w-5xl mx-auto">
      {/* Editorial Title */}
      <div className="mb-16 border-b border-neutral-200 pb-8">
        <div className="flex items-center gap-2 mb-3">
          <Compass className="w-4 h-4 text-[#A87428]" />
          <span className="text-xs uppercase tracking-[0.3em] text-[#A87428] font-mono font-semibold">
            Memoir & Optical Craft
          </span>
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold text-[#0D0E12] tracking-tight">
          ABOUT THE JOURNAL
        </h1>
      </div>

      {/* Author Portrait & Intro Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start mb-24">
        <div className="md:col-span-5 relative aspect-[3/4] rounded-2xl overflow-hidden border border-neutral-200 shadow-xl bg-neutral-100">
          <Image
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=85"
            alt="Sonu Sharma - Nepal Documentary Photographer"
            fill
            priority
            className="object-cover filter contrast-[1.05]"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-xs font-mono text-white backdrop-blur-md bg-black/40 p-3 rounded-xl border border-white/20">
            <span>SONU SHARMA · NEPAL EXPEDITION ARCHIVE</span>
          </div>
        </div>

        <div className="md:col-span-7 flex flex-col gap-6 text-neutral-700 font-light text-base sm:text-lg leading-relaxed font-sans">
          <p className="text-2xl sm:text-3xl font-serif italic text-[#0D0E12] leading-snug">
            &ldquo;We walk the ridges of Nepal not to conquer summits, but so that silence may quiet the clamor inside us.&rdquo;
          </p>

          <p>
            This website is my personal digital travel museum dedicated entirely to the geography and spirit of Nepal. It is not an agency, nor a commercial guide. It is a quiet, ongoing record of the Himalayan valleys, trans-Himalayan rain shadows, and ancient Newari bazaars that reshaped how I see light, endurance, and stillness.
          </p>

          <p>
            From freezing dawn rows on Phewa Lake with Machapuchare mirrored in glass water, to the wind-sculpted ochre cliffs of Upper Mustang, carrying prime lenses has been my disciplined way of capturing moments that would otherwise vanish into the mountain mist.
          </p>

          <div className="mt-4 pt-6 border-t border-neutral-200 grid grid-cols-3 gap-6 font-mono text-xs">
            <div>
              <span className="text-2xl font-display font-bold text-[#0D0E12] block">6</span>
              <span className="text-[#A87428] uppercase tracking-wider text-[10px] font-semibold">Nepal Regions</span>
            </div>
            <div>
              <span className="text-2xl font-display font-bold text-[#0D0E12] block">3,840m</span>
              <span className="text-[#A87428] uppercase tracking-wider text-[10px] font-semibold">Highest Altitude</span>
            </div>
            <div>
              <span className="text-2xl font-display font-bold text-[#0D0E12] block">8 Yrs</span>
              <span className="text-[#A87428] uppercase tracking-wider text-[10px] font-semibold">Walking Nepal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Favorite Nepal Memories Section */}
      <section className="mb-24 border-t border-neutral-200 pt-16">
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#0D0E12] mb-8">
          Favorite Nepal Memories
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card-light p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-[#A87428] uppercase tracking-widest block mb-2 font-semibold">
                01 · Pokhara
              </span>
              <h3 className="text-xl font-display font-bold text-[#0D0E12] mb-2">Dawn on Phewa Lake</h3>
              <p className="text-xs text-neutral-600 font-serif italic leading-relaxed">
                Renting a wooden cedar boat at 5:30 AM in freezing mist. Annapurna reflecting with terrifying clarity in pure black water.
              </p>
            </div>
            <Link
              href="/journeys/pokhara"
              className="mt-6 text-xs font-mono uppercase tracking-wider text-[#A87428] hover:text-[#0D0E12] flex items-center gap-1 font-semibold"
            >
              Read story <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="glass-card-light p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-[#A87428] uppercase tracking-widest block mb-2 font-semibold">
                02 · Mustang
              </span>
              <h3 className="text-xl font-display font-bold text-[#0D0E12] mb-2">Sky Caves of Chhoser</h3>
              <p className="text-xs text-neutral-600 font-serif italic leading-relaxed">
                Climbing 3,000-year-old carved cave ladders into cliff chambers where hermit monks spent decades in silence above the desert floor.
              </p>
            </div>
            <Link
              href="/journeys/mustang"
              className="mt-6 text-xs font-mono uppercase tracking-wider text-[#A87428] hover:text-[#0D0E12] flex items-center gap-1 font-semibold"
            >
              Read story <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="glass-card-light p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-[#A87428] uppercase tracking-widest block mb-2 font-semibold">
                03 · Khumbu
              </span>
              <h3 className="text-xl font-display font-bold text-[#0D0E12] mb-2">Himalayan Tea in Namche</h3>
              <p className="text-xs text-neutral-600 font-serif italic leading-relaxed">
                Sitting beside the cast-iron stove burning dried juniper, sipping seabuckthorn tea as Ama Dablam catches the last orange light.
              </p>
            </div>
            <Link
              href="/journeys/namche-bazaar"
              className="mt-6 text-xs font-mono uppercase tracking-wider text-[#A87428] hover:text-[#0D0E12] flex items-center gap-1 font-semibold"
            >
              Read story <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Camera Gear & Craft */}
      <section className="border-t border-neutral-200 pt-16">
        <div className="flex items-center gap-2 mb-3">
          <Camera className="w-4 h-4 text-[#A87428]" />
          <span className="text-xs uppercase tracking-[0.3em] text-[#A87428] font-mono font-semibold">
            The Optical Craft
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#0D0E12] mb-4">
          Camera Equipment & Philosophy
        </h2>
        <p className="text-neutral-600 text-sm sm:text-base font-serif italic leading-relaxed max-w-2xl mb-8">
          Prime glass only. Quiet shutters. Natural light without harsh electronic flashes.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-5 rounded-xl bg-[#FAF9F6] border border-neutral-200">
            <span className="text-neutral-500 block">PRIMARY BODY</span>
            <span className="text-[#0D0E12] text-sm mt-1 block font-semibold">Leica Q2 (28mm f/1.7)</span>
          </div>
          <div className="p-5 rounded-xl bg-[#FAF9F6] border border-neutral-200">
            <span className="text-neutral-500 block">PORTRAIT BODY</span>
            <span className="text-[#0D0E12] text-sm mt-1 block font-semibold">Leica M11 + 50mm Summilux</span>
          </div>
          <div className="p-5 rounded-xl bg-[#FAF9F6] border border-neutral-200">
            <span className="text-neutral-500 block">MEDIUM FORMAT</span>
            <span className="text-[#0D0E12] text-sm mt-1 block font-semibold">Hasselblad 907X 50C</span>
          </div>
          <div className="p-5 rounded-xl bg-[#FAF9F6] border border-neutral-200">
            <span className="text-neutral-500 block">PROCESSING</span>
            <span className="text-[#0D0E12] text-sm mt-1 block font-semibold">Natural color grade, no AI filters</span>
          </div>
        </div>
      </section>
    </div>
  );
}
