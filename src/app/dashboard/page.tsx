// src/app/dashboard/page.tsx
import { getSession } from '@/lib/session';
import { db } from '@/db';
import { subscriptions, packages, predictions, liveMatches } from '@/db/schema';
import { eq, and, gt, desc, ne, inArray, isNull } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import NewPredictionForm from '@/app/admin/predictions/NewPredictionForm';
import StatusSelector from '@/app/admin/predictions/StatusSelector';
import DeletePredictionButton from '@/app/admin/predictions/DeletePredictionButton';

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

  // Get recent free tips (where packageId is null)
  const freeTips = await db
    .select()
    .from(predictions)
    .where(isNull(predictions.packageId))
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
      <h1 className="text-2xl md:text-3xl font-extrabold mb-6 md:mb-8 text-center md:text-left text-slate-900 dark:text-white">
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
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow border border-gray-200 dark:border-slate-800">
            <h2 className="text-xl font-bold mb-4 border-b border-gray-100 dark:border-slate-800 pb-2 flex items-center gap-2 text-slate-900 dark:text-white">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
              Live Now
            </h2>
            {activeLiveMatches.length > 0 ? (
              <div className="space-y-4">
                {activeLiveMatches.map((match) => (
                  <div key={match.id} className="border border-red-100 dark:border-red-950 bg-red-50/50 dark:bg-red-950/20 p-3 rounded-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl">
                      {match.minute}
                    </div>
                    <p className="text-xs font-bold text-gray-500 uppercase">{match.league}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="font-bold text-sm truncate w-2/5 text-slate-900 dark:text-white">{match.homeTeam}</span>
                      <span className="font-black text-red-600 mx-2">{match.score}</span>
                      <span className="font-bold text-sm truncate w-2/5 text-right text-slate-900 dark:text-white">{match.awayTeam}</span>
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
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow border border-gray-200 dark:border-slate-800">
            <h2 className="text-xl font-bold mb-4 border-b border-gray-100 dark:border-slate-800 pb-2 text-slate-900 dark:text-white">Subscription Status</h2>
            {activeSubs.length > 0 ? (
              <div className="space-y-4">
                {activeSubs.map((activeSub) => (
                  <div key={activeSub.sub.id} className="border-b border-gray-100 dark:border-slate-800 pb-4 last:border-b-0 last:pb-0">
                    <p className="text-sm text-gray-500 font-semibold uppercase">Current Package</p>
                    <p className="text-xl font-extrabold text-yellow-600 dark:text-yellow-500 mb-2">{activeSub.pkg.name}</p>

                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-slate-400">Expires On:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {new Date(activeSub.sub.expiryDate).toLocaleDateString('en-US')}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-slate-400">Days Remaining:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {Math.ceil(
                          (new Date(activeSub.sub.expiryDate).getTime() - new Date().getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-slate-400">Status:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">ACTIVE</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <p className="text-gray-600 dark:text-slate-400 mb-4">You do not have an active subscription.</p>
                <Link
                  href="/packages"
                  className="block w-full text-center bg-yellow-500 text-black font-bold py-2 rounded-xl hover:bg-yellow-400 transition"
                >
                  View Packages
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Main Content Area */}
        <div className="md:col-span-2 space-y-8">
          {/* Admin Management Section */}
          {isAdmin ? (
            <div className="space-y-8">
              {/* Form to Post New Predictions */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow border border-gray-200 dark:border-slate-800">
                <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Create & Publish Prediction</h2>
                <NewPredictionForm packages={allPackages} />
              </div>

              {/* Admin Posted Predictions Table/List */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow border border-gray-200 dark:border-slate-800">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Recently Posted Predictions</h2>
                  <Link href="/admin/predictions" className="text-xs font-bold text-emerald-600 hover:underline">
                    View & Filter All →
                  </Link>
                </div>
                <div className="space-y-3">
                  {recentAdminPredictions.length === 0 ? (
                    <p className="text-sm text-gray-500">No predictions created yet.</p>
                  ) : (
                    recentAdminPredictions.map((pred) => (
                      <div
                        key={pred.id}
                        className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 dark:text-white">
                              {pred.homeTeam} vs {pred.awayTeam}
                            </span>
                            {!pred.packageId ? (
                              <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 text-xs font-bold px-2 py-0.5 rounded">
                                FREE
                              </span>
                            ) : (
                              <span className="bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400 text-xs font-bold px-2 py-0.5 rounded">
                                VIP
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                            {pred.league || 'General'} • Tip: <strong>{pred.predictionText}</strong> (@
                            {Number(pred.chances).toFixed(2)})
                          </p>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          {/* Live Status Selector */}
                          <StatusSelector id={pred.id} currentStatus={pred.status || 'PENDING'} />
                          {/* Quick Delete Action */}
                          <DeletePredictionButton id={pred.id} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Regular User Premium Predictions Card */
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow border border-gray-200 dark:border-slate-800">
              <h2 className="text-2xl font-bold mb-4 text-yellow-600 dark:text-yellow-500">Premium Predictions</h2>
              {activeSubs.length > 0 ? (
                subPredictions.length > 0 ? (
                  <div className="space-y-4">
                    {subPredictions.map((pred) => (
                      <div key={pred.id} className="border border-gray-200 dark:border-slate-800 p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50">
                        <div className="flex justify-between mb-2">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{pred.league}</span>
                          <span className="text-xs text-gray-500 dark:text-slate-400">
                            {new Date(pred.matchDate).toLocaleDateString('en-US')}
                          </span>
                        </div>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2">
                          <span className="font-bold text-base md:text-lg leading-tight text-slate-900 dark:text-white">
                            {pred.homeTeam} vs {pred.awayTeam}
                          </span>
                          <span
                            className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                              pred.status === 'WON'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400'
                                : pred.status === 'LOST'
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-400'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400'
                            }`}
                          >
                            {pred.status || 'PENDING'}
                          </span>
                        </div>
                        <div className="flex flex-col md:flex-row justify-between md:items-center border-t border-gray-200 dark:border-slate-800 pt-2 mt-2 gap-1 text-sm">
                          <span className="text-gray-600 dark:text-slate-400">
                            Prediction: <strong className="text-slate-900 dark:text-white">{pred.predictionText}</strong>
                          </span>
                          <span className="text-gray-600 dark:text-slate-400">
                            Odds: <strong className="text-slate-900 dark:text-white">{Number(pred.chances).toFixed(2)}</strong>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-slate-400">No predictions available yet for your active packages.</p>
                )
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-slate-400 mb-4">Subscribe to a package to view premium predictions.</p>
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