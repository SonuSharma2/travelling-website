'use server';

import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const ADMIN_COOKIE_NAME = 'travel_admin_session';

export async function loginAdmin(email: string, pass: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { success: false, error: 'Invalid administrator credentials' };
  }

  const isValid = await bcrypt.compare(pass, user.password);
  if (!isValid) {
    return { success: false, error: 'Invalid administrator credentials' };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return { success: true, user: { id: user.id, email: user.email, name: user.name } };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  return { success: true };
}
