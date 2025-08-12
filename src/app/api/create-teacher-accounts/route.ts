import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    const db = await getDatabase();
    
    // Create teacher accounts that match the assignment creators
    const teachers = [
      {
        email: 'mr.johnson@pacey.com',
        password: await bcrypt.hash('teacher123', 10),
        role: 'teacher',
        teacherId: 'TCH001',
        firstName: 'Mr.',
        lastName: 'Johnson',
        subject: 'Mathematics',
        isActive: true,
        createdAt: new Date()
      },
      {
        email: 'mrs.adebayo@pacey.com', 
        password: await bcrypt.hash('teacher123', 10),
        role: 'teacher',
        teacherId: 'TCH002',
        firstName: 'Mrs.',
        lastName: 'Adebayo',
        subject: 'English Language',
        isActive: true,
        createdAt: new Date()
      },
      {
        email: 'dr.okafor@pacey.com',
        password: await bcrypt.hash('teacher123', 10),
        role: 'teacher',
        teacherId: 'TCH003',
        firstName: 'Dr.',
        lastName: 'Okafor', 
        subject: 'Basic Science',
        isActive: true,
        createdAt: new Date()
      },
      {
        email: 'mr.emeka@pacey.com',
        password: await bcrypt.hash('teacher123', 10),
        role: 'teacher',
        teacherId: 'TCH004',
        firstName: 'Mr.',
        lastName: 'Emeka',
        subject: 'History',
        isActive: true,
        createdAt: new Date()
      }
    ];

    // Insert teacher accounts
    const result = await db.collection('users').insertMany(teachers);
    
    console.log('Teacher accounts created:', result.insertedIds);
    
    return NextResponse.json({
      success: true,
      message: 'Teacher accounts created successfully! 👨‍🏫',
      data: {
        insertedCount: Object.keys(result.insertedIds).length,
        teachers: teachers.map((t, i) => ({
          id: result.insertedIds[i],
          email: t.email,
          teacherId: t.teacherId,
          name: `${t.firstName} ${t.lastName}`,
          subject: t.subject
        }))
      },
      instructions: [
        'Teacher accounts have been created with password: teacher123',
        'Teachers can now login and manage their assignments',
        'Visit /teacher to access teacher dashboard',
        'Login credentials:',
        '- mr.johnson@pacey.com / teacher123 (Mathematics)',
        '- mrs.adebayo@pacey.com / teacher123 (English)',
        '- dr.okafor@pacey.com / teacher123 (Science)', 
        '- mr.emeka@pacey.com / teacher123 (History)'
      ]
    });

  } catch (error: any) {
    console.error('Failed to create teacher accounts:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create teacher accounts',
      details: error.message
    }, { status: 500 });
  }
}
