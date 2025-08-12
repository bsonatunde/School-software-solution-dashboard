'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';

interface SubjectPerformance {
  subjectId: string;
  subjectName: string;
  studentsCount: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passRate: number;
  gradeDistribution: { [grade: string]: number };
}

interface ClassPerformance {
  className: string;
  studentsCount: number;
  averageScore: number;
  overallPosition: number;
  subjectsAbove70: number;
  subjectsBelow40: number;
}

interface StudentPerformance {
  studentId: string;
  studentName: string;
  totalScore: number;
  averageScore: number;
  position: number;
  grade: string;
  subjectsCount: number;
  strongSubjects: string[];
  weakSubjects: string[];
}

export default function ResultsReportsPage() {
  const [reportType, setReportType] = useState<'subject' | 'class' | 'student' | 'comparative'>('subject');
  const [selectedTerm, setSelectedTerm] = useState('1st Term');
  const [selectedSession, setSelectedSession] = useState('2024/2025');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjectReports, setSubjectReports] = useState<SubjectPerformance[]>([]);
  const [classReports, setClassReports] = useState<ClassPerformance[]>([]);
  const [studentReports, setStudentReports] = useState<StudentPerformance[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const classes = [
    'JSS 1A', 'JSS 1B', 'JSS 2A', 'JSS 2B', 'JSS 3A', 'JSS 3B',
    'SS 1A', 'SS 1B', 'SS 2A', 'SS 2B', 'SS 3A', 'SS 3B'
  ];

  const subjects = [
    'Mathematics', 'English Language', 'Basic Science', 'Social Studies',
    'Physics', 'Chemistry', 'Biology', 'Economics', 'Government'
  ];

  const terms = ['1st Term', '2nd Term', '3rd Term'];
  const sessions = ['2024/2025', '2023/2024', '2022/2023'];

  const generateReport = useCallback(async () => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (reportType === 'subject') {
      // Generate subject performance reports
      const mockSubjectReports: SubjectPerformance[] = [
        {
          subjectId: 'MTH',
          subjectName: 'Mathematics',
          studentsCount: 145,
          averageScore: 67.2,
          highestScore: 96,
          lowestScore: 23,
          passRate: 78.6,
          gradeDistribution: { 'A1': 12, 'B2': 18, 'B3': 25, 'C4': 32, 'C5': 28, 'C6': 15, 'D7': 8, 'E8': 4, 'F9': 3 }
        },
        {
          subjectId: 'ENG',
          subjectName: 'English Language',
          studentsCount: 145,
          averageScore: 71.5,
          highestScore: 94,
          lowestScore: 31,
          passRate: 84.1,
          gradeDistribution: { 'A1': 15, 'B2': 22, 'B3': 28, 'C4': 35, 'C5': 25, 'C6': 12, 'D7': 5, 'E8': 2, 'F9': 1 }
        },
        {
          subjectId: 'BSC',
          subjectName: 'Basic Science',
          studentsCount: 145,
          averageScore: 64.8,
          highestScore: 92,
          lowestScore: 18,
          passRate: 73.1,
          gradeDistribution: { 'A1': 8, 'B2': 16, 'B3': 23, 'C4': 29, 'C5': 30, 'C6': 18, 'D7': 12, 'E8': 6, 'F9': 3 }
        }
      ];
      setSubjectReports(mockSubjectReports);
    } else if (reportType === 'class') {
      // Generate class performance reports
      const mockClassReports: ClassPerformance[] = [
        {
          className: 'JSS 1A',
          studentsCount: 28,
          averageScore: 72.3,
          overallPosition: 1,
          subjectsAbove70: 6,
          subjectsBelow40: 0
        },
        {
          className: 'JSS 1B',
          studentsCount: 26,
          averageScore: 68.7,
          overallPosition: 2,
          subjectsAbove70: 4,
          subjectsBelow40: 1
        },
        {
          className: 'JSS 2A',
          studentsCount: 30,
          averageScore: 65.4,
          overallPosition: 3,
          subjectsAbove70: 3,
          subjectsBelow40: 2
        }
      ];
      setClassReports(mockClassReports);
    } else if (reportType === 'student') {
      // Generate student performance reports
      const mockStudentReports: StudentPerformance[] = [
        {
          studentId: 'ST001',
          studentName: 'Adebayo Oluwaseun',
          totalScore: 847,
          averageScore: 84.7,
          position: 1,
          grade: 'B2',
          subjectsCount: 10,
          strongSubjects: ['Mathematics', 'Physics', 'Chemistry'],
          weakSubjects: ['English Language']
        },
        {
          studentId: 'ST002',
          studentName: 'Chioma Okwu',
          totalScore: 823,
          averageScore: 82.3,
          position: 2,
          grade: 'B2',
          subjectsCount: 10,
          strongSubjects: ['English Language', 'Literature', 'Government'],
          weakSubjects: ['Mathematics', 'Physics']
        },
        {
          studentId: 'ST003',
          studentName: 'Ibrahim Mohammed',
          totalScore: 756,
          averageScore: 75.6,
          position: 8,
          grade: 'B3',
          subjectsCount: 10,
          strongSubjects: ['Islamic Studies', 'Arabic', 'Geography'],
          weakSubjects: ['Chemistry', 'Biology']
        }
      ];
      setStudentReports(selectedClass ? 
        mockStudentReports : 
        mockStudentReports.slice(0, 10)
      );
    }
    
    setLoading(false);
  }, [reportType, selectedTerm, selectedSession, selectedClass, selectedSubject]);

  useEffect(() => {
    generateReport();
  }, [generateReport]);

  const exportReport = () => {
    alert('Report export functionality would be implemented here');
  };

  const getGradeColor = (grade: string): string => {
    if (['A1', 'B2', 'B3'].includes(grade)) return 'text-green-600 bg-green-100';
    if (['C4', 'C5', 'C6'].includes(grade)) return 'text-yellow-600 bg-yellow-100';
    if (['D7', 'E8'].includes(grade)) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getPerformanceColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Academic Reports</h1>
            <p className="text-gray-600">Comprehensive academic performance analytics</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={exportReport}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              📊 Export Report
            </button>
            <button
              onClick={() => router.push('/results')}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Back to Results
            </button>
          </div>
        </div>

        {/* Report Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="subject">Subject Performance</option>
                <option value="class">Class Comparison</option>
                <option value="student">Student Rankings</option>
                <option value="comparative">Term Comparison</option>
              </select>
            </div>

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
              <label className="block text-sm font-medium text-gray-700 mb-2">Class (Optional)</label>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject (Optional)</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Report Content */}
        {loading ? (
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Generating report...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Subject Performance Report */}
            {reportType === 'subject' && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Subject Performance Analysis - {selectedTerm} {selectedSession}
                  </h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Highest</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lowest</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pass Rate</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade Distribution</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {subjectReports.map((subject) => (
                        <tr key={subject.subjectId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{subject.subjectName}</div>
                            <div className="text-sm text-gray-500">{subject.subjectId}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {subject.studentsCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm font-medium ${getPerformanceColor(subject.averageScore)}`}>
                              {subject.averageScore.toFixed(1)}%
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                            {subject.highestScore}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                            {subject.lowestScore}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm font-medium ${getPerformanceColor(subject.passRate)}`}>
                              {subject.passRate.toFixed(1)}%
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-1">
                              {Object.entries(subject.gradeDistribution).slice(0, 5).map(([grade, count]) => (
                                <span key={grade} className={`inline-flex px-1 py-0.5 text-xs font-semibold rounded ${getGradeColor(grade)}`}>
                                  {grade}: {count}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Class Performance Report */}
            {reportType === 'class' && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Class Performance Comparison - {selectedTerm} {selectedSession}
                  </h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Score</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Strong Subjects</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weak Subjects</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {classReports.map((classData) => (
                        <tr key={classData.className} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex w-8 h-8 items-center justify-center rounded-full text-sm font-medium ${
                              classData.overallPosition === 1 ? 'bg-yellow-100 text-yellow-800' :
                              classData.overallPosition <= 3 ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {classData.overallPosition}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{classData.className}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {classData.studentsCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm font-medium ${getPerformanceColor(classData.averageScore)}`}>
                              {classData.averageScore.toFixed(1)}%
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              {classData.subjectsAbove70} subjects
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                              {classData.subjectsBelow40} subjects
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Student Performance Report */}
            {reportType === 'student' && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Top Students Rankings - {selectedTerm} {selectedSession}
                    {selectedClass && ` - ${selectedClass}`}
                  </h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Score</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Strong Subjects</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Needs Improvement</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {studentReports.map((student) => (
                        <tr key={student.studentId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex w-8 h-8 items-center justify-center rounded-full text-sm font-medium ${
                              student.position === 1 ? 'bg-yellow-100 text-yellow-800' :
                              student.position <= 3 ? 'bg-green-100 text-green-800' :
                              student.position <= 10 ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {student.position}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8">
                                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                                  <span className="text-xs font-medium text-primary-700">
                                    {student.studentName.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{student.studentName}</div>
                                <div className="text-sm text-gray-500">{student.studentId}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.totalScore}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm font-medium ${getPerformanceColor(student.averageScore)}`}>
                              {student.averageScore.toFixed(1)}%
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(student.grade)}`}>
                              {student.grade}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-xs space-y-1">
                              {student.strongSubjects.slice(0, 2).map(subject => (
                                <div key={subject} className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-1">
                                  {subject}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-xs space-y-1">
                              {student.weakSubjects.slice(0, 2).map(subject => (
                                <div key={subject} className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded mr-1">
                                  {subject}
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Summary Statistics */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">Average Performance</div>
                  <div className="text-2xl font-bold text-primary-600">
                    {reportType === 'subject' && subjectReports.length > 0 ? 
                      Math.round(subjectReports.reduce((acc, s) => acc + s.averageScore, 0) / subjectReports.length) :
                      reportType === 'class' && classReports.length > 0 ?
                      Math.round(classReports.reduce((acc, c) => acc + c.averageScore, 0) / classReports.length) :
                      reportType === 'student' && studentReports.length > 0 ?
                      Math.round(studentReports.reduce((acc, s) => acc + s.averageScore, 0) / studentReports.length) :
                      0
                    }%
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">🏆</span>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">Top Performers</div>
                  <div className="text-2xl font-bold text-green-600">
                    {reportType === 'student' ? studentReports.filter(s => s.averageScore >= 80).length :
                     reportType === 'subject' ? subjectReports.filter(s => s.averageScore >= 80).length :
                     reportType === 'class' ? classReports.filter(c => c.averageScore >= 80).length : 0}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">📈</span>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">Pass Rate</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {reportType === 'subject' && subjectReports.length > 0 ? 
                      Math.round(subjectReports.reduce((acc, s) => acc + s.passRate, 0) / subjectReports.length) :
                      85}%
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">Need Attention</div>
                  <div className="text-2xl font-bold text-red-600">
                    {reportType === 'student' ? studentReports.filter(s => s.averageScore < 50).length :
                     reportType === 'subject' ? subjectReports.filter(s => s.averageScore < 50).length :
                     reportType === 'class' ? classReports.filter(c => c.averageScore < 50).length : 2}
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
