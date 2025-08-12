import { NextRequest, NextResponse } from 'next/server';
// import { verifyEmailConnection, sendStudentWelcomeEmail } from '@/lib/mail';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing email connection...');
    
    // Check environment variables
    const emailConfig = {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      hasPassword: !!process.env.SMTP_PASS,
      from: process.env.SMTP_FROM
    };
    
    console.log('Email configuration:', emailConfig);
    
    // Verify connection
    // const isConnected = await verifyEmailConnection();
    const isConnected = false; // Temporarily disabled
    
    return NextResponse.json({
      success: true,
      connected: isConnected,
      config: emailConfig,
      message: isConnected ? 'Email service is configured and connected' : 'Email service connection failed'
    });
    
  } catch (error: any) {
    console.error('Email test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Failed to test email connection'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { testEmail } = await request.json();
    
    if (!testEmail) {
      return NextResponse.json({
        success: false,
        error: 'Test email address is required'
      }, { status: 400 });
    }
    
    console.log('Sending test email to:', testEmail);
    
    // await sendStudentWelcomeEmail(
    //   testEmail,
    //   'Test Student',
    //   'TEST/2025/001',
    //   'TestPassword123'
    // );
    
    return NextResponse.json({
      success: true,
      message: 'Test email functionality temporarily disabled'
    });
    
  } catch (error: any) {
    console.error('Test email send error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Failed to send test email'
    }, { status: 500 });
  }
}
