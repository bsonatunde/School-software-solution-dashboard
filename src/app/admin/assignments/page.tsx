'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { formatDateTime } from '@/lib/api';
import Link from 'next/link';

interface Assignment {
  _id: string;
  title: string;
  description: string;
  subject: string;
  class: string;
  teacherId: string;
  teacherName: string;
  dueDate: string;
  maxScore: number;
  status: string;
  createdAt: string;
}

interface AssignmentStats {
  totalAssignments: number;
  activeAssignments: number;
  totalSubmissions: number;
  pendingReviews: number;
  assignmentsBySubject: { [key: string]: number };
  assignmentsByClass: { [key: string]: number };
}

export default function AdminAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [stats, setStats] = useState<AssignmentStats>({
    totalAssignments: 0,
    activeAssignments: 0,
    totalSubmissions: 0,
    pendingReviews: 0,
    assignmentsBySubject: {},
    assignmentsByClass: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterSubject, setFilterSubject] = useState<string>('');
  const [filterClass, setFilterClass] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/assignments');
      const data = await response.json();
      
      if (data.success) {
        const assignmentData = data.data;
        setAssignments(assignmentData);
        
        // Calculate stats
        const subjects: { [key: string]: number } = {};
        const classes: { [key: string]: number } = {};
        
        assignmentData.forEach((assignment: Assignment) => {
          subjects[assignment.subject] = (subjects[assignment.subject] || 0) + 1;
          classes[assignment.class] = (classes[assignment.class] || 0) + 1;
        });

        // Fetch total submissions
        const submissionsResponse = await fetch('/api/debug/db-status');
        const submissionsData = await submissionsResponse.json();
        const submissionsCollection = submissionsData.data.collections.find((c: any) => c.name === 'assignment_submissions');
        const totalSubmissions = submissionsCollection?.count || 0;

        setStats({
          totalAssignments: assignmentData.length,
          activeAssignments: assignmentData.filter((a: Assignment) => a.status === 'active').length,
          totalSubmissions,
          pendingReviews: totalSubmissions, // For simplicity, assume all submissions need review
          assignmentsBySubject: subjects,
          assignmentsByClass: classes
        });
      } else {
        setError(data.error || 'Failed to fetch assignments');
      }
    } catch (err) {
      setError('Failed to fetch assignments');
      console.error('Error fetching assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    return (
      (!filterSubject || assignment.subject.toLowerCase().includes(filterSubject.toLowerCase())) &&
      (!filterClass || assignment.class.toLowerCase().includes(filterClass.toLowerCase())) &&
      (!filterStatus || assignment.status === filterStatus)
    );
  });

  if (loading) {
    return (
      <DashboardLayout userRole="admin">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading assignments...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout userRole="admin">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-2 text-sm text-red-700">{error}</p>
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
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📝 Assignment Management</h1>
              <p className="text-gray-600 mt-1">Monitor and manage all school assignments</p>
            </div>
            <div className="flex space-x-3">
              <Link href="/admin" className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                ← Back to Dashboard
              </Link>
              <Link href="/teacher" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                👨‍🏫 Teacher View
              </Link>
              <Link href="/student" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                👨‍🎓 Student View
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <span className="text-2xl">📚</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAssignments}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeAssignments}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <span className="text-2xl">📤</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSubmissions}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingReviews}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Subjects</option>
                {Object.keys(stats.assignmentsBySubject).map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Classes</option>
                {Object.keys(stats.assignmentsByClass).map(className => (
                  <option key={className} value={className}>{className}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Assignments List */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">📋 All Assignments ({filteredAssignments.length})</h3>
          
          {filteredAssignments.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-4xl mb-4 block">📚</span>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
              <p className="text-gray-600">No assignments match the current filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAssignments.map((assignment) => (
                <div key={assignment._id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{assignment.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                          {assignment.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{assignment.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Subject:</span>
                          <p className="text-gray-600">{assignment.subject}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Class:</span>
                          <p className="text-gray-600">{assignment.class}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Teacher:</span>
                          <p className="text-gray-600">{assignment.teacherName}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Due Date:</span>
                          <p className="text-gray-600">{formatDateTime(assignment.dueDate)}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Max Score:</span>
                          <p className="text-gray-600">{assignment.maxScore} points</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => window.open(`/api/assignments/${assignment._id}/submissions`, '_blank')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        View Submissions
                      </button>
                      <Link
                        href={`/teacher/assignments`}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm text-center"
                      >
                        Teacher View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Assignments by Subject</h3>
            <div className="space-y-3">
              {Object.entries(stats.assignmentsBySubject).map(([subject, count]) => (
                <div key={subject} className="flex justify-between items-center">
                  <span className="text-gray-700">{subject}</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🏫 Assignments by Class</h3>
            <div className="space-y-3">
              {Object.entries(stats.assignmentsByClass).map(([className, count]) => (
                <div key={className} className="flex justify-between items-center">
                  <span className="text-gray-700">{className}</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
