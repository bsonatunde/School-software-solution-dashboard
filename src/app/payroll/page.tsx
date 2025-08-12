'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  month: string;
  year: number;
  workingDays: number;
  daysWorked: number;
  basicSalary: number;
  allowances: {
    housing: number;
    transport: number;
    meal: number;
    teaching: number;
    overtime: number;
    bonus: number;
  };
  deductions: {
    pension: number;
    tax: number;
    nhis: number;
    absence: number;
    loan: number;
    other: number;
  };
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  status: 'draft' | 'approved' | 'paid';
  processedDate: string;
  paidDate?: string;
  processedBy: string;
}

export default function PayrollPage() {
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [selectedPayrollRecord, setSelectedPayrollRecord] = useState<PayrollRecord | null>(null);
  const [showPayrollModal, setShowPayrollModal] = useState(false);

  const handleViewPayroll = (record: PayrollRecord) => {
    setSelectedPayrollRecord(record);
    setShowPayrollModal(true);
  };

  const fetchPayrollRecords = useCallback(async () => {
    try {
      const response = await fetch(`/api/staff?type=payroll&month=${selectedMonth}&year=${selectedYear}`);
      const data = await response.json();
      if (data.success) {
        setPayrollRecords(data.payroll || []);
      }
    } catch (error) {
      console.error('Error fetching payroll records:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchPayrollRecords();
  }, [fetchPayrollRecords]);

  const processPayroll = async () => {
    setProcessing(true);
    try {
      const response = await fetch('/api/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'process-payroll',
          month: selectedMonth,
          year: selectedYear
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchPayrollRecords();
        setShowProcessModal(false);
        alert('Payroll processed successfully!');
      } else {
        alert('Error processing payroll: ' + data.error);
      }
    } catch (error) {
      console.error('Error processing payroll:', error);
      alert('Error processing payroll');
    } finally {
      setProcessing(false);
    }
  };

  const approvePayroll = async (id: string) => {
    try {
      const response = await fetch(`/api/staff?id=${id}&type=payroll`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'approved' }),
      });

      const data = await response.json();
      if (data.success) {
        fetchPayrollRecords();
      }
    } catch (error) {
      console.error('Error approving payroll:', error);
    }
  };

  const markAsPaid = async (id: string) => {
    try {
      const response = await fetch(`/api/staff?id=${id}&type=payroll`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: 'paid',
          paidDate: new Date().toISOString()
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchPayrollRecords();
      }
    } catch (error) {
      console.error('Error marking as paid:', error);
    }
  };

  // Filter payroll records
  const filteredRecords = payrollRecords.filter(record => {
    const matchesSearch = searchTerm === '' || 
      record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === '' || record.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Export payroll data to CSV
  const exportPayrollData = () => {
    // Check if there are records to export
    if (!filteredRecords || filteredRecords.length === 0) {
      alert('No payroll records to export. Please process payroll first or adjust your filters.');
      return;
    }

    const csvData = filteredRecords.map(record => ({
      'Employee ID': record.employeeId,
      'Employee Name': record.employeeName,
      'Department': record.department,
      'Position': record.position,
      'Month': record.month,
      'Year': record.year,
      'Working Days': record.workingDays,
      'Days Worked': record.daysWorked,
      'Basic Salary': `₦${record.basicSalary.toLocaleString()}`,
      'Gross Salary': `₦${record.grossSalary.toLocaleString()}`,
      'Total Deductions': `₦${record.totalDeductions.toLocaleString()}`,
      'Net Salary': `₦${record.netSalary.toLocaleString()}`,
      'Status': record.status.charAt(0).toUpperCase() + record.status.slice(1),
      'Processed Date': record.processedDate,
      'Paid Date': record.paidDate || 'Not Paid'
    }));

    // Double check that we have data after mapping
    if (csvData.length === 0) {
      alert('No valid payroll data to export.');
      return;
    }

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payroll-${selectedMonth}-${selectedYear}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    // Show success message
    alert(`Payroll data exported successfully for ${selectedMonth}/${selectedYear}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const totalGrossSalary = filteredRecords.reduce((sum, record) => sum + record.grossSalary, 0);
  const totalDeductions = filteredRecords.reduce((sum, record) => sum + record.totalDeductions, 0);
  const totalNetSalary = filteredRecords.reduce((sum, record) => sum + record.netSalary, 0);

  if (loading) {
    return (
      <DashboardLayout userRole="admin">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">💰 Payroll Management</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage staff payroll and salary payments
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={() => setShowProcessModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              ⚙️ Process Payroll
            </button>
            <button 
              onClick={exportPayrollData}
              disabled={filteredRecords.length === 0}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filteredRecords.length === 0 
                  ? 'bg-gray-400 cursor-not-allowed text-gray-200' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
              title={filteredRecords.length === 0 ? 'No payroll records to export' : 'Export payroll data to CSV'}
            >
              📊 Export Report
            </button>
          </div>
        </div>

        {/* Period Selector */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {months.map((month, index) => (
                    <option key={month} value={index + 1}>{month}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[2024, 2025, 2026].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-600">Payroll for</p>
              <p className="text-lg font-semibold text-gray-900">
                {months[selectedMonth - 1]} {selectedYear}
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{filteredRecords.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <span className="text-2xl">💵</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Gross Payroll</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalGrossSalary)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <span className="text-2xl">➖</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Deductions</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalDeductions)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Net Payroll</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalNetSalary)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="Search by name, employee ID, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="draft">Draft</option>
                <option value="approved">Approved</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payroll Table */}
        {filteredRecords.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No payroll records found</h3>
            <p className="text-gray-600 mb-6">Process payroll for this period to generate salary records.</p>
            <button
              onClick={() => setShowProcessModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ⚙️ Process Payroll
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Days Worked
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gross Salary
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deductions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Net Salary
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{record.employeeName}</div>
                          <div className="text-sm text-gray-500">{record.employeeId}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{record.department}</div>
                        <div className="text-sm text-gray-500">{record.position}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.daysWorked}/{record.workingDays}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {formatCurrency(record.grossSalary)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        -{formatCurrency(record.totalDeductions)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold">
                        {formatCurrency(record.netSalary)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {record.status === 'draft' && (
                            <button
                              onClick={() => approvePayroll(record.id)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              ✓ Approve
                            </button>
                          )}
                          {record.status === 'approved' && (
                            <button
                              onClick={() => markAsPaid(record.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              💰 Mark Paid
                            </button>
                          )}
                          <button 
                            onClick={() => handleViewPayroll(record)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            👁️ View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Payroll Details Modal */}
      {showPayrollModal && selectedPayrollRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">💰 Payroll Details</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedPayrollRecord.employeeName} - {selectedPayrollRecord.month} {selectedPayrollRecord.year}
                  </p>
                </div>
                <button
                  onClick={() => setShowPayrollModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Employee Information */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">👤 Employee Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-blue-700">Employee ID</label>
                    <p className="text-gray-900 font-semibold">{selectedPayrollRecord.employeeId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-blue-700">Full Name</label>
                    <p className="text-gray-900 font-semibold">{selectedPayrollRecord.employeeName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-blue-700">Department</label>
                    <p className="text-gray-900">{selectedPayrollRecord.department}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-blue-700">Position</label>
                    <p className="text-gray-900">{selectedPayrollRecord.position}</p>
                  </div>
                </div>
              </div>

              {/* Attendance & Work Details */}
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-4">📅 Work Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-green-700">Working Days</label>
                    <p className="text-2xl font-bold text-green-900">{selectedPayrollRecord.workingDays}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-green-700">Days Worked</label>
                    <p className="text-2xl font-bold text-green-900">{selectedPayrollRecord.daysWorked}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-green-700">Attendance Rate</label>
                    <p className="text-2xl font-bold text-green-900">
                      {Math.round((selectedPayrollRecord.daysWorked / selectedPayrollRecord.workingDays) * 100)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Salary Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Earnings */}
                <div className="bg-emerald-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-emerald-900 mb-4">💰 Earnings</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-emerald-200">
                      <span className="text-emerald-700">Basic Salary</span>
                      <span className="font-semibold text-emerald-900">{formatCurrency(selectedPayrollRecord.basicSalary)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-emerald-200">
                      <span className="text-emerald-700">Housing Allowance</span>
                      <span className="font-semibold text-emerald-900">{formatCurrency(selectedPayrollRecord.allowances.housing)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-emerald-200">
                      <span className="text-emerald-700">Transport Allowance</span>
                      <span className="font-semibold text-emerald-900">{formatCurrency(selectedPayrollRecord.allowances.transport)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-emerald-200">
                      <span className="text-emerald-700">Meal Allowance</span>
                      <span className="font-semibold text-emerald-900">{formatCurrency(selectedPayrollRecord.allowances.meal)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-emerald-200">
                      <span className="text-emerald-700">Teaching Allowance</span>
                      <span className="font-semibold text-emerald-900">{formatCurrency(selectedPayrollRecord.allowances.teaching)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-emerald-200">
                      <span className="text-emerald-700">Overtime</span>
                      <span className="font-semibold text-emerald-900">{formatCurrency(selectedPayrollRecord.allowances.overtime)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-emerald-200">
                      <span className="text-emerald-700">Bonus</span>
                      <span className="font-semibold text-emerald-900">{formatCurrency(selectedPayrollRecord.allowances.bonus)}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 bg-emerald-100 rounded-lg px-3 mt-4">
                      <span className="font-bold text-emerald-900">Gross Salary</span>
                      <span className="font-bold text-xl text-emerald-900">{formatCurrency(selectedPayrollRecord.grossSalary)}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div className="bg-red-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-red-900 mb-4">📉 Deductions</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-red-200">
                      <span className="text-red-700">Pension (8%)</span>
                      <span className="font-semibold text-red-900">-{formatCurrency(selectedPayrollRecord.deductions.pension)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-red-200">
                      <span className="text-red-700">Income Tax</span>
                      <span className="font-semibold text-red-900">-{formatCurrency(selectedPayrollRecord.deductions.tax)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-red-200">
                      <span className="text-red-700">NHIS (1.75%)</span>
                      <span className="font-semibold text-red-900">-{formatCurrency(selectedPayrollRecord.deductions.nhis)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-red-200">
                      <span className="text-red-700">Absence Deduction</span>
                      <span className="font-semibold text-red-900">-{formatCurrency(selectedPayrollRecord.deductions.absence)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-red-200">
                      <span className="text-red-700">Loan Deduction</span>
                      <span className="font-semibold text-red-900">-{formatCurrency(selectedPayrollRecord.deductions.loan)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-red-200">
                      <span className="text-red-700">Other Deductions</span>
                      <span className="font-semibold text-red-900">-{formatCurrency(selectedPayrollRecord.deductions.other)}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 bg-red-100 rounded-lg px-3 mt-4">
                      <span className="font-bold text-red-900">Total Deductions</span>
                      <span className="font-bold text-xl text-red-900">-{formatCurrency(selectedPayrollRecord.totalDeductions)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Salary */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">💼 Net Salary</h3>
                  <p className="text-4xl font-bold mb-4">{formatCurrency(selectedPayrollRecord.netSalary)}</p>
                  <div className="flex justify-center items-center space-x-4 text-sm opacity-90">
                    <span>Status: <span className="font-semibold capitalize">{selectedPayrollRecord.status}</span></span>
                    <span>•</span>
                    <span>Processed: {selectedPayrollRecord.processedDate}</span>
                    {selectedPayrollRecord.paidDate && (
                      <>
                        <span>•</span>
                        <span>Paid: {selectedPayrollRecord.paidDate}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => setShowPayrollModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  📄 Generate Payslip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Process Payroll Modal */}
      {showProcessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Process Payroll</h2>
              <button
                onClick={() => setShowProcessModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                This will process payroll for all active staff members for:
              </p>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="font-semibold text-blue-900">
                  {months[selectedMonth - 1]} {selectedYear}
                </p>
                <p className="text-sm text-blue-700">
                  This action will calculate salaries, allowances, and deductions for all staff.
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowProcessModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={processPayroll}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {processing && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                <span>{processing ? 'Processing...' : '⚙️ Process'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
