'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface StaffFormData {
  employeeId: string;
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
  employmentType: string;
  gradeLevel: string;
  subjects: string[];
  classes: string[];
}

export default function AddStaffPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<StaffFormData>({
    employeeId: `STAFF-${Date.now()}`, // Auto-generate unique ID
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
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
    employmentType: 'permanent',
    gradeLevel: '',
    subjects: [],
    classes: []
  });

  const steps = [
    { id: 1, title: 'Personal Information', icon: '👤' },
    { id: 2, title: 'Employment Details', icon: '💼' },
    { id: 3, title: 'Contact & Emergency', icon: '📞' },
    { id: 4, title: 'Bank & Salary', icon: '💰' },
    { id: 5, title: 'Teaching Assignment', icon: '📚' }
  ];

  const departments = [
    'Science Department',
    'Mathematics Department',
    'Languages Department',
    'Social Studies Department',
    'Arts Department',
    'Physical Education',
    'Administration',
    'ICT Department',
    'Vocational Studies'
  ];

  const positions = [
    'Principal',
    'Vice Principal',
    'Head of Department',
    'Senior Teacher',
    'Teacher',
    'Assistant Teacher',
    'Librarian',
    'Laboratory Technician',
    'Administrative Officer',
    'Accountant',
    'Secretary',
    'Security Officer',
    'Cleaner'
  ];

  const nigerian_states = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe',
    'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
    'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
    'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
  ];

  const banks = [
    'Access Bank Nigeria',
    'Fidelity Bank Nigeria',
    'First Bank Nigeria',
    'First City Monument Bank',
    'Guaranty Trust Bank',
    'Heritage Banking Company',
    'Keystone Bank',
    'Polaris Bank',
    'Providus Bank',
    'Stanbic IBTC Bank',
    'Standard Chartered Bank',
    'Sterling Bank',
    'Union Bank Nigeria',
    'United Bank for Africa',
    'Unity Bank',
    'Wema Bank',
    'Zenith Bank'
  ];

  const subjects = [
    'Mathematics',
    'English Language',
    'Physics',
    'Chemistry',
    'Biology',
    'Geography',
    'History',
    'Economics',
    'Government',
    'Literature',
    'Agricultural Science',
    'Computer Studies',
    'Technical Drawing',
    'Fine Arts',
    'Music',
    'Physical Education',
    'Christian Religious Studies',
    'Islamic Religious Studies',
    'French',
    'Igbo',
    'Hausa',
    'Yoruba'
  ];

  const classes = [
    'JSS1A', 'JSS1B', 'JSS1C',
    'JSS2A', 'JSS2B', 'JSS2C',
    'JSS3A', 'JSS3B', 'JSS3C',
    'SS1A', 'SS1B', 'SS1C',
    'SS2A', 'SS2B', 'SS2C',
    'SS3A', 'SS3B', 'SS3C'
  ];

  const handleInputChange = (field: string, value: any) => {
    const fieldParts = field.split('.');
    
    if (fieldParts.length === 1) {
      // Simple field
      setFormData(prev => ({ ...prev, [field]: value }));
    } else if (fieldParts.length === 2) {
      // Two-level nesting (e.g., emergencyContact.name)
      const [parent, child] = fieldParts;
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof StaffFormData] as any),
          [child]: value
        }
      }));
    } else if (fieldParts.length === 3) {
      // Three-level nesting (e.g., salary.allowances.housing)
      const [parent, child, grandchild] = fieldParts;
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof StaffFormData] as any),
          [child]: {
            ...((prev[parent as keyof StaffFormData] as any)[child] as any),
            [grandchild]: value
          }
        }
      }));
    }
  };

  const calculateSalary = () => {
    const { basicSalary, allowances } = formData.salary;
    const grossSalary = basicSalary + Object.values(allowances).reduce((sum, val) => sum + val, 0);
    
    // Calculate deductions (simplified calculation)
    const pension = Math.round(grossSalary * 0.08); // 8% pension
    const tax = Math.round(grossSalary * 0.05); // 5% tax
    const nhis = 3000; // Fixed NHIS

    const totalDeductions = pension + tax + nhis;
    const netSalary = grossSalary - totalDeductions;

    setFormData(prev => ({
      ...prev,
      salary: {
        ...prev.salary,
        deductions: { pension, tax, nhis }
      }
    }));

    return { grossSalary, netSalary };
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { grossSalary, netSalary } = calculateSalary();
      
      const staffData = {
        ...formData,
        salary: {
          ...formData.salary,
          grossSalary,
          netSalary
        },
        status: 'active',
        performanceRating: 0,
        lastPromotionDate: formData.dateOfJoining,
        leaveBalance: 21,
        disciplinaryRecords: [],
        achievements: []
      };

      const response = await fetch('/api/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'staff', ...staffData }),
      });

      const data = await response.json();
      
      if (data.success) {
        router.push('/staff');
      } else {
        alert('Error adding staff member: ' + data.error);
      }
    } catch (error) {
      console.error('Error adding staff:', error);
      alert('Error adding staff member');
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.employeeId && formData.firstName && formData.lastName && formData.email && formData.phone &&
               formData.dateOfBirth && formData.gender && formData.address;
      case 2:
        return formData.position && formData.department && formData.qualification &&
               formData.dateOfJoining && formData.employmentType;
      case 3:
        return formData.emergencyContact.name && formData.emergencyContact.phone;
      case 4:
        return formData.bankDetails.accountName && formData.bankDetails.accountNumber &&
               formData.bankDetails.bankName && formData.salary.basicSalary > 0;
      case 5:
        return true; // Optional step
      default:
        return false;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/staff')}
            className="text-gray-400 hover:text-gray-600"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">➕ Add New Staff Member</h1>
            <p className="text-sm text-gray-600">Fill in the information to add a new staff member</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step.id ? '✓' : step.icon}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block w-16 h-0.5 ml-6 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">👤 Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID *</label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => handleInputChange('employeeId', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter employee ID (e.g., STAFF-001)"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter first name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter last name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="08012345678"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
                  <select
                    value={formData.maritalStatus}
                    onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State of Origin</label>
                  <select
                    value={formData.stateOfOrigin}
                    onChange={(e) => handleInputChange('stateOfOrigin', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select State</option>
                    {nigerian_states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
                  <select
                    value={formData.religion}
                    onChange={(e) => handleInputChange('religion', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Religion</option>
                    <option value="Christianity">Christianity</option>
                    <option value="Islam">Islam</option>
                    <option value="Traditional">Traditional</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter full address"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">💼 Employment Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position *</label>
                  <select
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Position</option>
                    {positions.map(position => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qualification *</label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => handleInputChange('qualification', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., B.Ed Mathematics"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                  <input
                    type="number"
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Joining *</label>
                  <input
                    type="date"
                    value={formData.dateOfJoining}
                    onChange={(e) => handleInputChange('dateOfJoining', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type *</label>
                  <select
                    value={formData.employmentType}
                    onChange={(e) => handleInputChange('employmentType', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="permanent">Permanent</option>
                    <option value="contract">Contract</option>
                    <option value="part-time">Part-time</option>
                    <option value="intern">Intern</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
                  <input
                    type="text"
                    value={formData.gradeLevel}
                    onChange={(e) => handleInputChange('gradeLevel', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., GL-12"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">📞 Contact & Emergency Information</h2>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">🚨 Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                    <input
                      type="text"
                      value={formData.emergencyContact?.name || ''}
                      onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Emergency contact name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                    <input
                      type="text"
                      value={formData.emergencyContact?.relationship || ''}
                      onChange={(e) => handleInputChange('emergencyContact.relationship', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Spouse, Parent, Sibling"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={formData.emergencyContact?.phone || ''}
                      onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="08012345678"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">💰 Bank Details & Salary</h2>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">🏦 Bank Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Name *</label>
                    <input
                      type="text"
                      value={formData.bankDetails?.accountName || ''}
                      onChange={(e) => handleInputChange('bankDetails.accountName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Account holder name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Number *</label>
                    <input
                      type="text"
                      value={formData.bankDetails?.accountNumber || ''}
                      onChange={(e) => handleInputChange('bankDetails.accountNumber', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0123456789"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name *</label>
                    <select
                      value={formData.bankDetails?.bankName || ''}
                      onChange={(e) => handleInputChange('bankDetails.bankName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      value={formData.bankDetails?.bvn || ''}
                      onChange={(e) => handleInputChange('bankDetails.bvn', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="12345678901"
                      maxLength={11}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">💰 Salary Structure</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Basic Salary (₦) *</label>
                    <input
                      type="number"
                      value={formData.salary?.basicSalary || 0}
                      onChange={(e) => handleInputChange('salary.basicSalary', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="150000"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Housing Allowance (₦)</label>
                    <input
                      type="number"
                      value={formData.salary?.allowances?.housing || 0}
                      onChange={(e) => handleInputChange('salary.allowances.housing', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="50000"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Transport Allowance (₦)</label>
                    <input
                      type="number"
                      value={formData.salary?.allowances?.transport || 0}
                      onChange={(e) => handleInputChange('salary.allowances.transport', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="25000"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meal Allowance (₦)</label>
                    <input
                      type="number"
                      value={formData.salary?.allowances?.meal || 0}
                      onChange={(e) => handleInputChange('salary.allowances.meal', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="15000"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teaching Allowance (₦)</label>
                    <input
                      type="number"
                      value={formData.salary?.allowances?.teaching || 0}
                      onChange={(e) => handleInputChange('salary.allowances.teaching', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="30000"
                      min="0"
                    />
                  </div>
                </div>

                {/* Salary Summary */}
                {formData.salary.basicSalary > 0 && (
                  <div className="mt-6 bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Salary Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Basic Salary:</span>
                        <span>{formatCurrency(formData.salary.basicSalary)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Allowances:</span>
                        <span>{formatCurrency(Object.values(formData.salary.allowances).reduce((sum, val) => sum + val, 0))}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-2">
                        <span>Gross Salary:</span>
                        <span className="text-green-600">
                          {formatCurrency(formData.salary.basicSalary + Object.values(formData.salary.allowances).reduce((sum, val) => sum + val, 0))}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">📚 Teaching Assignment (Optional)</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subjects</label>
                  <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                    {subjects.map(subject => (
                      <label key={subject} className="flex items-center space-x-2 mb-2">
                        <input
                          type="checkbox"
                          checked={formData.subjects.includes(subject)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleInputChange('subjects', [...formData.subjects, subject]);
                            } else {
                              handleInputChange('subjects', formData.subjects.filter(s => s !== subject));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">{subject}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Classes</label>
                  <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                    {classes.map(className => (
                      <label key={className} className="flex items-center space-x-2 mb-2">
                        <input
                          type="checkbox"
                          checked={formData.classes.includes(className)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleInputChange('classes', [...formData.classes, className]);
                            } else {
                              handleInputChange('classes', formData.classes.filter(c => c !== className));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">{className}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Selected Summary */}
              {(formData.subjects.length > 0 || formData.classes.length > 0) && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Selected Assignments</h4>
                  {formData.subjects.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Subjects:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.subjects.map(subject => (
                          <span key={subject} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {formData.classes.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Classes:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.classes.map(className => (
                          <span key={className} className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                            {className}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <button
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            
            {currentStep < 5 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!isStepValid()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !isStepValid()}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                <span>{loading ? 'Adding Staff...' : '✓ Add Staff Member'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
