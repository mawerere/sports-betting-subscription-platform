'use server';

import { db } from '@/db';
import { predictions } from '@/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { getSession } from '@/lib/session';

export async function syncPredictions(packageIds: string[]) {
  const session = await getSession();

  if (!session || (session.user.role !== 'SUPERADMIN' && session.user.role !== 'ADMIN')) {
    throw new Error('Unauthorized');
  }

  // Fetch from our internal mock API to simulate external service
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://127.0.0.1:3000';
  const res = await fetch(`${baseUrl}/api/external-sports`, { cache: 'no-store' });
  const data = await res.json();

  if (data.success) {
    const matches = data.data;

    // Distribute these matches among packages and free tips randomly
    for (const match of matches) {
      const isFree = Math.random() > 0.7;
      const packageId = isFree ? null : packageIds[Math.floor(Math.random() * packageIds.length)];
      const externalFixtureId = match.externalFixtureId?.toString().trim() || null;
      
      // Auto-set isLive to true if an external fixture ID exists
      const isLive = match.isLive ?? Boolean(externalFixtureId);

      await db.insert(predictions).values({
        id: uuidv4(),
        league: match.league,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        predictionText: match.predictionText,
        chances: match.chances,
        matchDate: new Date(match.matchDate),
        packageId,
        isFree,
        isLive,
        externalFixtureId,
        status: match.status,
      });
    }
  }

  return { success: true };
}

export async function addPrediction(data: {
  league: string;
  homeTeam: string;
  awayTeam: string;
  prediction: string;
  chances: number;
  matchDate: Date;
  packageId: string | null;
  isFree?: boolean;
  isLive?: boolean;
  externalFixtureId?: string | null;
}) {
  const session = await getSession();

  if (!session || (session.user.role !== 'SUPERADMIN' && session.user.role !== 'ADMIN')) {
    throw new Error('Unauthorized');
  }

  const externalFixtureId = data.externalFixtureId?.trim() || null;
  
  // Automatically evaluate isLive = true if externalFixtureId is provided
  const isLive = data.isLive ?? Boolean(externalFixtureId);

  await db.insert(predictions).values({
    id: uuidv4(),
    league: data.league,
    homeTeam: data.homeTeam,
    awayTeam: data.awayTeam,
    predictionText: data.prediction,
    chances: data.chances.toString(),
    matchDate: data.matchDate,
    packageId: data.packageId,
    isFree: data.isFree ?? (data.packageId === null),
    isLive,
    externalFixtureId,
  });

  return { success: true };
}