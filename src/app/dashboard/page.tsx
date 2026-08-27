import { getSession } from '@/lib/session';
import { db } from '@/db';
import { subscriptions, packages, predictions, liveMatches } from '@/db/schema';
import { eq, and, gt, desc, ne, inArray } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import NewPredictionForm from '@/app/admin/predictions/NewPredictionForm';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const userId = session.user.id;
  const isAdmin = session.user.role === 'SUPERADMIN' || session.user.role === 'ADMIN';

  // Fetch all packages for the admin prediction form
  const allPackages = isAdmin ? await db.select().from(packages) : [];

  // Get active subscriptions
  const activeSubs = await db
    .select({
      sub: subscriptions,
      pkg: packages,
    })
    .from(subscriptions)
    .innerJoin(packages, eq(subscriptions.packageId, packages.id))
    .where(
      and(
        eq(subscriptions.userId, userId),
        eq(subscriptions.status, 'ACTIVE'),
        gt(subscriptions.expiryDate, new Date())
      )
    )
    .orderBy(desc(subscriptions.expiryDate));

  // Get predictions for active subscriptions
  let subPredictions: any[] = [];
  if (activeSubs.length > 0) {
    const packageIds = activeSubs.map((s) => s.pkg.id);
    subPredictions = await db
      .select()
      .from(predictions)
      .where(inArray(predictions.packageId, packageIds))
      .orderBy(desc(predictions.matchDate))
      .limit(20);
  }

  // Get recent free tips (using isFree column)
  const freeTips = await db
    .select()
    .from(predictions)
    .where(eq(predictions.isFree, true))
    .orderBy(desc(predictions.matchDate))
    .limit(5);

  // Get recent predictions posted by admin
  const recentAdminPredictions = isAdmin
    ? await db.select().from(predictions).orderBy(desc(predictions.createdAt)).limit(10)
    : [];

  // Get active live matches
  const activeLiveMatches = await db
    .select()
    .from(liveMatches)
    .where(ne(liveMatches.status, 'FULL_TIME'))
    .orderBy(desc(liveMatches.updatedAt))
    .limit(2);

  return (
    <div className="py-8 md:py-12 px-4 max-w-6xl mx-auto w-full">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-6 md:mb-8 text-center md:text-left">
        Welcome, {session.user.fullName}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Sidebar */}
        <div className="md:col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="bg-black text-white p-6 rounded-2xl shadow border border-gray-800">
            <h2 className="text-xl font-bold mb-2">Profile Overview</h2>
            <p className="text-yellow-500 font-bold text-lg mb-1">{session.user.fullName}</p>
            <p className="text-gray-400 text-sm">{session.user.email}</p>
            <div className="mt-4 flex gap-2">
              <span className="bg-gray-800 text-xs px-2 py-1 rounded font-bold uppercase">
                {session.user.role}
              </span>
            </div>
          </div>

          {/* Live Matches Snippet */}
          <div className="bg-white p-6 rounded-2xl shadow border border-gray-200">
            <h2 className="text-xl font-bold mb-4 border-b pb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
              Live Now
            </h2>
            {activeLiveMatches.length > 0 ? (
              <div className="space-y-4">
                {activeLiveMatches.map((match) => (
                  <div key={match.id} className="border border-red-100 bg-red-50 p-3 rounded-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl">
                      {match.minute}
                    </div>
                    <p className="text-xs font-bold text-gray-500 uppercase">{match.league}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="font-bold text-sm truncate w-2/5">{match.homeTeam}</span>
                      <span className="font-black text-red-600 mx-2">{match.score}</span>
                      <span className="font-bold text-sm truncate w-2/5 text-right">{match.awayTeam}</span>
                    </div>
                  </div>
                ))}
                <Link href="/live-matches" className="block text-center text-sm font-bold text-red-600 hover:underline">
                  View All Live Matches →
                </Link>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No live matches currently.</p>
            )}
          </div>

          {/* Subscription Status Card */}
          <div className="bg-white p-6 rounded-2xl shadow border border-gray-200">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Subscription Status</h2>
            {activeSubs.length > 0 ? (
              <div className="space-y-4">
                {activeSubs.map((activeSub) => (
                  <div key={activeSub.sub.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <p className="text-sm text-gray-500 font-semibold uppercase">Current Package</p>
                    <p className="text-xl font-extrabold text-yellow-600 mb-2">{activeSub.pkg.name}</p>

                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Expires On:</span>
                      <span className="font-bold">
                        {new Date(activeSub.sub.expiryDate).toLocaleDateString('en-US')}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Days Remaining:</span>
                      <span className="font-bold">
                        {Math.ceil(
                          (new Date(activeSub.sub.expiryDate).getTime() - new Date().getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-bold text-green-600">ACTIVE</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-4">You do not have an active subscription.</p>
                <Link
                  href="/packages"
                  className="block w-full text-center bg-yellow-500 text-black font-bold py-2 rounded hover:bg-yellow-400"
                >
                  View Packages
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Main Content Area */}
        <div className="md:col-span-2 space-y-8">
          {/* Admin Management Section (Visible to Admin/Superadmin) */}
          {isAdmin ? (
            <div className="space-y-8">
              {/* Form to Post New Predictions */}
              <div className="bg-white p-6 rounded-2xl shadow border border-gray-200">
                <h2 className="text-2xl font-bold mb-4 text-black">Create & Publish Prediction</h2>
                <NewPredictionForm packages={allPackages} />
              </div>

              {/* Admin Posted Predictions Table/List */}
              <div className="bg-white p-6 rounded-2xl shadow border border-gray-200">
                <h2 className="text-xl font-extrabold mb-4">Recently Posted Predictions</h2>
                <div className="space-y-3">
                  {recentAdminPredictions.map((pred) => (
                    <div
                      key={pred.id}
                      className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-gray-900">
                            {pred.homeTeam} vs {pred.awayTeam}
                          </span>
                          {pred.isFree ? (
                            <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded">
                              FREE
                            </span>
                          ) : (
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded">
                              VIP
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {pred.league || 'General'} • Tip: <strong>{pred.predictionText}</strong> (@
                          {Number(pred.chances).toFixed(2)})
                        </p>
                      </div>
                      <span className="text-xs font-bold px-2 py-1 rounded bg-gray-100 uppercase">
                        {pred.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Regular User Premium Predictions Card */
            <div className="bg-white p-6 rounded-2xl shadow border border-gray-200">
              <h2 className="text-2xl font-bold mb-4 text-yellow-600">Premium Predictions</h2>
              {activeSubs.length > 0 ? (
                subPredictions.length > 0 ? (
                  <div className="space-y-4">
                    {subPredictions.map((pred) => (
                      <div key={pred.id} className="border border-gray-100 p-4 rounded-lg bg-gray-50">
                        <div className="flex justify-between mb-2">
                          <span className="font-bold text-gray-800">{pred.league}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(pred.matchDate).toLocaleDateString('en-US')}
                          </span>
                        </div>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2">
                          <span className="font-bold text-base md:text-lg leading-tight">
                            {pred.homeTeam} vs {pred.awayTeam}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs font-bold rounded self-start md:self-auto ${
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
                        <div className="flex flex-col md:flex-row justify-between md:items-center border-t pt-2 mt-2 gap-1 text-sm md:text-base">
                          <span className="text-gray-600">
                            Prediction: <strong className="text-black">{pred.predictionText}</strong>
                          </span>
                          <span className="text-gray-600">
                            Chances: <strong className="text-black">{Number(pred.chances).toFixed(2)}</strong>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No predictions available yet for your active packages.</p>
                )
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Subscribe to a package to view premium predictions.</p>
                  <span className="inline-block text-4xl">🔒</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}