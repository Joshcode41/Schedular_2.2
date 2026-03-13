import { Client } from 'pg';

async function createDatabase() {
  const client = new Client({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'postgres', // Connect to default postgres database
  });

  try {
    await client.connect();
    
    // Check if database exists
    const result = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = 'scheduler_db'`
    );

    if (result.rows.length === 0) {
      await client.query('CREATE DATABASE scheduler_db');
      console.log('✅ Database scheduler_db created successfully!');
    } else {
      console.log('ℹ️  Database scheduler_db already exists');
    }
  } catch (error) {
    console.error('❌ Error creating database:', error);
    throw error;
  } finally {
    await client.end();
  }
}

createDatabase().catch(console.error);
