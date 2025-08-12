import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

interface LeaveApplication {
  employeeId: string;
  staffId: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  remarks?: string;
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action, approvedBy, remarks } = body;

    console.log('PUT /api/leave - Requested ID:', id, 'Action:', action);

    // Validate required fields
    if (!id || !action || !approvedBy) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields (id, action, approvedBy)'
      }, { status: 400 });
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({
        success: false,
        error: 'Action must be either "approve" or "reject"'
      }, { status: 400 });
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        error: `Invalid ID format: ${id}. Expected MongoDB ObjectId format.`
      }, { status: 400 });
    }

    const db = await getDatabase();
    const leaveCollection = db.collection('leaves');

    // First, let's see what IDs are actually available
    const allLeaves = await leaveCollection.find({}).toArray();
    console.log('PUT /api/leave - All available IDs in database:', allLeaves.map(l => l._id.toString()));

    // Find the leave request
    const leaveRequest = await leaveCollection.findOne({ _id: new ObjectId(id) });
    
    if (!leaveRequest) {
      console.log('PUT /api/leave - Leave not found with ID:', id);
      return NextResponse.json({
        success: false,
        error: `Leave request not found with ID: ${id}`,
        errorCode: 'LEAVE_NOT_FOUND',
        availableIds: allLeaves.map(l => l._id.toString())
      }, { status: 404 });
    }

    // Update leave request status
    const updateData = {
      status: action === 'approve' ? 'approved' : 'rejected',
      approvedBy,
      approvedDate: new Date().toISOString(),
      remarks: remarks || ''
    };

    const result = await leaveCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Failed to update leave request'
      }, { status: 500 });
    }

    // If approved, optionally update staff leave balance
    if (action === 'approve') {
      const staffCollection = db.collection('staff');
      await staffCollection.updateOne(
        { _id: new ObjectId(leaveRequest.staffId) },
        { $inc: { leaveBalance: -leaveRequest.days } }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Leave request ${action}d successfully`,
      data: {
        id: leaveRequest._id.toString(),
        ...leaveRequest,
        ...updateData
      }
    });

  } catch (error) {
    console.error('Leave approval error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { employeeId, staffId, type, startDate, endDate, reason } = body;

    // Validate required fields
    if (!employeeId || !staffId || !type || !startDate || !endDate || !reason) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    // Calculate number of days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // Include both start and end dates

    if (days <= 0) {
      return NextResponse.json({
        success: false,
        error: 'End date must be after start date'
      }, { status: 400 });
    }

    const db = await getDatabase();
    const leaveCollection = db.collection('leaves');

    // Create leave application
    const leaveApplication: LeaveApplication = {
      employeeId,
      staffId,
      type,
      startDate,
      endDate,
      days,
      reason,
      status: 'pending',
      appliedDate: new Date().toISOString(),
    };

    const result = await leaveCollection.insertOne(leaveApplication);

    if (result.insertedId) {
      // Update staff leave balance (optional - you might want to do this only when approved)
      const staffCollection = db.collection('staff');
      const staff = await staffCollection.findOne({ _id: new ObjectId(staffId) });
      
      if (staff && staff.leaveBalance >= days) {
        // Optionally deduct days immediately (pending approval)
        // await staffCollection.updateOne(
        //   { _id: new ObjectId(staffId) },
        //   { $inc: { leaveBalance: -days } }
        // );
      }

      return NextResponse.json({
        success: true,
        message: 'Leave application submitted successfully',
        data: {
          id: result.insertedId,
          ...leaveApplication
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to create leave application'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Leave application error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const staffId = searchParams.get('staffId');

    const db = await getDatabase();
    const leaveCollection = db.collection('leaves');

    let query = {};
    if (employeeId) {
      query = { employeeId };
    } else if (staffId) {
      query = { staffId };
    }

    const leaves = await leaveCollection
      .find(query)
      .sort({ appliedDate: -1 })
      .limit(20)
      .toArray();

    console.log('GET /api/leave - Available leave IDs:', leaves.map(l => l._id.toString()));

    const mappedData = leaves.map((leave: any) => ({
      id: leave._id.toString(),
      employeeId: leave.employeeId,
      staffId: leave.staffId,
      type: leave.type,
      startDate: leave.startDate,
      endDate: leave.endDate,
      days: leave.days,
      reason: leave.reason,
      status: leave.status,
      appliedDate: leave.appliedDate,
      approvedBy: leave.approvedBy,
      approvedDate: leave.approvedDate,
      remarks: leave.remarks
    }));

    console.log('GET /api/leave - Returning mapped IDs:', mappedData.map(l => l.id));

    return NextResponse.json({
      success: true,
      data: mappedData
    });

  } catch (error) {
    console.error('Get leaves error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
