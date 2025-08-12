// Database models and types for the school management system

export interface Student {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female';
  address: string;
  parentGuardianName: string;
  parentGuardianPhone: string;
  parentGuardianEmail?: string;
  classId: string;
  enrollmentDate: Date;
  status: 'Active' | 'Inactive' | 'Graduated' | 'Transferred';
  profileImage?: string;
  medicalInfo?: string;
  emergencyContact?: string;
  nationality: string;
  stateOfOrigin: string;
  localGovernment: string;
}

export interface Teacher {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female';
  address: string;
  qualification: string;
  specialization: string;
  dateOfHire: Date;
  salary: number;
  status: 'Active' | 'Inactive' | 'On Leave';
  profileImage?: string;
  emergencyContact: string;
  nationality: string;
  stateOfOrigin: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

export interface Class {
  id: string;
  name: string;
  level: 'JSS1' | 'JSS2' | 'JSS3' | 'SS1' | 'SS2' | 'SS3';
  section: string;
  classTeacherId: string;
  academicYear: string;
  capacity: number;
  currentEnrollment: number;
  subjects: string[];
  status: 'Active' | 'Inactive';
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
  category: 'Core' | 'Elective' | 'Vocational';
  creditUnits: number;
  isActive: boolean;
}

export interface Attendance {
  id: string;
  studentId: string;
  classId: string;
  date: Date;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  period?: string;
  subjectId?: string;
  teacherId: string;
  remarks?: string;
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  classId: string;
  term: 'First' | 'Second' | 'Third';
  academicYear: string;
  assessmentType: 'CA1' | 'CA2' | 'Assignment' | 'Exam' | 'Project';
  score: number;
  totalMarks: number;
  grade: string;
  teacherId: string;
  dateRecorded: Date;
  remarks?: string;
}

export interface Fee {
  id: string;
  studentId: string;
  academicYear: string;
  term: 'First' | 'Second' | 'Third';
  feeType: 'Tuition' | 'Development' | 'Sports' | 'Library' | 'Laboratory' | 'Transport' | 'Boarding' | 'Other';
  amount: number;
  amountPaid: number;
  balance: number;
  dueDate: Date;
  status: 'Paid' | 'Partial' | 'Outstanding' | 'Overdue';
  paymentHistory: Payment[];
}

export interface Payment {
  id: string;
  feeId: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Card' | 'Mobile Money';
  transactionRef?: string;
  receivedBy: string;
  receipt?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderType: 'Admin' | 'Teacher' | 'Parent' | 'Student';
  recipientType: 'All' | 'Class' | 'Parents' | 'Teachers' | 'Students' | 'Individual';
  recipientIds?: string[];
  title: string;
  content: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Draft' | 'Sent' | 'Delivered' | 'Read';
  sentDate: Date;
  deliveryMethod: 'App' | 'SMS' | 'Email' | 'All';
  attachments?: string[];
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: 'Admin' | 'Teacher' | 'Parent' | 'Student';
  firstName: string;
  lastName: string;
  profileId: string; // References Teacher, Student, or Parent ID
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Parent {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber: string;
  address: string;
  occupation?: string;
  relationship: 'Father' | 'Mother' | 'Guardian' | 'Other';
  studentIds: string[];
  emergencyContact?: string;
}

export interface AcademicYear {
  id: string;
  year: string;
  startDate: Date;
  endDate: Date;
  currentTerm: 'First' | 'Second' | 'Third';
  status: 'Active' | 'Completed' | 'Upcoming';
  terms: {
    first: { startDate: Date; endDate: Date };
    second: { startDate: Date; endDate: Date };
    third: { startDate: Date; endDate: Date };
  };
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Request types
export interface LoginRequest {
  email: string;
  password: string;
  role?: string;
}

export interface CreateStudentRequest {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  address: string;
  parentGuardianName: string;
  parentGuardianPhone: string;
  parentGuardianEmail?: string;
  classId: string;
  nationality: string;
  stateOfOrigin: string;
  localGovernment: string;
}

export interface UpdateStudentRequest extends Partial<CreateStudentRequest> {
  id: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  classId?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
