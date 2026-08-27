import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

// Lazy creation of pool using the current process.env value
function getPool(): Pool {
  if (globalForDb.__arenaNextJsPostgresqlPool) {
    return globalForDb.__arenaNextJsPostgresqlPool;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString && typeof window === "undefined") {
    console.warn("⚠️ Warning: DATABASE_URL is not defined in process.env");
  }

  const poolInstance = new Pool({
    connectionString: connectionString || undefined,
  });

  if (process.env.NODE_ENV !== "production") {
    globalForDb.__arenaNextJsPostgresqlPool = poolInstance;
  }

  return poolInstance;
}

export const pool = getPool();
export const db = drizzle(pool, { schema });