'use client';

import { useState, useEffect, useCallback } from 'react';
import { User, BookOpen, FileText, Edit3, Save, X } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface Student {
  id: string;
  name: string;
  employeeId: string;
  class: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
}

interface Result {
  studentId: string;
  subjectId: string;
  continuousAssessment: number;
  examination: number;
  total: number;
  grade: string;
  remark: string;
}

const getGrade = (score: number): string => {
  if (score >= 70) return 'A';
  if (score >= 60) return 'B';
  if (score >= 50) return 'C';
  if (score >= 45) return 'D';
  if (score >= 40) return 'E';
  return 'F';
};

const getRemark = (grade: string): string => {
  switch (grade) {
    case 'A': return 'Excellent';
    case 'B': return 'Very Good';
    case 'C': return 'Good';
    case 'D': return 'Fair';
    case 'E': return 'Pass';
    case 'F': return 'Fail';
    default: return '';
  }
};

export default function TeacherResultsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('First Term');
  const [editingResult, setEditingResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const classes = ['JSS 1A', 'JSS 1B', 'JSS 2A', 'JSS 2B', 'JSS 3A', 'JSS 3B', 'SS 1A', 'SS 1B', 'SS 2A', 'SS 2B', 'SS 3A', 'SS 3B'];
  const terms = ['First Term', 'Second Term', 'Third Term'];

  const fetchSubjects = useCallback(async () => {
    try {
      const response = await fetch('/api/subjects');
      if (response.ok) {
        const data = await response.json();
        setSubjects(data.subjects || []);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  }, []);

  const fetchStudents = useCallback(async () => {
    if (!selectedClass) return;
    try {
      setLoading(true);
      const response = await fetch(`/api/students?class=${encodeURIComponent(selectedClass)}`);
      if (response.ok) {
        const data = await response.json();
        setStudents(data.students || []);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedClass]);

  const fetchResults = useCallback(async () => {
    if (!selectedClass || !selectedSubject) return;
    try {
      setLoading(true);
      const response = await fetch(
        `/api/results?class=${encodeURIComponent(selectedClass)}&subject=${encodeURIComponent(selectedSubject)}&term=${encodeURIComponent(selectedTerm)}`
      );
      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedClass, selectedSubject, selectedTerm]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleResultUpdate = async (studentId: string, field: string, value: number) => {
    const existingResult = results.find(r => r.studentId === studentId);
    const ca = field === 'continuousAssessment' ? value : (existingResult?.continuousAssessment || 0);
    const exam = field === 'examination' ? value : (existingResult?.examination || 0);
    const total = ca + exam;
    const grade = getGrade(total);
    const remark = getRemark(grade);

    const updatedResult = {
      studentId,
      subjectId: selectedSubject,
      continuousAssessment: ca,
      examination: exam,
      total,
      grade,
      remark,
      term: selectedTerm,
      class: selectedClass
    };

    try {
      setSaving(true);
      const response = await fetch('/api/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedResult),
      });

      if (response.ok) {
        setResults(prev => {
          const filtered = prev.filter(r => r.studentId !== studentId);
          return [...filtered, updatedResult];
        });
        setEditingResult(null);
      }
    } catch (error) {
      console.error('Error saving result:', error);
    } finally {
      setSaving(false);
    }
  };

  const getStudentResult = (studentId: string) => {
    return results.find(r => r.studentId === studentId) || {
      studentId,
      subjectId: selectedSubject,
      continuousAssessment: 0,
      examination: 0,
      total: 0,
      grade: '',
      remark: ''
    };
  };

  return (
    <DashboardLayout userRole="teacher">
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Results Management 📊</h1>
                  <p className="text-gray-600">Record and manage student examination results</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!selectedClass}
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name} ({subject.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Term
              </label>
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {terms.map((term) => (
                  <option key={term} value={term}>
                    {term}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Table */}
        {selectedClass && selectedSubject && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Results for {selectedClass} - {subjects.find(s => s.id === selectedSubject)?.name} ({selectedTerm})
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CA (40%)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exam (60%)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total (100%)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remark
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                        Loading students...
                      </td>
                    </tr>
                  ) : students.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                        No students found for this class
                      </td>
                    </tr>
                  ) : (
                    students.map((student) => {
                      const result = getStudentResult(student.id);
                      const isEditing = editingResult === student.id;

                      return (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="bg-blue-100 p-2 rounded-full mr-3">
                                <User className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {student.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.employeeId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {isEditing ? (
                              <input
                                type="number"
                                min="0"
                                max="40"
                                defaultValue={result.continuousAssessment}
                                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                onBlur={(e) => handleResultUpdate(student.id, 'continuousAssessment', Number(e.target.value))}
                              />
                            ) : (
                              <span className="text-sm text-gray-900">{result.continuousAssessment}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {isEditing ? (
                              <input
                                type="number"
                                min="0"
                                max="60"
                                defaultValue={result.examination}
                                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                onBlur={(e) => handleResultUpdate(student.id, 'examination', Number(e.target.value))}
                              />
                            ) : (
                              <span className="text-sm text-gray-900">{result.examination}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">{result.total}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              result.grade === 'A' ? 'bg-green-100 text-green-800' :
                              result.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                              result.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                              result.grade === 'D' || result.grade === 'E' ? 'bg-orange-100 text-orange-800' :
                              result.grade === 'F' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {result.grade || '-'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {result.remark || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {isEditing ? (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => setEditingResult(null)}
                                  className="text-green-600 hover:text-green-900"
                                  disabled={saving}
                                >
                                  <Save className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => setEditingResult(null)}
                                  className="text-gray-600 hover:text-gray-900"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setEditingResult(student.id)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!selectedClass && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No class selected</h3>
            <p className="mt-1 text-sm text-gray-500">
              Select a class and subject to start recording results.
            </p>
          </div>
        )}
        </div>
      </div>
    </DashboardLayout>
  );
}
