// src/lib/stats.ts
import { db } from '@/db';
import { predictions } from '@/db/schema';
import { eq, or } from 'drizzle-orm';

export interface WinRateStats {
  totalSettled: number;
  totalWon: number;
  totalLost: number;
  winPercentage: number; // e.g., 85.5
}

export async function getWinningPercentage(): Promise<WinRateStats> {
  // Retrieve all predictions that are either WON or LOST
  const settledPredictions = await db
    .select({ status: predictions.status })
    .from(predictions)
    .where(or(eq(predictions.status, 'WON'), eq(predictions.status, 'LOST')));

  const totalSettled = settledPredictions.length;
  if (totalSettled === 0) {
    return { totalSettled: 0, totalWon: 0, totalLost: 0, winPercentage: 0 };
  }

  const totalWon = settledPredictions.filter((p) => p.status === 'WON').length;
  const totalLost = settledPredictions.filter((p) => p.status === 'LOST').length;

  const winPercentage = Number(((totalWon / totalSettled) * 100).toFixed(1));

  return {
    totalSettled,
    totalWon,
    totalLost,
    winPercentage,
  };
}