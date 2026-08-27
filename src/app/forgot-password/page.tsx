'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mocking an API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center mb-2">Forgot Password</h1>
        
        {submitted ? (
          <div className="text-center mt-6">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
            <h2 className="text-xl font-bold mb-2">Check your email</h2>
            <p className="text-gray-600 mb-6">
              We've sent password reset instructions to <strong>{email}</strong>.
            </p>
            <Link href="/login" className="text-yellow-600 font-bold hover:underline">
              Return to Login
            </Link>
          </div>
        ) : (
          <>
            <p className="text-center text-gray-600 mb-6 text-sm">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <button 
                type="submit" 
                disabled={loading || !email}
                className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 mt-4"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
              Remember your password? <Link href="/login" className="text-yellow-600 font-bold hover:underline">Log in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
