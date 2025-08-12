import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, studentName, studentId, password } = await request.json();
    
    if (!email || !studentName || !studentId || !password) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: email, studentName, studentId, password'
      }, { status: 400 });
    }

    // For now, we'll simulate email sending and log the details
    // This will help you verify the email functionality is working
    const emailContent = {
      to: email,
      subject: 'Welcome to Pacey School - Your Login Credentials',
      studentName,
      studentId,
      password,
      timestamp: new Date().toISOString()
    };

    // Log the email that would be sent
    console.log('📧 STUDENT WELCOME EMAIL (Simulated):');
    console.log('==========================================');
    console.log(`To: ${email}`);
    console.log(`Student: ${studentName}`);
    console.log(`Student ID: ${studentId}`);
    console.log(`Password: ${password}`);
    console.log(`Time: ${emailContent.timestamp}`);
    console.log('==========================================');

    // Store email details (in a real app, you'd save to database)
    const emailRecord = {
      id: `email_${Date.now()}`,
      type: 'student_welcome',
      recipient: email,
      studentName,
      studentId,
      status: 'simulated',
      createdAt: emailContent.timestamp,
      content: `Welcome to Pacey School! Your login credentials are - Student ID: ${studentId}, Password: ${password}`
    };

    return NextResponse.json({
      success: true,
      message: 'Student welcome email simulated successfully!',
      emailRecord,
      note: 'Email was simulated - check server logs for details. Configure Gmail App Password to send real emails.'
    });

  } catch (error: any) {
    console.error('Failed to process student email:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Failed to process student email'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Student Email Service',
    usage: 'POST with { email, studentName, studentId, password }',
    status: 'Email simulation mode - configure Gmail App Password for real emails'
  });
}
