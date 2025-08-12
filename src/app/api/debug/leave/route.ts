import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const db = await getDatabase();
    const leaveCollection = db.collection('leaves');

    if (id) {
      // Check specific ID
      console.log('Debug: Checking specific ID:', id);
      console.log('Debug: Is valid ObjectId?', ObjectId.isValid(id));
      
      if (!ObjectId.isValid(id)) {
        return NextResponse.json({
          success: false,
          error: 'Invalid ObjectId format',
          providedId: id
        });
      }

      const leave = await leaveCollection.findOne({ _id: new ObjectId(id) });
      console.log('Debug: Found leave:', leave ? 'YES' : 'NO');

      return NextResponse.json({
        success: true,
        found: !!leave,
        leave: leave ? {
          ...leave,
          id: leave._id.toString()
        } : null
      });
    }

    // Get all leaves with their IDs
    const leaves = await leaveCollection.find({}).toArray();
    
    const leaveInfo = leaves.map(leave => ({
      id: leave._id.toString(),
      employeeId: leave.employeeId,
      staffId: leave.staffId,
      status: leave.status,
      appliedDate: leave.appliedDate,
      type: leave.type,
      days: leave.days
    }));

    return NextResponse.json({
      success: true,
      totalLeaves: leaves.length,
      leaves: leaveInfo
    });

  } catch (error) {
    console.error('Debug leave error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
