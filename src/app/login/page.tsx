import Link from 'next/link';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center mb-6">Welcome Back</h1>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account? <Link href="/register" className="text-yellow-600 font-bold hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}
