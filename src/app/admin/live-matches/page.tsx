import { db } from '@/db';
import { liveMatches } from '@/db/schema';
import { desc } from 'drizzle-orm';
import LiveMatchForm from './LiveMatchForm';
import DeleteMatchButton from './DeleteMatchButton';

export const revalidate = 0; // Force dynamic rendering on every request
export const dynamic = 'force-dynamic';

export default async function AdminLiveMatchesPage() {
  const matches = await db
    .select()
    .from(liveMatches)
    .orderBy(desc(liveMatches.updatedAt))
    .limit(20);

  // Status Badge Helper function
  const renderStatusBadge = (status: string, minute?: string | null) => {
    const normalized = status?.toLowerCase() || 'pending';

    if (normalized === 'live' || (minute && minute !== "0'" && minute !== 'FT' && minute !== '90+')) {
      return (
        <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-bold text-emerald-600 dark:text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </span>
      );
    }

    if (normalized === 'done' || normalized === 'finished' || minute === 'FT') {
      return (
        <span className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300">
          Done
        </span>
      );
    }

    return (
      <span className="bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full text-xs font-bold text-amber-600 dark:text-amber-400">
        Pending
      </span>
    );
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-full overflow-hidden">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-6 md:mb-8 text-slate-900 dark:text-white">
        Manage Live Matches
      </h1>

      <div className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 mb-6 md:mb-8">
        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Add or Update Match</h2>
        <LiveMatchForm matches={matches} />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-x-auto w-full">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-gray-50 dark:bg-slate-950/50 border-b border-gray-200 dark:border-slate-800">
            <tr>
              <th className="p-4 font-semibold text-gray-600 dark:text-slate-400">Match</th>
              <th className="p-4 font-semibold text-gray-600 dark:text-slate-400">Score</th>
              <th className="p-4 font-semibold text-gray-600 dark:text-slate-400">Minute</th>
              <th className="p-4 font-semibold text-gray-600 dark:text-slate-400">Status</th>
              <th className="p-4 font-semibold text-gray-600 dark:text-slate-400">Prediction</th>
              <th className="p-4 font-semibold text-gray-600 dark:text-slate-400">Last Updated</th>
              <th className="p-4 font-semibold text-gray-600 dark:text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
            {matches.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500 dark:text-slate-400">
                  No live matches found.
                </td>
              </tr>
            ) : (
              matches.map((match) => (
                <tr key={match.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition">
                  <td className="p-4 font-bold text-slate-900 dark:text-white">
                    {match.homeTeam} vs {match.awayTeam}
                  </td>
                  <td className="p-4 text-xl font-black text-slate-900 dark:text-white">
                    {match.score}
                  </td>
                  <td className="p-4 text-rose-600 font-bold">{match.minute || "0'"}</td>
                  <td className="p-4">{renderStatusBadge(match.status, match.minute)}</td>
                  <td className="p-4 text-slate-700 dark:text-slate-300">
                    {match.predictionText} ({match.chances})
                  </td>
                  <td className="p-4 text-sm text-gray-500 dark:text-slate-400">
                    {match.updatedAt ? new Date(match.updatedAt).toLocaleString() : 'N/A'}
                  </td>
                  <td className="p-4 text-right">
                    <DeleteMatchButton id={match.id} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}