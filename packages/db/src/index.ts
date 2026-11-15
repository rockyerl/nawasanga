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

if (process.env.NODE_ENV !== "production") {
  globalForDb.libsqlClient = client;
}

export const db = drizzle(client, { schema });
export * from "./schema";
