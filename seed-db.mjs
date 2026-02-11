#!/usr/bin/env node

/**
 * Seed database with initial data
 * Run with: node seed-db.mjs
 */

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

async function seed() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Create tables (if not exists)
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        military_id VARCHAR(255) UNIQUE NOT NULL,
        role VARCHAR(50) DEFAULT 'officer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Check if admin exists
    const admin = await client.query(
      'SELECT * FROM users WHERE military_id = $1',
      ['ADMIN123']
    );

    if (admin.rows.length === 0) {
      await client.query(
        'INSERT INTO users (full_name, military_id, role) VALUES ($1, $2, $3)',
        ['Admin Officer', 'ADMIN123', 'admin']
      );
      console.log('✓ Admin created');
    }

    // Check if officer exists
    const officer = await client.query(
      'SELECT * FROM users WHERE military_id = $1',
      ['987654321']
    );

    if (officer.rows.length === 0) {
      await client.query(
        'INSERT INTO users (full_name, military_id, role) VALUES ($1, $2, $3)',
        ['Sarbaz Ahmed', '987654321', 'officer']
      );
      console.log('✓ Officer created');
    }

    console.log('✓ Database seeded successfully!');
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    await client.end();
  }
}

seed();
