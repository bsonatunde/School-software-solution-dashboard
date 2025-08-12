'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { apiClient, formatDateTime } from '@/lib/api';

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
  isSubmitted?: boolean;
  submissionStatus?: string;
  submission?: {
    content: string;
    submittedAt: string;
    score?: number;
    feedback?: string;
    status?: string;
    gradedAt?: string;
    graderName?: string;
  };
}

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [submissionContent, setSubmissionContent] = useState<string>('');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Get student data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setStudentId(user.profileId || user.studentId || user.id);
      } catch (e) {
        setError('Invalid user session. Please login again.');
      }
    } else {
      setError('No user session found. Please login again.');
    }
  }, []);

  useEffect(() => {
    if (!studentId) return;

    async function fetchAssignments() {
      setLoading(true);
      setError(null);
      try {
        if (!studentId) return;
        const response = await apiClient.getAssignments({ studentId });
        if (response.success && Array.isArray(response.data)) {
          setAssignments(response.data);
        } else {
          setError(response.error || 'Failed to fetch assignments');
        }
      } catch (err: any) {
        console.error('Assignment fetch error:', err);
        if (err.message?.includes('Student not found')) {
          setError('Your student account is not set up properly. Please contact the school administrator or try logging in again.');
        } else {
          setError(err.message || 'Failed to fetch assignments');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchAssignments();
  }, [studentId]);

  const handleSubmitAssignment = async (assignment: Assignment) => {
    if (!submissionContent.trim()) {
      alert('Please enter your assignment content');
      return;
    }

    setSubmitting(true);
    try {
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : {};
      
      const response = await apiClient.submitAssignment({
        assignmentId: assignment._id,
        studentId: studentId,
        studentName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        content: submissionContent
      });

      if (response.success) {
        alert('Assignment submitted successfully!');
        setSelectedAssignment(null);
        setSubmissionContent('');
        // Refresh assignments
        if (studentId) {
          const refreshResponse = await apiClient.getAssignments({ studentId });
          if (refreshResponse.success && Array.isArray(refreshResponse.data)) {
            setAssignments(refreshResponse.data);
          }
        }
      } else {
        alert(response.error || 'Failed to submit assignment');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'text-green-600 bg-green-100';
      case 'graded': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const isPastDue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <DashboardLayout userRole="student">
        <div className="max-w-6xl mx-auto py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading assignments...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout userRole="student">
        <div className="max-w-6xl mx-auto py-20 text-center">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          {error.includes('Student not found') && (
            <div className="mt-4">
              <a 
                href="/login" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                🔐 Go to Login
              </a>
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="student">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📚 My Assignments</h1>
          <p className="text-gray-600">View and submit your assignments</p>
        </div>

        {assignments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">No assignments yet</h3>
            <p className="text-gray-500">Check back later for new assignments from your teachers.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {assignments.map((assignment) => (
              <div key={assignment._id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{assignment.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center">
                          📖 <span className="ml-1">{assignment.subject}</span>
                        </span>
                        <span className="flex items-center">
                          👨‍🏫 <span className="ml-1">{assignment.teacherName}</span>
                        </span>
                        <span className="flex items-center">
                          🏆 <span className="ml-1">{assignment.maxScore} points</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.submissionStatus || 'pending')}`}>
                        {assignment.isSubmitted ? 
                          (assignment.submissionStatus === 'graded' ? '✅ Graded' : '📝 Submitted') : 
                          '⏳ Pending'
                        }
                      </div>
                      <div className={`text-sm mt-2 ${isPastDue(assignment.dueDate) ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                        Due: {formatDateTime(assignment.dueDate)}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{assignment.description}</p>

                  {assignment.instructions && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-blue-900 mb-2">📋 Instructions:</h4>
                      <p className="text-blue-800 text-sm">{assignment.instructions}</p>
                    </div>
                  )}

                  {assignment.isSubmitted ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-medium text-green-900 mb-2">✅ Your Submission:</h4>
                      <p className="text-green-800 text-sm whitespace-pre-wrap">{assignment.submission?.content}</p>
                      <p className="text-green-600 text-xs mt-2">
                        Submitted on: {assignment.submission?.submittedAt ? formatDateTime(assignment.submission.submittedAt) : 'Unknown'}
                      </p>
                      
                      {/* Grade Information */}
                      {assignment.submission?.score !== undefined && assignment.submission?.score !== null ? (
                        <div className="mt-3 pt-3 border-t border-green-200">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-green-900">🎯 Grade:</h5>
                            <span className="text-lg font-bold text-green-800">
                              {assignment.submission.score}/{assignment.maxScore}
                            </span>
                          </div>
                          {assignment.submission.feedback && (
                            <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-2">
                              <h6 className="font-medium text-blue-900 text-sm mb-1">💬 Teacher Feedback:</h6>
                              <p className="text-blue-800 text-sm">{assignment.submission.feedback}</p>
                            </div>
                          )}
                          {assignment.submission.gradedAt && (
                            <p className="text-green-600 text-xs mt-2">
                              Graded on: {formatDateTime(assignment.submission.gradedAt)}
                              {assignment.submission.graderName && ` by ${assignment.submission.graderName}`}
                            </p>
                          )}
                        </div>
                      ) : assignment.submissionStatus === 'graded' ? (
                        <div className="mt-3 pt-3 border-t border-green-200">
                          <p className="text-green-700 text-sm">✅ Graded - Check with your teacher for details</p>
                        </div>
                      ) : (
                        <div className="mt-3 pt-3 border-t border-green-200">
                          <p className="text-yellow-700 text-sm">⏳ Awaiting teacher review</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="border-t pt-4">
                      {isPastDue(assignment.dueDate) ? (
                        <div className="text-red-600 text-sm font-medium">
                          ⚠️ This assignment is past due and cannot be submitted.
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedAssignment(assignment)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                        >
                          📝 Submit Assignment
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Submission Modal */}
        {selectedAssignment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Submit: {selectedAssignment.title}
                </h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Assignment Content *
                  </label>
                  <textarea
                    value={submissionContent}
                    onChange={(e) => setSubmissionContent(e.target.value)}
                    className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Type your assignment content here..."
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setSelectedAssignment(null);
                      setSubmissionContent('');
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSubmitAssignment(selectedAssignment)}
                    disabled={submitting || !submissionContent.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : 'Submit Assignment'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
