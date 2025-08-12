import { NextRequest, NextResponse } from 'next/server';

// Mock database for borrowing records
const mockBorrowings = [
  {
    id: 'borrow1',
    bookId: 'book1',
    bookTitle: 'Further Mathematics for Senior Secondary Schools',
    bookIsbn: '978-978-123-456-7',
    studentId: 'STU001',
    studentName: 'Adebayo Johnson',
    studentClass: 'SS 2A',
    borrowDate: '2024-11-15',
    dueDate: '2024-12-15',
    returnDate: null,
    status: 'borrowed',
    renewalCount: 0,
    condition: 'Good',
    librarian: 'Mrs. Grace Okafor',
    fineAmount: 0,
    notes: ''
  },
  {
    id: 'borrow2',
    bookId: 'book2',
    bookTitle: 'New Concept English for Junior Secondary Schools',
    bookIsbn: '978-978-234-567-8',
    studentId: 'STU002',
    studentName: 'Fatima Ibrahim',
    studentClass: 'JSS 3B',
    borrowDate: '2024-11-10',
    dueDate: '2024-12-10',
    returnDate: '2024-11-28',
    status: 'returned',
    renewalCount: 1,
    condition: 'Good',
    librarian: 'Mrs. Grace Okafor',
    fineAmount: 0,
    notes: 'Returned in good condition'
  },
  {
    id: 'borrow3',
    bookId: 'book3',
    bookTitle: 'Senior Secondary Physics',
    bookIsbn: '978-978-345-678-9',
    studentId: 'STU003',
    studentName: 'Emmanuel Okonkwo',
    studentClass: 'SS 1B',
    borrowDate: '2024-11-20',
    dueDate: '2024-12-20',
    returnDate: null,
    status: 'borrowed',
    renewalCount: 0,
    condition: 'Good',
    librarian: 'Mrs. Grace Okafor',
    fineAmount: 0,
    notes: ''
  },
  {
    id: 'borrow4',
    bookId: 'book1',
    bookTitle: 'Further Mathematics for Senior Secondary Schools',
    bookIsbn: '978-978-123-456-7',
    studentId: 'STU004',
    studentName: 'Blessing Okoro',
    studentClass: 'SS 3A',
    borrowDate: '2024-11-05',
    dueDate: '2024-12-05',
    returnDate: null,
    status: 'overdue',
    renewalCount: 0,
    condition: 'Good',
    librarian: 'Mrs. Grace Okafor',
    fineAmount: 150, // ₦50 per day for 3 days overdue
    notes: 'Fine accrued for late return'
  },
  {
    id: 'borrow5',
    bookId: 'book4',
    bookTitle: 'Nigerian History for Schools',
    bookIsbn: '978-978-456-789-0',
    studentId: 'STU005',
    studentName: 'Chioma Nwosu',
    studentClass: 'JSS 2A',
    borrowDate: '2024-10-15',
    dueDate: '2024-11-15',
    returnDate: '2024-11-20',
    status: 'returned',
    renewalCount: 2,
    condition: 'Fair',
    librarian: 'Mrs. Grace Okafor',
    fineAmount: 250, // ₦50 per day for 5 days overdue
    notes: 'Returned with slight damage to cover'
  }
];

// Mock students data
const mockStudents = [
  {
    id: 'STU001',
    name: 'Adebayo Johnson',
    class: 'SS 2A',
    email: 'adebayo.johnson@school.edu.ng',
    phone: '08012345678'
  },
  {
    id: 'STU002',
    name: 'Fatima Ibrahim',
    class: 'JSS 3B',
    email: 'fatima.ibrahim@school.edu.ng',
    phone: '08023456789'
  },
  {
    id: 'STU003',
    name: 'Emmanuel Okonkwo',
    class: 'SS 1B',
    email: 'emmanuel.okonkwo@school.edu.ng',
    phone: '08034567890'
  },
  {
    id: 'STU004',
    name: 'Blessing Okoro',
    class: 'SS 3A',
    email: 'blessing.okoro@school.edu.ng',
    phone: '08045678901'
  },
  {
    id: 'STU005',
    name: 'Chioma Nwosu',
    class: 'JSS 2A',
    email: 'chioma.nwosu@school.edu.ng',
    phone: '08056789012'
  }
];

// Calculate fine for overdue books
const calculateFine = (dueDate: string, returnDate?: string): number => {
  const due = new Date(dueDate);
  const returned = returnDate ? new Date(returnDate) : new Date();
  const daysDiff = Math.ceil((returned.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
  return daysDiff > 0 ? daysDiff * 50 : 0; // ₦50 per day
};

// Update overdue status
const updateOverdueStatus = () => {
  const today = new Date();
  mockBorrowings.forEach(borrowing => {
    if (borrowing.status === 'borrowed') {
      const dueDate = new Date(borrowing.dueDate);
      if (today > dueDate) {
        borrowing.status = 'overdue';
        borrowing.fineAmount = calculateFine(borrowing.dueDate);
      }
    }
  });
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const studentId = searchParams.get('studentId');
    const studentClass = searchParams.get('class');
    const search = searchParams.get('search');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Update overdue status before processing
    updateOverdueStatus();

    let filteredBorrowings = [...mockBorrowings];

    // Filter by status
    if (status && status !== '') {
      filteredBorrowings = filteredBorrowings.filter(borrowing => 
        borrowing.status === status
      );
    }

    // Filter by student ID
    if (studentId && studentId !== '') {
      filteredBorrowings = filteredBorrowings.filter(borrowing => 
        borrowing.studentId === studentId
      );
    }

    // Filter by class
    if (studentClass && studentClass !== '') {
      filteredBorrowings = filteredBorrowings.filter(borrowing => 
        borrowing.studentClass === studentClass
      );
    }

    // Filter by search term
    if (search && search !== '') {
      const searchTerm = search.toLowerCase();
      filteredBorrowings = filteredBorrowings.filter(borrowing => 
        borrowing.bookTitle.toLowerCase().includes(searchTerm) ||
        borrowing.studentName.toLowerCase().includes(searchTerm) ||
        borrowing.bookIsbn.includes(searchTerm)
      );
    }

    // Filter by date range
    if (startDate && endDate) {
      filteredBorrowings = filteredBorrowings.filter(borrowing => {
        const borrowDate = new Date(borrowing.borrowDate);
        return borrowDate >= new Date(startDate) && borrowDate <= new Date(endDate);
      });
    }

    // Calculate statistics
    const statistics = {
      totalBorrowings: mockBorrowings.length,
      activeBorrowings: mockBorrowings.filter(b => b.status === 'borrowed').length,
      overdueBorrowings: mockBorrowings.filter(b => b.status === 'overdue').length,
      returnedBorrowings: mockBorrowings.filter(b => b.status === 'returned').length,
      totalFines: mockBorrowings.reduce((sum, b) => sum + b.fineAmount, 0),
      averageRenewalCount: mockBorrowings.reduce((sum, b) => sum + b.renewalCount, 0) / mockBorrowings.length
    };

    return NextResponse.json({
      success: true,
      borrowings: filteredBorrowings,
      students: mockStudents,
      statistics
    });

  } catch (error) {
    console.error('Error fetching borrowings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch borrowings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const borrowData = await request.json();

    // Validate required fields
    const requiredFields = ['bookId', 'bookTitle', 'studentId', 'studentName', 'studentClass'];
    for (const field of requiredFields) {
      if (!borrowData[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Check if student already has this book
    const existingBorrowing = mockBorrowings.find(borrowing => 
      borrowing.bookId === borrowData.bookId && 
      borrowing.studentId === borrowData.studentId && 
      (borrowing.status === 'borrowed' || borrowing.status === 'overdue')
    );

    if (existingBorrowing) {
      return NextResponse.json(
        { success: false, error: 'Student already has this book borrowed' },
        { status: 400 }
      );
    }

    // Check borrowing limit (max 3 books per student)
    const studentActiveBorrowings = mockBorrowings.filter(borrowing => 
      borrowing.studentId === borrowData.studentId && 
      (borrowing.status === 'borrowed' || borrowing.status === 'overdue')
    );

    if (studentActiveBorrowings.length >= 3) {
      return NextResponse.json(
        { success: false, error: 'Student has reached maximum borrowing limit (3 books)' },
        { status: 400 }
      );
    }

    // Calculate due date (30 days from now)
    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    // Create new borrowing record
    const newBorrowing = {
      id: `borrow${mockBorrowings.length + 1}`,
      bookId: borrowData.bookId,
      bookTitle: borrowData.bookTitle,
      bookIsbn: borrowData.bookIsbn || '',
      studentId: borrowData.studentId,
      studentName: borrowData.studentName,
      studentClass: borrowData.studentClass,
      borrowDate: borrowDate.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      returnDate: null,
      status: 'borrowed',
      renewalCount: 0,
      condition: borrowData.condition || 'Good',
      librarian: borrowData.librarian || 'System Admin',
      fineAmount: 0,
      notes: borrowData.notes || ''
    };

    // Add to mock database
    mockBorrowings.push(newBorrowing);

    return NextResponse.json({
      success: true,
      message: 'Book borrowed successfully',
      borrowing: newBorrowing
    });

  } catch (error) {
    console.error('Error processing borrowing:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process borrowing' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const borrowingId = searchParams.get('id');
    const action = searchParams.get('action'); // 'return', 'renew', 'update'
    const updateData = await request.json();

    if (!borrowingId) {
      return NextResponse.json(
        { success: false, error: 'Borrowing ID is required' },
        { status: 400 }
      );
    }

    const borrowingIndex = mockBorrowings.findIndex(borrowing => borrowing.id === borrowingId);
    if (borrowingIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Borrowing record not found' },
        { status: 404 }
      );
    }

    const borrowing = mockBorrowings[borrowingIndex];

    if (action === 'return') {
      // Return book
      const returnDate = new Date().toISOString().split('T')[0];
      const fine = calculateFine(borrowing.dueDate, returnDate);

      mockBorrowings[borrowingIndex] = {
        ...borrowing,
        returnDate,
        status: 'returned',
        fineAmount: fine,
        condition: updateData.condition || borrowing.condition,
        notes: updateData.notes || borrowing.notes
      };

      return NextResponse.json({
        success: true,
        message: 'Book returned successfully',
        borrowing: mockBorrowings[borrowingIndex],
        fine
      });

    } else if (action === 'renew') {
      // Renew book (extend due date by 14 days)
      if (borrowing.renewalCount >= 2) {
        return NextResponse.json(
          { success: false, error: 'Maximum renewal limit reached (2 renewals)' },
          { status: 400 }
        );
      }

      if (borrowing.status === 'overdue') {
        return NextResponse.json(
          { success: false, error: 'Cannot renew overdue books. Please return first.' },
          { status: 400 }
        );
      }

      const newDueDate = new Date(borrowing.dueDate);
      newDueDate.setDate(newDueDate.getDate() + 14);

      mockBorrowings[borrowingIndex] = {
        ...borrowing,
        dueDate: newDueDate.toISOString().split('T')[0],
        renewalCount: borrowing.renewalCount + 1,
        notes: `${borrowing.notes} Renewed on ${new Date().toISOString().split('T')[0]}`
      };

      return NextResponse.json({
        success: true,
        message: 'Book renewed successfully',
        borrowing: mockBorrowings[borrowingIndex]
      });

    } else {
      // General update
      mockBorrowings[borrowingIndex] = {
        ...borrowing,
        ...updateData
      };

      return NextResponse.json({
        success: true,
        message: 'Borrowing record updated successfully',
        borrowing: mockBorrowings[borrowingIndex]
      });
    }

  } catch (error) {
    console.error('Error updating borrowing:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update borrowing' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const borrowingId = searchParams.get('id');

    if (!borrowingId) {
      return NextResponse.json(
        { success: false, error: 'Borrowing ID is required' },
        { status: 400 }
      );
    }

    const borrowingIndex = mockBorrowings.findIndex(borrowing => borrowing.id === borrowingId);
    if (borrowingIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Borrowing record not found' },
        { status: 404 }
      );
    }

    const borrowing = mockBorrowings[borrowingIndex];

    // Only allow deletion of returned records
    if (borrowing.status !== 'returned') {
      return NextResponse.json(
        { success: false, error: 'Can only delete returned borrowing records' },
        { status: 400 }
      );
    }

    // Remove borrowing record
    const deletedBorrowing = mockBorrowings.splice(borrowingIndex, 1)[0];

    return NextResponse.json({
      success: true,
      message: 'Borrowing record deleted successfully',
      borrowing: deletedBorrowing
    });

  } catch (error) {
    console.error('Error deleting borrowing:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete borrowing record' },
      { status: 500 }
    );
  }
}
