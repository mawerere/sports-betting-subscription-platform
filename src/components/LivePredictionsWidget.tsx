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
    if (typeof document !== 'undefined' && document.hidden) return;

    try {
      const [resMatches, resStats] = await Promise.all([
        fetch('/api/predictions/live'),
        fetch('/api/predictions/stats'),
      ]);

      if (resMatches.ok) {
        const matchesData = await resMatches.json();
        setLiveMatches(matchesData);
      }

      if (resStats.ok) {
        const statsData = await resStats.json();
        setStats(statsData);
      }
    } catch (e) {
      console.error('Poll error', e);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full space-y-6">
      {/* WHATSAPP CHANNEL BANNER */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 rounded-xl border border-green-500 bg-slate-900 p-4 text-white shadow-xl relative z-10">
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500 text-slate-950 font-bold text-lg">
            💬
          </div>
          <div>
            <h3 className="text-sm md:text-base font-bold text-white">
              Join Our Official WhatsApp Channel
            </h3>
            <p className="text-xs text-slate-300">
              Get instant alerts for live predictions, free daily tips, and VIP announcements.
            </p>
          </div>
        </div>
        <a
          href="https://whatsapp.com/channel/0029VbBUJIG0lwgqvIFL1I3r"
          target="_blank"
          rel="noopener noreferrer"
          className="whitespace-nowrap rounded-lg bg-green-500 px-5 py-2.5 text-xs font-extrabold text-slate-950 hover:bg-green-400 transition-colors shadow-md border border-green-400"
        >
          Join Channel →
        </a>
      </div>

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
        {liveMatches.length > 0 ? (
          liveMatches.map((match) => (
            <div
              key={match.id}
              className="p-4 bg-slate-950 border border-slate-800 rounded-xl relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-amber-400 uppercase">{match.league}</span>
                <span className="text-xs bg-red-600/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full animate-pulse font-mono">
                  LIVE {match.minute ? `• ${match.minute}` : ''}
                </span>
              </div>

              <div className="flex justify-between items-center my-3 text-lg font-bold text-white">
                <span>{match.homeTeam}</span>
                <span className="font-mono text-xl text-green-400 px-3 bg-slate-900 rounded border border-slate-800">
                  {match.ftScore || '0 - 0'}
                </span>
                <span>{match.awayTeam}</span>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-900 pt-2 mt-2">
                <div>
                  Prediction: <strong className="text-white">{match.predictionText}</strong> ({match.chances})
                </div>
                <div>HT: {match.htScore || '0 - 0'}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center p-8 bg-slate-950/60 border border-slate-800/80 rounded-xl text-slate-400 text-sm">
            No live predictions active right now. Check back shortly!
          </div>
        )}
      </div>
    </div>
  );
}