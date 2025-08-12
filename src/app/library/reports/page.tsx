'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';

interface LibraryStats {
  totalBooks: number;
  totalAvailable: number;
  totalBorrowed: number;
  overdueCount: number;
  totalFines: number;
  activeBorrowings: number;
  returnedBorrowings: number;
  averageRenewalCount: number;
}

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  price: number;
}

interface Borrowing {
  id: string;
  bookTitle: string;
  studentName: string;
  studentClass: string;
  borrowDate: string;
  dueDate: string;
  status: string;
  fineAmount: number;
}

export default function LibraryReportsPage() {
  const [stats, setStats] = useState<LibraryStats>({
    totalBooks: 0,
    totalAvailable: 0,
    totalBorrowed: 0,
    overdueCount: 0,
    totalFines: 0,
    activeBorrowings: 0,
    returnedBorrowings: 0,
    averageRenewalCount: 0
  });
  const [books, setBooks] = useState<Book[]>([]);
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState('overview');
  const router = useRouter();

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // Fetch books data
      const booksResponse = await fetch('/api/library/books');
      const booksData = await booksResponse.json();
      
      // Fetch borrowings data
      const borrowingsResponse = await fetch('/api/library/borrowings');
      const borrowingsData = await borrowingsResponse.json();

      if (booksData.success && borrowingsData.success) {
        setBooks(booksData.books);
        setBorrowings(borrowingsData.borrowings);
        setStats({
          totalBooks: booksData.totalBooks,
          totalAvailable: booksData.totalAvailable,
          totalBorrowed: booksData.totalBorrowed,
          overdueCount: booksData.overdueCount,
          ...borrowingsData.statistics
        });
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryDistribution = () => {
    const categoryCount: { [key: string]: number } = {};
    books.forEach(book => {
      categoryCount[book.category] = (categoryCount[book.category] || 0) + 1;
    });
    return Object.entries(categoryCount).map(([category, count]) => ({
      category,
      count,
      percentage: ((count / books.length) * 100).toFixed(1)
    }));
  };

  const getMostBorrowedBooks = () => {
    const bookBorrowCount: { [key: string]: { title: string; count: number } } = {};
    borrowings.forEach(borrowing => {
      if (!bookBorrowCount[borrowing.bookTitle]) {
        bookBorrowCount[borrowing.bookTitle] = { title: borrowing.bookTitle, count: 0 };
      }
      bookBorrowCount[borrowing.bookTitle].count++;
    });
    
    return Object.values(bookBorrowCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  const getClassBorrowingActivity = () => {
    const classBorrowCount: { [key: string]: number } = {};
    borrowings.forEach(borrowing => {
      classBorrowCount[borrowing.studentClass] = (classBorrowCount[borrowing.studentClass] || 0) + 1;
    });
    
    return Object.entries(classBorrowCount)
      .map(([className, count]) => ({ className, count }))
      .sort((a, b) => b.count - a.count);
  };

  const getOverdueAnalysis = () => {
    const overdueBooks = borrowings.filter(b => b.status === 'overdue');
    const totalFines = overdueBooks.reduce((sum, b) => sum + b.fineAmount, 0);
    
    return {
      count: overdueBooks.length,
      totalFines,
      averageFine: overdueBooks.length > 0 ? totalFines / overdueBooks.length : 0,
      books: overdueBooks.slice(0, 10)
    };
  };

  const getInventoryAnalysis = () => {
    const totalValue = books.reduce((sum, book) => sum + (book.price * book.totalCopies), 0);
    const availableValue = books.reduce((sum, book) => sum + (book.price * book.availableCopies), 0);
    const borrowedValue = totalValue - availableValue;
    
    const lowStockBooks = books.filter(book => book.availableCopies <= 2 && book.availableCopies > 0);
    const outOfStockBooks = books.filter(book => book.availableCopies === 0);
    
    return {
      totalValue,
      availableValue,
      borrowedValue,
      lowStockBooks,
      outOfStockBooks,
      utilizationRate: ((totalValue - availableValue) / totalValue * 100).toFixed(1)
    };
  };

  const renderOverviewReport = () => {
    const categoryDistribution = getCategoryDistribution();
    const mostBorrowedBooks = getMostBorrowedBooks();
    const classBorrowingActivity = getClassBorrowingActivity();

    return (
      <div className="space-y-6">
        {/* Key Statistics */}
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
                <p className="text-2xl font-bold text-blue-900">{stats.totalBooks}</p>
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
                <p className="text-2xl font-bold text-green-900">{stats.totalAvailable}</p>
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
                <p className="text-2xl font-bold text-yellow-900">{stats.activeBorrowings}</p>
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
                <p className="text-2xl font-bold text-red-900">{stats.overdueCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Category Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              {categoryDistribution.map(item => (
                <div key={item.category} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{item.category}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{item.count} books</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Quick Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Categories:</span>
                  <span className="font-semibold">{categoryDistribution.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg. books per category:</span>
                  <span className="font-semibold">
                    {(stats.totalBooks / categoryDistribution.length).toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Most popular:</span>
                  <span className="font-semibold">
                    {categoryDistribution[0]?.category || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Most Borrowed Books */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📖 Most Borrowed Books</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Rank</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Book Title</th>
                  <th className="text-right py-2 text-sm font-medium text-gray-600">Times Borrowed</th>
                </tr>
              </thead>
              <tbody>
                {mostBorrowedBooks.map((book, index) => (
                  <tr key={book.title} className="border-b border-gray-100">
                    <td className="py-2 text-sm text-gray-900">#{index + 1}</td>
                    <td className="py-2 text-sm text-gray-900">{book.title}</td>
                    <td className="py-2 text-sm text-gray-900 text-right font-semibold">
                      {book.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Class Borrowing Activity */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🎓 Class Borrowing Activity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classBorrowingActivity.map(item => (
              <div key={item.className} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">{item.className}</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-semibold">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderInventoryReport = () => {
    const inventoryAnalysis = getInventoryAnalysis();

    return (
      <div className="space-y-6">
        {/* Inventory Value Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  💰
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-green-600">Total Value</p>
                <p className="text-2xl font-bold text-green-900">
                  ₦{inventoryAnalysis.totalValue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  📚
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-600">Available Value</p>
                <p className="text-2xl font-bold text-blue-900">
                  ₦{inventoryAnalysis.availableValue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  📊
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-600">Utilization Rate</p>
                <p className="text-2xl font-bold text-purple-900">
                  {inventoryAnalysis.utilizationRate}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Low Stock Books */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">⚠️ Low Stock Alert</h3>
            {inventoryAnalysis.lowStockBooks.length > 0 ? (
              <div className="space-y-3">
                {inventoryAnalysis.lowStockBooks.map(book => (
                  <div key={book.id} className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{book.title}</div>
                      <div className="text-sm text-gray-600">by {book.author}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-yellow-800">
                        {book.availableCopies} left
                      </div>
                      <div className="text-xs text-gray-500">
                        of {book.totalCopies} total
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No low stock items</p>
            )}
          </div>

          {/* Out of Stock Books */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🚫 Out of Stock</h3>
            {inventoryAnalysis.outOfStockBooks.length > 0 ? (
              <div className="space-y-3">
                {inventoryAnalysis.outOfStockBooks.map(book => (
                  <div key={book.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{book.title}</div>
                      <div className="text-sm text-gray-600">by {book.author}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-red-800">
                        0 available
                      </div>
                      <div className="text-xs text-gray-500">
                        {book.totalCopies} total copies
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No out of stock items</p>
            )}
          </div>
        </div>

        {/* Inventory Summary */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Inventory Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{books.length}</div>
              <div className="text-sm text-gray-600">Total Titles</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {books.reduce((sum, book) => sum + book.totalCopies, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Copies</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {inventoryAnalysis.lowStockBooks.length}
              </div>
              <div className="text-sm text-gray-600">Low Stock Items</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {inventoryAnalysis.outOfStockBooks.length}
              </div>
              <div className="text-sm text-gray-600">Out of Stock</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderOverdueReport = () => {
    const overdueAnalysis = getOverdueAnalysis();

    return (
      <div className="space-y-6">
        {/* Overdue Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-red-50 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  ⚠️
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-red-600">Overdue Books</p>
                <p className="text-2xl font-bold text-red-900">{overdueAnalysis.count}</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  💸
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-orange-600">Total Fines</p>
                <p className="text-2xl font-bold text-orange-900">
                  ₦{overdueAnalysis.totalFines.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  📊
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-yellow-600">Average Fine</p>
                <p className="text-2xl font-bold text-yellow-900">
                  ₦{overdueAnalysis.averageFine.toFixed(0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Overdue Books List */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Overdue Books</h3>
          {overdueAnalysis.books.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-sm font-medium text-gray-600">Book Title</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-600">Student</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-600">Class</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-600">Due Date</th>
                    <th className="text-right py-2 text-sm font-medium text-gray-600">Fine Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {overdueAnalysis.books.map(borrowing => (
                    <tr key={borrowing.id} className="border-b border-gray-100">
                      <td className="py-3 text-sm text-gray-900">{borrowing.bookTitle}</td>
                      <td className="py-3 text-sm text-gray-900">{borrowing.studentName}</td>
                      <td className="py-3 text-sm text-gray-600">{borrowing.studentClass}</td>
                      <td className="py-3 text-sm text-gray-600">
                        {new Date(borrowing.dueDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-sm text-red-600 text-right font-semibold">
                        ₦{borrowing.fineAmount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-2">✅</div>
              <p className="text-gray-500">No overdue books! Great job!</p>
            </div>
          )}
        </div>

        {/* Fine Collection Summary */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Fine Collection Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Outstanding Fines:</span>
                <span className="font-semibold text-red-600">
                  ₦{overdueAnalysis.totalFines.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Fine per Book:</span>
                <span className="font-semibold">
                  ₦{overdueAnalysis.averageFine.toFixed(0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Overdue Books:</span>
                <span className="font-semibold">{overdueAnalysis.count}</span>
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="font-medium text-red-800 mb-2">Collection Actions Needed</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Send overdue notices to students</li>
                <li>• Follow up with class teachers</li>
                <li>• Contact parents for high fine amounts</li>
                <li>• Consider temporary borrowing restrictions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📊 Library Reports</h1>
            <p className="text-gray-600">Comprehensive analysis of library operations and performance</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/library')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Back to Library
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              📄 Export Report
            </button>
          </div>
        </div>

        {/* Report Type Selector */}
        <div className="bg-white rounded-lg p-1 shadow-sm inline-flex">
          <button
            onClick={() => setSelectedReport('overview')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              selectedReport === 'overview'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📈 Overview
          </button>
          <button
            onClick={() => setSelectedReport('inventory')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              selectedReport === 'inventory'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📦 Inventory
          </button>
          <button
            onClick={() => setSelectedReport('overdue')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              selectedReport === 'overdue'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ⚠️ Overdue Analysis
          </button>
        </div>

        {/* Report Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading report data...</span>
          </div>
        ) : (
          <>
            {selectedReport === 'overview' && renderOverviewReport()}
            {selectedReport === 'inventory' && renderInventoryReport()}
            {selectedReport === 'overdue' && renderOverdueReport()}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
