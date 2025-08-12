// MongoDB Database utilities for Pacey School Solution
import { connectDB, Student, Staff, Class, Subject, Attendance, Grade, Fee, Payroll, User, Parent, Message, AcademicYear } from './models';
import { Student as StudentType, Teacher, Class as ClassType, User as UserType, Parent as ParentType, Grade as GradeType, Attendance as AttendanceType, Fee as FeeType, Message as MessageType } from '../types';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

// Ensure database connection
export async function ensureConnection() {
  await connectDB();
}

// Initialize database with sample data
export async function initializeDatabase() {
  await connectDB();
  
  // Clear existing data using Mongoose models
  await Staff.deleteMany({});
  
  // Sample staff data
  const sampleStaff = [
    {
      _id: new ObjectId('689258443e55b8d77efc166a'),
      employeeId: 'EMP001',
      firstName: 'Dr. Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@paceyschool.edu.ng',
      phoneNumber: '+234-803-123-4567',
      position: 'Mathematics Teacher',
      department: 'Science Department',
      dateOfJoining: new Date('2020-09-01'),
      dateOfBirth: new Date('1985-03-15'),
      gender: 'Female',
      maritalStatus: 'Married',
      address: '123 Teacher Avenue, Lagos',
      stateOfOrigin: 'Lagos',
      nationality: 'Nigerian',
      religion: 'Christianity',
      qualification: 'Ph.D Mathematics',
      experience: 8,
      employmentType: 'Full-time',
      gradeLevel: 'Level 12',
      status: 'Active',
      subjects: ['Mathematics', 'Further Mathematics'],
      classes: ['SS1A', 'SS2B', 'SS3A'],
      emergencyContact: {
        name: 'John Johnson',
        relationship: 'Spouse',
        phoneNumber: '+234-803-987-6543',
        address: '123 Teacher Avenue, Lagos'
      },
      bankDetails: {
        accountName: 'Sarah Johnson',
        accountNumber: '1234567890',
        bankName: 'First Bank Nigeria',
        bvn: '12345678901'
      },
      basicSalary: 250000,
      allowances: {
        housing: 75000,
        transport: 25000,
        meal: 15000,
        teaching: 30000,
        medical: 10000,
        other: 5000
      },
      salary: {
        basicSalary: 250000,
        allowances: {
          housing: 75000,
          transport: 25000,
          meal: 15000,
          teaching: 30000
        },
        deductions: {
          pension: 15000,
          tax: 25000,
          nhis: 5000
        },
        grossSalary: 395000,
        netSalary: 350000
      },
      leaveBalance: 21,
      performanceRating: 4.5,
      lastPromotionDate: new Date('2022-01-01'),
      disciplinaryRecords: [],
      achievements: ['Best Teacher Award 2023', 'Outstanding Performance 2022']
    }
  ];
  
  await Staff.insertMany(sampleStaff);
  
  // Initialize Leave Requests using Mongoose connection
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('Database connection not established');
  }
  const Leave = db.collection('leaves');
  
  // Clear existing leave requests
  await Leave.deleteMany({});
  
  // Sample leave requests
  const sampleLeaves = [
    {
      employeeId: 'EMP001',
      staffId: '689258443e55b8d77efc166a',
      type: 'Annual Leave',
      startDate: '2025-08-10',
      endDate: '2025-08-14',
      days: 5,
      reason: 'Summer vacation with family',
      status: 'approved',
      appliedDate: '2025-08-01T10:00:00.000Z',
      approvedBy: 'Admin User',
      approvedDate: '2025-08-02T14:30:00.000Z',
      remarks: 'Approved for well-deserved break. Enjoy your vacation!'
    },
    {
      employeeId: 'EMP001',
      staffId: '689258443e55b8d77efc166a',
      type: 'Study Leave',
      startDate: '2025-09-15',
      endDate: '2025-09-19',
      days: 5,
      reason: 'Attending advanced mathematics conference',
      status: 'pending',
      appliedDate: '2025-08-05T16:20:00.000Z'
    }
  ];
  
  await Leave.insertMany(sampleLeaves);
  
  console.log('Clean database initialized successfully');
}

// Legacy functions for compatibility
export function getStudents() {
  console.warn('getStudents() is deprecated. Use StudentDB.findAll() instead.');  
  return [];
}

export function getTeachers() {
  console.warn('getTeachers() is deprecated. Use StaffDB.findAll() instead.');
  return [];
}

export function getClasses() {
  console.warn('getClasses() is deprecated. Use ClassDB.findAll() instead.');
  return [];
}

export function getStudentById(id: string) {
  console.warn('getStudentById() is deprecated. Use StudentDB.findById() instead.');
  return null;
}

export function getTeacherById(id: string) {
  console.warn('getTeacherById() is deprecated. Use StaffDB.findById() instead.');
  return null;
}

export function getClassById(id: string) {
  console.warn('getClassById() is deprecated. Use ClassDB.findById() instead.');
  return null;
}

export function createStudent(studentData: any) {
  console.warn('createStudent() is deprecated. Use StudentDB.create() instead.');
  return null;
}

export function updateStudent(id: string, updateData: any) {
  console.warn('updateStudent() is deprecated. Use StudentDB.update() instead.');
  return null;
}

export function deleteStudent(id: string) {
  console.warn('deleteStudent() is deprecated. Use StudentDB.delete() instead.');
  return false;
}

export function searchStudents(query: string) {
  console.warn('searchStudents() is deprecated. Use StudentDB.findAll() with search parameter instead.');
  return [];
}

export function getStudentsByClass(classId: string) {
  console.warn('getStudentsByClass() is deprecated. Use StudentDB.findAll() with classId parameter instead.');
  return [];
}

export function getStudentsPaginated(page: number = 1, limit: number = 10, search?: string, classId?: string) {
  console.warn('getStudentsPaginated() is deprecated. Use StudentDB.findAll() instead.');
  return {
    students: [],
    total: 0,
    totalPages: 0,
    currentPage: page
  };
}

// Helper functions
export const generateId = () => Math.random().toString(36).substr(2, 9);

export const hashPassword = (password: string) => {
  // In production, use bcrypt or similar
  return password; // Mock implementation
};

export const verifyPassword = (password: string, hash: string) => {
  // In production, use bcrypt.compare
  return password === hash; // Mock implementation
};
