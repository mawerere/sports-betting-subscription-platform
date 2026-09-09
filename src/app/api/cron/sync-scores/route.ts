// src/app/api/cron/sync-scores/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { predictions } from '@/db/schema';
import { eq, isNotNull, and, or, gte, lte } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

const API_FOOTBALL_KEY = process.env.API_FOOTBALL_KEY;

export async function GET(req: Request) {
  // 1. Verify Vercel Cron Secret (Security check)
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    // Auto-detect matches that started in the last 3 hours or are set to kick off within 10 minutes
    const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
    const tenMinsInFuture = new Date(now.getTime() + 10 * 60 * 1000);

    // 2. Fetch predictions that either are flagged isLive OR are scheduled to be played right now
    const activePredictions = await db
      .select()
      .from(predictions)
      .where(
        and(
          isNotNull(predictions.externalFixtureId),
          or(
            eq(predictions.isLive, true),
            and(
              gte(predictions.matchDate, threeHoursAgo),
              lte(predictions.matchDate, tenMinsInFuture),
              eq(predictions.status, 'PENDING')
            )
          )
        )
      );

    if (activePredictions.length === 0) {
      return NextResponse.json({ message: 'No live predictions to update' });
    }

    // 3. Query API-Football for live fixture data
    const fixtureIds = activePredictions
      .map((p) => p.externalFixtureId)
      .filter(Boolean)
      .join('-');

    const apiRes = await fetch(
      `https://v3.football.api-sports.io/fixtures?ids=${fixtureIds}`,
      {
        headers: {
          'x-apisports-key': API_FOOTBALL_KEY || '',
        },
      }
    );

    const data = await apiRes.json();
    const liveFixtures = data.response || [];

    // 4. Batch update predictions in database
    for (const fixture of liveFixtures) {
      const extId = String(fixture.fixture.id);
      const statusShort = fixture.fixture.status.short; // "1H", "HT", "2H", "FT", "AET", "PEN", etc.
      const elapsed = fixture.fixture.status.elapsed;   // Elapsed Minute (e.g. 64)

      const homeGoals = fixture.goals.home ?? 0;
      const awayGoals = fixture.goals.away ?? 0;
      const ftScore = `${homeGoals} - ${awayGoals}`;

      const htHome = fixture.score.halftime.home ?? 0;
      const htAway = fixture.score.halftime.away ?? 0;
      const htScore = `${htHome} - ${htAway}`;

      let minuteDisplay = elapsed ? `${elapsed}'` : statusShort;
      let isLive = true;

      // Handle specific match status phases
      if (statusShort === 'HT') minuteDisplay = 'HT';
      
      // Turn off live flag once the match is finished or cancelled
      const finishedStatuses = ['FT', 'AET', 'PEN', 'P', 'POST', 'CANC', 'ABD'];
      if (finishedStatuses.includes(statusShort)) {
        minuteDisplay = statusShort === 'FT' ? 'FT' : statusShort;
        isLive = false;
      }

      await db
        .update(predictions)
        .set({
          ftScore,
          htScore,
          minute: minuteDisplay,
          isLive,
        })
        .where(eq(predictions.externalFixtureId, extId));
    }

    revalidatePath('/live');
    revalidatePath('/dashboard');

    return NextResponse.json({
      message: 'Live scores synced successfully',
      updated: liveFixtures.length,
    });
  } catch (error) {
    console.error('Cron sync error:', error);
    return NextResponse.json({ error: 'Failed to sync scores' }, { status: 500 });
  }
}