import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { email, password, testEmailTo } = await request.json();
    
    if (!email || !password || !testEmailTo) {
      return NextResponse.json({
        success: false,
        error: 'Email, password, and test email address are required'
      }, { status: 400 });
    }

    console.log(`🔄 Testing Outlook email: ${email}`);

    // Test Outlook configuration
    const transporter = nodemailer.createTransport({
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false,
      auth: {
        user: email,
        pass: password,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Test connection
    console.log('Testing Outlook connection...');
    await transporter.verify();
    console.log('✅ Outlook connection successful!');

    // Send test email
    const result = await transporter.sendMail({
      from: email,
      to: testEmailTo,
      subject: 'Pacey School - Outlook Email Test Success! 🎉',
      text: `Success! Your Pacey School system is now working with Outlook email: ${email}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0ea5e9;">🎉 Pacey School Email Working!</h2>
          <p>Congratulations! Your email system is now configured with Outlook.</p>
          <p><strong>Working Email:</strong> ${email}</p>
          <p>✅ Student welcome emails will now be sent automatically!</p>
          <p>✅ Parent notifications will work!</p>
          <p>✅ Staff communications will work!</p>
          <hr style="margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">
            Sent from Pacey School Management System
          </p>
        </div>
      `
    });

    return NextResponse.json({
      success: true,
      message: 'Outlook email test successful!',
      workingEmail: email,
      messageId: result.messageId,
      nextSteps: [
        `Update .env.local: SMTP_USER=${email}`,
        `Update .env.local: SMTP_PASS=${password}`,
        'Change SMTP_HOST=smtp-mail.outlook.com',
        'Change SMTP_PORT=587',
        'Set SMTP_SECURE=false'
      ]
    });

  } catch (error: any) {
    console.error('Outlook email test failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Outlook email test failed',
      suggestion: 'Check email address and password, ensure 2FA is not required'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Outlook Email Test Service',
    usage: 'POST with { email, password, testEmailTo }',
    example: {
      email: 'your-email@outlook.com',
      password: 'your-password',
      testEmailTo: 'test@example.com'
    },
    instructions: [
      '1. Create an Outlook.com account if you don\'t have one',
      '2. Use your regular password (no App Password needed)',
      '3. Test with this endpoint',
      '4. Update your .env.local file with working credentials'
    ]
  });
}
