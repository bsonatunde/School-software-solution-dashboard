import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    // Test different Gmail account configurations
    const configs = [
      {
        name: 'Current Config',
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      {
        name: 'With Pacey Username',
        user: 'pacey@gmail.com',
        pass: process.env.SMTP_PASS
      },
      {
        name: 'With Different Format',
        user: process.env.SMTP_USER,
        pass: 'nscl ugsj yrxb uwcp'
      }
    ];

    const results = [];

    for (const config of configs) {
      try {
        console.log(`Testing ${config.name}:`, {
          user: config.user,
          hasPass: !!config.pass,
          passLength: config.pass?.length
        });

        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: config.user,
            pass: config.pass,
          },
          tls: {
            rejectUnauthorized: false
          }
        });

        await transporter.verify();
        
        results.push({
          config: config.name,
          status: 'SUCCESS',
          user: config.user
        });
        
        console.log(`✅ ${config.name} - SUCCESS`);
        break; // Stop on first success
        
      } catch (error: any) {
        results.push({
          config: config.name,
          status: 'FAILED',
          error: error.message,
          user: config.user
        });
        console.log(`❌ ${config.name} - FAILED:`, error.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Email configuration test completed',
      results,
      currentEnv: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        hasPass: !!process.env.SMTP_PASS,
        passLength: process.env.SMTP_PASS?.length
      }
    });

  } catch (error: any) {
    console.error('Email test failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Email configuration test failed'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, user, pass } = await request.json();
    
    if (!email || !user || !pass) {
      return NextResponse.json({
        success: false,
        error: 'Email, user, and pass are required'
      }, { status: 400 });
    }

    console.log('Testing custom configuration:', { user, hasPass: !!pass });

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: user,
        pass: pass,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // First test connection
    await transporter.verify();

    // Then send test email
    const result = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'no-reply@paceyschool.com',
      to: email,
      subject: 'Pacey School - Email Test Success!',
      text: 'Congratulations! Your email configuration is working correctly.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0ea5e9;">🎉 Email Configuration Success!</h2>
          <p>Congratulations! Your Pacey School email system is now working correctly.</p>
          <p>This means student welcome emails will now be sent automatically when new students are registered.</p>
          <hr style="margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">
            Sent from Pacey School Management System
          </p>
        </div>
      `
    });

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully!',
      messageId: result.messageId,
      configuration: 'Working'
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
