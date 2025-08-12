import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '../../../../lib/database';
import { getDatabase } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// Initialize database on first request
let dbInitialized = false;

async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initializeDatabase();
    dbInitialized = true;
  }
}

// GET /api/staff/[id] - Get individual staff member
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Removed ensureDbInitialized() to prevent reinserting sample data
    const { id } = await params;
    
    // Connect to database and get staff collection
    const database = await getDatabase();
    const staffCollection = database.collection('staff');
    
    // Find staff by ObjectId
    const staff = await staffCollection.findOne({ _id: new ObjectId(id) });
    
    if (!staff) {
      return NextResponse.json(
        { success: false, error: 'Staff member not found' },
        { status: 404 }
      );
    }

    // Format salary data for frontend compatibility
    const formattedStaff = {
      ...staff,
      id: staff._id.toString(),
      phone: staff.phoneNumber || staff.phone, // Ensure phone field is available
      leaveBalance: staff.leaveBalance || 21, // Default to 21 days if not set
      salary: {
        basicSalary: staff.basicSalary || 0,
        allowances: {
          housing: staff.allowances?.housing || 0,
          transport: staff.allowances?.transport || 0,
          meal: staff.allowances?.meal || 0,
          teaching: staff.allowances?.teaching || 0,
          medical: staff.allowances?.medical || 0,
          other: staff.allowances?.other || 0,
        },
        deductions: {
          pension: Math.round((staff.basicSalary || 0) * 0.08), // 8% pension
          tax: Math.round((staff.basicSalary || 0) * 0.075), // 7.5% tax (simplified)
          nhis: Math.round((staff.basicSalary || 0) * 0.015), // 1.5% NHIS
        },
        grossSalary: 0, // Will be calculated below
        netSalary: 0 // Will be calculated below
      }
    };

    // Calculate gross salary
    const allowanceValues = Object.values(formattedStaff.salary.allowances) as number[];
    const totalAllowances = allowanceValues.reduce((sum: number, amount: number) => sum + amount, 0);
    formattedStaff.salary.grossSalary = (formattedStaff.salary.basicSalary || 0) + totalAllowances;

    // Calculate net salary
    const deductionValues = Object.values(formattedStaff.salary.deductions) as number[];
    const totalDeductions = deductionValues.reduce((sum: number, amount: number) => sum + amount, 0);
    formattedStaff.salary.netSalary = formattedStaff.salary.grossSalary - totalDeductions;

    return NextResponse.json({
      success: true,
      data: formattedStaff
    });

  } catch (error) {
    console.error('Error fetching staff member:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch staff member' },
      { status: 500 }
    );
  }
}

// PUT /api/staff/[id] - Update staff member
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Removed ensureDbInitialized() to prevent reinserting sample data
    const { id } = await params;
    const body = await request.json();
    
    // Connect to database and update staff
    const database = await getDatabase();
    const staffCollection = database.collection('staff');
    
    const result = await staffCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: body }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Staff member not found' },
        { status: 404 }
      );
    }

    // Get the updated staff member
    const updatedStaff = await staffCollection.findOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      success: true,
      data: {
        ...updatedStaff,
        id: updatedStaff?._id.toString()
      },
      message: 'Staff member updated successfully'
    });

  } catch (error) {
    console.error('Error updating staff member:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update staff member' },
      { status: 500 }
    );
  }
}

// DELETE /api/staff/[id] - Delete staff member
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Removed ensureDbInitialized() to prevent reinserting sample data
    const { id } = await params;
    
    // Connect to database and delete staff
    const database = await getDatabase();
    const staffCollection = database.collection('staff');
    
    const result = await staffCollection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Staff member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Staff member deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting staff member:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete staff member' },
      { status: 500 }
    );
  }
}
