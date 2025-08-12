'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { useRouter } from 'next/navigation';

interface StudentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  class: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  nationality: string;
  stateOfOrigin: string;
  localGovernment: string;
  bloodGroup: string;
  medicalConditions: string;
}

const initialFormData: StudentFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  dateOfBirth: '',
  gender: 'Male',
  address: '',
  class: '',
  parentName: '',
  parentPhone: '',
  parentEmail: '',
  nationality: 'Nigerian',
  stateOfOrigin: '',
  localGovernment: '',
  bloodGroup: '',
  medicalConditions: ''
};

const nigerianStates = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
  'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

const classes = [
  'JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3',
  'Pre-Nursery', 'Nursery 1', 'Nursery 2', 'Primary 1', 'Primary 2', 'Primary 3',
  'Primary 4', 'Primary 5', 'Primary 6', 'JSS 1A', 'JSS 1B', 'JSS 2A', 'JSS 2B',
  'JSS 3A', 'JSS 3B', 'SS 1A', 'SS 1B', 'SS 2A', 'SS 2B', 'SS 3A', 'SS 3B'
];

interface ClassOption {
  id: string;
  name: string;
}

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function AddStudentPage() {
  const [formData, setFormData] = useState<StudentFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<StudentFormData>>({});
  const [availableClasses, setAvailableClasses] = useState<ClassOption[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes');
      const data = await response.json();
      if (data.success) {
        setAvailableClasses(data.data.map((cls: any) => ({
          id: cls.id,
          name: cls.name
        })));
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      // Fallback to static classes if API fails
      setAvailableClasses(classes.map(name => ({ id: name, name })));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof StudentFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<StudentFormData> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.class) newErrors.class = 'Class is required';
    if (!formData.parentName.trim()) newErrors.parentName = 'Parent name is required';
    if (!formData.parentPhone.trim()) newErrors.parentPhone = 'Parent phone is required';
    if (!formData.stateOfOrigin) newErrors.stateOfOrigin = 'State of origin is required';
    if (!formData.localGovernment.trim()) newErrors.localGovernment = 'Local government is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || loading) {
      return;
    }

    try {
      setLoading(true);

      const requestData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address,
        parentName: formData.parentName,
        parentPhone: formData.parentPhone,
        parentEmail: formData.parentEmail,
        classId: formData.class,
        nationality: formData.nationality,
        stateOfOrigin: formData.stateOfOrigin,
        localGovernment: formData.localGovernment,
        status: 'Active'
      };
      
      console.log('Sending request data:', requestData);

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      let response;
      try {
        response = await fetch('/api/students', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          alert('Request timed out. Please try again.');
          console.error('Request timed out');
          return;
        }
        throw fetchError;
      }

      let data: any;
      const contentType = response.headers.get('content-type');
      
      console.log('Response status:', response.status);
      console.log('Response content-type:', contentType);
      console.log('Response ok:', response.ok);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (contentType && contentType.includes('application/json')) {
        try {
          const responseText = await response.text();
          console.log('Raw response text:', responseText);
          
          if (responseText.trim() === '') {
            alert('Server returned an empty response');
            console.error('Empty response from server');
            return;
          }
          
          try {
            data = JSON.parse(responseText);
            console.log('Parsed JSON data:', data);
          } catch (parseError) {
            console.error('JSON parse error:', parseError);
            alert(`Failed to parse server response: ${parseError}`);
            console.error('Response text that failed to parse:', responseText);
            return;
          }
        } catch (textError) {
          console.error('Failed to read response text:', textError);
          alert('Failed to read server response');
          return;
        }
      } else {
        // Not JSON, likely an error HTML page
        const text = await response.text();
        alert('Server returned an invalid response.\n' + text.substring(0, 300));
        console.error('Non-JSON response:', text);
        return;
      }

      // Check if data is valid
      if (!data || typeof data !== 'object') {
        const errorMsg = `Invalid response format from server. Received: ${JSON.stringify(data)}, type: ${typeof data}`;
        alert(errorMsg);
        console.error('Invalid data object:', data, 'type:', typeof data);
        return;
      }

      console.log('Received valid data object:', data);
      console.log('Data keys:', Object.keys(data));
      console.log('Data.success:', data.success);

      // Special check for empty objects
      if (Object.keys(data).length === 0) {
        const errorMsg = 'Server returned an empty object. This indicates a serious issue with the API response.';
        alert(errorMsg);
        console.error('Empty object received from server');
        return;
      }

      if (!data.success) {
        console.log('Processing failed response, data.success is false');
        console.log('Error details:', {
          error: data.error,
          missingFields: data.missingFields,
          dataKeys: Object.keys(data)
        });
        
        // Show backend error details if available
        let backendError = data.error || 'Failed to add student';
        // Add missing fields if present
        if (data.missingFields && Array.isArray(data.missingFields) && data.missingFields.length > 0) {
          backendError += '\nMissing fields: ' + data.missingFields.join(', ');
        }
        // If backend returns an empty object, show a more helpful message
        if (Object.keys(data).length === 0) {
          backendError = 'Backend returned an empty error object. This usually means the API did not send a proper error message. Please check your backend validation and error handling.';
        } else if (!data.error && (!data.missingFields || data.missingFields.length === 0)) {
          backendError += '\nRaw backend response: ' + JSON.stringify(data);
        }
        alert(backendError);
        console.error('Backend error:', data);
        return;
      }

      console.log('Student created successfully:', data);
      alert('Student added successfully!');
      if (data.data && data.data._id) {
        router.push(`/students/${data.data._id}`);
      } else {
        router.push('/students');
      }
    } catch (err: any) {
      console.error('Error adding student - full error object:', err);
      console.error('Error message:', err?.message);
      console.error('Error stack:', err?.stack);
      console.error('Error name:', err?.name);
      
      let errorMessage = 'Failed to add student';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err && typeof err === 'object') {
        errorMessage = JSON.stringify(err);
      }
      
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Student</h1>
            <p className="text-gray-600">Register a new student in the school system</p>
          </div>
          <button
            onClick={() => router.push('/students')}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Back to Students
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
        {/* Info: Student ID and password will be generated automatically */}
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
          <p className="text-sm text-blue-700">Student Login ID and a secure password will be generated automatically and sent to the student&apos;s email. The student can reset their password after first login.</p>
        </div>
          {/* Personal Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.firstName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter first name"
                />
                {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.lastName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter last name"
                />
                {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="student@paceyschool.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="+234-801-234-5678"
                />
                {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.dateOfBirth ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class <span className="text-red-500">*</span>
                </label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.class ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a class</option>
                  {/* Always show core classes first */}
                  {['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'].map(coreClass => (
                    <option key={coreClass} value={coreClass}>{coreClass}</option>
                  ))}
                  {/* Then show all other available classes, skipping duplicates */}
                  {availableClasses
                    .filter(cls => !['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'].includes(cls.name))
                    .map(cls => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                </select>
                {errors.class && <p className="mt-1 text-sm text-red-600">{errors.class}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State of Origin <span className="text-red-500">*</span>
                </label>
                <select
                  name="stateOfOrigin"
                  value={formData.stateOfOrigin}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.stateOfOrigin ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select state</option>
                  {nigerianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {errors.stateOfOrigin && <p className="mt-1 text-sm text-red-600">{errors.stateOfOrigin}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Local Government <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="localGovernment"
                  value={formData.localGovernment}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.localGovernment ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter local government"
                />
                {errors.localGovernment && <p className="mt-1 text-sm text-red-600">{errors.localGovernment}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select blood group</option>
                  {bloodGroups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.address ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter full address"
                />
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions</label>
                <textarea
                  name="medicalConditions"
                  value={formData.medicalConditions}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Any medical conditions or allergies (optional)"
                />
              </div>
            </div>
          </div>

          {/* Parent/Guardian Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Parent/Guardian Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent/Guardian Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.parentName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter parent/guardian name"
                />
                {errors.parentName && <p className="mt-1 text-sm text-red-600">{errors.parentName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="parentPhone"
                  value={formData.parentPhone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.parentPhone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="+234-803-987-6543"
                />
                {errors.parentPhone && <p className="mt-1 text-sm text-red-600">{errors.parentPhone}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Email</label>
                <input
                  type="email"
                  name="parentEmail"
                  value={formData.parentEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="parent@email.com (optional)"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/students')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding Student...' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
