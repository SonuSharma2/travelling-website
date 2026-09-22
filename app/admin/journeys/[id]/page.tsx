import { notFound, redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import JourneyForm from '@/components/admin/JourneyForm';
import Link from 'next/link';
import { Camera } from 'lucide-react';

interface EditJourneyPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditJourneyPage({ params }: EditJourneyPageProps) {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const { id } = await params;
  const journey = await prisma.journey.findUnique({
    where: { id },
    include: {
      _count: { select: { photos: true } },
    },
  });

  if (!journey) {
    notFound();
  }

  const initialData = {
    id: journey.id,
    title: journey.title,
    slug: journey.slug,
    countryName: journey.countryName,
    cityName: journey.cityName,
    latitude: journey.latitude,
    longitude: journey.longitude,
    travelDate: journey.travelDate.toISOString().slice(0, 10),
    daysCount: journey.daysCount,
    coverImage: journey.coverImage,
    excerpt: journey.excerpt,
    story: journey.story,
    published: journey.published,
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Quick link to photo management */}
      <div className="p-4 rounded-xl bg-[#C5A880]/10 border border-[#C5A880]/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Camera className="w-4 h-4 text-[#C5A880]" />
          <span className="text-xs font-mono text-neutral-300">
            This journey contains <strong className="text-white">{journey._count.photos} photographs</strong>.
          </span>
        </div>
        <Link
          href={`/admin/journeys/${journey.id}/photos`}
          className="px-4 py-1.5 rounded-lg bg-[#C5A880] text-[#08090C] text-xs uppercase font-mono tracking-wider font-semibold hover:bg-[#d8c09e] transition-colors"
        >
          Manage Photographs →
        </Link>
      </div>

      <JourneyForm initialData={initialData} isEditing={true} />
    </div>
  );
}
