import { NextRequest, NextResponse } from 'next/server';
import { StudentDB, ClassDB, initializeDatabase } from '../../../lib/database-new';

// Initialize database on first request
let dbInitialized = false;

async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initializeDatabase();
    dbInitialized = true;
  }
}

// GET /api/students - Get students
export async function GET(request: NextRequest) {
  try {
    await ensureDbInitialized();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const classId = searchParams.get('classId') || '';
    const status = searchParams.get('status') || '';

    const result = await StudentDB.findAll({
      page,
      limit,
      search,
      classId,
      status
    });

    return NextResponse.json({
      success: true,
      data: result.students,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

// POST /api/students - Create student
export async function POST(request: NextRequest) {
  try {
    await ensureDbInitialized();
    
    const body = await request.json();
    const {
      admissionNumber,
      firstName,
      lastName,
      email,
      phoneNumber,
      dateOfBirth,
      gender,
      address,
      parentGuardianName,
      parentGuardianPhone,
      parentGuardianEmail,
      classId,
      nationality,
      stateOfOrigin,
      localGovernment
    } = body;

    // Check if admission number already exists
    const existingStudent = await StudentDB.findByAdmissionNumber(admissionNumber);
    if (existingStudent) {
      return NextResponse.json(
        { success: false, error: 'Admission number already exists' },
        { status: 400 }
      );
    }

    const newStudent = await StudentDB.create({
      admissionNumber,
      firstName,
      lastName,
      email,
      phoneNumber,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      address,
      parentGuardianName,
      parentGuardianPhone,
      parentGuardianEmail,
      classId,
      enrollmentDate: new Date(),
      status: 'Active',
      nationality,
      stateOfOrigin,
      localGovernment
    });

    return NextResponse.json({
      success: true,
      data: newStudent,
      message: 'Student created successfully'
    });

  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create student' },
      { status: 500 }
    );
  }
}

// PUT /api/students - Update student
export async function PUT(request: NextRequest) {
  try {
    await ensureDbInitialized();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Student ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const updatedStudent = await StudentDB.update(id, body);
    
    if (!updatedStudent) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedStudent,
      message: 'Student updated successfully'
    });

  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update student' },
      { status: 500 }
    );
  }
}

// DELETE /api/students - Delete student
export async function DELETE(request: NextRequest) {
  try {
    await ensureDbInitialized();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Student ID is required' },
        { status: 400 }
      );
    }

    const deleted = await StudentDB.delete(id);
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Student deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete student' },
      { status: 500 }
    );
  }
}
