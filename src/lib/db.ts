import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

type Sql = ReturnType<typeof postgres>;

declare global {
  // eslint-disable-next-line no-var
  var __scw_sql: Sql | undefined;
  // eslint-disable-next-line no-var
  var __scw_db: ReturnType<typeof drizzle<typeof schema>> | undefined;
}

function getConnectionString() {
  const url =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.SUPABASE_DB_URL;
  if (!url) {
    throw new Error(
      "Missing DATABASE_URL / POSTGRES_URL. Connect Supabase and set the Postgres connection string.",
    );
  }
  return url;
}

function getSql(): Sql {
  if (globalThis.__scw_sql) return globalThis.__scw_sql;
  // prepare:false required for Supabase transaction pooler (pgbouncer)
  const sql = postgres(getConnectionString(), {
    prepare: false,
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
    onnotice: () => {},
  });
  globalThis.__scw_sql = sql;
  return sql;
}

export function getDb() {
  if (globalThis.__scw_db) return globalThis.__scw_db;
  const db = drizzle(getSql(), { schema });
  globalThis.__scw_db = db;
  return db;
}

export function getSqlClient() {
  return getSql();
}

export type Db = ReturnType<typeof getDb>;
