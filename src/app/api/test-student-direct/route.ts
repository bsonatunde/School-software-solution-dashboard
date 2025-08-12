import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { studentEmail } = await request.json();
    
    if (!studentEmail) {
      return NextResponse.json({
        success: false,
        error: 'Student email is required'
      }, { status: 400 });
    }

    console.log('📧 Testing direct student email with Mailtrap...');
    
    // Create transporter directly with our known working Mailtrap config
    const transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      secure: false,
      auth: {
        user: '1e67da382537bb',
        pass: 'a4414599ff3224',
      },
    });

    // Test data
    const studentData = {
      name: 'John Doe',
      studentId: 'PSS0001',
      password: 'test123',
      email: studentEmail
    };

    console.log('Sending welcome email to:', studentData.email);

    // Send welcome email
    const result = await transporter.sendMail({
      from: '"Pacey School" <noreply@paceyschool.com>',
      to: studentData.email,
      subject: '🎓 Welcome to Pacey School - Your Login Credentials',
      text: `Dear ${studentData.name},

Welcome to Pacey School!

Your login credentials are:
Student ID: ${studentData.studentId}
Password: ${studentData.password}

Please log in and change your password after your first login.

Best regards,
Pacey School Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #0ea5e9; text-align: center; margin-bottom: 30px;">
              🎓 Welcome to Pacey School!
            </h1>
            
            <p style="font-size: 16px; color: #1f2937;">Dear <strong>${studentData.name}</strong>,</p>
            
            <p style="color: #475569; line-height: 1.6;">
              Welcome to Pacey School! We're excited to have you as part of our academic community.
            </p>
            
            <div style="background-color: #dcfce7; padding: 20px; border-radius: 8px; border-left: 4px solid #22c55e; margin: 20px 0;">
              <h3 style="color: #166534; margin: 0 0 15px 0;">🔐 Your Login Credentials:</h3>
              <p style="color: #166534; margin: 5px 0;">
                <strong>Student ID:</strong> 
                <code style="background-color: #f0fdf4; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${studentData.studentId}</code>
              </p>
              <p style="color: #166534; margin: 5px 0;">
                <strong>Password:</strong> 
                <code style="background-color: #f0fdf4; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${studentData.password}</code>
              </p>
            </div>
            
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
              <p style="color: #92400e; margin: 0;">
                <strong>⚠️ Important:</strong> Please log in and change your password after your first login for security purposes.
              </p>
            </div>
            
            <h3 style="color: #1e293b;">📚 What's Next?</h3>
            <ul style="color: #475569; line-height: 1.6;">
              <li>Visit the school portal and log in with your credentials</li>
              <li>Complete your profile information</li>
              <li>Check your class schedule and subjects</li>
              <li>Connect with your teachers and classmates</li>
            </ul>
            
            <div style="margin-top: 30px; padding: 20px; background-color: #eff6ff; border-radius: 8px; text-align: center;">
              <h4 style="color: #1e40af; margin: 0 0 10px 0;">🏫 Pacey School Features</h4>
              <p style="color: #1e40af; margin: 0; font-size: 14px;">
                Attendance Tracking • Results Management • Parent Portal<br>
                Fee Management • Library Access • Communication Hub
              </p>
            </div>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
            
            <p style="text-align: center; color: #64748b; font-size: 12px; margin: 0;">
              Sent from Pacey School Management System<br>
              Nigerian School Solution Dashboard<br>
              <em>This email was safely captured in Mailtrap for testing</em>
            </p>
          </div>
        </div>
      `
    });

    console.log('✅ Student welcome email sent successfully!');
    console.log('Message ID:', result.messageId);

    return NextResponse.json({
      success: true,
      message: 'Student welcome email sent successfully! 🎉',
      data: studentData,
      messageId: result.messageId,
      instructions: [
        '1. Check your Mailtrap inbox to see the student welcome email',
        '2. The email contains complete login credentials and instructions',
        '3. Perfect template for onboarding new students',
        '4. Ready to integrate with actual student registration'
      ],
      mailtrapNote: 'Email safely captured in Mailtrap - no real emails sent!'
    });

  } catch (error: any) {
    console.error('❌ Student email test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to send student welcome email',
      details: error.message
    }, { status: 500 });
  }
}
