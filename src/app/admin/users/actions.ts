'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/session';

export async function toggleUserStatus(userId: string, currentStatus: string) {
  const session = await getSession();
  
  if (!session || (session.user.role !== 'SUPERADMIN' && session.user.role !== 'ADMIN')) {
    throw new Error('Unauthorized');
  }

  const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';

  await db.update(users).set({ accountStatus: newStatus as any }).where(eq(users.id, userId));

  return { success: true, newStatus };
}

export async function deleteUser(userId: string) {
  const session = await getSession();
  
  if (!session || session.user.role !== 'SUPERADMIN') {
    throw new Error('Unauthorized');
  }

  // Delete dependencies first (this is a simple cascade simulation)
  const { payments, subscriptions } = await import('@/db/schema');
  await db.delete(payments).where(eq(payments.userId, userId));
  await db.delete(subscriptions).where(eq(subscriptions.userId, userId));
  await db.delete(users).where(eq(users.id, userId));

  return { success: true };
}
