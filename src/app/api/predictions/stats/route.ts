// src/app/api/predictions/stats/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { predictions } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function GET() {
  try {
    // 1. Run aggregation directly on PostgreSQL (1 quick query, minimal compute)
    const [stats] = await db
      .select({
        totalWon: sql<number>`count(*) filter (where ${predictions.status} = 'WON')`,
        totalLost: sql<number>`count(*) filter (where ${predictions.status} = 'LOST')`,
        totalSettled: sql<number>`count(*) filter (where ${predictions.status} in ('WON', 'LOST'))`,
      })
      .from(predictions);

    const totalSettled = Number(stats?.totalSettled || 0);
    const totalWon = Number(stats?.totalWon || 0);
    const totalLost = Number(stats?.totalLost || 0);

    if (totalSettled === 0) {
      return NextResponse.json(
        { totalSettled: 0, totalWon: 0, totalLost: 0, winPercentage: 0 },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          },
        }
      );
    }

    const winPercentage = Number(((totalWon / totalSettled) * 100).toFixed(1));

    // 2. Cache the response at edge (CDN) for 5 minutes (300s)
    return NextResponse.json(
      {
        totalSettled,
        totalWon,
        totalLost,
        winPercentage,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching win stats:', error);
    return NextResponse.json({ error: 'Failed to calculate stats' }, { status: 500 });
  }
}