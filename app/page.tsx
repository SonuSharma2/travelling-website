import prisma from '@/lib/prisma';
import CinematicHero from '@/components/hero/CinematicHero';
import InteractiveWorldMap from '@/components/map/InteractiveWorldMap';
import JourneyGrid from '@/components/journeys/JourneyGrid';
import MomentsSection from '@/components/moments/MomentsSection';
import TravelTimeline from '@/components/timeline/TravelTimeline';

export const revalidate = 0; // Dynamic server rendering for live content-driven updates

export default async function HomePage() {
  const journeys = await prisma.journey.findMany({
    where: { published: true },
    orderBy: { travelDate: 'desc' },
    include: {
      photos: {
        select: { id: true },
      },
    },
  });

  return (
    <div className="relative min-h-screen bg-[#08090C] overflow-hidden">
      {/* 1. Cinematic Full-Screen Hero */}
      <CinematicHero />

      {/* 2. Interactive World Map ("Where I've Been") */}
      <InteractiveWorldMap journeys={journeys} />

      {/* 3. Journey Chapters Grid Folio */}
      <JourneyGrid journeys={journeys} />

      {/* 4. Intimate Moments Vignettes */}
      <MomentsSection />

      {/* 5. Travel Timeline Archive */}
      <TravelTimeline journeys={journeys} />
    </div>
  );
}
