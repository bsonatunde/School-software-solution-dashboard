import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { LoginRequest, ApiResponse, User } from '../../../../types';

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

    // Connect to database
    const db = await getDatabase();
    console.log('📊 Connected to database, checking credentials...');

    // First, try to find user in the users collection
    const user = await db.collection('users').findOne({ 
      email: email.toLowerCase().trim(),
      isActive: true 
    });

    if (user && await bcrypt.compare(password, user.password)) {
      console.log('✅ Database login successful for:', email, 'with role:', user.role);
      
      // Create response user object
      const responseUser: User = {
        id: user._id.toString(),
        email: user.email,
        password: '', // Never send password back
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profileId: user.studentId || user.teacherId || user.staffId || `${user.role.toLowerCase()}-profile`,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt || new Date()
      };

      return NextResponse.json<ApiResponse<Omit<User, 'password'>>>({
        success: true,
        data: responseUser,
        message: 'Login successful'
      });
    }

    // If not found in users collection, check students collection
    console.log('🔍 User not found in users collection, checking students...');
    
    const student = await db.collection('students').findOne({ 
      email: email.toLowerCase().trim(),
      status: 'active' 
    });

    if (student && student.password && await bcrypt.compare(password, student.password)) {
      console.log('✅ Student login successful for:', email, 'studentId:', student.studentId);
      
      const responseUser: User = {
        id: student._id.toString(),
        email: student.email,
        password: '', // Never send password back
        firstName: student.firstName,
        lastName: student.lastName,
        role: 'Student',
        profileId: student.studentId,
        isActive: true,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt || new Date()
      };

      return NextResponse.json<ApiResponse<Omit<User, 'password'>>>({
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
      const mockUser: User = {
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

      return NextResponse.json<ApiResponse<Omit<User, 'password'>>>({
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
