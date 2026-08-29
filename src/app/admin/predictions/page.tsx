// src/app/admin/predictions/page.tsx
import { db } from '@/db';
import { predictions, packages } from '@/db/schema';
import { desc, eq, and, gte, isNull } from 'drizzle-orm';
import PredictionForm from './PredictionForm';
import SyncApiButton from './SyncApiButton';
import DeletePredictionButton from './DeletePredictionButton';
import StatusSelector from './StatusSelector';

export const revalidate = 0;

type PredictionStatus = 'PENDING' | 'WON' | 'LOST';

interface PageProps {
  searchParams: {
    package?: string;
    status?: string;
    timeframe?: string;
  };
}

export default async function AdminPredictionsPage({ searchParams }: PageProps) {
  const selectedPackage = searchParams.package;
  const rawStatus = searchParams.status?.toUpperCase();
  const selectedTimeframe = searchParams.timeframe;

  const conditions = [];

  // Filter by Package
  if (selectedPackage === 'free') {
    conditions.push(isNull(predictions.packageId));
  } else if (selectedPackage) {
    conditions.push(eq(predictions.packageId, selectedPackage));
  }

  // Filter by Outcome Status
  if (rawStatus && ['PENDING', 'WON', 'LOST'].includes(rawStatus)) {
    const validStatus = rawStatus as PredictionStatus;
    conditions.push(eq(predictions.status, validStatus));
  }

  // Filter by Posted Date / Timeframe
  if (selectedTimeframe === 'today') {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    conditions.push(gte(predictions.createdAt, startOfToday));
  } else if (selectedTimeframe === 'week') {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);
    conditions.push(gte(predictions.createdAt, startOfWeek));
  }

  const query = db
    .select({
      pred: predictions,
      pkg: packages,
    })
    .from(predictions)
    .leftJoin(packages, eq(predictions.packageId, packages.id));

  const filteredQuery = conditions.length > 0 ? query.where(and(...conditions)) : query;
  const allPredictions = await filteredQuery.orderBy(desc(predictions.createdAt)).limit(50);
  const allPackages = await db.select().from(packages);

  const getFilterUrl = (key: string, value: string | null) => {
    const params = new URLSearchParams();
    if (selectedPackage && key !== 'package') params.set('package', selectedPackage);
    if (rawStatus && key !== 'status') params.set('status', rawStatus);
    if (selectedTimeframe && key !== 'timeframe') params.set('timeframe', selectedTimeframe);

    if (value) params.set(key, value);
    const queryString = params.toString();
    return `/admin/predictions${queryString ? `?${queryString}` : ''}`;
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-full overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
          Manage Predictions
        </h1>
        <SyncApiButton packages={allPackages} />
      </div>

      {/* --- SEGMENTATION CONTROL BOARD --- */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 mb-6 space-y-4">
        {/* Package Segmentation */}
        <div>
          <span className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
            Package Category
          </span>
          <div className="flex gap-2 flex-wrap">
            <a href={getFilterUrl('package', null)} className={`px-3 py-1.5 text-xs rounded-lg font-bold transition ${!selectedPackage ? 'bg-black text-white dark:bg-emerald-500 dark:text-slate-950' : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300'}`}>All Packages</a>
            <a href={getFilterUrl('package', 'free')} className={`px-3 py-1.5 text-xs rounded-lg font-bold transition ${selectedPackage === 'free' ? 'bg-black text-white dark:bg-emerald-500 dark:text-slate-950' : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300'}`}>Free Tips</a>
            {allPackages.map(p => (
              <a key={p.id} href={getFilterUrl('package', p.id)} className={`px-3 py-1.5 text-xs rounded-lg font-bold transition ${selectedPackage === p.id ? 'bg-black text-white dark:bg-emerald-500 dark:text-slate-950' : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300'}`}>
                {p.name}
              </a>
            ))}
          </div>
        </div>

        {/* Outcome Segmentation */}
        <div>
          <span className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
            Outcome Status
          </span>
          <div className="flex gap-2 flex-wrap">
            {[
              { label: 'All Outcomes', val: null },
              { label: 'Pending ⏳', val: 'PENDING' },
              { label: 'Won ✅', val: 'WON' },
              { label: 'Lost ❌', val: 'LOST' },
            ].map((st) => (
              <a
                key={st.label}
                href={getFilterUrl('status', st.val)}
                className={`px-3 py-1.5 text-xs rounded-lg font-bold transition ${
                  (st.val === null && !rawStatus) || rawStatus === st.val
                    ? 'bg-black text-white dark:bg-emerald-500 dark:text-slate-950'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200'
                }`}
              >
                {st.label}
              </a>
            ))}
          </div>
        </div>

        {/* Date Posted Segmentation */}
        <div>
          <span className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
            Time Posted
          </span>
          <div className="flex gap-2 flex-wrap">
            {[
              { label: 'All Time', val: null },
              { label: 'Posted Today', val: 'today' },
              { label: 'Posted This Week', val: 'week' },
            ].map((tf) => (
              <a
                key={tf.label}
                href={getFilterUrl('timeframe', tf.val)}
                className={`px-3 py-1.5 text-xs rounded-lg font-bold transition ${
                  (tf.val === null && !selectedTimeframe) || selectedTimeframe === tf.val
                    ? 'bg-black text-white dark:bg-emerald-500 dark:text-slate-950'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200'
                }`}
              >
                {tf.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Post Prediction Form */}
      <div className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 mb-8">
        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Post New Prediction</h2>
        <PredictionForm packages={allPackages} />
      </div>

      {/* Segmented Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-x-auto w-full">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-gray-50 dark:bg-slate-950/50 border-b border-gray-200 dark:border-slate-800">
            <tr>
              <th className="p-4 font-semibold text-gray-600 dark:text-slate-400">Match</th>
              <th className="p-4 font-semibold text-gray-600 dark:text-slate-400">Prediction</th>
              <th className="p-4 font-semibold text-gray-600 dark:text-slate-400">Package</th>
              <th className="p-4 font-semibold text-gray-600 dark:text-slate-400">Date Posted</th>
              <th className="p-4 font-semibold text-gray-600 dark:text-slate-400">Outcome</th>
              <th className="p-4 font-semibold text-gray-600 dark:text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
            {allPredictions.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500 dark:text-slate-400">
                  No predictions match the selected filters.
                </td>
              </tr>
            ) : (
              allPredictions.map(({ pred, pkg }) => (
                <tr key={pred.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition">
                  <td className="p-4 font-bold text-slate-900 dark:text-white">
                    {pred.homeTeam} vs {pred.awayTeam}
                  </td>
                  <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">
                    {pred.predictionText}
                  </td>
                  <td className="p-4">
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs px-2.5 py-1 rounded-full font-bold">
                      {pkg ? pkg.name : 'Free Tip'}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-gray-500 dark:text-slate-400">
                    {pred.createdAt ? new Date(pred.createdAt).toLocaleString() : 'N/A'}
                  </td>
                  <td className="p-4">
                    {/* Change Outcome Directly */}
                    <StatusSelector id={pred.id} currentStatus={pred.status || 'PENDING'} />
                  </td>
                  <td className="p-4 text-right">
                    {/* Delete Prediction */}
                    <DeletePredictionButton id={pred.id} />
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