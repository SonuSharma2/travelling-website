'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Compass, ChevronDown, Sparkles, MapPin, Eye, Mountain } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';

export default function CinematicHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Subtle mouse movement parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20;
      const y = (e.clientY / innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.15]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  const scrollToExplore = () => {
    const mapSection = document.getElementById('map-section');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative h-screen min-h-[720px] w-full overflow-hidden flex items-center justify-center bg-white"
    >
      {/* Background Image Container with Parallax & Mouse Movement */}
      <motion.div
        style={{
          scale: imageScale,
          y: imageY,
          x: mousePos.x * 0.35,
        }}
        transition={{ type: 'spring', damping: 40, stiffness: 80 }}
        className="absolute inset-0 w-full h-full"
      >
        <Image
          src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2560&q=90"
          alt="Annapurna Range over Phewa Lake at Dawn, Nepal"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter contrast-[1.04] brightness-[0.92]"
        />

        {/* Soft Vignette and Clean Editorial Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white/60" />
      </motion.div>

      {/* Floating Meta Badges */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="absolute top-28 left-6 sm:left-12 hidden lg:flex items-center gap-3 text-xs font-mono text-[#0D0E12] tracking-wider bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-neutral-200 shadow-md"
      >
        <span className="w-2 h-2 rounded-full bg-[#A87428] animate-pulse" />
        <span className="font-semibold">NEPAL ANTHOLOGY · 2026 ARCHIVE</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute top-28 right-6 sm:right-12 hidden lg:flex items-center gap-3 text-xs font-mono text-[#0D0E12] tracking-wider bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-neutral-200 shadow-md"
      >
        <Mountain className="w-3.5 h-3.5 text-[#A87428]" />
        <span>HIMALAYAN FOOTHILLS & HIGHLANDS</span>
      </motion.div>

      {/* Main Hero Content */}
      <motion.div
        style={{
          y: textY,
          opacity: textOpacity,
          x: -mousePos.x * 0.15,
        }}
        className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center mt-12"
      >
        {/* Subtitle tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-3 mb-6"
        >
          <span className="h-[1px] w-8 sm:w-12 bg-[#A87428]" />
          <span className="text-xs sm:text-sm tracking-[0.35em] uppercase text-[#A87428] font-mono font-bold">
            Personal Photographic World
          </span>
          <span className="h-[1px] w-8 sm:w-12 bg-[#A87428]" />
        </motion.div>

        {/* Big Editorial Title with Cool Syne Font */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-extrabold text-[#0D0E12] tracking-tight leading-[1.02] drop-shadow-sm"
        >
          MY TRAVEL JOURNAL
        </motion.h1>

        {/* Poetic Subtitle in Cormorant Garamond */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-xl sm:text-2xl md:text-3xl text-neutral-800 font-serif italic tracking-wide max-w-2xl text-balance"
        >
          &ldquo;Places I&apos;ve been. Moments I&apos;ve kept.&rdquo;
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={scrollToExplore}
            className="group px-8 py-4 rounded-full bg-[#0D0E12] text-white font-mono text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 hover:bg-[#A87428] flex items-center gap-3 shadow-xl cursor-pointer"
          >
            <span>Explore Nepal Map</span>
            <Compass className="w-4 h-4 text-[#C28E46] group-hover:rotate-45 transition-transform duration-300" />
          </button>

          <Link
            href="/journeys"
            className="px-8 py-4 rounded-full border border-neutral-300 bg-white/90 backdrop-blur-md text-[#0D0E12] font-mono text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 hover:border-[#0D0E12] hover:bg-white flex items-center gap-3 shadow-md"
          >
            <Eye className="w-4 h-4 text-[#A87428]" />
            <span>View Chapters</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Bottom Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 cursor-pointer group"
        onClick={scrollToExplore}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-600 font-mono font-medium group-hover:text-black transition-colors">
          Scroll to enter
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border-2 border-neutral-300 flex items-start justify-center p-1 group-hover:border-[#A87428] transition-colors bg-white/80"
        >
          <div className="w-1.5 h-2 rounded-full bg-[#A87428]" />
        </motion.div>
      </motion.div>
    </div>
  );
}
