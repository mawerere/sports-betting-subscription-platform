'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MobileNav({ session, onLogout }: { session: any, onLogout: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        className="md:hidden text-yellow-500 focus:outline-none" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      <div className={`${isOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row absolute md:relative top-full left-0 w-full md:w-auto bg-black md:bg-transparent p-4 md:p-0 gap-4 md:gap-6 items-center shadow-md md:shadow-none border-t border-gray-800 md:border-none`}>
        <Link href="/packages" onClick={() => setIsOpen(false)} className="hover:text-yellow-400">Packages</Link>
        <Link href="/free-tips" onClick={() => setIsOpen(false)} className="hover:text-yellow-400">Free Tips</Link>
        <Link href="/live-matches" onClick={() => setIsOpen(false)} className="text-red-500 font-bold hover:text-red-400 flex items-center gap-1">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          Live
        </Link>
        {session ? (
          <>
            <Link href="/dashboard" onClick={() => setIsOpen(false)} className="hover:text-yellow-400">Dashboard</Link>
            <button onClick={() => { setIsOpen(false); onLogout(); }} className="bg-yellow-500 text-black px-4 py-2 rounded font-bold hover:bg-yellow-400 w-full md:w-auto">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" onClick={() => setIsOpen(false)} className="hover:text-yellow-400">Login</Link>
            <Link href="/register" onClick={() => setIsOpen(false)} className="bg-yellow-500 text-black px-4 py-2 rounded font-bold hover:bg-yellow-400 w-full md:w-auto text-center">
              Register
            </Link>
          </>
        )}
      </div>
    </>
  );
}
