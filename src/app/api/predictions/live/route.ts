// src/app/api/predictions/live/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { predictions } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const liveList = await db
      .select()
      .from(predictions)
      .where(eq(predictions.isLive, true))
      .orderBy(desc(predictions.matchDate))
      .limit(50);

    return NextResponse.json(liveList, {
      headers: {
        'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    console.error('Error fetching live predictions:', error);
    return NextResponse.json({ error: 'Failed to fetch live matches' }, { status: 500 });
  }
}