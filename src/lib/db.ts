import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import { mkdirSync } from "fs";
import { dirname } from "path";

function getUrl() {
  if (process.env.TURSO_DATABASE_URL) return process.env.TURSO_DATABASE_URL;
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  // Vercel serverless: writable /tmp only
  if (process.env.VERCEL) return "file:/tmp/smart-car-wash.db";
  return "file:./data/smart.db";
}

export function getDb() {
  const url = getUrl();
  if (url.startsWith("file:")) {
    const path = url.replace("file:", "");
    try {
      mkdirSync(dirname(path), { recursive: true });
    } catch {
      /* ignore */
    }
  }
  const authToken = process.env.TURSO_AUTH_TOKEN;
  const client = createClient(authToken ? { url, authToken } : { url });
  return drizzle(client, { schema });
}

export type Db = ReturnType<typeof getDb>;
