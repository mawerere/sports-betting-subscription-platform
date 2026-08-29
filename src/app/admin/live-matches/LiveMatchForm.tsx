'use client';

import { useState } from 'react';
import { saveLiveMatch } from './actions';
import { useRouter } from 'next/navigation';

export default function LiveMatchForm({ matches }: { matches: any[] }) {
  const [isEditing, setIsEditing] = useState(false);
  const [matchId, setMatchId] = useState('');
  const [league, setLeague] = useState('');
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [score, setScore] = useState('0 - 0');
  const [minute, setMinute] = useState("0'");
  const [status, setStatus] = useState('PENDING');
  const [prediction, setPrediction] = useState('');
  const [chances, setChances] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const resetForm = () => {
    setIsEditing(false);
    setMatchId('');
    setLeague('');
    setHomeTeam('');
    setAwayTeam('');
    setScore('0 - 0');
    setMinute("0'");
    setStatus('PENDING');
    setPrediction('');
    setChances('');
  };

  const handleEditSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (id) {
      const match = matches.find((m) => m.id === id);
      if (match) {
        setIsEditing(true);
        setMatchId(id);
        setLeague(match.league || '');
        setHomeTeam(match.homeTeam || '');
        setAwayTeam(match.awayTeam || '');
        setScore(match.score || '0 - 0');
        setMinute(match.minute || "0'");
        setStatus(match.status || 'PENDING');
        setPrediction(match.predictionText || '');
        setChances(match.chances || '');
        return;
      }
    }
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await saveLiveMatch({
        id: isEditing ? matchId : undefined,
        league,
        homeTeam,
        awayTeam,
        score,
        minute,
        status,
        prediction,
        chances,
      });

      if (!isEditing) {
        resetForm();
      }

      router.refresh();
    } catch (error) {
      console.error('Error saving match:', error);
      alert('Failed to save match. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-50 dark:bg-slate-950 p-4 rounded-lg border border-gray-200 dark:border-slate-800 mb-4">
        <label className="block text-sm font-semibold mb-1 text-slate-900 dark:text-white">
          Edit Existing Match?
        </label>
        <select
          value={matchId}
          onChange={handleEditSelect}
          className="w-full border dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2 rounded focus:outline-none"
        >
          <option value="">-- Create New Match --</option>
          {matches.map((m) => (
            <option key={m.id} value={m.id}>
              {m.homeTeam} vs {m.awayTeam} ({m.status})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1 text-slate-900 dark:text-white">League</label>
          <input
            type="text"
            value={league}
            onChange={(e) => setLeague(e.target.value)}
            className="w-full border dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2 rounded"
            placeholder="e.g. Premier League"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-slate-900 dark:text-white">Home Team</label>
          <input
            type="text"
            value={homeTeam}
            onChange={(e) => setHomeTeam(e.target.value)}
            className="w-full border dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-slate-900 dark:text-white">Away Team</label>
          <input
            type="text"
            value={awayTeam}
            onChange={(e) => setAwayTeam(e.target.value)}
            className="w-full border dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-slate-900 dark:text-white">Current Score</label>
          <input
            type="text"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="w-full border dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2 rounded font-bold text-center"
            placeholder="e.g. 2 - 1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-slate-900 dark:text-white">Match Minute</label>
          <input
            type="text"
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
            className="w-full border dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2 rounded"
            placeholder="e.g. 64' or FT"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-slate-900 dark:text-white">Match Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2 rounded"
            required
          >
            <option value="PENDING">Pending (Upcoming / Scheduled)</option>
            <option value="FIRST_HALF">Live (First Half)</option>
            <option value="HALF_TIME">Live (Half Time)</option>
            <option value="SECOND_HALF">Live (Second Half)</option>
            <option value="FULL_TIME">Done (Full Time / Finished)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-slate-900 dark:text-white">Prediction</label>
          <input
            type="text"
            value={prediction}
            onChange={(e) => setPrediction(e.target.value)}
            className="w-full border dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2 rounded"
            placeholder="e.g. Over 2.5 Goals"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-slate-900 dark:text-white">Chances (%)</label>
          <input
            type="text"
            value={chances}
            onChange={(e) => setChances(e.target.value)}
            className="w-full border dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2 rounded"
            placeholder="e.g. 85%"
            required
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-black dark:bg-emerald-500 dark:text-slate-950 text-white px-6 py-2 rounded font-bold hover:bg-gray-800 dark:hover:bg-emerald-400 disabled:opacity-50 transition"
        >
          {loading ? 'Saving...' : isEditing ? 'Update Live Match' : 'Start Live Match'}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={resetForm}
            className="border border-slate-300 dark:border-slate-700 px-4 py-2 rounded text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-sm"
          >
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
}