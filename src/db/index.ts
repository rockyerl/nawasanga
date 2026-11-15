import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const dbUrl = process.env.DATABASE_URL || "file:local.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

const globalForDb = globalThis as unknown as {
  libsqlClient: ReturnType<typeof createClient> | undefined;
};

export const client =
  globalForDb.libsqlClient ??
  createClient({
    url: dbUrl,
    authToken: authToken,
  });

// Optimize SQLite / LibSQL local file engine performance
if (dbUrl.startsWith("file:")) {
  Promise.resolve().then(async () => {
    try {
      await client.execute("PRAGMA journal_mode = WAL;");
      await client.execute("PRAGMA synchronous = NORMAL;");
      await client.execute("PRAGMA foreign_keys = ON;");
      await client.execute("PRAGMA cache_size = -64000;"); // 64MB in-memory page cache
      await client.execute("PRAGMA temp_store = MEMORY;");
    } catch {
      // Pragmas may be restricted or unsupported on some storage engines
    }
  });
}

if (process.env.NODE_ENV !== "production") {
  globalForDb.libsqlClient = client;
}

export const db = drizzle(client, { schema });
export * from "./schema";
