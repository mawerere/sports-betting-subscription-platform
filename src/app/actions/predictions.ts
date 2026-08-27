'use server';

import { db } from '@/db';
import { predictions } from '@/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';

export async function createPrediction(formData: FormData) {
  const homeTeam = formData.get('homeTeam') as string;
  const awayTeam = formData.get('awayTeam') as string;
  const league = formData.get('league') as string;
  const predictionText = formData.get('predictionText') as string;
  const chances = formData.get('chances') as string;
  const matchDate = new Date(formData.get('matchDate') as string);
  const isFree = formData.get('isFree') === 'true';
  const packageId = (formData.get('packageId') as string) || null;

  await db.insert(predictions).values({
    id: uuidv4(),
    homeTeam,
    awayTeam,
    league,
    predictionText,
    chances,
    matchDate,
    isFree,
    packageId: isFree ? null : packageId,
  });

  revalidatePath('/admin/predictions');
  revalidatePath('/free-tips');
}