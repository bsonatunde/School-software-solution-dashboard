'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalStaff: number;
  totalClasses: number;
  maleStudents: number;
  femaleStudents: number;
  pendingFees: number;
  revenue: number;
  attendanceRate: number;
  recentActivities: any[];
  isEmpty?: boolean;
}

interface ClassData {
  id: string;
  name: string;
  students: number;
  teacher: string;
  attendance: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalStaff: 0,
    totalClasses: 0,
    maleStudents: 0,
    femaleStudents: 0,
    pendingFees: 0,
    revenue: 0,
    attendanceRate: 0,
    recentActivities: []
  });
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        
        try {
          // Fetch dashboard stats
          const statsResponse = await fetch('/api/dashboard/stats');
          if (!statsResponse.ok) {
            throw new Error(`Stats API failed: ${statsResponse.status} ${statsResponse.statusText}`);
          }
          
          const contentType = statsResponse.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            const text = await statsResponse.text();
            console.error('Non-JSON response from stats API:', text.substring(0, 200));
            throw new Error('Stats API returned non-JSON response');
          }
          
          const statsData = await statsResponse.json();
          
          if (!statsData.success) {
            console.warn('Failed to fetch dashboard stats:', statsData.error);
            setStats({
              totalStudents: 0,
              totalTeachers: 0,
              totalStaff: 0,
              totalClasses: 0,
              maleStudents: 0,
              femaleStudents: 0,
              pendingFees: 0,
              revenue: 0,
              attendanceRate: 0,
              recentActivities: [],
              isEmpty: true
            });
          } else {
            setStats(statsData.data);
          }
        } catch (error) {
          console.error('Error fetching dashboard stats:', error);
          setStats({
            totalStudents: 0,
            totalTeachers: 0,
            totalStaff: 0,
            totalClasses: 0,
            maleStudents: 0,
            femaleStudents: 0,
            pendingFees: 0,
            revenue: 0,
            attendanceRate: 0,
            recentActivities: [],
            isEmpty: true
          });
        }

        try {
          // Fetch classes data
          const classesResponse = await fetch('/api/classes');
          if (!classesResponse.ok) {
            throw new Error(`Classes API failed: ${classesResponse.status} ${classesResponse.statusText}`);
          }
          
          const contentType = classesResponse.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            const text = await classesResponse.text();
            console.error('Non-JSON response from classes API:', text.substring(0, 200));
            throw new Error('Classes API returned non-JSON response');
          }
          
          const classesData = await classesResponse.json();
          
          if (!classesData.success) {
            console.warn('Failed to fetch classes:', classesData.error);
            // Set demo data as fallback
            setClasses([
              { id: '1', name: 'JSS 1A', students: 30, teacher: 'Mrs. Johnson', attendance: '28/30 (93%)' },
              { id: '2', name: 'JSS 2B', students: 28, teacher: 'Mr. Smith', attendance: '26/28 (93%)' },
              { id: '3', name: 'SS 1A', students: 32, teacher: 'Dr. Williams', attendance: '30/32 (94%)' },
              { id: '4', name: 'SS 2A', students: 25, teacher: 'Mrs. Brown', attendance: '24/25 (96%)' },
              { id: '5', name: 'SS 3B', students: 27, teacher: 'Mr. Davis', attendance: '25/27 (93%)' }
            ]);
          } else {
            // Ensure all items have valid IDs
            const validClasses = (classesData.data || []).map((classItem: any, index: number) => ({
              ...classItem,
              id: classItem.id || classItem._id || `class-${index}`,
              name: classItem.name || classItem.className || `Class ${index + 1}`,
              students: classItem.students || classItem.enrolledStudents || 0,
              teacher: classItem.teacher || classItem.classTeacher || 'Not Assigned',
              attendance: classItem.attendance || '0/0 (0%)'
            }));
            setClasses(validClasses);
          }
        } catch (error) {
          console.error('Error fetching classes data:', error);
          // Set demo data as fallback
          setClasses([
            { id: '1', name: 'JSS 1A', students: 30, teacher: 'Mrs. Johnson', attendance: '28/30 (93%)' },
            { id: '2', name: 'JSS 2B', students: 28, teacher: 'Mr. Smith', attendance: '26/28 (93%)' },
            { id: '3', name: 'SS 1A', students: 32, teacher: 'Dr. Williams', attendance: '30/32 (94%)' },
            { id: '4', name: 'SS 2A', students: 25, teacher: 'Mrs. Brown', attendance: '24/25 (96%)' },
            { id: '5', name: 'SS 3B', students: 27, teacher: 'Mr. Davis', attendance: '25/27 (93%)' }
          ]);
        }
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (error) {
    return (
      <DashboardLayout userRole="admin">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-400 text-xl">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading dashboard</h3>
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
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome back, Administrator! 👋</h1>
          <p className="text-primary-100">Here&apos;s what&apos;s happening at your school today.</p>
        </div>

        {/* Empty State for Clean Database */}
        {stats?.isEmpty && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🎓</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Welcome to Your Clean School System!
              </h2>
              <p className="text-gray-600 mb-6">
                Your database has been successfully cleaned. You can now start adding your school data.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => window.location.href = '/students/add'}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  👨‍🎓 Add Students
                </button>
                <button
                  onClick={() => window.location.href = '/staff/add'}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  👥 Add Staff
                </button>
                <button
                  onClick={() => window.location.href = '/teachers/add'}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  👨‍🏫 Add Teachers
                </button>
                <button
                  onClick={() => window.location.href = '/admin/classes'}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  🏫 Add Classes
                </button>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-200">
                <a 
                  href="/admin/database"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  🗃️ Manage Database →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Students */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">👨‍🎓</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                {loading ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{(stats.totalStudents || 0).toLocaleString()}</p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 text-sm font-medium">+5.2%</span>
              <span className="text-gray-500 text-sm"> from last term</span>
            </div>
          </div>

          {/* Total Teachers */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">👨‍🏫</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Teachers</p>
                {loading ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{stats.totalTeachers || 0}</p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 text-sm font-medium">+2.1%</span>
              <span className="text-gray-500 text-sm"> from last term</span>
            </div>
          </div>

          {/* Total Classes */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">🏫</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Classes</p>
                {loading ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{stats.totalClasses || 0}</p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <span className="text-blue-600 text-sm font-medium">Steady</span>
              <span className="text-gray-500 text-sm"> this term</span>
            </div>
          </div>

          {/* Pending Fees */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Fees</p>
                {loading ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">₦{(stats.pendingFees || 0).toLocaleString()}</p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <span className="text-red-600 text-sm font-medium">-8.1%</span>
              <span className="text-gray-500 text-sm"> from last week</span>
            </div>
          </div>
        </div>

        {/* Academic Results Summary */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">1st Term 2024/2025 Results Summary</h3>
            <a
              href="/results"
              className="text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center"
            >
              View Results →
            </a>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">95%</div>
              <div className="text-sm text-gray-600">Results Completed</div>
              <div className="text-xs text-green-600">1,173/1,234 students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">68.4%</div>
              <div className="text-sm text-gray-600">Average Score</div>
              <div className="text-xs text-green-600">+2.3% from last term</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">82.1%</div>
              <div className="text-sm text-gray-600">Pass Rate</div>
              <div className="text-xs text-blue-600">Above 40% threshold</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">156</div>
              <div className="text-sm text-gray-600">Distinctions</div>
              <div className="text-xs text-yellow-600">A1 & B2 grades</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Top Performing Subjects</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">English Language</span>
                  <span className="text-sm font-medium text-green-600">74.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Mathematics</span>
                  <span className="text-sm font-medium text-green-600">71.8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Social Studies</span>
                  <span className="text-sm font-medium text-green-600">69.5%</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Needs Attention</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Basic Science</span>
                  <span className="text-sm font-medium text-red-600">58.3%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">French</span>
                  <span className="text-sm font-medium text-red-600">55.7%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Agricultural Science</span>
                  <span className="text-sm font-medium text-red-600">52.4%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Attendance Summary */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Today&apos;s Attendance Summary</h3>
            <a
              href="/attendance"
              className="text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center"
            >
              View Details →
            </a>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">1,234</div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">1,156</div>
              <div className="text-sm text-gray-600">Present</div>
              <div className="text-xs text-green-600">93.7%</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">45</div>
              <div className="text-sm text-gray-600">Absent</div>
              <div className="text-xs text-red-600">3.6%</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">23</div>
              <div className="text-sm text-gray-600">Late</div>
              <div className="text-xs text-yellow-600">1.9%</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">10</div>
              <div className="text-sm text-gray-600">Excused</div>
              <div className="text-xs text-blue-600">0.8%</div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Classes with attendance below 90%:</span>
              <span className="text-red-600 font-medium">3 classes</span>
            </div>
          </div>
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New student enrolled</p>
                  <p className="text-xs text-gray-500">Sarah Johnson joined JSS 1A - 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Fee payment received</p>
                  <p className="text-xs text-gray-500">₦45,000 from Michael Okafor - 3 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Teacher absent</p>
                  <p className="text-xs text-gray-500">Mrs. Adebayo called in sick - 5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Result published</p>
                  <p className="text-xs text-gray-500">SS 2 Mathematics results uploaded - 1 day ago</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
              View All Activities
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => router.push('/students/add')}
                className="p-4 text-left border-2 border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all"
              >
                <div className="text-2xl mb-2">👨‍🎓</div>
                <p className="font-medium text-gray-900">Add Student</p>
                <p className="text-xs text-gray-500">Register new student</p>
              </button>
              <button 
                onClick={() => router.push('/teachers/add')}
                className="p-4 text-left border-2 border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all"
              >
                <div className="text-2xl mb-2">👨‍🏫</div>
                <p className="font-medium text-gray-900">Add Teacher</p>
                <p className="text-xs text-gray-500">Register new teacher</p>
              </button>
              <button 
                onClick={() => router.push('/attendance')}
                className="p-4 text-left border-2 border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all"
              >
                <div className="text-2xl mb-2">📅</div>
                <p className="font-medium text-gray-900">Take Attendance</p>
                <p className="text-xs text-gray-500">Record daily attendance</p>
              </button>
              <button 
                onClick={() => router.push('/admin/assignments')}
                className="p-4 text-left border-2 border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all"
              >
                <div className="text-2xl mb-2">📝</div>
                <p className="font-medium text-gray-900">Assignments</p>
                <p className="text-xs text-gray-500">Manage all assignments</p>
              </button>
              <button 
                onClick={() => router.push('/admin/leave-management')}
                className="p-4 text-left border-2 border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all"
              >
                <div className="text-2xl mb-2">🏖️</div>
                <p className="font-medium text-gray-900">Leave Management</p>
                <p className="text-xs text-gray-500">Approve staff leaves</p>
              </button>
              <button 
                onClick={() => router.push('/results/reports')}
                className="p-4 text-left border-2 border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all"
              >
                <div className="text-2xl mb-2">�</div>
                <p className="font-medium text-gray-900">View Reports</p>
                <p className="text-xs text-gray-500">Generate analytics</p>
              </button>
              <button 
                onClick={() => router.push('/fees')}
                className="p-4 text-left border-2 border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all"
              >
                <div className="text-2xl mb-2">�</div>
                <p className="font-medium text-gray-900">Fee Management</p>
                <p className="text-xs text-gray-500">Manage school fees</p>
              </button>
            </div>
          </div>
        </div>

        {/* Class Overview */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Class Overview</h3>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class Teacher
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attendance Today
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {classes.map((classItem) => (
                    <tr key={classItem.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {classItem.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {classItem.students}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {classItem.teacher}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {classItem.attendance}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
