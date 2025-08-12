import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function POST() {
  try {
    const db = await getDatabase();
    
    // Get the test user
    const testUser = await db.collection('users').findOne({ 
      email: 'test.student@pacey.com' 
    });
    
    if (!testUser) {
      return NextResponse.json({
        success: false,
        error: 'Test user not found'
      }, { status: 404 });
    }
    
    // Create corresponding student record
    const studentRecord = {
      studentId: testUser.studentId,
      firstName: testUser.firstName,
      lastName: testUser.lastName,
      email: testUser.email,
      phoneNumber: '+234801234567',
      dateOfBirth: '2010-01-15',
      gender: 'Male',
      address: '123 Test Street, Lagos, Nigeria',
      class: 'JSS 1',
      parentName: 'Test Parent',
      parentPhone: '+234802345678',
      parentEmail: 'test.parent@pacey.com',
      nationality: 'Nigerian',
      stateOfOrigin: 'Lagos',
      localGovernment: 'Ikeja',
      bloodGroup: 'O+',
      medicalConditions: 'None',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Check if student record already exists
    const existingStudent = await db.collection('students').findOne({
      $or: [
        { studentId: testUser.studentId },
        { email: testUser.email }
      ]
    });
    
    if (existingStudent) {
      console.log('Student record already exists, updating...');
      await db.collection('students').updateOne(
        { _id: existingStudent._id },
        { $set: studentRecord }
      );
    } else {
      console.log('Creating new student record...');
      await db.collection('students').insertOne(studentRecord);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Student record synchronized successfully! 🎉',
      data: {
        studentId: testUser.studentId,
        email: testUser.email,
        name: `${testUser.firstName} ${testUser.lastName}`
      },
      instructions: [
        'Student record now exists in both users and students collections',
        'Login should now work without "Student not found" error',
        'Try logging in again with test.student@pacey.com / student123'
      ]
    });

  } catch (error: any) {
    console.error('Failed to sync student record:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to sync student record',
      details: error.message
    }, { status: 500 });
  }
}
