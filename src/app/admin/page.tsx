import { getSession } from '@/lib/session';
import { db } from '@/db';
import { users, subscriptions, payments, packages } from '@/db/schema';
import { count, eq, gte } from 'drizzle-orm';

import { predictions } from '@/db/schema';

export default async function AdminDashboard() {
  const session = await getSession();
  
  if (!session || (session.user.role !== 'SUPERADMIN' && session.user.role !== 'ADMIN')) {
    return null; // Handled by middleware
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalUsers] = await db.select({ value: count() }).from(users);
  const [activeSubs] = await db.select({ value: count() }).from(subscriptions).where(eq(subscriptions.status, 'ACTIVE'));
  const [activePackagesCount] = await db.select({ value: count() }).from(packages);
  const [todaysPayments] = await db.select({ value: count() }).from(payments).where(gte(payments.createdAt, today));
  const [totalPredictions] = await db.select({ value: count() }).from(predictions);

  return (
      <div className="p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-6 md:mb-8">Dashboard Statistics</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500 font-bold uppercase">Total Users</p>
            <p className="text-4xl font-extrabold mt-2">{totalUsers.value}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500 font-bold uppercase">Active Subscribers</p>
            <p className="text-4xl font-extrabold mt-2 text-green-600">{activeSubs.value}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500 font-bold uppercase">Active Packages</p>
            <p className="text-4xl font-extrabold mt-2 text-blue-600">{activePackagesCount.value}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500 font-bold uppercase">Today's Payments</p>
            <p className="text-4xl font-extrabold mt-2 text-yellow-600">{todaysPayments.value}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500 font-bold uppercase">Total Predictions</p>
            <p className="text-4xl font-extrabold mt-2 text-purple-600">{totalPredictions.value}</p>
          </div>
        </div>
      </div>
  );
}
