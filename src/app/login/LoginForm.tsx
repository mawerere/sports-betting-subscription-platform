'use client';

import { useState } from 'react';
import { loginAction } from './actions';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await loginAction(email, password);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-100 text-red-700 p-3 rounded text-sm">{error}</div>}
      <div>
        <label className="block text-sm font-semibold mb-1">Email Address</label>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-lg"
          required
        />
      </div>
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-semibold">Password</label>
          <a href="/forgot-password" className="text-xs text-yellow-600 font-bold hover:underline">Forgot password?</a>
        </div>
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
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
