import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
// import { sendStudentWelcomeEmail } from '@/lib/mail';

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
  let body = null;
  try {
    const db = await getDatabase();
    body = await request.json();

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

    // Generate admission number - make it unique
    const studentCount = await db.collection('students').countDocuments();
    const admissionNumber = `ADM/${currentYear}/${String(studentCount + 1).padStart(4, '0')}`;

    // Check if student ID already exists
    const existingStudent = await db.collection('students').findOne({ studentId });
    if (existingStudent) {
      return NextResponse.json(
        { success: false, error: 'Student ID already exists' },
        { status: 409 }
      );
    }

    // Check if student with email already exists
    const existingStudentByEmail = await db.collection('students').findOne({ 
      email: body.email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@student.paceyschool.com` 
    });
    if (existingStudentByEmail) {
      return NextResponse.json(
        { success: false, error: 'Student with this email already exists' },
        { status: 409 }
      );
    }

    // Generate a random password
    function generatePassword(length = 8) {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
      let pwd = '';
      for (let i = 0; i < length; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return pwd;
    }

    const plainPassword = generatePassword(10);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Create the student record
    const newStudent = {
      studentId,
      admissionNumber,
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

    // Check if a user with this email already exists
    const existingUser = await db.collection('users').findOne({ email: newStudent.email });
    let userCreated = false;
    
    if (!existingUser) {
      // Create a user account for the student only if one doesn't exist
      await db.collection('users').insertOne({
        email: newStudent.email,
        password: hashedPassword,
        role: 'Student',
        firstName: newStudent.firstName,
        lastName: newStudent.lastName,
        profileId: result.insertedId.toString(),
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      userCreated = true;
    } else {
      console.log(`User with email ${newStudent.email} already exists, skipping user creation`);
    }

    // Send welcome email with credentials only if a new user was created
    if (userCreated) {
      try {
        // For now, simulate email sending until Gmail App Password is configured
        console.log('📧 SENDING STUDENT WELCOME EMAIL:');
        console.log('==========================================');
        console.log(`To: ${newStudent.email}`);
        console.log(`Student: ${newStudent.firstName} ${newStudent.lastName}`);
        console.log(`Student ID: ${newStudent.studentId}`);
        console.log(`Password: ${plainPassword}`);
        console.log(`Time: ${new Date().toISOString()}`);
        console.log('==========================================');
        
        // Try to send real email, but don't fail if it doesn't work
        try {
          // await sendStudentWelcomeEmail(
          //   newStudent.email,
          //   `${newStudent.firstName} ${newStudent.lastName}`,
          //   newStudent.studentId,
          //   plainPassword
          // );
          console.log('✅ Email sending temporarily disabled');
        } catch (realMailErr) {
          console.log('⚠️ Real email failed, but credentials are logged above');
          console.error('Real email error:', realMailErr instanceof Error ? realMailErr.message : realMailErr);
        }
      } catch (mailErr) {
        console.error('Failed to process welcome email:', mailErr);
      }
    } else {
      console.log('Skipping welcome email as user account already exists');
    }

    return NextResponse.json({
      success: true,
      data: { ...newStudent, _id: result.insertedId },
      message: userCreated 
        ? 'Student created successfully and credentials sent.'
        : 'Student created successfully. User account already existed.'
    });
  } catch (error: any) {
    // Improved error reporting for debugging
    let errorMessage = 'Failed to create student';
    let stack = '';
    
    if (error?.message) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else {
      // Fallback for any unexpected error format
      errorMessage = 'An unknown error occurred during student creation';
    }
    
    if (error?.stack) {
      stack = error.stack;
    }
    
    // Log the error with more context
    console.error('Error creating student:', {
      message: errorMessage,
      stack: stack,
      body: body,
      timestamp: new Date().toISOString()
    });
    
    // Only include stack and request body in development
    const isDev = process.env.NODE_ENV !== 'production';
    const errorResponse: any = { 
      success: false, 
      error: errorMessage || 'Unknown error occurred',
      timestamp: new Date().toISOString()
    };
    
    if (isDev) {
      errorResponse.stack = stack;
      errorResponse.requestBody = body;
    }
    
    return NextResponse.json(
      errorResponse,
      { status: 500 }
    );
  }
}
