import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { MapPin, Calendar, ArrowLeft, ArrowRight, Camera, Mountain } from 'lucide-react';
import EditorialGallery from '@/components/gallery/EditorialGallery';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const journey = await prisma.journey.findUnique({
    where: { slug },
  });

  if (!journey) {
    return {
      title: 'Journey Not Found — My Travel Journal',
    };
  }

  return {
    title: `${journey.title}, Nepal — Travel Journal`,
    description: journey.excerpt,
    openGraph: {
      title: `${journey.title}, Nepal — Travel Journal`,
      description: journey.excerpt,
      images: [{ url: journey.coverImage, width: 1200, height: 630, alt: journey.title }],
    },
  };
}

export const revalidate = 0;

export default async function JourneyPage({ params }: PageProps) {
  const { slug } = await params;
  const journey = await prisma.journey.findUnique({
    where: { slug },
    include: {
      photos: {
        orderBy: { displayOrder: 'asc' },
      },
    },
  });

  if (!journey) {
    notFound();
  }

  const allJourneys = await prisma.journey.findMany({
    where: { published: true },
    orderBy: { travelDate: 'desc' },
    select: { id: true, title: true, slug: true, countryName: true, cityName: true, coverImage: true },
  });

  const currentIndex = allJourneys.findIndex((j) => j.slug === slug);
  const prevJourney = currentIndex > 0 ? allJourneys[currentIndex - 1] : null;
  const nextJourney = currentIndex < allJourneys.length - 1 ? allJourneys[currentIndex + 1] : null;

  const year = new Date(journey.travelDate).getFullYear();
  const dateFormatted = new Date(journey.travelDate).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const paragraphs = journey.story.split('\n\n').filter((p) => p.trim().length > 0);

  return (
    <article className="min-h-screen bg-white text-[#0D0E12]">
      {/* 1. Full-Screen Viewport Hero */}
      <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden flex items-end">
        <Image
          src={journey.coverImage}
          alt={journey.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-[0.88] contrast-[1.05]"
        />

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />

        {/* Back Link Floating */}
        <div className="absolute top-24 left-6 sm:left-12 z-20">
          <Link
            href="/journeys"
            className="inline-flex items-center gap-2 text-xs uppercase font-mono tracking-widest text-white bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 transition-colors hover:bg-black/60"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#C28E46]" />
            <span>Back to Folio</span>
          </Link>
        </div>

        {/* Hero Meta & Title Overlay */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 pb-16 w-full text-white">
          <div className="flex flex-wrap items-center gap-3 mb-4 text-xs font-mono uppercase tracking-[0.25em] text-[#C28E46]">
            <span>Nepal</span>
            <span>·</span>
            <span>{journey.cityName}</span>
            <span>·</span>
            <span>{year}</span>
            <span>·</span>
            <span className="text-white/90">{journey.daysCount} Days Expedition</span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-extrabold tracking-tight leading-tight drop-shadow-md">
            {journey.title}
          </h1>

          {/* Technical GPS HUD */}
          <div className="mt-6 flex flex-wrap items-center gap-6 pt-6 border-t border-white/20 text-xs font-mono text-white/80">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C28E46]" />
              <span>
                LAT {journey.latitude.toFixed(4)}° N · LON {journey.longitude.toFixed(4)}° E
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#C28E46]" />
              <span>{dateFormatted}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-[#C28E46]" />
              <span>{journey.photos.length} Archival Photographs</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Editorial Story Section on Clean White */}
      <section className="py-24 px-6 sm:px-8 max-w-4xl mx-auto">
        {/* Pull Quote / Excerpt */}
        <div className="border-l-4 border-[#A87428] pl-6 sm:pl-8 my-8 bg-[#FAF9F6] py-6 rounded-r-2xl">
          <p className="text-xl sm:text-2xl md:text-3xl font-serif italic text-neutral-800 leading-relaxed">
            &ldquo;{journey.excerpt}&rdquo;
          </p>
        </div>

        {/* Narrative Prose Story */}
        <div className="mt-12 flex flex-col gap-8 text-lg sm:text-xl text-neutral-700 font-light leading-relaxed font-sans">
          {paragraphs.map((para, i) => (
            <p
              key={i}
              className="first-letter:text-6xl first-letter:font-display first-letter:font-bold first-letter:float-left first-letter:mr-3.5 first-letter:text-[#A87428] first-letter:leading-none"
            >
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* 3. Photographic Folio & Lightbox */}
      <EditorialGallery photos={journey.photos} journeyTitle={journey.title} />

      {/* 4. Next / Previous Chapter Navigation */}
      <section className="border-t border-neutral-200 py-16 px-6 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {prevJourney ? (
            <Link
              href={`/journeys/${prevJourney.slug}`}
              className="group glass-card-light p-6 rounded-2xl flex items-center gap-5 hover:border-[#A87428]/50 transition-all duration-300"
            >
              <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-100">
                <Image
                  src={prevJourney.coverImage}
                  alt={prevJourney.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#A87428] font-semibold flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3" /> Previous Chapter
                </span>
                <h4 className="text-xl font-display font-bold text-[#0D0E12] mt-1 group-hover:text-[#A87428] transition-colors">
                  {prevJourney.title}
                </h4>
                <span className="text-xs text-neutral-500 font-mono">{prevJourney.cityName}</span>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextJourney && (
            <Link
              href={`/journeys/${nextJourney.slug}`}
              className="group glass-card-light p-6 rounded-2xl flex items-center justify-between gap-5 hover:border-[#A87428]/50 transition-all duration-300 text-right"
            >
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#A87428] font-semibold flex items-center justify-end gap-1">
                  Next Chapter <ArrowRight className="w-3 h-3" />
                </span>
                <h4 className="text-xl font-display font-bold text-[#0D0E12] mt-1 group-hover:text-[#A87428] transition-colors">
                  {nextJourney.title}
                </h4>
                <span className="text-xs text-neutral-500 font-mono">{nextJourney.cityName}</span>
              </div>
              <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-100">
                <Image
                  src={nextJourney.coverImage}
                  alt={nextJourney.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </Link>
          )}
        </div>
      </section>
    </article>
  );
}
