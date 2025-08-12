import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// POST /api/assignments/submit - Submit assignment
export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase();
    const body = await request.json();
    
    const {
      assignmentId,
      studentId,
      studentName,
      content,
      attachments
    } = body;

    // Validation
    if (!assignmentId || !studentId || !content) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: assignmentId, studentId, content'
      }, { status: 400 });
    }

    // Check if assignment exists
    const assignment = await db.collection('assignments').findOne({ 
      _id: new ObjectId(assignmentId) 
    });
    if (!assignment) {
      return NextResponse.json({
        success: false,
        error: 'Assignment not found'
      }, { status: 404 });
    }

    // Check if already submitted
    const existingSubmission = await db.collection('assignment_submissions').findOne({
      assignmentId,
      studentId
    });

    const submissionData: any = {
      assignmentId,
      studentId,
      studentName: studentName || 'Unknown Student',
      content,
      attachments: attachments || [],
      status: 'submitted',
      submittedAt: new Date(),
      updatedAt: new Date()
    };

    if (existingSubmission) {
      // Update existing submission
      await db.collection('assignment_submissions').updateOne(
        { _id: existingSubmission._id },
        { $set: submissionData }
      );
      
      return NextResponse.json({
        success: true,
        message: 'Assignment updated successfully',
        data: { ...submissionData, _id: existingSubmission._id }
      });
    } else {
      // Create new submission
      submissionData.createdAt = new Date();
      const result = await db.collection('assignment_submissions').insertOne(submissionData);
      
      return NextResponse.json({
        success: true,
        message: 'Assignment submitted successfully',
        data: { ...submissionData, _id: result.insertedId }
      });
    }

  } catch (error: any) {
    console.error('Submit assignment error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to submit assignment',
      details: error.message
    }, { status: 500 });
  }
}
