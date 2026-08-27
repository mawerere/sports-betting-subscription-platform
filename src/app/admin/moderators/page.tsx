import { db } from '@/db';
import { users } from '@/db/schema';
import { desc, inArray } from 'drizzle-orm';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import ModeratorForm from './ModeratorForm';

export default async function AdminModeratorsPage() {
  const session = await getSession();
  if (!session || session.user.role !== 'SUPERADMIN') {
    return (
      <div className="flex-grow flex items-center justify-center p-8 bg-gray-50">
        <p className="text-xl font-bold text-red-600">Access Denied. Super Admin only.</p>
      </div>
    );
  }

  const allAdmins = await db.select().from(users).where(inArray(users.role, ['SUPERADMIN', 'ADMIN'])).orderBy(desc(users.createdAt));

  return (
      <div className="p-4 md:p-8 w-full max-w-full overflow-hidden">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-6 md:mb-8">Manage Admins & Moderators</h1>
        
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 mb-6 md:mb-8">
          <h2 className="text-xl font-bold mb-4">Add New Moderator</h2>
          <ModeratorForm />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto w-full">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Name</th>
                <th className="p-4 font-semibold text-gray-600">Email</th>
                <th className="p-4 font-semibold text-gray-600">Role</th>
                <th className="p-4 font-semibold text-gray-600">Joined</th>
              </tr>
            </thead>
            <tbody>
              {allAdmins.map((user) => (
                <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-4 font-bold">{user.fullName}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded ${user.role === 'SUPERADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">{user.createdAt.toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  );
}
