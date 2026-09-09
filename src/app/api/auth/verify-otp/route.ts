// src/app/api/auth/verify-otp/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, verificationTokens } from '@/db/schema';
import { eq, and, gt } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const { userId, code } = await req.json();

    if (!userId || !code) {
      return NextResponse.json({ error: 'User ID and verification code are required.' }, { status: 400 });
    }

    // Find valid matching token
    const [tokenRecord] = await db
      .select()
      .from(verificationTokens)
      .where(
        and(
          eq(verificationTokens.userId, userId),
          eq(verificationTokens.code, code),
          gt(verificationTokens.expiresAt, new Date())
        )
      );

    if (!tokenRecord) {
      return NextResponse.json({ error: 'Invalid or expired verification code.' }, { status: 400 });
    }

    // Mark user as verified
    await db.update(users).set({ isVerified: true }).where(eq(users.id, userId));

    // Delete used token
    await db.delete(verificationTokens).where(eq(verificationTokens.id, tokenRecord.id));

    return NextResponse.json({ success: true, message: 'Email verified successfully!' });
  } catch (error) {
    console.error('Verification Error:', error);
    return NextResponse.json({ error: 'Failed to verify account.' }, { status: 500 });
  }
}