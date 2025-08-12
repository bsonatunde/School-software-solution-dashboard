import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDatabase();
    
    // Get all users with their login credentials
    const users = await db.collection('users').find({}, {
      projection: { password: 0 } // Don't show hashed passwords
    }).toArray();
    
    // Get recent students
    const students = await db.collection('students').find({}, {
      projection: { password: 0 },
      sort: { createdAt: -1 },
      limit: 5
    }).toArray();
    
    return NextResponse.json({
      success: true,
      message: 'User accounts and recent students',
      users: users.map(user => ({
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        studentId: user.studentId,
        isActive: user.isActive,
        createdAt: user.createdAt
      })),
      recentStudents: students.map(student => ({
        studentId: student.studentId,
        name: `${student.firstName} ${student.lastName}`,
        email: student.email,
        class: student.class,
        createdAt: student.createdAt
      })),
      loginInstructions: 'Use the email and password from student creation to login'
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Failed to get user accounts',
      details: error.message
    }, { status: 500 });
  }
}
