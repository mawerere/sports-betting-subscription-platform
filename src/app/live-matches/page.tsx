import { db } from '@/db';
import { liveMatches } from '@/db/schema';
import { desc } from 'drizzle-orm';

export default async function LiveMatchesPage() {
  const matches = await db.select().from(liveMatches).orderBy(desc(liveMatches.updatedAt));

  return (
    <div className="py-8 md:py-12 px-4 max-w-5xl mx-auto w-full">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 uppercase text-red-600 flex items-center justify-center gap-2">
          <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></span>
          Live Matches
        </h1>
        <p className="text-gray-600">Follow our premium predictions live as the action unfolds on the pitch.</p>
      </div>

      {matches.length > 0 ? (
        <div className="grid gap-6">
          {matches.map(match => (
            <div key={match.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col items-center md:items-start w-full md:w-1/3">
                <span className="text-sm font-bold text-gray-500 uppercase">{match.league}</span>
                <div className="flex gap-2 items-center mt-2">
                  <span className={`px-2 py-1 text-xs font-bold rounded ${match.status === 'FULL_TIME' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800 animate-pulse'}`}>
                    {match.status.replace('_', ' ')}
                  </span>
                  {match.status !== 'FULL_TIME' && match.status !== 'PENDING' && (
                    <span className="text-sm font-bold text-red-600">{match.minute}</span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center w-full md:w-1/3 px-4">
                <span className="font-bold text-xl md:text-2xl flex-1 text-right">{match.homeTeam}</span>
                <span className="px-4 text-2xl font-black bg-gray-100 rounded mx-4 py-1">{match.score}</span>
                <span className="font-bold text-xl md:text-2xl flex-1 text-left">{match.awayTeam}</span>
              </div>

              <div className="flex flex-col items-center md:items-end w-full md:w-1/3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="text-xs text-gray-500 uppercase font-bold mb-1">Our Prediction</span>
                <span className="font-bold text-lg">{match.predictionText}</span>
                <span className="text-sm text-gray-600">Chances: <strong className="text-black">{match.chances}</strong></span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-xl shadow-sm">
          <p className="text-gray-500 text-lg">No live matches at the moment. Please check back later.</p>
        </div>
      )}
    </div>
  );
}
