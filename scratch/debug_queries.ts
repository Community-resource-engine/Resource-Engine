import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.MYSQL_DATABASE_URL || 'postgresql://postgres.unibwponccrpyuoyxiqh:B6OCUrIUdsWgJO78@aws-0-us-west-2.pooler.supabase.com:6543/postgres'
});

async function check() {
  try {
    const facilityTypes = await pool.query('SELECT * FROM facility_types');
    console.log('Facility Types:', facilityTypes.rows);

    const checkState = await pool.query('SELECT DISTINCT state FROM facilities LIMIT 10');
    console.log('States in DB:', checkState.rows);

    const firstFacility = await pool.query('SELECT * FROM facilities LIMIT 1');
    console.log('First Facility:', firstFacility.rows);

    const count = await pool.query('SELECT COUNT(*) FROM facilities');
    console.log('Total Facilities:', count.rows);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
