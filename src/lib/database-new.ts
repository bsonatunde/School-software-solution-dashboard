// MongoDB Database utilities for Pacey School Solution
import { connectDB, Student, Staff, Class, Subject, Attendance, Grade, Fee, Payroll, User, Parent, Message, AcademicYear } from './models';
import { Student as StudentType, Teacher, Class as ClassType, User as UserType, Parent as ParentType, Grade as GradeType, Attendance as AttendanceType, Fee as FeeType, Message as MessageType } from '../types';

// Ensure database connection
export async function ensureConnection() {
  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

// Student operations
export const StudentDB = {
  async create(studentData: Omit<StudentType, 'id'>): Promise<StudentType> {
    await ensureConnection();
    const student = new Student(studentData);
    const saved = await student.save();
    return { ...saved.toObject(), id: saved._id.toString() };
  },

  async findById(id: string): Promise<StudentType | null> {
    await ensureConnection();
    const student = await Student.findById(id);
    return student ? { ...student.toObject(), id: student._id.toString() } : null;
  },

  async findByAdmissionNumber(admissionNumber: string): Promise<StudentType | null> {
    await ensureConnection();
    const student = await Student.findOne({ admissionNumber });
    return student ? { ...student.toObject(), id: student._id.toString() } : null;
  },

  async findAll(options: {
    page?: number;
    limit?: number;
    search?: string;
    classId?: string;
    status?: string;
  } = {}): Promise<{ students: StudentType[]; total: number }> {
    await ensureConnection();
    const { page = 1, limit = 10, search, classId, status } = options;
    
    let query: any = {};
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { admissionNumber: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (classId) query.classId = classId;
    if (status) query.status = status;
    
    const skip = (page - 1) * limit;
    
    const [students, total] = await Promise.all([
      Student.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Student.countDocuments(query)
    ]);
    
    return {
      students: students.map(s => ({ ...s.toObject(), id: s._id.toString() })),
      total
    };
  },

  async update(id: string, updateData: Partial<StudentType>): Promise<StudentType | null> {
    await ensureConnection();
    const student = await Student.findByIdAndUpdate(id, updateData, { new: true });
    return student ? { ...student.toObject(), id: student._id.toString() } : null;
  },

  async delete(id: string): Promise<boolean> {
    await ensureConnection();
    const result = await Student.findByIdAndDelete(id);
    return !!result;
  }
};

// Staff operations
export const StaffDB = {
  async create(staffData: any): Promise<any> {
    await ensureConnection();
    const staff = new Staff(staffData);
    const saved = await staff.save();
    return { ...saved.toObject(), id: saved._id.toString() };
  },

  async findById(id: string): Promise<any | null> {
    await ensureConnection();
    const staff = await Staff.findById(id);
    return staff ? { ...staff.toObject(), id: staff._id.toString() } : null;
  },

  async findByEmployeeId(employeeId: string): Promise<any | null> {
    await ensureConnection();
    const staff = await Staff.findOne({ employeeId });
    return staff ? { ...staff.toObject(), id: staff._id.toString() } : null;
  },

  async findAll(options: {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
    status?: string;
  } = {}): Promise<{ staff: any[]; total: number }> {
    await ensureConnection();
    const { page = 1, limit = 10, search, department, status } = options;
    
    let query: any = {};
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (department) query.department = department;
    if (status) query.status = status;
    
    const skip = (page - 1) * limit;
    
    const [staff, total] = await Promise.all([
      Staff.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Staff.countDocuments(query)
    ]);
    
    return {
      staff: staff.map(s => ({ ...s.toObject(), id: s._id.toString() })),
      total
    };
  },

  async update(id: string, updateData: any): Promise<any | null> {
    await ensureConnection();
    const staff = await Staff.findByIdAndUpdate(id, updateData, { new: true });
    return staff ? { ...staff.toObject(), id: staff._id.toString() } : null;
  },

  async delete(id: string): Promise<boolean> {
    await ensureConnection();
    const result = await Staff.findByIdAndDelete(id);
    return !!result;
  }
};

// Payroll operations
export const PayrollDB = {
  async create(payrollData: any): Promise<any> {
    await ensureConnection();
    const payroll = new Payroll(payrollData);
    const saved = await payroll.save();
    return { ...saved.toObject(), id: saved._id.toString() };
  },

  async findByMonth(month: number, year: number): Promise<any[]> {
    await ensureConnection();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    
    const payrolls = await Payroll.find({ 
      month: monthNames[month - 1], 
      year 
    }).sort({ createdAt: -1 });
    
    return payrolls.map(p => ({ ...p.toObject(), id: p._id.toString() }));
  },

  async update(id: string, updateData: any): Promise<any | null> {
    await ensureConnection();
    const payroll = await Payroll.findByIdAndUpdate(id, updateData, { new: true });
    return payroll ? { ...payroll.toObject(), id: payroll._id.toString() } : null;
  },

  async bulkCreate(payrollRecords: any[]): Promise<any[]> {
    await ensureConnection();
    const saved = await Payroll.insertMany(payrollRecords);
    return saved.map(p => ({ ...p.toObject(), id: p._id.toString() }));
  }
};

// Class operations
export const ClassDB = {
  async findAll(): Promise<ClassType[]> {
    await ensureConnection();
    const classes = await Class.find({ status: 'Active' }).sort({ level: 1, section: 1 });
    return classes.map(c => ({ ...c.toObject(), id: c._id.toString() }));
  },

  async findById(id: string): Promise<ClassType | null> {
    await ensureConnection();
    const classDoc = await Class.findById(id);
    return classDoc ? { ...classDoc.toObject(), id: classDoc._id.toString() } : null;
  },

  async create(classData: Omit<ClassType, 'id'>): Promise<ClassType> {
    await ensureConnection();
    const classDoc = new Class(classData);
    const saved = await classDoc.save();
    return { ...saved.toObject(), id: saved._id.toString() };
  }
};

// Initialize default data if database is empty
export async function initializeDatabase() {
  await ensureConnection();
  
  // Check if we already have data
  const studentCount = await Student.countDocuments();
  const classCount = await Class.countDocuments();
  
  if (studentCount === 0 && classCount === 0) {
    console.log('Initializing database with sample data...');
    
    // Create sample classes
    const sampleClasses = [
      {
        name: 'JSS 1A',
        level: 'JSS1',
        section: 'A',
        classTeacherId: '1',
        academicYear: '2024/2025',
        capacity: 40,
        currentEnrollment: 0,
        subjects: ['Mathematics', 'English', 'Science', 'Social Studies'],
        status: 'Active'
      },
      {
        name: 'JSS 2B',
        level: 'JSS2',
        section: 'B',
        classTeacherId: '2',
        academicYear: '2024/2025',
        capacity: 40,
        currentEnrollment: 0,
        subjects: ['Mathematics', 'English', 'Science', 'Social Studies'],
        status: 'Active'
      },
      {
        name: 'SS 1A',
        level: 'SS1',
        section: 'A',
        classTeacherId: '3',
        academicYear: '2024/2025',
        capacity: 35,
        currentEnrollment: 0,
        subjects: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology'],
        status: 'Active'
      }
    ];
    
    await Class.insertMany(sampleClasses);
    
    // Create sample staff
    const sampleStaff = [
      {
        employeeId: 'PCS001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@paceyschool.ng',
        phoneNumber: '+2348012345678',
        dateOfBirth: new Date('1985-06-15'),
        gender: 'Male',
        address: '123 Education Street, Lagos',
        qualification: 'B.Ed Mathematics',
        specialization: 'Mathematics',
        department: 'Academic',
        position: 'Senior Teacher',
        dateOfHire: new Date('2020-09-01'),
        basicSalary: 150000,
        allowances: {
          housing: 50000,
          transport: 20000,
          meal: 15000,
          teaching: 30000,
          medical: 10000
        },
        bankDetails: {
          bankName: 'First Bank Nigeria',
          accountNumber: '1234567890',
          accountName: 'John Doe'
        },
        emergencyContact: {
          name: 'Jane Doe',
          relationship: 'Wife',
          phoneNumber: '+2348087654321',
          address: '123 Education Street, Lagos'
        },
        nationality: 'Nigerian',
        stateOfOrigin: 'Lagos',
        status: 'Active'
      }
    ];
    
    await Staff.insertMany(sampleStaff);
    
    console.log('Database initialized with sample data');
  }
}

// Legacy mock functions for backward compatibility
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
