'use server';

import { db } from '@/db';
import { payments, subscriptions, users, ledger } from '@/db/schema';
import { getSession } from '@/lib/session';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';
import { packages } from '@/db/schema';

import { paymentService } from '@/lib/payments/PaymentService';

export async function processPayment(packageId: string, amount: number, network: string, phone: string) {
  const session = await getSession();
  
  if (!session) {
    return { error: 'You must be logged in to subscribe.' };
  }

  const userId = session.user.id;

  try {
    // =========================================================================
    // PAYMENT FLOW: We use the paymentService abstraction so MTN MoMo and
    // Airtel Money can be plugged in cleanly via the PaymentProvider interface.
    // =========================================================================
    const paymentId = uuidv4();

    const response = await paymentService.initiate({
      userId,
      packageId,
      amount,
      network: network as 'MTN' | 'AIRTEL',
      phone,
      externalReference: paymentId,
    });

    if (response.status === 'FAILED' || response.status === 'CANCELLED') {
      return { error: response.message || 'Payment initiation failed.' };
    }

    // For demo/mock, we treat PENDING as success and immediately activate the subscription
    await db.insert(payments).values({
      id: paymentId,
      userId,
      packageId,
      amount,
      network,
      transactionReference: response.providerReference || `PAY-${Date.now()}`,
      status: 'COMPLETED',
      paidAt: new Date(),
    });

    // 2. Add to ledger
    await db.insert(ledger).values({
      id: uuidv4(),
      userId,
      paymentId,
      transactionType: 'CREDIT',
      credit: amount,
      debit: 0,
      balanceAfter: amount, // simplify balance
    });

    // 3. Create or update subscription
    const pkgResult = await db.select().from(packages).where(eq(packages.id, packageId)).limit(1);
    const pkg = pkgResult[0];

    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + pkg.durationDays);

    // Check if sub exists
    const existingSub = await db.select().from(subscriptions)
      .where(eq(subscriptions.userId, userId)); // Wait, user could have multiple? For simplicity, we just add a new row or update if they only have one active at a time.
    
    // We'll just insert a new subscription record
    await db.insert(subscriptions).values({
      id: uuidv4(),
      userId,
      packageId,
      startDate,
      expiryDate,
      status: 'ACTIVE',
    });

    // Update user status
    await db.update(users).set({ subscriptionStatus: 'ACTIVE' }).where(eq(users.id, userId));

    return { success: true };
  } catch (err) {
    console.error('Payment processing error', err);
    return { error: 'Failed to process payment. Please try again.' };
  }
}
