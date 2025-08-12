import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Message } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const recipientType = searchParams.get('recipientType');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    let query: any = {};

    if (studentId) {
      // Get messages for a specific student
      query = {
        $or: [
          { recipientType: 'All' },
          { recipientType: 'Students' },
          { recipientIds: studentId },
          { recipientType: 'Individual', recipientIds: studentId }
        ],
        status: { $in: ['Sent', 'Delivered', 'Read'] }
      };
    } else if (recipientType) {
      query.recipientType = recipientType;
    }

    const messages = await Message.find(query)
      .sort({ sentDate: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Message.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: messages,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch messages'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const {
      senderId,
      senderType,
      recipientType,
      recipientIds,
      title,
      content,
      priority = 'Medium',
      deliveryMethod = 'App'
    } = body;

    // Validate required fields
    if (!senderId || !senderType || !recipientType || !title || !content) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    const message = new Message({
      senderId,
      senderType,
      recipientType,
      recipientIds: recipientIds || [],
      title,
      content,
      priority,
      deliveryMethod,
      status: 'Sent',
      sentDate: new Date()
    });

    await message.save();

    return NextResponse.json({
      success: true,
      data: message,
      message: 'Message sent successfully'
    });

  } catch (error: any) {
    console.error('Error creating message:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to send message'
    }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('id');
    const body = await request.json();

    if (!messageId) {
      return NextResponse.json({
        success: false,
        error: 'Message ID is required'
      }, { status: 400 });
    }

    const message = await Message.findByIdAndUpdate(
      messageId,
      body,
      { new: true }
    );

    if (!message) {
      return NextResponse.json({
        success: false,
        error: 'Message not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: message,
      message: 'Message updated successfully'
    });

  } catch (error: any) {
    console.error('Error updating message:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to update message'
    }, { status: 500 });
  }
}
