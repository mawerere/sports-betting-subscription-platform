import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  
  if (!session || (session.user.role !== 'SUPERADMIN' && session.user.role !== 'ADMIN')) {
    redirect('/admin-login');
  }

  return (
    <div className="flex-grow flex flex-col md:flex-row bg-gray-50">
      <div className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 p-4 md:p-6 flex flex-row md:flex-col gap-4 flex-shrink-0 overflow-x-auto md:overflow-visible no-scrollbar">
        <h2 className="text-xl font-bold mb-0 md:mb-4 hidden md:block">Admin Panel</h2>
        <Link href="/admin" className="text-sm md:text-base whitespace-nowrap text-gray-600 hover:text-yellow-600">Dashboard</Link>
        <Link href="/admin/predictions" className="text-sm md:text-base whitespace-nowrap text-gray-600 hover:text-yellow-600">Predictions</Link>
        <Link href="/admin/users" className="text-sm md:text-base whitespace-nowrap text-gray-600 hover:text-yellow-600">Users</Link>
        <Link href="/admin/payments" className="text-sm md:text-base whitespace-nowrap text-gray-600 hover:text-yellow-600">Payments</Link>
        <Link href="/admin/live-matches" className="text-sm md:text-base whitespace-nowrap text-red-600 font-bold hover:text-red-500">Live Matches</Link>
        <Link href="/admin/subscriptions" className="text-sm md:text-base whitespace-nowrap text-gray-600 hover:text-yellow-600">Subscriptions</Link>
        {session.user.role === 'SUPERADMIN' && (
          <Link href="/admin/moderators" className="text-sm md:text-base whitespace-nowrap text-gray-600 hover:text-yellow-600">Admins</Link>
        )}
      </div>

      <div className="flex-grow overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
