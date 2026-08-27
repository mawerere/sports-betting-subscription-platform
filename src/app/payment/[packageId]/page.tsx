import { db } from '@/db';
import { packages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import PaymentForm from './PaymentForm';

export default async function PaymentPage({ params }: { params: { packageId: string } }) {
  const pkg = await db.select().from(packages).where(eq(packages.id, params.packageId)).limit(1);

  if (pkg.length === 0) {
    notFound();
  }

  return (
    <div className="py-12 px-4 max-w-xl mx-auto w-full">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <h1 className="text-3xl font-extrabold mb-6 text-center">Complete Payment</h1>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
          <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">Selected Package</p>
          <h2 className="text-xl font-bold">{pkg[0].name}</h2>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-600">Amount to pay:</span>
            <span className="text-2xl font-extrabold text-green-600">UGX {pkg[0].price.toLocaleString()}</span>
          </div>
        </div>

        <PaymentForm packageId={pkg[0].id} amount={pkg[0].price} />
      </div>
    </div>
  );
}
