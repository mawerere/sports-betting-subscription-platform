// src/app/api/admin/predictions/route.ts
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { predictions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/session';

async function verifyAdmin(req?: Request) {
  // 1. Try getSession helper first (matches Dashboard auth)
  try {
    const session = await getSession();
    if (session?.user) {
      const role = String(session.user.role || '').toUpperCase();
      if (role === 'ADMIN' || role === 'SUPERADMIN') {
        return session.user;
      }
    }
  } catch (err) {
    // Fall back to manual token inspection if getSession fails
  }

  // 2. Try reading token directly from cookies
  let token: string | undefined;
  const cookieStore = await cookies();
  token = cookieStore.get('token')?.value || cookieStore.get('session')?.value || cookieStore.get('auth_token')?.value;

  // 3. Fallback to Authorization header
  if (!token && req) {
    const authHeader = req.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');
    const { payload } = await jwtVerify(token, secret);
    
    // Case-insensitive role check
    const userRole = String(payload.role || '').toUpperCase();
    if (userRole === 'ADMIN' || userRole === 'SUPERADMIN') {
      return payload;
    }
  } catch (err) {
    return null;
  }
  return null;
}

// 1. CREATE PREDICTION
export async function POST(req: Request) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });

  try {
    const body = await req.json();
    const { 
      homeTeam, 
      awayTeam, 
      league, 
      predictionText, 
      chances, 
      packageId, 
      matchDate, 
      status, 
      isFree, 
      isLive, 
      htScore, 
      ftScore, 
      minute 
    } = body;

    if (!homeTeam || !awayTeam || !predictionText) {
      return NextResponse.json({ error: 'Home team, away team, and prediction text are required.' }, { status: 400 });
    }

    const [newPred] = await db
      .insert(predictions)
      .values({
        homeTeam,
        awayTeam,
        league: league || 'General',
        predictionText,
        chances: chances ? String(chances) : '1.50',
        packageId: packageId || null,
        isFree: Boolean(isFree),
        isLive: Boolean(isLive),
        htScore: htScore || '0 - 0',
        ftScore: ftScore || '0 - 0',
        minute: minute || "0'",
        matchDate: matchDate ? new Date(matchDate) : new Date(),
        status: status || 'PENDING',
        createdAt: new Date(),
      })
      .returning();

    // Revalidate all variants of admin & dashboard routes
    revalidatePath('/dashboard');
    revalidatePath('/predictions');
    revalidatePath('/live');
    revalidatePath('/admin', 'layout');
    revalidatePath('/admin/predictions', 'page');
    revalidatePath('/admin/predictions', 'layout');

    return NextResponse.json({ message: 'Prediction created successfully', prediction: newPred });
  } catch (error) {
    console.error('Error creating prediction:', error);
    return NextResponse.json({ error: 'Failed to create prediction' }, { status: 500 });
  }
}

// 2. UPDATE PREDICTION & LIVE STATUS/SCORES
export async function PATCH(req: Request) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });

  try {
    const body = await req.json();
    const { id, status, isLive, isFree, htScore, ftScore, minute, homeTeam, awayTeam, league, predictionText, chances, packageId, matchDate } = body;

    if (!id) {
      return NextResponse.json({ error: 'Prediction ID is required' }, { status: 400 });
    }

    // Build dynamic update payload containing only sent properties
    const updateData: Record<string, any> = {};
    if (status !== undefined) updateData.status = status;
    if (isLive !== undefined) updateData.isLive = Boolean(isLive);
    if (isFree !== undefined) updateData.isFree = Boolean(isFree);
    if (htScore !== undefined) updateData.htScore = htScore;
    if (ftScore !== undefined) updateData.ftScore = ftScore;
    if (minute !== undefined) updateData.minute = minute;
    if (homeTeam !== undefined) updateData.homeTeam = homeTeam;
    if (awayTeam !== undefined) updateData.awayTeam = awayTeam;
    if (league !== undefined) updateData.league = league;
    if (predictionText !== undefined) updateData.predictionText = predictionText;
    if (chances !== undefined) updateData.chances = String(chances);
    if (packageId !== undefined) updateData.packageId = packageId || null;
    if (matchDate !== undefined) updateData.matchDate = new Date(matchDate);

    await db
      .update(predictions)
      .set(updateData)
      .where(eq(predictions.id, id));

    // Force Next.js App Router cache invalidate across user views
    revalidatePath('/dashboard');
    revalidatePath('/predictions');
    revalidatePath('/live');
    revalidatePath('/admin', 'layout');
    revalidatePath('/admin/predictions', 'page');
    revalidatePath('/admin/predictions', 'layout');

    return NextResponse.json({ message: 'Prediction updated successfully' });
  } catch (error) {
    console.error('Error updating prediction:', error);
    return NextResponse.json({ error: 'Failed to update prediction' }, { status: 500 });
  }
}

// 3. DELETE PREDICTION
export async function DELETE(req: Request) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Prediction ID required' }, { status: 400 });

    await db.delete(predictions).where(eq(predictions.id, id));

    // Force Next.js App Router cache invalidate
    revalidatePath('/dashboard');
    revalidatePath('/predictions');
    revalidatePath('/live');
    revalidatePath('/admin', 'layout');
    revalidatePath('/admin/predictions', 'page');
    revalidatePath('/admin/predictions', 'layout');

    return NextResponse.json({ message: 'Prediction deleted successfully' });
  } catch (error) {
    console.error('Error deleting prediction:', error);
    return NextResponse.json({ error: 'Failed to delete prediction' }, { status: 500 });
  }
}