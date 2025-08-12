import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Message, Student } from '@/lib/models';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Get all students to send messages to
    const students = await Student.find({ status: 'Active' }).limit(5);
    
    if (students.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No active students found'
      }, { status: 404 });
    }

    // Sample messages to create
    const sampleMessages = [
      {
        senderId: 'admin001',
        senderType: 'Admin',
        recipientType: 'Students',
        recipientIds: students.map(s => s.admissionNumber),
        title: '🎉 Welcome to New Academic Session 2024/2025',
        content: `Dear Students,

Welcome to the new academic session! We are excited to have you back.

Key Information:
- Classes begin on Monday, January 8th, 2025
- New school uniforms are available at the school store
- Please ensure all fees are paid before resumption
- Parent-Teacher meeting scheduled for January 15th

We wish you a successful academic year!

Best regards,
School Administration`,
        priority: 'High',
        status: 'Sent',
        deliveryMethod: 'App'
      },
      {
        senderId: 'teacher001',
        senderType: 'Teacher',
        recipientType: 'Class',
        recipientIds: students.slice(0, 3).map(s => s.admissionNumber),
        title: '📚 Mathematics Assignment Due Tomorrow',
        content: `Hello Students,

This is a reminder that your Mathematics assignment on Algebra is due tomorrow.

Assignment Details:
- Chapter 5: Quadratic Equations
- Questions 1-20
- Show all working steps
- Submit before 10:00 AM

Good luck!

Mr. Johnson
Mathematics Teacher`,
        priority: 'Medium',
        status: 'Sent',
        deliveryMethod: 'App'
      },
      {
        senderId: 'admin001',
        senderType: 'Admin',
        recipientType: 'All',
        recipientIds: [],
        title: '🚨 Important: School Event Update',
        content: `Dear School Community,

Due to unforeseen circumstances, the Inter-House Sports Competition scheduled for this Friday has been postponed.

New Date: Friday, January 26th, 2025
Time: 9:00 AM - 4:00 PM
Venue: School Sports Complex

Please mark your calendars accordingly.

Thank you for your understanding.

School Management`,
        priority: 'Urgent',
        status: 'Sent',
        deliveryMethod: 'App'
      },
      {
        senderId: 'teacher002',
        senderType: 'Teacher',
        recipientType: 'Students',
        recipientIds: students.slice(1, 4).map(s => s.admissionNumber),
        title: '📖 English Literature Reading Assignment',
        content: `Dear Students,

For our next English Literature class, please read Chapter 3 of "Things Fall Apart" by Chinua Achebe.

Prepare to discuss:
- Character development of Okonkwo
- Themes of tradition vs. change
- Cultural significance of the story

We will have a quiz on this chapter next Tuesday.

Mrs. Adebayo
English Department`,
        priority: 'Medium',
        status: 'Sent',
        deliveryMethod: 'App'
      },
      {
        senderId: 'admin001',
        senderType: 'Admin',
        recipientType: 'Individual',
        recipientIds: [students[0].admissionNumber],
        title: '👨‍🎓 Academic Excellence Award',
        content: `Congratulations ${students[0].firstName}!

You have been selected for the Academic Excellence Award for outstanding performance in the last term.

Award Details:
- Certificate of Excellence
- Cash prize of ₦10,000
- Recognition at the next school assembly

Your hard work and dedication have paid off. Keep up the excellent work!

Principal,
Pacey School`,
        priority: 'High',
        status: 'Sent',
        deliveryMethod: 'App'
      },
      {
        senderId: 'teacher003',
        senderType: 'Teacher',
        recipientType: 'Class',
        recipientIds: students.slice(0, 2).map(s => s.admissionNumber),
        title: '🧪 Science Laboratory Session',
        content: `Dear Students,

We will be conducting an experiment on chemical reactions in tomorrow's laboratory session.

Please bring:
- Laboratory notebook
- Safety goggles (provided by school)
- Closed-toe shoes are mandatory

Safety is our priority. Students not properly dressed will not be allowed in the lab.

Mr. Okafor
Science Department`,
        priority: 'Medium',
        status: 'Sent',
        deliveryMethod: 'App'
      }
    ];

    // Create messages with random sent dates in the past week
    const createdMessages = [];
    for (const messageData of sampleMessages) {
      const randomDaysAgo = Math.floor(Math.random() * 7);
      const sentDate = new Date();
      sentDate.setDate(sentDate.getDate() - randomDaysAgo);
      
      const message = new Message({
        ...messageData,
        sentDate
      });
      
      await message.save();
      createdMessages.push(message);
    }

    return NextResponse.json({
      success: true,
      data: createdMessages,
      message: `Created ${createdMessages.length} sample messages successfully`
    });

  } catch (error: any) {
    console.error('Error creating sample messages:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to create sample messages'
    }, { status: 500 });
  }
}
