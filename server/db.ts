import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@shared/schema';

// ئەمە وا دەکات پەیوەندییەکە خێراتر و جێگیرتر بێت لەسەر سێرڤەر
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Please check your Railway environment variables.",
  );
}

// بەکارهێنانی neon-http لەبری Pool بۆ داتابەیسی Neon
const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });