'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { getSession } from '@/lib/session';
import bcrypt from 'bcryptjs';

export async function addModerator(fullName: string, email: string, phone: string, password: string) {
  const session = await getSession();
  
  if (!session || session.user.role !== 'SUPERADMIN') {
    return { error: 'Unauthorized' };
  }

  const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existingUser.length > 0) {
    return { error: 'Email is already in use.' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  await db.insert(users).values({
    id: uuidv4(),
    fullName,
    email,
    phone,
    password: hashedPassword,
    role: 'ADMIN',
  });

  return { success: true };
}
