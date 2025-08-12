import { NextRequest, NextResponse } from 'next/server';

// Import mock data (in a real app, this would come from a database)
const mockFeeStructures = [
  // This would be imported from the actual fee structure data
  { id: 'FEE001', name: 'Tuition Fee', category: 'Tuition', amount: 45000, class: 'JSS 1A', term: '1st Term', session: '2024/2025', mandatory: true },
  { id: 'FEE002', name: 'Development Levy', category: 'Development', amount: 15000, class: 'JSS 1A', term: '1st Term', session: '2024/2025', mandatory: true },
  { id: 'FEE008', name: 'Tuition Fee', category: 'Tuition', amount: 65000, class: 'SS 1A', term: '1st Term', session: '2024/2025', mandatory: true },
  { id: 'FEE012', name: 'Transport Fee', category: 'Transport', amount: 25000, class: 'All Classes', term: '1st Term', session: '2024/2025', mandatory: false },
  { id: 'FEE013', name: 'Boarding Fee', category: 'Boarding', amount: 85000, class: 'All Classes', term: '1st Term', session: '2024/2025', mandatory: false }
];

const mockPayments = [
  // Sample payment data for analytics
  { studentId: 'STU001', feeId: 'FEE001', amount: 45000, amountPaid: 45000, status: 'Complete', paymentDate: '2024-09-25', class: 'JSS 1A' },
  { studentId: 'STU001', feeId: 'FEE002', amount: 15000, amountPaid: 10000, status: 'Partial', paymentDate: '2024-09-30', class: 'JSS 1A' },
  { studentId: 'STU002', feeId: 'FEE001', amount: 45000, amountPaid: 30000, status: 'Partial', paymentDate: '2024-10-05', class: 'JSS 2B' },
  { studentId: 'STU003', feeId: 'FEE008', amount: 65000, amountPaid: 65000, status: 'Complete', paymentDate: '2024-09-20', class: 'SS 1A' },
  { studentId: 'STU003', feeId: 'FEE012', amount: 25000, amountPaid: 25000, status: 'Complete', paymentDate: '2024-09-28', class: 'SS 1A' }
];

const mockStudents = [
  { id: 'STU001', name: 'Chinedu Okafor', class: 'JSS 1A' },
  { id: 'STU002', name: 'Fatima Abubakar', class: 'JSS 2B' },
  { id: 'STU003', name: 'Kemi Adeleke', class: 'SS 1A' },
  { id: 'STU004', name: 'Tunde Ogundimu', class: 'JSS 3A' },
  { id: 'STU005', name: 'Mary Okoro', class: 'SS 2A' }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type');
    const term = searchParams.get('term') || '1st Term';
    const session = searchParams.get('session') || '2024/2025';
    const classParam = searchParams.get('class');

    let filteredPayments = mockPayments;
    let filteredStructures = mockFeeStructures.filter(fee => 
      fee.term === term && fee.session === session
    );

    // Filter by class if specified
    if (classParam && classParam !== 'All Classes') {
      filteredPayments = filteredPayments.filter(payment => payment.class === classParam);
      filteredStructures = filteredStructures.filter(structure => 
        structure.class === classParam || structure.class === 'All Classes'
      );
    }

    switch (reportType) {
      case 'overview':
        return NextResponse.json({
          success: true,
          data: generateOverviewReport(filteredPayments, filteredStructures),
          message: 'Overview report generated successfully'
        });

      case 'collection':
        return NextResponse.json({
          success: true,
          data: generateCollectionReport(filteredPayments, filteredStructures),
          message: 'Collection report generated successfully'
        });

      case 'outstanding':
        return NextResponse.json({
          success: true,
          data: generateOutstandingReport(filteredPayments, filteredStructures),
          message: 'Outstanding report generated successfully'
        });

      case 'class-analysis':
        return NextResponse.json({
          success: true,
          data: generateClassAnalysisReport(filteredPayments, filteredStructures),
          message: 'Class analysis report generated successfully'
        });

      case 'payment-trends':
        return NextResponse.json({
          success: true,
          data: generatePaymentTrendsReport(filteredPayments),
          message: 'Payment trends report generated successfully'
        });

      case 'defaulters':
        return NextResponse.json({
          success: true,
          data: generateDefaultersReport(filteredPayments, filteredStructures),
          message: 'Defaulters report generated successfully'
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid report type. Available types: overview, collection, outstanding, class-analysis, payment-trends, defaulters' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error generating fee report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate fee report' },
      { status: 500 }
    );
  }
}

function generateOverviewReport(payments: any[], structures: any[]) {
  const totalExpected = structures.reduce((sum, fee) => sum + fee.amount, 0);
  const totalCollected = payments.reduce((sum, payment) => sum + payment.amountPaid, 0);
  const totalOutstanding = totalExpected - totalCollected;
  
  const collectionRate = totalExpected > 0 ? (totalCollected / totalExpected) * 100 : 0;
  
  const completePayments = payments.filter(p => p.status === 'Complete').length;
  const partialPayments = payments.filter(p => p.status === 'Partial').length;
  const totalPayments = payments.length;

  // Fee category breakdown
  const categoryBreakdown = structures.reduce((acc: any, fee) => {
    if (!acc[fee.category]) {
      acc[fee.category] = { expected: 0, collected: 0, outstanding: 0 };
    }
    acc[fee.category].expected += fee.amount;
    
    const categoryPayments = payments.filter(p => p.feeId === fee.id);
    const categoryCollected = categoryPayments.reduce((sum, p) => sum + p.amountPaid, 0);
    acc[fee.category].collected += categoryCollected;
    acc[fee.category].outstanding = acc[fee.category].expected - acc[fee.category].collected;
    
    return acc;
  }, {});

  return {
    summary: {
      totalExpected,
      totalCollected,
      totalOutstanding,
      collectionRate: parseFloat(collectionRate.toFixed(2)),
      totalStudents: mockStudents.length,
      completePayments,
      partialPayments,
      pendingPayments: totalPayments - completePayments - partialPayments
    },
    categoryBreakdown,
    recentPayments: payments
      .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
      .slice(0, 5)
  };
}

function generateCollectionReport(payments: any[], structures: any[]) {
  // Daily collection data
  const dailyCollections = payments.reduce((acc: any, payment) => {
    const date = payment.paymentDate;
    if (!acc[date]) {
      acc[date] = { date, amount: 0, count: 0 };
    }
    acc[date].amount += payment.amountPaid;
    acc[date].count += 1;
    return acc;
  }, {});

  const dailyData = Object.values(dailyCollections).sort((a: any, b: any) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Monthly collection data
  const monthlyCollections = payments.reduce((acc: any, payment) => {
    const month = payment.paymentDate.substring(0, 7); // YYYY-MM
    if (!acc[month]) {
      acc[month] = { month, amount: 0, count: 0 };
    }
    acc[month].amount += payment.amountPaid;
    acc[month].count += 1;
    return acc;
  }, {});

  const monthlyData = Object.values(monthlyCollections).sort((a: any, b: any) => 
    a.month.localeCompare(b.month)
  );

  // Payment method breakdown
  const paymentMethods = payments.reduce((acc: any, payment) => {
    const method = payment.paymentMethod || 'Unknown';
    if (!acc[method]) {
      acc[method] = { method, amount: 0, count: 0 };
    }
    acc[method].amount += payment.amountPaid;
    acc[method].count += 1;
    return acc;
  }, {});

  return {
    dailyCollections: dailyData,
    monthlyCollections: monthlyData,
    paymentMethods: Object.values(paymentMethods),
    totalCollected: payments.reduce((sum, p) => sum + p.amountPaid, 0),
    averagePayment: payments.length > 0 ? 
      payments.reduce((sum, p) => sum + p.amountPaid, 0) / payments.length : 0
  };
}

function generateOutstandingReport(payments: any[], structures: any[]) {
  const outstandingByStudent = mockStudents.map(student => {
    const studentPayments = payments.filter(p => p.studentId === student.id);
    const applicableFees = structures.filter(fee => 
      fee.class === student.class || fee.class === 'All Classes'
    );
    
    const totalExpected = applicableFees.reduce((sum, fee) => sum + fee.amount, 0);
    const totalPaid = studentPayments.reduce((sum, payment) => sum + payment.amountPaid, 0);
    const outstanding = totalExpected - totalPaid;
    
    const outstandingFees = applicableFees.filter(fee => {
      const feePayments = studentPayments.filter(p => p.feeId === fee.id);
      const feePaid = feePayments.reduce((sum, p) => sum + p.amountPaid, 0);
      return feePaid < fee.amount;
    }).map(fee => {
      const feePayments = studentPayments.filter(p => p.feeId === fee.id);
      const feePaid = feePayments.reduce((sum, p) => sum + p.amountPaid, 0);
      return {
        ...fee,
        amountPaid: feePaid,
        outstanding: fee.amount - feePaid
      };
    });

    return {
      student,
      totalExpected,
      totalPaid,
      outstanding,
      outstandingFees,
      paymentStatus: outstanding === 0 ? 'Complete' : 
                    totalPaid > 0 ? 'Partial' : 'Not Started'
    };
  }).filter(item => item.outstanding > 0);

  // Sort by outstanding amount (highest first)
  outstandingByStudent.sort((a, b) => b.outstanding - a.outstanding);

  const totalOutstanding = outstandingByStudent.reduce((sum, item) => sum + item.outstanding, 0);
  const studentsWithOutstanding = outstandingByStudent.length;

  return {
    summary: {
      totalOutstanding,
      studentsWithOutstanding,
      averageOutstanding: studentsWithOutstanding > 0 ? totalOutstanding / studentsWithOutstanding : 0
    },
    outstandingByStudent: outstandingByStudent.slice(0, 20), // Top 20 defaulters
    outstandingByFee: structures.map(fee => {
      const feePayments = payments.filter(p => p.feeId === fee.id);
      const totalPaid = feePayments.reduce((sum, p) => sum + p.amountPaid, 0);
      const studentsOwing = mockStudents.filter(student => 
        fee.class === student.class || fee.class === 'All Classes'
      ).length;
      const expectedTotal = studentsOwing * fee.amount;
      
      return {
        ...fee,
        expectedTotal,
        totalPaid,
        outstanding: expectedTotal - totalPaid,
        studentsOwing: studentsOwing - feePayments.filter(p => p.amountPaid >= fee.amount).length
      };
    }).filter(item => item.outstanding > 0)
  };
}

function generateClassAnalysisReport(payments: any[], structures: any[]) {
  const classes = ['JSS 1A', 'JSS 2B', 'JSS 3A', 'SS 1A', 'SS 2A'];
  
  const classAnalysis = classes.map(className => {
    const classStudents = mockStudents.filter(s => s.class === className);
    const classPayments = payments.filter(p => p.class === className);
    const applicableFees = structures.filter(fee => 
      fee.class === className || fee.class === 'All Classes'
    );
    
    const totalExpected = applicableFees.reduce((sum, fee) => sum + fee.amount, 0) * classStudents.length;
    const totalCollected = classPayments.reduce((sum, p) => sum + p.amountPaid, 0);
    const collectionRate = totalExpected > 0 ? (totalCollected / totalExpected) * 100 : 0;
    
    const completePayments = classPayments.filter(p => p.status === 'Complete').length;
    const partialPayments = classPayments.filter(p => p.status === 'Partial').length;
    
    return {
      class: className,
      totalStudents: classStudents.length,
      totalExpected,
      totalCollected,
      totalOutstanding: totalExpected - totalCollected,
      collectionRate: parseFloat(collectionRate.toFixed(2)),
      completePayments,
      partialPayments,
      pendingPayments: classStudents.length - completePayments - partialPayments
    };
  });

  return {
    classAnalysis: classAnalysis.sort((a, b) => b.collectionRate - a.collectionRate),
    bestPerformingClass: classAnalysis.reduce((best, current) => 
      current.collectionRate > best.collectionRate ? current : best
    ),
    worstPerformingClass: classAnalysis.reduce((worst, current) => 
      current.collectionRate < worst.collectionRate ? current : worst
    )
  };
}

function generatePaymentTrendsReport(payments: any[]) {
  // Weekly payment trends
  const weeklyTrends = payments.reduce((acc: any, payment) => {
    const date = new Date(payment.paymentDate);
    const week = getWeekNumber(date);
    const weekKey = `${date.getFullYear()}-W${week}`;
    
    if (!acc[weekKey]) {
      acc[weekKey] = { week: weekKey, amount: 0, count: 0 };
    }
    acc[weekKey].amount += payment.amountPaid;
    acc[weekKey].count += 1;
    return acc;
  }, {});

  // Peak payment days
  const dailyPayments = payments.reduce((acc: any, payment) => {
    const day = new Date(payment.paymentDate).toLocaleDateString('en-US', { weekday: 'long' });
    if (!acc[day]) {
      acc[day] = { day, amount: 0, count: 0 };
    }
    acc[day].amount += payment.amountPaid;
    acc[day].count += 1;
    return acc;
  }, {});

  return {
    weeklyTrends: Object.values(weeklyTrends).sort((a: any, b: any) => 
      a.week.localeCompare(b.week)
    ),
    dailyTrends: Object.values(dailyPayments),
    paymentVelocity: calculatePaymentVelocity(payments),
    peakPaymentPeriods: identifyPeakPeriods(payments)
  };
}

function generateDefaultersReport(payments: any[], structures: any[]) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const defaulters = mockStudents.map(student => {
    const studentPayments = payments.filter(p => p.studentId === student.id);
    const applicableFees = structures.filter(fee => 
      fee.class === student.class || fee.class === 'All Classes'
    );
    
    const overdueFees = applicableFees.filter(fee => {
      const dueDate = new Date(fee.dueDate || '2024-09-30');
      const feePayments = studentPayments.filter(p => p.feeId === fee.id);
      const feePaid = feePayments.reduce((sum, p) => sum + p.amountPaid, 0);
      
      return dueDate < new Date() && feePaid < fee.amount;
    });

    if (overdueFees.length === 0) return null;

    const totalOverdue = overdueFees.reduce((sum, fee) => {
      const feePayments = studentPayments.filter(p => p.feeId === fee.id);
      const feePaid = feePayments.reduce((sum, p) => sum + p.amountPaid, 0);
      return sum + (fee.amount - feePaid);
    }, 0);

    const lastPaymentDate = studentPayments.length > 0 ? 
      Math.max(...studentPayments.map(p => new Date(p.paymentDate).getTime())) : null;

    return {
      student,
      overdueFees,
      totalOverdue,
      daysSinceLastPayment: lastPaymentDate ? 
        Math.floor((Date.now() - lastPaymentDate) / (1000 * 60 * 60 * 24)) : null,
      riskLevel: calculateRiskLevel(totalOverdue, lastPaymentDate)
    };
  }).filter(item => item !== null);

  // Sort by risk level and amount
  defaulters.sort((a: any, b: any) => {
    const riskOrder: { [key: string]: number } = { 'Critical': 3, 'High': 2, 'Medium': 1, 'Low': 0 };
    const aRisk = riskOrder[a.riskLevel] || 0;
    const bRisk = riskOrder[b.riskLevel] || 0;
    if (aRisk !== bRisk) {
      return bRisk - aRisk;
    }
    return b.totalOverdue - a.totalOverdue;
  });

  return {
    summary: {
      totalDefaulters: defaulters.length,
      totalOverdueAmount: defaulters.reduce((sum: number, d: any) => sum + d.totalOverdue, 0),
      criticalCases: defaulters.filter((d: any) => d.riskLevel === 'Critical').length,
      highRiskCases: defaulters.filter((d: any) => d.riskLevel === 'High').length
    },
    defaulters: defaulters.slice(0, 50), // Top 50 defaulters
    riskDistribution: {
      Critical: defaulters.filter((d: any) => d.riskLevel === 'Critical').length,
      High: defaulters.filter((d: any) => d.riskLevel === 'High').length,
      Medium: defaulters.filter((d: any) => d.riskLevel === 'Medium').length,
      Low: defaulters.filter((d: any) => d.riskLevel === 'Low').length
    }
  };
}

// Helper functions
function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

function calculatePaymentVelocity(payments: any[]) {
  if (payments.length < 2) return 0;
  
  const sortedPayments = payments.sort((a, b) => 
    new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime()
  );
  
  const firstPayment = new Date(sortedPayments[0].paymentDate);
  const lastPayment = new Date(sortedPayments[sortedPayments.length - 1].paymentDate);
  const daysDiff = (lastPayment.getTime() - firstPayment.getTime()) / (1000 * 60 * 60 * 24);
  
  return daysDiff > 0 ? payments.length / daysDiff : 0;
}

function identifyPeakPeriods(payments: any[]) {
  const dailyCounts = payments.reduce((acc: any, payment) => {
    const date = payment.paymentDate;
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  
  const sortedDays = Object.entries(dailyCounts)
    .sort(([,a]: any, [,b]: any) => b - a)
    .slice(0, 5);
    
  return sortedDays.map(([date, count]) => ({ date, count }));
}

function calculateRiskLevel(overdueAmount: number, lastPaymentDate: number | null): string {
  const daysSinceLastPayment = lastPaymentDate ? 
    Math.floor((Date.now() - lastPaymentDate) / (1000 * 60 * 60 * 24)) : 365;
  
  if (overdueAmount > 50000 || daysSinceLastPayment > 90) return 'Critical';
  if (overdueAmount > 30000 || daysSinceLastPayment > 60) return 'High';
  if (overdueAmount > 15000 || daysSinceLastPayment > 30) return 'Medium';
  return 'Low';
}
