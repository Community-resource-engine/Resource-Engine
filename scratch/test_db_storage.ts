import { storage } from '../server/storage.ts';

async function testDbStorage() {
  try {
    console.log('Testing searchFacilities...');
    const searchResult = await storage.searchFacilities({
      directory: 'mental',
      limit: 2,
    });
    
    console.log(`Found ${searchResult.total} mental health facilities.`);
    if (searchResult.facilities.length > 0) {
      console.log('Sample facility:', JSON.stringify(searchResult.facilities[0], null, 2));
    }

    console.log('Testing getFacilityById...');
    if (searchResult.facilities.length > 0) {
       const id = searchResult.facilities[0].id;
       const facility = await storage.getFacilityById(id);
       console.log(`Facility ${id} lookup success:`, !!facility);
    }

    console.log('Testing search functionality...');
    const newYorkResult = await storage.searchFacilities({
        state: 'NY',
        limit: 1
    });
    console.log(`Found ${newYorkResult.total} facilities in NY.`);
    
    console.log('All tests completed successfully.');
    // Exit clean
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

testDbStorage();
