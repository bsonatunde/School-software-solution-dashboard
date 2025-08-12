import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    console.log('🎓 Creating Real Student Account for Login Testing...');
    
    const db = await getDatabase();

    // Create a real student with known credentials
    const studentData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@student.pacey.com',
      phoneNumber: '+234801234567',
      dateOfBirth: '2010-01-15',
      gender: 'Male',
      address: '123 Test Street, Lagos, Nigeria',
      class: 'JSS 1',
      parentName: 'Jane Doe',
      parentPhone: '+234802345678',
      parentEmail: 'jane.doe@parent.pacey.com',
      nationality: 'Nigerian',
      stateOfOrigin: 'Lagos',
      localGovernment: 'Ikeja',
      bloodGroup: 'O+',
      medicalConditions: 'None',
      status: 'active'
    };

    // Generate student ID
    const studentCount = await db.collection('students').countDocuments();
    const studentId = `PSS${String(studentCount + 1001).padStart(4, '0')}`;
    
    // Use simple, known password
    const plainPassword = 'student123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    console.log('📝 Student details:');
    console.log('Name:', studentData.firstName, studentData.lastName);
    console.log('Email:', studentData.email);
    console.log('Student ID:', studentId);
    console.log('Password:', plainPassword);

    // Create student record
    const newStudent = {
      ...studentData,
      studentId,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert student
    await db.collection('students').insertOne(newStudent);
    console.log('✅ Student created in database');

    // Create user account for login (this is the key part!)
    const userAccount = {
      email: newStudent.email,
      password: hashedPassword,
      role: 'Student',
      studentId: newStudent.studentId,
      firstName: newStudent.firstName,
      lastName: newStudent.lastName,
      isActive: true,
      createdAt: new Date()
    };

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email: newStudent.email });
    if (existingUser) {
      console.log('ℹ️ User account already exists, updating...');
      await db.collection('users').updateOne(
        { email: newStudent.email },
        { $set: userAccount }
      );
    } else {
      await db.collection('users').insertOne(userAccount);
      console.log('✅ User account created for login');
    }

    console.log('==========================================');
    console.log('🎓 REAL STUDENT ACCOUNT CREATED');
    console.log('==========================================');
    console.log('You can now login with:');
    console.log('Email:', newStudent.email);
    console.log('Password:', plainPassword);
    console.log('Student ID:', newStudent.studentId);
    console.log('Role: Student');
    console.log('==========================================');

    return NextResponse.json({
      success: true,
      message: 'Real student account created successfully! You can now login. 🎉',
      loginCredentials: {
        email: newStudent.email,
        password: plainPassword,
        studentId: newStudent.studentId,
        role: 'Student'
      },
      studentData: {
        name: `${newStudent.firstName} ${newStudent.lastName}`,
        class: newStudent.class,
        parentEmail: newStudent.parentEmail
      },
      instructions: [
        '1. Go to the login page',
        '2. Select "Student" as user type',
        '3. Use the email and password provided above',
        '4. You should be able to access the student dashboard',
        '5. Check Mailtrap for the welcome email with same credentials'
      ]
    });

  } catch (error: any) {
    console.error('❌ Failed to create real student account:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create student account',
      details: error.message
    }, { status: 500 });
  }
}
