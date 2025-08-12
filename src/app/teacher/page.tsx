'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';

interface DashboardStats {
  totalClasses: number;
  totalStudents: number;
  totalAssignments: number;
  pendingSubmissions: number;
}

interface UpcomingLesson {
  id: string;
  subject: string;
  class: string;
  time: string;
  room: string;
}

interface RecentActivity {
  id: string;
  type: 'attendance' | 'grade' | 'assignment' | 'submission';
  description: string;
  timestamp: string;
}

export default function TeacherDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClasses: 0,
    totalStudents: 0,
    totalAssignments: 0,
    pendingSubmissions: 0
  });
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get teacher data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setTeacherId(user.profileId || user.teacherId || user.id);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (!teacherId) return;

    async function fetchTeacherStats() {
      try {
        // Fetch teacher's assignments
        const assignmentsResponse = await fetch(`/api/assignments?teacherId=${teacherId}`);
        const assignmentsData = await assignmentsResponse.json();
        
        if (assignmentsData.success) {
          const assignments = assignmentsData.data;
          
          // Count pending submissions
          let pendingCount = 0;
          for (const assignment of assignments) {
            const submissionsResponse = await fetch(`/api/assignments/${assignment._id}/submissions`);
            const submissionsData = await submissionsResponse.json();
            if (submissionsData.success) {
              pendingCount += submissionsData.data.filter((s: any) => s.status === 'submitted').length;
            }
          }

          setStats(prev => ({
            ...prev,
            totalAssignments: assignments.length,
            pendingSubmissions: pendingCount
          }));
        }
      } catch (error) {
        console.error('Error fetching teacher stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTeacherStats();
  }, [teacherId]);

  const [upcomingLessons] = useState<UpcomingLesson[]>([
    {
      id: '1',
      subject: 'Mathematics',
      class: 'JSS 2A',
      time: '9:00 AM',
      room: 'Room 101'
    },
    {
      id: '2',
      subject: 'Physics',
      class: 'SS 1B',
      time: '11:00 AM',
      room: 'Lab 1'
    },
    {
      id: '3',
      subject: 'Mathematics',
      class: 'JSS 3A',
      time: '2:00 PM',
      room: 'Room 101'
    }
  ]);

  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'attendance',
      description: 'Marked attendance for JSS 2A Mathematics',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      type: 'grade',
      description: 'Updated grades for SS 1B Physics test',
      timestamp: '4 hours ago'
    },
    {
      id: '3',
      type: 'assignment',
      description: 'Created new assignment for JSS 3A',
      timestamp: '1 day ago'
    },
    {
      id: '4',
      type: 'submission',
      description: 'New submission received for Math Assignment',
      timestamp: '30 minutes ago'
    }
  ]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'attendance': return '📋';
      case 'grade': return '📊';
      case 'assignment': return '📝';
      case 'submission': return '📤';
      default: return '📌';
    }
  };

  return (
    <DashboardLayout userRole="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">👩‍🏫 Teacher Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">
              Welcome back! Here&apos;s an overview of your classes and activities.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              ✅ Active Teacher
            </span>
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
                <p className="text-sm font-medium text-gray-600">My Classes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalClasses}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <span className="text-2xl">👨‍🎓</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <span className="text-2xl">📝</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">My Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.totalAssignments}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <span className="text-2xl">�</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.pendingSubmissions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Schedule */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">📅 Today&apos;s Schedule</h3>
              <span className="text-sm text-gray-500">Monday, Aug 5, 2025</span>
            </div>
            <div className="space-y-4">
              {upcomingLessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">{lesson.time.split(':')[0]}</span>
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{lesson.subject}</h4>
                    <p className="text-sm text-gray-600">{lesson.class} • {lesson.room}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View →
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <button className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium">
                View Full Schedule
              </button>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">📝 Recent Activities</h3>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="text-xl">{getActivityIcon(activity.type)}</span>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">⚡ Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/attendance" className="flex items-center p-4 bg-blue-50 rounded-lg text-left hover:bg-blue-100 transition-colors">
              <div className="flex-shrink-0">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Take Attendance</p>
                <p className="text-xs text-gray-600">Mark present/absent</p>
              </div>
            </Link>

            <Link href="/results" className="flex items-center p-4 bg-green-50 rounded-lg text-left hover:bg-green-100 transition-colors">
              <div className="flex-shrink-0">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Enter Grades</p>
                <p className="text-xs text-gray-600">Update student scores</p>
              </div>
            </Link>

            <Link href="/teacher/assignments" className="flex items-center p-4 bg-purple-50 rounded-lg text-left hover:bg-purple-100 transition-colors">
              <div className="flex-shrink-0">
                <span className="text-2xl">📚</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">My Assignments</p>
                <p className="text-xs text-gray-600">View and manage assignments</p>
              </div>
            </Link>

            <Link href="/teacher/assignments/create" className="flex items-center p-4 bg-orange-50 rounded-lg text-left hover:bg-orange-100 transition-colors">
              <div className="flex-shrink-0">
                <span className="text-2xl">📝</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Create Assignment</p>
                <p className="text-xs text-gray-600">New homework task</p>
              </div>
            </Link>

            <Link href="/admin/messages" className="flex items-center p-4 bg-yellow-50 rounded-lg text-left hover:bg-yellow-100 transition-colors">
              <div className="flex-shrink-0">
                <span className="text-2xl">💬</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Send Message</p>
                <p className="text-xs text-gray-600">Contact parents/students</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-100 p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-2xl">📢</span>
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-medium text-gray-900 mb-2">School Announcements</h4>
              <div className="space-y-2">
                <p className="text-sm text-gray-700">
                  <strong>Staff Meeting:</strong> All teachers are required to attend the monthly staff meeting on Friday, August 9th at 4:00 PM in the conference room.
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Exam Schedule:</strong> Mid-term examinations will begin on August 20th. Please ensure all lesson plans are up to date.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
