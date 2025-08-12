import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    // Direct configuration test
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    console.log('Testing email with env vars:', {
      user: process.env.SMTP_USER,
      hasPass: !!process.env.SMTP_PASS,
      host: process.env.SMTP_HOST
    });

    // Test connection
    await transporter.verify();
    
    return NextResponse.json({
      success: true,
      message: 'Email connection successful!',
      config: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        from: process.env.SMTP_FROM
      }
    });

  } catch (error: any) {
    console.error('Email connection failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Email connection failed'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email address required'
      }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const result = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'no-reply@paceyschool.com',
      to: email,
      subject: 'Test Email from Pacey School',
      text: 'This is a test email to verify the email configuration is working.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0ea5e9;">Test Email from Pacey School! 📧</h2>
          <p>This is a test email to verify that the email configuration is working properly.</p>
          <p>If you received this email, the SMTP configuration is correct!</p>
          <hr style="margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">
            Sent from Pacey School Management System
          </p>
        </div>
      `
    });

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully!',
      messageId: result.messageId
    });

  } catch (error: any) {
    console.error('Failed to send test email:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Failed to send test email'
    }, { status: 500 });
  }
}
