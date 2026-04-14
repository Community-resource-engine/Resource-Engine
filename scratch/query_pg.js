const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.unibwponccrpyuoyxiqh:B6OCUrIUdsWgJO78@aws-0-us-west-2.pooler.supabase.com:6543/postgres'
});

async function run() {
  await client.connect();
  
  console.log("--- Facility Types ---");
  const types = await client.query('SELECT * FROM facility_types');
  console.log(types.rows);

  console.log("--- Services Sample ---");
  const services = await client.query('SELECT * FROM services LIMIT 5');
  console.log(services.rows);

  console.log("--- Facilities Sample ---");
  const facilities = await client.query('SELECT id, name1, "facilityTypeId", "serviceIds" FROM facilities LIMIT 5');
  console.log(facilities.rows);
  
  await client.end();
}

run().catch(console.error);
