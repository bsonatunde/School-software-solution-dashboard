import { NextRequest, NextResponse } from 'next/server';

const mockFees = [
  {
    id: '1',
    studentId: '1',
    studentName: 'Chioma Okoro',
    class: 'JSS 1A',
    term: 'First Term',
    session: '2024/2025',
    tuitionFee: 75000,
    developmentLevy: 10000,
    uniformFee: 8000,
    booksAndMaterials: 5000,
    examFee: 3000,
    totalAmount: 101000,
    amountPaid: 101000,
    balance: 0,
    paymentStatus: 'Paid',
    paymentDate: '2024-09-15',
    paymentMethod: 'Bank Transfer',
    receiptNumber: 'PSS/FEE/001/2024',
    dueDate: '2024-09-30'
  },
  {
    id: '2',
    studentId: '2',
    studentName: 'Kemi Adebayo',
    class: 'JSS 2A',
    term: 'First Term',
    session: '2024/2025',
    tuitionFee: 75000,
    developmentLevy: 10000,
    uniformFee: 0,
    booksAndMaterials: 5000,
    examFee: 3000,
    totalAmount: 93000,
    amountPaid: 50000,
    balance: 43000,
    paymentStatus: 'Partial',
    paymentDate: '2024-09-10',
    paymentMethod: 'Cash',
    receiptNumber: 'PSS/FEE/002/2024',
    dueDate: '2024-09-30'
  },
  {
    id: '3',
    studentId: '3',
    studentName: 'Ibrahim Hassan',
    class: 'SS 1A',
    term: 'First Term',
    session: '2024/2025',
    tuitionFee: 85000,
    developmentLevy: 12000,
    uniformFee: 0,
    booksAndMaterials: 8000,
    examFee: 5000,
    totalAmount: 110000,
    amountPaid: 0,
    balance: 110000,
    paymentStatus: 'Pending',
    paymentDate: null,
    paymentMethod: null,
    receiptNumber: null,
    dueDate: '2024-09-30'
  }
];

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const studentId = url.searchParams.get('studentId');
    
    let fees = mockFees;
    
    if (studentId) {
      fees = mockFees.filter(fee => fee.studentId === studentId);
    }
    
    return NextResponse.json({
      success: true,
      data: fees,
      message: 'Fees fetched successfully'
    });
  } catch (error) {
    console.error('Get fees error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch fees'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { feeId, amountPaid, paymentMethod } = body;
    
    // Find the fee record
    const fee = mockFees.find(f => f.id === feeId);
    if (!fee) {
      return NextResponse.json({
        success: false,
        error: 'Fee record not found'
      }, { status: 404 });
    }
    
    // Update payment
    fee.amountPaid += amountPaid;
    fee.balance = fee.totalAmount - fee.amountPaid;
    fee.paymentMethod = paymentMethod;
    fee.paymentDate = new Date().toISOString().split('T')[0];
    
    if (fee.balance <= 0) {
      fee.paymentStatus = 'Paid';
    } else if (fee.amountPaid > 0) {
      fee.paymentStatus = 'Partial';
    }
    
    // Generate receipt number if first payment
    if (!fee.receiptNumber) {
      fee.receiptNumber = `PSS/FEE/${fee.id.padStart(3, '0')}/2024`;
    }
    
    return NextResponse.json({
      success: true,
      data: fee,
      message: 'Payment recorded successfully'
    });
  } catch (error) {
    console.error('Record payment error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to record payment'
    }, { status: 500 });
  }
}
