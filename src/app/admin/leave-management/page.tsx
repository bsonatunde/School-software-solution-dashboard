'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface LeaveRequest {
  id: string;
  employeeId: string;
  staffId: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  remarks?: string;
  staffName?: string;
  department?: string;
}

interface StaffLeaveBalance {
  staffId: string;
  staffName: string;
  department: string;
  employeeId: string;
  totalLeaveEntitlement: number;
  usedLeave: number;
  pendingLeave: number;
  remainingLeave: number;
  year: number;
  leaveHistory: {
    approved: number;
    rejected: number;
    pending: number;
  };
  leaveBreakdown: {
    approvedDays: number;
    pendingDays: number;
    rejectedDays: number;
  };
}

interface LeaveBalanceSummary {
  totalStaff: number;
  staffWithLowBalance: number;
  staffWithExceededQuota: number;
  totalLeaveUsed: number;
  totalPendingLeave: number;
  averageRemainingLeave: number;
  year: number;
}

export default function LeaveManagementPage() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [staffBalances, setStaffBalances] = useState<StaffLeaveBalance[]>([]);
  const [balanceSummary, setBalanceSummary] = useState<LeaveBalanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [activeTab, setActiveTab] = useState<'requests' | 'balances'>('requests');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');

  useEffect(() => {
    fetchLeaveRequests();
    fetchStaffBalances();
  }, []);

  const fetchStaffBalances = async () => {
    try {
      const timestamp = new Date().getTime();
      const random = Math.random().toString(36).substring(7);
      const currentYear = new Date().getFullYear();
      const response = await fetch(`/api/staff/leave-balances?year=${currentYear}&t=${timestamp}&r=${random}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      const data = await response.json();

      if (data.success) {
        setStaffBalances(data.data);
        setBalanceSummary(data.summary);
        console.log('Leave balances summary:', data.summary);
      } else {
        console.error('Error fetching leave balances:', data.error);
      }
    } catch (error) {
      console.error('Error fetching staff balances:', error);
    }
  };

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      // Force cache bust with timestamp and random component
      const timestamp = new Date().getTime();
      const random = Math.random().toString(36).substring(7);
      const response = await fetch(`/api/leave?t=${timestamp}&r=${random}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      const data = await response.json();
      
      console.log('Frontend - Received leave data:', data);
      
      if (data.success) {
        console.log('Frontend - Leave IDs received:', data.data.map((r: any) => r.id));
        
        // Validate and filter out any corrupt data
        const validLeaveData = data.data.filter((request: any) => {
          const isValid = request.id && 
                          typeof request.id === 'string' && 
                          request.id.length === 24 &&
                          request.staffId &&
                          request.employeeId &&
                          request.type &&
                          request.status;
          
          if (!isValid) {
            console.warn('Frontend - Invalid leave data detected:', request);
          }
          
          return isValid;
        });

        console.log('Frontend - Valid leave requests after filtering:', validLeaveData.length);
        
        // Clear any existing data first
        setLeaveRequests([]);
        
        // Fetch staff details for each valid leave request
        const requestsWithStaffInfo = await Promise.all(
          validLeaveData.map(async (request: any) => {
            try {
              const staffResponse = await fetch(`/api/staff/${request.staffId}?t=${timestamp}&r=${random}`, {
                headers: {
                  'Cache-Control': 'no-cache, no-store, must-revalidate',
                  'Pragma': 'no-cache',
                  'Expires': '0'
                }
              });
              const staffData = await staffResponse.json();
              if (staffData.success) {
                return {
                  ...request,
                  staffName: `${staffData.data.firstName} ${staffData.data.lastName}`,
                  department: staffData.data.department
                };
              }
              return request;
            } catch (error) {
              console.error('Error fetching staff details for staffId:', request.staffId, error);
              return request;
            }
          })
        );
        
        console.log('Frontend - Final processed requests with IDs:', requestsWithStaffInfo.map(r => ({ id: r.id, staffName: r.staffName })));
        setLeaveRequests(requestsWithStaffInfo);

        // Show warning if some data was filtered out
        if (validLeaveData.length < data.data.length) {
          const corruptCount = data.data.length - validLeaveData.length;
          console.warn(`Frontend - ${corruptCount} corrupt leave record(s) were filtered out`);
          
          // Show user notification about data issues
          setTimeout(() => {
            const shouldCheck = confirm(`⚠️ Data Quality Warning\n\n${corruptCount} leave record(s) had invalid data and were filtered out.\n\nWould you like to run a data integrity check to identify and potentially fix these issues?`);
            if (shouldCheck) {
              // Trigger data integrity check
              fetch('/api/debug/cleanup-leave', { method: 'POST' })
                .then(response => response.json())
                .then(result => {
                  if (result.success && result.corruptRecords.length > 0) {
                    let message = `Data Issues Found:\n\n`;
                    result.corruptRecords.forEach((record: any, index: number) => {
                      message += `${index + 1}. ID: ${record.id}\n`;
                      message += `   Issues: ${record.issues.join(', ')}\n\n`;
                    });
                    message += `Please contact technical support to resolve these data integrity issues.`;
                    alert(message);
                  }
                })
                .catch(error => {
                  console.error('Data check failed:', error);
                  alert('❌ Unable to perform data integrity check. Please try the Check Data Integrity button.');
                });
            }
          }, 1000); // Show after a brief delay
        }
      }
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      alert('❌ Error fetching leave requests. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReject = async (action: 'approve' | 'reject', remarks: string = '') => {
    if (!selectedLeave) return;

    try {
      console.log('Frontend - Attempting to', action, 'leave with ID:', selectedLeave.id);
      console.log('Frontend - Selected leave object:', selectedLeave);
      
      // Validate the ID format before sending
      if (!selectedLeave.id || selectedLeave.id.length !== 24) {
        alert(`❌ Invalid leave request ID format: ${selectedLeave.id}. Please refresh the page and try again.`);
        setShowApprovalModal(false);
        setSelectedLeave(null);
        fetchLeaveRequests();
        fetchStaffBalances();
        return;
      }

      // Verify the leave request still exists before attempting approval
      console.log('Frontend - Verifying leave still exists in database...');
      const verifyResponse = await fetch(`/api/debug/leave?id=${selectedLeave.id}`);
      const verifyResult = await verifyResponse.json();
      
      if (!verifyResult.success || !verifyResult.found) {
        alert(`❌ This leave request no longer exists in the database.\n\nIt may have been processed by another admin or deleted. The list will be refreshed automatically.`);
        setShowApprovalModal(false);
        setSelectedLeave(null);
        setLeaveRequests([]);
        setStaffBalances([]);
        setBalanceSummary(null);
        fetchLeaveRequests();
        fetchStaffBalances();
        return;
      }

      console.log('Frontend - Leave verified, proceeding with', action);

      const requestBody = {
        id: selectedLeave.id,
        action,
        approvedBy: 'Admin User', // In a real app, get from user session
        remarks
      };

      const response = await fetch('/api/leave', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      console.log('API response:', result);
      
      if (result.success) {
        alert(`✅ Leave request ${action}d successfully!`);
        setShowApprovalModal(false);
        setSelectedLeave(null);
        fetchLeaveRequests(); // Refresh the list
        fetchStaffBalances(); // Refresh balances
      } else {
        console.error('API error:', result.error, 'Full API Response:', result);
        
        // Enhanced error handling with more specific messages
        if (result.error && (result.error.startsWith('Leave request not found') || result.errorCode === 'LEAVE_NOT_FOUND')) {
          alert(`❌ ${result.error}\n\nThis leave request may have been processed by another admin or the data is outdated. The list will be refreshed automatically.`);
          
          // Log available IDs for debugging
          if (result.availableIds) {
            console.log('Available leave IDs in database:', result.availableIds);
          }
          
        } else if (result.error && result.error.includes('Invalid ID format')) {
          alert(`❌ Invalid leave request format.\n\nThis appears to be a data integrity issue. Please refresh the page and try again.`);
        } else {
          alert(`❌ Error processing leave request: ${result.error}\n\nPlease try again or contact technical support if the issue persists.`);
        }

        // Always refresh data when there's an error
        setShowApprovalModal(false);
        setSelectedLeave(null);
        setLeaveRequests([]);
        setStaffBalances([]);
        setBalanceSummary(null);
        fetchLeaveRequests();
        fetchStaffBalances();
      }
    } catch (error) {
      console.error(`Error ${action}ing leave:`, error);
      alert(`❌ Network error while ${action}ing leave request.\n\nPlease check your connection and try again.`);
      
      // Refresh data on network errors too
      setShowApprovalModal(false);
      setSelectedLeave(null);
      fetchLeaveRequests();
      fetchStaffBalances();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return '✅';
      case 'pending': return '⏳';
      case 'rejected': return '❌';
      default: return '📄';
    }
  };

  const filteredRequests = leaveRequests.filter(request => {
    if (activeFilter === 'all') return true;
    return request.status === activeFilter;
  });

  const getFilterCount = (filter: string) => {
    if (filter === 'all') return leaveRequests.length;
    return leaveRequests.filter(request => request.status === filter).length;
  };

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
            <h1 className="text-3xl font-bold text-gray-900">🏖️ Leave Management</h1>
            <p className="text-gray-600">Review and approve staff leave requests</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={async () => {
                try {
                  setLoading(true);
                  // Run data integrity check
                  const response = await fetch('/api/debug/cleanup-leave', { method: 'POST' });
                  const result = await response.json();
                  
                  if (result.success) {
                    const { summary, corruptRecords } = result;
                    let message = `Data Integrity Check Complete:\n\n`;
                    message += `✅ Valid records: ${summary.validRecords}\n`;
                    message += `❌ Corrupt records: ${summary.corruptRecords}\n`;
                    
                    if (corruptRecords.length > 0) {
                      message += `\nIssues found:\n`;
                      corruptRecords.forEach((record: any, index: number) => {
                        message += `${index + 1}. ID: ${record.id}\n`;
                        message += `   Issues: ${record.issues.join(', ')}\n`;
                      });
                      message += `\nRecommendation: Contact technical support to clean corrupted data.`;
                    }
                    
                    alert(message);
                  }
                  
                  // Refresh data after check
                  setLeaveRequests([]);
                  setStaffBalances([]);
                  setBalanceSummary(null);
                  fetchLeaveRequests();
                  fetchStaffBalances();
                } catch (error) {
                  console.error('Data check error:', error);
                  alert('❌ Error checking data integrity. Please try again.');
                } finally {
                  setLoading(false);
                }
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              🔍 Check Data Integrity
            </button>
            <button
              onClick={() => {
                // Hard refresh - clear state and refetch
                setLeaveRequests([]);
                setStaffBalances([]);
                setSelectedLeave(null);
                setShowApprovalModal(false);
                fetchLeaveRequests();
                fetchStaffBalances();
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              🔄 Hard Refresh
            </button>
            <button
              onClick={() => {
                fetchLeaveRequests();
                fetchStaffBalances();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Main Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'requests', label: 'Leave Requests', icon: '📋', count: leaveRequests.length },
                { id: 'balances', label: 'Leave Balances', icon: '📊', count: staffBalances.length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'requests' ? (
              <div>
                {/* Filter Tabs for Leave Requests */}
                <div className="border-b border-gray-200 mb-6">
                  <nav className="flex space-x-8">
                    {[
                      { id: 'pending', label: 'Pending', icon: '⏳' },
                      { id: 'approved', label: 'Approved', icon: '✅' },
                      { id: 'rejected', label: 'Rejected', icon: '❌' },
                      { id: 'all', label: 'All Requests', icon: '📋' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveFilter(tab.id as any)}
                        className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm ${
                          activeFilter === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                          {getFilterCount(tab.id)}
                        </span>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Leave Requests List */}
                {filteredRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏖️</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No leave requests found</h3>
                    <p className="text-gray-600">
                      {activeFilter === 'pending' 
                        ? 'No pending leave requests to review'
                        : `No ${activeFilter} leave requests found`
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredRequests
                      .filter(leave => leave.id && leave.id.length === 24) // Only show requests with valid MongoDB ObjectId
                      .map((leave) => (
                      <div key={leave.id} className="bg-gray-50 border rounded-lg p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                          {/* Leave Request Info */}
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="text-2xl">{getStatusIcon(leave.status)}</span>
                              <div>
                                <h4 className="text-lg font-semibold text-gray-900">
                                  {leave.staffName || leave.employeeId}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {leave.department} • {leave.employeeId}
                                </p>
                                <p className="text-xs text-gray-400">
                                  ID: {leave.id}
                                </p>
                              </div>
                              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(leave.status)}`}>
                                {leave.status.toUpperCase()}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div>
                                <p className="text-sm font-medium text-gray-700">Leave Type</p>
                                <p className="text-gray-900">{leave.type}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700">Duration</p>
                                <p className="text-gray-900">
                                  {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()} 
                                  <span className="text-blue-600 font-medium"> ({leave.days} days)</span>
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700">Applied Date</p>
                                <p className="text-gray-900">{new Date(leave.appliedDate).toLocaleDateString()}</p>
                              </div>
                              {leave.approvedDate && (
                                <div>
                                  <p className="text-sm font-medium text-gray-700">Decision Date</p>
                                  <p className="text-gray-900">{new Date(leave.approvedDate).toLocaleDateString()}</p>
                                </div>
                              )}
                            </div>
                            
                            <div className="mb-3">
                              <p className="text-sm font-medium text-gray-700 mb-1">Reason</p>
                              <p className="text-gray-900 bg-white p-3 rounded border">{leave.reason}</p>
                            </div>

                            {leave.remarks && (
                              <div>
                                <p className="text-sm font-medium text-gray-700 mb-1">Admin Remarks</p>
                                <p className="text-gray-900 bg-blue-50 p-3 rounded border border-blue-200">{leave.remarks}</p>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          {leave.status === 'pending' && (
                            <div className="flex space-x-3 lg:flex-col lg:space-x-0 lg:space-y-3">
                              <button
                                onClick={() => {
                                  setSelectedLeave(leave);
                                  setApprovalAction('approve');
                                  setShowApprovalModal(true);
                                }}
                                className="flex-1 lg:flex-none bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                              >
                                ✅ Approve
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedLeave(leave);
                                  setApprovalAction('reject');
                                  setShowApprovalModal(true);
                                }}
                                className="flex-1 lg:flex-none bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                              >
                                ❌ Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Leave Balances Tab
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">📊 Staff Leave Balances ({new Date().getFullYear()})</h3>
                  <p className="text-gray-600">Current year leave entitlements and usage for all staff members</p>
                </div>

                {/* Summary Cards */}
                {balanceSummary && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-600">Total Staff</p>
                          <p className="text-2xl font-bold text-blue-900">{balanceSummary.totalStaff}</p>
                        </div>
                        <div className="text-blue-500 text-2xl">👥</div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-600">Avg. Days Left</p>
                          <p className="text-2xl font-bold text-green-900">{balanceSummary.averageRemainingLeave}</p>
                        </div>
                        <div className="text-green-500 text-2xl">📅</div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-yellow-600">Low Balance</p>
                          <p className="text-2xl font-bold text-yellow-900">{balanceSummary.staffWithLowBalance}</p>
                          <p className="text-xs text-yellow-600">≤ 3 days left</p>
                        </div>
                        <div className="text-yellow-500 text-2xl">⚠️</div>
                      </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-red-600">Exceeded Quota</p>
                          <p className="text-2xl font-bold text-red-900">{balanceSummary.staffWithExceededQuota}</p>
                          <p className="text-xs text-red-600">Over limit</p>
                        </div>
                        <div className="text-red-500 text-2xl">🚫</div>
                      </div>
                    </div>
                  </div>
                )}

                {staffBalances.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📊</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No staff data found</h3>
                    <p className="text-gray-600">Unable to load staff leave balance information</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {staffBalances.map((balance) => (
                      <div key={balance.staffId} className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                        {/* Staff Info */}
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{balance.staffName}</h4>
                            <p className="text-sm text-gray-600">{balance.department} • {balance.employeeId}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">{balance.remainingLeave}</div>
                            <div className="text-xs text-gray-600">days left</div>
                          </div>
                        </div>

                        {/* Leave Usage Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Leave Usage</span>
                            <span>{balance.usedLeave + balance.pendingLeave}/{balance.totalLeaveEntitlement} days</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div className="relative h-3 rounded-full overflow-hidden">
                              <div 
                                className="absolute top-0 left-0 h-full bg-red-500 rounded-full"
                                style={{ width: `${(balance.usedLeave / balance.totalLeaveEntitlement) * 100}%` }}
                              ></div>
                              <div 
                                className="absolute top-0 h-full bg-yellow-500 rounded-full"
                                style={{ 
                                  left: `${(balance.usedLeave / balance.totalLeaveEntitlement) * 100}%`,
                                  width: `${(balance.pendingLeave / balance.totalLeaveEntitlement) * 100}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                          <div className="flex justify-between mt-1 text-xs">
                            <span className="text-red-600">● Used: {balance.usedLeave}</span>
                            <span className="text-yellow-600">● Pending: {balance.pendingLeave}</span>
                            <span className="text-green-600">● Available: {balance.remainingLeave}</span>
                          </div>
                        </div>

                        {/* Leave Statistics */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-white p-3 rounded-lg text-center">
                            <div className="text-lg font-semibold text-green-600">{balance.leaveHistory.approved}</div>
                            <div className="text-xs text-gray-600">Approved</div>
                          </div>
                          <div className="bg-white p-3 rounded-lg text-center">
                            <div className="text-lg font-semibold text-yellow-600">{balance.leaveHistory.pending}</div>
                            <div className="text-xs text-gray-600">Pending</div>
                          </div>
                          <div className="bg-white p-3 rounded-lg text-center">
                            <div className="text-lg font-semibold text-red-600">{balance.leaveHistory.rejected}</div>
                            <div className="text-xs text-gray-600">Rejected</div>
                          </div>
                        </div>

                        {/* Warning for low balance */}
                        {balance.remainingLeave <= 3 && balance.remainingLeave > 0 && (
                          <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded-lg">
                            <div className="flex items-center text-yellow-800">
                              <span className="mr-2">⚠️</span>
                              <span className="text-xs">Low leave balance - Only {balance.remainingLeave} days remaining</span>
                            </div>
                          </div>
                        )}
                        
                        {balance.remainingLeave <= 0 && (
                          <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded-lg">
                            <div className="flex items-center text-red-800">
                              <span className="mr-2">🚫</span>
                              <span className="text-xs">Leave quota exceeded by {Math.abs(balance.remainingLeave)} days</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Approval Modal */}
      {showApprovalModal && selectedLeave && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {approvalAction === 'approve' ? '✅ Approve Leave Request' : '❌ Reject Leave Request'}
              </h2>
              <button
                onClick={() => setShowApprovalModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-2">Leave Request Details:</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p><strong>Staff:</strong> {selectedLeave.staffName || selectedLeave.employeeId}</p>
                  <p><strong>Type:</strong> {selectedLeave.type}</p>
                  <p><strong>Duration:</strong> {selectedLeave.days} days</p>
                  <p><strong>Period:</strong> {new Date(selectedLeave.startDate).toLocaleDateString()} - {new Date(selectedLeave.endDate).toLocaleDateString()}</p>
                </div>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const remarks = formData.get('remarks') as string;
                  handleApproveReject(approvalAction, remarks);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Remarks {approvalAction === 'reject' ? '*' : '(Optional)'}
                  </label>
                  <textarea
                    name="remarks"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={
                      approvalAction === 'approve' 
                        ? "Optional: Add any notes about this approval..."
                        : "Please provide a reason for rejection..."
                    }
                    required={approvalAction === 'reject'}
                  ></textarea>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className={`flex-1 text-white py-2 px-4 rounded-lg font-medium transition-colors ${
                      approvalAction === 'approve'
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {approvalAction === 'approve' ? '✅ Confirm Approval' : '❌ Confirm Rejection'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowApprovalModal(false)}
                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
