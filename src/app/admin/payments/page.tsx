import { db } from '@/db';
import { payments, users, packages } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import Link from 'next/link';

export default async function AdminPaymentsPage() {
  const allPayments = await db.select({
    payment: payments,
    user: users,
    pkg: packages,
  })
    .from(payments)
    .innerJoin(users, eq(payments.userId, users.id))
    .innerJoin(packages, eq(payments.packageId, packages.id))
    .orderBy(desc(payments.createdAt))
    .limit(100);

  return (
      <div className="p-4 md:p-8 w-full max-w-full overflow-hidden">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-6 md:mb-8">Recent Payments</h1>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto w-full">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Date</th>
                <th className="p-4 font-semibold text-gray-600">User</th>
                <th className="p-4 font-semibold text-gray-600">Package</th>
                <th className="p-4 font-semibold text-gray-600">Network</th>
                <th className="p-4 font-semibold text-gray-600">Amount</th>
                <th className="p-4 font-semibold text-gray-600">Ref</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {allPayments.map(({ payment, user, pkg }) => (
                <tr key={payment.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-4">{payment.createdAt.toLocaleDateString()}</td>
                  <td className="p-4 font-bold">{user.fullName}</td>
                  <td className="p-4 text-gray-600">{pkg.name}</td>
                  <td className="p-4">{payment.network}</td>
                  <td className="p-4 font-bold text-green-600">UGX {payment.amount.toLocaleString()}</td>
                  <td className="p-4 text-xs font-mono">{payment.transactionReference}</td>
                  <td className="p-4">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold">
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  );
}
