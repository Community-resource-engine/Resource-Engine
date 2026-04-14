
import { getDbPool, query } from './server/db.ts';
import 'dotenv/config';

async function checkDb() {
  try {
    console.log('Checking database connection...');
    const pool = getDbPool();
    const [result] = await pool.query('SELECT 1 + 1 AS result');
    console.log('Database connection successful:', result);

    console.log('Checking for facilities table...');
    const tables = await query("SHOW TABLES LIKE 'facilities'");
    console.log('Tables found:', tables);

    if (tables.length > 0) {
      const countResult = await query("SELECT COUNT(*) as count FROM facilities");
      console.log('Facilities count:', countResult[0].count);
      
      const sample = await query("SELECT * FROM facilities LIMIT 1");
      console.log('Sample facility:', JSON.stringify(sample[0], null, 2));
    } else {
      console.log('Facilities table not found.');
      
      // Check for other tables
      const allTables = await query("SHOW TABLES");
      console.log('All tables:', allTables);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Database check failed:', error);
    process.exit(1);
  }
}

checkDb();
