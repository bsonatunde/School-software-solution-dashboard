'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ReportData {
  [key: string]: any;
}

export default function FeeReportsPage() {
  const [activeReport, setActiveReport] = useState('overview');
  const [reportData, setReportData] = useState<ReportData>({});
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    term: '1st Term',
    session: '2024/2025',
    class: ''
  });

  const reports = [
    { id: 'overview', name: 'Fee Overview', icon: '📊' },
    { id: 'collection', name: 'Collection Analysis', icon: '💰' },
    { id: 'outstanding', name: 'Outstanding Fees', icon: '⏰' },
    { id: 'class-analysis', name: 'Class Analysis', icon: '🏫' },
    { id: 'payment-trends', name: 'Payment Trends', icon: '📈' },
    { id: 'defaulters', name: 'Defaulters Report', icon: '⚠️' }
  ];

  const classes = ['', 'JSS 1A', 'JSS 2B', 'JSS 3A', 'SS 1A', 'SS 2A', 'SS 3A'];
  const terms = ['1st Term', '2nd Term', '3rd Term'];
  const sessions = ['2024/2025', '2023/2024', '2022/2023'];

  useEffect(() => {
    fetchReportData();
  }, [activeReport, filters]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        type: activeReport,
        term: filters.term,
        session: filters.session,
        ...(filters.class && { class: filters.class })
      });

      const response = await fetch(`/api/fees/reports?${params}`);
      const result = await response.json();

      if (result.success) {
        setReportData({ [activeReport]: result.data });
      } else {
        console.error('Failed to fetch report data:', result.error);
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return `₦${amount.toLocaleString()}`;
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const exportReport = () => {
    const dataStr = JSON.stringify(reportData[activeReport], null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeReport}-report-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
  };

  const renderOverviewReport = (data: any) => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expected</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.summary.totalExpected)}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Collected</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(data.summary.totalCollected)}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Outstanding</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(data.summary.totalOutstanding)}</p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏰</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Collection Rate</p>
              <p className="text-2xl font-bold text-blue-600">{formatPercentage(data.summary.collectionRate)}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Status Distribution</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Complete Payments</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ 
                      width: `${(data.summary.completePayments / (data.summary.completePayments + data.summary.partialPayments + data.summary.pendingPayments)) * 100}%` 
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{data.summary.completePayments}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Partial Payments</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ 
                      width: `${(data.summary.partialPayments / (data.summary.completePayments + data.summary.partialPayments + data.summary.pendingPayments)) * 100}%` 
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{data.summary.partialPayments}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Pending Payments</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ 
                      width: `${(data.summary.pendingPayments / (data.summary.completePayments + data.summary.partialPayments + data.summary.pendingPayments)) * 100}%` 
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{data.summary.pendingPayments}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fee Category Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(data.categoryBreakdown).map(([category, stats]: [string, any]) => (
              <div key={category} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">{category}</p>
                  <p className="text-sm text-gray-500">
                    {formatCurrency(stats.collected)} / {formatCurrency(stats.expected)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatPercentage((stats.collected / stats.expected) * 100)}
                  </p>
                  <p className="text-xs text-red-500">
                    Outstanding: {formatCurrency(stats.outstanding)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Payments</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.recentPayments.map((payment: any, index: number) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(payment.paymentDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.studentName || `Student ${payment.studentId}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.class}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(payment.amountPaid)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      payment.status === 'Complete' 
                        ? 'bg-green-100 text-green-800'
                        : payment.status === 'Partial'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCollectionReport = (data: any) => (
    <div className="space-y-6">
      {/* Collection Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Collected</h3>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(data.totalCollected)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Average Payment</h3>
          <p className="text-3xl font-bold text-blue-600">{formatCurrency(data.averagePayment)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Transactions</h3>
          <p className="text-3xl font-bold text-gray-900">{data.dailyCollections.length}</p>
        </div>
      </div>

      {/* Payment Methods Breakdown */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.paymentMethods.map((method: any, index: number) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{method.method}</span>
                <span className="text-sm text-gray-500">{method.count} transactions</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(method.amount)}</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ 
                    width: `${(method.amount / data.totalCollected) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Collections Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Collections</h3>
        <div className="space-y-3">
          {data.dailyCollections.slice(-10).map((day: any, index: number) => (
            <div key={index} className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">{new Date(day.date).toLocaleDateString()}</span>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ 
                      width: `${(day.amount / Math.max(...data.dailyCollections.map((d: any) => d.amount))) * 100}%` 
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-20 text-right">
                  {formatCurrency(day.amount)}
                </span>
                <span className="text-xs text-gray-500 w-16 text-right">
                  {day.count} payments
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOutstandingReport = (data: any) => (
    <div className="space-y-6">
      {/* Outstanding Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Outstanding</h3>
          <p className="text-3xl font-bold text-red-600">{formatCurrency(data.summary.totalOutstanding)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Students with Outstanding</h3>
          <p className="text-3xl font-bold text-orange-600">{data.summary.studentsWithOutstanding}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Average Outstanding</h3>
          <p className="text-3xl font-bold text-gray-600">{formatCurrency(data.summary.averageOutstanding)}</p>
        </div>
      </div>

      {/* Top Defaulters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Students with Outstanding Fees</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outstanding</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.outstandingByStudent.slice(0, 10).map((student: any, index: number) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.student.class}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(student.totalExpected)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    {formatCurrency(student.totalPaid)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                    {formatCurrency(student.outstanding)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      student.paymentStatus === 'Complete' 
                        ? 'bg-green-100 text-green-800'
                        : student.paymentStatus === 'Partial'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {student.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Outstanding by Fee Type */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Outstanding by Fee Type</h3>
        <div className="space-y-3">
          {data.outstandingByFee.map((fee: any, index: number) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div>
                <p className="font-medium text-gray-900">{fee.name}</p>
                <p className="text-sm text-gray-500">{fee.category} • {fee.class}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-red-600">{formatCurrency(fee.outstanding)}</p>
                <p className="text-sm text-gray-500">{fee.studentsOwing} students owing</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDefaultReport = () => (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">📊</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Report</h3>
      <p className="text-gray-500">Choose a report type from the tabs above to view detailed analytics.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📊 Fee Reports & Analytics</h1>
              <p className="text-gray-600 mt-1">Comprehensive fee collection analysis and insights</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={exportReport}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                📥 Export
              </button>
              <button
                onClick={printReport}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                🖨️ Print
              </button>
              <Link
                href="/fees"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                ← Back to Fees
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Academic Session</label>
              <select
                value={filters.session}
                onChange={(e) => setFilters({ ...filters, session: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sessions.map(session => (
                  <option key={session} value={session}>{session}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Term</label>
              <select
                value={filters.term}
                onChange={(e) => setFilters({ ...filters, term: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {terms.map(term => (
                  <option key={term} value={term}>{term}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Class (Optional)</label>
              <select
                value={filters.class}
                onChange={(e) => setFilters({ ...filters, class: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Classes</option>
                {classes.filter(c => c).map(className => (
                  <option key={className} value={className}>{className}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Report Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {reports.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setActiveReport(report.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeReport === report.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span>{report.icon}</span>
                    <span>{report.name}</span>
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Report Content */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-500">Loading report data...</p>
              </div>
            ) : reportData[activeReport] ? (
              <>
                {activeReport === 'overview' && renderOverviewReport(reportData[activeReport])}
                {activeReport === 'collection' && renderCollectionReport(reportData[activeReport])}
                {activeReport === 'outstanding' && renderOutstandingReport(reportData[activeReport])}
                {(activeReport === 'class-analysis' || activeReport === 'payment-trends' || activeReport === 'defaulters') && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🚧</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Report Under Development</h3>
                    <p className="text-gray-500">This report type is being developed and will be available soon.</p>
                  </div>
                )}
              </>
            ) : (
              renderDefaultReport()
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
