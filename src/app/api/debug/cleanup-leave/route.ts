import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase();
    const leaveCollection = db.collection('leaves');

    // Find all leave records
    const allLeaves = await leaveCollection.find({}).toArray();
    console.log('Total leave records found:', allLeaves.length);

    const corruptLeaves = [];
    const validLeaves = [];

    // Check each leave record for data integrity
    for (const leave of allLeaves) {
      const issues = [];

      // Check required fields
      if (!leave.employeeId) issues.push('Missing employeeId');
      if (!leave.staffId) issues.push('Missing staffId');
      if (!leave.type) issues.push('Missing type');
      if (!leave.status) issues.push('Missing status');
      if (!leave.startDate) issues.push('Missing startDate');
      if (!leave.endDate) issues.push('Missing endDate');
      if (!leave.reason) issues.push('Missing reason');
      if (!leave.appliedDate) issues.push('Missing appliedDate');

      // Check status values
      if (leave.status && !['pending', 'approved', 'rejected'].includes(leave.status)) {
        issues.push(`Invalid status: ${leave.status}`);
      }

      // Check date formats
      if (leave.startDate && isNaN(new Date(leave.startDate).getTime())) {
        issues.push('Invalid startDate format');
      }
      if (leave.endDate && isNaN(new Date(leave.endDate).getTime())) {
        issues.push('Invalid endDate format');
      }

      // Check if staffId is valid ObjectId format
      if (leave.staffId && !ObjectId.isValid(leave.staffId)) {
        issues.push('Invalid staffId format');
      }

      if (issues.length > 0) {
        corruptLeaves.push({
          id: leave._id.toString(),
          issues,
          data: leave
        });
      } else {
        validLeaves.push(leave);
      }
    }

    console.log('Data integrity check results:');
    console.log('- Valid leaves:', validLeaves.length);
    console.log('- Corrupt leaves:', corruptLeaves.length);

    if (corruptLeaves.length > 0) {
      console.log('Corrupt leave details:', corruptLeaves);
    }

    // Optionally remove corrupt records (be careful with this)
    const { searchParams } = new URL(request.url);
    const removeCorrupt = searchParams.get('remove') === 'true';

    let removedCount = 0;
    if (removeCorrupt && corruptLeaves.length > 0) {
      const idsToRemove = corruptLeaves.map(cl => new ObjectId(cl.id));
      const deleteResult = await leaveCollection.deleteMany({
        _id: { $in: idsToRemove }
      });
      removedCount = deleteResult.deletedCount;
      console.log('Removed corrupt records:', removedCount);
    }

    return NextResponse.json({
      success: true,
      summary: {
        totalRecords: allLeaves.length,
        validRecords: validLeaves.length,
        corruptRecords: corruptLeaves.length,
        removedRecords: removedCount
      },
      corruptRecords: corruptLeaves.map(cl => ({
        id: cl.id,
        issues: cl.issues,
        employeeId: cl.data.employeeId,
        staffId: cl.data.staffId,
        type: cl.data.type,
        status: cl.data.status
      }))
    });

  } catch (error) {
    console.error('Data cleanup error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
