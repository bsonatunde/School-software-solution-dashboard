import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

// GET /api/students - Get all students with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const classId = searchParams.get('classId') || '';
    const status = searchParams.get('status') || '';

    // Build query filter
    let filter: any = {};
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (classId) {
      filter.classId = classId;
    }
    
    if (status) {
      filter.status = status;
    }

    // Get total count for pagination
    const total = await db.collection('students').countDocuments(filter);
    
    // Get students with pagination
    const students = await db.collection('students')
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: students || [],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
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

// POST /api/students - Create a new student
export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase();
    const body = await request.json();

    // Validate required fields
    const { firstName, lastName, dateOfBirth, gender, parentName, parentPhone } = body;
    
    if (!firstName || !lastName || !dateOfBirth || !gender || !parentName || !parentPhone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate student ID if not provided
    const currentYear = new Date().getFullYear();
    let studentId = body.studentId;
    
    if (!studentId) {
      const studentCount = await db.collection('students').countDocuments();
      studentId = `PSS/${currentYear}/${String(studentCount + 1).padStart(3, '0')}`;
    }

    // Check if student ID already exists
    const existingStudent = await db.collection('students').findOne({ studentId });
    if (existingStudent) {
      return NextResponse.json(
        { success: false, error: 'Student ID already exists' },
        { status: 409 }
      );
    }

    // Create the student record
    const newStudent = {
      studentId,
      firstName,
      lastName,
      email: body.email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@student.paceyschool.com`,
      phoneNumber: body.phoneNumber || '',
      dateOfBirth,
      gender,
      address: body.address || '',
      classId: body.classId || null,
      className: body.className || '',
      parentName,
      parentPhone,
      parentEmail: body.parentEmail || '',
      dateOfAdmission: body.dateOfAdmission || new Date().toISOString().split('T')[0],
      status: body.status || 'Active',
      nationality: body.nationality || 'Nigerian',
      stateOfOrigin: body.stateOfOrigin || '',
      religion: body.religion || '',
      bloodGroup: body.bloodGroup || '',
      medicalConditions: body.medicalConditions || 'None',
      previousSchool: body.previousSchool || '',
      guardianName: body.guardianName || '',
      guardianPhone: body.guardianPhone || '',
      guardianRelationship: body.guardianRelationship || '',
      emergencyContact: {
        name: body.emergencyContactName || parentName,
        phone: body.emergencyContactPhone || parentPhone,
        relationship: body.emergencyContactRelationship || 'Parent'
      },
      academicInfo: {
        admissionYear: currentYear,
        currentLevel: body.currentLevel || 'JSS1',
        term: body.term || 'First',
        house: body.house || '',
        rollNumber: body.rollNumber || null
      },
      fees: {
        totalFees: body.totalFees || 0,
        paidAmount: body.paidAmount || 0,
        balance: (body.totalFees || 0) - (body.paidAmount || 0)
      },
      documents: body.documents || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const result = await db.collection('students').insertOne(newStudent);

    return NextResponse.json({
      success: true,
      data: { ...newStudent, _id: result.insertedId },
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
