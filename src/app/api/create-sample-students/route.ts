import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function POST() {
  try {
    console.log('🎓 Creating Sample Students...');
    
    const db = await getDatabase();
    const studentsCollection = db.collection('students');
    
    // Check if students already exist
    const existingCount = await studentsCollection.countDocuments();
    if (existingCount > 0) {
      return NextResponse.json({
        success: true,
        message: `Students already exist (${existingCount} students found). No new students created.`,
        count: existingCount
      });
    }

    // Sample Nigerian students with proper data structure
    const sampleStudents = [
      {
        studentId: 'PSS/2025/001',
        firstName: 'Adebayo',
        lastName: 'Oluwaseun',
        email: 'adebayo.oluwaseun@student.pacey.com',
        phoneNumber: '+234-801-234-567',
        dateOfBirth: new Date('2010-03-15'),
        gender: 'Male',
        address: '123 Victoria Island, Lagos, Nigeria',
        classId: 'JSS 1A',
        status: 'Active',
        parentGuardianName: 'Mrs. Folake Oluwaseun',
        parentGuardianPhone: '+234-802-345-678',
        parentGuardianEmail: 'folake.oluwaseun@parent.pacey.com',
        enrollmentDate: new Date('2024-09-01'),
        nationality: 'Nigerian',
        stateOfOrigin: 'Lagos',
        localGovernment: 'Lagos Island',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        studentId: 'PSS/2025/002',
        firstName: 'Chioma',
        lastName: 'Okwu',
        email: 'chioma.okwu@student.pacey.com',
        phoneNumber: '+234-803-456-789',
        dateOfBirth: new Date('2009-07-22'),
        gender: 'Female',
        address: '456 Ikeja GRA, Lagos, Nigeria',
        classId: 'JSS 2A',
        status: 'Active',
        parentGuardianName: 'Mr. Emeka Okwu',
        parentGuardianPhone: '+234-804-567-890',
        parentGuardianEmail: 'emeka.okwu@parent.pacey.com',
        enrollmentDate: new Date('2023-09-01'),
        nationality: 'Nigerian',
        stateOfOrigin: 'Anambra',
        localGovernment: 'Awka South',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        studentId: 'PSS/2025/003',
        firstName: 'Fatima',
        lastName: 'Ahmad',
        email: 'fatima.ahmad@student.pacey.com',
        phoneNumber: '+234-805-678-901',
        dateOfBirth: new Date('2008-11-10'),
        gender: 'Female',
        address: '789 Garki Area, Abuja, Nigeria',
        classId: 'JSS 3A',
        status: 'Active',
        parentGuardianName: 'Alhaji Ibrahim Ahmad',
        parentGuardianPhone: '+234-806-789-012',
        parentGuardianEmail: 'ibrahim.ahmad@parent.pacey.com',
        enrollmentDate: new Date('2022-09-01'),
        nationality: 'Nigerian',
        stateOfOrigin: 'Kano',
        localGovernment: 'Kano Municipal',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        studentId: 'PSS/2025/004',
        firstName: 'Emmanuel',
        lastName: 'Bassey',
        email: 'emmanuel.bassey@student.pacey.com',
        phoneNumber: '+234-807-890-123',
        dateOfBirth: new Date('2007-05-30'),
        gender: 'Male',
        address: '321 GRA Phase 2, Port Harcourt, Nigeria',
        classId: 'SS 1A',
        status: 'Active',
        parentGuardianName: 'Mrs. Grace Bassey',
        parentGuardianPhone: '+234-808-901-234',
        parentGuardianEmail: 'grace.bassey@parent.pacey.com',
        enrollmentDate: new Date('2021-09-01'),
        nationality: 'Nigerian',
        stateOfOrigin: 'Cross River',
        localGovernment: 'Calabar Municipal',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        studentId: 'PSS/2025/005',
        firstName: 'Khadijah',
        lastName: 'Musa',
        email: 'khadijah.musa@student.pacey.com',
        phoneNumber: '+234-809-012-345',
        dateOfBirth: new Date('2006-12-08'),
        gender: 'Female',
        address: '654 Old Airport Road, Kaduna, Nigeria',
        classId: 'SS 2A',
        status: 'Active',
        parentGuardianName: 'Dr. Aminu Musa',
        parentGuardianPhone: '+234-810-123-456',
        parentGuardianEmail: 'aminu.musa@parent.pacey.com',
        enrollmentDate: new Date('2020-09-01'),
        nationality: 'Nigerian',
        stateOfOrigin: 'Kaduna',
        localGovernment: 'Kaduna North',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        studentId: 'PSS/2025/006',
        firstName: 'Olumide',
        lastName: 'Johnson',
        email: 'olumide.johnson@student.pacey.com',
        phoneNumber: '+234-811-234-567',
        dateOfBirth: new Date('2005-09-17'),
        gender: 'Male',
        address: '987 Bodija Estate, Ibadan, Nigeria',
        classId: 'SS 3A',
        status: 'Active',
        parentGuardianName: 'Pastor David Johnson',
        parentGuardianPhone: '+234-812-345-678',
        parentGuardianEmail: 'david.johnson@parent.pacey.com',
        enrollmentDate: new Date('2019-09-01'),
        nationality: 'Nigerian',
        stateOfOrigin: 'Oyo',
        localGovernment: 'Ibadan North',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        studentId: 'PSS/2025/007',
        firstName: 'Blessing',
        lastName: 'Okafor',
        email: 'blessing.okafor@student.pacey.com',
        phoneNumber: '+234-813-456-789',
        dateOfBirth: new Date('2010-01-25'),
        gender: 'Female',
        address: '147 Independence Layout, Enugu, Nigeria',
        classId: 'JSS 1B',
        status: 'Active',
        parentGuardianName: 'Mrs. Ngozi Okafor',
        parentGuardianPhone: '+234-814-567-890',
        parentGuardianEmail: 'ngozi.okafor@parent.pacey.com',
        enrollmentDate: new Date('2024-09-01'),
        nationality: 'Nigerian',
        stateOfOrigin: 'Enugu',
        localGovernment: 'Enugu East',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        studentId: 'PSS/2025/008',
        firstName: 'Ibrahim',
        lastName: 'Usman',
        email: 'ibrahim.usman@student.pacey.com',
        phoneNumber: '+234-815-678-901',
        dateOfBirth: new Date('2009-04-12'),
        gender: 'Male',
        address: '258 Federal Housing, Gombe, Nigeria',
        classId: 'JSS 2B',
        status: 'Active',
        parentGuardianName: 'Mallam Yusuf Usman',
        parentGuardianPhone: '+234-816-789-012',
        parentGuardianEmail: 'yusuf.usman@parent.pacey.com',
        enrollmentDate: new Date('2023-09-01'),
        nationality: 'Nigerian',
        stateOfOrigin: 'Gombe',
        localGovernment: 'Gombe',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        studentId: 'PSS/2025/009',
        firstName: 'Chiamaka',
        lastName: 'Eze',
        email: 'chiamaka.eze@student.pacey.com',
        phoneNumber: '+234-817-890-123',
        dateOfBirth: new Date('2008-08-05'),
        gender: 'Female',
        address: '369 New Haven, Enugu, Nigeria',
        classId: 'JSS 3B',
        status: 'Active',
        parentGuardianName: 'Chief Peter Eze',
        parentGuardianPhone: '+234-818-901-234',
        parentGuardianEmail: 'peter.eze@parent.pacey.com',
        enrollmentDate: new Date('2022-09-01'),
        nationality: 'Nigerian',
        stateOfOrigin: 'Enugu',
        localGovernment: 'Enugu South',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        studentId: 'PSS/2025/010',
        firstName: 'Daniel',
        lastName: 'Adeoye',
        email: 'daniel.adeoye@student.pacey.com',
        phoneNumber: '+234-819-012-345',
        dateOfBirth: new Date('2007-06-18'),
        gender: 'Male',
        address: '741 Afe Babalola Way, Ado-Ekiti, Nigeria',
        classId: 'SS 1B',
        status: 'Active',
        parentGuardianName: 'Prof. Adebayo Adeoye',
        parentGuardianPhone: '+234-820-123-456',
        parentGuardianEmail: 'adebayo.adeoye@parent.pacey.com',
        enrollmentDate: new Date('2021-09-01'),
        nationality: 'Nigerian',
        stateOfOrigin: 'Ekiti',
        localGovernment: 'Ado-Ekiti',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Insert sample students
    const result = await studentsCollection.insertMany(sampleStudents);
    
    console.log('✅ Sample students created:', Object.keys(result.insertedIds).length);
    
    return NextResponse.json({
      success: true,
      message: 'Sample students created successfully! 🎓',
      data: {
        insertedCount: Object.keys(result.insertedIds).length,
        students: sampleStudents.map((student, index) => ({
          id: result.insertedIds[index],
          name: `${student.firstName} ${student.lastName}`,
          studentId: student.studentId,
          class: student.classId,
          email: student.email
        }))
      },
      instructions: [
        'Sample students have been created for all class levels',
        'Students are distributed across JSS 1-3 and SS 1-3 classes',
        'Each student has complete Nigerian profile information',
        'You can now test the teacher students page with real data',
        'Visit /teacher/students to view the students',
        'Use the filters to search by class, status, or gender'
      ]
    });

  } catch (error: any) {
    console.error('Failed to create sample students:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create sample students',
      details: error.message
    }, { status: 500 });
  }
}
