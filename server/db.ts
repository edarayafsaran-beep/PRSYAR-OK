import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@shared/schema';

// هێمای ! گرنگە بۆ ئەوەی بزانێت URLەکە دڵنیایە
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });