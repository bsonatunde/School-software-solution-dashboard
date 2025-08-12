'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';

interface StudentResult {
  subjectId: string;
  subjectName: string;
  assessment1: number;
  assessment2: number;
  exam: number;
  total: number;
  grade: string;
  position: number;
  remark: string;
}

interface StudentReportCard {
  studentId: string;
  studentName: string;
  class: string;
  term: string;
  session: string;
  results: StudentResult[];
  totalScore: number;
  averageScore: number;
  overallPosition: number;
  overallGrade: string;
  timesPresent: number;
  timesAbsent: number;
  nextTermBegins: string;
  principalComment: string;
  teacherComment: string;
}

export default function ReportCardsPage() {
  const [selectedClass, setSelectedClass] = useState('JSS 1A');
  const [selectedTerm, setSelectedTerm] = useState('1st Term');
  const [selectedSession, setSelectedSession] = useState('2024/2025');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [reportCard, setReportCard] = useState<StudentReportCard | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const classes = [
    'JSS 1A', 'JSS 1B', 'JSS 2A', 'JSS 2B', 'JSS 3A', 'JSS 3B',
    'SS 1A', 'SS 1B', 'SS 2A', 'SS 2B', 'SS 3A', 'SS 3B'
  ];

  const terms = ['1st Term', '2nd Term', '3rd Term'];
  const sessions = ['2024/2025', '2023/2024', '2022/2023'];

  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
    }
  }, [selectedClass]);

  useEffect(() => {
    if (selectedStudent) {
      generateReportCard();
    }
  }, [selectedStudent, selectedTerm, selectedSession]);

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students');
      const data = await response.json();
      
      if (data.success) {
        const classStudents = data.data.filter((student: any) => student.class === selectedClass);
        setStudents(classStudents);
        if (classStudents.length > 0) {
          setSelectedStudent(classStudents[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const generateReportCard = async () => {
    if (!selectedStudent) return;

    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock report card data
    const mockReportCard: StudentReportCard = {
      studentId: selectedStudent,
      studentName: students.find(s => s.id === selectedStudent)?.firstName + ' ' + students.find(s => s.id === selectedStudent)?.lastName || 'Student Name',
      class: selectedClass,
      term: selectedTerm,
      session: selectedSession,
      results: [
        {
          subjectId: 'MTH',
          subjectName: 'Mathematics',
          assessment1: 8,
          assessment2: 9,
          exam: 75,
          total: 92,
          grade: 'A1',
          position: 1,
          remark: 'Excellent'
        },
        {
          subjectId: 'ENG',
          subjectName: 'English Language',
          assessment1: 7,
          assessment2: 8,
          exam: 68,
          total: 83,
          grade: 'B2',
          position: 3,
          remark: 'Very Good'
        },
        {
          subjectId: 'BSC',
          subjectName: 'Basic Science',
          assessment1: 6,
          assessment2: 7,
          exam: 62,
          total: 75,
          grade: 'B3',
          position: 5,
          remark: 'Good'
        },
        {
          subjectId: 'SOS',
          subjectName: 'Social Studies',
          assessment1: 9,
          assessment2: 8,
          exam: 71,
          total: 88,
          grade: 'B2',
          position: 2,
          remark: 'Very Good'
        },
        {
          subjectId: 'FRE',
          subjectName: 'French',
          assessment1: 5,
          assessment2: 6,
          exam: 48,
          total: 59,
          grade: 'C5',
          position: 12,
          remark: 'Fair'
        },
        {
          subjectId: 'YOR',
          subjectName: 'Yoruba',
          assessment1: 8,
          assessment2: 9,
          exam: 73,
          total: 90,
          grade: 'A1',
          position: 1,
          remark: 'Excellent'
        },
        {
          subjectId: 'BTE',
          subjectName: 'Basic Technology',
          assessment1: 7,
          assessment2: 8,
          exam: 65,
          total: 80,
          grade: 'B2',
          position: 4,
          remark: 'Very Good'
        },
        {
          subjectId: 'HEC',
          subjectName: 'Home Economics',
          assessment1: 6,
          assessment2: 7,
          exam: 58,
          total: 71,
          grade: 'B3',
          position: 8,
          remark: 'Good'
        },
        {
          subjectId: 'AGR',
          subjectName: 'Agricultural Science',
          assessment1: 5,
          assessment2: 6,
          exam: 52,
          total: 63,
          grade: 'C4',
          position: 10,
          remark: 'Credit'
        },
        {
          subjectId: 'CRS',
          subjectName: 'Christian Religious Studies',
          assessment1: 9,
          assessment2: 9,
          exam: 76,
          total: 94,
          grade: 'A1',
          position: 1,
          remark: 'Excellent'
        }
      ],
      totalScore: 805,
      averageScore: 80.5,
      overallPosition: 2,
      overallGrade: 'B2',
      timesPresent: 58,
      timesAbsent: 2,
      nextTermBegins: '2025-04-21',
      principalComment: 'An excellent student with consistent performance across all subjects. Keep up the good work!',
      teacherComment: 'Shows great dedication to studies. Recommend more practice in French and Agricultural Science.'
    };

    setReportCard(mockReportCard);
    setLoading(false);
  };

  const printReportCard = () => {
    window.print();
  };

  const generateDemoReportCard = () => {
    const demoReportCard: StudentReportCard = {
      studentId: 'DEMO001',
      studentName: 'Adebayo Folake Jennifer',
      class: 'JSS 2A',
      term: '1st Term',
      session: '2024/2025',
      results: [
        {
          subjectId: 'MTH',
          subjectName: 'Mathematics',
          assessment1: 15,
          assessment2: 18,
          exam: 68,
          total: 101,
          grade: 'A1',
          position: 1,
          remark: 'Excellent'
        },
        {
          subjectId: 'ENG',
          subjectName: 'English Language',
          assessment1: 13,
          assessment2: 16,
          exam: 62,
          total: 91,
          grade: 'A1',
          position: 2,
          remark: 'Excellent'
        },
        {
          subjectId: 'BSC',
          subjectName: 'Basic Science',
          assessment1: 12,
          assessment2: 15,
          exam: 58,
          total: 85,
          grade: 'B2',
          position: 3,
          remark: 'Very Good'
        },
        {
          subjectId: 'SOS',
          subjectName: 'Social Studies',
          assessment1: 14,
          assessment2: 17,
          exam: 65,
          total: 96,
          grade: 'A1',
          position: 1,
          remark: 'Excellent'
        },
        {
          subjectId: 'IGO',
          subjectName: 'Igbo Language',
          assessment1: 16,
          assessment2: 18,
          exam: 72,
          total: 106,
          grade: 'A1',
          position: 1,
          remark: 'Outstanding'
        },
        {
          subjectId: 'YOR',
          subjectName: 'Yoruba Language',
          assessment1: 15,
          assessment2: 17,
          exam: 69,
          total: 101,
          grade: 'A1',
          position: 1,
          remark: 'Excellent'
        },
        {
          subjectId: 'FRE',
          subjectName: 'French',
          assessment1: 10,
          assessment2: 12,
          exam: 48,
          total: 70,
          grade: 'B3',
          position: 8,
          remark: 'Good'
        },
        {
          subjectId: 'BTE',
          subjectName: 'Basic Technology',
          assessment1: 13,
          assessment2: 16,
          exam: 60,
          total: 89,
          grade: 'B2',
          position: 4,
          remark: 'Very Good'
        },
        {
          subjectId: 'HEC',
          subjectName: 'Home Economics',
          assessment1: 14,
          assessment2: 17,
          exam: 66,
          total: 97,
          grade: 'A1',
          position: 2,
          remark: 'Excellent'
        },
        {
          subjectId: 'AGR',
          subjectName: 'Agricultural Science',
          assessment1: 11,
          assessment2: 14,
          exam: 54,
          total: 79,
          grade: 'B2',
          position: 6,
          remark: 'Very Good'
        },
        {
          subjectId: 'CRS',
          subjectName: 'Christian Religious Studies',
          assessment1: 17,
          assessment2: 19,
          exam: 74,
          total: 110,
          grade: 'A1',
          position: 1,
          remark: 'Outstanding'
        },
        {
          subjectId: 'CCE',
          subjectName: 'Civic Education',
          assessment1: 15,
          assessment2: 18,
          exam: 67,
          total: 100,
          grade: 'A1',
          position: 1,
          remark: 'Excellent'
        }
      ],
      totalScore: 1105,
      averageScore: 92.1,
      overallPosition: 1,
      overallGrade: 'A1',
      timesPresent: 64,
      timesAbsent: 1,
      nextTermBegins: '2025-04-28',
      principalComment: 'Folake is an exceptional student who demonstrates outstanding academic excellence and leadership qualities. Her performance is exemplary across all subjects. She should continue to maintain this excellent standard.',
      teacherComment: 'A brilliant and dedicated student. Shows remarkable consistency in all subjects. Excellent participation in class activities. Should focus on improving French language skills while maintaining current high standards in other subjects.'
    };

    setReportCard(demoReportCard);
  };

  const getGradeColor = (grade: string): string => {
    if (['A1', 'B2', 'B3'].includes(grade)) return 'text-green-600 bg-green-100';
    if (['C4', 'C5', 'C6'].includes(grade)) return 'text-yellow-600 bg-yellow-100';
    if (['D7', 'E8'].includes(grade)) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getPositionSuffix = (position: number): string => {
    if (position % 10 === 1 && position % 100 !== 11) return 'st';
    if (position % 10 === 2 && position % 100 !== 12) return 'nd';
    if (position % 10 === 3 && position % 100 !== 13) return 'rd';
    return 'th';
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center print:hidden">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Student Report Cards 📊</h1>
            <p className="text-gray-600">Generate and print detailed academic reports for Nigerian schools</p>
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                💡 <strong>Tip:</strong> Click "View Demo Report" to see a sample report card with realistic Nigerian school data
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={generateDemoReportCard}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              🎯 View Demo Report
            </button>
            {reportCard && (
              <button
                onClick={printReportCard}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                🖨️ Print Report
              </button>
            )}
            <button
              onClick={() => router.push('/results')}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Back to Results
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm print:hidden">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                {classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select a student</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.firstName} {student.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Report Card */}
        {loading ? (
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Generating report card...</p>
            </div>
          </div>
        ) : reportCard ? (
          <div className="bg-white rounded-lg shadow-sm print:shadow-none print:rounded-none">
            {/* Report Card Header */}
            <div className="text-center p-8 border-b border-gray-200 print:border-b-2 print:border-black">
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-primary-600 print:text-black">PACEY SCHOOL SOLUTION</h1>
                <p className="text-gray-600 print:text-black">Excellence in Education • Character Development • Future Leaders</p>
                <p className="text-sm text-gray-500 print:text-black">📍 123 Education Avenue, Lagos, Nigeria | 📞 +234 801 234 5678</p>
              </div>
              
              <div className="bg-primary-50 print:bg-gray-100 p-4 rounded-lg print:rounded-none">
                <h2 className="text-xl font-bold text-gray-900 mb-2">STUDENT REPORT CARD</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-left">
                    <p><strong>Name:</strong> {reportCard.studentName}</p>
                    <p><strong>Class:</strong> {reportCard.class}</p>
                    <p><strong>Student ID:</strong> {reportCard.studentId}</p>
                  </div>
                  <div className="text-left">
                    <p><strong>Term:</strong> {reportCard.term}</p>
                    <p><strong>Session:</strong> {reportCard.session}</p>
                    <p><strong>Next Term Begins:</strong> {new Date(reportCard.nextTermBegins).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Performance */}
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">ACADEMIC PERFORMANCE</h3>
              
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full divide-y divide-gray-200 print:divide-black text-sm">
                  <thead className="bg-gray-50 print:bg-gray-200">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 print:text-black uppercase tracking-wider border print:border-black">Subject</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 print:text-black uppercase tracking-wider border print:border-black">CA1<br/>(10)</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 print:text-black uppercase tracking-wider border print:border-black">CA2<br/>(10)</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 print:text-black uppercase tracking-wider border print:border-black">Exam<br/>(80)</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 print:text-black uppercase tracking-wider border print:border-black">Total<br/>(100)</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 print:text-black uppercase tracking-wider border print:border-black">Grade</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 print:text-black uppercase tracking-wider border print:border-black">Position</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 print:text-black uppercase tracking-wider border print:border-black">Remark</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 print:divide-black">
                    {reportCard.results.map((result) => (
                      <tr key={result.subjectId} className="print:border print:border-black">
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 print:text-black border print:border-black">
                          {result.subjectName}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-center text-gray-900 print:text-black border print:border-black">
                          {result.assessment1}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-center text-gray-900 print:text-black border print:border-black">
                          {result.assessment2}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-center text-gray-900 print:text-black border print:border-black">
                          {result.exam}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-center font-bold text-gray-900 print:text-black border print:border-black">
                          {result.total}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-center border print:border-black">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded print:bg-transparent print:text-black ${getGradeColor(result.grade)}`}>
                            {result.grade}
                          </span>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-center text-gray-900 print:text-black border print:border-black">
                          {result.position}{getPositionSuffix(result.position)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 print:text-black border print:border-black">
                          {result.remark}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 print:bg-gray-100 p-4 rounded print:border print:border-black">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 print:text-black">{reportCard.totalScore}</div>
                    <div className="text-sm text-gray-600 print:text-black">Total Score</div>
                  </div>
                </div>
                <div className="bg-gray-50 print:bg-gray-100 p-4 rounded print:border print:border-black">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600 print:text-black">{reportCard.averageScore.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600 print:text-black">Average Score</div>
                  </div>
                </div>
                <div className="bg-gray-50 print:bg-gray-100 p-4 rounded print:border print:border-black">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600 print:text-black">{reportCard.overallPosition}{getPositionSuffix(reportCard.overallPosition)}</div>
                    <div className="text-sm text-gray-600 print:text-black">Class Position</div>
                  </div>
                </div>
                <div className="bg-gray-50 print:bg-gray-100 p-4 rounded print:border print:border-black">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 print:text-black">{reportCard.overallGrade}</div>
                    <div className="text-sm text-gray-600 print:text-black">Overall Grade</div>
                  </div>
                </div>
              </div>

              {/* Attendance Summary */}
              <div className="bg-blue-50 print:bg-gray-100 p-4 rounded print:border print:border-black mb-6">
                <h4 className="font-bold text-gray-900 print:text-black mb-2">ATTENDANCE SUMMARY</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong>Times Present:</strong> {reportCard.timesPresent}
                  </div>
                  <div>
                    <strong>Times Absent:</strong> {reportCard.timesAbsent}
                  </div>
                  <div>
                    <strong>Attendance Rate:</strong> {((reportCard.timesPresent / (reportCard.timesPresent + reportCard.timesAbsent)) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Comments */}
              <div className="space-y-4">
                <div className="border print:border-black p-4 rounded print:rounded-none">
                  <h4 className="font-bold text-gray-900 print:text-black mb-2">CLASS TEACHER'S COMMENT</h4>
                  <p className="text-sm text-gray-700 print:text-black">{reportCard.teacherComment}</p>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <div className="border-t border-gray-300 print:border-black pt-2 mt-8 w-48">
                        <p className="text-xs text-gray-500 print:text-black">Class Teacher's Signature</p>
                      </div>
                    </div>
                    <div>
                      <div className="border-t border-gray-300 print:border-black pt-2 mt-8 w-32">
                        <p className="text-xs text-gray-500 print:text-black">Date</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border print:border-black p-4 rounded print:rounded-none">
                  <h4 className="font-bold text-gray-900 print:text-black mb-2">PRINCIPAL'S COMMENT</h4>
                  <p className="text-sm text-gray-700 print:text-black">{reportCard.principalComment}</p>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <div className="border-t border-gray-300 print:border-black pt-2 mt-8 w-48">
                        <p className="text-xs text-gray-500 print:text-black">Principal's Signature</p>
                      </div>
                    </div>
                    <div>
                      <div className="border-t border-gray-300 print:border-black pt-2 mt-8 w-32">
                        <p className="text-xs text-gray-500 print:text-black">Date</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grading Scale */}
              <div className="mt-6 p-4 bg-gray-50 print:bg-gray-100 rounded print:border print:border-black">
                <h4 className="font-bold text-gray-900 print:text-black mb-2 text-center">GRADING SCALE</h4>
                <div className="grid grid-cols-9 gap-2 text-xs text-center">
                  <div><strong>A1:</strong> 90-100</div>
                  <div><strong>B2:</strong> 80-89</div>
                  <div><strong>B3:</strong> 70-79</div>
                  <div><strong>C4:</strong> 60-69</div>
                  <div><strong>C5:</strong> 50-59</div>
                  <div><strong>C6:</strong> 45-49</div>
                  <div><strong>D7:</strong> 40-44</div>
                  <div><strong>E8:</strong> 30-39</div>
                  <div><strong>F9:</strong> 0-29</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 shadow-sm text-center">
            <span className="text-6xl mb-4 block">📋</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select Student</h3>
            <p className="text-gray-500">
              Choose a student from the dropdown above to generate their report card.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
