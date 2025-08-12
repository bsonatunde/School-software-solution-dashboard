import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDatabase();
    
    // Get counts from each collection
    const [
      totalStudents,
      totalTeachers,
      totalStaff,
      totalClasses,
      totalSubjects,
      totalResults,
      totalFees,
      totalLeaveRequests,
      totalAttendanceRecords
    ] = await Promise.all([
      db.collection('students').countDocuments(),
      db.collection('teachers').countDocuments(),
      db.collection('staff').countDocuments(),
      db.collection('classes').countDocuments(),
      db.collection('subjects').countDocuments(),
      db.collection('results').countDocuments(),
      db.collection('fees').countDocuments(),
      db.collection('leave').countDocuments(),
      db.collection('attendance').countDocuments()
    ]);

    // Get some additional stats if there's data
    let additionalStats = {
      maleStudents: 0,
      femaleStudents: 0,
      activeClasses: 0,
      pendingFees: 0,
      attendanceRate: 0,
      revenue: 0
    };

    if (totalStudents > 0) {
      // Get student gender distribution
      const studentStats = await db.collection('students').aggregate([
        {
          $group: {
            _id: '$gender',
            count: { $sum: 1 }
          }
        }
      ]).toArray();

      studentStats.forEach(stat => {
        if (stat._id === 'Male') additionalStats.maleStudents = stat.count;
        if (stat._id === 'Female') additionalStats.femaleStudents = stat.count;
      });
    }

    if (totalClasses > 0) {
      // Get active classes count
      const activeClassesCount = await db.collection('classes').countDocuments({ 
        status: { $ne: 'Inactive' } 
      });
      additionalStats.activeClasses = activeClassesCount;
    }

    if (totalFees > 0) {
      // Get pending fees
      const pendingFeesResult = await db.collection('fees').aggregate([
        { $match: { status: 'Pending' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).toArray();
      
      additionalStats.pendingFees = pendingFeesResult.length > 0 ? pendingFeesResult[0].total : 0;

      // Get total revenue
      const revenueResult = await db.collection('fees').aggregate([
        { $match: { status: 'Paid' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).toArray();
      
      additionalStats.revenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
    }

    const stats = {
      totalStudents,
      totalTeachers,
      totalStaff,
      totalClasses: additionalStats.activeClasses || totalClasses,
      totalSubjects,
      totalResults,
      totalAttendanceRecords,
      totalLeaveRequests,
      maleStudents: additionalStats.maleStudents,
      femaleStudents: additionalStats.femaleStudents,
      pendingFees: additionalStats.pendingFees,
      revenue: additionalStats.revenue,
      attendanceRate: 0, // Will be calculated when there's attendance data
      
      // Recent activities - will be empty for clean database
      recentActivities: [],
      
      // Quick summary for empty database
      isEmpty: totalStudents === 0 && totalTeachers === 0 && totalStaff === 0 && totalClasses === 0,
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    
    // Return default empty stats if there's an error
    return NextResponse.json({
      success: true,
      data: {
        totalStudents: 0,
        totalTeachers: 0,
        totalStaff: 0,
        totalClasses: 0,
        totalSubjects: 0,
        totalResults: 0,
        totalAttendanceRecords: 0,
        totalLeaveRequests: 0,
        maleStudents: 0,
        femaleStudents: 0,
        pendingFees: 0,
        revenue: 0,
        attendanceRate: 0,
        recentActivities: [],
        isEmpty: true,
        lastUpdated: new Date().toISOString(),
        error: 'Failed to fetch some statistics'
      }
    });
  }
}
