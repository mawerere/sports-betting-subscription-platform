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
  const [externalFixtureId, setExternalFixtureId] = useState('');
  const [isFree, setIsFree] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const selectedPackageId = packageId === '' ? null : packageId;

    const res = await addPrediction({
      league,
      homeTeam,
      awayTeam,
      prediction,
      chances: parseFloat(chances),
      matchDate: new Date(matchDate),
      packageId: selectedPackageId,
      isFree: selectedPackageId === null ? true : isFree,
      isLive,
      externalFixtureId: externalFixtureId.trim() || null,
    });

    if (res.success) {
      setLeague('');
      setHomeTeam('');
      setAwayTeam('');
      setPrediction('');
      setChances('');
      setMatchDate('');
      setPackageId('');
      setExternalFixtureId('');
      setIsFree(false);
      setIsLive(false);
      router.refresh();
    }

    setLoading(false);
  };

  const inputStyles =
    'w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';
  const labelStyles = 'block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5';

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
      <h2 className="text-xl font-bold text-white mb-6">Post New Prediction</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelStyles}>League</label>
          <input
            type="text"
            placeholder="e.g. Premier League"
            value={league}
            onChange={(e) => setLeague(e.target.value)}
            className={inputStyles}
            required
          />
        </div>

        <div>
          <label className={labelStyles}>Match Date & Time</label>
          <input
            type="datetime-local"
            value={matchDate}
            onChange={(e) => setMatchDate(e.target.value)}
            className={`${inputStyles} [color-scheme:dark]`}
            required
          />
        </div>

        <div>
          <label className={labelStyles}>Home Team</label>
          <input
            type="text"
            placeholder="e.g. Arsenal"
            value={homeTeam}
            onChange={(e) => setHomeTeam(e.target.value)}
            className={inputStyles}
            required
          />
        </div>

        <div>
          <label className={labelStyles}>Away Team</label>
          <input
            type="text"
            placeholder="e.g. Chelsea"
            value={awayTeam}
            onChange={(e) => setAwayTeam(e.target.value)}
            className={inputStyles}
            required
          />
        </div>

        <div>
          <label className={labelStyles}>Prediction</label>
          <input
            type="text"
            placeholder="e.g. Home Win / Over 2.5"
            value={prediction}
            onChange={(e) => setPrediction(e.target.value)}
            className={inputStyles}
            required
          />
        </div>

        <div>
          <label className={labelStyles}>Chances / Odds</label>
          <input
            type="number"
            step="0.01"
            placeholder="e.g. 1.85"
            value={chances}
            onChange={(e) => setChances(e.target.value)}
            className={inputStyles}
            required
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className={labelStyles}>Package Access</label>
          <select
            value={packageId}
            onChange={(e) => {
              const val = e.target.value;
              setPackageId(val);
              if (val === '') setIsFree(true);
            }}
            className={inputStyles}
          >
            <option value="" className="bg-slate-900 text-white">
              Free Tip
            </option>
            {packages.map((p) => (
              <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* External API Fixture ID */}
        <div className="col-span-1 md:col-span-2 border-t border-slate-800 pt-4 mt-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1.5">
            API-Football Fixture ID (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. 1035212"
            value={externalFixtureId}
            onChange={(e) => setExternalFixtureId(e.target.value)}
            className={`${inputStyles} font-mono`}
          />
          <p className="text-xs text-slate-400 mt-1">
            Required for automatic score, minute, and match status synchronization.
          </p>
        </div>

        {/* Checkbox Options */}
        <div className="col-span-1 md:col-span-2 flex items-center space-x-6 py-1">
          <label className="flex items-center space-x-2 text-sm text-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={isFree || packageId === ''}
              disabled={packageId === ''}
              onChange={(e) => setIsFree(e.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
            />
            <span>Free Prediction</span>
          </label>

          <label className="flex items-center space-x-2 text-sm text-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={isLive}
              onChange={(e) => setIsLive(e.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
            />
            <span>Track Live Match</span>
          </label>
        </div>

        {/* Action Button & Footer Banner */}
        <div className="col-span-1 md:col-span-2 space-y-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-lg shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 transition"
          >
            {loading ? 'Adding Prediction...' : 'Add Prediction'}
          </button>

          <div className="group relative rounded-xl border border-slate-800 bg-slate-950/60 p-5 backdrop-blur-xl transition-all hover:border-emerald-500/40">
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
            <h3 className="text-sm font-bold text-white">VIP Betting Package</h3>
            <p className="mt-1 text-xs text-slate-400">High-confidence predictions with verified historical win-rate records.</p>
          </div>
        </div>
      </form>
    </div>
  );
}