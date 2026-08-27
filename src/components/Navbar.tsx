import Link from 'next/link';
import { getSession, logout } from '@/lib/session';
import MobileNav from './MobileNav';

export default async function Navbar() {
  const session = await getSession();

  const handleLogout = async () => {
    'use server';
    await logout();
  };

  return (
    <nav className="bg-black text-white p-4 sticky top-0 z-50 shadow-md relative">
      <div className="container mx-auto flex justify-between items-center relative">
        <Link href="/" className="text-2xl font-bold text-yellow-500 relative z-10">
          TEAM GOLO GOLO
        </Link>
        <MobileNav session={session} onLogout={handleLogout} />
      </div>
    </nav>
  );
}
