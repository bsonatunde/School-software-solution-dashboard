import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

// Support Ticket Schema
interface SupportTicket {
  id: string;
  userId: string;
  userType: 'staff' | 'student' | 'admin';
  userName: string;
  email: string;
  category: 'technical' | 'account' | 'billing' | 'general';
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  attachments?: string[];
  assignedTo?: string;
  responses: {
    id: string;
    author: string;
    authorType: 'user' | 'support';
    message: string;
    timestamp: Date;
    attachments?: string[];
  }[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

// GET /api/support - Get support tickets or FAQ
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const userId = searchParams.get('userId');
    const userType = searchParams.get('userType') || 'staff';

    if (action === 'faq') {
      // Return FAQ data
      const faqData = [
        {
          id: 'faq-1',
          category: 'Account',
          question: 'How do I reset my password?',
          answer: 'You can reset your password by clicking on "Forgot Password" on the login page, or by contacting your system administrator.',
          tags: ['password', 'reset', 'login']
        },
        {
          id: 'faq-2',
          category: 'Attendance',
          question: 'How do I mark student attendance?',
          answer: 'Go to the Attendance section, select your class and date, then mark each student as Present, Absent, or Late.',
          tags: ['attendance', 'marking', 'students']
        },
        {
          id: 'faq-3',
          category: 'Grades',
          question: 'How do I enter student grades?',
          answer: 'Navigate to Results → Enter Grades, select the subject and assessment type, then enter scores for each student.',
          tags: ['grades', 'results', 'assessment']
        },
        {
          id: 'faq-4',
          category: 'Messages',
          question: 'How do I send messages to parents?',
          answer: 'Go to Messages section, click "New Message", select recipients (individual parents or broadcast), and type your message.',
          tags: ['messages', 'parents', 'communication']
        },
        {
          id: 'faq-5',
          category: 'Technical',
          question: 'The system is running slowly. What should I do?',
          answer: 'Try refreshing your browser, clearing cache, or switching to a different browser. If the issue persists, contact technical support.',
          tags: ['performance', 'slow', 'technical']
        },
        {
          id: 'faq-6',
          category: 'Profile',
          question: 'How do I update my profile information?',
          answer: 'Click on the settings icon (⚙️) in the top navigation, select "Profile Settings", and update your information.',
          tags: ['profile', 'update', 'information']
        }
      ];

      return NextResponse.json({
        success: true,
        data: faqData
      });
    }

    if (action === 'tickets' && userId) {
      // Get user's support tickets
      const tickets = await db.collection('supportTickets').find({
        userId: userId,
        userType: userType
      }).sort({ createdAt: -1 }).toArray();

      return NextResponse.json({
        success: true,
        data: tickets
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action or missing parameters'
    }, { status: 400 });

  } catch (error) {
    console.error('Error fetching support data:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch support data'
    }, { status: 500 });
  }
}

// POST /api/support - Create new support ticket
export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase();
    const body = await request.json();
    const { userId, userType = 'staff', userName, email, category, subject, description, priority = 'medium' } = body;

    if (!userId || !userName || !email || !category || !subject || !description) {
      return NextResponse.json({
        success: false,
        error: 'All required fields must be provided'
      }, { status: 400 });
    }

    // Generate ticket ID
    const ticketId = `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    const ticket: SupportTicket = {
      id: ticketId,
      userId,
      userType,
      userName,
      email,
      category,
      subject,
      description,
      priority,
      status: 'open',
      responses: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert ticket into database
    const result = await db.collection('supportTickets').insertOne(ticket);

    return NextResponse.json({
      success: true,
      message: 'Support ticket created successfully',
      data: {
        ticketId: ticket.id,
        insertedId: result.insertedId
      }
    });

  } catch (error) {
    console.error('Error creating support ticket:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create support ticket'
    }, { status: 500 });
  }
}

// PUT /api/support - Update support ticket
export async function PUT(request: NextRequest) {
  try {
    const db = await getDatabase();
    const body = await request.json();
    const { ticketId, response, userId, userName } = body;

    if (!ticketId) {
      return NextResponse.json({
        success: false,
        error: 'Ticket ID is required'
      }, { status: 400 });
    }

    let updateData: any = {
      updatedAt: new Date()
    };

    if (response) {
      // Add response to ticket
      const newResponse = {
        id: `response-${Date.now()}`,
        author: userName || userId,
        authorType: 'user',
        message: response,
        timestamp: new Date()
      };

      updateData.$push = {
        responses: newResponse
      };
    }

    // Update ticket
    const result = await db.collection('supportTickets').updateOne(
      { id: ticketId },
      updateData
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Ticket not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Ticket updated successfully',
      data: { modifiedCount: result.modifiedCount }
    });

  } catch (error) {
    console.error('Error updating support ticket:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update support ticket'
    }, { status: 500 });
  }
}
