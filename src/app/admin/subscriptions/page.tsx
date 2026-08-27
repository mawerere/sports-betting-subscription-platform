import { db } from '@/db';
import { subscriptions, users, packages } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import Link from 'next/link';
import SubActionButton from './SubActionButton';

export default async function AdminSubscriptionsPage() {
  const allSubs = await db.select({
    sub: subscriptions,
    user: users,
    pkg: packages,
  })
    .from(subscriptions)
    .innerJoin(users, eq(subscriptions.userId, users.id))
    .innerJoin(packages, eq(subscriptions.packageId, packages.id))
    .orderBy(desc(subscriptions.startDate))
    .limit(100);

  return (
    <div className="p-4 md:p-8 w-full max-w-full overflow-hidden">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-6 md:mb-8">Manage Subscriptions</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto w-full">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">User</th>
              <th className="p-4 font-semibold text-gray-600">Package</th>
              <th className="p-4 font-semibold text-gray-600">Start Date</th>
              <th className="p-4 font-semibold text-gray-600">Expiry Date</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allSubs.map(({ sub, user, pkg }) => (
              <tr key={sub.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4 font-bold">{user.fullName}</td>
                <td className="p-4">{pkg.name}</td>
                <td className="p-4">{sub.startDate.toLocaleDateString()}</td>
                <td className="p-4">{sub.expiryDate.toLocaleDateString()}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-bold rounded ${sub.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {sub.status}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  {sub.status === 'ACTIVE' && (
                    <SubActionButton subId={sub.id} actionType="CANCEL" />
                  )}
                  {sub.status !== 'ACTIVE' && (
                    <SubActionButton subId={sub.id} actionType="ACTIVATE" />
                  )}
                  <SubActionButton subId={sub.id} actionType="EXTEND" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
