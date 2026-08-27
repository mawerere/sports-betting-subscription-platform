'use server';

import { db } from '@/db';
import { subscriptions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/session';

export async function handleSubAction(subId: string, actionType: string) {
  const session = await getSession();
  if (!session || (session.user.role !== 'SUPERADMIN' && session.user.role !== 'ADMIN')) {
    throw new Error('Unauthorized');
  }

  const subData = await db.select().from(subscriptions).where(eq(subscriptions.id, subId)).limit(1);
  if (subData.length === 0) return { error: 'Not found' };
  
  const sub = subData[0];

  if (actionType === 'CANCEL') {
    await db.update(subscriptions).set({ status: 'INACTIVE' }).where(eq(subscriptions.id, subId));
  } else if (actionType === 'ACTIVATE') {
    await db.update(subscriptions).set({ status: 'ACTIVE' }).where(eq(subscriptions.id, subId));
  } else if (actionType === 'EXTEND') {
    const newExpiry = new Date(sub.expiryDate);
    newExpiry.setDate(newExpiry.getDate() + 30);
    await db.update(subscriptions).set({ expiryDate: newExpiry }).where(eq(subscriptions.id, subId));
  }

  return { success: true };
}
