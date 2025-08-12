import { NextRequest, NextResponse } from 'next/server';
import { StaffDB, PayrollDB, initializeDatabase } from '../../../lib/database-new';

// Initialize database on first request
let dbInitialized = false;

async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initializeDatabase();
    dbInitialized = true;
  }
}

// GET /api/staff - Get staff members or payroll records
export async function GET(request: NextRequest) {
  try {
    await ensureDbInitialized();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const department = searchParams.get('department') || '';
    const status = searchParams.get('status') || '';

    if (type === 'payroll') {
      const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1).toString());
      const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
      
      const payroll = await PayrollDB.findByMonth(month, year);
      
      return NextResponse.json({
        success: true,
        payroll
      });
    }

    // Default: Get staff members
    const result = await StaffDB.findAll({
      page,
      limit,
      search,
      department,
      status
    });

    return NextResponse.json({
      success: true,
      data: result.staff,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch staff members' },
      { status: 500 }
    );
  }
}

// POST /api/staff - Create staff member or process payroll
export async function POST(request: NextRequest) {
  try {
    await ensureDbInitialized();
    
    const body = await request.json();
    const { type } = body;

    if (type === 'process-payroll') {
      const { month, year } = body;
      
      // Get all active staff
      const { staff } = await StaffDB.findAll({ status: 'Active', limit: 1000 });
      
      if (staff.length === 0) {
        return NextResponse.json({
          success: false,
          error: 'No active staff members found'
        }, { status: 400 });
      }

      // Process payroll for each staff member
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
      
      const payrollRecords = staff.map(member => {
        const basicSalary = member.basicSalary || 100000;
        const allowances = member.allowances || {};
        
        // Calculate allowances
        const totalAllowances = 
          (allowances.housing || 0) +
          (allowances.transport || 0) +
          (allowances.meal || 0) +
          (allowances.teaching || 0) +
          (allowances.medical || 0) +
          (allowances.other || 0);

        const grossSalary = basicSalary + totalAllowances;
        
        // Calculate deductions
        const pensionDeduction = Math.round(grossSalary * 0.08); // 8% pension
        const nhisDeduction = Math.round(grossSalary * 0.0175); // 1.75% NHIS
        const taxDeduction = Math.round(grossSalary * 0.05); // Simplified 5% tax
        
        const totalDeductions = pensionDeduction + nhisDeduction + taxDeduction;
        const netSalary = grossSalary - totalDeductions;

        return {
          employeeId: member.employeeId,
          employeeName: `${member.firstName} ${member.lastName}`,
          department: member.department,
          position: member.position,
          month: monthNames[month - 1],
          year: year,
          workingDays: 22, // Standard working days
          daysWorked: 22, // Assume full attendance for now
          basicSalary: basicSalary,
          allowances: {
            housing: allowances.housing || 0,
            transport: allowances.transport || 0,
            meal: allowances.meal || 0,
            teaching: allowances.teaching || 0,
            overtime: 0,
            bonus: 0
          },
          deductions: {
            pension: pensionDeduction,
            tax: taxDeduction,
            nhis: nhisDeduction,
            absence: 0,
            loan: 0,
            other: 0
          },
          grossSalary: grossSalary,
          totalDeductions: totalDeductions,
          netSalary: netSalary,
          status: 'draft',
          processedDate: new Date().toISOString().split('T')[0],
          processedBy: 'System Admin'
        };
      });

      // Save payroll records to database
      await PayrollDB.bulkCreate(payrollRecords);

      return NextResponse.json({
        success: true,
        message: 'Payroll processed successfully',
        processed: payrollRecords.length
      });
    }

    // Default: Create staff member
    const {
      employeeId,
      firstName,
      lastName,
      email,
      phoneNumber,
      dateOfBirth,
      gender,
      address,
      qualification,
      specialization,
      department,
      position,
      dateOfHire,
      employmentType,
      basicSalary,
      allowances,
      bankDetails,
      emergencyContact,
      nationality,
      stateOfOrigin
    } = body;

    // Check if employee ID already exists
    const existingStaff = await StaffDB.findByEmployeeId(employeeId);
    if (existingStaff) {
      return NextResponse.json(
        { success: false, error: 'Employee ID already exists' },
        { status: 400 }
      );
    }

    const newStaff = await StaffDB.create({
      employeeId,
      firstName,
      lastName,
      email,
      phoneNumber,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      address,
      qualification,
      specialization,
      department,
      position,
      dateOfHire: new Date(dateOfHire),
      employmentType: employmentType || 'Full-time',
      basicSalary: parseFloat(basicSalary),
      allowances: allowances || {},
      bankDetails: bankDetails || {},
      emergencyContact: emergencyContact || {},
      nationality,
      stateOfOrigin,
      status: 'Active'
    });

    return NextResponse.json({
      success: true,
      data: newStaff,
      message: 'Staff member created successfully'
    });

  } catch (error) {
    console.error('Error creating staff member:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create staff member' },
      { status: 500 }
    );
  }
}

// PUT /api/staff - Update staff member or payroll record
export async function PUT(request: NextRequest) {
  try {
    await ensureDbInitialized();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Staff ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();

    if (type === 'payroll') {
      // Update payroll record
      const updatedPayroll = await PayrollDB.update(id, body);
      
      if (!updatedPayroll) {
        return NextResponse.json(
          { success: false, error: 'Payroll record not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: updatedPayroll,
        message: 'Payroll record updated successfully'
      });
    }

    // Default: Update staff member
    const updatedStaff = await StaffDB.update(id, body);
    
    if (!updatedStaff) {
      return NextResponse.json(
        { success: false, error: 'Staff member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedStaff,
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

// DELETE /api/staff - Delete staff member
export async function DELETE(request: NextRequest) {
  try {
    await ensureDbInitialized();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Staff ID is required' },
        { status: 400 }
      );
    }

    const deleted = await StaffDB.delete(id);
    
    if (!deleted) {
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
