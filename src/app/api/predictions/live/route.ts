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
      .orderBy(desc(predictions.matchDate));

    return NextResponse.json(liveList);
  } catch (error) {
    console.error('Error fetching live predictions:', error);
    return NextResponse.json({ error: 'Failed to fetch live matches' }, { status: 1500 });
  }
}