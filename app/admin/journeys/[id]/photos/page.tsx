import { notFound, redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import PhotoManager from '@/components/admin/PhotoManager';

interface PhotosPageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 0;

export default async function AdminPhotosPage({ params }: PhotosPageProps) {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const { id } = await params;
  const journey = await prisma.journey.findUnique({
    where: { id },
    include: {
      photos: {
        orderBy: { displayOrder: 'asc' },
      },
    },
  });

  if (!journey) {
    notFound();
  }

  return (
    <div>
      <PhotoManager
        journeyId={journey.id}
        journeyTitle={journey.title}
        journeySlug={journey.slug}
        initialPhotos={journey.photos}
      />
    </div>
  );
}
