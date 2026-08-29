// src/components/AdminMatchesManager.tsx
'use client';

import { useState } from 'react';
import { PlusCircle, Trash2, Calendar, Shield, Loader2 } from 'lucide-react';

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  matchTime: string;
  status: string;
  score?: string;
}

export default function AdminMatchesManager({ initialMatches }: { initialMatches: Match[] }) {
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form fields
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [league, setLeague] = useState('');
  const [matchTime, setMatchTime] = useState('');
  const [status, setStatus] = useState('scheduled');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ homeTeam, awayTeam, league, matchTime, status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create match');

      setMatches([data.match, ...matches]);
      setHomeTeam('');
      setAwayTeam('');
      setLeague('');
      setMatchTime('');
      setStatus('scheduled');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this match?')) return;
    setDeletingId(id);

    try {
      const res = await fetch(`/api/admin/matches?id=${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete match');

      setMatches(matches.filter((m) => m.id !== id));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Create Match Form */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
          <PlusCircle className="h-5 w-5 text-emerald-400" /> Create New Match
        </h2>
        <form onSubmit={handleCreate} className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">Home Team</label>
            <input
              type="text"
              required
              placeholder="e.g. Arsenal"
              value={homeTeam}
              onChange={(e) => setHomeTeam(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">Away Team</label>
            <input
              type="text"
              required
              placeholder="e.g. Chelsea"
              value={awayTeam}
              onChange={(e) => setAwayTeam(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">League</label>
            <input
              type="text"
              required
              placeholder="e.g. Premier League"
              value={league}
              onChange={(e) => setLeague(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">Match Date & Time</label>
            <input
              type="datetime-local"
              required
              value={matchTime}
              onChange={(e) => setMatchTime(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="scheduled">Scheduled</option>
              <option value="live">Live</option>
              <option value="finished">Finished</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add Match'}
            </button>
          </div>
        </form>
      </div>

      {/* Matches List Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl">
        <div className="border-b border-slate-800 p-4">
          <h3 className="font-bold text-white">Live & Scheduled Matches ({matches.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/50 text-xs text-slate-400 uppercase">
              <tr>
                <th className="px-4 py-3">Match</th>
                <th className="px-4 py-3">League</th>
                <th className="px-4 py-3">Date/Time</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {matches.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500">
                    No matches found.
                  </td>
                </tr>
              ) : (
                matches.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-semibold text-white">
                      {m.homeTeam} vs {m.awayTeam}
                    </td>
                    <td className="px-4 py-3">{m.league}</td>
                    <td className="px-4 py-3 text-slate-400">
                      {new Date(m.matchTime).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          m.status === 'live'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(m.id)}
                        disabled={deletingId === m.id}
                        className="rounded-lg bg-rose-500/10 p-2 text-rose-400 transition hover:bg-rose-500/20 disabled:opacity-50"
                        title="Delete Match"
                      >
                        {deletingId === m.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}