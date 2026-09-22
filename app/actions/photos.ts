'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function addPhotoToJourney(data: {
  journeyId: string;
  imageUrl: string;
  caption?: string;
  location?: string;
  category?: string;
  aspectRatio?: string;
  isFeatured?: boolean;
}) {
  // Find highest displayOrder
  const lastPhoto = await prisma.photo.findFirst({
    where: { journeyId: data.journeyId },
    orderBy: { displayOrder: 'desc' },
  });

  const displayOrder = (lastPhoto?.displayOrder ?? 0) + 1;

  const photo = await prisma.photo.create({
    data: {
      journeyId: data.journeyId,
      imageUrl: data.imageUrl,
      caption: data.caption || '',
      location: data.location || '',
      category: data.category || 'Landscape',
      aspectRatio: data.aspectRatio || '3/2',
      isFeatured: Boolean(data.isFeatured),
      displayOrder,
    },
  });

  const journey = await prisma.journey.findUnique({
    where: { id: data.journeyId },
    select: { slug: true },
  });

  if (journey) {
    revalidatePath(`/journeys/${journey.slug}`);
  }
  revalidatePath(`/admin/journeys/${data.journeyId}/photos`);

  return { success: true, photo };
}

export async function updatePhoto(
  photoId: string,
  data: {
    caption?: string | null;
    location?: string | null;
    category?: string;
    aspectRatio?: string;
    isFeatured?: boolean;
    displayOrder?: number;
  }
) {
  const photo = await prisma.photo.update({
    where: { id: photoId },
    data,
  });

  const journey = await prisma.journey.findUnique({
    where: { id: photo.journeyId },
    select: { slug: true, id: true },
  });

  if (journey) {
    revalidatePath(`/journeys/${journey.slug}`);
    revalidatePath(`/admin/journeys/${journey.id}/photos`);
  }

  return { success: true, photo };
}

export async function deletePhoto(photoId: string) {
  const photo = await prisma.photo.delete({
    where: { id: photoId },
  });

  const journey = await prisma.journey.findUnique({
    where: { id: photo.journeyId },
    select: { slug: true, id: true },
  });

  if (journey) {
    revalidatePath(`/journeys/${journey.slug}`);
    revalidatePath(`/admin/journeys/${journey.id}/photos`);
  }

  return { success: true };
}

export async function reorderPhotos(photoIds: string[]) {
  // Update displayOrder in bulk
  await Promise.all(
    photoIds.map((id, index) =>
      prisma.photo.update({
        where: { id },
        data: { displayOrder: index + 1 },
      })
    )
  );

  return { success: true };
}
