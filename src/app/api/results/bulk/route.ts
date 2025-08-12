import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { class: className, term, session, results } = body;

    // Validate required fields
    if (!className || !term || !session || !results || !Array.isArray(results)) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields or invalid data format' },
        { status: 400 }
      );
    }

    // Process and save results
    const savedResults: any[] = [];
    const errors: string[] = [];

    for (const result of results) {
      try {
        // Validate individual result
        if (!result.studentId || !result.subjectId) {
          errors.push(`Missing studentId or subjectId for result`);
          continue;
        }

        // Calculate total and grade
        const total = (result.assessment1 || 0) + (result.assessment2 || 0) + (result.exam || 0);
        const grade = calculateGrade(total);
        const remark = getRemarkFromGrade(grade);

        const processedResult = {
          id: `bulk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          studentId: result.studentId,
          studentName: `Student ${result.studentId}`, // In real app, fetch from students API
          class: className,
          subjectId: result.subjectId,
          subjectName: `Subject ${result.subjectId}`, // In real app, fetch from subjects API
          term,
          session,
          assessment1: result.assessment1 || 0,
          assessment2: result.assessment2 || 0,
          exam: result.exam || 0,
          total,
          grade,
          position: 0, // Will be calculated after all results are saved
          remark,
          dateCreated: new Date().toISOString(),
          dateModified: new Date().toISOString()
        };

        savedResults.push(processedResult);
      } catch (error) {
        errors.push(`Error processing result for student ${result.studentId}: ${error}`);
      }
    }

    // Calculate positions for each subject
    const subjectGroups: { [key: string]: any[] } = savedResults.reduce((acc: { [key: string]: any[] }, result) => {
      if (!acc[result.subjectId]) acc[result.subjectId] = [];
      acc[result.subjectId].push(result);
      return acc;
    }, {});

    // Assign positions within each subject
    Object.values(subjectGroups).forEach((subjectResults) => {
      subjectResults.sort((a, b) => b.total - a.total);
      subjectResults.forEach((result, index) => {
        result.position = index + 1;
      });
    });

    // In a real application, you would:
    // 1. Validate that all students and subjects exist
    // 2. Check for existing results and update or create accordingly
    // 3. Save to database in a transaction
    // 4. Calculate class statistics
    // 5. Generate notifications for poor performance

    console.log(`Saving bulk results for ${className} - ${term} ${session}:`, savedResults);

    // Calculate summary statistics
    const summary = {
      totalRecords: savedResults.length,
      averageScore: savedResults.length > 0 ? 
        Math.round(savedResults.reduce((sum, r) => sum + r.total, 0) / savedResults.length) : 0,
      gradeDistribution: savedResults.reduce((acc, r) => {
        acc[r.grade] = (acc[r.grade] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number }),
      highestScore: savedResults.length > 0 ? Math.max(...savedResults.map(r => r.total)) : 0,
      lowestScore: savedResults.length > 0 ? Math.min(...savedResults.map(r => r.total)) : 0,
      passRate: savedResults.length > 0 ? 
        Math.round((savedResults.filter(r => !['E8', 'F9'].includes(r.grade)).length / savedResults.length) * 100) : 0
    };

    return NextResponse.json({
      success: true,
      data: savedResults,
      errors: errors.length > 0 ? errors : undefined,
      summary,
      message: `Successfully processed ${savedResults.length} results${errors.length > 0 ? ` with ${errors.length} errors` : ''}`
    });
  } catch (error) {
    console.error('Error saving bulk results:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save results' },
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
