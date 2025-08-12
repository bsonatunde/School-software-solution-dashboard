import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function POST() {
  try {
    const database = await getDatabase();
    
    // Clean all collections that might have sample data
    const collectionsToClean = [
      'staff',
      'staffs', 
      'leaves',
      'payrolls',
      'students',
      'teachers',
      'classes',
      'subjects',
      'attendances',
      'fees',
      'grades',
      'messages',
      'users',
      'parents',
      'academicyears'
    ];
    
    const results: any = {};
    let totalDeleted = 0;
    
    // Clean each collection
    for (const collectionName of collectionsToClean) {
      const collection = database.collection(collectionName);
      
      const beforeCount = await collection.countDocuments();
      const result = await collection.deleteMany({});
      const afterCount = await collection.countDocuments();
      
      results[collectionName] = {
        beforeCount,
        afterCount,
        deletedCount: result.deletedCount
      };
      
      totalDeleted += result.deletedCount;
    }
    
    return NextResponse.json({
      success: true,
      message: `Completely cleaned database - removed ${totalDeleted} total records`,
      collections: results,
      totalDeleted
    });
    
  } catch (error) {
    console.error('Complete cleanup error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
