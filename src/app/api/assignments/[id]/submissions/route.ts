import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/assignments/[id]/submissions - Get submissions for a specific assignment
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDatabase();
    const { id: assignmentId } = await params;

    // Validate assignment exists
    const assignment = await db.collection('assignments').findOne({
      _id: new ObjectId(assignmentId)
    });

    if (!assignment) {
      return NextResponse.json({
        success: false,
        error: 'Assignment not found'
      }, { status: 404 });
    }

    // Get all submissions for this assignment
    const submissions = await db.collection('assignment_submissions')
      .find({ assignmentId: assignmentId })
      .sort({ submittedAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: submissions,
      assignment: {
        id: assignment._id,
        title: assignment.title,
        subject: assignment.subject,
        class: assignment.class
      },
      stats: {
        totalSubmissions: submissions.length,
        submitted: submissions.filter(s => s.status === 'submitted').length,
        graded: submissions.filter(s => s.status === 'graded').length,
        late: submissions.filter(s => s.status === 'late').length
      }
    });

  } catch (error: any) {
    console.error('Failed to fetch assignment submissions:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch submissions'
    }, { status: 500 });
  }
}
