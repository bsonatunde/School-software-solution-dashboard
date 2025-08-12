import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Timetable, Student, Class } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');
    const className = searchParams.get('className');
    const studentId = searchParams.get('studentId');
    const day = searchParams.get('day');
    const term = searchParams.get('term');
    const academicYear = searchParams.get('academicYear');

    let query: any = { status: 'Active' };

    // If studentId is provided, get the student's class
    if (studentId) {
      let student;
      
      // Check if studentId is a valid ObjectId (24 character hex string)
      if (studentId.match(/^[0-9a-fA-F]{24}$/)) {
        student = await Student.findOne({ _id: studentId });
      } else {
        // Try to find by studentId first, then admissionNumber
        student = await Student.findOne({ studentId: studentId });
        if (!student) {
          student = await Student.findOne({ admissionNumber: studentId });
        }
      }
      
      if (!student) {
        return NextResponse.json({
          success: false,
          error: 'Student not found'
        }, { status: 404 });
      }
      
      query.classId = student.classId;
    } else if (classId) {
      query.classId = classId;
    } else if (className) {
      query.className = className;
    }

    if (day) {
      query.dayOfWeek = day;
    }

    if (term) {
      query.term = term;
    }

    if (academicYear) {
      query.academicYear = academicYear;
    }

    const timetables = await Timetable.find(query)
      .sort({ dayOfWeek: 1, 'periods.periodNumber': 1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: timetables
    });

  } catch (error: any) {
    console.error('Error fetching timetables:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch timetables'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const {
      classId,
      className,
      term,
      academicYear,
      dayOfWeek,
      periods,
      createdBy
    } = body;

    // Validate required fields
    if (!classId || !className || !term || !academicYear || !dayOfWeek || !periods || !createdBy) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    // Check if timetable already exists for this class and day
    const existingTimetable = await Timetable.findOne({
      classId,
      dayOfWeek,
      term,
      academicYear,
      status: 'Active'
    });

    if (existingTimetable) {
      return NextResponse.json({
        success: false,
        error: 'Timetable already exists for this class and day'
      }, { status: 409 });
    }

    const timetable = new Timetable({
      classId,
      className,
      term,
      academicYear,
      dayOfWeek,
      periods,
      createdBy,
      status: 'Active'
    });

    await timetable.save();

    return NextResponse.json({
      success: true,
      data: timetable,
      message: 'Timetable created successfully'
    });

  } catch (error: any) {
    console.error('Error creating timetable:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to create timetable'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Timetable ID is required'
      }, { status: 400 });
    }

    const timetable = await Timetable.findByIdAndUpdate(
      id,
      { ...body, lastModifiedBy: body.lastModifiedBy },
      { new: true }
    );

    if (!timetable) {
      return NextResponse.json({
        success: false,
        error: 'Timetable not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: timetable,
      message: 'Timetable updated successfully'
    });

  } catch (error: any) {
    console.error('Error updating timetable:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to update timetable'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Timetable ID is required'
      }, { status: 400 });
    }

    const timetable = await Timetable.findByIdAndUpdate(
      id,
      { status: 'Archived' },
      { new: true }
    );

    if (!timetable) {
      return NextResponse.json({
        success: false,
        error: 'Timetable not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: timetable,
      message: 'Timetable deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting timetable:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to delete timetable'
    }, { status: 500 });
  }
}
