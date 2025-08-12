const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function cleanDatabase() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DATABASE_NAME || 'pacey-school-db';
  
  if (!uri) {
    console.error('❌ MONGODB_URI not found in environment variables');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    console.log('🔄 Connecting to database...');
    await client.connect();
    
    const db = client.db(dbName);
    console.log(`📋 Connected to database: ${dbName}`);

    // Collections to clean
    const collections = [
      'students',
      'staff', 
      'teachers',
      'classes',
      'subjects',
      'attendance',
      'results',
      'fees',
      'feePayments',
      'leave',
      'timetable',
      'transport',
      'library_books',
      'library_borrowings'
    ];

    console.log('\n📊 Current database status:');
    let totalBefore = 0;
    
    // Check current counts
    for (const collectionName of collections) {
      try {
        const collection = db.collection(collectionName);
        const count = await collection.countDocuments();
        console.log(`  📁 ${collectionName}: ${count} documents`);
        totalBefore += count;
      } catch (error) {
        console.log(`  📁 ${collectionName}: Error reading collection`);
      }
    }

    console.log(`\n📈 Total documents: ${totalBefore}`);

    if (totalBefore === 0) {
      console.log('✅ Database is already clean!');
      return;
    }

    // Confirm cleanup
    console.log('\n⚠️  WARNING: This will delete ALL data from your database!');
    console.log('⚠️  This action cannot be undone!');
    
    // In a real script, you might want to add readline for user confirmation
    // For now, proceeding with cleanup
    
    console.log('\n🧹 Starting database cleanup...');
    let totalDeleted = 0;

    // Clean each collection
    for (const collectionName of collections) {
      try {
        const collection = db.collection(collectionName);
        const beforeCount = await collection.countDocuments();
        
        if (beforeCount > 0) {
          const result = await collection.deleteMany({});
          console.log(`  ✅ ${collectionName}: Deleted ${result.deletedCount} documents`);
          totalDeleted += result.deletedCount;
        } else {
          console.log(`  ⏭️  ${collectionName}: Already empty`);
        }
      } catch (error) {
        console.error(`  ❌ ${collectionName}: Error -`, error.message);
      }
    }

    console.log(`\n🎉 Cleanup completed!`);
    console.log(`📊 Total documents deleted: ${totalDeleted}`);
    console.log(`🗑️  Your database is now clean and ready for fresh data!`);

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await client.close();
    console.log('🔐 Database connection closed.');
  }
}

// Run the cleanup
cleanDatabase();
