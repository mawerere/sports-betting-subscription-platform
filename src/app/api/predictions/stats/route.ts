// src/app/api/predictions/stats/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { predictions } from '@/db/schema';
import { eq, or } from 'drizzle-orm';

export async function GET() {
  try {
    const settled = await db
      .select({ status: predictions.status })
      .from(predictions)
      .where(or(eq(predictions.status, 'WON'), eq(predictions.status, 'LOST')));

    const totalSettled = settled.length;
    if (totalSettled === 0) {
      return NextResponse.json({ totalSettled: 0, totalWon: 0, totalLost: 0, winPercentage: 0 });
    }

    const totalWon = settled.filter((p) => p.status === 'WON').length;
    const totalLost = settled.filter((p) => p.status === 'LOST').length;
    const winPercentage = Number(((totalWon / totalSettled) * 100).toFixed(1));

    return NextResponse.json({
      totalSettled,
      totalWon,
      totalLost,
      winPercentage,
    });
  } catch (error) {
    console.error('Error fetching win stats:', error);
    return NextResponse.json({ error: 'Failed to calculate stats' }, { status: 500 });
  }
}