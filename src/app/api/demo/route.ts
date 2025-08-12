import { NextRequest, NextResponse } from 'next/server';
import { 
  demoStudents, 
  demoTeachers, 
  demoAssignments, 
  demoAttendance,
  demoResults,
  demoMessages,
  getDashboardStats,
  getStudentById,
  getTeacherById,
  getStudentsByClass,
  getAssignmentsByTeacher,
  getAttendanceByStudent,
  getResultsByStudent,
  getUnreadMessages
} from '@/lib/demo-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');
  const filter = searchParams.get('filter');

  try {
    switch (type) {
      case 'students':
        if (id) {
          return NextResponse.json({ data: getStudentById(id) });
        }
        if (filter) {
          return NextResponse.json({ data: getStudentsByClass(filter) });
        }
        return NextResponse.json({ data: demoStudents });

      case 'teachers':
        if (id) {
          return NextResponse.json({ data: getTeacherById(id) });
        }
        return NextResponse.json({ data: demoTeachers });

      case 'assignments':
        if (filter) {
          return NextResponse.json({ data: getAssignmentsByTeacher(filter) });
        }
        return NextResponse.json({ data: demoAssignments });

      case 'attendance':
        if (id) {
          return NextResponse.json({ data: getAttendanceByStudent(id) });
        }
        return NextResponse.json({ data: demoAttendance });

      case 'results':
        if (id) {
          return NextResponse.json({ data: getResultsByStudent(id) });
        }
        return NextResponse.json({ data: demoResults });

      case 'messages':
        if (filter) {
          return NextResponse.json({ data: getUnreadMessages(filter) });
        }
        return NextResponse.json({ data: demoMessages });

      case 'stats':
        return NextResponse.json({ data: getDashboardStats() });

      default:
        return NextResponse.json({ 
          data: {
            students: demoStudents,
            teachers: demoTeachers,
            assignments: demoAssignments,
            attendance: demoAttendance,
            results: demoResults,
            messages: demoMessages,
            stats: getDashboardStats()
          }
        });
    }
  } catch (error) {
    console.error('Demo API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch demo data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, action, data } = body;

    // Simulate API operations for demo purposes
    switch (type) {
      case 'assignment':
        if (action === 'create') {
          // Simulate creating a new assignment
          const newAssignment = {
            id: String(demoAssignments.length + 1),
            title: data.title,
            subject: data.subject,
            class: data.class,
            teacher: data.teacher,
            dueDate: data.dueDate,
            description: data.description,
            status: 'Active',
            submissions: 0,
            totalStudents: 30
          };
          
          return NextResponse.json({ 
            success: true, 
            message: 'Assignment created successfully',
            data: newAssignment 
          });
        }
        break;

      case 'attendance':
        if (action === 'mark') {
          // Simulate marking attendance
          return NextResponse.json({ 
            success: true, 
            message: 'Attendance marked successfully' 
          });
        }
        break;

      case 'message':
        if (action === 'send') {
          // Simulate sending a message
          return NextResponse.json({ 
            success: true, 
            message: 'Message sent successfully' 
          });
        }
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Demo API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
