import { NextRequest, NextResponse } from 'next/server';
// import { sendStudentWelcomeEmail } from '@/lib/mail';

export async function POST(request: NextRequest) {
  try {
    const { studentEmail } = await request.json();
    
    if (!studentEmail) {
      return NextResponse.json({
        success: false,
        error: 'Student email is required'
      }, { status: 400 });
    }

    console.log('📧 Testing student welcome email...');
    
    // Test data
    const testData = {
      studentName: 'John Doe',
      studentId: 'PSS0001',
      password: 'test123',
      email: studentEmail
    };

    console.log('Sending welcome email to:', testData.email);
    console.log('Student:', testData.studentName);
    console.log('Student ID:', testData.studentId);
    console.log('Password:', testData.password);

    // Send the welcome email
    // await sendStudentWelcomeEmail(
    //   testData.email,
    //   testData.studentName,
    //   testData.studentId,
    //   testData.password
    // );

    console.log('✅ Student welcome email sending temporarily disabled');

    return NextResponse.json({
      success: true,
      message: 'Student welcome email feature temporarily disabled! 🎉',
      data: testData,
      instructions: [
        'Email functionality is temporarily disabled for building',
        'The student credentials are logged above',
        'Will be re-enabled after fixing mail module issues'
      ]
    });

  } catch (error: any) {
    console.error('❌ Student welcome email failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to send student welcome email',
      details: error.message
    }, { status: 500 });
  }
}
