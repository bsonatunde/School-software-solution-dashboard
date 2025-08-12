import { NextRequest, NextResponse } from 'next/server';

// Mock student payment data for Nigerian schools
const mockPayments = [
  // Chinedu Okafor payments
  {
    id: 'PAY001',
    studentId: 'STU001',
    studentName: 'Chinedu Okafor',
    class: 'JSS 1A',
    feeId: 'FEE001',
    feeName: 'Tuition Fee',
    feeCategory: 'Tuition',
    amount: 45000,
    amountPaid: 45000,
    paymentDate: '2024-09-25',
    paymentMethod: 'Bank Transfer',
    receiptNumber: 'RCP001',
    term: '1st Term',
    session: '2024/2025',
    status: 'Complete',
    paidBy: 'Mr. Emeka Okafor',
    relationship: 'Father',
    phoneNumber: '08123456789',
    reference: 'BANK/TXN/789123456'
  },
  {
    id: 'PAY002',
    studentId: 'STU001',
    studentName: 'Chinedu Okafor',
    class: 'JSS 1A',
    feeId: 'FEE002',
    feeName: 'Development Levy',
    feeCategory: 'Development',
    amount: 15000,
    amountPaid: 10000,
    paymentDate: '2024-09-30',
    paymentMethod: 'Cash',
    receiptNumber: 'RCP002',
    term: '1st Term',
    session: '2024/2025',
    status: 'Partial',
    paidBy: 'Mrs. Adanna Okafor',
    relationship: 'Mother',
    phoneNumber: '08134567890',
    reference: 'CASH/001'
  },
  
  // Fatima Abubakar payments
  {
    id: 'PAY003',
    studentId: 'STU002',
    studentName: 'Fatima Abubakar',
    class: 'JSS 2B',
    feeId: 'FEE001',
    feeName: 'Tuition Fee',
    feeCategory: 'Tuition',
    amount: 45000,
    amountPaid: 30000,
    paymentDate: '2024-10-05',
    paymentMethod: 'Online Payment',
    receiptNumber: 'RCP003',
    term: '1st Term',
    session: '2024/2025',
    status: 'Partial',
    paidBy: 'Alhaji Musa Abubakar',
    relationship: 'Father',
    phoneNumber: '08145678901',
    reference: 'PAYSTACK/TXN/456789123'
  },
  
  // Kemi Adeleke payments (multiple payments)
  {
    id: 'PAY004',
    studentId: 'STU003',
    studentName: 'Kemi Adeleke',
    class: 'SS 1A',
    feeId: 'FEE008', // SS Tuition Fee
    feeName: 'Tuition Fee',
    feeCategory: 'Tuition',
    amount: 65000,
    amountPaid: 65000,
    paymentDate: '2024-09-20',
    paymentMethod: 'Bank Transfer',
    receiptNumber: 'RCP004',
    term: '1st Term',
    session: '2024/2025',
    status: 'Complete',
    paidBy: 'Dr. Bola Adeleke',
    relationship: 'Mother',
    phoneNumber: '08156789012',
    reference: 'BANK/TXN/123456789'
  },
  {
    id: 'PAY005',
    studentId: 'STU003',
    studentName: 'Kemi Adeleke',
    class: 'SS 1A',
    feeId: 'FEE009', // Development Levy
    feeName: 'Development Levy',
    feeCategory: 'Development',
    amount: 20000,
    amountPaid: 20000,
    paymentDate: '2024-09-20',
    paymentMethod: 'Bank Transfer',
    receiptNumber: 'RCP005',
    term: '1st Term',
    session: '2024/2025',
    status: 'Complete',
    paidBy: 'Dr. Bola Adeleke',
    relationship: 'Mother',
    phoneNumber: '08156789012',
    reference: 'BANK/TXN/123456790'
  },
  {
    id: 'PAY006',
    studentId: 'STU003',
    studentName: 'Kemi Adeleke',
    class: 'SS 1A',
    feeId: 'FEE012', // Transport Fee
    feeName: 'Transport Fee',
    feeCategory: 'Transport',
    amount: 25000,
    amountPaid: 25000,
    paymentDate: '2024-09-28',
    paymentMethod: 'Online Payment',
    receiptNumber: 'RCP006',
    term: '1st Term',
    session: '2024/2025',
    status: 'Complete',
    paidBy: 'Dr. Bola Adeleke',
    relationship: 'Mother',
    phoneNumber: '08156789012',
    reference: 'FLUTTERWAVE/TXN/789123'
  },
  
  // Tunde Ogundimu partial payments
  {
    id: 'PAY007',
    studentId: 'STU004',
    studentName: 'Tunde Ogundimu',
    class: 'JSS 3A',
    feeId: 'FEE001',
    feeName: 'Tuition Fee',
    feeCategory: 'Tuition',
    amount: 45000,
    amountPaid: 20000,
    paymentDate: '2024-10-01',
    paymentMethod: 'Cash',
    receiptNumber: 'RCP007',
    term: '1st Term',
    session: '2024/2025',
    status: 'Partial',
    paidBy: 'Mrs. Folake Ogundimu',
    relationship: 'Mother',
    phoneNumber: '08167890123',
    reference: 'CASH/002'
  },
  
  // Mary Okoro full payments
  {
    id: 'PAY008',
    studentId: 'STU005',
    studentName: 'Mary Okoro',
    class: 'SS 2A',
    feeId: 'FEE008', // SS Tuition Fee
    feeName: 'Tuition Fee',
    feeCategory: 'Tuition',
    amount: 65000,
    amountPaid: 65000,
    paymentDate: '2024-09-15',
    paymentMethod: 'Bank Transfer',
    receiptNumber: 'RCP008',
    term: '1st Term',
    session: '2024/2025',
    status: 'Complete',
    paidBy: 'Mr. Peter Okoro',
    relationship: 'Father',
    phoneNumber: '08178901234',
    reference: 'BANK/TXN/234567890'
  },
  
  // Additional payments for boarding and special fees
  {
    id: 'PAY009',
    studentId: 'STU006',
    studentName: 'Ahmed Yusuf',
    class: 'SS 3A',
    feeId: 'FEE013', // Boarding Fee
    feeName: 'Boarding Fee',
    feeCategory: 'Boarding',
    amount: 85000,
    amountPaid: 42500,
    paymentDate: '2024-09-10',
    paymentMethod: 'Online Payment',
    receiptNumber: 'RCP009',
    term: '1st Term',
    session: '2024/2025',
    status: 'Partial',
    paidBy: 'Mallam Ibrahim Yusuf',
    relationship: 'Father',
    phoneNumber: '08189012345',
    reference: 'PAYSTACK/TXN/345678901'
  },
  {
    id: 'PAY010',
    studentId: 'STU006',
    studentName: 'Ahmed Yusuf',
    class: 'SS 3A',
    feeId: 'FEE010', // WAEC Registration
    feeName: 'WAEC Registration',
    feeCategory: 'Examination',
    amount: 18000,
    amountPaid: 18000,
    paymentDate: '2024-10-15',
    paymentMethod: 'Bank Transfer',
    receiptNumber: 'RCP010',
    term: '1st Term',
    session: '2024/2025',
    status: 'Complete',
    paidBy: 'Mallam Ibrahim Yusuf',
    relationship: 'Father',
    phoneNumber: '08189012345',
    reference: 'BANK/TXN/345678901'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const term = searchParams.get('term');
    const session = searchParams.get('session');
    const status = searchParams.get('status');
    const classParam = searchParams.get('class');
    const category = searchParams.get('category');
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');

    let filteredPayments = [...mockPayments];

    // Filter by student ID
    if (studentId) {
      filteredPayments = filteredPayments.filter(payment => payment.studentId === studentId);
    }

    // Filter by term
    if (term) {
      filteredPayments = filteredPayments.filter(payment => payment.term === term);
    }

    // Filter by session
    if (session) {
      filteredPayments = filteredPayments.filter(payment => payment.session === session);
    }

    // Filter by status
    if (status) {
      filteredPayments = filteredPayments.filter(payment => payment.status === status);
    }

    // Filter by class
    if (classParam) {
      filteredPayments = filteredPayments.filter(payment => payment.class === classParam);
    }

    // Filter by category
    if (category) {
      filteredPayments = filteredPayments.filter(payment => payment.feeCategory === category);
    }

    // Filter by date range
    if (fromDate) {
      filteredPayments = filteredPayments.filter(payment => 
        new Date(payment.paymentDate) >= new Date(fromDate)
      );
    }
    if (toDate) {
      filteredPayments = filteredPayments.filter(payment => 
        new Date(payment.paymentDate) <= new Date(toDate)
      );
    }

    // Calculate summary statistics
    const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalPaid = filteredPayments.reduce((sum, payment) => sum + payment.amountPaid, 0);
    const totalOutstanding = totalAmount - totalPaid;
    
    const completePayments = filteredPayments.filter(p => p.status === 'Complete').length;
    const partialPayments = filteredPayments.filter(p => p.status === 'Partial').length;
    const pendingPayments = filteredPayments.filter(p => p.status === 'Pending').length;

    // Payment method breakdown
    const paymentMethods = filteredPayments.reduce((acc: { [key: string]: number }, payment) => {
      acc[payment.paymentMethod] = (acc[payment.paymentMethod] || 0) + payment.amountPaid;
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: filteredPayments,
      summary: {
        totalPayments: filteredPayments.length,
        totalAmount,
        totalPaid,
        totalOutstanding,
        completePayments,
        partialPayments,
        pendingPayments,
        paymentMethods,
        collectionRate: totalAmount > 0 ? ((totalPaid / totalAmount) * 100).toFixed(2) : '0'
      },
      message: 'Payments fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      studentId,
      studentName,
      class: className,
      feeId,
      feeName,
      feeCategory,
      amount,
      amountPaid,
      paymentMethod,
      term,
      session,
      paidBy,
      relationship,
      phoneNumber,
      reference
    } = body;

    // Validate required fields
    if (!studentId || !feeId || !amountPaid || !paymentMethod || !paidBy) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate payment amount
    if (amountPaid <= 0) {
      return NextResponse.json(
        { success: false, error: 'Payment amount must be greater than zero' },
        { status: 400 }
      );
    }

    if (amountPaid > amount) {
      return NextResponse.json(
        { success: false, error: 'Payment amount cannot exceed fee amount' },
        { status: 400 }
      );
    }

    // Check for existing payments for this fee
    const existingPayments = mockPayments.filter(p => 
      p.studentId === studentId && p.feeId === feeId && p.term === term && p.session === session
    );
    
    const totalExistingPayments = existingPayments.reduce((sum, p) => sum + p.amountPaid, 0);
    
    if (totalExistingPayments + amountPaid > amount) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Total payment (₦${(totalExistingPayments + amountPaid).toLocaleString()}) would exceed fee amount (₦${amount.toLocaleString()})` 
        },
        { status: 400 }
      );
    }

    // Generate receipt number
    const receiptNumber = `RCP${String(mockPayments.length + 1).padStart(3, '0')}`;

    // Determine payment status
    const totalAfterPayment = totalExistingPayments + amountPaid;
    const status = totalAfterPayment >= amount ? 'Complete' : 'Partial';

    // Create new payment record
    const newPayment = {
      id: `PAY${String(mockPayments.length + 1).padStart(3, '0')}`,
      studentId,
      studentName,
      class: className,
      feeId,
      feeName,
      feeCategory,
      amount,
      amountPaid: parseFloat(amountPaid),
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod,
      receiptNumber,
      term,
      session,
      status,
      paidBy,
      relationship,
      phoneNumber,
      reference: reference || `${paymentMethod.toUpperCase()}/${Date.now()}`
    };

    mockPayments.push(newPayment);

    return NextResponse.json({
      success: true,
      data: newPayment,
      message: 'Payment recorded successfully'
    });
  } catch (error) {
    console.error('Error recording payment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record payment' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, amountPaid, paymentMethod, reference, paidBy, relationship, phoneNumber } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    // Find the payment to update
    const paymentIndex = mockPayments.findIndex(payment => payment.id === id);
    
    if (paymentIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Payment record not found' },
        { status: 404 }
      );
    }

    const existingPayment = mockPayments[paymentIndex];

    // Validate new amount if provided
    if (amountPaid !== undefined) {
      if (amountPaid <= 0) {
        return NextResponse.json(
          { success: false, error: 'Payment amount must be greater than zero' },
          { status: 400 }
        );
      }

      if (amountPaid > existingPayment.amount) {
        return NextResponse.json(
          { success: false, error: 'Payment amount cannot exceed fee amount' },
          { status: 400 }
        );
      }
    }

    // Update the payment record
    mockPayments[paymentIndex] = {
      ...existingPayment,
      amountPaid: amountPaid !== undefined ? parseFloat(amountPaid) : existingPayment.amountPaid,
      paymentMethod: paymentMethod || existingPayment.paymentMethod,
      reference: reference || existingPayment.reference,
      paidBy: paidBy || existingPayment.paidBy,
      relationship: relationship || existingPayment.relationship,
      phoneNumber: phoneNumber || existingPayment.phoneNumber,
      status: amountPaid !== undefined ? 
        (amountPaid >= existingPayment.amount ? 'Complete' : 'Partial') : 
        existingPayment.status
    };

    return NextResponse.json({
      success: true,
      data: mockPayments[paymentIndex],
      message: 'Payment updated successfully'
    });
  } catch (error) {
    console.error('Error updating payment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update payment' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    // Find the payment to delete
    const paymentIndex = mockPayments.findIndex(payment => payment.id === id);
    
    if (paymentIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Payment record not found' },
        { status: 404 }
      );
    }

    // Remove the payment record
    const deletedPayment = mockPayments.splice(paymentIndex, 1)[0];

    return NextResponse.json({
      success: true,
      data: deletedPayment,
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting payment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete payment' },
      { status: 500 }
    );
  }
}
