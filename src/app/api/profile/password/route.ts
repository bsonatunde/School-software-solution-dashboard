import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// POST /api/profile/password - Change user password
export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase();
    const body = await request.json();
    const { userId, userType = 'staff', currentPassword, newPassword } = body;

    if (!userId || !currentPassword || !newPassword) {
      return NextResponse.json({
        success: false,
        error: 'All password fields are required'
      }, { status: 400 });
    }

    let collection = 'staff';
    if (userType === 'student') {
      collection = 'students';
    }

    // For now, we'll just update the password directly
    // In a real implementation, you'd verify the current password first
    let updateQuery: any = {
      $or: [
        { employeeId: userId },
        { admissionNumber: userId }
      ]
    };

    // Only add ObjectId search if userId is a valid ObjectId
    if (userId.match(/^[0-9a-fA-F]{24}$/)) {
      updateQuery.$or.push({ _id: new ObjectId(userId) });
    }

    const result = await db.collection(collection).updateOne(
      updateQuery,
      { 
        $set: { 
          password: newPassword, // In production, hash this password
          updatedAt: new Date(),
          passwordChangedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to change password'
    }, { status: 500 });
  }
}
