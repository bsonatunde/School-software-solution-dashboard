# MongoDB Setup Instructions for Pacey School Solution

## Prerequisites
1. Install MongoDB Community Edition:
   - Download from: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

## Local MongoDB Setup (Windows)

### Option 1: MongoDB Community Server (Local)
1. Download and install MongoDB Community Server
2. Start MongoDB service:
   ```powershell
   net start MongoDB
   ```
3. Your MongoDB will be running on: `mongodb://localhost:27017`

### Option 2: MongoDB Atlas (Cloud - Recommended)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier available)
3. Get your connection string from "Connect" > "Connect your application"
4. Replace the MONGODB_URI in your .env.local file

## Configuration

Update your `.env.local` file with your MongoDB connection details:

```env
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/pacey-school-db

# OR MongoDB Atlas (replace with your actual connection string)
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/pacey-school-db?retryWrites=true&w=majority

DATABASE_NAME=pacey-school-db
```

## Database Initialization

The database will automatically initialize with sample data when you:
1. Start your Next.js application: `npm run dev`
2. Make your first API request to `/api/staff`

The system will create:
- Sample classes (JSS 1A, JSS 2B, SS 1A)
- Sample staff member (John Doe - Mathematics Teacher)
- All necessary collections and indexes

## Database Collections

The following collections will be created:
- `students` - Student records
- `staff` - Staff/teacher records  
- `classes` - Class information
- `subjects` - Subject details
- `attendance` - Attendance records
- `grades` - Student grades
- `fees` - Fee management
- `payrolls` - Payroll records
- `users` - User accounts
- `parents` - Parent information
- `messages` - Communication messages
- `academicyears` - Academic year settings

## Verification

To verify your MongoDB connection:
1. Start your application: `npm run dev`
2. Visit: http://localhost:3000/api/staff
3. You should see a JSON response with sample staff data

## MongoDB Commands (Optional)

Connect to your database using MongoDB Compass or mongo shell:
```bash
# Connect to local MongoDB
mongo mongodb://localhost:27017/pacey-school-db

# View collections
show collections

# View sample staff data
db.staff.find().pretty()
```

## Troubleshooting

1. **Connection Error**: Ensure MongoDB service is running
2. **Authentication Error**: Check your username/password in connection string
3. **Network Error**: Check your IP whitelist in MongoDB Atlas
4. **Missing Data**: Database will auto-initialize on first request

For more help, visit: https://docs.mongodb.com/
