'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publisher: string;
  publicationYear: number;
  edition: string;
  totalCopies: number;
  availableCopies: number;
  location: string;
  language: string;
  price: number;
  condition: string;
  dateAcquired: string;
  description: string;
  subject: string;
  level: string;
}

interface Borrowing {
  id: string;
  bookId: string;
  bookTitle: string;
  bookIsbn: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: 'borrowed' | 'returned' | 'overdue';
  renewalCount: number;
  condition: string;
  librarian: string;
  fineAmount: number;
  notes: string;
}

export default function LibraryPage() {
  const [selectedView, setSelectedView] = useState<'books' | 'borrowings'>('books');
  const [books, setBooks] = useState<Book[]>([]);
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [statistics, setStatistics] = useState<{
    totalBooks?: number;
    totalAvailable?: number;
    totalBorrowed?: number;
    overdueCount?: number;
  }>({});
  const [filters, setFilters] = useState({
    category: '',
    level: '',
    subject: '',
    search: '',
    availability: '',
    status: ''
  });
  const router = useRouter();

  const categories = [
    'Mathematics', 'Science', 'Language Arts', 'History', 'Geography',
    'Literature', 'Religious Studies', 'Vocational Studies', 'Arts', 'Reference'
  ];

  const levels = ['Junior Secondary', 'Senior Secondary', 'Both'];
  const classes = [
    'JSS 1A', 'JSS 1B', 'JSS 2A', 'JSS 2B', 'JSS 3A', 'JSS 3B',
    'SS 1A', 'SS 1B', 'SS 2A', 'SS 2B', 'SS 3A', 'SS 3B'
  ];

  useEffect(() => {
    fetchBooks();
    fetchBorrowings();
  }, [filters]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && key !== 'status') queryParams.append(key, value);
      });

      const response = await fetch(`/api/library/books?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        setBooks(data.books);
        setStatistics(prev => ({
          ...prev,
          totalBooks: data.totalBooks,
          totalAvailable: data.totalAvailable,
          totalBorrowed: data.totalBorrowed,
          overdueCount: data.overdueCount
        }));
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBorrowings = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.search) queryParams.append('search', filters.search);

      const response = await fetch(`/api/library/borrowings?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        setBorrowings(data.borrowings);
        setStatistics(prev => ({
          ...prev,
          ...data.statistics
        }));
      }
    } catch (error) {
      console.error('Error fetching borrowings:', error);
    }
  };

  const handleAddBook = async (bookData: any) => {
    try {
      const response = await fetch('/api/library/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
      });

      const data = await response.json();
      if (data.success) {
        setShowAddBookModal(false);
        fetchBooks();
        alert('Book added successfully!');
      } else {
        alert(data.error || 'Failed to add book');
      }
    } catch (error) {
      alert('Failed to add book');
    }
  };

  const handleBorrowBook = async (borrowData: any) => {
    try {
      const response = await fetch('/api/library/borrowings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...borrowData,
          bookId: selectedBook?.id,
          bookTitle: selectedBook?.title,
          bookIsbn: selectedBook?.isbn
        })
      });

      const data = await response.json();
      if (data.success) {
        setShowBorrowModal(false);
        setSelectedBook(null);
        fetchBooks();
        fetchBorrowings();
        alert('Book borrowed successfully!');
      } else {
        alert(data.error || 'Failed to borrow book');
      }
    } catch (error) {
      alert('Failed to borrow book');
    }
  };

  const handleReturnBook = async (borrowingId: string, condition: string, notes: string) => {
    try {
      const response = await fetch(`/api/library/borrowings?id=${borrowingId}&action=return`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ condition, notes })
      });

      const data = await response.json();
      if (data.success) {
        fetchBooks();
        fetchBorrowings();
        if (data.fine > 0) {
          alert(`Book returned successfully! Fine: ₦${data.fine}`);
        } else {
          alert('Book returned successfully!');
        }
      } else {
        alert(data.error || 'Failed to return book');
      }
    } catch (error) {
      alert('Failed to return book');
    }
  };

  const handleRenewBook = async (borrowingId: string) => {
    try {
      const response = await fetch(`/api/library/borrowings?id=${borrowingId}&action=renew`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      const data = await response.json();
      if (data.success) {
        fetchBorrowings();
        alert('Book renewed successfully!');
      } else {
        alert(data.error || 'Failed to renew book');
      }
    } catch (error) {
      alert('Failed to renew book');
    }
  };

  const renderBooksView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Book Catalog</h2>
          <p className="text-gray-600">Manage your school library collection</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAddBookModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            📚 Add New Book
          </button>
          <button 
            onClick={() => router.push('/library/reports')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            📊 Generate Report
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                📚
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Total Books</p>
              <p className="text-2xl font-bold text-blue-900">{statistics.totalBooks || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                ✅
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Available</p>
              <p className="text-2xl font-bold text-green-900">{statistics.totalAvailable || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                📖
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-yellow-600">Borrowed</p>
              <p className="text-2xl font-bold text-yellow-900">{statistics.totalBorrowed || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                ⚠️
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-red-600">Overdue</p>
              <p className="text-2xl font-bold text-red-900">{statistics.overdueCount || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Title, author, ISBN..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
            <select
              value={filters.level}
              onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Levels</option>
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              placeholder="Subject name"
              value={filters.subject}
              onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
            <select
              value={filters.availability}
              onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Books</option>
              <option value="available">Available Only</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map(book => (
          <div key={book.id} className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">{book.title}</h3>
                <p className="text-sm text-gray-600">by {book.author}</p>
                <p className="text-xs text-gray-500 mt-1">{book.publisher} ({book.publicationYear})</p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                book.availableCopies > 0
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {book.availableCopies > 0 ? 'Available' : 'Out of Stock'}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">ISBN:</span>
                <span className="font-mono">{book.isbn}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Category:</span>
                <span>{book.category}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Available:</span>
                <span className="font-semibold">{book.availableCopies}/{book.totalCopies}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Location:</span>
                <span>{book.location}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Price:</span>
                <span className="font-semibold">₦{book.price.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setSelectedBook(book);
                  setShowBorrowModal(true);
                }}
                disabled={book.availableCopies === 0}
                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                📖 Borrow
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                📝 Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {books.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
          <p className="text-gray-600">Try adjusting your search filters or add new books to the library.</p>
        </div>
      )}
    </div>
  );

  const renderBorrowingsView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Borrowing Records</h2>
          <p className="text-gray-600">Track book loans and returns</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => router.push('/library/reports')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            📊 Generate Report
          </button>
        </div>
      </div>

      {/* Status Filter */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex space-x-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="borrowed">Borrowed</option>
            <option value="overdue">Overdue</option>
            <option value="returned">Returned</option>
          </select>
          <input
            type="text"
            placeholder="Search by book title, student name, or ISBN..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Borrowings List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fine</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {borrowings.map(borrowing => (
                <tr key={borrowing.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{borrowing.bookTitle}</div>
                      <div className="text-sm text-gray-500">ISBN: {borrowing.bookIsbn}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{borrowing.studentName}</div>
                      <div className="text-sm text-gray-500">{borrowing.studentClass}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div>Borrowed: {new Date(borrowing.borrowDate).toLocaleDateString()}</div>
                      <div>Due: {new Date(borrowing.dueDate).toLocaleDateString()}</div>
                      {borrowing.returnDate && (
                        <div>Returned: {new Date(borrowing.returnDate).toLocaleDateString()}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      borrowing.status === 'borrowed' ? 'bg-blue-100 text-blue-800' :
                      borrowing.status === 'overdue' ? 'bg-red-100 text-red-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {borrowing.status.charAt(0).toUpperCase() + borrowing.status.slice(1)}
                    </span>
                    {borrowing.renewalCount > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        Renewed {borrowing.renewalCount} time(s)
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {borrowing.fineAmount > 0 ? `₦${borrowing.fineAmount}` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {borrowing.status === 'borrowed' && (
                      <>
                        <button
                          onClick={() => handleReturnBook(borrowing.id, 'Good', '')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Return
                        </button>
                        <button
                          onClick={() => handleRenewBook(borrowing.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Renew
                        </button>
                      </>
                    )}
                    {borrowing.status === 'overdue' && (
                      <button
                        onClick={() => handleReturnBook(borrowing.id, 'Good', '')}
                        className="text-red-600 hover:text-red-900"
                      >
                        Return
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {borrowings.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No borrowing records found</h3>
          <p className="text-gray-600">Try adjusting your search filters.</p>
        </div>
      )}
    </div>
  );

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📚 Library Management</h1>
            <p className="text-gray-600">Manage books, track borrowings, and maintain library records</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/library/reports')}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              📊 View Reports
            </button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="bg-white rounded-lg p-1 shadow-sm inline-flex">
          <button
            onClick={() => setSelectedView('books')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              selectedView === 'books'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📚 Books
          </button>
          <button
            onClick={() => setSelectedView('borrowings')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              selectedView === 'borrowings'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📋 Borrowings
          </button>
        </div>

        {/* Content */}
        {selectedView === 'books' ? renderBooksView() : renderBorrowingsView()}

        {/* Add Book Modal */}
        {showAddBookModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Book</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleAddBook({
                  title: formData.get('title'),
                  author: formData.get('author'),
                  isbn: formData.get('isbn'),
                  category: formData.get('category'),
                  publisher: formData.get('publisher'),
                  publicationYear: formData.get('publicationYear'),
                  edition: formData.get('edition'),
                  totalCopies: formData.get('totalCopies'),
                  location: formData.get('location'),
                  language: formData.get('language'),
                  price: formData.get('price'),
                  condition: formData.get('condition'),
                  description: formData.get('description'),
                  subject: formData.get('subject'),
                  level: formData.get('level')
                });
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Book Title</label>
                    <input
                      type="text"
                      name="title"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter book title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                    <input
                      type="text"
                      name="author"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Author name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                    <input
                      type="text"
                      name="isbn"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="978-978-xxx-xxx-x"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      name="category"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Subject name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Publisher</label>
                    <input
                      type="text"
                      name="publisher"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Publisher name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Publication Year</label>
                    <input
                      type="number"
                      name="publicationYear"
                      min="1900"
                      max="2030"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="2024"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Edition</label>
                    <input
                      type="text"
                      name="edition"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="1st Edition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Copies</label>
                    <input
                      type="number"
                      name="totalCopies"
                      required
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Section A - Shelf 1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <select
                      name="language"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="English">English</option>
                      <option value="Hausa">Hausa</option>
                      <option value="Yoruba">Yoruba</option>
                      <option value="Igbo">Igbo</option>
                      <option value="French">French</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₦)</label>
                    <input
                      type="number"
                      name="price"
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="3500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                    <select
                      name="condition"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="New">New</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                    <select
                      name="level"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Both">Both JSS & SS</option>
                      <option value="Junior Secondary">Junior Secondary</option>
                      <option value="Senior Secondary">Senior Secondary</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Brief description of the book"
                    />
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddBookModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Add Book
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Borrow Book Modal */}
        {showBorrowModal && selectedBook && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Borrow Book</h3>
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">{selectedBook.title}</h4>
                <p className="text-sm text-gray-600">by {selectedBook.author}</p>
                <p className="text-sm text-gray-500">Available: {selectedBook.availableCopies} copies</p>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleBorrowBook({
                  studentId: formData.get('studentId'),
                  studentName: formData.get('studentName'),
                  studentClass: formData.get('studentClass'),
                  condition: formData.get('condition'),
                  notes: formData.get('notes')
                });
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                    <input
                      type="text"
                      name="studentId"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="STU001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                    <input
                      type="text"
                      name="studentName"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Student full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                    <select
                      name="studentClass"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Class</option>
                      {classes.map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Book Condition</label>
                    <select
                      name="condition"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      name="notes"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Optional notes"
                    />
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBorrowModal(false);
                      setSelectedBook(null);
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Borrow Book
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
