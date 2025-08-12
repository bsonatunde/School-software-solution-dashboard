'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';

interface Student {
  _id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
}

interface Class {
  _id: string;
  className: string;
  level: string;
  section?: string;
  capacity: number;
  academicYear: string;
  term: string;
  teacher?: {
    id: string;
    name: string;
  };
  students: Student[];
  subjectIds: string[];
  status: string;
  createdAt: string;
}

interface TeacherClass {
  classId: string;
  className: string;
  subject: string;
  studentCount: number;
  schedule: {
    day: string;
    time: string;
    duration: string;
  }[];
}

export default function TeacherClasses() {
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [teacherClasses, setTeacherClasses] = useState<TeacherClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    // Get teacher data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        const extractedTeacherId = user.profileId || user.teacherId || user.employeeId || user.id;
        console.log('Teacher user data:', user);
        console.log('Extracted teacher ID:', extractedTeacherId);
        setTeacherId(extractedTeacherId);
      } catch (e) {
        console.error('Error parsing user data:', e);
        setError('Invalid user session. Please login again.');
      }
    } else {
      // For testing purposes, set up a test teacher
      const testTeacher = {
        teacherId: "TCH001",
        employeeId: "EMP001",
        firstName: "Test",
        lastName: "Teacher",
        email: "teacher@paceyschool.com",
        role: "teacher"
      };
      localStorage.setItem('user', JSON.stringify(testTeacher));
      setTeacherId(testTeacher.teacherId);
    }
  }, []);

  useEffect(() => {
    if (teacherId) {
      fetchClasses();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teacherId]);

  const fetchClasses = async () => {
    if (!teacherId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching classes for teacher:', teacherId);
      
      // Fetch all classes
      const classesResponse = await fetch('/api/classes');
      if (!classesResponse.ok) {
        throw new Error(`Classes API failed: ${classesResponse.status}`);
      }
      
      const classesText = await classesResponse.text();
      let classesData;
      
      try {
        classesData = JSON.parse(classesText);
      } catch (parseError) {
        console.error('Failed to parse classes response:', parseError);
        console.error('Response was:', classesText.substring(0, 500));
        throw new Error('Invalid response from classes API');
      }

      if (classesData.success) {
        setClasses(classesData.data || []);
        
        // If no classes exist, create some sample classes
        if (classesData.data.length === 0) {
          await createSampleClasses();
        }
      } else {
        throw new Error(classesData.error || 'Failed to fetch classes');
      }

      // Fetch teacher's assigned classes (this would be from a teacher-class mapping)
      await fetchTeacherAssignments();
      
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  const createSampleClasses = async () => {
    const sampleClasses = [
      {
        className: "JSS 1A",
        level: "JSS1",
        section: "A",
        capacity: 30,
        academicYear: "2024/2025",
        term: "First",
        status: "Active"
      },
      {
        className: "JSS 1B", 
        level: "JSS1",
        section: "B",
        capacity: 30,
        academicYear: "2024/2025",
        term: "First",
        status: "Active"
      },
      {
        className: "JSS 2A",
        level: "JSS2", 
        section: "A",
        capacity: 30,
        academicYear: "2024/2025",
        term: "First",
        status: "Active"
      },
      {
        className: "SS 1A",
        level: "SS1",
        section: "A", 
        capacity: 25,
        academicYear: "2024/2025",
        term: "First",
        status: "Active"
      }
    ];

    for (const classData of sampleClasses) {
      try {
        await fetch('/api/classes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(classData)
        });
      } catch (error) {
        console.error('Error creating sample class:', error);
      }
    }

    // Refetch classes after creating samples
    setTimeout(() => fetchClasses(), 1000);
  };

  const fetchTeacherAssignments = async () => {
    // For now, create mock teacher assignments
    // In a real implementation, this would fetch from a teacher-class-subject mapping
    const mockAssignments: TeacherClass[] = [
      {
        classId: "1",
        className: "JSS 1A",
        subject: "Mathematics",
        studentCount: 28,
        schedule: [
          { day: "Monday", time: "09:00 AM", duration: "40 mins" },
          { day: "Wednesday", time: "10:00 AM", duration: "40 mins" },
          { day: "Friday", time: "11:00 AM", duration: "40 mins" }
        ]
      },
      {
        classId: "2", 
        className: "JSS 1B",
        subject: "Mathematics",
        studentCount: 25,
        schedule: [
          { day: "Tuesday", time: "09:00 AM", duration: "40 mins" },
          { day: "Thursday", time: "10:00 AM", duration: "40 mins" }
        ]
      },
      {
        classId: "3",
        className: "JSS 2A", 
        subject: "Mathematics",
        studentCount: 30,
        schedule: [
          { day: "Monday", time: "11:00 AM", duration: "40 mins" },
          { day: "Thursday", time: "02:00 PM", duration: "40 mins" }
        ]
      }
    ];
    
    setTeacherClasses(mockAssignments);
  };

  const viewClassDetails = (cls: Class) => {
    setSelectedClass(cls);
  };

  if (loading) {
    return (
      <DashboardLayout userRole="teacher">
        <div className="max-w-6xl mx-auto py-20 text-center text-lg text-gray-500">
          Loading classes...
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout userRole="teacher">
        <div className="max-w-6xl mx-auto py-20 text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button 
            onClick={fetchClasses}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="teacher">
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Classes</h1>
            <p className="text-gray-600">Manage your assigned classes and students</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            📚 Create New Class
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <span className="text-xl">🏫</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Classes</p>
                <p className="text-2xl font-bold text-gray-900">{teacherClasses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <span className="text-xl">👨‍🎓</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {teacherClasses.reduce((sum, cls) => sum + cls.studentCount, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <span className="text-xl">📚</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Subjects</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(teacherClasses.map(cls => cls.subject)).size}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <span className="text-xl">📅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Weekly Lessons</p>
                <p className="text-2xl font-bold text-gray-900">
                  {teacherClasses.reduce((sum, cls) => sum + cls.schedule.length, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* My Assigned Classes */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">📋 My Assigned Classes</h2>
          
          {teacherClasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teacherClasses.map((cls, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{cls.className}</h3>
                      <p className="text-gray-600">{cls.subject}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {cls.studentCount} students
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Schedule:</p>
                    <div className="space-y-1">
                      {cls.schedule.map((session, idx) => (
                        <div key={idx} className="text-xs text-gray-600 flex justify-between">
                          <span>{session.day}</span>
                          <span>{session.time} ({session.duration})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link 
                      href={`/teacher/classes/${cls.classId}`}
                      className="flex-1 bg-blue-600 text-white text-center py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      View Students
                    </Link>
                    <Link 
                      href={`/teacher/assignments?class=${cls.classId}`}
                      className="flex-1 bg-green-600 text-white text-center py-2 px-3 rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      Assignments
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">
                <span className="text-4xl">📚</span>
              </div>
              <p className="text-gray-600 mb-4">No classes assigned yet</p>
              <p className="text-sm text-gray-500">Contact the administrator to get class assignments</p>
            </div>
          )}
        </div>

        {/* All Available Classes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">🏫 All School Classes</h2>
          
          {classes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Capacity
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
                  {classes.map((cls) => (
                    <tr key={cls._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{cls.className}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {cls.level} {cls.section && `- ${cls.section}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {cls.students?.length || 0} / {cls.capacity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {cls.academicYear} - {cls.term} Term
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          cls.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {cls.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => viewClassDetails(cls)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          View Details
                        </button>
                        <Link 
                          href={`/admin/classes/${cls._id}`}
                          className="text-green-600 hover:text-green-900"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">
                <span className="text-4xl">🏫</span>
              </div>
              <p className="text-gray-600 mb-4">No classes found</p>
              <button 
                onClick={createSampleClasses}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Create Sample Classes
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Link 
            href="/teacher/assignments"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <span className="text-xl">📝</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Assignments</h3>
                <p className="text-gray-600 text-sm">Create and manage assignments</p>
              </div>
            </div>
          </Link>

          <Link 
            href="/attendance"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <span className="text-xl">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Attendance</h3>
                <p className="text-gray-600 text-sm">Take class attendance</p>
              </div>
            </div>
          </Link>

          <Link 
            href="/results"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Results</h3>
                <p className="text-gray-600 text-sm">Grade student work</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Class Details Modal */}
      {selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Class Details: {selectedClass.className}</h3>
                <button
                  onClick={() => setSelectedClass(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Level & Section</label>
                  <p className="text-gray-900">{selectedClass.level} {selectedClass.section && `- Section ${selectedClass.section}`}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Capacity</label>
                  <p className="text-gray-900">{selectedClass.capacity} students</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Academic Year & Term</label>
                  <p className="text-gray-900">{selectedClass.academicYear} - {selectedClass.term} Term</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Students</label>
                  <p className="text-gray-900">{selectedClass.students?.length || 0} enrolled</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedClass.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedClass.status}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created</label>
                  <p className="text-gray-900">{new Date(selectedClass.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="mt-6 flex gap-3">
                <Link 
                  href={`/admin/classes/${selectedClass._id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Manage Class
                </Link>
                <button
                  onClick={() => setSelectedClass(null)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
