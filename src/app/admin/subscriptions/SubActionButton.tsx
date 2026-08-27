'use client';

import { useState } from 'react';
import { handleSubAction } from './actions';
import { useRouter } from 'next/navigation';

export default function SubActionButton({ subId, actionType }: { subId: string, actionType: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onClick = async () => {
    setLoading(true);
    await handleSubAction(subId, actionType);
    router.refresh();
    setLoading(false);
  };

  let btnClass = 'bg-blue-100 text-blue-800 hover:bg-blue-200';
  let label = 'Extend';

  if (actionType === 'CANCEL') {
    btnClass = 'bg-red-100 text-red-800 hover:bg-red-200';
    label = 'Cancel';
  } else if (actionType === 'ACTIVATE') {
    btnClass = 'bg-green-100 text-green-800 hover:bg-green-200';
    label = 'Activate';
  }

  return (
    <button 
      onClick={onClick}
      disabled={loading}
      className={`px-2 py-1 text-xs font-bold rounded ${btnClass} disabled:opacity-50`}
    >
      {loading ? '...' : label}
    </button>
  );
}
