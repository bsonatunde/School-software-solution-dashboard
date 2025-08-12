'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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

export default function ClassDetailPage() {
  const router = useRouter();
  const params = useParams();
  const classId = params.id as string;
  
  const [classData, setClassData] = useState<Class | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    level: '',
    section: '',
    capacity: 40,
    classTeacherId: '',
    academicYear: '',
    status: 'Active' as 'Active' | 'Inactive'
  });

  useEffect(() => {
    if (classId) {
      fetchClassData();
    }
  }, [classId]);

  const fetchClassData = async () => {
    try {
      const response = await fetch(`/api/classes/${classId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setClassData(data.data);
          setEditForm({
            name: data.data.name,
            level: data.data.level,
            section: data.data.section,
            capacity: data.data.capacity,
            classTeacherId: data.data.classTeacherId,
            academicYear: data.data.academicYear,
            status: data.data.status
          });
        } else {
          alert('❌ Class not found');
          router.push('/admin/classes');
        }
      } else {
        throw new Error('Failed to fetch class data');
      }
    } catch (error) {
      console.error('Error fetching class:', error);
      alert('❌ Error loading class data');
      router.push('/admin/classes');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/classes/${classId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ Class updated successfully!');
        setEditing(false);
        fetchClassData();
      } else {
        alert('❌ Error updating class: ' + (data.error || data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating class:', error);
      alert('❌ Error updating class. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/classes?id=${classId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          alert('✅ Class deleted successfully!');
          router.push('/admin/classes');
        } else {
          alert('❌ Error deleting class: ' + (data.error || data.message || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error deleting class:', error);
        alert('❌ Error deleting class. Please try again.');
      }
    }
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

  if (!classData) {
    return (
      <DashboardLayout userRole="admin">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Class not found</h2>
          <p className="text-gray-600 mt-2">The class you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/admin/classes')}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Back to Classes
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/admin/classes')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Classes
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🏫 {classData.name}</h1>
              <p className="mt-2 text-sm text-gray-600">
                {classData.level} - Section {classData.section}
              </p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            {!editing ? (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  ✏️ Edit Class
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  🗑️ Delete Class
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditing(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? '⏳ Saving...' : '✅ Save Changes'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Class Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Class Information</h3>
              
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Class Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                      <select
                        value={editForm.level}
                        onChange={(e) => setEditForm({...editForm, level: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
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
                        value={editForm.section}
                        onChange={(e) => setEditForm({...editForm, section: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
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
                        value={editForm.capacity}
                        onChange={(e) => setEditForm({...editForm, capacity: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm({...editForm, status: e.target.value as 'Active' | 'Inactive'})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                    <select
                      value={editForm.academicYear}
                      onChange={(e) => setEditForm({...editForm, academicYear: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="2024/2025">2024/2025</option>
                      <option value="2025/2026">2025/2026</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Class Teacher ID</label>
                    <input
                      type="text"
                      value={editForm.classTeacherId}
                      onChange={(e) => setEditForm({...editForm, classTeacherId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Level</dt>
                      <dd className="mt-1 text-sm text-gray-900">{classData.level}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Section</dt>
                      <dd className="mt-1 text-sm text-gray-900">{classData.section}</dd>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Capacity</dt>
                      <dd className="mt-1 text-sm text-gray-900">{classData.capacity} students</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Current Enrollment</dt>
                      <dd className="mt-1 text-sm text-gray-900">{classData.currentEnrollment} students</dd>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Academic Year</dt>
                      <dd className="mt-1 text-sm text-gray-900">{classData.academicYear}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          classData.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {classData.status}
                        </span>
                      </dd>
                    </div>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Class Teacher ID</dt>
                    <dd className="mt-1 text-sm text-gray-900">{classData.classTeacherId}</dd>
                  </div>
                </div>
              )}
            </div>

            {/* Subjects */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Subjects ({classData.subjects.length})</h3>
              {classData.subjects.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {classData.subjects.map((subject, index) => (
                    <div key={index} className="bg-blue-50 px-3 py-2 rounded-lg text-sm text-blue-700">
                      📚 {subject}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No subjects assigned yet.</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Enrollment Rate</span>
                  <span className="text-sm font-medium">
                    {Math.round((classData.currentEnrollment / classData.capacity) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      (classData.currentEnrollment / classData.capacity) >= 0.9 ? 'bg-red-500' :
                      (classData.currentEnrollment / classData.capacity) >= 0.75 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{width: `${Math.min((classData.currentEnrollment / classData.capacity) * 100, 100)}%`}}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Available Seats</span>
                  <span className="text-sm font-medium">
                    {classData.capacity - classData.currentEnrollment}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Subjects</span>
                  <span className="text-sm font-medium">{classData.subjects.length}</span>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Timestamps</h3>
              <div className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(classData.createdAt).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(classData.updatedAt).toLocaleDateString()}
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
