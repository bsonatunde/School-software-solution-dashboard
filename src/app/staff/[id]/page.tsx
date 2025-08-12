'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface Staff {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  qualification: string;
  experience: number;
  dateOfJoining: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  address: string;
  stateOfOrigin: string;
  nationality: string;
  religion: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    bvn: string;
  };
  salary: {
    basicSalary: number;
    allowances: {
      housing: number;
      transport: number;
      meal: number;
      teaching: number;
    };
    deductions: {
      pension: number;
      tax: number;
      nhis: number;
    };
    grossSalary: number;
    netSalary: number;
  };
  status: string;
  employmentType: string;
  gradeLevel: string;
  subjects: string[];
  classes: string[];
  performanceRating: number;
  lastPromotionDate: string;
  leaveBalance: number;
  disciplinaryRecords: any[];
  achievements: string[];
}

interface LeaveRequest {
  id: string;
  employeeId: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: string;
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  remarks?: string;
}

export default function StaffDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [staffId, setStaffId] = useState<string | null>(null);
  
  const [staff, setStaff] = useState<Staff | null>(null);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [leaveBalance, setLeaveBalance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'salary' | 'leaves' | 'performance'>('overview');
  const [activeLeaveFilter, setActiveLeaveFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    const initializeParams = async () => {
      const resolvedParams = await params;
      setStaffId(resolvedParams.id);
    };
    initializeParams();
  }, [params]);

  useEffect(() => {
    if (staffId) {
      const fetchStaffDetails = async () => {
        try {
          setError(null); // Clear any previous errors
          const response = await fetch(`/api/staff/${staffId}`);
          const data = await response.json();
          if (data.success) {
            setStaff(data.data);
          } else {
            setError('Staff member not found. The database may have been cleaned or the ID is invalid.');
          }
        } catch (error) {
          setError('Failed to load staff details. Please try again.');
        } finally {
          setLoading(false);
        }
      };

      const fetchLeaveRequests = async () => {
        try {
          const timestamp = new Date().getTime();
          const random = Math.random().toString(36).substring(7);
          const response = await fetch(`/api/leave?staffId=${staffId}&t=${timestamp}&r=${random}`, {
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          });
          const data = await response.json();
          if (data.success) {
            setLeaveRequests(data.data || []);
          }
        } catch (error) {
          console.error('Error fetching leave requests:', error);
        }
      };

      const fetchLeaveBalance = async () => {
        try {
          const currentYear = new Date().getFullYear();
          const timestamp = new Date().getTime();
          const response = await fetch(`/api/staff/leave-balances?year=${currentYear}&t=${timestamp}`, {
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          });
          const data = await response.json();
          if (data.success) {
            // Find balance for current staff
            const staffBalance = data.data.find((balance: any) => balance.staffId === staffId);
            setLeaveBalance(staffBalance);
          }
        } catch (error) {
          console.error('Error fetching leave balance:', error);
        }
      };

      fetchStaffDetails();
      fetchLeaveRequests();
      fetchLeaveBalance();
    }
  }, [staffId]);

  // Auto-refresh leave data every 30 seconds when on leaves tab
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (activeTab === 'leaves' && staffId) {
      const autoRefreshData = async () => {
        console.log('Auto-refreshing leave data...');
        
        // Refresh leave requests
        try {
          const timestamp = new Date().getTime();
          const random = Math.random().toString(36).substring(7);
          const response = await fetch(`/api/leave?staffId=${staffId}&t=${timestamp}&r=${random}`, {
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          });
          const data = await response.json();
          if (data.success) {
            setLeaveRequests(data.data || []);
          }
        } catch (error) {
          console.error('Error auto-refreshing leave requests:', error);
        }
        
        // Refresh leave balance
        try {
          const currentYear = new Date().getFullYear();
          const timestamp = new Date().getTime();
          const random = Math.random().toString(36).substring(7);
          const response = await fetch(`/api/staff/leave-balances?year=${currentYear}&t=${timestamp}&r=${random}`, {
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          });
          const data = await response.json();
          if (data.success) {
            const staffBalance = data.data.find((balance: any) => balance.staffId === staffId);
            setLeaveBalance(staffBalance);
            setLastRefresh(new Date());
          }
        } catch (error) {
          console.error('Error auto-refreshing leave balance:', error);
        }
      };
      
      interval = setInterval(autoRefreshData, 30000); // 30 seconds
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [activeTab, staffId]);

  const fetchLeaveRequests = async () => {
    try {
      const timestamp = new Date().getTime();
      const random = Math.random().toString(36).substring(7);
      const response = await fetch(`/api/leave?staffId=${staffId}&t=${timestamp}&r=${random}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      const data = await response.json();
      if (data.success) {
        setLeaveRequests(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    }
  };

  const handleLeaveApplication = async (formData: FormData) => {
    try {
      const leaveData = {
        employeeId: staff?.employeeId,
        staffId: staffId,
        type: formData.get('type'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        reason: formData.get('reason')
      };

      const response = await fetch('/api/leave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leaveData),
      });

      const result = await response.json();
      
      if (result.success) {
        alert('✅ Leave application submitted successfully!');
        setShowLeaveModal(false);
        fetchLeaveRequests(); // Refresh leave requests
        
        // Refresh balance if function exists
        if (staffId) {
          const fetchLeaveBalance = async () => {
            try {
              const currentYear = new Date().getFullYear();
              const timestamp = new Date().getTime();
              const response = await fetch(`/api/staff/leave-balances?year=${currentYear}&t=${timestamp}`);
              const data = await response.json();
              if (data.success) {
                const staffBalance = data.data.find((balance: any) => balance.staffId === staffId);
                setLeaveBalance(staffBalance);
              }
            } catch (error) {
              console.error('Error fetching leave balance:', error);
            }
          };
          fetchLeaveBalance();
        }
      } else {
        alert('❌ Error submitting leave application: ' + result.error);
      }
    } catch (error) {
      console.error('Error submitting leave:', error);
      alert('❌ Error submitting leave application. Please try again.');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'on leave': return 'bg-yellow-100 text-yellow-800';
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

  if (loading) {
    return (
      <DashboardLayout userRole="admin">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout userRole="admin">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Staff Details</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-3">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Retry
            </button>
            <button
              onClick={() => router.push('/staff')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Back to Staff List
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!staff) {
    return (
      <DashboardLayout userRole="admin">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Staff Member Not Found</h2>
          <p className="text-gray-600 mb-6">The staff member you&apos;re looking for doesn&apos;t exist.</p>
          <button
            onClick={() => router.push('/staff')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Back to Staff List
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/staff')}
              className="text-gray-400 hover:text-gray-600"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {staff.firstName} {staff.lastName}
              </h1>
              <p className="text-sm text-gray-600">{staff.employeeId} • {staff.position}</p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={() => setShowEditModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              ✏️ Edit Profile
            </button>
            <button
              onClick={() => setShowLeaveModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              📝 Apply Leave
            </button>
          </div>
        </div>

        {/* Staff Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="flex-shrink-0">
              <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-3xl font-medium text-blue-600">
                  {staff.firstName.charAt(0)}{staff.lastName.charAt(0)}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Information</h3>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">📧 {staff.email}</p>
                    <p className="text-sm text-gray-600">📞 {staff.phone}</p>
                    <p className="text-sm text-gray-600">🏠 {staff.stateOfOrigin}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Employment Details</h3>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">🏢 {staff.department}</p>
                    <p className="text-sm text-gray-600">📅 Joined {staff.dateOfJoining ? new Date(staff.dateOfJoining).toLocaleDateString() : 'Not Available'}</p>
                    <p className="text-sm text-gray-600">⭐ {staff.performanceRating || 4.0}/5.0 Rating</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Status & Salary</h3>
                  <div className="space-y-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(staff.status)}`}>
                      {staff.status}
                    </span>
                    <p className="text-lg font-bold text-green-600">{formatCurrency(staff?.salary?.netSalary || staff?.salary?.basicSalary || 0)}</p>
                    <p className="text-sm text-gray-600">🏖️ {staff.leaveBalance} days leave</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: '📋' },
                { id: 'salary', label: 'Salary Details', icon: '💰' },
                { id: 'leaves', label: 'Leave Management', icon: '🏖️' },
                { id: 'performance', label: 'Performance', icon: '📊' },
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
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">👤 Personal Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                        <p className="text-gray-900">{new Date(staff.dateOfBirth).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Gender</label>
                        <p className="text-gray-900">{staff.gender}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Marital Status</label>
                        <p className="text-gray-900">{staff.maritalStatus}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Religion</label>
                        <p className="text-gray-900">{staff.religion}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Nationality</label>
                        <p className="text-gray-900">{staff.nationality}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">State of Origin</label>
                        <p className="text-gray-900">{staff.stateOfOrigin}</p>
                      </div>
                      <div className="md:col-span-2 lg:col-span-3">
                        <label className="text-sm font-medium text-gray-600">Address</label>
                        <p className="text-gray-900">{staff.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">🚨 Emergency Contact</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Name</label>
                        <p className="text-gray-900">{staff?.emergencyContact?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Relationship</label>
                        <p className="text-gray-900">{staff?.emergencyContact?.relationship || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Phone</label>
                        <p className="text-gray-900">{staff?.emergencyContact?.phone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Teaching Assignment */}
                {staff?.subjects?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 Teaching Assignment</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Subjects</label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {staff?.subjects?.map((subject, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                {subject}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Classes</label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {staff?.classes?.map((className, index) => (
                              <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                {className}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'salary' && (
              <div className="space-y-6">
                {/* Current Salary */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Current Salary Structure</h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Basic Salary & Allowances */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Earnings</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Basic Salary</span>
                            <span className="text-gray-900">{formatCurrency(staff?.salary?.basicSalary || 0)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Housing Allowance</span>
                            <span className="text-gray-900">{formatCurrency(staff?.salary?.allowances?.housing || 0)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Transport Allowance</span>
                            <span className="text-gray-900">{formatCurrency(staff?.salary?.allowances?.transport || 0)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Meal Allowance</span>
                            <span className="text-gray-900">{formatCurrency(staff?.salary?.allowances?.meal || 0)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Teaching Allowance</span>
                            <span className="text-gray-900">{formatCurrency(staff?.salary?.allowances?.teaching || 0)}</span>
                          </div>
                          <div className="border-t pt-2">
                            <div className="flex justify-between font-medium">
                              <span className="text-gray-900">Gross Salary</span>
                              <span className="text-green-600">{formatCurrency(staff?.salary?.grossSalary || 0)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Deductions */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Deductions</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Pension</span>
                            <span className="text-red-600">-{formatCurrency(staff?.salary?.deductions?.pension || 0)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tax</span>
                            <span className="text-red-600">-{formatCurrency(staff?.salary?.deductions?.tax || 0)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">NHIS</span>
                            <span className="text-red-600">-{formatCurrency(staff?.salary?.deductions?.nhis || 0)}</span>
                          </div>
                          <div className="border-t pt-2">
                            <div className="flex justify-between font-medium">
                              <span className="text-gray-900">Total Deductions</span>
                              <span className="text-red-600">
                                -{formatCurrency(
                                  (staff?.salary?.deductions?.pension || 0) +
                                  (staff?.salary?.deductions?.tax || 0) +
                                  (staff?.salary?.deductions?.nhis || 0)
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-gray-900">Net Salary</span>
                        <span className="text-2xl font-bold text-green-600">{formatCurrency(staff?.salary?.netSalary || 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bank Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">🏦 Bank Details</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Account Name</label>
                        <p className="text-gray-900">{staff.bankDetails.accountName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Account Number</label>
                        <p className="text-gray-900">{staff.bankDetails.accountNumber}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Bank Name</label>
                        <p className="text-gray-900">{staff.bankDetails.bankName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">BVN</label>
                        <p className="text-gray-900">{staff.bankDetails.bvn}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'leaves' && (
              <div className="space-y-6">
                {/* Leave Balance Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Current Balance Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">🏖️ Available Leave Balance</h3>
                        <p className="text-sm text-gray-600">Days remaining this year ({new Date().getFullYear()})</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">
                          {leaveBalance?.remainingLeave ?? staff?.leaveBalance ?? 21}
                        </div>
                        <div className="text-sm text-gray-600">days left</div>
                      </div>
                    </div>

                    {leaveBalance && (
                      <div>
                        {/* Usage Bar */}
                        <div className="mb-3">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Leave Usage</span>
                            <span>{leaveBalance.usedLeave + leaveBalance.pendingLeave}/{leaveBalance.totalLeaveEntitlement} days</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div className="relative h-3 rounded-full overflow-hidden">
                              <div 
                                className="absolute top-0 left-0 h-full bg-red-500 rounded-full"
                                style={{ width: `${(leaveBalance.usedLeave / leaveBalance.totalLeaveEntitlement) * 100}%` }}
                              ></div>
                              <div 
                                className="absolute top-0 h-full bg-yellow-500 rounded-full"
                                style={{ 
                                  left: `${(leaveBalance.usedLeave / leaveBalance.totalLeaveEntitlement) * 100}%`,
                                  width: `${(leaveBalance.pendingLeave / leaveBalance.totalLeaveEntitlement) * 100}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                          <div className="flex justify-between mt-1 text-xs">
                            <span className="text-red-600">● Used: {leaveBalance.usedLeave}</span>
                            <span className="text-yellow-600">● Pending: {leaveBalance.pendingLeave}</span>
                            <span className="text-green-600">● Available: {leaveBalance.remainingLeave}</span>
                          </div>
                        </div>

                        {/* Warning Messages */}
                        {leaveBalance.remainingLeave <= 3 && leaveBalance.remainingLeave > 0 && (
                          <div className="p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                            <div className="flex items-center text-yellow-800">
                              <span className="mr-2">⚠️</span>
                              <span className="text-sm">Low leave balance - Only {leaveBalance.remainingLeave} days remaining</span>
                            </div>
                          </div>
                        )}
                        
                        {leaveBalance.remainingLeave <= 0 && (
                          <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
                            <div className="flex items-center text-red-800">
                              <span className="mr-2">🚫</span>
                              <span className="text-sm">Leave quota exceeded by {Math.abs(leaveBalance.remainingLeave)} days</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Leave Statistics */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Leave Statistics</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {leaveBalance?.leaveHistory?.approved ?? leaveRequests.filter(l => l.status === 'approved').length}
                        </div>
                        <div className="text-sm text-gray-600">Approved</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {leaveBalance?.leaveHistory?.pending ?? leaveRequests.filter(l => l.status === 'pending').length}
                        </div>
                        <div className="text-sm text-gray-600">Pending</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {leaveBalance?.leaveHistory?.rejected ?? leaveRequests.filter(l => l.status === 'rejected').length}
                        </div>
                        <div className="text-sm text-gray-600">Rejected</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowLeaveModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <span className="mr-2">📝</span>
                    Apply for Leave
                  </button>
                  <button
                    onClick={() => {
                      setLeaveRequests([]); // Clear current data
                      setLeaveBalance(null);
                      fetchLeaveRequests();
                      if (staffId) {
                        const fetchLeaveBalance = async () => {
                          try {
                            const currentYear = new Date().getFullYear();
                            const timestamp = new Date().getTime();
                            const random = Math.random().toString(36).substring(7);
                            const response = await fetch(`/api/staff/leave-balances?year=${currentYear}&t=${timestamp}&r=${random}`, {
                              headers: {
                                'Cache-Control': 'no-cache, no-store, must-revalidate',
                                'Pragma': 'no-cache',
                                'Expires': '0'
                              }
                            });
                            const data = await response.json();
                            if (data.success) {
                              const staffBalance = data.data.find((balance: any) => balance.staffId === staffId);
                              setLeaveBalance(staffBalance);
                            }
                          } catch (error) {
                            console.error('Error fetching leave balance:', error);
                          }
                        };
                        fetchLeaveBalance();
                      }
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <span className="mr-2">🔄</span>
                    Refresh Data
                  </button>
                  <button
                    onClick={() => {
                      // Force complete page refresh to ensure latest data
                      window.location.reload();
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <span className="mr-2">↻</span>
                    Hard Refresh
                  </button>
                </div>

                {/* Status Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center text-blue-800 text-sm">
                    <span className="mr-2">ℹ️</span>
                    <span>
                      Your leave data automatically syncs with admin approvals. 
                      If you don&apos;t see recent changes, use the refresh buttons above.
                    </span>
                  </div>
                </div>

                {/* Leave Requests with Filtering */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">📋 Leave History</h3>
                      <p className="text-xs text-gray-500">
                        Last updated: {lastRefresh.toLocaleTimeString()} • Auto-refreshes every 30 seconds
                      </p>
                    </div>
                    
                    {/* Filter Buttons */}
                    <div className="flex space-x-2 mt-2 sm:mt-0">
                      {[
                        { id: 'all', label: 'All', icon: '📄' },
                        { id: 'pending', label: 'Pending', icon: '⏳' },
                        { id: 'approved', label: 'Approved', icon: '✅' },
                        { id: 'rejected', label: 'Rejected', icon: '❌' },
                      ].map((filter) => (
                        <button
                          key={filter.id}
                          onClick={() => setActiveLeaveFilter(filter.id as any)}
                          className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            activeLeaveFilter === filter.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <span>{filter.icon}</span>
                          <span>{filter.label}</span>
                          <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                            activeLeaveFilter === filter.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {filter.id === 'all' 
                              ? leaveRequests.length 
                              : leaveRequests.filter(l => l.status === filter.id).length
                            }
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Filtered Leave Requests */}
                  {(() => {
                    const filteredRequests = activeLeaveFilter === 'all' 
                      ? leaveRequests 
                      : leaveRequests.filter(l => l.status === activeLeaveFilter);
                    
                    return filteredRequests.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <div className="text-4xl mb-4">
                          {activeLeaveFilter === 'all' ? '🏖️' : 
                           activeLeaveFilter === 'pending' ? '⏳' :
                           activeLeaveFilter === 'approved' ? '✅' : '❌'}
                        </div>
                        <p className="text-gray-600">
                          {activeLeaveFilter === 'all' 
                            ? 'No leave requests found' 
                            : `No ${activeLeaveFilter} leave requests found`
                          }
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredRequests
                          .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
                          .map((leave) => (
                          <div key={leave.id} className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h4 className="font-semibold text-gray-900 text-lg">{leave.type}</h4>
                                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(leave.status)}`}>
                                    {getStatusIcon(leave.status)} {leave.status.toUpperCase()}
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600 mb-3">
                                  <div className="flex items-center">
                                    <span className="font-medium text-gray-700 mr-2">📅 Start:</span>
                                    <span className="bg-blue-50 px-2 py-1 rounded text-blue-800">
                                      {new Date(leave.startDate).toLocaleDateString('en-GB', { 
                                        weekday: 'short', 
                                        year: 'numeric', 
                                        month: 'short', 
                                        day: 'numeric' 
                                      })}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="font-medium text-gray-700 mr-2">📅 End:</span>
                                    <span className="bg-blue-50 px-2 py-1 rounded text-blue-800">
                                      {new Date(leave.endDate).toLocaleDateString('en-GB', { 
                                        weekday: 'short', 
                                        year: 'numeric', 
                                        month: 'short', 
                                        day: 'numeric' 
                                      })}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="font-medium text-gray-700 mr-2">⏱️ Duration:</span>
                                    <span className="bg-green-50 px-2 py-1 rounded text-green-800 font-semibold">
                                      {leave.days} day{leave.days !== 1 ? 's' : ''}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 p-3 rounded-lg mb-3">
                              <p className="text-sm text-gray-700 mb-1">
                                <span className="font-medium">Reason:</span>
                              </p>
                              <p className="text-gray-900">{leave.reason}</p>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-500 space-y-2 sm:space-y-0">
                              <div className="flex items-center space-x-4">
                                <span className="flex items-center">
                                  <span className="mr-1">📝</span>
                                  Applied: {new Date(leave.appliedDate).toLocaleDateString('en-GB')}
                                </span>
                                {leave.approvedDate && (
                                  <span className="flex items-center">
                                    <span className="mr-1">✅</span>
                                    {leave.status === 'approved' ? 'Approved' : 'Processed'}: {new Date(leave.approvedDate).toLocaleDateString('en-GB')}
                                  </span>
                                )}
                              </div>
                              {leave.approvedBy && (
                                <div className="flex items-center">
                                  <span className="mr-1">👤</span>
                                  <span className="font-medium">
                                    {leave.status === 'approved' ? 'Approved by:' : 'Processed by:'} {leave.approvedBy}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Admin Remarks */}
                            {leave.remarks && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-sm text-gray-600 mb-1">
                                  <span className="font-medium">Admin Remarks:</span>
                                </p>
                                <div className={`p-3 rounded-lg text-sm ${
                                  leave.status === 'approved' 
                                    ? 'bg-green-50 text-green-800 border border-green-200' 
                                    : leave.status === 'rejected'
                                    ? 'bg-red-50 text-red-800 border border-red-200'
                                    : 'bg-gray-50 text-gray-800'
                                }`}>
                                  {leave.remarks}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="space-y-6">
                {/* Performance Rating */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Performance Overview</h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-2">{staff.performanceRating || 4.0}</div>
                        <p className="text-sm text-gray-600">Overall Rating</p>
                        <div className="flex justify-center mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`text-lg ${star <= (staff.performanceRating || 4.0) ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                              ⭐
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 mb-2">{staff.experience || 0}</div>
                        <p className="text-sm text-gray-600">Years Experience</p>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-2">Last Promotion</div>
                        <div className="font-medium text-gray-900">
                          {staff.lastPromotionDate ? new Date(staff.lastPromotionDate).toLocaleDateString() : 'Not Available'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Achievements */}
                {staff?.achievements?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 Achievements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {staff?.achievements?.map((achievement, index) => (
                        <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">🏆</span>
                            <span className="font-medium text-gray-900">{achievement}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Disciplinary Records */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Disciplinary Records</h3>
                  {(staff?.disciplinaryRecords?.length || 0) === 0 ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                      <div className="text-4xl mb-2">✅</div>
                      <p className="text-green-800 font-medium">Clean Record</p>
                      <p className="text-sm text-green-600">No disciplinary issues reported</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {staff?.disciplinaryRecords?.map((record, index) => (
                        <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <p className="text-red-800">{record}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && staff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">✏️ Edit Staff Profile</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  
                  const formData = new FormData(e.target as HTMLFormElement);
                  const updatedStaff = {
                    firstName: formData.get('firstName'),
                    lastName: formData.get('lastName'),
                    email: formData.get('email'),
                    phoneNumber: formData.get('phoneNumber'),
                    dateOfBirth: formData.get('dateOfBirth'),
                    gender: formData.get('gender'),
                    address: formData.get('address'),
                    position: formData.get('position'),
                    department: formData.get('department'),
                    employmentType: formData.get('employmentType'),
                    status: formData.get('status'),
                    qualification: formData.get('qualification'),
                    basicSalary: parseFloat(formData.get('basicSalary') as string) || 0,
                    allowances: {
                      housing: parseFloat(formData.get('housingAllowance') as string) || 0,
                      transport: parseFloat(formData.get('transportAllowance') as string) || 0,
                      meal: parseFloat(formData.get('mealAllowance') as string) || 0,
                      teaching: staff?.salary?.allowances?.teaching || 0
                    },
                    emergencyContact: {
                      name: formData.get('emergencyName'),
                      relationship: formData.get('emergencyRelationship'),
                      phone: formData.get('emergencyPhone')
                    },
                    nationality: staff?.nationality,
                    stateOfOrigin: staff?.stateOfOrigin,
                  };

                  try {
                    const response = await fetch(`/api/staff/${staffId}`, {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(updatedStaff),
                    });

                    const result = await response.json();
                    
                    if (result.success) {
                      // Update the staff state with the new data
                      setStaff({ ...staff, ...result.data } as Staff);
                      alert('✅ Profile updated successfully!');
                      setShowEditModal(false);
                    } else {
                      alert('❌ Error updating profile: ' + result.error);
                    }
                  } catch (error) {
                    console.error('Error updating staff:', error);
                    alert('❌ Error updating profile. Please try again.');
                  }
                }}
                className="space-y-6"
              >
                {/* Personal Information Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">👤 Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        defaultValue={staff.firstName}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        defaultValue={staff.lastName}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        defaultValue={staff.email}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        defaultValue={staff.phone || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        defaultValue={staff.dateOfBirth?.split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                      <select
                        name="gender"
                        defaultValue={staff.gender}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <textarea
                        rows={2}
                        name="address"
                        defaultValue={staff.address}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Employment Information Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">💼 Employment Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Position *</label>
                      <input
                        type="text"
                        name="position"
                        defaultValue={staff.position}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                      <select
                        name="department"
                        defaultValue={staff.department}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Department</option>
                        <option value="Science Department">Science Department</option>
                        <option value="Arts Department">Arts Department</option>
                        <option value="Commercial Department">Commercial Department</option>
                        <option value="Administration">Administration</option>
                        <option value="ICT Department">ICT Department</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
                      <select
                        name="employmentType"
                        defaultValue={staff.employmentType}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        name="status"
                        defaultValue={staff.status}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Terminated">Terminated</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Qualification</label>
                      <input
                        type="text"
                        name="qualification"
                        defaultValue={staff.qualification}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., B.Ed Mathematics, M.Sc Physics"
                      />
                    </div>
                  </div>
                </div>

                {/* Salary Information Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">💰 Salary Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Basic Salary (₦)</label>
                      <input
                        type="number"
                        name="basicSalary"
                        defaultValue={staff.salary?.basicSalary || 0}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Housing Allowance (₦)</label>
                      <input
                        type="number"
                        name="housingAllowance"
                        defaultValue={staff.salary?.allowances?.housing || 0}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Transport Allowance (₦)</label>
                      <input
                        type="number"
                        name="transportAllowance"
                        defaultValue={staff.salary?.allowances?.transport || 0}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Meal Allowance (₦)</label>
                      <input
                        type="number"
                        name="mealAllowance"
                        defaultValue={staff.salary?.allowances?.meal || 0}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Emergency Contact Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">🚨 Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                      <input
                        type="text"
                        name="emergencyName"
                        defaultValue={staff.emergencyContact?.name || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                      <input
                        type="text"
                        name="emergencyRelationship"
                        defaultValue={staff.emergencyContact?.relationship || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Spouse, Parent, Sibling"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="emergencyPhone"
                        defaultValue={staff.emergencyContact?.phone || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-6 border-t">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    💾 Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Apply Leave Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">📝 Apply for Leave</h2>
              <button
                onClick={() => setShowLeaveModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  
                  const formData = new FormData(e.target as HTMLFormElement);
                  const leaveType = formData.get('leaveType') as string;
                  const startDate = formData.get('startDate') as string;
                  const endDate = formData.get('endDate') as string;
                  const reason = formData.get('reason') as string;

                  // Validate form data
                  if (!leaveType || !startDate || !endDate || !reason) {
                    alert('❌ Please fill in all required fields');
                    return;
                  }

                  // Validate dates
                  const start = new Date(startDate);
                  const end = new Date(endDate);
                  if (end <= start) {
                    alert('❌ End date must be after start date');
                    return;
                  }

                  // Calculate days
                  const timeDiff = end.getTime() - start.getTime();
                  const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

                  // Check leave balance
                  if (days > (staff?.leaveBalance || 0)) {
                    alert(`❌ Insufficient leave balance. You have ${staff?.leaveBalance || 0} days available, but requested ${days} days.`);
                    return;
                  }

                  try {
                    const response = await fetch('/api/leave', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        employeeId: staff?.employeeId,
                        staffId: staffId,
                        type: leaveType,
                        startDate,
                        endDate,
                        reason
                      }),
                    });

                    const result = await response.json();
                    
                    if (result.success) {
                      alert('✅ Leave application submitted successfully!');
                      setShowLeaveModal(false);
                      // Refresh leave requests
                      fetchLeaveRequests();
                      // Reset form
                      (e.target as HTMLFormElement).reset();
                    } else {
                      alert('❌ Error submitting leave application: ' + result.error);
                    }
                  } catch (error) {
                    console.error('Error submitting leave:', error);
                    alert('❌ Error submitting leave application. Please try again.');
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type *</label>
                  <select 
                    name="leaveType"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select leave type</option>
                    <option value="Annual Leave">Annual Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Maternity Leave">Maternity Leave</option>
                    <option value="Paternity Leave">Paternity Leave</option>
                    <option value="Emergency Leave">Emergency Leave</option>
                    <option value="Study Leave">Study Leave</option>
                    <option value="Compassionate Leave">Compassionate Leave</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                    <input
                      type="date"
                      name="startDate"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                    <input
                      type="date"
                      name="endDate"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason *</label>
                  <textarea
                    rows={3}
                    name="reason"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Please provide a reason for your leave request..."
                    required
                  ></textarea>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-blue-600 mr-2">ℹ️</span>
                    <p className="text-sm text-blue-800">
                      <strong>Available Leave Balance:</strong> {staff?.leaveBalance || 0} days
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    📝 Submit Application
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLeaveModal(false)}
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
