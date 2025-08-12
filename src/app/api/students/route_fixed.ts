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
  },
  {
    id: '4',
    studentId: 'PSS/2024/004',
    firstName: 'Blessing',
    lastName: 'Adamu',
    email: 'blessing.adamu@student.paceyschool.com',
    phoneNumber: '+234-809-567-8901',
    dateOfBirth: '2010-05-12',
    gender: 'Female',
    address: '321 Yaba, Lagos State',
    class: 'JSS 1B',
    parentName: 'Mrs. Grace Adamu',
    parentPhone: '+234-802-345-6789',
    parentEmail: 'grace.adamu@gmail.com',
    dateOfAdmission: '2024-09-01',
    status: 'Active',
    nationality: 'Nigerian',
    stateOfOrigin: 'Plateau',
    bloodGroup: 'AB+',
    medicalConditions: 'None'
  },
  {
    id: '5',
    studentId: 'PSS/2024/005',
    firstName: 'Tunde',
    lastName: 'Ogundimu',
    email: 'tunde.ogundimu@student.paceyschool.com',
    phoneNumber: '+234-805-432-1098',
    dateOfBirth: '2009-09-30',
    gender: 'Male',
    address: '654 Gbagada, Lagos State',
    class: 'JSS 2B',
    parentName: 'Mr. Wale Ogundimu',
    parentPhone: '+234-807-654-3210',
    parentEmail: 'wale.ogundimu@yahoo.com',
    dateOfAdmission: '2023-09-01',
    status: 'Active',
    nationality: 'Nigerian',
    stateOfOrigin: 'Oyo',
    bloodGroup: 'O-',
    medicalConditions: 'None'
  }
];

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: mockStudents,
      message: 'Students fetched successfully'
    });
  } catch (error) {
    console.error('Get students error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch students'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.firstName || !body.lastName) {
      return NextResponse.json({
        success: false,
        error: 'First name and last name are required'
      }, { status: 400 });
    }

    // Create new student
    const newStudent = {
      id: String(mockStudents.length + 1),
      ...body,
      status: 'Active'
    };

    mockStudents.push(newStudent);

    return NextResponse.json({
      success: true,
      data: newStudent,
      message: 'Student created successfully'
    });
  } catch (error) {
    console.error('Create student error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create student'
    }, { status: 500 });
  }
}
