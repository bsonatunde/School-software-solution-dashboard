import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('🔍 Testing database connection...');
    
    const db = await getDatabase();
    console.log('✅ Database connected successfully');
    
    // Test collections
    const collections = await db.listCollections().toArray();
    console.log('📊 Available collections:', collections.map(c => c.name));
    
    // Count students
    const studentCount = await db.collection('students').countDocuments();
    console.log('👥 Total students:', studentCount);
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      collections: collections.map(c => c.name),
      studentCount
    });

  } catch (error: any) {
    console.error('❌ Database test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      details: error.message
    }, { status: 500 });
  }
}
