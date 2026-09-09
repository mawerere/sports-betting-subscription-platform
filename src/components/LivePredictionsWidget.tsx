// src/components/LivePredictionsWidget.tsx
'use client';

import { useEffect, useState } from 'react';

interface Prediction {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  predictionText: string;
  chances: string;
  htScore: string;
  ftScore: string;
  minute: string;
  status: 'PENDING' | 'WON' | 'LOST';
}

interface Stats {
  totalSettled: number;
  totalWon: number;
  winPercentage: number;
}

export default function LivePredictionsWidget() {
  const [liveMatches, setLiveMatches] = useState<Prediction[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  const fetchData = async () => {
    try {
      const [resMatches, resStats] = await Promise.all([
        fetch('/api/predictions/live'),
        fetch('/api/predictions/stats'),
      ]);
      if (resMatches.ok) setLiveMatches(await resMatches.ok ? await resMatches.json() : []);
      if (resStats.ok) setStats(await resStats.json());
    } catch (e) {
      console.error('Poll error', e);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // Auto refresh every 15s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* STATS OVERVIEW HEADER */}
      {stats && (
        <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Platform Accuracy</p>
            <p className="text-3xl font-extrabold text-green-400">{stats.winPercentage}%</p>
          </div>
          <div className="text-right text-xs text-slate-400">
            <p className="font-semibold text-white">{stats.totalWon} Won</p>
            <p>out of {stats.totalSettled} Settled Tips</p>
          </div>
        </div>
      )}

      {/* LIVE MATCH CARDS */}
      <div className="grid gap-4 md:grid-cols-2">
        {liveMatches.map((match) => (
          <div key={match.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-amber-400 uppercase">{match.league}</span>
              <span className="text-xs bg-red-600/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full animate-pulse font-mono">
                LIVE {match.minute}
              </span>
            </div>

            <div className="flex justify-between items-center my-3 text-lg font-bold">
              <span>{match.homeTeam}</span>
              <span className="font-mono text-xl text-green-400 px-3 bg-slate-900 rounded">{match.ftScore}</span>
              <span>{match.awayTeam}</span>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-900 pt-2 mt-2">
              <div>
                Prediction: <strong className="text-white">{match.predictionText}</strong> ({match.chances})
              </div>
              <div>HT: {match.htScore}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}