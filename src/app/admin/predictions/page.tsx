import { db } from '@/db';
import { predictions, packages } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import PredictionForm from './PredictionForm';
import SyncApiButton from './SyncApiButton';

export default async function AdminPredictionsPage({ searchParams }: { searchParams: { package?: string } }) {
  let query = db.select({
    pred: predictions,
    pkg: packages,
  })
    .from(predictions)
    .leftJoin(packages, eq(predictions.packageId, packages.id));

  if (searchParams.package === 'free') {
    const { isNull } = await import('drizzle-orm');
    query = query.where(isNull(predictions.packageId)) as any;
  } else if (searchParams.package) {
    query = query.where(eq(predictions.packageId, searchParams.package)) as any;
  }

  const allPredictions = await query.orderBy(desc(predictions.createdAt)).limit(50);

  const allPackages = await db.select().from(packages);

  return (
      <div className="p-4 md:p-8 w-full max-w-full overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-extrabold">Manage Predictions</h1>
          <SyncApiButton packages={allPackages} />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
          <a href="/admin/predictions" className={`px-4 py-2 rounded font-bold whitespace-nowrap ${!searchParams.package ? 'bg-black text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>All</a>
          <a href="/admin/predictions?package=free" className={`px-4 py-2 rounded font-bold whitespace-nowrap ${searchParams.package === 'free' ? 'bg-black text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>Free Tips</a>
          {allPackages.map(p => (
            <a key={p.id} href={`/admin/predictions?package=${p.id}`} className={`px-4 py-2 rounded font-bold whitespace-nowrap ${searchParams.package === p.id ? 'bg-black text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>
              {p.name}
            </a>
          ))}
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-bold mb-4">Add New Prediction</h2>
          <PredictionForm packages={allPackages} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Date</th>
                <th className="p-4 font-semibold text-gray-600">Match</th>
                <th className="p-4 font-semibold text-gray-600">Prediction</th>
                <th className="p-4 font-semibold text-gray-600">Chances</th>
                <th className="p-4 font-semibold text-gray-600">Package</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {allPredictions.map(({ pred, pkg }) => (
                <tr key={pred.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-4">{pred.matchDate.toLocaleDateString()}</td>
                  <td className="p-4">{pred.homeTeam} vs {pred.awayTeam}</td>
                  <td className="p-4 font-bold">{pred.predictionText}</td>
                  <td className="p-4">{Number(pred.chances).toFixed(2)}</td>
                  <td className="p-4">
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded font-bold">
                      {pkg ? pkg.name : 'Free Tip'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded ${pred.status === 'WON' ? 'bg-green-100 text-green-800' : pred.status === 'LOST' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {pred.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  );
}
