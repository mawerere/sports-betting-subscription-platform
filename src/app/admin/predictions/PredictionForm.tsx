'use client';

import { useState } from 'react';
import { addPrediction } from './actions';
import { useRouter } from 'next/navigation';

export default function PredictionForm({ packages }: { packages: any[] }) {
  const [league, setLeague] = useState('');
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [prediction, setPrediction] = useState('');
  const [chances, setChances] = useState('');
  const [matchDate, setMatchDate] = useState('');
  const [packageId, setPackageId] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await addPrediction({
      league, homeTeam, awayTeam, prediction, chances: parseFloat(chances), 
      matchDate: new Date(matchDate), packageId: packageId === '' ? null : packageId
    });

    if (res.success) {
      setLeague('');
      setHomeTeam('');
      setAwayTeam('');
      setPrediction('');
      setChances('');
      setMatchDate('');
      setPackageId('');
      router.refresh();
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-semibold mb-1">League</label>
        <input type="text" value={league} onChange={e => setLeague(e.target.value)} className="w-full border p-2 rounded" required />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Match Date</label>
        <input type="datetime-local" value={matchDate} onChange={e => setMatchDate(e.target.value)} className="w-full border p-2 rounded" required />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Home Team</label>
        <input type="text" value={homeTeam} onChange={e => setHomeTeam(e.target.value)} className="w-full border p-2 rounded" required />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Away Team</label>
        <input type="text" value={awayTeam} onChange={e => setAwayTeam(e.target.value)} className="w-full border p-2 rounded" required />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Prediction</label>
        <input type="text" value={prediction} onChange={e => setPrediction(e.target.value)} className="w-full border p-2 rounded" required />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Chances</label>
        <input type="number" step="0.01" value={chances} onChange={e => setChances(e.target.value)} className="w-full border p-2 rounded" required />
      </div>
      <div className="col-span-2">
        <label className="block text-sm font-semibold mb-1">Package (Leave empty for Free Tip)</label>
        <select value={packageId} onChange={e => setPackageId(e.target.value)} className="w-full border p-2 rounded">
          <option value="">Free Tip</option>
          {packages.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
      <div className="col-span-2">
        <button type="submit" disabled={loading} className="bg-black text-white px-6 py-2 rounded font-bold hover:bg-gray-800 disabled:opacity-50">
          {loading ? 'Adding...' : 'Add Prediction'}
        </button>
      </div>
    </form>
  );
}
