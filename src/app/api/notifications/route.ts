import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/notifications - Get notifications for a user
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const { searchParams } = new URL(request.url);
    
    const studentId = searchParams.get('studentId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const isRead = searchParams.get('isRead');

    if (!studentId) {
      return NextResponse.json({
        success: false,
        error: 'Student ID is required'
      }, { status: 400 });
    }

    // Build query filter
    let filter: any = { studentId };
    
    if (isRead !== null) {
      filter.isRead = isRead === 'true';
    }

    // Get total count for pagination
    const total = await db.collection('notifications').countDocuments(filter);
    
    // Get notifications with pagination
    const notifications = await db.collection('notifications')
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      stats: {
        unread: await db.collection('notifications').countDocuments({ 
          studentId, 
          isRead: false 
        })
      }
    });

  } catch (error: any) {
    console.error('Get notifications error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch notifications',
      details: error.message
    }, { status: 500 });
  }
}

// PUT /api/notifications - Mark notification as read
export async function PUT(request: NextRequest) {
  try {
    const db = await getDatabase();
    const body = await request.json();
    const { notificationId, studentId, markAllAsRead } = body;

    if (markAllAsRead) {
      // Mark all notifications as read for the student
      await db.collection('notifications').updateMany(
        { studentId, isRead: false },
        { $set: { isRead: true, readAt: new Date() } }
      );
      
      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read'
      });
    } else if (notificationId) {
      // Mark specific notification as read
      const result = await db.collection('notifications').updateOne(
        { _id: new ObjectId(notificationId), studentId },
        { $set: { isRead: true, readAt: new Date() } }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json({
          success: false,
          error: 'Notification not found'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: 'Notification marked as read'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Either notificationId or markAllAsRead is required'
      }, { status: 400 });
    }

  } catch (error: any) {
    console.error('Update notification error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update notification',
      details: error.message
    }, { status: 500 });
  }
}
