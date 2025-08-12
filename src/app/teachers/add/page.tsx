'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface TeacherForm {
  // employeeId will be generated automatically by the backend
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  qualification: string;
  experience: number;
  dateOfJoining: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  address: string;
  stateOfOrigin: string;
  nationality: string;
  religion: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    bvn: string;
  };
  salary: {
    basicSalary: number;
    allowances: {
      housing: number;
      transport: number;
      meal: number;
      teaching: number;
    };
    deductions: {
      pension: number;
      tax: number;
      nhis: number;
    };
  };
  status: string;
  employmentType: string;
  gradeLevel: string;
  subjects: string[];
  classes: string[];
  teachingLoad: number;
  specializations: string[];
}

export default function AddTeacherPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState<TeacherForm>({
    // employeeId will be generated automatically
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: 'Teacher',
    department: '',
    qualification: '',
    experience: 0,
    dateOfJoining: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    address: '',
    stateOfOrigin: '',
    nationality: 'Nigerian',
    religion: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    bankDetails: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      bvn: ''
    },
    salary: {
      basicSalary: 0,
      allowances: {
        housing: 0,
        transport: 0,
        meal: 0,
        teaching: 0
      },
      deductions: {
        pension: 0,
        tax: 0,
        nhis: 0
      }
    },
    status: 'active',
    employmentType: 'full-time',
    gradeLevel: '',
    subjects: [],
    classes: [],
    teachingLoad: 0,
    specializations: []
  });

  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River',
    'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano',
    'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun',
    'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
  ];

  const subjects = [
    'Mathematics', 'English Language', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Government',
    'Literature', 'Geography', 'History', 'Agricultural Science', 'Computer Science', 'Technical Drawing',
    'Fine Arts', 'Music', 'Physical Education', 'French', 'Igbo', 'Hausa', 'Yoruba', 'Islamic Studies',
    'Christian Religious Studies', 'Civic Education', 'Home Economics', 'Business Studies'
  ];

  // Dynamic classes list
  const [classes, setClasses] = useState<string[]>([]);
  const [classesLoading, setClassesLoading] = useState(true);
  const [classesError, setClassesError] = useState<string | null>(null);
  // Fallback static classes
  const staticClasses = [
    'JSS 1A', 'JSS 1B', 'JSS 1C', 'JSS 2A', 'JSS 2B', 'JSS 2C', 'JSS 3A', 'JSS 3B', 'JSS 3C',
    'SS 1A', 'SS 1B', 'SS 1C', 'SS 2A', 'SS 2B', 'SS 2C', 'SS 3A', 'SS 3B', 'SS 3C'
  ];

  // Add Class Modal State
  const [showAddClass, setShowAddClass] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [addingClass, setAddingClass] = useState(false);
  const [addClassError, setAddClassError] = useState<string | null>(null);

  // Fetch classes from API
  React.useEffect(() => {
    const fetchClasses = async () => {
      setClassesLoading(true);
      setClassesError(null);
      try {
        const res = await fetch('/api/classes');
        if (!res.ok) throw new Error('Failed to fetch classes');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setClasses(data.map((c: any) => c.name || c.className || ''));
        } else if (Array.isArray(data.classes)) {
          setClasses(data.classes.map((c: any) => c.name || c.className || ''));
        } else {
          setClasses(staticClasses);
        }
      } catch (err: any) {
        setClassesError('Could not load classes from server. Showing static list.');
        setClasses(staticClasses);
      } finally {
        setClassesLoading(false);
      }
    };
    fetchClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const departments = [
    'Sciences', 'Arts', 'Commercial', 'Languages', 'Technical', 'Vocational', 'Administration'
  ];

  const banks = [
    'Access Bank', 'First Bank', 'GTBank', 'UBA', 'Zenith Bank', 'Fidelity Bank', 'FCMB',
    'Sterling Bank', 'Union Bank', 'Wema Bank', 'Polaris Bank', 'Ecobank', 'Stanbic IBTC'
  ];

  // Common Nigerian school specializations
  const specializations = [
    'Science',
    'Arts',
    'Commercial',
    'Technical',
    'Languages',
    'Vocational',
    'ICT',
    'Humanities',
    'Social Sciences',
    'Sports',
    'Guidance & Counselling',
    'Special Needs',
    'Other'
  ];

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => {
        const parentValue = prev[parent as keyof TeacherForm];
        if (typeof parentValue === 'object' && parentValue !== null && !Array.isArray(parentValue)) {
          return {
            ...prev,
            [parent]: {
              ...parentValue,
              [child]: value
            }
          };
        }
        return prev;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleArrayChange = (field: string, value: string) => {
    setFormData(prev => {
      const arr = prev[field as keyof TeacherForm];
      if (Array.isArray(arr)) {
        return {
          ...prev,
          [field]: arr.includes(value)
            ? arr.filter(item => item !== value)
            : [...arr, value]
        };
      }
      return prev;
    });
  };

  const calculateSalary = () => {
    const { basicSalary, allowances, deductions } = formData.salary;
    const totalAllowances = allowances.housing + allowances.transport + allowances.meal + allowances.teaching;
    const totalDeductions = deductions.pension + deductions.tax + deductions.nhis;
    const grossSalary = basicSalary + totalAllowances;
    const netSalary = grossSalary - totalDeductions;
    
    return { grossSalary, netSalary };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation for required fields
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.specializations || formData.specializations.length === 0) {
      alert('❌ Please fill in all required fields: First Name, Last Name, Email, and at least one Specialization.');
      return;
    }

    setLoading(true);
    try {
      const { grossSalary, netSalary } = calculateSalary();
      const teacherData = {
        ...formData,
        salary: {
          ...formData.salary,
          grossSalary,
          netSalary
        },
        performanceRating: 0,
        lastPromotionDate: formData.dateOfJoining,
        leaveBalance: 30,
        disciplinaryRecords: [],
        achievements: []
      };

      const response = await fetch('/api/teachers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teacherData),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('✅ Teacher added successfully!');
        router.push('/teachers');
      } else {
        console.error('API Error:', data.error);
        alert('❌ Error adding teacher: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding teacher:', error);
      alert('❌ Error adding teacher: ' + (error instanceof Error ? error.message : 'Network error. Please check your connection and try again.'));
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">👤 Personal Information</h3>
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-700">Employee ID and a secure password will be generated automatically and sent to the teacher&apos;s email. The teacher can reset their password after first login.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                <select
                  required
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Teacher">Teacher</option>
                  <option value="Senior Teacher">Senior Teacher</option>
                  <option value="Principal Teacher">Principal Teacher</option>
                  <option value="Assistant Principal">Assistant Principal</option>
                  <option value="Vice Principal">Vice Principal</option>
                  <option value="Principal">Principal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+234xxxxxxxxxx"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  required
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
                <select
                  value={formData.maritalStatus}
                  onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State of Origin</label>
                <select
                  required
                  value={formData.stateOfOrigin}
                  onChange={(e) => handleInputChange('stateOfOrigin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select State</option>
                  {nigerianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
                <select
                  value={formData.religion}
                  onChange={(e) => handleInputChange('religion', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Religion</option>
                  <option value="christianity">Christianity</option>
                  <option value="islam">Islam</option>
                  <option value="traditional">Traditional</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Home Address</label>
              <textarea
                required
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Full residential address"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">🎓 Professional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ...existing code for department, qualification, experience, dateOfJoining, employmentType, gradeLevel, teachingLoad, status... */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select
                  required
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Highest Qualification</label>
                <select
                  required
                  value={formData.qualification}
                  onChange={(e) => handleInputChange('qualification', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Qualification</option>
                  <option value="NCE">NCE (National Certificate in Education)</option>
                  <option value="B.A./B.Sc.">B.A./B.Sc.</option>
                  <option value="B.Ed.">B.Ed. (Bachelor of Education)</option>
                  <option value="M.A./M.Sc.">M.A./M.Sc.</option>
                  <option value="M.Ed.">M.Ed. (Master of Education)</option>
                  <option value="Ph.D.">Ph.D.</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                <input
                  type="number"
                  min="0"
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Joining</label>
                <input
                  type="date"
                  required
                  value={formData.dateOfJoining}
                  onChange={(e) => handleInputChange('dateOfJoining', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
                <select
                  value={formData.employmentType}
                  onChange={(e) => handleInputChange('employmentType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="temporary">Temporary</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
                <select
                  value={formData.gradeLevel}
                  onChange={(e) => handleInputChange('gradeLevel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Grade Level</option>
                  <option value="GL 07">GL 07</option>
                  <option value="GL 08">GL 08</option>
                  <option value="GL 09">GL 09</option>
                  <option value="GL 10">GL 10</option>
                  <option value="GL 12">GL 12</option>
                  <option value="GL 13">GL 13</option>
                  <option value="GL 14">GL 14</option>
                  <option value="GL 15">GL 15</option>
                  <option value="GL 16">GL 16</option>
                  <option value="GL 17">GL 17</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teaching Load (Hours/Week)</label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={formData.teachingLoad}
                  onChange={(e) => handleInputChange('teachingLoad', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on leave">On Leave</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            {/* Specializations Multi-select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">🎯 Specializations <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {specializations.map(spec => (
                  <label key={spec} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.specializations.includes(spec)}
                      onChange={() => handleArrayChange('specializations', spec)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{spec}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">Select at least one area of specialization.</p>
            </div>

            {/* ...existing code for subjects and classes... */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">📚 Subjects Teaching</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {subjects.map(subject => (
                  <label key={subject} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.subjects.includes(subject)}
                      onChange={() => handleArrayChange('subjects', subject)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{subject}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">🏫 Classes Assigned <span className="text-red-500">*</span></label>
                <button
                  type="button"
                  onClick={() => setShowAddClass(true)}
                  className="text-blue-600 hover:underline text-xs font-medium flex items-center"
                >
                  <span className="text-lg mr-1">＋</span> Add Class
                </button>
              </div>
              {classesLoading ? (
                <div className="text-blue-600 flex items-center space-x-2 py-2">
                  <span className="animate-spin mr-2">🔄</span>
                  <span>Loading classes...</span>
                </div>
              ) : (
                <>
                  {classesError && (
                    <div className="text-xs text-red-500 mb-2">{classesError}</div>
                  )}
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
                    {classes.length === 0 ? (
                      <span className="text-gray-400 col-span-full">No classes available</span>
                    ) : (
                      classes.map(className => (
                        <label key={className} className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            checked={formData.classes.includes(className)}
                            onChange={() => handleArrayChange('classes', className)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>{className}</span>
                        </label>
                      ))
                    )}
                  </div>
                </>
              )}

              {/* Add Class Modal */}
              {showAddClass && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
                    <button
                      type="button"
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
                      onClick={() => setShowAddClass(false)}
                      aria-label="Close"
                    >
                      ×
                    </button>
                    <h4 className="text-lg font-semibold mb-4 text-blue-700 flex items-center"><span className="mr-2">🏫</span>Add New Class</h4>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!newClassName.trim()) return;
                        setAddingClass(true);
                        setAddClassError(null);
                        try {
                          // Optimistically update UI
                          setClasses(prev => [...prev, newClassName]);
                          // Optionally, POST to API
                          const res = await fetch('/api/classes', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ name: newClassName })
                          });
                          if (!res.ok) throw new Error('Failed to add class');
                          setShowAddClass(false);
                          setNewClassName('');
                        } catch (err: any) {
                          setAddClassError('Could not add class. Please try again.');
                        } finally {
                          setAddingClass(false);
                        }
                      }}
                    >
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                        placeholder="e.g. JSS 1D"
                        value={newClassName}
                        onChange={e => setNewClassName(e.target.value)}
                        autoFocus
                        required
                      />
                      {addClassError && <div className="text-xs text-red-500 mb-2">{addClassError}</div>}
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium w-full"
                        disabled={addingClass}
                      >
                        {addingClass ? 'Adding...' : 'Add Class'}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">📞 Emergency Contact & Bank Details</h3>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">🚨 Emergency Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                  <input
                    type="text"
                    required
                    value={formData.emergencyContact.name}
                    onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                  <select
                    required
                    value={formData.emergencyContact.relationship}
                    onChange={(e) => handleInputChange('emergencyContact.relationship', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Relationship</option>
                    <option value="spouse">Spouse</option>
                    <option value="parent">Parent</option>
                    <option value="sibling">Sibling</option>
                    <option value="child">Child</option>
                    <option value="friend">Friend</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.emergencyContact.phone}
                    onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+234xxxxxxxxxx"
                  />
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">🏦 Bank Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
                  <input
                    type="text"
                    required
                    value={formData.bankDetails.accountName}
                    onChange={(e) => handleInputChange('bankDetails.accountName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                  <input
                    type="text"
                    required
                    value={formData.bankDetails.accountNumber}
                    onChange={(e) => handleInputChange('bankDetails.accountNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0123456789"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                  <select
                    required
                    value={formData.bankDetails.bankName}
                    onChange={(e) => handleInputChange('bankDetails.bankName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Bank</option>
                    {banks.map(bank => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">BVN</label>
                  <input
                    type="text"
                    value={formData.bankDetails.bvn}
                    onChange={(e) => handleInputChange('bankDetails.bvn', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="12345678901"
                    maxLength={11}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">💰 Salary Structure</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">💵 Basic Salary & Allowances</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Basic Salary (₦)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.salary.basicSalary}
                      onChange={(e) => handleInputChange('salary.basicSalary', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Housing Allowance (₦)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.salary.allowances.housing}
                      onChange={(e) => handleInputChange('salary.allowances.housing', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Transport Allowance (₦)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.salary.allowances.transport}
                      onChange={(e) => handleInputChange('salary.allowances.transport', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meal Allowance (₦)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.salary.allowances.meal}
                      onChange={(e) => handleInputChange('salary.allowances.meal', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teaching Allowance (₦)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.salary.allowances.teaching}
                      onChange={(e) => handleInputChange('salary.allowances.teaching', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">➖ Deductions</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pension (₦)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.salary.deductions.pension}
                      onChange={(e) => handleInputChange('salary.deductions.pension', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tax (₦)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.salary.deductions.tax}
                      onChange={(e) => handleInputChange('salary.deductions.tax', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">NHIS (₦)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.salary.deductions.nhis}
                      onChange={(e) => handleInputChange('salary.deductions.nhis', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">📊 Salary Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-white rounded-lg p-3">
                  <p className="text-sm text-gray-600">Gross Salary</p>
                  <p className="text-xl font-bold text-blue-600">
                    ₦{calculateSalary().grossSalary.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-sm text-gray-600">Total Deductions</p>
                  <p className="text-xl font-bold text-red-600">
                    ₦{(formData.salary.deductions.pension + formData.salary.deductions.tax + formData.salary.deductions.nhis).toLocaleString()}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-sm text-gray-600">Net Salary</p>
                  <p className="text-xl font-bold text-green-600">
                    ₦{calculateSalary().netSalary.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">➕ Add New Teacher</h1>
            <p className="mt-2 text-sm text-gray-600">
              Add a new teacher to your school management system
            </p>
          </div>
          <button
            onClick={() => router.push('/teachers')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            ← Back to Teachers
          </button>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    currentStep >= step ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {step === 1 && 'Personal Info'}
                    {step === 2 && 'Professional'}
                    {step === 3 && 'Contact & Bank'}
                    {step === 4 && 'Salary'}
                  </p>
                </div>
                {step < totalSteps && (
                  <div className={`mx-4 h-1 w-16 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? '⏳ Adding Teacher...' : '✅ Add Teacher'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
