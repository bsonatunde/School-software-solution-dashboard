# Mailtrap.io Setup Guide for Pacey School

## Why Mailtrap?
✅ **Safe Testing**: All emails are captured, never delivered to real recipients  
✅ **Easy Setup**: No App Passwords or complex authentication  
✅ **Free Plan**: 100 emails/month for testing  
✅ **Email Preview**: See exactly how emails look before going live  
✅ **Development Perfect**: Ideal for school management system testing  

## Step 1: Create Mailtrap Account
1. Go to [https://mailtrap.io](https://mailtrap.io)
2. Click "Sign Up Free"
3. Choose "Email Testing" (free plan)
4. Verify your email address

## Step 2: Get Your SMTP Credentials
1. Login to Mailtrap dashboard
2. Go to "Inboxes" → "My Inbox" (or create a new inbox)
3. Click on "SMTP Settings"
4. Choose "Node.js - Nodemailer" from the dropdown
5. Copy the credentials shown

## Step 3: Update Your Environment Variables
Update your `.env.local` file with Mailtrap credentials:

```bash
# Email Configuration - Mailtrap.io (TESTING)
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_mailtrap_username
SMTP_PASS=your_mailtrap_password
SMTP_FROM_EMAIL=noreply@paceyschool.com
SMTP_FROM_NAME=Pacey School
```

## Step 4: Test Configuration
Use the test endpoint: `POST /api/test-mailtrap`

## Benefits for Pacey School:
- 📧 **Safe Student Emails**: Test welcome emails without sending to real students
- 👨‍👩‍👧‍👦 **Parent Notifications**: Preview parent notification emails
- 📊 **Report Cards**: Test result notification emails safely
- 🔒 **No Spam Risk**: Zero chance of accidentally spamming users
- 📱 **Mobile Preview**: See how emails look on different devices

## Next Steps:
1. Complete Mailtrap signup
2. Get your SMTP credentials
3. Update .env.local file
4. Test with the API endpoint
5. When ready for production, switch to a real email service

## Production Ready:
When you're ready to send real emails, simply switch to:
- Gmail (with App Password)
- Outlook (with App Password) 
- SendGrid (API-based)
- Mailgun (API-based)
