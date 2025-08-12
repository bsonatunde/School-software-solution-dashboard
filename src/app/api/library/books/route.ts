import { NextRequest, NextResponse } from 'next/server';

// Mock database for books
const mockBooks = [
  {
    id: 'book1',
    title: 'Further Mathematics for Senior Secondary Schools',
    author: 'A.O. Adelodun',
    isbn: '978-978-123-456-7',
    category: 'Mathematics',
    publisher: 'Macmillan Education',
    publicationYear: 2023,
    edition: '4th Edition',
    totalCopies: 25,
    availableCopies: 18,
    location: 'Section A - Shelf 1',
    language: 'English',
    price: 3500,
    condition: 'Good',
    dateAcquired: '2024-01-15',
    description: 'Comprehensive mathematics textbook for SS1-SS3 students',
    subject: 'Mathematics',
    level: 'Senior Secondary'
  },
  {
    id: 'book2',
    title: 'New Concept English for Junior Secondary Schools',
    author: 'M.A. Oluikpe',
    isbn: '978-978-234-567-8',
    category: 'Language Arts',
    publisher: 'Africana First Publishers',
    publicationYear: 2022,
    edition: '3rd Edition',
    totalCopies: 30,
    availableCopies: 22,
    location: 'Section B - Shelf 3',
    language: 'English',
    price: 2800,
    condition: 'Excellent',
    dateAcquired: '2024-02-10',
    description: 'English language textbook for JSS students',
    subject: 'English Language',
    level: 'Junior Secondary'
  },
  {
    id: 'book3',
    title: 'Senior Secondary Physics',
    author: 'M.W. Anyakoha',
    isbn: '978-978-345-678-9',
    category: 'Science',
    publisher: 'Macmillan Education',
    publicationYear: 2023,
    edition: '2nd Edition',
    totalCopies: 20,
    availableCopies: 15,
    location: 'Section C - Shelf 2',
    language: 'English',
    price: 4200,
    condition: 'Good',
    dateAcquired: '2024-01-20',
    description: 'Comprehensive physics textbook for senior secondary students',
    subject: 'Physics',
    level: 'Senior Secondary'
  },
  {
    id: 'book4',
    title: 'Nigerian History for Schools',
    author: 'E.A. Ayandele',
    isbn: '978-978-456-789-0',
    category: 'History',
    publisher: 'Ibadan University Press',
    publicationYear: 2021,
    edition: '5th Edition',
    totalCopies: 15,
    availableCopies: 12,
    location: 'Section D - Shelf 1',
    language: 'English',
    price: 3200,
    condition: 'Fair',
    dateAcquired: '2023-09-15',
    description: 'Comprehensive Nigerian history textbook',
    subject: 'History',
    level: 'Both'
  },
  {
    id: 'book5',
    title: 'Basic Science for Junior Secondary Schools',
    author: 'K.I.W. Mbajiorgu',
    isbn: '978-978-567-890-1',
    category: 'Science',
    publisher: 'University Press Plc',
    publicationYear: 2022,
    edition: '1st Edition',
    totalCopies: 28,
    availableCopies: 20,
    location: 'Section C - Shelf 1',
    language: 'English',
    price: 2900,
    condition: 'Excellent',
    dateAcquired: '2024-03-05',
    description: 'Integrated science textbook for JSS students',
    subject: 'Basic Science',
    level: 'Junior Secondary'
  }
];

// Mock database for borrowing records
const mockBorrowings = [
  {
    id: 'borrow1',
    bookId: 'book1',
    bookTitle: 'Further Mathematics for Senior Secondary Schools',
    studentId: 'STU001',
    studentName: 'Adebayo Johnson',
    studentClass: 'SS 2A',
    borrowDate: '2024-11-15',
    dueDate: '2024-12-15',
    returnDate: null,
    status: 'borrowed',
    renewalCount: 0,
    condition: 'Good',
    librarian: 'Mrs. Grace Okafor'
  },
  {
    id: 'borrow2',
    bookId: 'book2',
    bookTitle: 'New Concept English for Junior Secondary Schools',
    studentId: 'STU002',
    studentName: 'Fatima Ibrahim',
    studentClass: 'JSS 3B',
    borrowDate: '2024-11-10',
    dueDate: '2024-12-10',
    returnDate: '2024-11-28',
    status: 'returned',
    renewalCount: 1,
    condition: 'Good',
    librarian: 'Mrs. Grace Okafor'
  },
  {
    id: 'borrow3',
    bookId: 'book3',
    bookTitle: 'Senior Secondary Physics',
    studentId: 'STU003',
    studentName: 'Emmanuel Okonkwo',
    studentClass: 'SS 1B',
    borrowDate: '2024-11-20',
    dueDate: '2024-12-20',
    returnDate: null,
    status: 'borrowed',
    renewalCount: 0,
    condition: 'Good',
    librarian: 'Mrs. Grace Okafor'
  },
  {
    id: 'borrow4',
    bookId: 'book1',
    bookTitle: 'Further Mathematics for Senior Secondary Schools',
    studentId: 'STU004',
    studentName: 'Blessing Okoro',
    studentClass: 'SS 3A',
    borrowDate: '2024-11-05',
    dueDate: '2024-12-05',
    returnDate: null,
    status: 'overdue',
    renewalCount: 0,
    condition: 'Good',
    librarian: 'Mrs. Grace Okafor'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    const subject = searchParams.get('subject');
    const search = searchParams.get('search');
    const availability = searchParams.get('availability');

    let filteredBooks = [...mockBooks];

    // Filter by category
    if (category && category !== '') {
      filteredBooks = filteredBooks.filter(book => 
        book.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by level
    if (level && level !== '') {
      filteredBooks = filteredBooks.filter(book => 
        book.level === level || book.level === 'Both'
      );
    }

    // Filter by subject
    if (subject && subject !== '') {
      filteredBooks = filteredBooks.filter(book => 
        book.subject.toLowerCase().includes(subject.toLowerCase())
      );
    }

    // Filter by availability
    if (availability === 'available') {
      filteredBooks = filteredBooks.filter(book => book.availableCopies > 0);
    } else if (availability === 'out-of-stock') {
      filteredBooks = filteredBooks.filter(book => book.availableCopies === 0);
    }

    // Filter by search term
    if (search && search !== '') {
      const searchTerm = search.toLowerCase();
      filteredBooks = filteredBooks.filter(book => 
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.isbn.includes(searchTerm) ||
        book.publisher.toLowerCase().includes(searchTerm)
      );
    }

    return NextResponse.json({
      success: true,
      books: filteredBooks,
      borrowings: mockBorrowings.filter(b => 
        filteredBooks.some(book => book.id === b.bookId)
      ),
      totalBooks: filteredBooks.length,
      totalAvailable: filteredBooks.reduce((sum, book) => sum + book.availableCopies, 0),
      totalBorrowed: mockBorrowings.filter(b => b.status === 'borrowed').length,
      overdueCount: mockBorrowings.filter(b => b.status === 'overdue').length
    });

  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const bookData = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'author', 'isbn', 'category', 'publisher', 'totalCopies'];
    for (const field of requiredFields) {
      if (!bookData[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Check if ISBN already exists
    const existingBook = mockBooks.find(book => book.isbn === bookData.isbn);
    if (existingBook) {
      return NextResponse.json(
        { success: false, error: 'A book with this ISBN already exists' },
        { status: 400 }
      );
    }

    // Create new book
    const newBook = {
      id: `book${mockBooks.length + 1}`,
      title: bookData.title,
      author: bookData.author,
      isbn: bookData.isbn,
      category: bookData.category,
      publisher: bookData.publisher,
      publicationYear: bookData.publicationYear || new Date().getFullYear(),
      edition: bookData.edition || '1st Edition',
      totalCopies: parseInt(bookData.totalCopies),
      availableCopies: parseInt(bookData.totalCopies),
      location: bookData.location || 'Not Assigned',
      language: bookData.language || 'English',
      price: parseFloat(bookData.price) || 0,
      condition: bookData.condition || 'New',
      dateAcquired: new Date().toISOString().split('T')[0],
      description: bookData.description || '',
      subject: bookData.subject || bookData.category,
      level: bookData.level || 'Both'
    };

    // Add to mock database
    mockBooks.push(newBook);

    return NextResponse.json({
      success: true,
      message: 'Book added successfully',
      book: newBook
    });

  } catch (error) {
    console.error('Error adding book:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add book' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get('id');
    const updateData = await request.json();

    if (!bookId) {
      return NextResponse.json(
        { success: false, error: 'Book ID is required' },
        { status: 400 }
      );
    }

    const bookIndex = mockBooks.findIndex(book => book.id === bookId);
    if (bookIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      );
    }

    // Update book data
    mockBooks[bookIndex] = {
      ...mockBooks[bookIndex],
      ...updateData,
      totalCopies: parseInt(updateData.totalCopies) || mockBooks[bookIndex].totalCopies,
      price: parseFloat(updateData.price) || mockBooks[bookIndex].price
    };

    return NextResponse.json({
      success: true,
      message: 'Book updated successfully',
      book: mockBooks[bookIndex]
    });

  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update book' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get('id');

    if (!bookId) {
      return NextResponse.json(
        { success: false, error: 'Book ID is required' },
        { status: 400 }
      );
    }

    const bookIndex = mockBooks.findIndex(book => book.id === bookId);
    if (bookIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      );
    }

    // Check if book has active borrowings
    const activeBorrowings = mockBorrowings.filter(
      borrowing => borrowing.bookId === bookId && borrowing.status === 'borrowed'
    );

    if (activeBorrowings.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete book with active borrowings' },
        { status: 400 }
      );
    }

    // Remove book
    const deletedBook = mockBooks.splice(bookIndex, 1)[0];

    return NextResponse.json({
      success: true,
      message: 'Book deleted successfully',
      book: deletedBook
    });

  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete book' },
      { status: 500 }
    );
  }
}
