'use client';

import { useState } from 'react';
import { createPrediction } from '@/app/actions/predictions';

interface PackageOption {
  id: string;
  name: string;
}

export default function NewPredictionForm({ packages }: { packages: PackageOption[] }) {
  const [isFree, setIsFree] = useState(true);

  return (
    <form action={createPrediction} className="bg-white p-6 rounded-2xl shadow-md border space-y-4 max-w-lg">
      <h2 className="text-xl font-extrabold text-gray-900">Add New Prediction</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Home Team</label>
          <input
            name="homeTeam"
            type="text"
            placeholder="Arsenal"
            required
            className="w-full border rounded-xl p-3"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Away Team</label>
          <input
            name="awayTeam"
            type="text"
            placeholder="Chelsea"
            required
            className="w-full border rounded-xl p-3"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">League</label>
          <input
            name="league"
            type="text"
            placeholder="Premier League"
            required
            className="w-full border rounded-xl p-3"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Chances / Odds</label>
          <input
            name="chances"
            type="number"
            step="0.01"
            placeholder="1.85"
            required
            className="w-full border rounded-xl p-3"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Prediction Text</label>
        <input
          name="predictionText"
          type="text"
          placeholder="Home Win / Both Teams to Score"
          required
          className="w-full border rounded-xl p-3"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Match Date & Time</label>
        <input
          name="matchDate"
          type="datetime-local"
          required
          className="w-full border rounded-xl p-3"
        />
      </div>

      {/* Free vs Package Toggle */}
      <div className="pt-2 border-t">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="isFree"
            value="true"
            checked={isFree}
            onChange={(e) => setIsFree(e.target.checked)}
            className="w-5 h-5 accent-yellow-500 rounded"
          />
          <span className="font-bold text-gray-900">Make this a FREE Prediction</span>
        </label>
      </div>

      {/* Select Package if NOT Free */}
      {!isFree && (
        <div>
          <label className="block text-sm font-semibold mb-1">Target Package</label>
          <select name="packageId" required className="w-full border rounded-xl p-3 bg-gray-50">
            <option value="">Select Package</option>
            {packages.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-black text-yellow-500 font-bold py-3 rounded-xl hover:bg-gray-900 transition-colors"
      >
        Post Prediction
      </button>
    </form>
  );
}