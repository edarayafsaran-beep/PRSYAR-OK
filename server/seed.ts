import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@shared/schema';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  try {
    console.log('🌱 Seeding database...');

    // Check if admin already exists
    const adminExists = await db
      .select()
      .from(users)
      .where(eq(users.militaryId, 'ADMIN123'));

    if (adminExists.length > 0) {
      console.log('✅ Admin account already exists');
    } else {
      // Create admin account
      await db.insert(users).values({
        fullName: 'رێبەری سیستەم', // "System Administrator" in Kurdish
        militaryId: 'ADMIN123',
        role: 'admin',
      });
      console.log('✅ Admin account created: ADMIN123');
    }

    // Check if test officer exists
    const officerExists = await db
      .select()
      .from(users)
      .where(eq(users.militaryId, 'TEST001'));

    if (officerExists.length > 0) {
      console.log('✅ Test officer account already exists');
    } else {
      // Create test officer account
      await db.insert(users).values({
        fullName: 'سەربازی تێست',  // "Test Officer" in Kurdish
        militaryId: 'TEST001',
        role: 'officer',
      });
      console.log('✅ Test officer account created: TEST001');
    }

    console.log('🎉 Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
