'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface Class {
  id: string;
  name: string;
  level: string;
  section: string;
  capacity: number;
  currentEnrollment: number;
  classTeacherId: string;
  subjects: string[];
  academicYear: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

export default function AdminClassesPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentView, setCurrentView] = useState<'list' | 'grid'>('list');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClass, setNewClass] = useState({
    name: '',
    level: '',
    section: '',
    capacity: 40,
    classroom: '',
    classTeacher: '',
    academicYear: '2024/2025',
    term: 'First Term'
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      console.log('🔍 Fetching classes from API...');
      const response = await fetch('/api/classes');
      console.log('📡 API Response status:', response.status);
      
      const data = await response.json();
      console.log('📊 API Response data:', data);
      
      if (data.success) {
        console.log('✅ Classes data received:', data.data?.length || 0, 'classes');
        setClasses(data.data || []);
      } else {
        console.error('❌ API returned error:', data.error);
      }
    } catch (error) {
      console.error('🚨 Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const classData = {
        name: newClass.name,
        level: newClass.level.replace(' ', ''), // Convert "JSS 1" to "JSS1"
        section: newClass.section,
        capacity: newClass.capacity,
        classTeacherId: `TCH${Date.now()}`, // Generate a temporary teacher ID
        academicYear: newClass.academicYear,
        currentEnrollment: 0,
        subjects: [], // Empty array for now
        status: 'Active'
      };

      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(classData),
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ Class created successfully!');
        setShowAddModal(false);
        setNewClass({
          name: '',
          level: '',
          section: '',
          capacity: 40,
          classroom: '',
          classTeacher: '',
          academicYear: '2024/2025',
          term: 'First Term'
        });
        fetchClasses();
      } else {
        alert('❌ Error creating class: ' + (data.error || data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating class:', error);
      alert('❌ Error creating class. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClass = async (id: string) => {
    if (confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/classes?id=${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.success) {
          alert('✅ Class deleted successfully!');
          fetchClasses();
        } else {
          alert('❌ Error deleting class: ' + (data.error || data.message || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error deleting class:', error);
        alert('❌ Error deleting class. Please try again.');
      }
    }
  };

  const handleGenerateReport = () => {
    try {
      console.log('Generate report clicked. Filtered classes count:', filteredClasses.length);
      
      if (filteredClasses.length === 0) {
        alert('⚠️ No class data to export. Please add classes first.');
        return;
      }

      // Generate CSV data
      const csvData = filteredClasses.map(cls => ({
        'Class ID': cls.id || '',
        'Class Name': cls.name || '',
        'Level': cls.level || '',
        'Section': cls.section || '',
        'Capacity': cls.capacity || 0,
        'Current Enrollment': cls.currentEnrollment || 0,
        'Enrollment Percentage': cls.capacity > 0 ? `${Math.round((cls.currentEnrollment / cls.capacity) * 100)}%` : '0%',
        'Class Teacher ID': cls.classTeacherId || '',
        'Academic Year': cls.academicYear || '',
        'Status': cls.status || '',
        'Total Subjects': cls.subjects?.length || 0,
        'Subject Names': cls.subjects?.join('; ') || '',
        'Available Spots': (cls.capacity - cls.currentEnrollment) || 0,
        'Created Date': cls.createdAt ? new Date(cls.createdAt).toLocaleDateString() : ''
      }));

      console.log('CSV data prepared:', csvData.length, 'records');

      // Convert to CSV
      const headers = Object.keys(csvData[0] || {});
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => 
          headers.map(header => {
            const value = row[header as keyof typeof row];
            // Escape quotes and wrap in quotes if contains comma
            const stringValue = String(value || '');
            return stringValue.includes(',') || stringValue.includes('"') 
              ? `"${stringValue.replace(/"/g, '""')}"` 
              : stringValue;
          }).join(',')
        )
      ].join('\n');

      console.log('CSV content created, length:', csvContent.length);

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `classes_report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('File download initiated');
      alert(`✅ Classes report generated successfully! ${filteredClasses.length} records exported.`);
      
    } catch (error) {
      console.error('Error generating report:', error);
      alert('❌ Error generating report. Please check the console for details.');
    }
  };

  // Filter classes based on search and filters
  const filteredClasses = (classes || []).filter(cls => {
    const matchesSearch = searchTerm === '' || 
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.classTeacherId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = filterLevel === '' || cls.level === filterLevel;
    const matchesStatus = filterStatus === '' || cls.status === filterStatus;
    
    return matchesSearch && matchesLevel && matchesStatus;
  });

  // Get unique levels for filter
  const levels = [...new Set((classes || []).map(cls => cls.level))];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCapacityColor = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (loading) {
    return (
      <DashboardLayout userRole="admin">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🏫 Class Management</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage school classes, assignments, and capacity
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              ➕ Add Class
            </button>
            <button 
              onClick={() => {
                console.log('Button clicked!');
                handleGenerateReport();
              }}
              disabled={filteredClasses.length === 0}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📊 Generate Report
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <span className="text-2xl">🏫</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Classes</p>
                <p className="text-2xl font-bold text-gray-900">{(classes || []).length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Classes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(classes || []).filter(c => c.status === 'Active').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <span className="text-2xl">👨‍🎓</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(classes || []).reduce((sum, cls) => sum + cls.currentEnrollment, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Capacity</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(classes || []).length > 0 
                    ? Math.round(((classes || []).reduce((sum, cls) => sum + cls.currentEnrollment, 0) / (classes || []).reduce((sum, cls) => sum + cls.capacity, 0)) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="Search classes by name, level, or teacher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Levels</option>
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setCurrentView('list')}
                  className={`px-4 py-2 ${currentView === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  📋
                </button>
                <button
                  onClick={() => setCurrentView('grid')}
                  className={`px-4 py-2 ${currentView === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  ⊞
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Classes List/Grid */}
        {filteredClasses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <div className="text-6xl mb-4">🏫</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No classes found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or create a new class.</p>
          </div>
        ) : currentView === 'list' ? (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class Teacher
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Enrollment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Academic Year
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
                  {filteredClasses.map((cls) => (
                    <tr key={cls.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {cls.level.charAt(0)}{cls.section}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {cls.name}
                            </div>
                            <div className="text-sm text-gray-500">{cls.level} - {cls.section}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Teacher ID: {cls.classTeacherId}</div>
                        <div className="text-sm text-gray-500">{cls.subjects.length} subjects</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <span className={getCapacityColor(cls.currentEnrollment, cls.capacity)}>
                            {cls.currentEnrollment}/{cls.capacity}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className={`h-2 rounded-full ${
                              (cls.currentEnrollment / cls.capacity) >= 0.9 ? 'bg-red-500' :
                              (cls.currentEnrollment / cls.capacity) >= 0.75 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{width: `${Math.min((cls.currentEnrollment / cls.capacity) * 100, 100)}%`}}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cls.academicYear}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(cls.status)}`}>
                          {cls.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => router.push(`/admin/classes/${cls.id}`)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            👁️ View
                          </button>
                          <button 
                            onClick={() => router.push(`/admin/classes/${cls.id}`)}
                            className="text-green-600 hover:text-green-900"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClass(cls.id)}
                            className="text-red-600 hover:text-red-900"
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
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((cls) => (
              <div key={cls.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-lg font-medium text-blue-600">
                          {cls.level.charAt(0)}{cls.section}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{cls.name}</h3>
                      <p className="text-sm text-gray-500">{cls.level} - {cls.section}</p>
                    </div>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(cls.status)}`}>
                    {cls.status}
                  </span>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">👨‍🏫</span>
                    <span>Teacher ID: {cls.classTeacherId}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">📅</span>
                    <span>{cls.academicYear}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">📚</span>
                    <span>{cls.subjects.length} Subjects</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span className="flex items-center">
                        <span className="mr-2">👥</span>
                        <span>Enrollment</span>
                      </span>
                      <span className={getCapacityColor(cls.currentEnrollment, cls.capacity)}>
                        {cls.currentEnrollment}/{cls.capacity}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          (cls.currentEnrollment / cls.capacity) >= 0.9 ? 'bg-red-500' :
                          (cls.currentEnrollment / cls.capacity) >= 0.75 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{width: `${Math.min((cls.currentEnrollment / cls.capacity) * 100, 100)}%`}}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => router.push(`/admin/classes/${cls.id}`)}
                    className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                  >
                    👁️ View Details
                  </button>
                  <button 
                    onClick={() => router.push(`/admin/classes/${cls.id}`)}
                    className="bg-gray-50 text-gray-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                  >
                    ✏️ Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Class Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">➕ Add New Class</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddClass} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class Name</label>
                  <input
                    type="text"
                    required
                    value={newClass.name}
                    onChange={(e) => setNewClass({...newClass, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., JSS 1A"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                    <select
                      required
                      value={newClass.level}
                      onChange={(e) => setNewClass({...newClass, level: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Level</option>
                      <option value="JSS1">JSS1</option>
                      <option value="JSS2">JSS2</option>
                      <option value="JSS3">JSS3</option>
                      <option value="SS1">SS1</option>
                      <option value="SS2">SS2</option>
                      <option value="SS3">SS3</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                    <select
                      required
                      value={newClass.section}
                      onChange={(e) => setNewClass({...newClass, section: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Section</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      required
                      value={newClass.capacity}
                      onChange={(e) => setNewClass({...newClass, capacity: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Classroom</label>
                    <input
                      type="text"
                      required
                      value={newClass.classroom}
                      onChange={(e) => setNewClass({...newClass, classroom: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Room 101"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class Teacher</label>
                  <input
                    type="text"
                    required
                    value={newClass.classTeacher}
                    onChange={(e) => setNewClass({...newClass, classTeacher: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Teacher name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                    <select
                      value={newClass.academicYear}
                      onChange={(e) => setNewClass({...newClass, academicYear: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="2024/2025">2024/2025</option>
                      <option value="2025/2026">2025/2026</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Term</label>
                    <select
                      value={newClass.term}
                      onChange={(e) => setNewClass({...newClass, term: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="First Term">First Term</option>
                      <option value="Second Term">Second Term</option>
                      <option value="Third Term">Third Term</option>
                    </select>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {loading ? '⏳ Creating...' : '✅ Create Class'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
