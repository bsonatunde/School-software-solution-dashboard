import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

// Notification Settings Schema
interface NotificationSettings {
  userId: string;
  userType: 'staff' | 'student' | 'admin';
  messageTypes: {
    announcements: {
      email: boolean;
      sms: boolean;
      push: boolean;
      priority: 'low' | 'medium' | 'high';
    };
    assignments: {
      email: boolean;
      sms: boolean;
      push: boolean;
      priority: 'low' | 'medium' | 'high';
    };
    grades: {
      email: boolean;
      sms: boolean;
      push: boolean;
      priority: 'low' | 'medium' | 'high';
    };
    attendance: {
      email: boolean;
      sms: boolean;
      push: boolean;
      priority: 'low' | 'medium' | 'high';
    };
    fees: {
      email: boolean;
      sms: boolean;
      push: boolean;
      priority: 'low' | 'medium' | 'high';
    };
    events: {
      email: boolean;
      sms: boolean;
      push: boolean;
      priority: 'low' | 'medium' | 'high';
    };
    emergencies: {
      email: boolean;
      sms: boolean;
      push: boolean;
      priority: 'high';
    };
  };
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
    timezone: string;
  };
  digestMode: {
    enabled: boolean;
    frequency: 'daily' | 'weekly';
    time: string;
  };
  channels: {
    email: {
      enabled: boolean;
      address: string;
      verified: boolean;
    };
    sms: {
      enabled: boolean;
      phoneNumber: string;
      verified: boolean;
    };
    push: {
      enabled: boolean;
      devices: string[];
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

// GET /api/notification-settings - Get notification settings
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const userType = searchParams.get('userType') || 'staff';

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }

    // Get notification settings
    const settings = await db.collection('notificationSettings').findOne({
      userId: userId,
      userType: userType
    });

    // Default notification settings
    const defaultSettings = {
      userId,
      userType,
      messageTypes: {
        announcements: {
          email: true,
          sms: false,
          push: true,
          priority: 'medium' as const
        },
        assignments: {
          email: true,
          sms: true,
          push: true,
          priority: 'high' as const
        },
        grades: {
          email: true,
          sms: true,
          push: true,
          priority: 'high' as const
        },
        attendance: {
          email: false,
          sms: true,
          push: true,
          priority: 'medium' as const
        },
        fees: {
          email: true,
          sms: true,
          push: false,
          priority: 'medium' as const
        },
        events: {
          email: true,
          sms: false,
          push: true,
          priority: 'low' as const
        },
        emergencies: {
          email: true,
          sms: true,
          push: true,
          priority: 'high' as const
        }
      },
      quietHours: {
        enabled: true,
        startTime: '22:00',
        endTime: '07:00',
        timezone: 'Africa/Lagos'
      },
      digestMode: {
        enabled: false,
        frequency: 'daily' as const,
        time: '08:00'
      },
      channels: {
        email: {
          enabled: true,
          address: '',
          verified: false
        },
        sms: {
          enabled: true,
          phoneNumber: '',
          verified: false
        },
        push: {
          enabled: true,
          devices: []
        }
      }
    };

    return NextResponse.json({
      success: true,
      data: settings || defaultSettings
    });

  } catch (error) {
    console.error('Error fetching notification settings:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch notification settings'
    }, { status: 500 });
  }
}

// PUT /api/notification-settings - Update notification settings
export async function PUT(request: NextRequest) {
  try {
    const db = await getDatabase();
    const body = await request.json();
    const { userId, userType = 'staff', settings } = body;

    if (!userId || !settings) {
      return NextResponse.json({
        success: false,
        error: 'User ID and settings are required'
      }, { status: 400 });
    }

    // Prepare update object
    const updateData = {
      ...settings,
      userId,
      userType,
      updatedAt: new Date()
    };

    // Use upsert to create if doesn't exist, update if it does
    const result = await db.collection('notificationSettings').updateOne(
      { userId: userId, userType: userType },
      { 
        $set: updateData,
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Notification settings updated successfully',
      data: {
        upsertedId: result.upsertedId,
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount
      }
    });

  } catch (error) {
    console.error('Error updating notification settings:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update notification settings'
    }, { status: 500 });
  }
}

// POST /api/notification-settings/test - Send test notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, userType = 'staff', channel, messageType } = body;

    if (!userId || !channel || !messageType) {
      return NextResponse.json({
        success: false,
        error: 'User ID, channel, and message type are required'
      }, { status: 400 });
    }

    // In a real implementation, this would send an actual test notification
    console.log(`Sending test ${channel} notification for ${messageType} to user ${userId}`);

    return NextResponse.json({
      success: true,
      message: `Test ${channel} notification sent successfully`,
      data: {
        channel,
        messageType,
        sentAt: new Date()
      }
    });

  } catch (error) {
    console.error('Error sending test notification:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to send test notification'
    }, { status: 500 });
  }
}
