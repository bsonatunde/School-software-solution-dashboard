'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../../components/layout/DashboardLayout';

interface TimetableAnalytics {
  teacherWorkload: {
    teacherId: string;
    teacherName: string;
    totalPeriods: number;
    classes: string[];
    subjects: string[];
    workloadPercentage: number;
  }[];
  classAnalysis: {
    class: string;
    totalPeriods: number;
    subjects: number;
    coreSubjects: number;
    electiveSubjects: number;
    periodsPerDay: number;
  }[];
  subjectDistribution: {
    subject: string;
    totalPeriods: number;
    classes: string[];
    teachers: string[];
  }[];
  utilizationStats: {
    totalPeriods: number;
    teachingPeriods: number;
    breakPeriods: number;
    utilizationRate: number;
  };
}

export default function TimetableReportsPage() {
  const [analytics, setAnalytics] = useState<TimetableAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState('overview');

  const reports = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'teachers', name: 'Teacher Workload', icon: '👨‍🏫' },
    { id: 'classes', name: 'Class Analysis', icon: '🏫' },
    { id: 'subjects', name: 'Subject Distribution', icon: '📚' },
    { id: 'utilization', name: 'Resource Utilization', icon: '⚡' }
  ];

  useEffect(() => {
    generateAnalytics();
  }, []);

  const generateAnalytics = () => {
    // Mock analytics data - in real app, this would come from API
    const mockAnalytics: TimetableAnalytics = {
      teacherWorkload: [
        {
          teacherId: 'TCH001',
          teacherName: 'Mr. Adebayo Ibrahim',
          totalPeriods: 25,
          classes: ['JSS 1A', 'JSS 1B', 'JSS 2A', 'JSS 2B'],
          subjects: ['Mathematics'],
          workloadPercentage: 83.3
        },
        {
          teacherId: 'TCH002', 
          teacherName: 'Mrs. Sarah Johnson',
          totalPeriods: 22,
          classes: ['JSS 1A', 'JSS 2A', 'JSS 3A'],
          subjects: ['English Language'],
          workloadPercentage: 73.3
        },
        {
          teacherId: 'TCH005',
          teacherName: 'Dr. Chinedu Okwu',
          totalPeriods: 28,
          classes: ['JSS 1A', 'JSS 2A', 'SS 1A', 'SS 2A'],
          subjects: ['Basic Science', 'Physics'],
          workloadPercentage: 93.3
        },
        {
          teacherId: 'TCH007',
          teacherName: 'Dr. Amina Garba',
          totalPeriods: 20,
          classes: ['SS 1A', 'SS 2A', 'SS 3A'],
          subjects: ['Chemistry'],
          workloadPercentage: 66.7
        },
        {
          teacherId: 'TCH021',
          teacherName: 'Coach Emeka Nwachukwu',
          totalPeriods: 15,
          classes: ['JSS 1A', 'JSS 2A', 'SS 1A', 'SS 2A'],
          subjects: ['Physical Education'],
          workloadPercentage: 50.0
        }
      ],
      classAnalysis: [
        {
          class: 'JSS 1A',
          totalPeriods: 35,
          subjects: 12,
          coreSubjects: 4,
          electiveSubjects: 8,
          periodsPerDay: 7
        },
        {
          class: 'JSS 2A',
          totalPeriods: 35,
          subjects: 11,
          coreSubjects: 4,
          electiveSubjects: 7,
          periodsPerDay: 7
        },
        {
          class: 'SS 1A',
          totalPeriods: 35,
          subjects: 10,
          coreSubjects: 3,
          electiveSubjects: 7,
          periodsPerDay: 7
        },
        {
          class: 'SS 2A',
          totalPeriods: 35,
          subjects: 9,
          coreSubjects: 3,
          electiveSubjects: 6,
          periodsPerDay: 7
        }
      ],
      subjectDistribution: [
        {
          subject: 'Mathematics',
          totalPeriods: 60,
          classes: ['JSS 1A', 'JSS 1B', 'JSS 2A', 'JSS 2B', 'SS 1A', 'SS 2A'],
          teachers: ['Mr. Adebayo Ibrahim', 'Mr. Joseph Okechukwu']
        },
        {
          subject: 'English Language',
          totalPeriods: 55,
          classes: ['JSS 1A', 'JSS 2A', 'JSS 3A', 'SS 1A', 'SS 2A'],
          teachers: ['Mrs. Sarah Johnson', 'Mr. Gabriel Okonkwo']
        },
        {
          subject: 'Physics',
          totalPeriods: 24,
          classes: ['SS 1A', 'SS 2A', 'SS 3A'],
          teachers: ['Dr. Chinedu Okwu']
        },
        {
          subject: 'Chemistry',
          totalPeriods: 20,
          classes: ['SS 1A', 'SS 2A', 'SS 3A'],
          teachers: ['Dr. Amina Garba']
        }
      ],
      utilizationStats: {
        totalPeriods: 315,
        teachingPeriods: 280,
        breakPeriods: 35,
        utilizationRate: 88.9
      }
    };

    setAnalytics(mockAnalytics);
    setLoading(false);
  };

  const exportReport = () => {
    if (!analytics) return;
    
    const dataStr = JSON.stringify(analytics, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `timetable-analytics-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Classes</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.classAnalysis.length || 0}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏫</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Teachers</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.teacherWorkload.length || 0}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👨‍🏫</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Subjects</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.subjectDistribution.length || 0}</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Utilization Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics?.utilizationStats.utilizationRate.toFixed(1)}%
              </p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Teacher Workload Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Teacher Workload Distribution</h3>
          <div className="space-y-3">
            {analytics?.teacherWorkload.slice(0, 5).map((teacher, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-700">
                      {teacher.teacherName.split(' ')[1]?.[0] || 'T'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{teacher.teacherName}</p>
                    <p className="text-xs text-gray-500">{teacher.totalPeriods} periods/week</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        teacher.workloadPercentage > 90 ? 'bg-red-500' :
                        teacher.workloadPercentage > 75 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(teacher.workloadPercentage, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    {teacher.workloadPercentage.toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Class Subject Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Class Subject Distribution</h3>
          <div className="space-y-3">
            {analytics?.classAnalysis.map((classData, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">{classData.class}</p>
                  <p className="text-sm text-gray-500">
                    {classData.subjects} subjects • {classData.totalPeriods} periods/week
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-blue-600">{classData.coreSubjects} Core</p>
                  <p className="text-sm text-gray-500">{classData.electiveSubjects} Electives</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTeacherWorkload = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Teacher Workload Analysis</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subjects</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periods/Week</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workload</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {analytics?.teacherWorkload.map((teacher, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-700">
                          {teacher.teacherName.split(' ')[1]?.[0] || 'T'}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{teacher.teacherName}</div>
                      <div className="text-sm text-gray-500">{teacher.teacherId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {teacher.subjects.join(', ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {teacher.classes.length} classes
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {teacher.totalPeriods}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {teacher.workloadPercentage.toFixed(1)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    teacher.workloadPercentage > 90 
                      ? 'bg-red-100 text-red-800'
                      : teacher.workloadPercentage > 75
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {teacher.workloadPercentage > 90 ? 'Overloaded' :
                     teacher.workloadPercentage > 75 ? 'Optimal' : 'Light'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-500">Loading timetable analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout userRole="admin">
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📊 Timetable Analytics</h1>
              <p className="text-gray-600 mt-1">Comprehensive analysis of school schedules and workloads</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={exportReport}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                📥 Export Data
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                🖨️ Print
              </button>
              <Link
                href="/timetable"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                ← Back to Timetables
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Report Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {reports.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    selectedReport === report.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span>{report.icon}</span>
                    <span>{report.name}</span>
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Report Content */}
          <div className="p-6">
            {selectedReport === 'overview' && renderOverview()}
            {selectedReport === 'teachers' && renderTeacherWorkload()}
            {(selectedReport === 'classes' || selectedReport === 'subjects' || selectedReport === 'utilization') && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚧</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Report Under Development</h3>
                <p className="text-gray-500">This report section is being developed and will be available soon.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
}
