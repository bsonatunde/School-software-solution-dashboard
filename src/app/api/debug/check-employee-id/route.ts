import { NextRequest, NextResponse } from 'next/server';
import { employeeIdManager } from '@/lib/employee-id';

export async function POST(request: NextRequest) {
  try {
    const { employeeId } = await request.json();

    if (!employeeId) {
      return NextResponse.json(
        { error: 'Employee ID is required' },
        { status: 400 }
      );
    }

    // Validate format
    const isValidFormat = employeeIdManager.validateEmployeeId(employeeId);
    
    // Check if unique
    const isUnique = await employeeIdManager.isEmployeeIdUnique(employeeId);
    
    // Get employee if exists
    const existingEmployee = await employeeIdManager.getEmployeeById(employeeId);

    return NextResponse.json({
      employeeId,
      isValid: isValidFormat,
      isUnique,
      exists: !!existingEmployee,
      employee: existingEmployee ? {
        name: `${existingEmployee.firstName} ${existingEmployee.lastName}`,
        type: existingEmployee.type,
        email: existingEmployee.email
      } : null
    });

  } catch (error) {
    console.error('Error checking employee ID:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Employee ID check endpoint',
    usage: 'POST with { "employeeId": "PSS/TCH/001" }'
  });
}
