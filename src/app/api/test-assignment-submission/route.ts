import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST() {
  try {
    const db = await getDatabase();
    
    // Get the first assignment for our test student
    const assignments = await db.collection('assignments').find({ 
      class: { $in: ['JSS 1', 'JSS 2', 'JSS 3'] } 
    }).limit(1).toArray();
    
    if (assignments.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No assignments found for testing'
      }, { status: 404 });
    }
    
    const assignment = assignments[0];
    
    // Create a test submission
    const submissionData = {
      assignmentId: assignment._id.toString(),
      studentId: 'PSS9999',
      studentName: 'Test Student',
      content: 'This is a test submission created automatically. The student has completed the assignment as requested and followed all instructions provided by the teacher.',
      attachments: [],
      status: 'submitted',
      submittedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Check if already submitted
    const existingSubmission = await db.collection('assignment_submissions').findOne({
      assignmentId: assignment._id.toString(),
      studentId: 'PSS9999'
    });
    
    if (existingSubmission) {
      return NextResponse.json({
        success: true,
        message: 'Test submission already exists',
        data: {
          assignmentTitle: assignment.title,
          submissionId: existingSubmission._id,
          submittedAt: existingSubmission.submittedAt
        }
      });
    }
    
    // Create new submission
    const result = await db.collection('assignment_submissions').insertOne(submissionData);
    
    return NextResponse.json({
      success: true,
      message: 'Test assignment submission created successfully! 🎉',
      data: {
        assignmentTitle: assignment.title,
        submissionId: result.insertedId,
        studentId: 'PSS9999',
        content: submissionData.content
      },
      instructions: [
        'Test submission has been created',
        'Visit /student/assignments to see the submission status',
        'The assignment should now show as "Submitted"'
      ]
    });

  } catch (error: any) {
    console.error('Failed to create test submission:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create test submission',
      details: error.message
    }, { status: 500 });
  }
}
