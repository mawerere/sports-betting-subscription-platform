'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { login } from '@/lib/session';

export async function adminLoginAction(email: string, password: string) {
  try {
    const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (userResult.length === 0) {
      return { error: 'Invalid credentials or unauthorized' };
    }

    const user = userResult[0];
    
    if (user.role !== 'SUPERADMIN' && user.role !== 'ADMIN') {
      return { error: 'Invalid credentials or unauthorized' };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return { error: 'Invalid credentials or unauthorized' };
    }

    await login({ id: user.id, role: user.role, fullName: user.fullName });
  } catch (error) {
    return { error: 'Something went wrong. Please try again.' };
  }
}
