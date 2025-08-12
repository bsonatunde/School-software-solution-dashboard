import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { testEmail } = await request.json();
    
    if (!testEmail) {
      return NextResponse.json({
        success: false,
        error: 'Test email address is required'
      }, { status: 400 });
    }

    console.log('🔧 Testing Mailtrap.io Configuration...');
    
    // Mailtrap SMTP configuration
    const mailtrapConfig = {
      host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
      port: parseInt(process.env.SMTP_PORT || '2525'),
      secure: false, // Mailtrap uses port 2525 (not secure)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    };

    console.log('Mailtrap Configuration:', {
      host: mailtrapConfig.host,
      port: mailtrapConfig.port,
      user: mailtrapConfig.auth.user ? '✓ Set' : '❌ Missing',
      pass: mailtrapConfig.auth.pass ? '✓ Set' : '❌ Missing',
    });

    if (!mailtrapConfig.auth.user || !mailtrapConfig.auth.pass) {
      return NextResponse.json({
        success: false,
        error: 'Missing Mailtrap credentials. Please update SMTP_USER and SMTP_PASS in .env.local',
        setup: 'Go to mailtrap.io → Inboxes → SMTP Settings → Node.js Nodemailer'
      }, { status: 400 });
    }

    const transporter = nodemailer.createTransport(mailtrapConfig);

    // Test connection
    console.log('Testing Mailtrap connection...');
    await transporter.verify();
    console.log('✅ Mailtrap connection successful!');

    // Send test email
    const result = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'Pacey School'}" <${process.env.SMTP_FROM_EMAIL || 'noreply@paceyschool.com'}>`,
      to: testEmail,
      subject: '🎉 Pacey School - Mailtrap Test Success!',
      text: 'Your Mailtrap configuration is working perfectly! This email was captured safely in your Mailtrap inbox.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #0ea5e9; text-align: center; margin-bottom: 30px;">
              🎉 Pacey School Management System
            </h1>
            
            <div style="background-color: #dcfce7; padding: 20px; border-radius: 8px; border-left: 4px solid #22c55e; margin-bottom: 20px;">
              <h2 style="color: #166534; margin: 0 0 10px 0;">✅ Mailtrap Test Successful!</h2>
              <p style="color: #166534; margin: 0;">Your email configuration is working perfectly.</p>
            </div>
            
            <h3 style="color: #1e293b;">📧 What This Means:</h3>
            <ul style="color: #475569; line-height: 1.6;">
              <li><strong>Safe Testing:</strong> This email was captured in Mailtrap, not sent to real recipients</li>
              <li><strong>Student Welcome Emails:</strong> Ready to test safely</li>
              <li><strong>Parent Notifications:</strong> Can be previewed without sending</li>
              <li><strong>Report Cards:</strong> Email delivery can be tested thoroughly</li>
            </ul>
            
            <h3 style="color: #1e293b;">🚀 Next Steps:</h3>
            <ol style="color: #475569; line-height: 1.6;">
              <li>Check your Mailtrap inbox to see this email</li>
              <li>Test student registration with email sending</li>
              <li>Preview how emails look on different devices</li>
              <li>When ready, switch to production email service</li>
            </ol>
            
            <div style="margin-top: 30px; padding: 20px; background-color: #eff6ff; border-radius: 8px; text-align: center;">
              <h4 style="color: #1e40af; margin: 0 0 10px 0;">📚 Pacey School Features</h4>
              <p style="color: #1e40af; margin: 0; font-size: 14px;">
                Student Management • Attendance Tracking • Results Management<br>
                Parent Portal • Fee Management • Admin Messaging
              </p>
            </div>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
            
            <p style="text-align: center; color: #64748b; font-size: 12px; margin: 0;">
              Sent from Pacey School Management System<br>
              Nigerian School Solution Dashboard
            </p>
          </div>
        </div>
      `
    });

    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', result.messageId);

    return NextResponse.json({
      success: true,
      message: 'Mailtrap test email sent successfully! 🎉',
      messageId: result.messageId,
      instructions: [
        '1. Check your Mailtrap inbox to see the captured email',
        '2. All emails will be safely captured, never delivered to real recipients',
        '3. Perfect for testing student welcome emails and parent notifications',
        '4. Ready to test the full Pacey School email system!'
      ],
      mailtrapInfo: {
        host: mailtrapConfig.host,
        port: mailtrapConfig.port,
        secure: false,
        testEmailSentTo: testEmail
      }
    });

  } catch (error: any) {
    console.error('❌ Mailtrap test failed:', error);
    
    let errorMessage = error.message;
    let suggestion = '';
    
    if (error.code === 'EAUTH') {
      suggestion = 'Check your Mailtrap username and password in .env.local';
    } else if (error.code === 'ECONNECTION') {
      suggestion = 'Check your internet connection and Mailtrap service status';
    } else if (error.message.includes('Invalid login')) {
      suggestion = 'Verify your Mailtrap credentials from mailtrap.io dashboard';
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
      suggestion,
      setup: 'Go to mailtrap.io → Sign Up → Inboxes → SMTP Settings → Copy credentials to .env.local'
    }, { status: 500 });
  }
}
