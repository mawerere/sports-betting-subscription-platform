'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { login } from '@/lib/session';

export async function loginAction(email: string, password: string) {
  try {
    const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (userResult.length === 0) {
      return { error: 'Invalid email or password' };
    }

    const user = userResult[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return { error: 'Invalid email or password' };
    }
    
    if (user.accountStatus === 'SUSPENDED') {
      return { error: 'Your account has been suspended. Please contact support.' };
    }

    await login({ id: user.id, role: user.role, fullName: user.fullName });
  } catch (error) {
    return { error: 'Something went wrong. Please try again.' };
  }
}
