'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';

interface FeeStructure {
  id: string;
  name: string;
  category: string;
  amount: number;
  class: string;
  term: string;
  session: string;
  dueDate: string;
  description: string;
  mandatory: boolean;
}

interface StudentPayment {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  feeId: string;
  feeName: string;
  amount: number;
  amountPaid: number;
  balance: number;
  status: 'Paid' | 'Partial' | 'Outstanding' | 'Overdue';
  paymentDate?: string;
  dueDate: string;
  paymentMethod?: string;
  receiptNumber?: string;
}

export default function FeesPage() {
  const [activeTab, setActiveTab] = useState<'structure' | 'payments' | 'outstanding'>('structure');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('1st Term');
  const [selectedSession, setSelectedSession] = useState('2024/2025');
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [studentPayments, setStudentPayments] = useState<StudentPayment[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddFeeModal, setShowAddFeeModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<StudentPayment | null>(null);
  const router = useRouter();

  const classes = [
    'All Classes', 'JSS 1A', 'JSS 1B', 'JSS 2A', 'JSS 2B', 'JSS 3A', 'JSS 3B',
    'SS 1A', 'SS 1B', 'SS 2A', 'SS 2B', 'SS 3A', 'SS 3B'
  ];

  const terms = ['1st Term', '2nd Term', '3rd Term'];
  const sessions = ['2024/2025', '2023/2024', '2022/2023'];

  const feeCategories = [
    'Tuition', 'Development', 'Sports', 'Library', 'Laboratory', 
    'Computer', 'Transport', 'Boarding', 'Examination', 'Miscellaneous'
  ];

  useEffect(() => {
    fetchFeeStructures();
    fetchStudentPayments();
  }, [selectedClass, selectedTerm, selectedSession]);

  const fetchFeeStructures = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/fees/structure?term=${selectedTerm}&session=${selectedSession}&class=${selectedClass}`);
      const data = await response.json();
      
      if (data.success) {
        setFeeStructures(data.data);
      }
    } catch (error) {
      console.error('Error fetching fee structures:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentPayments = async () => {
    try {
      const response = await fetch(`/api/fees/payments?term=${selectedTerm}&session=${selectedSession}&class=${selectedClass}`);
      const data = await response.json();
      
      if (data.success) {
        setStudentPayments(data.data);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Partial': return 'bg-yellow-100 text-yellow-800';
      case 'Outstanding': return 'bg-blue-100 text-blue-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTotalFees = (): number => {
    return feeStructures.reduce((total, fee) => total + fee.amount, 0);
  };

  const getTotalPaid = (): number => {
    return studentPayments.reduce((total, payment) => total + payment.amountPaid, 0);
  };

  const getTotalOutstanding = (): number => {
    return studentPayments.reduce((total, payment) => total + payment.balance, 0);
  };

  const getOutstandingPayments = () => {
    return studentPayments.filter(payment => payment.status === 'Outstanding' || payment.status === 'Overdue');
  };

  const handleRecordPayment = (payment: StudentPayment) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fee Management</h1>
            <p className="text-gray-600">Manage school fees, payments, and financial tracking</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => router.push('/fees/reports')}
              className="bg-secondary-600 text-white px-4 py-2 rounded-lg hover:bg-secondary-700 transition-colors"
            >
              📊 Financial Reports
            </button>
            <button
              onClick={() => setShowAddFeeModal(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              ➕ Add Fee Item
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Academic Session</label>
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {sessions.map(session => (
                  <option key={session} value={session}>{session}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Term</label>
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {terms.map(term => (
                  <option key={term} value={term}>{term}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <div className="grid grid-cols-3 gap-1 w-full">
                <button
                  onClick={() => setActiveTab('structure')}
                  className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                    activeTab === 'structure' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Structure
                </button>
                <button
                  onClick={() => setActiveTab('payments')}
                  className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                    activeTab === 'payments' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Payments
                </button>
                <button
                  onClick={() => setActiveTab('outstanding')}
                  className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                    activeTab === 'outstanding' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Outstanding
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Total Fees</div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(getTotalFees())}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Total Collected</div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(getTotalPaid())}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Outstanding</div>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(getTotalOutstanding())}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">📈</span>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Collection Rate</div>
                <div className="text-2xl font-bold text-blue-600">
                  {getTotalFees() > 0 ? Math.round((getTotalPaid() / getTotalFees()) * 100) : 0}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'structure' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Fee Structure - {selectedTerm} {selectedSession}
              </h3>
            </div>
            
            {loading ? (
              <div className="p-6">
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            ) : feeStructures.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee Item</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {feeStructures.map((fee) => (
                      <tr key={fee.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{fee.name}</div>
                          <div className="text-sm text-gray-500">{fee.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {fee.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {fee.class}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(fee.amount)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(fee.dueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            fee.mandatory ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {fee.mandatory ? 'Mandatory' : 'Optional'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-primary-600 hover:text-primary-900">Edit</button>
                            <button className="text-red-600 hover:text-red-900">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">💰</span>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No fee structure found</h3>
                <p className="text-gray-500 mb-4">
                  Create fee items for {selectedClass} - {selectedTerm} {selectedSession}.
                </p>
                <button
                  onClick={() => setShowAddFeeModal(true)}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Add First Fee Item
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Payment Records - {selectedTerm} {selectedSession}
              </h3>
            </div>
            
            {studentPayments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee Item</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {studentPayments.slice(0, 20).map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                                <span className="text-xs font-medium text-primary-700">
                                  {payment.studentName.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{payment.studentName}</div>
                              <div className="text-sm text-gray-500">{payment.class}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.feeName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                          {formatCurrency(payment.amountPaid)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                          {formatCurrency(payment.balance)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {payment.balance > 0 && (
                              <button
                                onClick={() => handleRecordPayment(payment)}
                                className="text-green-600 hover:text-green-900"
                              >
                                Record Payment
                              </button>
                            )}
                            <button className="text-primary-600 hover:text-primary-900">View Receipt</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">💳</span>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No payment records</h3>
                <p className="text-gray-500">
                  Payment records will appear here once students make payments.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'outstanding' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Outstanding Payments ({getOutstandingPayments().length} students)
              </h3>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm">
                📧 Send Reminders
              </button>
            </div>
            
            {getOutstandingPayments().length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee Item</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Due</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Overdue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getOutstandingPayments().map((payment) => {
                      const daysOverdue = Math.floor((new Date().getTime() - new Date(payment.dueDate).getTime()) / (1000 * 3600 * 24));
                      return (
                        <tr key={payment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8">
                                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                                  <span className="text-xs font-medium text-red-700">
                                    {payment.studentName.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{payment.studentName}</div>
                                <div className="text-sm text-gray-500">{payment.class}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {payment.feeName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                            {formatCurrency(payment.balance)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(payment.dueDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm font-medium ${daysOverdue > 0 ? 'text-red-600' : 'text-yellow-600'}`}>
                              {daysOverdue > 0 ? `${daysOverdue} days` : 'Due today'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleRecordPayment(payment)}
                                className="text-green-600 hover:text-green-900"
                              >
                                Record Payment
                              </button>
                              <button className="text-blue-600 hover:text-blue-900">Send Reminder</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">✅</span>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No outstanding payments</h3>
                <p className="text-gray-500">
                  All students have paid their fees for this term. Great job!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
