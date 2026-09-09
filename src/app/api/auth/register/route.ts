// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/db';
import { users, verificationTokens } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { validateEmailDomain } from '@/lib/email-validation';
import { sendOtpEmail } from '@/lib/email-sender';

export async function POST(req: Request) {
  try {
    const { fullName, email, phone, password } = await req.json();

    if (!fullName || !email || !phone || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Fast Domain & MX Validation
    const validation = await validateEmailDomain(cleanEmail);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.reason }, { status: 400 });
    }

    // 2. Check standard duplicates
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, cleanEmail),
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create User Record (Unverified)
    const [newUser] = await db
      .insert(users)
      .values({
        fullName,
        email: cleanEmail,
        phone,
        password: hashedPassword,
        isVerified: false,
      })
      .returning();

    // 5. Generate 6-Digit OTP Token
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes TTL

    await db.insert(verificationTokens).values({
      userId: newUser.id,
      code: otpCode,
      expiresAt,
    });

    // 6. Asynchronous Non-Blocking Email Dispatch
    // (Fired in background; response returns immediately to client)
    sendOtpEmail(cleanEmail, otpCode).catch((err) =>
      console.error('Async background email error:', err)
    );

    return NextResponse.json(
      {
        message: 'Account created successfully. Please check your email for verification code.',
        userId: newUser.id,
        email: newUser.email,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}