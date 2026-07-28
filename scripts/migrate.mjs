import { ensureSchema } from "../src/lib/migrate.ts";

await ensureSchema();
console.log("Supabase schema ready.");
process.exit(0);
