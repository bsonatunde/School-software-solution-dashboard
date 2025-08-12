// MongoDB Database utilities for Pacey School Solution
// Note: This is a simplified version for JavaScript scripts
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

// Simple connection function
const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pacey-school-db';
    await mongoose.connect(mongoUri, {
      dbName: process.env.DATABASE_NAME || 'pacey-school-db',
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Simple Staff schema for this script
const StaffSchema = new mongoose.Schema({
  employeeId: String,
  firstName: String,
  lastName: String,
  email: String,
  phoneNumber: String,
  position: String,
  department: String,
  dateOfJoining: Date,
  dateOfBirth: Date,
  gender: String,
  maritalStatus: String,
  address: String,
  stateOfOrigin: String,
  nationality: String,
  religion: String,
  qualification: String,
  experience: Number,
  employmentType: String,
  gradeLevel: String,
  status: String,
  subjects: [String],
  classes: [String],
  emergencyContact: {
    name: String,
    relationship: String,
    phoneNumber: String,
    address: String
  },
  bankDetails: {
    accountName: String,
    accountNumber: String,
    bankName: String,
    bvn: String
  },
  basicSalary: Number,
  allowances: {
    housing: Number,
    transport: Number,
    meal: Number,
    teaching: Number,
    medical: Number,
    other: Number
  },
  salary: {
    basicSalary: Number,
    allowances: Object,
    deductions: Object,
    grossSalary: Number,
    netSalary: Number
  },
  leaveBalance: Number,
  performanceRating: Number,
  lastPromotionDate: Date,
  disciplinaryRecords: [Object],
  achievements: [String]
});

const Staff = mongoose.models.Staff || mongoose.model('Staff', StaffSchema);

// Ensure database connection
async function ensureConnection() {
  await connectDB();
}

// Initialize database with sample data
async function initializeDatabase() {
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
  const Leave = db.collection('leaves');
  
  // Clear existing leave requests
  await Leave.deleteMany({});
  
  // Sample leave requests
  const sampleLeaves = [
    {
      employeeId: 'EMP001',
      staffId: new ObjectId('689258443e55b8d77efc166a'),
      type: 'Annual Leave',
      startDate: new Date('2025-08-10'),
      endDate: new Date('2025-08-14'),
      days: 5,
      reason: 'Summer vacation with family',
      status: 'approved',
      appliedDate: new Date('2025-08-01T10:00:00.000Z'),
      approvedBy: 'Admin User',
      approvedDate: new Date('2025-08-02T14:30:00.000Z'),
      remarks: 'Approved for well-deserved break. Enjoy your vacation!'
    },
    {
      employeeId: 'EMP001',
      staffId: new ObjectId('689258443e55b8d77efc166a'),
      type: 'Study Leave',
      startDate: new Date('2025-09-15'),
      endDate: new Date('2025-09-19'),
      days: 5,
      reason: 'Attending advanced mathematics conference',
      status: 'pending',
      appliedDate: new Date('2025-08-05T16:20:00.000Z')
    }
  ];
  
  await Leave.insertMany(sampleLeaves);
  
  console.log('Clean database initialized successfully');
}

// Legacy functions for compatibility
function getStudents() {
  console.warn('getStudents() is deprecated. Use StudentDB.findAll() instead.');  
  return [];
}

function getTeachers() {
  console.warn('getTeachers() is deprecated. Use StaffDB.findAll() instead.');
  return [];
}

function getClasses() {
  console.warn('getClasses() is deprecated. Use ClassDB.findAll() instead.');
  return [];
}

function getStudentById(id) {
  console.warn('getStudentById() is deprecated. Use StudentDB.findById() instead.');
  return null;
}

function getTeacherById(id) {
  console.warn('getTeacherById() is deprecated. Use StaffDB.findById() instead.');
  return null;
}

function getClassById(id) {
  console.warn('getClassById() is deprecated. Use ClassDB.findById() instead.');
  return null;
}

function createStudent(studentData) {
  console.warn('createStudent() is deprecated. Use StudentDB.create() instead.');
  return null;
}

function updateStudent(id, updateData) {
  console.warn('updateStudent() is deprecated. Use StudentDB.update() instead.');
  return null;
}

function deleteStudent(id) {
  console.warn('deleteStudent() is deprecated. Use StudentDB.delete() instead.');
  return false;
}

function searchStudents(query) {
  console.warn('searchStudents() is deprecated. Use StudentDB.findAll() with search parameter instead.');
  return [];
}

function getStudentsByClass(classId) {
  console.warn('getStudentsByClass() is deprecated. Use StudentDB.findAll() with classId parameter instead.');
  return [];
}

function getStudentsPaginated(page = 1, limit = 10, search, classId) {
  console.warn('getStudentsPaginated() is deprecated. Use StudentDB.findAll() instead.');
  return {
    students: [],
    total: 0,
    totalPages: 0,
    currentPage: page
  };
}

// Helper functions
const generateId = () => Math.random().toString(36).substr(2, 9);

const hashPassword = (password) => {
  // In production, use bcrypt or similar
  return password; // Mock implementation
};

const verifyPassword = (password, hash) => {
  // In production, use bcrypt.compare
  return password === hash; // Mock implementation
};

// Export all functions
module.exports = {
  ensureConnection,
  initializeDatabase,
  getStudents,
  getTeachers,
  getClasses,
  getStudentById,
  getTeacherById,
  getClassById,
  createStudent,
  updateStudent,
  deleteStudent,
  searchStudents,
  getStudentsByClass,
  getStudentsPaginated,
  generateId,
  hashPassword,
  verifyPassword
};

// If this script is run directly, test it
if (require.main === module) {
  console.log('🧪 Testing database-clean.js script...');
  console.log('✅ All functions loaded successfully');
  console.log('📚 Available functions:', Object.keys(module.exports));
  console.log('🎯 Script is ready to use!');
}
