import { NextRequest, NextResponse } from 'next/server';

const mockStudents = [
  {
    id: '1',
    studentId: 'PSS/2024/001',
    firstName: 'Chioma',
    lastName: 'Okoro',
    email: 'chioma.okoro@student.paceyschool.com',
    phoneNumber: '+234-801-234-5678',
    dateOfBirth: '2010-03-15',
    gender: 'Female',
    address: '123 Victoria Island, Lagos State',
    class: 'JSS 1A',
    parentName: 'Mr. Emeka Okoro',
    parentPhone: '+234-803-987-6543',
    parentEmail: 'emeka.okoro@gmail.com',
    dateOfAdmission: '2024-09-01',
    status: 'Active',
    nationality: 'Nigerian',
    stateOfOrigin: 'Lagos',
    bloodGroup: 'O+',
    medicalConditions: 'None'
  },
  {
    id: '2',
    studentId: 'PSS/2024/002',
    firstName: 'Kemi',
    lastName: 'Adebayo',
    email: 'kemi.adebayo@student.paceyschool.com',
    phoneNumber: '+234-805-876-5432',
    dateOfBirth: '2009-07-22',
    gender: 'Female',
    address: '456 Ikeja, Lagos State',
    class: 'JSS 2A',
    parentName: 'Mrs. Folake Adebayo',
    parentPhone: '+234-807-123-4567',
    parentEmail: 'folake.adebayo@yahoo.com',
    dateOfAdmission: '2023-09-01',
    status: 'Active',
    nationality: 'Nigerian',
    stateOfOrigin: 'Ogun',
    bloodGroup: 'A+',
    medicalConditions: 'Mild asthma'
  },
  {
    id: '3',
    studentId: 'PSS/2024/003',
    firstName: 'Ibrahim',
    lastName: 'Hassan',
    email: 'ibrahim.hassan@student.paceyschool.com',
    phoneNumber: '+234-806-111-2222',
    dateOfBirth: '2008-11-08',
    gender: 'Male',
    address: '789 Surulere, Lagos State',
    class: 'SS 1A',
    parentName: 'Alhaji Musa Hassan',
    parentPhone: '+234-808-333-4444',
    parentEmail: 'musa.hassan@hotmail.com',
    dateOfAdmission: '2022-09-01',
    status: 'Active',
    nationality: 'Nigerian',
    stateOfOrigin: 'Kano',
    bloodGroup: 'B+',
    medicalConditions: 'None'
  }
];

// GET single student
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const student = mockStudents.find(s => s.id === id);
    
    if (!student) {
      return NextResponse.json({
        success: false,
        error: 'Student not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: student,
      message: 'Student fetched successfully'
    });
  } catch (error) {
    console.error('Get student error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch student'
    }, { status: 500 });
  }
}

// UPDATE student
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await params;
    const studentIndex = mockStudents.findIndex(s => s.id === id);
    
    if (studentIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Student not found'
      }, { status: 404 });
    }

    // Update the student
    mockStudents[studentIndex] = {
      ...mockStudents[studentIndex],
      ...body,
      id: id // Ensure ID doesn't change
    };

    return NextResponse.json({
      success: true,
      data: mockStudents[studentIndex],
      message: 'Student updated successfully'
    });
  } catch (error) {
    console.error('Update student error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update student'
    }, { status: 500 });
  }
}

// DELETE student
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const studentIndex = mockStudents.findIndex(s => s.id === id);
    
    if (studentIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Student not found'
      }, { status: 404 });
    }

    // Remove the student
    const deletedStudent = mockStudents.splice(studentIndex, 1)[0];

    return NextResponse.json({
      success: true,
      data: deletedStudent,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Delete student error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete student'
    }, { status: 500 });
  }
}
