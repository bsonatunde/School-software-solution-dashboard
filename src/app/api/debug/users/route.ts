import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDatabase();
    
    // Get all users (without passwords for security)
    const users = await db.collection('users')
      .find({}, { projection: { password: 0 } })
      .toArray();
    
    return NextResponse.json({
      success: true,
      data: {
        totalUsers: users.length,
        users: users,
        usersByRole: {
          student: users.filter(u => u.role === 'student').length,
          teacher: users.filter(u => u.role === 'teacher').length,
          admin: users.filter(u => u.role === 'admin').length,
          staff: users.filter(u => u.role === 'staff').length
        }
      }
    });

  } catch (error: any) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch user data'
    }, { status: 500 });
  }
}
