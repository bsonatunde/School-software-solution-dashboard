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

    // Try different email variations for "Pacey"
    const emailVariations = [
      'pacey@gmail.com',
      'paceyschool@gmail.com', 
      'pacey.school@gmail.com',
      'school.pacey@gmail.com',
      'pacey123@gmail.com',
      'pacey2024@gmail.com',
      'pacey2025@gmail.com'
    ];

    const appPassword = 'nsclugjsyrxbuwcp';
    
    console.log('🔍 Testing Gmail variations for Pacey account...');
    
    for (const emailVariation of emailVariations) {
      try {
        console.log(`Testing: ${emailVariation}`);
        
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: emailVariation,
            pass: appPassword,
          },
          tls: {
            rejectUnauthorized: false
          }
        });

        // Test connection
        await transporter.verify();
        
        // If we get here, authentication worked!
        console.log(`✅ SUCCESS! Working Gmail account: ${emailVariation}`);
        
        // Send actual test email
        const result = await transporter.sendMail({
          from: 'no-reply@paceyschool.com',
          to: testEmail,
          subject: 'Pacey School - Email Configuration Success! 🎉',
          text: `Success! Your Pacey School email system is now working with ${emailVariation}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #0ea5e9;">🎉 Pacey School Email Success!</h2>
              <p>Congratulations! Your email configuration is now working perfectly.</p>
              <p><strong>Working Gmail Account:</strong> ${emailVariation}</p>
              <p>Student welcome emails will now be sent automatically when new students are registered.</p>
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
          workingAccount: emailVariation,
          messageId: result.messageId,
          note: `Update your .env.local file to use: SMTP_USER=${emailVariation}`
        });

      } catch (error: any) {
        console.log(`❌ Failed: ${emailVariation} - ${error.message}`);
        continue; // Try next variation
      }
    }
    
    // If we get here, none worked
    return NextResponse.json({
      success: false,
      message: 'None of the Gmail variations worked',
      testedAccounts: emailVariations,
      suggestion: 'Please verify the exact Gmail address and ensure 2FA is enabled'
    }, { status: 400 });

  } catch (error: any) {
    console.error('Email variation test failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Email variation test failed'
    }, { status: 500 });
  }
}
