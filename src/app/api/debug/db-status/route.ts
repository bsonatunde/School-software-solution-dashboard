import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const database = await getDatabase();
    
    // Get all collection names
    const collections = await database.listCollections().toArray();
    
    const status: any = {
      databaseName: database.databaseName,
      collections: []
    };
    
    // Get document count for each collection
    for (const collectionInfo of collections) {
      const collection = database.collection(collectionInfo.name);
      const count = await collection.countDocuments();
      
      // Get a sample document to understand structure
      const sample = await collection.findOne();
      
      status.collections.push({
        name: collectionInfo.name,
        count: count,
        sampleDocument: sample ? Object.keys(sample).slice(0, 5) : null
      });
    }
    
    return NextResponse.json({
      success: true,
      data: status
    });
    
  } catch (error) {
    console.error('Database status error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
