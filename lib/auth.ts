import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

const ADMIN_COOKIE_NAME = 'travel_admin_session';

export async function getAdminSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: sessionToken },
    select: { id: true, email: true, name: true, avatar: true },
  });

  return user;
}
