'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { login } from '@/lib/session';
import { v4 as uuidv4 } from 'uuid';

export async function registerAction(fullName: string, email: string, phone: string, password: string) {
  try {
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      return { error: 'Email is already in use.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    await db.insert(users).values({
      id: userId,
      fullName,
      email,
      phone,
      password: hashedPassword,
      role: 'USER',
    });

    await login({ id: userId, role: 'USER', fullName });
  } catch (error) {
    console.error('Registration error', error);
    return { error: 'Something went wrong. Please try again.' };
  }
}
