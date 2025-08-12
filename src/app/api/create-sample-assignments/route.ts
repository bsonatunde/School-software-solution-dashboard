import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function POST() {
  try {
    const db = await getDatabase();
    
    // Sample assignments for testing
    const sampleAssignments = [
      {
        title: 'Math Assignment - Algebra Basics',
        description: 'Solve the algebraic equations provided in Chapter 5 of your textbook.',
        subject: 'Mathematics',
        class: 'JSS 1',
        teacherId: 'TCH001',
        teacherName: 'Mr. Johnson',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        instructions: 'Show all working steps. Use proper mathematical notation. Submit handwritten work if possible.',
        maxScore: 100,
        attachments: [],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'English Essay - My School Experience',
        description: 'Write a 500-word essay about your experience in the school so far.',
        subject: 'English Language',
        class: 'JSS 1',
        teacherId: 'TCH002',
        teacherName: 'Mrs. Adebayo',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        instructions: 'Use proper grammar and punctuation. Include introduction, body, and conclusion paragraphs.',
        maxScore: 50,
        attachments: [],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Science Lab Report - Simple Machines',
        description: 'Document your observations from the simple machines experiment conducted in class.',
        subject: 'Basic Science',
        class: 'JSS 1',
        teacherId: 'TCH003',
        teacherName: 'Dr. Okafor',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        instructions: 'Include diagrams, observations, and conclusions. Follow the lab report format provided.',
        maxScore: 75,
        attachments: [],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'History Project - Nigerian Independence',
        description: 'Research and present the key events leading to Nigerian independence in 1960.',
        subject: 'History',
        class: 'JSS 1',
        teacherId: 'TCH004',
        teacherName: 'Mr. Emeka',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        instructions: 'Include timeline, key figures, and significance. Minimum 3 reliable sources required.',
        maxScore: 80,
        attachments: [],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Insert sample assignments
    const result = await db.collection('assignments').insertMany(sampleAssignments);
    
    console.log('Sample assignments created:', result.insertedIds);
    
    return NextResponse.json({
      success: true,
      message: 'Sample assignments created successfully! 🎉',
      data: {
        insertedCount: Object.keys(result.insertedIds).length,
        assignments: sampleAssignments.map((a, i) => ({
          id: result.insertedIds[i],
          title: a.title,
          subject: a.subject,
          dueDate: a.dueDate
        }))
      },
      instructions: [
        'Sample assignments have been added to the database',
        'Students can now view and submit these assignments',
        'Visit /student/assignments to see them',
        'Due dates are set for the next 3-10 days'
      ]
    });

  } catch (error: any) {
    console.error('Failed to create sample assignments:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create sample assignments',
      details: error.message
    }, { status: 500 });
  }
}
