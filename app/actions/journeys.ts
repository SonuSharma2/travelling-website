'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export interface JourneyFormData {
  title: string;
  slug: string;
  countryName: string;
  cityName: string;
  latitude: number;
  longitude: number;
  travelDate: string;
  daysCount: number;
  coverImage: string;
  excerpt: string;
  story: string;
  published: boolean;
}

export async function createJourney(data: JourneyFormData) {
  // Check or create Country
  let country = await prisma.country.findUnique({
    where: { slug: data.countryName.toLowerCase().replace(/\s+/g, '-') },
  });

  if (!country) {
    country = await prisma.country.create({
      data: {
        name: data.countryName,
        slug: data.countryName.toLowerCase().replace(/\s+/g, '-'),
      },
    });
  }

  // Create Journey
  const journey = await prisma.journey.create({
    data: {
      title: data.title,
      slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      countryName: data.countryName,
      cityName: data.cityName,
      latitude: Number(data.latitude) || 0,
      longitude: Number(data.longitude) || 0,
      travelDate: new Date(data.travelDate),
      daysCount: Number(data.daysCount) || 1,
      coverImage: data.coverImage,
      excerpt: data.excerpt,
      story: data.story,
      published: Boolean(data.published),
      countryId: country.id,
    },
  });

  revalidatePath('/');
  revalidatePath('/journeys');
  revalidatePath('/map');
  revalidatePath(`/journeys/${journey.slug}`);
  revalidatePath('/admin');
  revalidatePath('/admin/journeys');

  return { success: true, journey };
}

export async function updateJourney(id: string, data: Partial<JourneyFormData>) {
  const updateData: any = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.slug !== undefined) updateData.slug = data.slug;
  if (data.countryName !== undefined) updateData.countryName = data.countryName;
  if (data.cityName !== undefined) updateData.cityName = data.cityName;
  if (data.latitude !== undefined) updateData.latitude = Number(data.latitude);
  if (data.longitude !== undefined) updateData.longitude = Number(data.longitude);
  if (data.travelDate !== undefined) updateData.travelDate = new Date(data.travelDate);
  if (data.daysCount !== undefined) updateData.daysCount = Number(data.daysCount);
  if (data.coverImage !== undefined) updateData.coverImage = data.coverImage;
  if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
  if (data.story !== undefined) updateData.story = data.story;
  if (data.published !== undefined) updateData.published = Boolean(data.published);

  const journey = await prisma.journey.update({
    where: { id },
    data: updateData,
  });

  revalidatePath('/');
  revalidatePath('/journeys');
  revalidatePath('/map');
  revalidatePath(`/journeys/${journey.slug}`);
  revalidatePath('/admin');
  revalidatePath('/admin/journeys');

  return { success: true, journey };
}

export async function deleteJourney(id: string) {
  const journey = await prisma.journey.delete({
    where: { id },
  });

  revalidatePath('/');
  revalidatePath('/journeys');
  revalidatePath('/map');
  revalidatePath('/admin');
  revalidatePath('/admin/journeys');

  return { success: true };
}

export async function duplicateJourney(id: string) {
  const original = await prisma.journey.findUnique({
    where: { id },
    include: { photos: true },
  });

  if (!original) throw new Error('Journey not found');

  const newSlug = `${original.slug}-copy-${Date.now().toString().slice(-4)}`;

  const copy = await prisma.journey.create({
    data: {
      title: `${original.title} (Copy)`,
      slug: newSlug,
      countryName: original.countryName,
      cityName: original.cityName,
      latitude: original.latitude,
      longitude: original.longitude,
      travelDate: original.travelDate,
      daysCount: original.daysCount,
      coverImage: original.coverImage,
      excerpt: original.excerpt,
      story: original.story,
      published: false,
      countryId: original.countryId,
      destId: original.destId,
      photos: {
        create: original.photos.map((p) => ({
          imageUrl: p.imageUrl,
          thumbnailUrl: p.thumbnailUrl,
          caption: p.caption,
          location: p.location,
          category: p.category,
          aspectRatio: p.aspectRatio,
          displayOrder: p.displayOrder,
          isFeatured: p.isFeatured,
        })),
      },
    },
  });

  revalidatePath('/admin');
  revalidatePath('/admin/journeys');
  return { success: true, journey: copy };
}

export async function togglePublishJourney(id: string, currentStatus: boolean) {
  const journey = await prisma.journey.update({
    where: { id },
    data: { published: !currentStatus },
  });

  revalidatePath('/');
  revalidatePath('/journeys');
  revalidatePath('/map');
  revalidatePath(`/journeys/${journey.slug}`);
  revalidatePath('/admin');
  revalidatePath('/admin/journeys');

  return { success: true, journey };
}
