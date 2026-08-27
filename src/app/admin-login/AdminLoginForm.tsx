'use client';

import { useState } from 'react';
import { adminLoginAction } from './actions';
import { useRouter } from 'next/navigation';

export default function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await adminLoginAction(email, password);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push('/admin');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-100 text-red-700 p-3 rounded text-sm">{error}</div>}
      <div>
        <label className="block text-sm font-semibold mb-1">Admin Email</label>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-lg"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Password</label>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-lg"
          required
        />
      </div>
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 disabled:opacity-50 mt-4"
      >
        {loading ? 'Logging in...' : 'Access Panel'}
      </button>
    </form>
  );
}
