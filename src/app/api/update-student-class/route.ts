import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Student } from '@/lib/models';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { studentId, classId } = await request.json();
    
    if (!studentId || !classId) {
      return NextResponse.json({
        success: false,
        error: 'Student ID and Class ID are required'
      }, { status: 400 });
    }

    // Update student's classId
    const student = await Student.findOneAndUpdate(
      { admissionNumber: studentId },
      { classId },
      { new: true }
    );

    if (!student) {
      return NextResponse.json({
        success: false,
        error: 'Student not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: student,
      message: 'Student class updated successfully'
    });

  } catch (error: any) {
    console.error('Error updating student class:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to update student class'
    }, { status: 500 });
  }
}
