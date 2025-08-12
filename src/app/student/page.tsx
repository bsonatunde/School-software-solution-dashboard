"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useState, useEffect } from 'react';
import { apiClient, handleApiError } from '@/lib/api';

export default function StudentDashboard() {
  const [studentId, setStudentId] = useState<string | null>(null);
  const [student, setStudent] = useState<any>(null);
  const [attendance, setAttendance] = useState<number | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [fees, setFees] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get student data from localStorage (set during login)
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log('Logged in user data:', user);
        const possibleStudentId = user.profileId || user.studentId || user.id;
        setStudentId(possibleStudentId);
      } catch (e) {
        console.error('Error parsing user data:', e);
        // Fallback to test student for demo purposes
        setStudentId('PSS/2025/001');
      }
    } else {
      console.log('No user session found, using test student ID');
      // Fallback to test student for demo purposes
      setStudentId('PSS/2025/001');
    }
  }, []);

  useEffect(() => {
    if (!studentId) return; // Wait for studentId to be set
    
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Fetch student info
        if (!studentId) throw new Error('Student ID not available');
        const studentRes = await apiClient.getStudent(studentId);
        if (!studentRes.success || !studentRes.data) throw new Error('Student not found');
        setStudent(studentRes.data);

        // Fetch attendance summary
        const attendanceRes = await fetch(`/api/attendance?studentId=${studentId}`);
        const attendanceData = await attendanceRes.json();
        setAttendance(attendanceData?.data?.attendance || null);

        // Fetch results
        const resultsRes = await fetch(`/api/results?studentId=${studentId}`);
        const resultsData = await resultsRes.json();
        setResults(resultsData?.data || []);

        // Fetch fees
        const feesRes = await fetch(`/api/fees?studentId=${studentId}`);
        const feesData = await feesRes.json();
        setFees(feesData?.data || []);

        // Fetch notifications
        try {
          const notificationsRes = await fetch(`/api/notifications?studentId=${studentId}&limit=5`);
          const notificationsData = await notificationsRes.json();
          
          if (notificationsData.success) {
            // Convert notifications to messages format
            const notificationMessages = notificationsData.data.map((notif: any) => ({
              from: notif.teacherName || 'Teacher',
              content: notif.message,
              type: notif.type,
              createdAt: notif.createdAt,
              isRead: notif.isRead
            }));
            
            // Add some default messages if no notifications
            const defaultMessages = notificationMessages.length === 0 ? [
              { from: 'Admin', content: 'Welcome to the new session!' },
              { from: 'Teacher', content: 'Complete your assignments on time.' },
            ] : [];
            
            setMessages([...notificationMessages, ...defaultMessages]);
          } else {
            // Fallback to static messages
            setMessages([
              { from: 'Admin', content: 'Welcome to the new session!' },
              { from: 'Teacher', content: 'Don&apos;t forget your assignment.' },
            ]);
          }
        } catch (notifError) {
          // If notifications fail, use default messages
          setMessages([
            { from: 'Admin', content: 'Welcome to the new session!' },
            { from: 'Teacher', content: 'Complete your assignments on time.' },
          ]);
        }
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [studentId]); // Include studentId as dependency

  if (loading) {
    return (
      <DashboardLayout userRole="student">
        <div className="max-w-4xl mx-auto py-20 text-center text-lg text-gray-500">Loading student dashboard...</div>
      </DashboardLayout>
    );
  }
  if (error) {
    return (
      <DashboardLayout userRole="student">
        <div className="max-w-4xl mx-auto py-20 text-center text-red-600">{error}</div>
      </DashboardLayout>
    );
  }
  if (!student) {
    return (
      <DashboardLayout userRole="student">
        <div className="max-w-4xl mx-auto py-20 text-center text-gray-500">No student data found.</div>
      </DashboardLayout>
    );
  }

  // Calculate fees due
  const totalFeesDue = fees.reduce((sum, fee) => sum + (fee.balance || 0), 0);

  return (
    <DashboardLayout userRole="student">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {student.firstName}!</h1>
          <p className="text-gray-600">Here&apos;s an overview of your academic progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <span className="text-xl">📚</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Attendance</p>
                <p className="text-2xl font-bold text-gray-900">{attendance ? `${attendance}%` : 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <span className="text-xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Results</p>
                <p className="text-2xl font-bold text-gray-900">{results.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <span className="text-xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Fees Due</p>
                <p className="text-2xl font-bold text-gray-900">₦{totalFeesDue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Messages/Notifications */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📨 Recent Messages & Notifications</h2>
          {messages.length > 0 ? (
            <div className="space-y-3">
              {messages.map((message, index) => (
                <div key={index} className={`p-3 rounded-lg border-l-4 ${
                  message.type === 'assignment_graded' 
                    ? 'bg-green-50 border-green-400' 
                    : 'bg-blue-50 border-blue-400'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{message.from}</p>
                      <p className="text-gray-700 text-sm mt-1">{message.content}</p>
                    </div>
                    {message.type === 'assignment_graded' && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        New Grade
                      </span>
                    )}
                  </div>
                  {message.createdAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No messages available</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📝 Assignments</h3>
            <p className="text-gray-600 mb-4">View and submit your assignments</p>
            <a
              href="/student/assignments"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              View Assignments
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Results</h3>
            <p className="text-gray-600 mb-4">Check your academic performance</p>
            <a
              href="/results"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              View Results
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
