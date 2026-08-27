'use client';

import { InferSelectModel } from 'drizzle-orm';
import { packages } from '@/db/schema';

type BasePackage = InferSelectModel<typeof packages>;

export type PackageWithStats = BasePackage & {
  winRate: number;
  totalFinished: number;
};

interface PackagesListProps {
  packages: PackageWithStats[];
}

export default function PackagesList({ packages }: PackagesListProps) {
  const whatsappNumber = "0774032355";
  const recipientName = "ROBERT KALIBBALA";

  return (
    <div className="space-y-12">
      {/* Packages Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 flex flex-col justify-between relative transition-all duration-300 hover:shadow-2xl"
          >
            {pkg.totalFinished > 0 && (
              <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                {pkg.winRate}% Win Rate
              </div>
            )}

            <div>
              <div className="bg-black text-center py-6 border-b-4 border-yellow-500">
                <h2 className="text-2xl font-extrabold text-white mb-2">{pkg.name}</h2>
                <p className="text-4xl font-black text-yellow-500">
                  UGX {pkg.price.toLocaleString()}
                </p>
                <p className="text-gray-400 text-sm mt-1">Monthly Subscription</p>
              </div>

              <div className="p-6">
                <h3 className="font-bold text-lg mb-3 text-gray-900">What's Included:</h3>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {pkg.description}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0">
              <a
                href={`https://wa.me/256774032355?text=${encodeURIComponent(
                  `Hi Robert, I want to subscribe to the ${pkg.name} package (UGX ${pkg.price.toLocaleString()})`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center font-bold py-3 px-4 rounded-xl transition-colors bg-yellow-500 text-black hover:bg-yellow-400 shadow-md"
              >
                Order Package via WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Information Notice */}
      <div className="bg-yellow-50 border-2 border-yellow-500 rounded-2xl p-6 max-w-2xl mx-auto shadow-md">
        <h3 className="text-xl font-extrabold text-black mb-3 text-center uppercase">
          💳 Payment Instructions
        </h3>
        
        <div className="space-y-2 text-gray-800 text-center font-medium">
          <p>
            Payments are made <strong className="text-black underline">ONLY</strong> to:
          </p>
          <p className="text-2xl font-black text-black">
            {whatsappNumber}
          </p>
          <p className="text-sm text-gray-600 font-semibold">
            In the names of: <span className="text-black uppercase">{recipientName}</span>
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-yellow-200 text-xs text-center text-gray-700 font-semibold">
          ⚠️ <strong>NOTE:</strong> After sending payment, send a clear screenshot or photo showing the transaction date and time via WhatsApp to get activated.
        </div>
      </div>
    </div>
  );
}