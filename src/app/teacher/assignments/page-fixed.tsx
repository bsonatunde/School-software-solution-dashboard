'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { formatDateTime } from '@/lib/api';

interface Assignment {
  _id: string;
  title: string;
  description: string;
  subject: string;
  class: string;
  teacherName: string;
  dueDate: string;
  maxScore: number;
  instructions: string;
  status: string;
  createdAt: string;
}

interface AssignmentSubmission {
  _id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  content: string;
  status: string;
  submittedAt: string;
  grade?: number;
  feedback?: string;
}

export default function TeacherAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'assignments' | 'submissions'>('assignments');
  const [gradingSubmission, setGradingSubmission] = useState<AssignmentSubmission | null>(null);
  const [gradeValue, setGradeValue] = useState<string>('');
  const [feedbackValue, setFeedbackValue] = useState<string>('');
  const [submittingGrade, setSubmittingGrade] = useState(false);

  useEffect(() => {
    // Get teacher data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setTeacherId(user.profileId || user.teacherId || user.id);
      } catch (e) {
        setError('Invalid user session. Please login again.');
      }
    } else {
      setError('No user session found. Please login again.');
    }
  }, []);

  useEffect(() => {
    if (!teacherId) return;

    async function fetchTeacherAssignments() {
      setLoading(true);
      try {
        const response = await fetch(`/api/assignments?teacherId=${teacherId}`);
        const data = await response.json();
        
        if (data.success) {
          setAssignments(data.data);
        } else {
          setError(data.error || 'Failed to fetch assignments');
        }
      } catch (err) {
        setError('Failed to fetch assignments');
        console.error('Error fetching assignments:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTeacherAssignments();
  }, [teacherId]);

  const fetchSubmissions = async (assignmentId: string) => {
    try {
      const response = await fetch(`/api/assignments/${assignmentId}/submissions`);
      const data = await response.json();
      
      if (data.success) {
        setSubmissions(data.data);
        setViewMode('submissions');
      } else {
        setError('Failed to fetch submissions');
      }
    } catch (err) {
      setError('Failed to fetch submissions');
      console.error('Error fetching submissions:', err);
    }
  };

  const handleGradeSubmission = (submission: AssignmentSubmission) => {
    setGradingSubmission(submission);
    setGradeValue(submission.grade?.toString() || '');
    setFeedbackValue(submission.feedback || '');
  };

  const submitGrade = async () => {
    if (!gradingSubmission) return;
    
    setSubmittingGrade(true);
    try {
      // For now, just simulate the grading
      const updatedSubmissions = submissions.map(sub => 
        sub._id === gradingSubmission._id 
          ? { ...sub, grade: parseInt(gradeValue), feedback: feedbackValue, status: 'graded' }
          : sub
      );
      setSubmissions(updatedSubmissions);
      setGradingSubmission(null);
      setGradeValue('');
      setFeedbackValue('');
      alert('Grade and feedback saved successfully!');
    } catch (error) {
      console.error('Error saving grade:', error);
      alert('Failed to save grade');
    } finally {
      setSubmittingGrade(false);
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

  const getSubmissionStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'graded': return 'bg-green-100 text-green-800';
      case 'late': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <DashboardLayout userRole="teacher">
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
      <DashboardLayout userRole="teacher">
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
    <DashboardLayout userRole="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📝 My Assignments</h1>
              <p className="text-gray-600 mt-1">Manage your assignments and view student submissions</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setViewMode('assignments')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'assignments'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                My Assignments
              </button>
              <button
                onClick={() => window.location.href = '/teacher/assignments/create'}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Create New
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'assignments' ? (
          /* Assignments List */
          <div className="space-y-4">
            {assignments.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
                <span className="text-4xl mb-4 block">📚</span>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
                <p className="text-gray-600">You haven&apos;t created any assignments yet.</p>
                <button 
                  onClick={() => window.location.href = '/teacher/assignments/create'}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Your First Assignment
                </button>
              </div>
            ) : (
              assignments.map((assignment) => (
                <div key={assignment._id} className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                          {assignment.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{assignment.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Subject:</span>
                          <p className="text-gray-600">{assignment.subject}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Class:</span>
                          <p className="text-gray-600">{assignment.class}</p>
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
                        onClick={() => fetchSubmissions(assignment._id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        View Submissions
                      </button>
                      <button 
                        onClick={() => alert('Edit functionality coming soon!')}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* Submissions View */
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">📋 Submissions</h2>
                <button
                  onClick={() => setViewMode('assignments')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  ← Back to Assignments
                </button>
              </div>
              
              {submissions.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-4xl mb-4 block">📝</span>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
                  <p className="text-gray-600">Students haven&apos;t submitted their work for this assignment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <div key={submission._id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{submission.studentName}</h4>
                          <p className="text-sm text-gray-600">Student ID: {submission.studentId}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSubmissionStatusColor(submission.status)}`}>
                            {submission.status}
                          </span>
                          <p className="text-sm text-gray-600 mt-1">
                            Submitted: {formatDateTime(submission.submittedAt)}
                          </p>
                          {submission.grade && (
                            <p className="text-sm font-medium text-green-600 mt-1">
                              Grade: {submission.grade}/100
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-sm text-gray-700">{submission.content}</p>
                      </div>
                      {submission.feedback && (
                        <div className="bg-blue-50 rounded-lg p-3 mb-3">
                          <p className="text-sm font-medium text-blue-900">Teacher Feedback:</p>
                          <p className="text-sm text-blue-700 mt-1">{submission.feedback}</p>
                        </div>
                      )}
                      <div className="flex justify-end mt-3 space-x-2">
                        <button 
                          onClick={() => handleGradeSubmission(submission)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          {submission.grade ? 'Update Grade' : 'Grade'}
                        </button>
                        <button 
                          onClick={() => handleGradeSubmission(submission)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                          {submission.feedback ? 'Update Feedback' : 'Add Feedback'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Grading Modal */}
      {gradingSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Grade Submission</h3>
              <button 
                onClick={() => setGradingSubmission(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600">Student: {gradingSubmission.studentName}</p>
              <p className="text-sm text-gray-600">ID: {gradingSubmission.studentId}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grade (out of 100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={gradeValue}
                onChange={(e) => setGradeValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter grade"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feedback
              </label>
              <textarea
                value={feedbackValue}
                onChange={(e) => setFeedbackValue(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter feedback for the student..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setGradingSubmission(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={submitGrade}
                disabled={submittingGrade}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {submittingGrade ? 'Saving...' : 'Save Grade'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
