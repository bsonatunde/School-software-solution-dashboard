import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// User Preferences Schema
interface UserPreferences {
  userId: string;
  userType: 'staff' | 'student' | 'admin';
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    desktop: boolean;
    sound: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'school' | 'private';
    showEmail: boolean;
    showPhone: boolean;
    allowMessages: boolean;
  };
  dashboard: {
    layout: 'grid' | 'list';
    widgets: string[];
    autoRefresh: boolean;
    refreshInterval: number;
  };
  accessibility: {
    fontSize: 'small' | 'medium' | 'large';
    highContrast: boolean;
    reducedMotion: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

// GET /api/preferences - Get user preferences
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

    // Get user preferences
    const preferences = await db.collection('userPreferences').findOne({
      userId: userId,
      userType: userType
    });

    // Default preferences if none exist
    const defaultPreferences = {
      userId,
      userType,
      theme: 'light',
      language: 'en',
      timezone: 'Africa/Lagos',
      dateFormat: 'DD/MM/YYYY',
      currency: 'NGN',
      notifications: {
        email: true,
        sms: true,
        push: true,
        desktop: false,
        sound: true
      },
      privacy: {
        profileVisibility: 'school',
        showEmail: false,
        showPhone: false,
        allowMessages: true
      },
      dashboard: {
        layout: 'grid',
        widgets: ['overview', 'recent-activity', 'notifications', 'quick-actions'],
        autoRefresh: true,
        refreshInterval: 300 // 5 minutes
      },
      accessibility: {
        fontSize: 'medium',
        highContrast: false,
        reducedMotion: false
      }
    };

    return NextResponse.json({
      success: true,
      data: preferences || defaultPreferences
    });

  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch preferences'
    }, { status: 500 });
  }
}

// PUT /api/preferences - Update user preferences
export async function PUT(request: NextRequest) {
  try {
    const db = await getDatabase();
    const body = await request.json();
    const { userId, userType = 'staff', preferences } = body;

    if (!userId || !preferences) {
      return NextResponse.json({
        success: false,
        error: 'User ID and preferences are required'
      }, { status: 400 });
    }

    // Prepare update object
    const updateData = {
      ...preferences,
      userId,
      userType,
      updatedAt: new Date()
    };

    // Use upsert to create if doesn't exist, update if it does
    const result = await db.collection('userPreferences').updateOne(
      { userId: userId, userType: userType },
      { 
        $set: updateData,
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        upsertedId: result.upsertedId,
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount
      }
    });

  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update preferences'
    }, { status: 500 });
  }
}

// DELETE /api/preferences - Reset preferences to default
export async function DELETE(request: NextRequest) {
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

    // Delete user preferences (will fall back to defaults)
    const result = await db.collection('userPreferences').deleteOne({
      userId: userId,
      userType: userType
    });

    return NextResponse.json({
      success: true,
      message: 'Preferences reset to default',
      data: { deletedCount: result.deletedCount }
    });

  } catch (error) {
    console.error('Error resetting preferences:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to reset preferences'
    }, { status: 500 });
  }
}
