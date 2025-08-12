import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// PUT /api/assignments/submissions/[id]/grade - Grade a submission
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDatabase();
    const { id: submissionId } = await params;
    const body = await request.json();
    
    const {
      score,
      feedback,
      teacherId,
      teacherName
    } = body;

    // Validation
    if (score === undefined || score === null) {
      return NextResponse.json({
        success: false,
        error: 'Score is required'
      }, { status: 400 });
    }

    if (score < 0) {
      return NextResponse.json({
        success: false,
        error: 'Score cannot be negative'
      }, { status: 400 });
    }

    // Find the submission
    const submission = await db.collection('assignment_submissions').findOne({
      _id: new ObjectId(submissionId)
    });

    if (!submission) {
      return NextResponse.json({
        success: false,
        error: 'Submission not found'
      }, { status: 404 });
    }

    // Get assignment details
    const assignment = await db.collection('assignments').findOne({
      _id: new ObjectId(submission.assignmentId)
    });

    if (!assignment) {
      return NextResponse.json({
        success: false,
        error: 'Assignment not found'
      }, { status: 404 });
    }

    // Validate score doesn't exceed max score
    if (score > assignment.maxScore) {
      return NextResponse.json({
        success: false,
        error: `Score cannot exceed maximum score of ${assignment.maxScore}`
      }, { status: 400 });
    }

    // Update submission with grade
    const gradeData = {
      score: Number(score),
      feedback: feedback || '',
      status: 'graded',
      gradedAt: new Date(),
      gradedBy: teacherId || 'unknown',
      graderName: teacherName || 'Teacher',
      updatedAt: new Date()
    };

    await db.collection('assignment_submissions').updateOne(
      { _id: new ObjectId(submissionId) },
      { $set: gradeData }
    );

    // Create a notification/message for the student
    const notificationData = {
      studentId: submission.studentId,
      type: 'assignment_graded',
      title: `Assignment Graded: ${assignment.title}`,
      message: `Your assignment "${assignment.title}" has been graded. Score: ${score}/${assignment.maxScore}${feedback ? '. Feedback: ' + feedback : ''}`,
      subject: assignment.subject,
      assignmentId: submission.assignmentId,
      submissionId: submissionId,
      score: Number(score),
      maxScore: assignment.maxScore,
      feedback: feedback || '',
      teacherName: teacherName || 'Teacher',
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('notifications').insertOne(notificationData);

    return NextResponse.json({
      success: true,
      message: 'Assignment graded successfully',
      data: {
        submissionId,
        score: Number(score),
        maxScore: assignment.maxScore,
        feedback: feedback || '',
        status: 'graded',
        gradedAt: gradeData.gradedAt,
        assignmentTitle: assignment.title,
        studentId: submission.studentId
      }
    });

  } catch (error: any) {
    console.error('Grade submission error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to grade submission',
      details: error.message
    }, { status: 500 });
  }
}
