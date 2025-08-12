import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase();
    
    // Get the confirmation token from request body
    const body = await request.json();
    const { confirmToken, collections } = body;
    
    // Safety check - require confirmation token
    if (confirmToken !== 'CONFIRM_DELETE_ALL_DATA') {
      return NextResponse.json({
        success: false,
        error: 'Invalid confirmation token. This operation requires explicit confirmation.',
        requiredToken: 'CONFIRM_DELETE_ALL_DATA'
      }, { status: 400 });
    }

    const results: any = {};
    const collectionsToClean = collections || [
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

    // Clean each collection
    for (const collectionName of collectionsToClean) {
      try {
        const collection = db.collection(collectionName);
        
        // Get count before deletion
        const beforeCount = await collection.countDocuments();
        
        // Delete all documents in collection
        const deleteResult = await collection.deleteMany({});
        
        results[collectionName] = {
          beforeCount,
          deletedCount: deleteResult.deletedCount,
          success: true
        };
        
        console.log(`✅ Cleaned ${collectionName}: ${deleteResult.deletedCount} documents deleted`);
      } catch (error) {
        console.error(`❌ Error cleaning ${collectionName}:`, error);
        results[collectionName] = {
          beforeCount: 0,
          deletedCount: 0,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }

    // Calculate totals
    const totalBefore = Object.values(results).reduce((sum: number, result: any) => sum + (result.beforeCount || 0), 0);
    const totalDeleted = Object.values(results).reduce((sum: number, result: any) => sum + (result.deletedCount || 0), 0);
    const successfulCollections = Object.entries(results).filter(([_, result]: [string, any]) => result.success).length;

    return NextResponse.json({
      success: true,
      message: `Database cleanup completed successfully!`,
      summary: {
        totalCollections: collectionsToClean.length,
        successfulCollections,
        totalDocumentsBefore: totalBefore,
        totalDocumentsDeleted: totalDeleted,
        timestamp: new Date().toISOString()
      },
      details: results
    });

  } catch (error) {
    console.error('❌ Database cleanup error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to clean database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET endpoint to check current database status
export async function GET() {
  try {
    const db = await getDatabase();
    
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

    const status: any = {};
    let totalDocuments = 0;

    for (const collectionName of collections) {
      try {
        const collection = db.collection(collectionName);
        const count = await collection.countDocuments();
        status[collectionName] = count;
        totalDocuments += count;
      } catch (error) {
        status[collectionName] = 'Error';
      }
    }

    return NextResponse.json({
      success: true,
      totalDocuments,
      collections: status,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to check database status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
