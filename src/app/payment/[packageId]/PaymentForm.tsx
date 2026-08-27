'use client';

import { useState } from 'react';
import { processPayment } from './actions';
import { useRouter } from 'next/navigation';

export default function PaymentForm({ packageId, amount }: { packageId: string, amount: number }) {
  const [network, setNetwork] = useState('MTN');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await processPayment(packageId, amount, network, phone);
    
    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push('/dashboard?payment=success');
    }
  };

  return (
    <form onSubmit={handlePayment} className="space-y-6">
      {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}
      
      <div>
        <label className="block font-semibold mb-2">Select Network</label>
        <div className="flex flex-col sm:flex-row gap-4">
          <label className={`flex-1 border p-4 rounded-lg cursor-pointer text-center font-bold ${network === 'MTN' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300'}`}>
            <input type="radio" name="network" value="MTN" checked={network === 'MTN'} onChange={(e) => setNetwork(e.target.value)} className="hidden" />
            MTN MoMo
          </label>
          <label className={`flex-1 border p-4 rounded-lg cursor-pointer text-center font-bold ${network === 'AIRTEL' ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
            <input type="radio" name="network" value="AIRTEL" checked={network === 'AIRTEL'} onChange={(e) => setNetwork(e.target.value)} className="hidden" />
            Airtel Money
          </label>
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">Mobile Money Number</label>
        <input 
          type="text" 
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="e.g. 0770000000"
          className="w-full border border-gray-300 p-3 rounded-lg"
          required
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-black text-white font-bold py-4 rounded-lg hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Confirm Payment'}
      </button>

      <p className="text-sm text-gray-500 text-center mt-4">
        * This is a mock payment for demonstration purposes.
      </p>
    </form>
  );
}
