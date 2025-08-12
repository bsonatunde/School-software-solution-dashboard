import { NextRequest, NextResponse } from 'next/server';

// Mock data - in a real app, this would be shared or from a database
const mockTeachers = [
  {
    id: '1',
    employeeId: 'PSS/TCH/001',
    firstName: 'Folake',
    lastName: 'Adebayo',
    email: 'f.adebayo@paceyschool.com',
    phoneNumber: '+234-803-123-4567',
    dateOfBirth: '1985-03-15',
    gender: 'Female',
    address: '123 Victoria Island, Lagos',
    qualification: 'B.Ed Mathematics',
    specialization: 'Mathematics',
    dateOfHire: '2020-09-01',
    salary: 120000,
    status: 'Active',
    emergencyContact: '+234-805-987-6543',
    nationality: 'Nigerian',
    stateOfOrigin: 'Lagos',
    subjects: ['Mathematics', 'Further Mathematics'],
    classes: ['JSS 1A', 'JSS 2A']
  },
  {
    id: '2',
    employeeId: 'PSS/TCH/002',
    firstName: 'Emeka',
    lastName: 'Okonkwo',
    email: 'e.okonkwo@paceyschool.com',
    phoneNumber: '+234-807-456-7890',
    dateOfBirth: '1988-07-22',
    gender: 'Male',
    address: '456 Ikeja, Lagos',
    qualification: 'B.Sc Physics, PGDE',
    specialization: 'Physics',
    dateOfHire: '2021-01-15',
    salary: 115000,
    status: 'Active',
    emergencyContact: '+234-809-234-5678',
    nationality: 'Nigerian',
    stateOfOrigin: 'Anambra',
    subjects: ['Physics', 'Chemistry'],
    classes: ['JSS 2B', 'SS 1A']
  },
  {
    id: '3',
    employeeId: 'PSS/TCH/003',
    firstName: 'Amina',
    lastName: 'Ibrahim',
    email: 'a.ibrahim@paceyschool.com',
    phoneNumber: '+234-806-111-2222',
    dateOfBirth: '1990-11-08',
    gender: 'Female',
    address: '789 Surulere, Lagos',
    qualification: 'B.A English Language',
    specialization: 'English Language',
    dateOfHire: '2022-03-01',
    salary: 110000,
    status: 'Active',
    emergencyContact: '+234-808-333-4444',
    nationality: 'Nigerian',
    stateOfOrigin: 'Kano',
    subjects: ['English Language', 'Literature'],
    classes: ['SS 1A', 'SS 2A']
  }
];

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    
    const teacher = mockTeachers.find(t => t.id === id);
    
    if (!teacher) {
      return NextResponse.json({
        success: false,
        error: 'Teacher not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: teacher,
      message: 'Teacher fetched successfully'
    });
  } catch (error) {
    console.error('Get teacher error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch teacher'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    
    // Find teacher index
    const teacherIndex = mockTeachers.findIndex(teacher => teacher.id === id);
    
    if (teacherIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Teacher not found'
      }, { status: 404 });
    }

    // Remove teacher from mock data
    const deletedTeacher = mockTeachers.splice(teacherIndex, 1)[0];
    
    console.log('🗑️ Teacher deleted:', deletedTeacher.firstName, deletedTeacher.lastName);
    
    return NextResponse.json({
      success: true,
      data: deletedTeacher,
      message: 'Teacher deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete teacher error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete teacher',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    
    // Find teacher index
    const teacherIndex = mockTeachers.findIndex(teacher => teacher.id === id);
    
    if (teacherIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Teacher not found'
      }, { status: 404 });
    }

    // Update teacher data
    const updatedTeacher = {
      ...mockTeachers[teacherIndex],
      firstName: body.firstName || mockTeachers[teacherIndex].firstName,
      lastName: body.lastName || mockTeachers[teacherIndex].lastName,
      email: body.email || mockTeachers[teacherIndex].email,
      phoneNumber: body.phone || mockTeachers[teacherIndex].phoneNumber,
      dateOfBirth: body.dateOfBirth || mockTeachers[teacherIndex].dateOfBirth,
      gender: body.gender || mockTeachers[teacherIndex].gender,
      address: body.address || mockTeachers[teacherIndex].address,
      qualification: body.qualification || mockTeachers[teacherIndex].qualification,
      specialization: body.department || mockTeachers[teacherIndex].specialization,
      dateOfHire: body.dateOfJoining || mockTeachers[teacherIndex].dateOfHire,
      salary: body.salary?.basicSalary || mockTeachers[teacherIndex].salary,
      status: body.status || mockTeachers[teacherIndex].status,
      emergencyContact: body.emergencyContact?.phone || mockTeachers[teacherIndex].emergencyContact,
      nationality: body.nationality || mockTeachers[teacherIndex].nationality,
      stateOfOrigin: body.stateOfOrigin || mockTeachers[teacherIndex].stateOfOrigin,
    };

    mockTeachers[teacherIndex] = updatedTeacher;
    
    console.log('✏️ Teacher updated:', updatedTeacher.firstName, updatedTeacher.lastName);
    
    return NextResponse.json({
      success: true,
      data: updatedTeacher,
      message: 'Teacher updated successfully'
    });
    
  } catch (error) {
    console.error('Update teacher error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update teacher',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
