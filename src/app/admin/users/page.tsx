import { db } from '@/db';
import { users } from '@/db/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import UserStatusButton from './UserStatusButton';

export default async function AdminUsersPage() {
  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt)).limit(100);

  return (
      <div className="p-4 md:p-8 w-full max-w-full overflow-hidden">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-6 md:mb-8">Manage Users</h1>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto w-full">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Joined</th>
                <th className="p-4 font-semibold text-gray-600">Name</th>
                <th className="p-4 font-semibold text-gray-600">Email</th>
                <th className="p-4 font-semibold text-gray-600">Role</th>
                <th className="p-4 font-semibold text-gray-600">Sub Status</th>
                <th className="p-4 font-semibold text-gray-600">Acc Status</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((user) => (
                <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-4">{user.createdAt.toLocaleDateString()}</td>
                  <td className="p-4 font-bold">{user.fullName}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.role}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded ${user.subscriptionStatus === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {user.subscriptionStatus}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2 items-center">
                    <span className={`px-2 py-1 text-xs font-bold rounded ${user.accountStatus === 'ACTIVE' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                      {user.accountStatus}
                    </span>
                    <UserStatusButton userId={user.id} status={user.accountStatus} role="SUPERADMIN" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  );
}
