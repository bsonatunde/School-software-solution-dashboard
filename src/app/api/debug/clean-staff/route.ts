import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function POST() {
  try {
    const db = await getDatabase();
    
    // Clean both staff collections - 'staff' and 'staffs'
    const staffCollection = db.collection('staff');
    const staffsCollection = db.collection('staffs');
    
    // Get count before deletion
    const beforeCountStaff = await staffCollection.countDocuments();
    const beforeCountStaffs = await staffsCollection.countDocuments();
    console.log(`Staff count before deletion: ${beforeCountStaff}`);
    console.log(`Staffs count before deletion: ${beforeCountStaffs}`);
    
    // Delete all documents from both collections
    const resultStaff = await staffCollection.deleteMany({});
    const resultStaffs = await staffsCollection.deleteMany({});
    console.log(`Deleted ${resultStaff.deletedCount} staff documents`);
    console.log(`Deleted ${resultStaffs.deletedCount} staffs documents`);
    
    // Get count after deletion
    const afterCountStaff = await staffCollection.countDocuments();
    const afterCountStaffs = await staffsCollection.countDocuments();
    console.log(`Staff count after deletion: ${afterCountStaff}`);
    console.log(`Staffs count after deletion: ${afterCountStaffs}`);

    return NextResponse.json({
      success: true,
      message: `Cleaned staff data from both collections`,
      staff: {
        beforeCount: beforeCountStaff,
        afterCount: afterCountStaff,
        deletedCount: resultStaff.deletedCount
      },
      staffs: {
        beforeCount: beforeCountStaffs,
        afterCount: afterCountStaffs,
        deletedCount: resultStaffs.deletedCount
      },
      totalDeleted: resultStaff.deletedCount + resultStaffs.deletedCount
    });

  } catch (error) {
    console.error('Error cleaning staff:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to clean staff data'
    }, { status: 500 });
  }
}
