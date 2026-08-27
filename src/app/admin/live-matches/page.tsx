import { db } from '@/db';
import { liveMatches } from '@/db/schema';
import { desc } from 'drizzle-orm';
import LiveMatchForm from './LiveMatchForm';

export default async function AdminLiveMatchesPage() {
  const matches = await db.select().from(liveMatches).orderBy(desc(liveMatches.updatedAt)).limit(20);

  return (
    <div className="p-4 md:p-8 w-full max-w-full overflow-hidden">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-6 md:mb-8">Manage Live Matches</h1>
      
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 mb-6 md:mb-8">
        <h2 className="text-xl font-bold mb-4">Add or Update Match</h2>
        <LiveMatchForm matches={matches} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto w-full">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Match</th>
              <th className="p-4 font-semibold text-gray-600">Score</th>
              <th className="p-4 font-semibold text-gray-600">Minute</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600">Prediction</th>
              <th className="p-4 font-semibold text-gray-600">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => (
              <tr key={match.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4 font-bold">{match.homeTeam} vs {match.awayTeam}</td>
                <td className="p-4 text-xl font-black">{match.score}</td>
                <td className="p-4 text-red-600 font-bold">{match.minute}</td>
                <td className="p-4">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold">
                    {match.status}
                  </span>
                </td>
                <td className="p-4">{match.predictionText} ({match.chances})</td>
                <td className="p-4 text-sm text-gray-500">{match.updatedAt.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
