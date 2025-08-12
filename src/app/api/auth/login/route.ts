import { NextRequest, NextResponse } from 'next/server';
import { connectDB, User, Student } from '@/lib/models';
import bcrypt from 'bcryptjs';
import { LoginRequest, ApiResponse, User as UserType } from '../../../../types';

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    console.log('🔐 Login attempt for email:', email); // Log email for debugging (not password)

    // Validate input
    if (!email || !password) {
      console.log('❌ Login failed: Missing email or password');
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Email and password are required'
      }, { status: 400 });
    }

    // Connect to database using Mongoose
    await connectDB();
    console.log('📊 Connected to MongoDB via Mongoose, checking credentials...');

    // First, try to find user in the User model
    const user = await User.findOne({
        email: email.toLowerCase().trim(),
        isActive: true
    }).lean() as any;

    if (user && await bcrypt.compare(password, user.password)) {
      console.log('✅ Mongoose User login successful for:', email, 'with role:', user.role);
      
      // Create response user object
        const responseUser: UserType = {
        id: user._id.toString(),
        email: user.email,
        password: '', // Never send password back
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profileId: user.profileId,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt || new Date()
      };

      return NextResponse.json<ApiResponse<Omit<UserType, 'password'>>>({
        success: true,
        data: responseUser,
        message: 'Login successful'
      });
    }

    // If not found in User model, check Student model
    console.log('🔍 User not found in User model, checking Student...');
    
    const student = await Student.findOne({ 
        email: email.toLowerCase().trim(),
        status: 'Active' 
    }).lean() as any;

    if (student && student.password && await bcrypt.compare(password, student.password)) {
      console.log('✅ Student login successful for:', email, 'studentId:', student._id);
      
      const responseUser: UserType = {
        id: student._id.toString(),
        email: student.email,
        password: '', // Never send password back
        firstName: student.firstName,
        lastName: student.lastName,
        role: 'Student',
        profileId: student.admissionNumber,
        isActive: true,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt || new Date()
      };

      return NextResponse.json<ApiResponse<Omit<UserType, 'password'>>>({
        success: true,
        data: responseUser,
        message: 'Student login successful'
      });
    }

    // If not found in students collection, check legacy demo accounts
    console.log('🔍 Student not found, checking demo accounts...');
    
    const validCredentials: Array<{
      email: string; 
      password: string; 
      role: 'Admin' | 'Teacher' | 'Parent' | 'Student';
      studentId?: string;
    }> = [
      { email: 'admin@school.com', password: 'admin123', role: 'Admin' },
      { email: 'demo@paceyschool.com', password: 'demo123', role: 'Admin' },
      { email: 'teacher@paceyschool.com', password: 'teacher123', role: 'Teacher' },
      { email: 'student@paceyschool.com', password: 'student123', role: 'Student', studentId: 'ADM/2025/0001' },
      { email: 'test.student@pacey.com', password: 'student123', role: 'Student', studentId: 'ADM/2025/0001' },
      { email: 'teststudent@example.com', password: 'student123', role: 'Student', studentId: 'ADM/2025/0001' }
    ];

    const validAccount = validCredentials.find(cred => 
      cred.email === email && cred.password === password
    );

    if (validAccount) {
      console.log('✅ Demo account login successful for:', email, 'with role:', validAccount.role);
      const mockUser: UserType = {
        id: `${validAccount.role.toLowerCase()}-1`,
        email: validAccount.email,
        password: '', // Never send password
        firstName: validAccount.role === 'Admin' ? 'School' : validAccount.role,
        lastName: validAccount.role === 'Admin' ? 'Administrator' : 'User',
        role: validAccount.role,
        profileId: validAccount.studentId || `${validAccount.role.toLowerCase()}-profile-1`,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return NextResponse.json<ApiResponse<Omit<UserType, 'password'>>>({
        success: true,
        data: mockUser,
        message: 'Login successful (demo account)'
      });
    }

    console.log('❌ Login failed: Invalid credentials for email:', email);
    console.log('💡 Valid demo emails are:', validCredentials.map(c => c.email).join(', '));
    
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Invalid credentials. Please check your email and password.'
    }, { status: 401 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
