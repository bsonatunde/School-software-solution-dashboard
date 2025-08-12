import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/assignments - Get assignments for a student or teacher
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const studentId = searchParams.get('studentId');
    const teacherId = searchParams.get('teacherId');
    const classId = searchParams.get('classId');
    const subject = searchParams.get('subject');
    const status = searchParams.get('status'); // pending, submitted, graded
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build query filter
    let filter: any = {};
    
    if (studentId) {
      // For students, get assignments for their class
      const student = await db.collection('students').findOne({ studentId });
      if (!student) {
        return NextResponse.json({
          success: false,
          error: 'Student not found'
        }, { status: 404 });
      }
      
      // If student has a class, filter by class, otherwise get all assignments
      if (student.class) {
        filter.class = student.class;
      } else {
        // For students without a specific class, show assignments for common classes
        filter.class = { $in: ['JSS 1', 'JSS 2', 'JSS 3', 'SSS 1', 'SSS 2', 'SSS 3'] };
      }
    }
    
    if (teacherId) {
      filter.teacherId = teacherId;
    }
    
    if (classId) {
      filter.class = classId;
    }
    
    if (subject) {
      filter.subject = { $regex: subject, $options: 'i' };
    }
    
    if (status) {
      filter.status = status;
    }

    // Get total count for pagination
    const total = await db.collection('assignments').countDocuments(filter);
    
    // Get assignments with pagination
    const assignments = await db.collection('assignments')
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ dueDate: 1, createdAt: -1 })
      .toArray();

    // If getting assignments for a specific student, add submission status
    if (studentId) {
      for (let assignment of assignments) {
        const submission = await db.collection('assignment_submissions').findOne({
          assignmentId: assignment._id.toString(),
          studentId: studentId
        });
        
        assignment.submission = submission || null;
        assignment.isSubmitted = !!submission;
        assignment.submissionStatus = submission?.status || 'pending';
      }
    }

    return NextResponse.json({
      success: true,
      data: assignments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error('Get assignments error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch assignments',
      details: error.message
    }, { status: 500 });
  }
}

// POST /api/assignments - Create new assignment (for teachers)
export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase();
    const body = await request.json();
    
    const {
      title,
      description,
      subject,
      class: className,
      teacherId,
      teacherName,
      dueDate,
      instructions,
      maxScore,
      attachments
    } = body;

    // Validation
    if (!title || !description || !subject || !className || !teacherId || !dueDate) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: title, description, subject, class, teacherId, dueDate'
      }, { status: 400 });
    }

    // Create assignment
    const newAssignment = {
      title,
      description,
      subject,
      class: className,
      teacherId,
      teacherName: teacherName || 'Unknown Teacher',
      dueDate: new Date(dueDate),
      instructions: instructions || '',
      maxScore: maxScore || 100,
      attachments: attachments || [],
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('assignments').insertOne(newAssignment);

    return NextResponse.json({
      success: true,
      data: { ...newAssignment, _id: result.insertedId },
      message: 'Assignment created successfully'
    });

  } catch (error: any) {
    console.error('Create assignment error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create assignment',
      details: error.message
    }, { status: 500 });
  }
}
