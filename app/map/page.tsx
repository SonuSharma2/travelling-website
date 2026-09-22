import prisma from '@/lib/prisma';
import InteractiveWorldMap from '@/components/map/InteractiveWorldMap';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interactive Travel Map — My Travel World',
  description: 'Explore geographic travel coordinates across Nepal, Japan, Thailand, India, and more.',
};

export const revalidate = 0;

export default async function MapPage() {
  const journeys = await prisma.journey.findMany({
    where: { published: true },
    orderBy: { travelDate: 'desc' },
  });

  return (
    <div className="min-h-screen bg-[#08090C] pt-24">
      <InteractiveWorldMap journeys={journeys} />
    </div>
  );
}
