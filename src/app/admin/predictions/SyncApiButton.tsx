'use client';

import { useState } from 'react';
import { syncPredictions } from './actions';
import { useRouter } from 'next/navigation';

export default function SyncApiButton({ packages }: { packages: any[] }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSync = async () => {
    setLoading(true);
    await syncPredictions(packages.map(p => p.id));
    setLoading(false);
    router.refresh();
  };

  return (
    <button 
      onClick={handleSync} 
      disabled={loading}
      className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? 'Syncing Live API...' : 'Fetch Live Predictions from API'}
    </button>
  );
}
