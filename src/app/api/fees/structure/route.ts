import { NextRequest, NextResponse } from 'next/server';

// Mock fee structure data for Nigerian schools
const mockFeeStructures = [
  // JSS Fee Structures
  {
    id: 'FEE001',
    name: 'Tuition Fee',
    category: 'Tuition',
    amount: 45000,
    class: 'JSS 1A',
    term: '1st Term',
    session: '2024/2025',
    dueDate: '2024-09-30',
    description: 'Basic tuition fee for academic instruction',
    mandatory: true
  },
  {
    id: 'FEE002',
    name: 'Development Levy',
    category: 'Development',
    amount: 15000,
    class: 'JSS 1A',
    term: '1st Term',
    session: '2024/2025',
    dueDate: '2024-09-30',
    description: 'School infrastructure development fund',
    mandatory: true
  },
  {
    id: 'FEE003',
    name: 'Sports Fee',
    category: 'Sports',
    amount: 5000,
    class: 'JSS 1A',
    term: '1st Term',
    session: '2024/2025',
    dueDate: '2024-10-15',
    description: 'Sports equipment and activities',
    mandatory: false
  },
  {
    id: 'FEE004',
    name: 'Library Fee',
    category: 'Library',
    amount: 3000,
    class: 'JSS 1A',
    term: '1st Term',
    session: '2024/2025',
    dueDate: '2024-10-15',
    description: 'Library maintenance and new books',
    mandatory: true
  },
  {
    id: 'FEE005',
    name: 'Laboratory Fee',
    category: 'Laboratory',
    amount: 8000,
    class: 'JSS 1A',
    term: '1st Term',
    session: '2024/2025',
    dueDate: '2024-10-15',
    description: 'Science laboratory equipment and chemicals',
    mandatory: true
  },
  {
    id: 'FEE006',
    name: 'Computer Fee',
    category: 'Computer',
    amount: 7000,
    class: 'JSS 1A',
    term: '1st Term',
    session: '2024/2025',
    dueDate: '2024-10-15',
    description: 'Computer lab maintenance and software',
    mandatory: true
  },
  {
    id: 'FEE007',
    name: 'Examination Fee',
    category: 'Examination',
    amount: 2500,
    class: 'JSS 1A',
    term: '1st Term',
    session: '2024/2025',
    dueDate: '2024-11-30',
    description: 'End of term examination materials',
    mandatory: true
  },
  
  // SS Fee Structures (Higher amounts)
  {
    id: 'FEE008',
    name: 'Tuition Fee',
    category: 'Tuition',
    amount: 65000,
    class: 'SS 1A',
    term: '1st Term',
    session: '2024/2025',
    dueDate: '2024-09-30',
    description: 'Basic tuition fee for senior secondary education',
    mandatory: true
  },
  {
    id: 'FEE009',
    name: 'Development Levy',
    category: 'Development',
    amount: 20000,
    class: 'SS 1A',
    term: '1st Term',
    session: '2024/2025',
    dueDate: '2024-09-30',
    description: 'School infrastructure development fund',
    mandatory: true
  },
  {
    id: 'FEE010',
    name: 'WAEC Registration',
    category: 'Examination',
    amount: 18000,
    class: 'SS 3A',
    term: '1st Term',
    session: '2024/2025',
    dueDate: '2024-10-31',
    description: 'WAEC examination registration fee',
    mandatory: true
  },
  {
    id: 'FEE011',
    name: 'JAMB Registration',
    category: 'Examination',
    amount: 5000,
    class: 'SS 3A',
    term: '2nd Term',
    session: '2024/2025',
    dueDate: '2025-01-31',
    description: 'JAMB UTME registration fee',
    mandatory: true
  },
  
  // Transport and Boarding (Optional)
  {
    id: 'FEE012',
    name: 'Transport Fee',
    category: 'Transport',
    amount: 25000,
    class: 'All Classes',
    term: '1st Term',
    session: '2024/2025',
    dueDate: '2024-09-30',
    description: 'School bus transportation service',
    mandatory: false
  },
  {
    id: 'FEE013',
    name: 'Boarding Fee',
    category: 'Boarding',
    amount: 85000,
    class: 'All Classes',
    term: '1st Term',
    session: '2024/2025',
    dueDate: '2024-09-15',
    description: 'Hostel accommodation and meals',
    mandatory: false
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const term = searchParams.get('term');
    const session = searchParams.get('session');
    const classParam = searchParams.get('class');
    const category = searchParams.get('category');
    const mandatory = searchParams.get('mandatory');

    let filteredFees = [...mockFeeStructures];

    // Filter by term
    if (term) {
      filteredFees = filteredFees.filter(fee => fee.term === term);
    }

    // Filter by session
    if (session) {
      filteredFees = filteredFees.filter(fee => fee.session === session);
    }

    // Filter by class
    if (classParam && classParam !== 'All Classes') {
      filteredFees = filteredFees.filter(fee => 
        fee.class === classParam || fee.class === 'All Classes'
      );
    }

    // Filter by category
    if (category) {
      filteredFees = filteredFees.filter(fee => fee.category === category);
    }

    // Filter by mandatory status
    if (mandatory !== null && mandatory !== undefined) {
      const isMandatory = mandatory === 'true';
      filteredFees = filteredFees.filter(fee => fee.mandatory === isMandatory);
    }

    // Calculate totals
    const totalAmount = filteredFees.reduce((sum, fee) => sum + fee.amount, 0);
    const mandatoryAmount = filteredFees
      .filter(fee => fee.mandatory)
      .reduce((sum, fee) => sum + fee.amount, 0);
    const optionalAmount = filteredFees
      .filter(fee => !fee.mandatory)
      .reduce((sum, fee) => sum + fee.amount, 0);

    return NextResponse.json({
      success: true,
      data: filteredFees,
      summary: {
        totalFees: filteredFees.length,
        totalAmount,
        mandatoryAmount,
        optionalAmount,
        mandatoryCount: filteredFees.filter(fee => fee.mandatory).length,
        optionalCount: filteredFees.filter(fee => !fee.mandatory).length
      },
      message: 'Fee structures fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching fee structures:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch fee structures' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      category, 
      amount, 
      class: className, 
      term, 
      session, 
      dueDate, 
      description, 
      mandatory 
    } = body;

    // Validate required fields
    if (!name || !category || !amount || !className || !term || !session || !dueDate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate amount is positive
    if (amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Amount must be greater than zero' },
        { status: 400 }
      );
    }

    // Check if similar fee already exists
    const existingFee = mockFeeStructures.find(fee => 
      fee.name === name && 
      fee.class === className && 
      fee.term === term && 
      fee.session === session
    );

    if (existingFee) {
      return NextResponse.json(
        { success: false, error: 'Fee with same name already exists for this class and term' },
        { status: 400 }
      );
    }

    // Create new fee structure
    const newFee = {
      id: `FEE${String(mockFeeStructures.length + 1).padStart(3, '0')}`,
      name,
      category,
      amount: parseFloat(amount),
      class: className,
      term,
      session,
      dueDate,
      description: description || '',
      mandatory: mandatory === true
    };

    mockFeeStructures.push(newFee);

    return NextResponse.json({
      success: true,
      data: newFee,
      message: 'Fee structure created successfully'
    });
  } catch (error) {
    console.error('Error creating fee structure:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create fee structure' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, category, amount, dueDate, description, mandatory } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Fee ID is required' },
        { status: 400 }
      );
    }

    // Find the fee to update
    const feeIndex = mockFeeStructures.findIndex(fee => fee.id === id);
    
    if (feeIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Fee structure not found' },
        { status: 404 }
      );
    }

    // Update the fee structure
    mockFeeStructures[feeIndex] = {
      ...mockFeeStructures[feeIndex],
      name: name || mockFeeStructures[feeIndex].name,
      category: category || mockFeeStructures[feeIndex].category,
      amount: amount !== undefined ? parseFloat(amount) : mockFeeStructures[feeIndex].amount,
      dueDate: dueDate || mockFeeStructures[feeIndex].dueDate,
      description: description !== undefined ? description : mockFeeStructures[feeIndex].description,
      mandatory: mandatory !== undefined ? mandatory : mockFeeStructures[feeIndex].mandatory
    };

    return NextResponse.json({
      success: true,
      data: mockFeeStructures[feeIndex],
      message: 'Fee structure updated successfully'
    });
  } catch (error) {
    console.error('Error updating fee structure:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update fee structure' },
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
        { success: false, error: 'Fee ID is required' },
        { status: 400 }
      );
    }

    // Find the fee to delete
    const feeIndex = mockFeeStructures.findIndex(fee => fee.id === id);
    
    if (feeIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Fee structure not found' },
        { status: 404 }
      );
    }

    // Remove the fee structure
    const deletedFee = mockFeeStructures.splice(feeIndex, 1)[0];

    return NextResponse.json({
      success: true,
      data: deletedFee,
      message: 'Fee structure deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting fee structure:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete fee structure' },
      { status: 500 }
    );
  }
}
