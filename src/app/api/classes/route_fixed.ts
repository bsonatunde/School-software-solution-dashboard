import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

// GET /api/classes - Get all classes
export async function GET() {
  try {
    const db = await getDatabase();
    const classes = await db.collection('classes').find({}).toArray();

    return NextResponse.json({
      success: true,
      data: classes || [],
      count: classes?.length || 0
    });

  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch classes' },
      { status: 500 }
    );
  }
}

// POST /api/classes - Create a new class
export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase();
    const body = await request.json();

    // Validate required fields
    const { className, level, section, capacity, academicYear, term } = body;
    
    if (!className || !level) {
      return NextResponse.json(
        { success: false, error: 'Class name and level are required' },
        { status: 400 }
      );
    }

    // Check if class already exists
    const existingClass = await db.collection('classes').findOne({ 
      className: className,
      level: level,
      section: section || null,
      academicYear: academicYear || new Date().getFullYear().toString()
    });

    if (existingClass) {
      return NextResponse.json(
        { success: false, error: 'Class already exists' },
        { status: 409 }
      );
    }

    // Create the class
    const newClass = {
      className,
      level,
      section: section || null,
      capacity: capacity || 40,
      currentEnrollment: 0,
      academicYear: academicYear || new Date().getFullYear().toString(),
      term: term || 'First',
      classTeacher: body.classTeacher || null,
      subjects: body.subjects || [],
      schedule: body.schedule || {},
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const result = await db.collection('classes').insertOne(newClass);

    return NextResponse.json({
      success: true,
      data: { ...newClass, _id: result.insertedId },
      message: 'Class created successfully'
    });

  } catch (error) {
    console.error('Error creating class:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create class' },
      { status: 500 }
    );
  }
}
