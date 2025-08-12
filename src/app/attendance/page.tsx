
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';

interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  class: string;
}

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  timeIn?: string;
  timeOut?: string;
  remarks?: string;
}

interface ClassAttendance {
  studentId: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  timeIn?: string;
  remarks?: string;
}

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<{ [key: string]: ClassAttendance }>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [classes, setClasses] = useState<string[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const router = useRouter();

  // Mock classes data
  const availableClasses = [
    'JSS 1A', 'JSS 1B', 'JSS 2A', 'JSS 2B', 'JSS 3A', 'JSS 3B',
    'SS 1A', 'SS 1B', 'SS 2A', 'SS 2B', 'SS 3A', 'SS 3B'
  ];

  useEffect(() => {
    setClasses(availableClasses);
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudentsForClass();
      fetchExistingAttendance();
    }
  }, [selectedClass, selectedDate]);

  const fetchStudentsForClass = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/students');
      const data = await response.json();
      
      if (data.success) {
        const classStudents = data.data.filter((student: Student) => student.class === selectedClass);
        setStudents(classStudents);
        
        // Initialize attendance state
        const initialAttendance: { [key: string]: ClassAttendance } = {};
        classStudents.forEach((student: Student) => {
          initialAttendance[student.id] = {
            studentId: student.id,
            status: 'Present',
            timeIn: '08:00'
          };
        });
        setAttendance(initialAttendance);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingAttendance = async () => {
    try {
      const response = await fetch(`/api/attendance?date=${selectedDate}&class=${selectedClass}`);
      const data = await response.json();
      
      if (data.success && data.data.length > 0) {
        const existingAttendance: { [key: string]: ClassAttendance } = {};
        data.data.forEach((record: AttendanceRecord) => {
          existingAttendance[record.studentId] = {
            studentId: record.studentId,
            status: record.status,
            timeIn: record.timeIn,
            remarks: record.remarks
          };
        });
        setAttendance(existingAttendance);
        setAttendanceRecords(data.data);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const handleAttendanceChange = (studentId: string, field: keyof ClassAttendance, value: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const markAllPresent = () => {
    const updatedAttendance = { ...attendance };
    Object.keys(updatedAttendance).forEach(studentId => {
      updatedAttendance[studentId] = {
        ...updatedAttendance[studentId],
        status: 'Present',
        timeIn: '08:00'
      };
    });
    setAttendance(updatedAttendance);
  };

  const saveAttendance = async () => {
    try {
      setSaving(true);
      
      const attendanceData = Object.values(attendance).map(record => ({
        ...record,
        date: selectedDate,
        class: selectedClass
      }));

      const response = await fetch('/api/attendance/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate,
          class: selectedClass,
          attendance: attendanceData
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Attendance saved successfully!');
        fetchExistingAttendance(); // Refresh the data
      } else {
        throw new Error(data.error || 'Failed to save attendance');
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert(error instanceof Error ? error.message : 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const getAttendanceStats = () => {
    const total = students.length;
    const present = Object.values(attendance).filter(a => a.status === 'Present').length;
    const absent = Object.values(attendance).filter(a => a.status === 'Absent').length;
    const late = Object.values(attendance).filter(a => a.status === 'Late').length;
    const excused = Object.values(attendance).filter(a => a.status === 'Excused').length;
    
    return { total, present, absent, late, excused };
  };

  const stats = getAttendanceStats();

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Daily Attendance</h1>
            <p className="text-gray-600">Mark and manage student attendance records</p>
          </div>
          <button
            onClick={() => router.push('/attendance/reports')}
            className="bg-secondary-600 text-white px-4 py-2 rounded-lg hover:bg-secondary-700 transition-colors"
          >
            View Reports
          </button>
        </div>

        {/* Date and Class Selection */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select a class</option>
                {classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={markAllPresent}
                disabled={!selectedClass || loading}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mark All Present
              </button>
            </div>
          </div>
        </div>

        {/* Attendance Stats */}
        {selectedClass && students.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Students</div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.present}</div>
                <div className="text-sm text-gray-600">Present</div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
                <div className="text-sm text-gray-600">Absent</div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
                <div className="text-sm text-gray-600">Late</div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.excused}</div>
                <div className="text-sm text-gray-600">Excused</div>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Table */}
        {selectedClass && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedClass} - {new Date(selectedDate).toLocaleDateString()} 
                ({students.length} students)
              </h3>
              <button
                onClick={saveAttendance}
                disabled={saving || students.length === 0}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Attendance'}
              </button>
            </div>
            
            {loading ? (
              <div className="p-6">
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            ) : students.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time In
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                                <span className="text-xs font-medium text-primary-700">
                                  {student.firstName[0]}{student.lastName[0]}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {student.firstName} {student.lastName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.studentId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={attendance[student.id]?.status || 'Present'}
                            onChange={(e) => handleAttendanceChange(student.id, 'status', e.target.value)}
                            className={`px-3 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-primary-500 ${
                              attendance[student.id]?.status === 'Present' ? 'bg-green-100 text-green-800' :
                              attendance[student.id]?.status === 'Absent' ? 'bg-red-100 text-red-800' :
                              attendance[student.id]?.status === 'Late' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}
                          >
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                            <option value="Late">Late</option>
                            <option value="Excused">Excused</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="time"
                            value={attendance[student.id]?.timeIn || '08:00'}
                            onChange={(e) => handleAttendanceChange(student.id, 'timeIn', e.target.value)}
                            disabled={attendance[student.id]?.status === 'Absent'}
                            className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={attendance[student.id]?.remarks || ''}
                            onChange={(e) => handleAttendanceChange(student.id, 'remarks', e.target.value)}
                            placeholder="Optional remarks"
                            className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-32"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : selectedClass ? (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">👨‍🎓</span>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                <p className="text-gray-500">
                  No students are enrolled in {selectedClass}.
                </p>
              </div>
            ) : null}
          </div>
        )}

        {/* Instructions */}
        {!selectedClass && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-blue-400 text-xl">ℹ️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Getting Started</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Select the date for attendance (defaults to today)</li>
                    <li>Choose the class you want to mark attendance for</li>
                    <li>Mark each student as Present, Absent, Late, or Excused</li>
                    <li>Set arrival times for present/late students</li>
                    <li>Add any remarks if needed</li>
                    <li>Click "Save Attendance" to record the data</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
