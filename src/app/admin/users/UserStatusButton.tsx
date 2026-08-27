'use client';

import { useState } from 'react';
import { toggleUserStatus, deleteUser } from './actions';
import { useRouter } from 'next/navigation';

export default function UserStatusButton({ userId, status, role }: { userId: string, status: string, role: string }) {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    setLoading(true);
    await toggleUserStatus(userId, status);
    router.refresh();
    setLoading(false);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this user? This cannot be undone.')) {
      setDeleting(true);
      await deleteUser(userId);
      router.refresh();
      setDeleting(false);
    }
  }

  return (
    <>
      <button 
        onClick={handleToggle}
        disabled={loading || deleting}
        className={`px-2 py-1 text-xs font-bold rounded ${status === 'ACTIVE' ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
      >
        {loading ? '...' : status === 'ACTIVE' ? 'Suspend' : 'Activate'}
      </button>
      {role === 'SUPERADMIN' && (
        <button 
          onClick={handleDelete}
          disabled={deleting || loading}
          className="px-2 py-1 text-xs font-bold rounded bg-red-100 text-red-800 hover:bg-red-200"
        >
          {deleting ? '...' : 'Delete'}
        </button>
      )}
    </>
  );
}
