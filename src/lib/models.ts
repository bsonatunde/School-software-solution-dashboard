import mongoose, { Schema, model, models } from 'mongoose';

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: process.env.DATABASE_NAME || 'pacey-school-db',
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Student Schema
const StudentSchema = new Schema({
  admissionNumber: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String },
  phoneNumber: { type: String },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  address: { type: String, required: true },
  parentGuardianName: { type: String, required: true },
  parentGuardianPhone: { type: String, required: true },
  parentGuardianEmail: { type: String },
  classId: { type: String, required: true },
  enrollmentDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Active', 'Inactive', 'Graduated', 'Transferred'], default: 'Active' },
  profileImage: { type: String },
  medicalInfo: { type: String },
  emergencyContact: { type: String },
  nationality: { type: String, required: true },
  stateOfOrigin: { type: String, required: true },
  localGovernment: { type: String, required: true },
}, { timestamps: true });

// Staff Schema (Extended from Teacher)
const StaffSchema = new Schema({
  employeeId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  address: { type: String, required: true },
  qualification: { type: String, required: true },
  specialization: { type: String },
  department: { type: String, required: true },
  position: { type: String, required: true },
  dateOfHire: { type: Date, required: true },
  employmentType: { type: String, enum: ['Full-time', 'Part-time', 'Contract'], default: 'Full-time' },
  
  // Salary Information
  basicSalary: { type: Number, required: true },
  allowances: {
    housing: { type: Number, default: 0 },
    transport: { type: Number, default: 0 },
    meal: { type: Number, default: 0 },
    teaching: { type: Number, default: 0 },
    medical: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  
  // Bank Details
  bankDetails: {
    bankName: { type: String },
    accountNumber: { type: String },
    accountName: { type: String },
    bvn: { type: String }
  },
  
  // Emergency Information
  emergencyContact: {
    name: { type: String },
    relationship: { type: String },
    phoneNumber: { type: String },
    address: { type: String }
  },
  
  status: { type: String, enum: ['Active', 'Inactive', 'On Leave', 'Terminated'], default: 'Active' },
  profileImage: { type: String },
  nationality: { type: String, required: true },
  stateOfOrigin: { type: String, required: true },
  
  // Leave Information
  leaveBalance: { type: Number, default: 21 }, // Annual leave days
  sickLeaveBalance: { type: Number, default: 10 },
  
  // Performance & Notes
  performanceRating: { type: String, enum: ['Excellent', 'Good', 'Satisfactory', 'Needs Improvement'], default: 'Satisfactory' },
  notes: { type: String }
}, { timestamps: true });

// Class Schema
const ClassSchema = new Schema({
  name: { type: String, required: true },
  level: { type: String, enum: ['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'], required: true },
  section: { type: String, required: true },
  classTeacherId: { type: String, required: true },
  academicYear: { type: String, required: true },
  capacity: { type: Number, required: true },
  currentEnrollment: { type: Number, default: 0 },
  subjects: [{ type: String }],
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

// Subject Schema
const SubjectSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  description: { type: String },
  category: { type: String, enum: ['Core', 'Elective', 'Vocational'], required: true },
  creditUnits: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Attendance Schema
const AttendanceSchema = new Schema({
  studentId: { type: String, required: true },
  classId: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Present', 'Absent', 'Late', 'Excused'], required: true },
  period: { type: String },
  subjectId: { type: String },
  teacherId: { type: String, required: true },
  remarks: { type: String }
}, { timestamps: true });

// Grade Schema
const GradeSchema = new Schema({
  studentId: { type: String, required: true },
  subjectId: { type: String, required: true },
  classId: { type: String, required: true },
  term: { type: String, enum: ['First', 'Second', 'Third'], required: true },
  academicYear: { type: String, required: true },
  assessmentType: { type: String, enum: ['CA1', 'CA2', 'Assignment', 'Exam', 'Project'], required: true },
  score: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  grade: { type: String, required: true },
  teacherId: { type: String, required: true },
  dateRecorded: { type: Date, default: Date.now },
  remarks: { type: String }
}, { timestamps: true });

// Fee Schema
const FeeSchema = new Schema({
  studentId: { type: String, required: true },
  academicYear: { type: String, required: true },
  term: { type: String, enum: ['First', 'Second', 'Third'], required: true },
  feeType: { type: String, enum: ['Tuition', 'Development', 'Sports', 'Library', 'Laboratory', 'Transport', 'Boarding', 'Other'], required: true },
  amount: { type: Number, required: true },
  amountPaid: { type: Number, default: 0 },
  balance: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['Paid', 'Partial', 'Outstanding', 'Overdue'], default: 'Outstanding' },
  paymentHistory: [{
    id: { type: String },
    amount: { type: Number },
    paymentDate: { type: Date },
    paymentMethod: { type: String, enum: ['Cash', 'Bank Transfer', 'Card', 'Mobile Money'] },
    transactionRef: { type: String },
    receivedBy: { type: String },
    receipt: { type: String }
  }]
}, { timestamps: true });

// Payroll Schema
const PayrollSchema = new Schema({
  employeeId: { type: String, required: true },
  employeeName: { type: String, required: true },
  department: { type: String, required: true },
  position: { type: String, required: true },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  workingDays: { type: Number, required: true },
  daysWorked: { type: Number, required: true },
  basicSalary: { type: Number, required: true },
  
  allowances: {
    housing: { type: Number, default: 0 },
    transport: { type: Number, default: 0 },
    meal: { type: Number, default: 0 },
    teaching: { type: Number, default: 0 },
    overtime: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 }
  },
  
  deductions: {
    pension: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    nhis: { type: Number, default: 0 },
    absence: { type: Number, default: 0 },
    loan: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  
  grossSalary: { type: Number, required: true },
  totalDeductions: { type: Number, required: true },
  netSalary: { type: Number, required: true },
  status: { type: String, enum: ['draft', 'approved', 'paid'], default: 'draft' },
  processedDate: { type: String, required: true },
  paidDate: { type: String },
  processedBy: { type: String, required: true }
}, { timestamps: true });

// User Schema
const UserSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Teacher', 'Parent', 'Student'], required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  profileId: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
}, { timestamps: true });

// Parent Schema
const ParentSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  occupation: { type: String },
  relationship: { type: String, enum: ['Father', 'Mother', 'Guardian', 'Other'], required: true },
  studentIds: [{ type: String }],
  emergencyContact: { type: String }
}, { timestamps: true });

// Message Schema
const MessageSchema = new Schema({
  senderId: { type: String, required: true },
  senderType: { type: String, enum: ['Admin', 'Teacher', 'Parent', 'Student'], required: true },
  recipientType: { type: String, enum: ['All', 'Class', 'Parents', 'Teachers', 'Students', 'Individual'], required: true },
  recipientIds: [{ type: String }],
  title: { type: String, required: true },
  content: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
  status: { type: String, enum: ['Draft', 'Sent', 'Delivered', 'Read'], default: 'Draft' },
  sentDate: { type: Date, default: Date.now },
  deliveryMethod: { type: String, enum: ['App', 'SMS', 'Email', 'All'], default: 'App' },
  attachments: [{ type: String }]
}, { timestamps: true });

// Timetable Schema
const TimetableSchema = new Schema({
  classId: { type: String, required: true },
  className: { type: String, required: true },
  term: { type: String, enum: ['First', 'Second', 'Third'], required: true },
  academicYear: { type: String, required: true },
  dayOfWeek: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], required: true },
  periods: [{
    periodNumber: { type: Number, required: true },
    startTime: { type: String, required: true }, // Format: "08:00"
    endTime: { type: String, required: true },   // Format: "08:40"
    subjectId: { type: String, required: true },
    subjectName: { type: String, required: true },
    teacherId: { type: String },
    teacherName: { type: String },
    venue: { type: String, required: true },
    duration: { type: Number, required: true }, // in minutes
    isBreak: { type: Boolean, default: false }
  }],
  status: { type: String, enum: ['Active', 'Draft', 'Archived'], default: 'Active' },
  createdBy: { type: String, required: true },
  lastModifiedBy: { type: String }
}, { timestamps: true });

// Academic Year Schema
const AcademicYearSchema = new Schema({
  year: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  currentTerm: { type: String, enum: ['First', 'Second', 'Third'], required: true },
  status: { type: String, enum: ['Active', 'Completed', 'Upcoming'], default: 'Active' },
  terms: {
    first: { 
      startDate: { type: Date, required: true }, 
      endDate: { type: Date, required: true } 
    },
    second: { 
      startDate: { type: Date, required: true }, 
      endDate: { type: Date, required: true } 
    },
    third: { 
      startDate: { type: Date, required: true }, 
      endDate: { type: Date, required: true } 
    }
  }
}, { timestamps: true });

// Create indexes for better performance
StudentSchema.index({ admissionNumber: 1 }, { unique: true });
StudentSchema.index({ classId: 1 });
StudentSchema.index({ status: 1 });

StaffSchema.index({ employeeId: 1 }, { unique: true });
StaffSchema.index({ email: 1 }, { unique: true });
StaffSchema.index({ department: 1 });
StaffSchema.index({ status: 1 });

AttendanceSchema.index({ studentId: 1, date: 1 });
AttendanceSchema.index({ classId: 1, date: 1 });

GradeSchema.index({ studentId: 1, term: 1, academicYear: 1 });
GradeSchema.index({ classId: 1, subjectId: 1 });

FeeSchema.index({ studentId: 1, academicYear: 1, term: 1 });
FeeSchema.index({ status: 1 });

PayrollSchema.index({ employeeId: 1, month: 1, year: 1 });
PayrollSchema.index({ status: 1 });

UserSchema.index({ email: 1 }, { unique: true });

SubjectSchema.index({ code: 1 }, { unique: true });

AcademicYearSchema.index({ year: 1 }, { unique: true });

// Export models
export const Student = models.Student || model('Student', StudentSchema);
export const Staff = models.Staff || model('Staff', StaffSchema);
export const Class = models.Class || model('Class', ClassSchema);
export const Subject = models.Subject || model('Subject', SubjectSchema);
export const Attendance = models.Attendance || model('Attendance', AttendanceSchema);
export const Grade = models.Grade || model('Grade', GradeSchema);
export const Fee = models.Fee || model('Fee', FeeSchema);
export const Payroll = models.Payroll || model('Payroll', PayrollSchema);
export const User = models.User || model('User', UserSchema);
export const Parent = models.Parent || model('Parent', ParentSchema);
export const Message = models.Message || model('Message', MessageSchema);
export const Timetable = models.Timetable || model('Timetable', TimetableSchema);
export const AcademicYear = models.AcademicYear || model('AcademicYear', AcademicYearSchema);

export { connectDB };
