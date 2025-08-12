'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';

interface Teacher {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  qualification: string;
  specialization: string;
  dateOfHire: string;
  salary: number;
  status: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  } | string;
  nationality: string;
  stateOfOrigin: string;
  subjects: string[];
  classes: string[];
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingTeacher, setViewingTeacher] = useState<Teacher | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchTeachers() {
      try {
        setLoading(true);
        const response = await fetch('/api/teachers');
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch teachers');
        }
        
        setTeachers(data.data);
      } catch (err) {
        console.error('Error fetching teachers:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchTeachers();
  }, []);

  // Filter teachers based on search term and specialization
  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = 
      teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialization = selectedSpecialization === '' || teacher.specialization === selectedSpecialization;
    
    return matchesSearch && matchesSpecialization;
  });

  // Get unique specializations for filter dropdown, filter out empty/undefined
  const specializations = [...new Set(teachers.map(teacher => teacher.specialization).filter(Boolean))];

  // Handler functions
  const handleViewTeacher = (teacher: Teacher) => {
    setViewingTeacher(teacher);
    setShowViewModal(true);
  };

  const handleEditTeacher = (teacherId: string) => {
    router.push(`/teachers/${teacherId}/edit`);
  };

  const handleDeleteClick = (teacher: Teacher) => {
    setTeacherToDelete(teacher);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!teacherToDelete) return;

    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/teachers/${teacherToDelete.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to delete teacher');
      }

      // Remove teacher from local state
      setTeachers(teachers.filter(t => t.id !== teacherToDelete.id));
      setShowDeleteModal(false);
      setTeacherToDelete(null);
      alert(`✅ Teacher ${teacherToDelete.firstName} ${teacherToDelete.lastName} has been deleted successfully!`);
    } catch (error) {
      console.error('Error deleting teacher:', error);
      alert(`❌ Failed to delete teacher. ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setTeacherToDelete(null);
  };

  if (error) {
    return (
      <DashboardLayout userRole="admin">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-400 text-xl">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading teachers</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-100 px-3 py-1 rounded text-sm font-medium text-red-800 hover:bg-red-200"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Teachers Management</h1>
            <p className="text-gray-600">Manage teaching staff and their assignments</p>
          </div>
          <button 
            onClick={() => router.push('/teachers/add')}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Add New Teacher
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search teachers by name, ID, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Specializations</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Teachers Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Teachers List ({filteredTeachers.length} teachers)
            </h3>
          </div>
          
          {loading ? (
            <div className="p-6">
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teacher
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Specialization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subjects
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Classes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTeachers.map((teacher, index) => (
                    <tr key={teacher.id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-green-700">
                                {teacher.firstName[0]}{teacher.lastName[0]}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {teacher.firstName} {teacher.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {teacher.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {teacher.employeeId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {teacher.specialization}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="max-w-xs">
                          {teacher.subjects.join(', ')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="max-w-xs">
                          {teacher.classes.join(', ')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          teacher.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {teacher.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleViewTeacher(teacher)}
                            className="text-primary-600 hover:text-primary-900 font-medium"
                          >
                            👁️ View
                          </button>
                          <button 
                            onClick={() => handleEditTeacher(teacher.id)}
                            className="text-yellow-600 hover:text-yellow-900 font-medium"
                          >
                            ✏️ Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(teacher)}
                            className="text-red-600 hover:text-red-900 font-medium"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {!loading && filteredTeachers.length === 0 && (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">👨‍🏫</span>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No teachers found</h3>
              <p className="text-gray-500">
                {searchTerm || selectedSpecialization 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'Get started by adding your first teacher.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* View Teacher Modal */}
      {showViewModal && viewingTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">👨‍🏫 Teacher Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mr-4">
                  <span className="text-xl font-bold text-green-700">
                    {viewingTeacher.firstName[0]}{viewingTeacher.lastName[0]}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {viewingTeacher.firstName} {viewingTeacher.lastName}
                  </h3>
                  <p className="text-gray-600">{viewingTeacher.specialization}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    viewingTeacher.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {viewingTeacher.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 border-b pb-2">📋 Basic Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Employee ID</label>
                      <p className="text-gray-900">{viewingTeacher.employeeId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900">{viewingTeacher.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone Number</label>
                      <p className="text-gray-900">{viewingTeacher.phoneNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Gender</label>
                      <p className="text-gray-900">{viewingTeacher.gender}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                      <p className="text-gray-900">{new Date(viewingTeacher.dateOfBirth).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 border-b pb-2">🎓 Professional Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Qualification</label>
                      <p className="text-gray-900">{viewingTeacher.qualification}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Specialization</label>
                      <p className="text-gray-900">{viewingTeacher.specialization}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date of Hire</label>
                      <p className="text-gray-900">{new Date(viewingTeacher.dateOfHire).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Salary</label>
                      <p className="text-gray-900">₦{viewingTeacher.salary.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Subjects</label>
                      <p className="text-gray-900">{viewingTeacher.subjects.join(', ') || 'Not assigned'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Classes</label>
                      <p className="text-gray-900">{viewingTeacher.classes.join(', ') || 'Not assigned'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 border-b pb-2 mb-3">📍 Additional Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="text-gray-900">{viewingTeacher.address}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Emergency Contact</label>
                    {typeof viewingTeacher.emergencyContact === 'object' && viewingTeacher.emergencyContact !== null ? (
                      <div className="text-gray-900">
                        <div><span className="font-medium">Name:</span> {viewingTeacher.emergencyContact.name}</div>
                        <div><span className="font-medium">Relationship:</span> {viewingTeacher.emergencyContact.relationship}</div>
                        <div><span className="font-medium">Phone:</span> {viewingTeacher.emergencyContact.phone}</div>
                      </div>
                    ) : (
                      <p className="text-gray-900">{viewingTeacher.emergencyContact || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nationality</label>
                    <p className="text-gray-900">{viewingTeacher.nationality}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">State of Origin</label>
                    <p className="text-gray-900">{viewingTeacher.stateOfOrigin}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end space-x-3">
              <button 
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  setShowViewModal(false);
                  handleEditTeacher(viewingTeacher.id);
                }}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
              >
                ✏️ Edit Teacher
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && teacherToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                  <span className="text-red-600 text-xl">⚠️</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Teacher</h3>
                  <p className="text-gray-600">This action cannot be undone</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-700">
                  Are you sure you want to delete <strong>{teacherToDelete.firstName} {teacherToDelete.lastName}</strong>? 
                  This will permanently remove their record from the system.
                </p>
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="text-sm text-red-800">
                    <p><strong>Employee ID:</strong> {teacherToDelete.employeeId}</p>
                    <p><strong>Specialization:</strong> {teacherToDelete.specialization}</p>
                    <p><strong>Classes:</strong> {teacherToDelete.classes.join(', ') || 'None'}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button 
                  onClick={handleDeleteCancel}
                  disabled={deleteLoading}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteConfirm}
                  disabled={deleteLoading}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteLoading ? '⏳ Deleting...' : '🗑️ Delete Teacher'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
