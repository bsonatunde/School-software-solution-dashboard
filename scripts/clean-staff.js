const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function cleanStaffCollection() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DATABASE_NAME || 'pacey-school-db';
  
  if (!uri) {
    console.error('❌ MONGODB_URI not found');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    console.log('🔄 Connecting to database...');
    await client.connect();
    
    const db = client.db(dbName);
    console.log(`📋 Connected to database: ${dbName}`);

    // Check current staff count
    const staffCount = await db.collection('staff').countDocuments();
    console.log(`📊 Current staff count: ${staffCount}`);

    if (staffCount > 0) {
      // Delete all staff documents
      const result = await db.collection('staff').deleteMany({});
      console.log(`🗑️ Deleted ${result.deletedCount} staff records`);
    } else {
      console.log('✅ Staff collection is already empty');
    }

    // Verify cleanup
    const finalCount = await db.collection('staff').countDocuments();
    console.log(`📊 Final staff count: ${finalCount}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('🔐 Database connection closed');
  }
}

cleanStaffCollection();
