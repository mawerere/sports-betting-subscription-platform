'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StatusSelector({ id, currentStatus }: { id: string; currentStatus: string }) {
  // Local state to instantly update UI while server syncs
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === status) return;
    
    const previousStatus = status;
    setStatus(newStatus); // Optimistic UI update
    setLoading(true);

    try {
      const res = await fetch('/api/admin/predictions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update status');
      }

      router.refresh(); // Refresh server component
    } catch (err: any) {
      alert(err.message);
      setStatus(previousStatus); // Revert on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={status}
      disabled={loading}
      onChange={(e) => handleStatusChange(e.target.value)}
      className={`text-xs font-bold px-2.5 py-1 rounded-full border border-transparent cursor-pointer outline-none transition disabled:opacity-50 ${
        status === 'WON'
          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400'
          : status === 'LOST'
          ? 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-400'
          : 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400'
      }`}
    >
      <option value="PENDING">⏳ PENDING</option>
      <option value="WON">✅ WON</option>
      <option value="LOST">❌ LOST</option>
    </select>
  );
}