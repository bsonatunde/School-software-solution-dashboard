'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';

interface ReportData {
  vehicles: any[];
  routes: any[];
  students: any[];
  statistics: {
    totalVehicles: number;
    activeVehicles: number;
    totalRoutes: number;
    activeRoutes: number;
    totalStudents: number;
    activeStudents: number;
    monthlyRevenue: number;
    utilizationRate: number;
    avgFuelConsumption: number;
    totalMaintenanceCost: number;
    onTimePerformance: number;
  };
  monthlyData: Array<{
    month: string;
    revenue: number;
    expenses: number;
    ridership: number;
    incidents: number;
  }>;
  maintenanceSchedule: Array<{
    vehicleNumber: string;
    type: string;
    dueDate: string;
    cost: number;
    priority: 'high' | 'medium' | 'low';
  }>;
}

export default function TransportReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<'overview' | 'financial' | 'utilization' | 'maintenance'>('overview');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel'>('pdf');
  const router = useRouter();

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // Simulate fetching comprehensive transport report data
      const data: ReportData = {
        vehicles: [
          {
            id: '1',
            vehicleNumber: 'SCH-001-NGR',
            type: 'Bus',
            capacity: 35,
            utilization: 85,
            monthlyMileage: 2500,
            fuelConsumption: 12.5,
            maintenanceCost: 45000,
            incidents: 0,
            onTimePerformance: 92
          },
          {
            id: '2',
            vehicleNumber: 'SCH-002-NGR',
            type: 'Van',
            capacity: 15,
            utilization: 70,
            monthlyMileage: 1800,
            fuelConsumption: 8.2,
            maintenanceCost: 25000,
            incidents: 1,
            onTimePerformance: 88
          },
          {
            id: '3',
            vehicleNumber: 'SCH-003-NGR',
            type: 'Minibus',
            capacity: 25,
            utilization: 90,
            monthlyMileage: 2200,
            fuelConsumption: 10.8,
            maintenanceCost: 35000,
            incidents: 0,
            onTimePerformance: 95
          }
        ],
        routes: [
          {
            id: '1',
            name: 'Victoria Island - Lekki Route',
            studentsEnrolled: 28,
            capacity: 35,
            utilizationRate: 80,
            monthlyRevenue: 700000,
            avgTripTime: 45,
            onTimePerformance: 92
          },
          {
            id: '2',
            name: 'Ikeja - Maryland Route',
            studentsEnrolled: 12,
            capacity: 15,
            utilizationRate: 80,
            monthlyRevenue: 240000,
            avgTripTime: 35,
            onTimePerformance: 88
          },
          {
            id: '3',
            name: 'Ajah - Sangotedo Route',
            studentsEnrolled: 22,
            capacity: 25,
            utilizationRate: 88,
            monthlyRevenue: 440000,
            avgTripTime: 40,
            onTimePerformance: 95
          }
        ],
        students: [],
        statistics: {
          totalVehicles: 3,
          activeVehicles: 3,
          totalRoutes: 3,
          activeRoutes: 3,
          totalStudents: 62,
          activeStudents: 60,
          monthlyRevenue: 1380000,
          utilizationRate: 83,
          avgFuelConsumption: 10.5,
          totalMaintenanceCost: 105000,
          onTimePerformance: 92
        },
        monthlyData: [
          { month: 'Jul 2024', revenue: 1200000, expenses: 580000, ridership: 58, incidents: 2 },
          { month: 'Aug 2024', revenue: 1250000, expenses: 620000, ridership: 59, incidents: 1 },
          { month: 'Sep 2024', revenue: 1300000, expenses: 650000, ridership: 61, incidents: 0 },
          { month: 'Oct 2024', revenue: 1350000, expenses: 680000, ridership: 60, incidents: 1 },
          { month: 'Nov 2024', revenue: 1380000, expenses: 700000, ridership: 62, incidents: 0 },
          { month: 'Dec 2024', revenue: 1420000, expenses: 720000, ridership: 64, incidents: 1 }
        ],
        maintenanceSchedule: [
          {
            vehicleNumber: 'SCH-001-NGR',
            type: 'Routine Service',
            dueDate: '2024-12-25',
            cost: 25000,
            priority: 'medium'
          },
          {
            vehicleNumber: 'SCH-002-NGR',
            type: 'Brake Inspection',
            dueDate: '2024-12-20',
            cost: 15000,
            priority: 'high'
          },
          {
            vehicleNumber: 'SCH-003-NGR',
            type: 'Engine Service',
            dueDate: '2024-12-30',
            cost: 35000,
            priority: 'medium'
          }
        ]
      };
      
      setReportData(data);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async () => {
    try {
      alert(`Exporting ${selectedReport} report as ${exportFormat.toUpperCase()}...`);
      // Simulate export functionality
      const filename = `transport_${selectedReport}_report_${new Date().toISOString().split('T')[0]}.${exportFormat}`;
      console.log(`Would export ${filename}`);
    } catch (error) {
      alert('Failed to export report');
    }
  };

  const renderOverviewReport = () => (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                🚌
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Fleet Size</p>
              <p className="text-2xl font-bold text-blue-900">{reportData?.statistics.totalVehicles || 0}</p>
              <p className="text-xs text-blue-600">{reportData?.statistics.activeVehicles || 0} active</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                👥
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Students</p>
              <p className="text-2xl font-bold text-green-900">{reportData?.statistics.totalStudents || 0}</p>
              <p className="text-xs text-green-600">{reportData?.statistics.activeStudents || 0} active</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                💰
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-purple-900">₦{(reportData?.statistics.monthlyRevenue || 0).toLocaleString()}</p>
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
              <p className="text-sm font-medium text-yellow-600">Utilization</p>
              <p className="text-2xl font-bold text-yellow-900">{reportData?.statistics.utilizationRate || 0}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Performance */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Performance Summary</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Mileage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel (L/100km)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">On-Time %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incidents</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportData?.vehicles.map(vehicle => (
                <tr key={vehicle.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{vehicle.vehicleNumber}</div>
                    <div className="text-sm text-gray-500">{vehicle.type} • {vehicle.capacity} seats</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${vehicle.utilization}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{vehicle.utilization}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.monthlyMileage.toLocaleString()} km</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.fuelConsumption}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      vehicle.onTimePerformance >= 90 ? 'bg-green-100 text-green-800' :
                      vehicle.onTimePerformance >= 80 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {vehicle.onTimePerformance}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      vehicle.incidents === 0 ? 'bg-green-100 text-green-800' :
                      vehicle.incidents <= 2 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {vehicle.incidents}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Route Performance */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reportData?.routes.map(route => (
            <div key={route.id} className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">{route.name}</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Students:</span>
                  <span>{route.studentsEnrolled}/{route.capacity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Utilization:</span>
                  <span>{route.utilizationRate}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Monthly Revenue:</span>
                  <span className="font-medium">₦{route.monthlyRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg Trip Time:</span>
                  <span>{route.avgTripTime} mins</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">On-Time:</span>
                  <span className={route.onTimePerformance >= 90 ? 'text-green-600' : 'text-yellow-600'}>
                    {route.onTimePerformance}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFinancialReport = () => (
    <div className="space-y-6">
      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                💰
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-900">
                ₦{reportData?.monthlyData.reduce((sum, month) => sum + month.revenue, 0).toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                💸
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-red-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-900">
                ₦{reportData?.monthlyData.reduce((sum, month) => sum + month.expenses, 0).toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                📈
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Net Profit</p>
              <p className="text-2xl font-bold text-blue-900">
                ₦{reportData?.monthlyData.reduce((sum, month) => sum + (month.revenue - month.expenses), 0).toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Financial Trend */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Financial Trend</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Profit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit Margin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ridership</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportData?.monthlyData.map((month, index) => {
                const profit = month.revenue - month.expenses;
                const margin = ((profit / month.revenue) * 100).toFixed(1);
                return (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{month.month}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₦{month.revenue.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₦{month.expenses.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-semibold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₦{profit.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        parseFloat(margin) >= 40 ? 'bg-green-100 text-green-800' :
                        parseFloat(margin) >= 30 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {margin}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{month.ridership}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Cost Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Major Expense Categories</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Fuel & Oil</span>
                <span className="text-sm font-medium">₦280,000 (40%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Driver Salaries</span>
                <span className="text-sm font-medium">₦210,000 (30%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Maintenance</span>
                <span className="text-sm font-medium">₦105,000 (15%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Insurance</span>
                <span className="text-sm font-medium">₦70,000 (10%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Other</span>
                <span className="text-sm font-medium">₦35,000 (5%)</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Cost per Kilometer</h4>
            <div className="space-y-3">
              {reportData?.vehicles.map(vehicle => (
                <div key={vehicle.id} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{vehicle.vehicleNumber}</span>
                  <span className="text-sm font-medium">₦{(vehicle.maintenanceCost / vehicle.monthlyMileage).toFixed(2)}/km</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMaintenanceReport = () => (
    <div className="space-y-6">
      {/* Maintenance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-yellow-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                🔧
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-yellow-600">Total Maintenance Cost</p>
              <p className="text-2xl font-bold text-yellow-900">₦{(reportData?.statistics.totalMaintenanceCost || 0).toLocaleString()}</p>
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
              <p className="text-sm font-medium text-red-600">Pending Maintenance</p>
              <p className="text-2xl font-bold text-red-900">{reportData?.maintenanceSchedule.filter(m => m.priority === 'high').length || 0}</p>
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
              <p className="text-sm font-medium text-green-600">Average Fuel Efficiency</p>
              <p className="text-2xl font-bold text-green-900">{reportData?.statistics.avgFuelConsumption || 0}L</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Maintenance Schedule */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Maintenance Schedule</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maintenance Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estimated Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Until Due</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportData?.maintenanceSchedule.map((maintenance, index) => {
                const daysUntilDue = Math.ceil((new Date(maintenance.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{maintenance.vehicleNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{maintenance.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(maintenance.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₦{maintenance.cost.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        maintenance.priority === 'high' ? 'bg-red-100 text-red-800' :
                        maintenance.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {maintenance.priority.charAt(0).toUpperCase() + maintenance.priority.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        daysUntilDue <= 7 ? 'text-red-600' :
                        daysUntilDue <= 14 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {daysUntilDue} days
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vehicle Maintenance History */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Maintenance Costs</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost per KM</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel Efficiency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportData?.vehicles.map(vehicle => (
                <tr key={vehicle.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{vehicle.vehicleNumber}</div>
                    <div className="text-sm text-gray-500">{vehicle.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₦{vehicle.maintenanceCost.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₦{(vehicle.maintenanceCost / vehicle.monthlyMileage).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.fuelConsumption}L/100km</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      vehicle.maintenanceCost < 30000 ? 'bg-green-100 text-green-800' :
                      vehicle.maintenanceCost < 40000 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {vehicle.maintenanceCost < 30000 ? 'Low Cost' :
                       vehicle.maintenanceCost < 40000 ? 'Moderate' : 'High Cost'}
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

  if (loading) {
    return (
      <DashboardLayout userRole="admin">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading transport reports...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📊 Transport Reports</h1>
            <p className="text-gray-600">Comprehensive transport management analytics</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">From:</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">To:</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as 'pdf' | 'excel')}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
            </select>
            <button
              onClick={exportReport}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              📄 Export Report
            </button>
            <button
              onClick={() => router.push('/transport')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Back to Transport
            </button>
          </div>
        </div>

        {/* Report Navigation */}
        <div className="bg-white rounded-lg p-1 shadow-sm inline-flex">
          <button
            onClick={() => setSelectedReport('overview')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              selectedReport === 'overview'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📋 Overview
          </button>
          <button
            onClick={() => setSelectedReport('financial')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              selectedReport === 'financial'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            💰 Financial
          </button>
          <button
            onClick={() => setSelectedReport('utilization')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              selectedReport === 'utilization'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📊 Utilization
          </button>
          <button
            onClick={() => setSelectedReport('maintenance')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              selectedReport === 'maintenance'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🔧 Maintenance
          </button>
        </div>

        {/* Report Content */}
        {selectedReport === 'overview' && renderOverviewReport()}
        {selectedReport === 'financial' && renderFinancialReport()}
        {selectedReport === 'maintenance' && renderMaintenanceReport()}
        {selectedReport === 'utilization' && renderOverviewReport()}
      </div>
    </DashboardLayout>
  );
}
