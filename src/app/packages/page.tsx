import { db } from "@/db";
import { packages, predictions } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import PackagesList from "./PackagesList";

export const revalidate = 0;

type Package = InferSelectModel<typeof packages>;
type Prediction = InferSelectModel<typeof predictions>;

export default async function PackagesPage() {
  const [allPackages, allPredictions] = await Promise.all([
    db.select().from(packages),
    db.select().from(predictions),
  ]);

  const packagesWithStats = allPackages.map((pkg: Package) => {
    const pkgPredictions = allPredictions.filter(
      (p: Prediction) => p.packageId === pkg.id
    );

    const totalFinished = pkgPredictions.filter(
      (p: Prediction) => p.status === "WON" || p.status === "LOST"
    ).length;

    const totalWon = pkgPredictions.filter(
      (p: Prediction) => p.status === "WON"
    ).length;

    const winRate =
      totalFinished > 0 ? Math.round((totalWon / totalFinished) * 100) : 0;

    return {
      ...pkg,
      winRate,
      totalFinished,
    };
  });

  return (
    <div className="py-12 px-4 max-w-6xl mx-auto w-full">
      <h1 className="text-4xl font-extrabold text-center mb-4 uppercase">
        Subscription Packages
      </h1>
      <p className="text-center text-neutral-400 mb-12 max-w-2xl mx-auto">
        Choose the package that fits your prediction strategy. Gain access to premium predictions and start winning today.
      </p>

      <PackagesList packages={packagesWithStats} />
    </div>
  );
}