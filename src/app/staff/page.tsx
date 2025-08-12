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

export default function StaffPage() {
  const router = useRouter();
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [currentView, setCurrentView] = useState<'list' | 'grid'>('list');

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await fetch('/api/staff?type=staff');
      const data = await response.json();
      if (data.success) {
        setStaffList(data.data || []); // Fixed: use data.data instead of data.staff
        console.log('Staff fetched:', data.data?.length || 0, 'members');
      } else {
        console.error('Failed to fetch staff:', data.error);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (confirm('Are you sure you want to remove this staff member?')) {
      try {
        const response = await fetch(`/api/staff?id=${id}&type=staff`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (data.success) {
          fetchStaff();
        }
      } catch (error) {
        console.error('Error deleting staff:', error);
      }
    }
  };

  const handleGenerateReport = () => {
    try {
      console.log('Generate report clicked. Filtered staff count:', filteredStaff.length);
      
      if (filteredStaff.length === 0) {
        alert('⚠️ No staff data to export. Please add staff members first.');
        return;
      }

      // Generate CSV data
      const csvData = filteredStaff.map(staff => ({
        'Employee ID': staff.employeeId || '',
        'First Name': staff.firstName || '',
        'Last Name': staff.lastName || '',
        'Email': staff.email || '',
        'Phone': staff.phone || '',
        'Position': staff.position || '',
        'Department': staff.department || '',
        'Qualification': staff.qualification || '',
        'Experience (Years)': staff.experience || 0,
        'Date of Joining': staff.dateOfJoining || '',
        'Date of Birth': staff.dateOfBirth || '',
        'Gender': staff.gender || '',
        'Marital Status': staff.maritalStatus || '',
        'State of Origin': staff.stateOfOrigin || '',
        'Nationality': staff.nationality || '',
        'Religion': staff.religion || '',
        'Basic Salary (₦)': staff.salary?.basicSalary?.toLocaleString() || '0',
        'Housing Allowance (₦)': staff.salary?.allowances?.housing?.toLocaleString() || '0',
        'Transport Allowance (₦)': staff.salary?.allowances?.transport?.toLocaleString() || '0',
        'Teaching Allowance (₦)': staff.salary?.allowances?.teaching?.toLocaleString() || '0',
        'Gross Salary (₦)': staff.salary?.grossSalary?.toLocaleString() || '0',
        'Net Salary (₦)': staff.salary?.netSalary?.toLocaleString() || '0',
        'Status': staff.status || '',
        'Employment Type': staff.employmentType || '',
        'Grade Level': staff.gradeLevel || '',
        'Subjects': staff.subjects?.join('; ') || '',
        'Classes': staff.classes?.join('; ') || '',
        'Performance Rating': staff.performanceRating || 0,
        'Leave Balance': staff.leaveBalance || 0,
        'Emergency Contact Name': staff.emergencyContact?.name || '',
        'Emergency Contact Phone': staff.emergencyContact?.phone || '',
        'Bank Name': staff.bankDetails?.bankName || '',
        'Account Number': staff.bankDetails?.accountNumber || ''
      }));

      console.log('CSV data prepared:', csvData.length, 'records');

      // Convert to CSV
      const headers = Object.keys(csvData[0] || {});
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => 
          headers.map(header => {
            const value = row[header as keyof typeof row];
            // Escape quotes and wrap in quotes if contains comma
            const stringValue = String(value || '');
            return stringValue.includes(',') || stringValue.includes('"') 
              ? `"${stringValue.replace(/"/g, '""')}"` 
              : stringValue;
          }).join(',')
        )
      ].join('\n');

      console.log('CSV content created, length:', csvContent.length);

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `staff_report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('File download initiated');
      alert(`✅ Staff report generated successfully! ${filteredStaff.length} records exported.`);
      
    } catch (error) {
      console.error('Error generating report:', error);
      alert('❌ Error generating report. Please check the console for details.');
    }
  };

  // Filter staff based on search and filters
  const filteredStaff = (staffList || []).filter(staff => {
    const matchesSearch = searchTerm === '' || 
      staff.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === '' || staff.department === filterDepartment;
    const matchesStatus = filterStatus === '' || staff.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Get unique departments for filter
  const departments = [...new Set((staffList || []).map(staff => staff.department))];

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
      default: return 'bg-gray-100 text-gray-800';
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

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">👥 Staff Management</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage staff members, payroll, and performance
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={() => router.push('/staff/add')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              ➕ Add Staff
            </button>
            <button 
              onClick={() => {
                console.log('Button clicked!');
                handleGenerateReport();
              }}
              disabled={filteredStaff.length === 0}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📊 Generate Report
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold text-gray-900">{(staffList || []).length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Staff</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(staffList || []).filter(s => s.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <span className="text-2xl">🏖️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">On Leave</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(staffList || []).filter(s => s.status === 'on leave').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Payroll</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency((staffList || []).reduce((sum, staff) => {
                    const netSalary = staff?.salary?.netSalary || staff?.salary?.basicSalary || 0;
                    return sum + netSalary;
                  }, 0))}
                </p>
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
                  placeholder="Search staff by name, employee ID, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on leave">On Leave</option>
              </select>
              
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setCurrentView('list')}
                  className={`px-4 py-2 ${currentView === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  📋
                </button>
                <button
                  onClick={() => setCurrentView('grid')}
                  className={`px-4 py-2 ${currentView === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  ⊞
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Staff List/Grid */}
        {filteredStaff.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <div className="text-6xl mb-4">👤</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No staff found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or add new staff members.</p>
          </div>
        ) : currentView === 'list' ? (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Staff Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position & Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Salary
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStaff.map((staff) => (
                    <tr key={staff.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {staff.firstName.charAt(0)}{staff.lastName.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {staff.firstName} {staff.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{staff.employeeId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{staff.position}</div>
                        <div className="text-sm text-gray-500">{staff.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{staff.email}</div>
                        <div className="text-sm text-gray-500">{staff.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(staff.status)}`}>
                          {staff.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(staff?.salary?.netSalary || staff?.salary?.basicSalary || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => router.push(`/staff/${staff.id}`)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            👁️ View
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteStaff(staff.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStaff.map((staff) => (
              <div key={staff.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 h-12 w-12">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-lg font-medium text-blue-600">
                        {staff.firstName.charAt(0)}{staff.lastName.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {staff.firstName} {staff.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{staff.employeeId}</p>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(staff.status)}`}>
                    {staff.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">💼</span>
                    <span>{staff.position}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">🏢</span>
                    <span>{staff.department}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">📞</span>
                    <span>{staff.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">💰</span>
                    <span>{formatCurrency(staff?.salary?.netSalary || staff?.salary?.basicSalary || 0)}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => router.push(`/staff/${staff.id}`)}
                    className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                  >
                    👁️ View Details
                  </button>
                  <button className="bg-gray-50 text-gray-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                    ✏️ Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
