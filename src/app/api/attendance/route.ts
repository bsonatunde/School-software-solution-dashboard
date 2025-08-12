import { NextRequest, NextResponse } from 'next/server';

const mockAttendance = [
  {
    id: '1',
    studentId: '1',
    studentName: 'Chioma Okoro',
    class: 'JSS 1A',
    date: '2024-01-15',
    status: 'Present',
    timeIn: '07:45',
    timeOut: '14:30',
    remarks: ''
  },
  {
    id: '2',
    studentId: '2',
    studentName: 'Kemi Adebayo',
    class: 'JSS 2A',
    date: '2024-01-15',
    status: 'Present',
    timeIn: '07:50',
    timeOut: '14:30',
    remarks: ''
  },
  {
    id: '3',
    studentId: '3',
    studentName: 'Ibrahim Hassan',
    class: 'SS 1A',
    date: '2024-01-15',
    status: 'Absent',
    timeIn: null,
    timeOut: null,
    remarks: 'Sick'
  },
  {
    id: '4',
    studentId: '1',
    studentName: 'Chioma Okoro',
    class: 'JSS 1A',
    date: '2024-01-16',
    status: 'Late',
    timeIn: '08:15',
    timeOut: '14:30',
    remarks: 'Traffic delay'
  }
];

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const date = url.searchParams.get('date');
    const studentId = url.searchParams.get('studentId');
    const classId = url.searchParams.get('class');
    
    let attendance = mockAttendance;
    
    if (date) {
      attendance = attendance.filter(record => record.date === date);
    }
    
    if (studentId) {
      attendance = attendance.filter(record => record.studentId === studentId);
    }
    
    if (classId) {
      attendance = attendance.filter(record => record.class === classId);
    }
    
    return NextResponse.json({
      success: true,
      data: attendance,
      message: 'Attendance records fetched successfully'
    });
  } catch (error) {
    console.error('Get attendance error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch attendance records'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, date, status, timeIn, timeOut, remarks } = body;
    
    // Check if attendance record already exists
    const existingRecord = mockAttendance.find(
      record => record.studentId === studentId && record.date === date
    );
    
    if (existingRecord) {
      // Update existing record
      existingRecord.status = status;
      existingRecord.timeIn = timeIn;
      existingRecord.timeOut = timeOut;
      existingRecord.remarks = remarks || '';
      
      return NextResponse.json({
        success: true,
        data: existingRecord,
        message: 'Attendance updated successfully'
      });
    } else {
      // Create new attendance record
      const newRecord = {
        id: String(mockAttendance.length + 1),
        studentId,
        studentName: 'Student Name', // In real app, fetch from database
        class: 'Class Name', // In real app, fetch from database
        date,
        status,
        timeIn,
        timeOut,
        remarks: remarks || ''
      };
      
      mockAttendance.push(newRecord);
      
      return NextResponse.json({
        success: true,
        data: newRecord,
        message: 'Attendance recorded successfully'
      });
    }
  } catch (error) {
    console.error('Record attendance error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to record attendance'
    }, { status: 500 });
  }
}
