import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());

    const db = await getDatabase();
    const staffCollection = db.collection('staff');
    const leaveCollection = db.collection('leaves');

    // Get all staff members
    const staffMembers = await staffCollection.find({}).toArray();
    
    // Get all leave requests for the specified year
    const leaves = await leaveCollection.find({}).toArray();

    // Calculate leave balances for each staff member
    const balances = staffMembers.map((staff: any) => {
      // Filter leaves for this staff member and year
      const staffLeaves = leaves.filter((leave: any) => {
        const leaveYear = new Date(leave.startDate).getFullYear();
        return leave.staffId === staff._id.toString() && leaveYear === year;
      });

      // Separate leaves by status
      const approvedLeaves = staffLeaves.filter((l: any) => l.status === 'approved');
      const rejectedLeaves = staffLeaves.filter((l: any) => l.status === 'rejected');
      const pendingLeaves = staffLeaves.filter((l: any) => l.status === 'pending');

      // Calculate totals
      const usedLeave = approvedLeaves.reduce((sum: number, leave: any) => sum + (leave.days || 0), 0);
      const pendingLeave = pendingLeaves.reduce((sum: number, leave: any) => sum + (leave.days || 0), 0);
      const totalLeaveEntitlement = staff.leaveBalance || 21; // Default annual leave entitlement
      const remainingLeave = Math.max(0, totalLeaveEntitlement - usedLeave - pendingLeave);

      return {
        staffId: staff._id.toString(),
        staffName: `${staff.firstName} ${staff.lastName}`,
        department: staff.department || 'N/A',
        employeeId: staff.employeeId || staff._id.toString(),
        totalLeaveEntitlement,
        usedLeave,
        pendingLeave,
        remainingLeave,
        year,
        leaveHistory: {
          approved: approvedLeaves.length,
          rejected: rejectedLeaves.length,
          pending: pendingLeaves.length,
        },
        leaveBreakdown: {
          approvedDays: usedLeave,
          pendingDays: pendingLeave,
          rejectedDays: rejectedLeaves.reduce((sum: number, leave: any) => sum + (leave.days || 0), 0)
        }
      };
    });

    // Sort by remaining leave (lowest first to highlight staff with low balances)
    balances.sort((a, b) => a.remainingLeave - b.remainingLeave);

    // Calculate summary statistics
    const summary = {
      totalStaff: balances.length,
      staffWithLowBalance: balances.filter(b => b.remainingLeave <= 3).length,
      staffWithExceededQuota: balances.filter(b => b.remainingLeave < 0).length,
      totalLeaveUsed: balances.reduce((sum, b) => sum + b.usedLeave, 0),
      totalPendingLeave: balances.reduce((sum, b) => sum + b.pendingLeave, 0),
      averageRemainingLeave: Math.round(balances.reduce((sum, b) => sum + b.remainingLeave, 0) / balances.length),
      year
    };

    return NextResponse.json({
      success: true,
      data: balances,
      summary
    });

  } catch (error) {
    console.error('Leave balances error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
