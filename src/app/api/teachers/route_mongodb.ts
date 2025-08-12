import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

// GET /api/teachers - Get all teachers with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const subject = searchParams.get('subject') || '';
    const status = searchParams.get('status') || '';

    // Build query filter
    let filter: any = {};
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (subject) {
      filter.subjects = { $in: [subject] };
    }
    
    if (status) {
      filter.status = status;
    }

    // Get total count for pagination
    const total = await db.collection('teachers').countDocuments(filter);
    
    // Get teachers with pagination
    const teachers = await db.collection('teachers')
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: teachers || [],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching teachers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch teachers' },
      { status: 500 }
    );
  }
}

// POST /api/teachers - Create a new teacher
export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase();
    const body = await request.json();

    // Validate required fields
    const { firstName, lastName, email, specialization, subjects = [] } = body;
    
    if (!firstName || !lastName || !email || !specialization) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: firstName, lastName, email, specialization' },
        { status: 400 }
      );
    }

    // Generate employee ID if not provided
    const currentYear = new Date().getFullYear();
    let employeeId = body.employeeId;
    
    if (!employeeId) {
      const teacherCount = await db.collection('teachers').countDocuments();
      employeeId = `PSS/TCH/${String(teacherCount + 1).padStart(3, '0')}`;
    }

    // Check if employee ID already exists
    const existingTeacher = await db.collection('teachers').findOne({ employeeId });
    if (existingTeacher) {
      return NextResponse.json(
        { success: false, error: 'Employee ID already exists' },
        { status: 409 }
      );
    }

    // Check if email already exists
    const existingEmail = await db.collection('teachers').findOne({ email });
    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: 'Email already exists' },
        { status: 409 }
      );
    }

    // Create the teacher record
    const newTeacher = {
      employeeId,
      firstName,
      lastName,
      email,
      phoneNumber: body.phoneNumber || '',
      dateOfBirth: body.dateOfBirth || '',
      gender: body.gender || '',
      address: body.address || '',
      qualification: body.qualification || '',
      specialization,
      subjects: Array.isArray(subjects) ? subjects : [subjects].filter(Boolean),
      classes: body.classes || [],
      dateOfHire: body.dateOfHire || new Date().toISOString().split('T')[0],
      salary: body.salary || 0,
      status: body.status || 'Active',
      emergencyContact: body.emergencyContact || '',
      nationality: body.nationality || 'Nigerian',
      stateOfOrigin: body.stateOfOrigin || '',
      religion: body.religion || '',
      maritalStatus: body.maritalStatus || '',
      bankDetails: {
        accountName: body.accountName || `${firstName} ${lastName}`,
        accountNumber: body.accountNumber || '',
        bankName: body.bankName || '',
        bvn: body.bvn || ''
      },
      academicInfo: {
        yearsOfExperience: body.yearsOfExperience || 0,
        previousSchool: body.previousSchool || '',
        certifications: body.certifications || [],
        professionalDevelopment: body.professionalDevelopment || []
      },
      performanceMetrics: {
        rating: body.rating || 0,
        studentFeedback: body.studentFeedback || 0,
        parentFeedback: body.parentFeedback || 0,
        achievements: body.achievements || []
      },
      leaveBalance: body.leaveBalance || 21, // Standard 21 days annual leave
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const result = await db.collection('teachers').insertOne(newTeacher);

    return NextResponse.json({
      success: true,
      data: { ...newTeacher, _id: result.insertedId },
      message: 'Teacher created successfully'
    });

  } catch (error) {
    console.error('Error creating teacher:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create teacher' },
      { status: 500 }
    );
  }
}
