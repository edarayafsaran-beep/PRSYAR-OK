// server/db.ts
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@shared/schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const db = drizzle(pool, { schema });

// Optional: test DB connection
export async function testConnection() {
  try {
    await db.select().from(schema.users).limit(1);
    console.log("Database connected ✅");
  } catch (err) {
    console.error("Database connection failed ❌", err);
    throw err;
  }
}