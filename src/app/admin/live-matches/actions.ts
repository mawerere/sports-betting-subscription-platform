'use server';

import { db } from '@/db';
import { liveMatches } from '@/db/schema';
import { getSession } from '@/lib/session';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export async function saveLiveMatch(data: any) {
  const session = await getSession();
  
  if (!session || (session.user.role !== 'SUPERADMIN' && session.user.role !== 'ADMIN')) {
    throw new Error('Unauthorized');
  }

  if (data.id) {
    await db.update(liveMatches).set({
      league: data.league,
      homeTeam: data.homeTeam,
      awayTeam: data.awayTeam,
      score: data.score,
      minute: data.minute,
      status: data.status,
      predictionText: data.prediction,
      chances: data.chances.toString(),
      updatedAt: new Date(),
    }).where(eq(liveMatches.id, data.id));
  } else {
    await db.insert(liveMatches).values({
      id: uuidv4(),
      league: data.league,
      homeTeam: data.homeTeam,
      awayTeam: data.awayTeam,
      score: data.score,
      minute: data.minute,
      status: data.status,
      predictionText: data.prediction,
      chances: data.chances.toString(),
    });
  }

  return { success: true };
}
