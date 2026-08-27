import { db } from '@/db';
import { predictions } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';

export default async function FreeTipsPage() {
  // Query predictions explicitly flagged as free
  const freeTips = await db
    .select()
    .from(predictions)
    .where(eq(predictions.isFree, true))
    .orderBy(desc(predictions.matchDate))
    .limit(20);

  return (
    <div className="py-12 px-4 max-w-4xl mx-auto w-full">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold mb-4 uppercase">Free Predictions</h1>
        <p className="text-gray-600">
          Get a taste of our winning tips. For even higher chances and guaranteed consistency, upgrade to one of our premium packages.
        </p>
        <Link href="/packages" className="inline-block mt-4 text-yellow-600 font-bold hover:underline">
          View Premium Packages →
        </Link>
      </div>

      {freeTips.length > 0 ? (
        <div className="space-y-4">
          {freeTips.map((pred) => (
            <div key={pred.id} className="bg-white border border-gray-200 p-4 md:p-6 rounded-xl shadow-sm">
              <div className="flex justify-between mb-2">
                <span className="font-bold text-gray-800 text-sm md:text-base">
                  {pred.league || 'General Match'}
                </span>
                <span className="text-xs md:text-sm text-gray-500">
                  {new Date(pred.matchDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                <span className="font-bold text-lg md:text-xl leading-tight">
                  {pred.homeTeam} vs {pred.awayTeam}
                </span>
                <span
                  className={`px-3 py-1 text-xs font-bold rounded self-start md:self-auto ${
                    pred.status === 'WON'
                      ? 'bg-green-100 text-green-800'
                      : pred.status === 'LOST'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {pred.status}
                </span>
              </div>

              <div className="bg-gray-50 p-3 md:p-4 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <span className="text-gray-600 text-sm md:text-base">
                  Prediction: <strong className="text-black text-base md:text-lg">{pred.predictionText}</strong>
                </span>
                <span className="text-gray-600 text-sm md:text-base">
                  Chances: <strong className="text-black text-base md:text-lg">{Number(pred.chances).toFixed(2)}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-xl shadow-sm">
          <p className="text-gray-500">No free tips available at the moment. Please check back later.</p>
        </div>
      )}
    </div>
  );
}