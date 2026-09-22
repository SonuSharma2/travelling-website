'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Menu, X, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Journeys', href: '/journeys' },
    { name: 'Nepal Map', href: '/map' },
    { name: 'About', href: '/about' },
  ];

  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'glass-nav-light py-3.5 shadow-sm'
            : 'bg-gradient-to-b from-white/90 via-white/40 to-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          {/* Logo / Brand */}
          <Link
            href="/"
            className="group flex items-center gap-3 text-left focus:outline-none"
            aria-label="Homepage"
          >
            <span className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center bg-white shadow-sm group-hover:border-[#A87428] transition-colors duration-300">
              <Compass className="w-4 h-4 text-[#A87428] group-hover:rotate-45 transition-transform duration-500 ease-out" />
            </span>
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-[0.25em] font-display font-bold text-[#0D0E12] group-hover:text-[#A87428] transition-colors">
                Sonu Sharma
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#A87428] font-mono font-medium">
                Nepal Travel Journal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative py-1 text-xs uppercase tracking-[0.2em] font-mono transition-colors duration-300 ${
                    isActive ? 'text-[#A87428] font-semibold' : 'text-neutral-600 hover:text-[#0D0E12]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#A87428]"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            <span className="w-[1px] h-4 bg-neutral-300" />

            {/* Admin Studio shortcut */}
            <Link
              href="/admin"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[11px] uppercase tracking-wider font-mono transition-all duration-300 ${
                isAdmin
                  ? 'border-[#A87428] text-[#A87428] bg-[#A87428]/10 font-medium'
                  : 'border-neutral-200 text-neutral-600 hover:text-[#0D0E12] hover:border-neutral-400 bg-white/80 shadow-xs'
              }`}
              title="Admin Dashboard"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#A87428]" />
              <span>Admin Studio</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-neutral-700 hover:text-black hover:bg-neutral-100 transition-colors"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-40 bg-white/98 backdrop-blur-2xl flex flex-col justify-between p-8 pt-28 md:hidden"
          >
            <div className="flex flex-col gap-6">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#A87428] font-mono font-semibold">
                Nepal Expeditions Index
              </span>
              <nav className="flex flex-col gap-5 text-2xl font-display font-bold">
                <Link
                  href="/"
                  className="text-[#0D0E12] hover:text-[#A87428] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  01. Home
                </Link>
                {navLinks.map((link, idx) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`transition-colors ${
                      pathname === link.href ? 'text-[#A87428]' : 'text-neutral-700 hover:text-[#0D0E12]'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    0{idx + 2}. {link.name}
                  </Link>
                ))}
                <Link
                  href="/admin"
                  className="flex items-center gap-2 text-base text-[#A87428] pt-4 border-t border-neutral-200 font-mono tracking-wide uppercase"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin Studio
                </Link>
              </nav>
            </div>

            <div className="border-t border-neutral-200 pt-6 text-xs text-neutral-500 font-mono flex flex-col gap-1">
              <span>LAT 28.2096° N · LON 83.9856° E · NEPAL</span>
              <span>PLACES I&apos;VE BEEN. MOMENTS I&apos;VE KEPT.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
