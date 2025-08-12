import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDatabase();
    
    // Get the specific test user
    const testUser = await db.collection('users').findOne({ 
      email: 'test.student@pacey.com' 
    }, {
      projection: { password: 0 } // Don't show password
    });
    
    // Get all students to see what IDs exist
    const allStudents = await db.collection('students').find({}, {
      projection: { 
        studentId: 1, 
        firstName: 1, 
        lastName: 1, 
        email: 1,
        _id: 1 
      }
    }).toArray();
    
    return NextResponse.json({
      success: true,
      testUser,
      allStudents,
      debug: {
        testUserExists: !!testUser,
        testUserStudentId: testUser?.studentId,
        possibleMatches: allStudents.filter(s => 
          s.email === 'test.student@pacey.com' || 
          s.studentId === testUser?.studentId
        )
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Failed to debug user data',
      details: error.message
    }, { status: 500 });
  }
}
