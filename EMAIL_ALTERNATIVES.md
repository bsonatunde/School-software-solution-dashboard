# Alternative Email Configurations for Pacey School

## 1. OUTLOOK/HOTMAIL (RECOMMENDED - Easy Setup)
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-regular-password
# No App Password needed, just use regular password

## 2. MAILTRAP (FREE EMAIL TESTING - Perfect for Development)
# Sign up at: https://mailtrap.io
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_SECURE=false
SMTP_USER=your-mailtrap-username
SMTP_PASS=your-mailtrap-password
# Emails don't actually send but you can see them in Mailtrap dashboard

## 3. SENDGRID (Professional Email Service)
# Sign up at: https://sendgrid.com (100 emails/day free)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key

## 4. MAILGUN (Developer-Friendly)
# Sign up at: https://mailgun.com
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-mailgun-username
SMTP_PASS=your-mailgun-password

## 5. YAHOO MAIL
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
# Requires App Password like Gmail

## 6. ZOHO MAIL (Business Email)
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yourdomain.com
SMTP_PASS=your-password

## EASIEST OPTIONS FOR YOU:
1. Create Outlook.com account → Use regular password
2. Sign up for Mailtrap → Free testing, see all emails in dashboard
3. Try SendGrid → Professional service, 100 free emails/day
