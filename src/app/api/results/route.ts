import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Grade, Student, Subject } from '@/lib/models';

// Mock results data
const mockResults = [
  {
    id: '1',
    studentId: '1',
    studentName: 'Adebayo Oluwaseun',
    class: 'JSS 1A',
    subjectId: 'SUB001',
    subjectName: 'Mathematics',
    term: '1st Term',
    session: '2024/2025',
    assessment1: 8,
    assessment2: 9,
    exam: 75,
    total: 92,
    grade: 'A1',
    position: 1,
    remark: 'Excellent'
  },
  {
    id: '2',
    studentId: '1',
    studentName: 'Adebayo Oluwaseun',
    class: 'JSS 1A',
    subjectId: 'SUB002',
    subjectName: 'English Language',
    term: '1st Term',
    session: '2024/2025',
    assessment1: 7,
    assessment2: 8,
    exam: 68,
    total: 83,
    grade: 'B2',
    position: 2,
    remark: 'Very Good'
  },
  {
    id: '3',
    studentId: '2',
    studentName: 'Chioma Okwu',
    class: 'JSS 1A',
    subjectId: 'SUB001',
    subjectName: 'Mathematics',
    term: '1st Term',
    session: '2024/2025',
    assessment1: 9,
    assessment2: 8,
    exam: 72,
    total: 89,
    grade: 'B2',
    position: 2,
    remark: 'Very Good'
  },
  {
    id: '4',
    studentId: '3',
    studentName: 'Ibrahim Mohammed',
    class: 'JSS 1B',
    subjectId: 'SUB001',
    subjectName: 'Mathematics',
    term: '1st Term',
    session: '2024/2025',
    assessment1: 6,
    assessment2: 7,
    exam: 45,
    total: 58,
    grade: 'C5',
    position: 15,
    remark: 'Fair'
  }
];

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const class_param = searchParams.get('class');
    const subjectId = searchParams.get('subject');
    const term = searchParams.get('term');
    const session = searchParams.get('session') || '2024/2025';

    let query: any = {};

    // Build query based on parameters
    if (studentId) query.studentId = studentId;
    if (subjectId) query.subjectId = subjectId;
    if (class_param) query.classId = class_param;
    if (term) {
      // Convert "First Term" to "First" format expected by database
      const termMapping: { [key: string]: string } = {
        'First Term': 'First',
        'Second Term': 'Second',
        'Third Term': 'Third'
      };
      query.term = termMapping[term] || term;
    }
    if (session) query.academicYear = session;

    const grades = await Grade.find(query).sort({ studentId: 1, subjectId: 1 });

    // Transform database grades to match the frontend interface
    const results = await Promise.all(grades.map(async (grade) => {
      // Get student and subject names
      let studentName = 'Unknown Student';
      let subjectName = 'Unknown Subject';
      
      try {
        const student = await Student.findOne({ _id: grade.studentId });
        if (student) {
          studentName = `${student.firstName} ${student.lastName}`;
        }
        
        const subject = await Subject.findOne({ _id: grade.subjectId });
        if (subject) {
          subjectName = subject.name;
        }
      } catch (err) {
        console.warn('Error fetching student/subject names:', err);
      }

      // Calculate total from different assessment types for this student/subject/term
      const allGrades = await Grade.find({
        studentId: grade.studentId,
        subjectId: grade.subjectId,
        term: grade.term,
        academicYear: grade.academicYear
      });

      let continuousAssessment = 0;
      let examination = 0;

      allGrades.forEach(g => {
        if (g.assessmentType === 'CA1' || g.assessmentType === 'CA2' || g.assessmentType === 'Assignment') {
          continuousAssessment += g.score;
        } else if (g.assessmentType === 'Exam') {
          examination = g.score;
        }
      });

      const total = continuousAssessment + examination;
      const finalGrade = calculateGrade(total);
      const remark = getRemarkFromGrade(finalGrade);

      return {
        studentId: grade.studentId,
        subjectId: grade.subjectId,
        continuousAssessment,
        examination,
        total,
        grade: finalGrade,
        remark,
        term: grade.term,
        class: grade.classId,
        studentName,
        subjectName
      };
    }));

    // Remove duplicates (since we might have multiple grade entries per student/subject)
    const uniqueResults = results.reduce((acc, current) => {
      const existing = acc.find(item => 
        item.studentId === current.studentId && 
        item.subjectId === current.subjectId &&
        item.term === current.term
      );
      
      if (!existing) {
        acc.push(current);
      }
      return acc;
    }, [] as any[]);

    // If no results found in database, return mock data for demonstration
    if (uniqueResults.length === 0) {
      let filteredResults = [...mockResults];

      if (studentId) {
        filteredResults = filteredResults.filter(result => result.studentId === studentId);
      }

      if (class_param) {
        filteredResults = filteredResults.filter(result => result.class === class_param);
      }

      if (subjectId) {
        filteredResults = filteredResults.filter(result => result.subjectId === subjectId);
      }

      if (term) {
        filteredResults = filteredResults.filter(result => result.term === term);
      }

      if (session) {
        filteredResults = filteredResults.filter(result => result.session === session);
      }

      return NextResponse.json({
        success: true,
        results: filteredResults,
        count: filteredResults.length,
        message: 'Results fetched successfully (using mock data)'
      });
    }

    return NextResponse.json({
      success: true,
      results: uniqueResults,
      count: uniqueResults.length,
      message: 'Results fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch results' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { 
      studentId, 
      subjectId, 
      class: className,
      term, 
      session = '2024/2025',
      continuousAssessment,
      examination
    } = body;

    // Validate required fields
    if (!studentId || !subjectId || !className || !term) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Convert term format
    const termMapping: { [key: string]: string } = {
      'First Term': 'First',
      'Second Term': 'Second', 
      'Third Term': 'Third'
    };
    const dbTerm = termMapping[term] || term;

    try {
      // Delete existing grades for this student/subject/term/session
      await Grade.deleteMany({
        studentId,
        subjectId,
        term: dbTerm,
        academicYear: session
      });

      const gradesToSave = [];

      // Save Continuous Assessment grades
      if (continuousAssessment && continuousAssessment > 0) {
        gradesToSave.push({
          studentId,
          subjectId,
          classId: className,
          term: dbTerm,
          academicYear: session,
          assessmentType: 'CA1',
          score: continuousAssessment,
          totalMarks: 40,
          grade: calculateGrade(continuousAssessment),
          teacherId: 'TEACHER_ID', // TODO: Get from session
          remarks: 'Continuous Assessment'
        });
      }

      // Save Examination grades
      if (examination && examination > 0) {
        gradesToSave.push({
          studentId,
          subjectId,
          classId: className,
          term: dbTerm,
          academicYear: session,
          assessmentType: 'Exam',
          score: examination,
          totalMarks: 60,
          grade: calculateGrade(examination),
          teacherId: 'TEACHER_ID', // TODO: Get from session
          remarks: 'Examination'
        });
      }

      // Save to database
      if (gradesToSave.length > 0) {
        await Grade.insertMany(gradesToSave);
      }

      // Calculate final result
      const total = (continuousAssessment || 0) + (examination || 0);
      const finalGrade = calculateGrade(total);
      const remark = getRemarkFromGrade(finalGrade);

      const result = {
        studentId,
        subjectId,
        continuousAssessment: continuousAssessment || 0,
        examination: examination || 0,
        total,
        grade: finalGrade,
        remark,
        term,
        class: className
      };

      return NextResponse.json({
        success: true,
        data: result,
        message: 'Result saved successfully'
      });

    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // Fallback to mock data if database fails
      const total = (continuousAssessment || 0) + (examination || 0);
      const grade = calculateGrade(total);
      const remark = getRemarkFromGrade(grade);

      // Check if result already exists in mock data
      const existingResultIndex = mockResults.findIndex(
        result => 
          result.studentId === studentId && 
          result.subjectId === subjectId && 
          result.term === term && 
          result.session === session
      );

      if (existingResultIndex !== -1) {
        // Update existing result
        mockResults[existingResultIndex] = {
          ...mockResults[existingResultIndex],
          assessment1: continuousAssessment || 0,
          assessment2: 0,
          exam: examination || 0,
          total,
          grade,
          remark
        };

        return NextResponse.json({
          success: true,
          data: mockResults[existingResultIndex],
          message: 'Result updated successfully (using mock data)'
        });
      } else {
        // Create new result in mock data
        const newResult = {
          id: String(mockResults.length + 1),
          studentId,
          studentName: 'Student Name',
          class: className,
          subjectId,
          subjectName: 'Subject Name',
          term,
          session,
          assessment1: continuousAssessment || 0,
          assessment2: 0,
          exam: examination || 0,
          total,
          grade,
          position: 0,
          remark
        };

        mockResults.push(newResult);

        return NextResponse.json({
          success: true,
          data: newResult,
          message: 'Result created successfully (using mock data)'
        });
      }
    }
  } catch (error) {
    console.error('Error saving result:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save result' },
      { status: 500 }
    );
  }
}

function calculateGrade(total: number): string {
  if (total >= 90) return 'A1';
  if (total >= 80) return 'B2';
  if (total >= 70) return 'B3';
  if (total >= 60) return 'C4';
  if (total >= 50) return 'C5';
  if (total >= 45) return 'C6';
  if (total >= 40) return 'D7';
  if (total >= 30) return 'E8';
  return 'F9';
}

function getRemarkFromGrade(grade: string): string {
  switch (grade) {
    case 'A1': return 'Excellent';
    case 'B2': return 'Very Good';
    case 'B3': return 'Good';
    case 'C4': return 'Credit';
    case 'C5': return 'Credit';
    case 'C6': return 'Credit';
    case 'D7': return 'Pass';
    case 'E8': return 'Pass';
    case 'F9': return 'Fail';
    default: return 'N/A';
  }
}
