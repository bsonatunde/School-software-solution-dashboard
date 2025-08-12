import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    console.log('🎓 Creating Test Student with Known Credentials...');
    
    const db = await getDatabase();

    // Known test credentials
    const email = 'test.student@pacey.com';
    const password = 'student123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create/update user account for login
    const userAccount = {
      email: email,
      password: hashedPassword,
      role: 'Student',
      studentId: 'PSS9999',
      firstName: 'Test',
      lastName: 'Student',
      isActive: true,
      createdAt: new Date()
    };

    // Upsert user account
    await db.collection('users').updateOne(
      { email: email },
      { $set: userAccount },
      { upsert: true }
    );

    console.log('✅ Test student account created/updated');
    console.log('==========================================');
    console.log('🎓 READY TO LOGIN');
    console.log('==========================================');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Role: Student');
    console.log('==========================================');

    return NextResponse.json({
      success: true,
      message: 'Test student account ready for login! 🎉',
      credentials: {
        email: email,
        password: password,
        role: 'Student',
        studentId: 'PSS9999'
      },
      instructions: [
        '1. Go to http://localhost:3000/login',
        '2. Select "Student" as user type',
        '3. Enter email: test.student@pacey.com',
        '4. Enter password: student123',
        '5. Click Login - should work now!'
      ]
    });

  } catch (error: any) {
    console.error('❌ Failed to create test student:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create test student',
      details: error.message
    }, { status: 500 });
  }
}
