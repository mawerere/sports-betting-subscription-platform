'use client';

import { useState } from 'react';
import { addModerator } from './actions';
import { useRouter } from 'next/navigation';

export default function ModeratorForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await addModerator(fullName, email, phone, password);

    if (res?.error) {
      setError(res.error);
    } else {
      setFullName('');
      setEmail('');
      setPhone('');
      setPassword('');
      router.refresh();
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-100 text-red-700 p-3 rounded text-sm">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Full Name</label>
          <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Phone Number</label>
          <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border p-2 rounded" required minLength={6} />
        </div>
      </div>
      <div>
        <button type="submit" disabled={loading} className="bg-black text-white px-6 py-2 rounded font-bold hover:bg-gray-800 disabled:opacity-50">
          {loading ? 'Adding...' : 'Add Admin'}
        </button>
      </div>
    </form>
  );
}
