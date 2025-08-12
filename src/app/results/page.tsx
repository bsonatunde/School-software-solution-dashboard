'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';

interface Subject {
  id: string;
  name: string;
  code: string;
  teacher: string;
}

interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  class: string;
}

interface Grade {
  studentId: string;
  subjectId: string;
  assessment1: number | null;
  assessment2: number | null;
  exam: number | null;
  total: number | null;
  grade: string;
  position?: number;
}

interface ClassResults {
  [studentId: string]: {
    [subjectId: string]: Grade;
  };
}

export default function ResultsPage() {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('1st Term');
  const [selectedSession, setSelectedSession] = useState('2024/2025');
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [results, setResults] = useState<ClassResults>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const classes = [
    'JSS 1A', 'JSS 1B', 'JSS 2A', 'JSS 2B', 'JSS 3A', 'JSS 3B',
    'SS 1A', 'SS 1B', 'SS 2A', 'SS 2B', 'SS 3A', 'SS 3B'
  ];

  const terms = ['1st Term', '2nd Term', '3rd Term'];
  const sessions = ['2024/2025', '2023/2024', '2022/2023'];

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudentsAndResults();
    }
  }, [selectedClass, selectedSubject, selectedTerm, selectedSession]);

  const fetchSubjects = async () => {
    try {
      const response = await fetch('/api/subjects');
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        setSubjects(data.data);
      } else {
        console.warn('Invalid subjects data received:', data);
        setSubjects([]); // Ensure subjects is always an array
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setSubjects([]); // Ensure subjects is always an array on error
    }
  };

  const fetchStudentsAndResults = async () => {
    try {
      setLoading(true);
      
      // Fetch students for the class
      const studentsResponse = await fetch('/api/students');
      const studentsData = await studentsResponse.json();
      
      if (studentsData.success) {
        const classStudents = studentsData.data.filter((student: Student) => student.class === selectedClass);
        setStudents(classStudents);
        
        // Fetch existing results
        const resultsResponse = await fetch(
          `/api/results?class=${selectedClass}&subject=${selectedSubject}&term=${selectedTerm}&session=${selectedSession}`
        );
        const resultsData = await resultsResponse.json();
        
        if (resultsData.success) {
          // Transform results data into the expected format
          const transformedResults: ClassResults = {};
          classStudents.forEach((student: Student) => {
            transformedResults[student.id] = {};
            (subjects || []).forEach((subject: Subject) => {
              const existingResult = resultsData.data.find(
                (r: any) => r.studentId === student.id && r.subjectId === subject.id
              );
              
              transformedResults[student.id][subject.id] = existingResult || {
                studentId: student.id,
                subjectId: subject.id,
                assessment1: null,
                assessment2: null,
                exam: null,
                total: null,
                grade: ''
              };
            });
          });
          setResults(transformedResults);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (assessment1: number | null, assessment2: number | null, exam: number | null): number | null => {
    if (assessment1 === null || assessment2 === null || exam === null) return null;
    return assessment1 + assessment2 + exam;
  };

  const calculateGrade = (total: number | null): string => {
    if (total === null) return '';
    if (total >= 90) return 'A1';
    if (total >= 80) return 'B2';
    if (total >= 70) return 'B3';
    if (total >= 60) return 'C4';
    if (total >= 50) return 'C5';
    if (total >= 45) return 'C6';
    if (total >= 40) return 'D7';
    if (total >= 30) return 'E8';
    return 'F9';
  };

  const getGradeColor = (grade: string): string => {
    if (['A1', 'B2', 'B3'].includes(grade)) return 'text-green-600 bg-green-100';
    if (['C4', 'C5', 'C6'].includes(grade)) return 'text-yellow-600 bg-yellow-100';
    if (['D7', 'E8'].includes(grade)) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const handleScoreChange = (studentId: string, subjectId: string, field: keyof Grade, value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    
    setResults(prev => {
      const updated = { ...prev };
      if (!updated[studentId]) updated[studentId] = {};
      if (!updated[studentId][subjectId]) {
        updated[studentId][subjectId] = {
          studentId,
          subjectId,
          assessment1: null,
          assessment2: null,
          exam: null,
          total: null,
          grade: ''
        };
      }
      
      updated[studentId][subjectId] = {
        ...updated[studentId][subjectId],
        [field]: numValue
      };
      
      // Recalculate total and grade
      const result = updated[studentId][subjectId];
      const total = calculateTotal(result.assessment1, result.assessment2, result.exam);
      result.total = total;
      result.grade = calculateGrade(total);
      
      return updated;
    });
  };

  const saveResults = async () => {
    try {
      setSaving(true);
      
      const resultsToSave = [];
      
      for (const studentId in results) {
        for (const subjectId in results[studentId]) {
          const result = results[studentId][subjectId];
          if (result.assessment1 !== null || result.assessment2 !== null || result.exam !== null) {
            resultsToSave.push({
              ...result,
              class: selectedClass,
              term: selectedTerm,
              session: selectedSession
            });
          }
        }
      }
      
      const response = await fetch('/api/results/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          class: selectedClass,
          term: selectedTerm,
          session: selectedSession,
          results: resultsToSave
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`Results saved successfully for ${resultsToSave.length} entries!`);
      } else {
        throw new Error(data.error || 'Failed to save results');
      }
    } catch (error) {
      console.error('Error saving results:', error);
      alert(error instanceof Error ? error.message : 'Failed to save results');
    } finally {
      setSaving(false);
    }
  };

  const getClassAverage = (subjectId: string): number => {
    const validScores = students
      .map(student => results[student.id]?.[subjectId]?.total)
      .filter(score => score !== null && score !== undefined) as number[];
    
    if (validScores.length === 0) return 0;
    return Math.round(validScores.reduce((sum, score) => sum + score, 0) / validScores.length);
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Results Management</h1>
            <p className="text-gray-600">Enter and manage student academic results</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => router.push('/results/reports')}
              className="bg-secondary-600 text-white px-4 py-2 rounded-lg hover:bg-secondary-700 transition-colors"
            >
              📊 View Reports
            </button>
            <button
              onClick={() => router.push('/results/report-cards')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              📋 Report Cards
              <span className="ml-2 text-xs bg-green-500 px-2 py-1 rounded-full">Demo Available</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Academic Session</label>
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {sessions.map(session => (
                  <option key={session} value={session}>{session}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Term</label>
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {terms.map(term => (
                  <option key={term} value={term}>{term}</option>
                ))}
              </select>
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject (Optional)</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Subjects</option>
                {subjects && subjects.length > 0 ? subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                )) : (
                  <option disabled>No subjects available</option>
                )}
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={saveResults}
                disabled={saving || !selectedClass}
                className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Results'}
              </button>
            </div>
          </div>
        </div>

        {/* Results Entry Table */}
        {selectedClass && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedClass} - {selectedTerm} {selectedSession}
                {selectedSubject && subjects && ` - ${subjects.find(s => s.id === selectedSubject)?.name}`}
              </h3>
            </div>
            
            {loading ? (
              <div className="p-6">
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            ) : students.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50">
                        Student
                      </th>
                      {(selectedSubject ? (subjects?.filter(s => s.id === selectedSubject) || []) : (subjects || [])).map(subject => (
                        <th key={subject.id} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200">
                          <div className="space-y-1">
                            <div className="font-semibold">{subject.name}</div>
                            <div className="grid grid-cols-4 gap-1 text-xs">
                              <div>CA1 (10)</div>
                              <div>CA2 (10)</div>
                              <div>Exam (80)</div>
                              <div>Total</div>
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white">
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
                              <div className="text-sm text-gray-500">
                                {student.studentId}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        {(selectedSubject ? (subjects?.filter(s => s.id === selectedSubject) || []) : (subjects || [])).map(subject => {
                          const result = results[student.id]?.[subject.id] || {
                            assessment1: null,
                            assessment2: null,
                            exam: null,
                            total: null,
                            grade: ''
                          };
                          
                          return (
                            <td key={subject.id} className="px-2 py-4 border-l border-gray-200">
                              <div className="grid grid-cols-4 gap-1">
                                <input
                                  type="number"
                                  min="0"
                                  max="10"
                                  value={result.assessment1 ?? ''}
                                  onChange={(e) => handleScoreChange(student.id, subject.id, 'assessment1', e.target.value)}
                                  className="w-14 px-1 py-1 text-xs border border-gray-300 rounded text-center focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                                  placeholder="0"
                                />
                                <input
                                  type="number"
                                  min="0"
                                  max="10"
                                  value={result.assessment2 ?? ''}
                                  onChange={(e) => handleScoreChange(student.id, subject.id, 'assessment2', e.target.value)}
                                  className="w-14 px-1 py-1 text-xs border border-gray-300 rounded text-center focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                                  placeholder="0"
                                />
                                <input
                                  type="number"
                                  min="0"
                                  max="80"
                                  value={result.exam ?? ''}
                                  onChange={(e) => handleScoreChange(student.id, subject.id, 'exam', e.target.value)}
                                  className="w-14 px-1 py-1 text-xs border border-gray-300 rounded text-center focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                                  placeholder="0"
                                />
                                <div className="flex flex-col items-center">
                                  <div className="text-xs font-medium text-gray-900">
                                    {result.total || '—'}
                                  </div>
                                  {result.grade && (
                                    <span className={`inline-flex px-1 py-0.5 text-xs font-semibold rounded ${getGradeColor(result.grade)}`}>
                                      {result.grade}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                    
                    {/* Class Average Row */}
                    <tr className="bg-blue-50 font-medium">
                      <td className="px-6 py-3 text-sm text-blue-900 sticky left-0 bg-blue-50">
                        Class Average
                      </td>
                      {(selectedSubject ? (subjects?.filter(s => s.id === selectedSubject) || []) : (subjects || [])).map(subject => (
                        <td key={subject.id} className="px-2 py-3 text-center border-l border-blue-200">
                          <div className="text-sm font-semibold text-blue-900">
                            {getClassAverage(subject.id) || '—'}
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">📚</span>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                <p className="text-gray-500">
                  No students are enrolled in {selectedClass}.
                </p>
              </div>
            )}
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
                <h3 className="text-sm font-medium text-blue-800">Getting Started with Results Entry</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Select the academic session and term</li>
                    <li>Choose the class you want to enter results for</li>
                    <li>Optionally filter by a specific subject</li>
                    <li>Enter scores for CA1 (10 marks), CA2 (10 marks), and Exam (80 marks)</li>
                    <li>Total scores and grades are calculated automatically</li>
                    <li>Click "Save Results" to store the data</li>
                  </ol>
                  <div className="mt-3 p-3 bg-blue-100 rounded">
                    <strong>Grading Scale:</strong> A1 (90-100), B2 (80-89), B3 (70-79), C4 (60-69), C5 (50-59), C6 (45-49), D7 (40-44), E8 (30-39), F9 (0-29)
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
