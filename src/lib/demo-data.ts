// Demo data for the school management system
export interface DemoStudent {
  id: string;
  name: string;
  email: string;
  class: string;
  admissionNumber: string;
  guardianPhone: string;
  address: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  status: 'Active' | 'Inactive';
  profilePicture?: string;
}

export interface DemoTeacher {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  subjects: string[];
  classes: string[];
  phone: string;
  qualification: string;
  department: string;
  status: 'Active' | 'Inactive';
  profilePicture?: string;
}

export interface DemoAssignment {
  id: string;
  title: string;
  subject: string;
  class: string;
  teacher: string;
  dueDate: string;
  description: string;
  status: 'Active' | 'Completed' | 'Overdue';
  submissions: number;
  totalStudents: number;
}

export interface DemoAttendance {
  id: string;
  studentId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late';
  class: string;
  remarks?: string;
}

export interface DemoResult {
  id: string;
  studentId: string;
  subject: string;
  term: string;
  session: string;
  continuousAssessment: number;
  examination: number;
  total: number;
  grade: string;
  position: number;
  remarks: string;
}

export interface DemoMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
  type: 'announcement' | 'personal' | 'emergency';
}

// Demo Students Data
export const demoStudents: DemoStudent[] = [
  {
    id: '1',
    name: 'Chioma Adebayo',
    email: 'chioma.adebayo@email.com',
    class: 'JSS 3A',
    admissionNumber: 'PSS001',
    guardianPhone: '+234 803 123 4567',
    address: '15 Allen Avenue, Ikeja, Lagos',
    dateOfBirth: '2008-03-15',
    gender: 'Female',
    status: 'Active'
  },
  {
    id: '2',
    name: 'Emeka Okafor',
    email: 'emeka.okafor@email.com',
    class: 'SS 2B',
    admissionNumber: 'PSS002',
    guardianPhone: '+234 806 234 5678',
    address: '8 Victoria Island, Lagos',
    dateOfBirth: '2006-07-22',
    gender: 'Male',
    status: 'Active'
  },
  {
    id: '3',
    name: 'Fatima Aliyu',
    email: 'fatima.aliyu@email.com',
    class: 'SS 1A',
    admissionNumber: 'PSS003',
    guardianPhone: '+234 809 345 6789',
    address: '23 Garki District, Abuja',
    dateOfBirth: '2007-11-08',
    gender: 'Female',
    status: 'Active'
  },
  {
    id: '4',
    name: 'David Okoro',
    email: 'david.okoro@email.com',
    class: 'JSS 2C',
    admissionNumber: 'PSS004',
    guardianPhone: '+234 812 456 7890',
    address: '45 Independence Layout, Enugu',
    dateOfBirth: '2009-01-12',
    gender: 'Male',
    status: 'Active'
  },
  {
    id: '5',
    name: 'Blessing Nwosu',
    email: 'blessing.nwosu@email.com',
    class: 'SS 3A',
    admissionNumber: 'PSS005',
    guardianPhone: '+234 815 567 8901',
    address: '12 New Haven, Enugu',
    dateOfBirth: '2005-09-30',
    gender: 'Female',
    status: 'Active'
  }
];

// Demo Teachers Data
export const demoTeachers: DemoTeacher[] = [
  {
    id: '1',
    name: 'Mrs. Sarah Ibrahim',
    email: 'sarah.ibrahim@school.edu.ng',
    employeeId: 'TCH001',
    subjects: ['Mathematics', 'Further Mathematics'],
    classes: ['SS 1A', 'SS 2A', 'SS 3A'],
    phone: '+234 803 111 2222',
    qualification: 'B.Sc Mathematics, M.Ed',
    department: 'Mathematics',
    status: 'Active'
  },
  {
    id: '2',
    name: 'Mr. John Adekunle',
    email: 'john.adekunle@school.edu.ng',
    employeeId: 'TCH002',
    subjects: ['English Language', 'Literature'],
    classes: ['JSS 1A', 'JSS 2A', 'JSS 3A'],
    phone: '+234 806 333 4444',
    qualification: 'B.A English, PGDE',
    department: 'Languages',
    status: 'Active'
  },
  {
    id: '3',
    name: 'Dr. Kemi Oladipo',
    email: 'kemi.oladipo@school.edu.ng',
    employeeId: 'TCH003',
    subjects: ['Biology', 'Chemistry'],
    classes: ['SS 1B', 'SS 2B', 'SS 3B'],
    phone: '+234 809 555 6666',
    qualification: 'B.Sc Biology, M.Sc, Ph.D',
    department: 'Sciences',
    status: 'Active'
  },
  {
    id: '4',
    name: 'Mr. Ahmed Musa',
    email: 'ahmed.musa@school.edu.ng',
    employeeId: 'TCH004',
    subjects: ['Physics', 'Mathematics'],
    classes: ['SS 1C', 'SS 2C'],
    phone: '+234 812 777 8888',
    qualification: 'B.Sc Physics, M.Sc',
    department: 'Sciences',
    status: 'Active'
  }
];

// Demo Assignments Data
export const demoAssignments: DemoAssignment[] = [
  {
    id: '1',
    title: 'Quadratic Equations Practice',
    subject: 'Mathematics',
    class: 'SS 2A',
    teacher: 'Mrs. Sarah Ibrahim',
    dueDate: '2025-08-20',
    description: 'Solve all questions on quadratic equations from chapter 5. Show all working clearly.',
    status: 'Active',
    submissions: 23,
    totalStudents: 30
  },
  {
    id: '2',
    title: 'Essay on Nigerian Independence',
    subject: 'English Language',
    class: 'JSS 3A',
    teacher: 'Mr. John Adekunle',
    dueDate: '2025-08-18',
    description: 'Write a 500-word essay on the significance of Nigerian independence.',
    status: 'Active',
    submissions: 18,
    totalStudents: 25
  },
  {
    id: '3',
    title: 'Cell Division Diagram',
    subject: 'Biology',
    class: 'SS 1B',
    teacher: 'Dr. Kemi Oladipo',
    dueDate: '2025-08-15',
    description: 'Draw and label the stages of mitosis with detailed explanations.',
    status: 'Overdue',
    submissions: 20,
    totalStudents: 28
  }
];

// Demo Attendance Data
export const demoAttendance: DemoAttendance[] = [
  { id: '1', studentId: '1', date: '2025-08-12', status: 'Present', class: 'JSS 3A' },
  { id: '2', studentId: '2', date: '2025-08-12', status: 'Present', class: 'SS 2B' },
  { id: '3', studentId: '3', date: '2025-08-12', status: 'Late', class: 'SS 1A', remarks: 'Traffic delay' },
  { id: '4', studentId: '4', date: '2025-08-12', status: 'Absent', class: 'JSS 2C', remarks: 'Sick' },
  { id: '5', studentId: '5', date: '2025-08-12', status: 'Present', class: 'SS 3A' }
];

// Demo Results Data
export const demoResults: DemoResult[] = [
  {
    id: '1',
    studentId: '1',
    subject: 'Mathematics',
    term: 'Second Term',
    session: '2024/2025',
    continuousAssessment: 28,
    examination: 67,
    total: 95,
    grade: 'A1',
    position: 1,
    remarks: 'Excellent performance'
  },
  {
    id: '2',
    studentId: '1',
    subject: 'English Language',
    term: 'Second Term',
    session: '2024/2025',
    continuousAssessment: 25,
    examination: 58,
    total: 83,
    grade: 'A1',
    position: 2,
    remarks: 'Very good'
  },
  {
    id: '3',
    studentId: '2',
    subject: 'Physics',
    term: 'Second Term',
    session: '2024/2025',
    continuousAssessment: 22,
    examination: 45,
    total: 67,
    grade: 'B2',
    position: 8,
    remarks: 'Good effort'
  }
];

// Demo Messages Data
export const demoMessages: DemoMessage[] = [
  {
    id: '1',
    from: 'admin@school.edu.ng',
    to: 'all-students',
    subject: 'School Resumption Notice',
    content: 'Dear students, the school will resume on Monday, August 15th, 2025. Please ensure you come with all required materials.',
    date: '2025-08-10',
    read: false,
    type: 'announcement'
  },
  {
    id: '2',
    from: 'sarah.ibrahim@school.edu.ng',
    to: 'chioma.adebayo@email.com',
    subject: 'Mathematics Assignment Feedback',
    content: 'Chioma, excellent work on your latest assignment. Keep up the good work!',
    date: '2025-08-11',
    read: true,
    type: 'personal'
  },
  {
    id: '3',
    from: 'admin@school.edu.ng',
    to: 'all-parents',
    subject: 'Parent-Teacher Meeting',
    content: 'Dear parents, the next PTA meeting is scheduled for August 25th, 2025 at 10:00 AM.',
    date: '2025-08-12',
    read: false,
    type: 'announcement'
  }
];

// Utility functions
export const getStudentById = (id: string): DemoStudent | undefined => {
  return demoStudents.find(student => student.id === id);
};

export const getTeacherById = (id: string): DemoTeacher | undefined => {
  return demoTeachers.find(teacher => teacher.id === id);
};

export const getStudentsByClass = (className: string): DemoStudent[] => {
  return demoStudents.filter(student => student.class === className);
};

export const getAssignmentsByTeacher = (teacherName: string): DemoAssignment[] => {
  return demoAssignments.filter(assignment => assignment.teacher === teacherName);
};

export const getAttendanceByStudent = (studentId: string): DemoAttendance[] => {
  return demoAttendance.filter(record => record.studentId === studentId);
};

export const getResultsByStudent = (studentId: string): DemoResult[] => {
  return demoResults.filter(result => result.studentId === studentId);
};

export const getUnreadMessages = (userEmail: string): DemoMessage[] => {
  return demoMessages.filter(message => 
    (message.to === userEmail || message.to.includes('all-')) && !message.read
  );
};

// Dashboard stats
export const getDashboardStats = () => {
  return {
    totalStudents: demoStudents.length,
    totalTeachers: demoTeachers.length,
    totalClasses: [...new Set(demoStudents.map(s => s.class))].length,
    presentToday: demoAttendance.filter(a => a.date === '2025-08-12' && a.status === 'Present').length,
    absentToday: demoAttendance.filter(a => a.date === '2025-08-12' && a.status === 'Absent').length,
    activeAssignments: demoAssignments.filter(a => a.status === 'Active').length,
    overdueAssignments: demoAssignments.filter(a => a.status === 'Overdue').length
  };
};
