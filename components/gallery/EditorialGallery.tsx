'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Camera, Maximize2, MapPin } from 'lucide-react';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import { motion, AnimatePresence } from 'motion/react';

interface PhotoItem {
  id: string;
  imageUrl: string;
  thumbnailUrl?: string | null;
  caption?: string | null;
  location?: string | null;
  category: string;
  aspectRatio: string;
  isFeatured: boolean;
}

interface EditorialGalleryProps {
  photos: PhotoItem[];
  journeyTitle: string;
}

export default function EditorialGallery({ photos, journeyTitle }: EditorialGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);

  const categories = ['All', ...Array.from(new Set(photos.map((p) => p.category)))];

  const filteredPhotos =
    activeCategory === 'All'
      ? photos
      : photos.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());

  const slides = filteredPhotos.map((p) => ({
    src: p.imageUrl,
    title: p.caption || journeyTitle,
    description: p.location ? `📍 ${p.location}` : undefined,
  }));

  const getAspectClass = (ratio: string, isFeatured: boolean) => {
    if (isFeatured) return 'aspect-[16/9] md:col-span-2 md:row-span-2';
    switch (ratio) {
      case '16/9':
        return 'aspect-[16/9] md:col-span-2';
      case '4/3':
        return 'aspect-[4/3]';
      case '3/2':
        return 'aspect-[3/2]';
      case '1/1':
        return 'aspect-square';
      case '2/3':
        return 'aspect-[2/3] md:row-span-2';
      case '3/4':
        return 'aspect-[3/4]';
      default:
        return 'aspect-[3/2]';
    }
  };

  return (
    <section className="py-24 px-6 sm:px-8 max-w-7xl mx-auto">
      {/* Gallery Header & Filter Pills */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-neutral-200 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Camera className="w-4 h-4 text-[#A87428]" />
            <span className="text-xs uppercase tracking-[0.3em] text-[#A87428] font-mono font-semibold">
              Curated Folio
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display text-[#0D0E12] tracking-tight font-bold">
            PHOTOGRAPHIC ARCHIVE
          </h2>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 bg-[#F5F5F4] p-1.5 rounded-full border border-neutral-200">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-mono transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-[#0D0E12] text-white font-medium shadow-md'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Asymmetrical Editorial Masonry Grid */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 auto-rows-[280px]">
        <AnimatePresence>
          {filteredPhotos.map((photo, index) => {
            const aspectClass = getAspectClass(photo.aspectRatio, photo.isFeatured);

            return (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35 }}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer bg-neutral-100 border border-neutral-200 hover:border-[#A87428]/60 shadow-md hover:shadow-xl transition-all duration-500 ${aspectClass}`}
                onClick={() => setLightboxIndex(index)}
              >
                <Image
                  src={photo.imageUrl}
                  alt={photo.caption || journeyTitle}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Ambient vignette on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Top Badge */}
                <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] uppercase font-mono tracking-wider text-[#0D0E12] font-semibold">
                    {photo.category}
                  </span>
                </div>

                {/* Expand Icon */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>

                {/* Caption & Location Bottom Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
                  {photo.caption && (
                    <p className="text-xs text-white font-serif italic line-clamp-2 leading-relaxed">
                      &ldquo;{photo.caption}&rdquo;
                    </p>
                  )}
                  {photo.location && (
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#C28E46] mt-1.5">
                      <MapPin className="w-3 h-3" />
                      <span>{photo.location}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Yet Another React Lightbox Modal */}
      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={slides}
        plugins={[Captions, Thumbnails, Zoom, Fullscreen]}
        animation={{ fade: 300, swipe: 250 }}
        carousel={{ finite: false }}
        styles={{
          container: { backgroundColor: 'rgba(5, 5, 8, 0.98)' },
          thumbnail: { borderColor: '#A87428' },
        }}
      />
    </section>
  );
}
