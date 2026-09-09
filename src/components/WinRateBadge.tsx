// src/components/WinRateBadge.tsx
import { getWinningPercentage } from '@/lib/stats';

export async function WinRateBadge() {
  const { winPercentage, totalWon, totalSettled } = await getWinningPercentage();

  return (
    <div className="flex items-center gap-4 p-4 bg-slate-900 border border-slate-800 rounded-xl text-white">
      <div className="flex flex-col">
        <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
          Win Rate Accuracy
        </span>
        <span className="text-3xl font-extrabold text-green-400">
          {winPercentage}%
        </span>
      </div>
      <div className="h-10 w-[1px] bg-slate-800" />
      <div className="text-sm text-slate-300">
        <p><strong className="text-white">{totalWon}</strong> Won</p>
        <p className="text-xs text-slate-500">out of {totalSettled} settled predictions</p>
      </div>
    </div>
  );
}