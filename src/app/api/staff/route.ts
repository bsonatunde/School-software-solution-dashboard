import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '../../../lib/database';
import { getDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

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
    // Removed ensureDbInitialized() to prevent reinserting sample data
    
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
      
      // Get payroll records from MongoDB
      const database = await getDatabase();
      const payrollCollection = database.collection('payrolls');
      const payroll = await payrollCollection.find({ 
        month: month, 
        year: year 
      }).toArray();
      
      return NextResponse.json({
        success: true,
        payroll
      });
    }

    // Default: Get staff members
    const database = await getDatabase();
    const staffCollection = database.collection('staff');
    
    // Build query
    let query: any = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (department) {
      query.department = department;
    }
    if (status) {
      query.status = status;
    }
    
    // Get total count
    const totalCount = await staffCollection.countDocuments(query);
    
    // Get staff with pagination
    const staff = await staffCollection
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    // Format salary data for all staff members
    const formattedStaff = staff.map((staffMember: any) => {
      const formattedSalary = {
        basicSalary: staffMember.basicSalary || 0,
        allowances: {
          housing: staffMember.allowances?.housing || 0,
          transport: staffMember.allowances?.transport || 0,
          meal: staffMember.allowances?.meal || 0,
          teaching: staffMember.allowances?.teaching || 0,
          medical: staffMember.allowances?.medical || 0,
          other: staffMember.allowances?.other || 0,
        },
        deductions: {
          pension: Math.round((staffMember.basicSalary || 0) * 0.08), // 8% pension
          tax: Math.round((staffMember.basicSalary || 0) * 0.075), // 7.5% tax
          nhis: Math.round((staffMember.basicSalary || 0) * 0.015), // 1.5% NHIS
        },
        grossSalary: 0,
        netSalary: 0
      };

      // Calculate gross and net salary
      const allowanceValues = Object.values(formattedSalary.allowances) as number[];
      const totalAllowances = allowanceValues.reduce((sum, amount) => sum + amount, 0);
      formattedSalary.grossSalary = formattedSalary.basicSalary + totalAllowances;

      const deductionValues = Object.values(formattedSalary.deductions) as number[];
      const totalDeductions = deductionValues.reduce((sum, amount) => sum + amount, 0);
      formattedSalary.netSalary = formattedSalary.grossSalary - totalDeductions;

      return {
        ...staffMember,
        id: staffMember._id.toString(),
        phone: staffMember.phoneNumber || staffMember.phone, // Ensure phone field is available
        salary: formattedSalary
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedStaff,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
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
    // Removed ensureDbInitialized() to prevent reinserting sample data
    
    const body = await request.json();
    const { type } = body;

    if (type === 'process-payroll') {
      const { month, year } = body;
      
      // Get all active staff from MongoDB
      const database = await getDatabase();
      const staffCollection = database.collection('staff');
      const staff = await staffCollection.find({ status: 'Active' }).limit(1000).toArray();
      
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

      // Save payroll records to MongoDB
      const payrollCollection = database.collection('payrolls');
      await payrollCollection.insertMany(payrollRecords);

      return NextResponse.json({
        success: true,
        message: 'Payroll processed successfully',
        processed: payrollRecords.length
      });
    }

    // Default: Create staff member
    console.log('Received staff data:', JSON.stringify(body, null, 2));

    // Handle different data structures - form sends nested structure
    let staffData;
    if (body.salary && body.salary.basicSalary) {
      // Form data structure
      const employmentTypeMap: {[key: string]: string} = {
        'permanent': 'Full-time',
        'contract': 'Contract', 
        'part-time': 'Part-time',
        'full-time': 'Full-time'
      };

      staffData = {
        employeeId: body.employeeId || `STAFF-${Date.now()}`,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phoneNumber: body.phone, // Map phone to phoneNumber
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : new Date(),
        gender: body.gender,
        address: body.address,
        qualification: body.qualification,
        specialization: body.specialization || body.position, // Use position as specialization if not provided
        department: body.department,
        position: body.position,
        dateOfHire: body.dateOfJoining ? new Date(body.dateOfJoining) : new Date(), // Map dateOfJoining to dateOfHire
        employmentType: employmentTypeMap[body.employmentType?.toLowerCase()] || 'Full-time',
        basicSalary: parseFloat(body.salary.basicSalary) || 0,
        allowances: {
          housing: parseFloat(body.salary.allowances?.housing) || 0,
          transport: parseFloat(body.salary.allowances?.transport) || 0, 
          meal: parseFloat(body.salary.allowances?.meal) || 0,
          teaching: parseFloat(body.salary.allowances?.teaching) || 0,
          medical: 0,
          other: 0
        },
        bankDetails: {
          bankName: body.bankDetails?.bankName || '',
          accountNumber: body.bankDetails?.accountNumber || '',
          accountName: body.bankDetails?.accountName || '',
          bvn: body.bankDetails?.bvn || ''
        },
        emergencyContact: {
          name: body.emergencyContact?.name || '',
          relationship: body.emergencyContact?.relationship || '',
          phoneNumber: body.emergencyContact?.phone || '', // Map phone to phoneNumber for emergency contact
          address: '' // Not provided in form
        },
        nationality: body.nationality || 'Nigerian',
        stateOfOrigin: body.stateOfOrigin || '',
        status: 'Active'
      };
    } else {
      // Direct API structure
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

      staffData = {
        employeeId: employeeId || `STAFF-${Date.now()}`,
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
        basicSalary: parseFloat(basicSalary) || 0,
        allowances: allowances || {},
        bankDetails: bankDetails || {},
        emergencyContact: emergencyContact || {},
        nationality,
        stateOfOrigin,
        status: 'Active'
      };
    }

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phoneNumber', 'gender', 'address', 'qualification', 'department', 'position', 'nationality'];
    const missingFields = requiredFields.filter(field => !staffData[field as keyof typeof staffData] || staffData[field as keyof typeof staffData] === '');
    
    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      console.log('Staff data:', JSON.stringify(staffData, null, 2));
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate dates
    if (isNaN(staffData.dateOfBirth.getTime())) {
      return NextResponse.json(
        { success: false, error: 'Invalid date of birth' },
        { status: 400 }
      );
    }

    if (isNaN(staffData.dateOfHire.getTime())) {
      return NextResponse.json(
        { success: false, error: 'Invalid date of hire' },
        { status: 400 }
      );
    }

    // Validate salary
    if (isNaN(staffData.basicSalary) || staffData.basicSalary < 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid basic salary' },
        { status: 400 }
      );
    }

    // Check if employee ID already exists
    console.log('Checking for existing staff with Employee ID:', staffData.employeeId);
    if (staffData.employeeId !== `STAFF-${Date.now()}`) {
      const database = await getDatabase();
      const staffCollection = database.collection('staff');
      
      const existingStaff = await staffCollection.findOne({ employeeId: staffData.employeeId });
      if (existingStaff) {
        console.log('Employee ID already exists:', existingStaff.employeeId);
        return NextResponse.json(
          { success: false, error: 'Employee ID already exists' },
          { status: 400 }
        );
      }
    }

    console.log('Creating staff with data:', JSON.stringify(staffData, null, 2));
    
    // Insert new staff member
    const database = await getDatabase();
    const staffCollection = database.collection('staff');
    const result = await staffCollection.insertOne(staffData);

    return NextResponse.json({
      success: true,
      data: {
        id: result.insertedId.toString(),
        ...staffData
      },
      message: 'Staff member created successfully'
    });

  } catch (error) {
    console.error('Error creating staff member:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to create staff member';
    if (error instanceof Error) {
      if (error.message.includes('duplicate key') || error.message.includes('E11000')) {
        if (error.message.includes('email_1')) {
          errorMessage = 'This email address is already registered. Please use a different email address.';
        } else if (error.message.includes('employeeId')) {
          errorMessage = 'This Employee ID already exists. Please use a different Employee ID.';
        } else {
          errorMessage = 'Employee ID or email already exists. Please use different values.';
        }
      } else if (error.message.includes('validation failed')) {
        errorMessage = 'Validation failed: ' + error.message;
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// PUT /api/staff - Update staff member or payroll record
export async function PUT(request: NextRequest) {
  try {
    // Removed ensureDbInitialized() to prevent reinserting sample data
    
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
      // Update payroll record in MongoDB
      const database = await getDatabase();
      const payrollCollection = database.collection('payrolls');
      
      try {
        const result = await payrollCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { ...body, updatedAt: new Date().toISOString() } }
        );
        
        if (result.matchedCount === 0) {
          return NextResponse.json(
            { success: false, error: 'Payroll record not found' },
            { status: 404 }
          );
        }
        
        // Get updated record
        const updatedPayroll = await payrollCollection.findOne({ _id: new ObjectId(id) });
        
        return NextResponse.json({
          success: true,
          data: updatedPayroll,
          message: 'Payroll record updated successfully'
        });
      } catch (error) {
        return NextResponse.json(
          { success: false, error: 'Invalid payroll ID format' },
          { status: 400 }
        );
      }
    }

    // Default: Update staff member in MongoDB
    const database = await getDatabase();
    const staffCollection = database.collection('staff');
    
    try {
      const result = await staffCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...body, updatedAt: new Date().toISOString() } }
      );
      
      if (result.matchedCount === 0) {
        return NextResponse.json(
          { success: false, error: 'Staff member not found' },
          { status: 404 }
        );
      }
      
      // Get updated record
      const updatedStaff = await staffCollection.findOne({ _id: new ObjectId(id) });
      
      return NextResponse.json({
        success: true,
        data: updatedStaff,
        message: 'Staff member updated successfully'
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid staff ID format' },
        { status: 400 }
      );
    }

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
    // Removed ensureDbInitialized() to prevent reinserting sample data
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Staff ID is required' },
        { status: 400 }
      );
    }

    // Delete staff member from MongoDB
    const database = await getDatabase();
    const staffCollection = database.collection('staff');
    
    try {
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
      return NextResponse.json(
        { success: false, error: 'Invalid staff ID format' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error deleting staff member:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete staff member' },
      { status: 500 }
    );
  }
}
