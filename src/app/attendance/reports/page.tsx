'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';

interface AttendanceReport {
  date: string;
  class: string;
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendanceRate: number;
}

interface StudentAttendanceReport {
  studentId: string;
  studentName: string;
  class: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  excusedDays: number;
  attendanceRate: number;
}

export default function AttendanceReportsPage() {
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly' | 'student'>('daily');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [reports, setReports] = useState<AttendanceReport[]>([]);
  const [studentReports, setStudentReports] = useState<StudentAttendanceReport[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Mock data for demonstration
  const classes = [
    'JSS 1A', 'JSS 1B', 'JSS 2A', 'JSS 2B', 'JSS 3A', 'JSS 3B',
    'SS 1A', 'SS 1B', 'SS 2A', 'SS 2B', 'SS 3A', 'SS 3B'
  ];

  const students = [
    { id: 'ST001', name: 'Adebayo Oluwaseun', class: 'JSS 1A' },
    { id: 'ST002', name: 'Chioma Okwu', class: 'JSS 1A' },
    { id: 'ST003', name: 'Ibrahim Mohammed', class: 'JSS 1B' },
    { id: 'ST004', name: 'Fatima Hassan', class: 'JSS 2A' },
    { id: 'ST005', name: 'Emeka Nwosu', class: 'SS 1A' }
  ];

  const generateReport = useCallback(async () => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (reportType === 'student') {
      // Generate student attendance report
      const mockStudentReports: StudentAttendanceReport[] = [
        {
          studentId: 'ST001',
          studentName: 'Adebayo Oluwaseun',
          class: 'JSS 1A',
          totalDays: 20,
          presentDays: 18,
          absentDays: 1,
          lateDays: 1,
          excusedDays: 0,
          attendanceRate: 90
        },
        {
          studentId: 'ST002',
          studentName: 'Chioma Okwu',
          class: 'JSS 1A',
          totalDays: 20,
          presentDays: 19,
          absentDays: 0,
          lateDays: 1,
          excusedDays: 0,
          attendanceRate: 95
        }
      ];
      
      setStudentReports(selectedStudent ? 
        mockStudentReports.filter(r => r.studentId === selectedStudent) : 
        mockStudentReports.filter(r => !selectedClass || r.class === selectedClass)
      );
    } else {
      // Generate class/period reports
      const mockReports: AttendanceReport[] = [
        {
          date: '2025-01-15',
          class: 'JSS 1A',
          total: 25,
          present: 23,
          absent: 1,
          late: 1,
          excused: 0,
          attendanceRate: 96
        },
        {
          date: '2025-01-15',
          class: 'JSS 1B',
          total: 24,
          present: 22,
          absent: 2,
          late: 0,
          excused: 0,
          attendanceRate: 92
        },
        {
          date: '2025-01-16',
          class: 'JSS 1A',
          total: 25,
          present: 24,
          absent: 0,
          late: 1,
          excused: 0,
          attendanceRate: 100
        }
      ];
      
      setReports(selectedClass ? 
        mockReports.filter(r => r.class === selectedClass) : 
        mockReports
      );
    }
    
    setLoading(false);
  }, [reportType, selectedClass, selectedStudent]);

  useEffect(() => {
    if (reportType && (selectedPeriod || (reportType === 'student' && selectedStudent))) {
      generateReport();
    }
  }, [reportType, selectedPeriod, selectedClass, selectedStudent, generateReport]);

  const exportReport = () => {
    // In a real application, this would generate and download a report
    alert('Report export functionality would be implemented here');
  };

  const getAttendanceColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600 bg-green-100';
    if (rate >= 85) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Attendance Reports</h1>
            <p className="text-gray-600">Generate and view attendance analytics</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={exportReport}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              📊 Export Report
            </button>
            <button
              onClick={() => router.push('/attendance')}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Back to Attendance
            </button>
          </div>
        </div>

        {/* Report Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Report Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="daily">Daily Report</option>
                <option value="weekly">Weekly Report</option>
                <option value="monthly">Monthly Report</option>
                <option value="student">Student Report</option>
              </select>
            </div>

            {/* Period Selection */}
            {reportType !== 'student' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {reportType === 'daily' ? 'Date' : 
                   reportType === 'weekly' ? 'Week' : 'Month'}
                </label>
                <input
                  type={reportType === 'daily' ? 'date' : 
                        reportType === 'weekly' ? 'week' : 'month'}
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            )}

            {/* Class Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class {reportType === 'student' ? '' : '(Optional)'}
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Classes</option>
                {classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>

            {/* Student Selection for Student Report */}
            {reportType === 'student' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Student (Optional)</label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Students</option>
                  {students
                    .filter(student => !selectedClass || student.class === selectedClass)
                    .map(student => (
                      <option key={student.id} value={student.id}>
                        {student.name} ({student.class})
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Report Results */}
        {loading ? (
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Generating report...</p>
            </div>
          </div>
        ) : reportType === 'student' ? (
          /* Student Reports */
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Student Attendance Summary
              </h3>
            </div>
            
            {studentReports.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Class
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Days
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Present
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Absent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Late
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Attendance Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {studentReports.map((report) => (
                      <tr key={report.studentId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {report.studentName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {report.studentId}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {report.class}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {report.totalDays}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                          {report.presentDays}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                          {report.absentDays}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">
                          {report.lateDays}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAttendanceColor(report.attendanceRate)}`}>
                            {report.attendanceRate}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">📊</span>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
                <p className="text-gray-500">
                  Select a period and filters to generate reports.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Class/Period Reports */
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Attendance Report
              </h3>
            </div>
            
            {reports.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Class
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Students
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Present
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Absent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Late
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Attendance Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reports.map((report, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(report.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {report.class}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {report.total}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                          {report.present}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                          {report.absent}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">
                          {report.late}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAttendanceColor(report.attendanceRate)}`}>
                            {report.attendanceRate}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">📊</span>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
                <p className="text-gray-500">
                  Select a period and filters to generate reports.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Summary Cards */}
        {(reports.length > 0 || studentReports.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">Total Records</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {reportType === 'student' ? studentReports.length : reports.length}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">Avg. Attendance</div>
                  <div className="text-2xl font-bold text-green-600">
                    {reportType === 'student' 
                      ? Math.round(studentReports.reduce((acc, r) => acc + r.attendanceRate, 0) / studentReports.length || 0)
                      : Math.round(reports.reduce((acc, r) => acc + r.attendanceRate, 0) / reports.length || 0)
                    }%
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">🟢</span>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">Perfect Attendance</div>
                  <div className="text-2xl font-bold text-green-600">
                    {reportType === 'student' 
                      ? studentReports.filter(r => r.attendanceRate === 100).length
                      : reports.filter(r => r.attendanceRate === 100).length
                    }
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">🔴</span>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">Below 85%</div>
                  <div className="text-2xl font-bold text-red-600">
                    {reportType === 'student' 
                      ? studentReports.filter(r => r.attendanceRate < 85).length
                      : reports.filter(r => r.attendanceRate < 85).length
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
