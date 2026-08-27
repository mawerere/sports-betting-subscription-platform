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
  const [minute, setMinute] = useState('0\'');
  const [status, setStatus] = useState('FIRST_HALF');
  const [prediction, setPrediction] = useState('');
  const [chances, setChances] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEditSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (id) {
      const match = matches.find(m => m.id === id);
      if (match) {
        setIsEditing(true);
        setMatchId(id);
        setLeague(match.league);
        setHomeTeam(match.homeTeam);
        setAwayTeam(match.awayTeam);
        setScore(match.score);
        setMinute(match.minute);
        setStatus(match.status);
        setPrediction(match.predictionText);
        setChances(match.chances);
        return;
      }
    }
    setIsEditing(false);
    setMatchId('');
    setLeague('');
    setHomeTeam('');
    setAwayTeam('');
    setScore('0 - 0');
    setMinute('0\'');
    setStatus('FIRST_HALF');
    setPrediction('');
    setChances('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await saveLiveMatch({
      id: isEditing ? matchId : undefined,
      league, homeTeam, awayTeam, score, minute, status, prediction, chances
    });

    setLoading(false);
    
    if (!isEditing) {
      setLeague(''); setHomeTeam(''); setAwayTeam(''); setScore('0 - 0'); setMinute('0\''); setPrediction(''); setChances('');
    }
    
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-50 p-4 rounded mb-4">
        <label className="block text-sm font-semibold mb-1">Edit Existing Match?</label>
        <select onChange={handleEditSelect} className="w-full border p-2 rounded">
          <option value="">-- Create New Match --</option>
          {matches.map(m => (
            <option key={m.id} value={m.id}>{m.homeTeam} vs {m.awayTeam}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div><label className="block text-sm font-semibold mb-1">League</label><input type="text" value={league} onChange={e => setLeague(e.target.value)} className="w-full border p-2 rounded" required /></div>
        <div><label className="block text-sm font-semibold mb-1">Home Team</label><input type="text" value={homeTeam} onChange={e => setHomeTeam(e.target.value)} className="w-full border p-2 rounded" required /></div>
        <div><label className="block text-sm font-semibold mb-1">Away Team</label><input type="text" value={awayTeam} onChange={e => setAwayTeam(e.target.value)} className="w-full border p-2 rounded" required /></div>
        <div><label className="block text-sm font-semibold mb-1">Current Score</label><input type="text" value={score} onChange={e => setScore(e.target.value)} className="w-full border p-2 rounded font-bold text-center" placeholder="e.g. 2 - 1" required /></div>
        <div><label className="block text-sm font-semibold mb-1">Match Minute</label><input type="text" value={minute} onChange={e => setMinute(e.target.value)} className="w-full border p-2 rounded" placeholder="e.g. 64'" required /></div>
        <div>
          <label className="block text-sm font-semibold mb-1">Match Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)} className="w-full border p-2 rounded" required>
            <option value="FIRST_HALF">First Half</option>
            <option value="HALF_TIME">Half Time</option>
            <option value="SECOND_HALF">Second Half</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>
        <div><label className="block text-sm font-semibold mb-1">Prediction</label><input type="text" value={prediction} onChange={e => setPrediction(e.target.value)} className="w-full border p-2 rounded" required /></div>
        <div><label className="block text-sm font-semibold mb-1">Chances</label><input type="number" step="0.01" value={chances} onChange={e => setChances(e.target.value)} className="w-full border p-2 rounded" required /></div>
      </div>
      <div>
        <button type="submit" disabled={loading} className="bg-black text-white px-6 py-2 rounded font-bold hover:bg-gray-800 disabled:opacity-50">
          {loading ? 'Saving...' : (isEditing ? 'Update Live Match' : 'Start Live Match')}
        </button>
      </div>
    </form>
  );
}
