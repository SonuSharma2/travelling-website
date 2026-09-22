'use client';

import Image from 'next/image';
import { Clock, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

interface MomentItem {
  id: string;
  caption: string;
  location: string;
  timeNote: string;
  imageUrl: string;
  aspect: string;
}

const NEPAL_MOMENTS_DATA: MomentItem[] = [
  {
    id: 'm1',
    caption: 'Clay cup of sweet ginger chai warming numb hands while morning fog rolls off Phewa lake.',
    location: 'Pokhara, Kaski',
    timeNote: '06:15 AM · Dawn Light',
    imageUrl: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=800&q=80',
    aspect: 'aspect-[4/5]',
  },
  {
    id: 'm2',
    caption: 'A single butter lamp flickering in the dark recess of an ancient Newar shrine.',
    location: 'Patan Durbar Square',
    timeNote: '07:20 PM · Dusk',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    aspect: 'aspect-[1/1]',
  },
  {
    id: 'm3',
    caption: 'Pack horses resting beneath the red clay sky caves after crossing Syangboche pass.',
    location: 'Dhakmar, Upper Mustang',
    timeNote: '03:15 PM · Altitude 3,800m',
    imageUrl: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=80',
    aspect: 'aspect-[4/5]',
  },
  {
    id: 'm4',
    caption: 'A wooden dugout canoe slicing through sunrise mist on the tranquil Rapti waters.',
    location: 'Sauraha, Chitwan',
    timeNote: '06:45 AM · Terai Sunrise',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    aspect: 'aspect-[3/4]',
  },
  {
    id: 'm5',
    caption: 'Weathered prayer flags carrying mantras into the Himalayan wind above Namche.',
    location: 'Khumjung Ridge, 3,790m',
    timeNote: '11:10 AM · High Mountain Sun',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    aspect: 'aspect-[1/1]',
  },
  {
    id: 'm6',
    caption: 'Children playing marbles on 18th-century slate pavers between carved timber balconies.',
    location: 'Bandipur Main Bazaar',
    timeNote: '04:30 PM · Afternoon Shade',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    aspect: 'aspect-[4/5]',
  },
];

export default function MomentsSection() {
  return (
    <section className="py-24 px-6 sm:px-8 max-w-7xl mx-auto border-t border-neutral-200">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#A87428]" />
            <span className="text-xs uppercase tracking-[0.3em] text-[#A87428] font-mono font-semibold">
              Unpolished Fragments
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display text-[#0D0E12] tracking-tight font-bold">
            FLEETING MOMENTS
          </h2>
        </div>

        <p className="text-neutral-600 font-serif italic text-lg sm:text-xl max-w-md">
          Not planned. Not staged. Just raw personal impressions from the road across Nepal.
        </p>
      </div>

      {/* Grid of Polaroid/Film Frame Moments in White Aesthetic */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {NEPAL_MOMENTS_DATA.map((moment, index) => (
          <motion.div
            key={moment.id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="group bg-white p-5 rounded-2xl border border-neutral-200 hover:border-[#A87428]/50 transition-all duration-300 shadow-md hover:shadow-xl flex flex-col"
          >
            {/* Film frame photo container */}
            <div className={`relative w-full ${moment.aspect} rounded-xl overflow-hidden mb-4 bg-neutral-100`}>
              <Image
                src={moment.imageUrl}
                alt={moment.caption}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-104"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40" />

              {/* Timestamp tag overlay */}
              <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-sm border border-neutral-200 text-[10px] font-mono text-[#0D0E12] font-semibold flex items-center gap-1.5 shadow-xs">
                <Clock className="w-3 h-3 text-[#A87428]" />
                <span>{moment.timeNote}</span>
              </div>
            </div>

            {/* Handwritten style / editorial caption */}
            <div className="flex flex-col justify-between flex-grow">
              <p className="text-sm font-serif italic text-neutral-800 leading-relaxed group-hover:text-[#0D0E12] transition-colors">
                &ldquo;{moment.caption}&rdquo;
              </p>

              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                <span className="flex items-center gap-1 text-[#A87428] font-medium">
                  <MapPin className="w-3 h-3" />
                  {moment.location}
                </span>
                <span className="text-[10px] opacity-75 font-mono">35MM EXPOSURE</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
