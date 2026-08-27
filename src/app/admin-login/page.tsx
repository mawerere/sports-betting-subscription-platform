import Link from 'next/link';
import AdminLoginForm from './AdminLoginForm';

export default function AdminLoginPage() {
  return (
    <div className="flex-grow flex items-center justify-center p-4 bg-black">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center mb-6 text-black">Admin Panel Login</h1>
        <AdminLoginForm />
      </div>
    </div>
  );
}
