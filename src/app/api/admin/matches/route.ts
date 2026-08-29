// src/app/api/admin/matches/route.ts
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { liveMatches } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');
    const { payload } = await jwtVerify(token, secret);
    if (payload.role === 'admin' || payload.role === 'superadmin') {
      return payload;
    }
  } catch (err) {
    return null;
  }
  return null;
}

// CREATE MATCH
export async function POST(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { homeTeam, awayTeam, league, score, minute, status, predictionText, chances } = body;

    if (!homeTeam || !awayTeam) {
      return NextResponse.json({ error: 'Home team and away team are required.' }, { status: 400 });
    }

    const [newMatch] = await db
      .insert(liveMatches)
      .values({
        homeTeam,
        awayTeam,
        league: league || 'General',
        score: score || '0 - 0',
        minute: minute || "0'",
        status: status || 'pending',
        predictionText: predictionText || '',
        chances: chances || '50%',
        updatedAt: new Date(),
      })
      .returning();

    revalidatePath('/admin/live-matches');
    return NextResponse.json({ message: 'Match created successfully', match: newMatch });
  } catch (error) {
    console.error('Error creating match:', error);
    return NextResponse.json({ error: 'Failed to create match' }, { status: 500 });
  }
}

// DELETE MATCH
export async function DELETE(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Match ID is required' }, { status: 400 });
    }

    await db.delete(liveMatches).where(eq(liveMatches.id, id));

    revalidatePath('/admin/live-matches');
    return NextResponse.json({ message: 'Match deleted successfully' });
  } catch (error) {
    console.error('Error deleting match:', error);
    return NextResponse.json({ error: 'Failed to delete match' }, { status: 500 });
  }
}