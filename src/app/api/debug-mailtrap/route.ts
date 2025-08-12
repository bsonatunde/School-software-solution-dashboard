import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check current environment variables
    const config = {
      SMTP_HOST: process.env.SMTP_HOST || 'Not set',
      SMTP_PORT: process.env.SMTP_PORT || 'Not set',
      SMTP_USER: process.env.SMTP_USER || 'Not set',
      SMTP_PASS: process.env.SMTP_PASS ? 'Set (hidden)' : 'Not set',
      SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL || 'Not set',
    };

    // Check if we have placeholder values
    const hasPlaceholders = 
      process.env.SMTP_USER === 'your_mailtrap_username' ||
      process.env.SMTP_PASS === 'your_mailtrap_password' ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS;

    return NextResponse.json({
      currentConfig: config,
      hasPlaceholders,
      status: hasPlaceholders ? 'Configuration needed' : 'Ready to test',
      instructions: {
        step1: 'Go to https://mailtrap.io and sign up/login',
        step2: 'Navigate to: Email Testing → Inboxes → My Inbox (or create new)',
        step3: 'Click "SMTP Settings" tab',
        step4: 'Select "Node.js - Nodemailer" from dropdown',
        step5: 'Copy the username and password shown',
        step6: 'Update your .env.local file with real credentials',
        step7: 'Restart your development server'
      },
      troubleshooting: {
        commonIssues: [
          'Using template placeholders instead of real credentials',
          'Copied credentials with extra spaces or characters',
          'Not restarting development server after updating .env.local',
          'Using wrong inbox credentials'
        ],
        solutions: [
          'Double-check you copied exact username/password from Mailtrap',
          'Ensure no extra spaces before/after credentials in .env.local',
          'Restart npm run dev after updating environment variables',
          'Try creating a new inbox in Mailtrap if issues persist'
        ]
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      error: 'Failed to check configuration',
      message: error.message
    }, { status: 500 });
  }
}
