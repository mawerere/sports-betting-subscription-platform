import Link from 'next/link';
import RegisterForm from './RegisterForm';

export default function RegisterPage() {
  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center mb-6">Create Account</h1>
        <RegisterForm />
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <Link href="/login" className="text-yellow-600 font-bold hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}
