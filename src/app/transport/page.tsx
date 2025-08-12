'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';

interface Vehicle {
  id: string;
  vehicleNumber: string;
  type: string;
  capacity: number;
  driverName: string;
  driverPhone: string;
  driverLicense: string;
  route: string;
  status: 'active' | 'maintenance' | 'inactive';
  condition: string;
  lastMaintenance: string;
  nextMaintenance: string;
  insuranceExpiry: string;
  roadWorthinessExpiry: string;
  fuelType: string;
  yearOfManufacture: number;
  engineNumber: string;
  chassisNumber: string;
  registrationDate: string;
  averageFuelConsumption: number;
  monthlyMaintenanceCost: number;
  gpsTrackingId: string;
}

interface Route {
  id: string;
  name: string;
  code: string;
  startLocation: string;
  endLocation: string;
  distance: number;
  estimatedDuration: number;
  stops: {
    name: string;
    time: string;
    coordinates: { lat: number; lng: number };
  }[];
  fare: number;
  vehicleId: string;
  status: 'active' | 'suspended' | 'inactive';
  operatingDays: string[];
  morningDeparture: string;
  afternoonDeparture: string;
}

interface StudentTransport {
  id: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  routeId: string;
  routeName: string;
  pickupStop: string;
  dropoffStop: string;
  monthlyFee: number;
  status: 'active' | 'inactive' | 'suspended';
  paymentStatus: 'paid' | 'pending' | 'overdue';
  lastPaymentDate: string;
  nextPaymentDue: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalInfo: string;
  specialInstructions: string;
}

export default function TransportPage() {
  const [selectedView, setSelectedView] = useState<'vehicles' | 'routes' | 'students'>('vehicles');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [students, setStudents] = useState<StudentTransport[]>([]);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState<any>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    routeId: ''
  });
  const router = useRouter();

  const classes = [
    'JSS 1A', 'JSS 1B', 'JSS 2A', 'JSS 2B', 'JSS 3A', 'JSS 3B',
    'SS 1A', 'SS 1B', 'SS 2A', 'SS 2B', 'SS 3A', 'SS 3B'
  ];

  useEffect(() => {
    fetchTransportData();
  }, [filters]);

  const fetchTransportData = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(`/api/transport?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        setVehicles(data.vehicles || []);
        setRoutes(data.routes || []);
        setStudents(data.students || []);
        setStatistics(data.statistics || {});
      }
    } catch (error) {
      console.error('Error fetching transport data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async (vehicleData: any) => {
    try {
      const response = await fetch('/api/transport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...vehicleData, type: 'vehicle' })
      });

      const data = await response.json();
      if (data.success) {
        setShowAddModal(false);
        fetchTransportData();
        alert('Vehicle added successfully!');
      } else {
        alert(data.error || 'Failed to add vehicle');
      }
    } catch (error) {
      alert('Failed to add vehicle');
    }
  };

  const handleAddRoute = async (routeData: any) => {
    try {
      const response = await fetch('/api/transport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...routeData, type: 'route' })
      });

      const data = await response.json();
      if (data.success) {
        setShowAddModal(false);
        fetchTransportData();
        alert('Route added successfully!');
      } else {
        alert(data.error || 'Failed to add route');
      }
    } catch (error) {
      alert('Failed to add route');
    }
  };

  const handleRegisterStudent = async (studentData: any) => {
    try {
      const response = await fetch('/api/transport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...studentData, type: 'student' })
      });

      const data = await response.json();
      if (data.success) {
        setShowAddModal(false);
        fetchTransportData();
        alert('Student registered for transport successfully!');
      } else {
        alert(data.error || 'Failed to register student');
      }
    } catch (error) {
      alert('Failed to register student');
    }
  };

  const updateStatus = async (id: string, type: string, status: string) => {
    try {
      const response = await fetch(`/api/transport?id=${id}&type=${type}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      const data = await response.json();
      if (data.success) {
        fetchTransportData();
        alert(`${type} status updated successfully!`);
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const renderVehiclesView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Vehicle Fleet</h2>
          <p className="text-gray-600">Manage school transportation vehicles</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            🚌 Add Vehicle
          </button>
          <button 
            onClick={() => router.push('/transport/reports')}
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
                🚌
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Total Vehicles</p>
              <p className="text-2xl font-bold text-blue-900">{statistics.totalVehicles || 0}</p>
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
              <p className="text-sm font-medium text-green-600">Active</p>
              <p className="text-2xl font-bold text-green-900">{statistics.activeVehicles || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                🔧
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-yellow-600">Maintenance</p>
              <p className="text-2xl font-bold text-yellow-900">{statistics.maintenanceVehicles || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                👥
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-600">Total Capacity</p>
              <p className="text-2xl font-bold text-purple-900">{statistics.totalCapacity || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Vehicle number, driver name..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map(vehicle => (
          <div key={vehicle.id} className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">{vehicle.vehicleNumber}</h3>
                <p className="text-sm text-gray-600">{vehicle.type} • {vehicle.capacity} seats</p>
                <p className="text-xs text-gray-500 mt-1">{vehicle.route}</p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                vehicle.status === 'active' ? 'bg-green-100 text-green-800' :
                vehicle.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Driver:</span>
                <span>{vehicle.driverName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Phone:</span>
                <span>{vehicle.driverPhone}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Condition:</span>
                <span className="capitalize">{vehicle.condition}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Last Service:</span>
                <span>{new Date(vehicle.lastMaintenance).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Fuel Type:</span>
                <span className="capitalize">{vehicle.fuelType}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm">
                📝 Edit
              </button>
              <button
                onClick={() => updateStatus(vehicle.id, 'vehicle', 
                  vehicle.status === 'active' ? 'maintenance' : 'active'
                )}
                className={`px-3 py-2 rounded-lg text-sm ${
                  vehicle.status === 'active' 
                    ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {vehicle.status === 'active' ? '🔧 Maintenance' : '✅ Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {vehicles.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🚌</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
          <p className="text-gray-600">Add vehicles to start managing your transport fleet.</p>
        </div>
      )}
    </div>
  );

  const renderRoutesView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Transport Routes</h2>
          <p className="text-gray-600">Manage school bus routes and schedules</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            🗺️ Add Route
          </button>
          <button 
            onClick={() => router.push('/transport/reports')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            📊 Generate Report
          </button>
        </div>
      </div>

      {/* Routes List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance & Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {routes.map(route => (
                <tr key={route.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{route.name}</div>
                      <div className="text-sm text-gray-500">{route.code}</div>
                      <div className="text-xs text-gray-400">{route.startLocation} → {route.endLocation}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{route.distance} km</div>
                    <div className="text-sm text-gray-500">{route.estimatedDuration} mins</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Morning: {route.morningDeparture}</div>
                    <div className="text-sm text-gray-500">Afternoon: {route.afternoonDeparture}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">₦{route.fare.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      route.status === 'active' ? 'bg-green-100 text-green-800' :
                      route.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">Edit</button>
                    <button 
                      onClick={() => updateStatus(route.id, 'route', 
                        route.status === 'active' ? 'suspended' : 'active'
                      )}
                      className={route.status === 'active' ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}
                    >
                      {route.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {routes.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🗺️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No routes found</h3>
          <p className="text-gray-600">Add routes to organize your transport system.</p>
        </div>
      )}
    </div>
  );

  const renderStudentsView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Student Transport</h2>
          <p className="text-gray-600">Manage student transportation registrations</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            👨‍🎓 Register Student
          </button>
          <button 
            onClick={() => router.push('/transport/reports')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            📊 Generate Report
          </button>
        </div>
      </div>

      {/* Student Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                👥
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Total Students</p>
              <p className="text-2xl font-bold text-green-900">{statistics.totalStudents || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                ✅
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Active</p>
              <p className="text-2xl font-bold text-blue-900">{statistics.activeStudents || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                💰
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-red-600">Pending Payments</p>
              <p className="text-2xl font-bold text-red-900">{statistics.pendingPayments || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Student name, class..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Route</label>
            <select
              value={filters.routeId}
              onChange={(e) => setFilters(prev => ({ ...prev, routeId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Routes</option>
              {routes.map(route => (
                <option key={route.id} value={route.id}>{route.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route & Stops</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emergency Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map(student => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{student.studentName}</div>
                      <div className="text-sm text-gray-500">{student.studentClass}</div>
                      <div className="text-xs text-gray-400">ID: {student.studentId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.routeName}</div>
                    <div className="text-sm text-gray-500">Pickup: {student.pickupStop}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">₦{student.monthlyFee.toLocaleString()}/month</div>
                    <div className={`text-sm ${
                      student.paymentStatus === 'paid' ? 'text-green-600' :
                      student.paymentStatus === 'pending' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {student.paymentStatus.charAt(0).toUpperCase() + student.paymentStatus.slice(1)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.emergencyContact.name}</div>
                    <div className="text-sm text-gray-500">{student.emergencyContact.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      student.status === 'active' ? 'bg-green-100 text-green-800' :
                      student.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">Edit</button>
                    <button 
                      onClick={() => updateStatus(student.id, 'student', 
                        student.status === 'active' ? 'suspended' : 'active'
                      )}
                      className={student.status === 'active' ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}
                    >
                      {student.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {students.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👨‍🎓</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No students registered</h3>
          <p className="text-gray-600">Register students for transport services.</p>
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
            <h1 className="text-2xl font-bold text-gray-900">🚌 Transport Management</h1>
            <p className="text-gray-600">Manage vehicles, routes, and student transportation</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white rounded-lg p-2 shadow-sm">
              <div className="text-sm text-gray-600">Monthly Revenue</div>
              <div className="text-lg font-bold text-green-600">₦{(statistics.monthlyRevenue || 0).toLocaleString()}</div>
            </div>
            <div className="bg-white rounded-lg p-2 shadow-sm">
              <div className="text-sm text-gray-600">Utilization Rate</div>
              <div className="text-lg font-bold text-blue-600">{statistics.utilizationRate || 0}%</div>
            </div>
            <button
              onClick={() => router.push('/transport/reports')}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              📊 View Reports
            </button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="bg-white rounded-lg p-1 shadow-sm inline-flex">
          <button
            onClick={() => setSelectedView('vehicles')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              selectedView === 'vehicles'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🚌 Vehicles
          </button>
          <button
            onClick={() => setSelectedView('routes')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              selectedView === 'routes'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🗺️ Routes
          </button>
          <button
            onClick={() => setSelectedView('students')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              selectedView === 'students'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            👨‍🎓 Students
          </button>
        </div>

        {/* Content */}
        {selectedView === 'vehicles' && renderVehiclesView()}
        {selectedView === 'routes' && renderRoutesView()}
        {selectedView === 'students' && renderStudentsView()}

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedView === 'vehicles' ? 'Add New Vehicle' :
                 selectedView === 'routes' ? 'Add New Route' :
                 'Register Student for Transport'}
              </h3>
              
              {selectedView === 'vehicles' && (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleAddVehicle({
                    vehicleNumber: formData.get('vehicleNumber'),
                    type: formData.get('type'),
                    capacity: formData.get('capacity'),
                    driverName: formData.get('driverName'),
                    driverPhone: formData.get('driverPhone'),
                    driverLicense: formData.get('driverLicense'),
                    route: formData.get('route'),
                    fuelType: formData.get('fuelType'),
                    yearOfManufacture: formData.get('yearOfManufacture'),
                    condition: formData.get('condition')
                  });
                }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label>
                      <input
                        type="text"
                        name="vehicleNumber"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="SCH-001-NGR"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                      <select
                        name="type"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Type</option>
                        <option value="Bus">Bus</option>
                        <option value="Van">Van</option>
                        <option value="Minibus">Minibus</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                      <input
                        type="number"
                        name="capacity"
                        required
                        min="5"
                        max="100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="35"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Driver Name</label>
                      <input
                        type="text"
                        name="driverName"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Mr. John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Driver Phone</label>
                      <input
                        type="tel"
                        name="driverPhone"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="08012345678"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Driver License</label>
                      <input
                        type="text"
                        name="driverLicense"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="ABC123456789"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Route</label>
                      <input
                        type="text"
                        name="route"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Victoria Island - Lekki"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                      <select
                        name="fuelType"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="petrol">Petrol</option>
                        <option value="diesel">Diesel</option>
                        <option value="cng">CNG</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year of Manufacture</label>
                      <input
                        type="number"
                        name="yearOfManufacture"
                        min="2000"
                        max="2030"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="2022"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                      <select
                        name="condition"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="excellent">Excellent</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="poor">Poor</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Add Vehicle
                    </button>
                  </div>
                </form>
              )}

              {selectedView === 'routes' && (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleAddRoute({
                    name: formData.get('name'),
                    code: formData.get('code'),
                    startLocation: formData.get('startLocation'),
                    endLocation: formData.get('endLocation'),
                    distance: formData.get('distance'),
                    estimatedDuration: formData.get('estimatedDuration'),
                    fare: formData.get('fare'),
                    morningDeparture: formData.get('morningDeparture'),
                    afternoonDeparture: formData.get('afternoonDeparture')
                  });
                }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Route Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Victoria Island - Lekki Route"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Route Code</label>
                      <input
                        type="text"
                        name="code"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="VIL-001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Fare (₦)</label>
                      <input
                        type="number"
                        name="fare"
                        required
                        min="1000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="2500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Location</label>
                      <input
                        type="text"
                        name="startLocation"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Victoria Island"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Location</label>
                      <input
                        type="text"
                        name="endLocation"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="School (Lekki)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Distance (km)</label>
                      <input
                        type="number"
                        name="distance"
                        required
                        step="0.1"
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="15.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                      <input
                        type="number"
                        name="estimatedDuration"
                        required
                        min="10"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="45"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Morning Departure</label>
                      <input
                        type="time"
                        name="morningDeparture"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Afternoon Departure</label>
                      <input
                        type="time"
                        name="afternoonDeparture"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Add Route
                    </button>
                  </div>
                </form>
              )}

              {selectedView === 'students' && (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleRegisterStudent({
                    studentId: formData.get('studentId'),
                    studentName: formData.get('studentName'),
                    studentClass: formData.get('studentClass'),
                    routeId: formData.get('routeId'),
                    pickupStop: formData.get('pickupStop'),
                    dropoffStop: formData.get('dropoffStop'),
                    emergencyContact: {
                      name: formData.get('emergencyName'),
                      phone: formData.get('emergencyPhone'),
                      relationship: formData.get('emergencyRelationship')
                    },
                    medicalInfo: formData.get('medicalInfo'),
                    specialInstructions: formData.get('specialInstructions')
                  });
                }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        placeholder="John Doe"
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
                      <select
                        name="routeId"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Route</option>
                        {routes.filter(r => r.status === 'active').map(route => (
                          <option key={route.id} value={route.id}>{route.name} - ₦{route.fare.toLocaleString()}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Stop</label>
                      <input
                        type="text"
                        name="pickupStop"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Victoria Island Bus Stop"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Drop-off Stop</label>
                      <input
                        type="text"
                        name="dropoffStop"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Same as pickup (optional)"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <h4 className="font-medium text-gray-900 mb-2">Emergency Contact</h4>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                      <input
                        type="text"
                        name="emergencyName"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Mrs. Jane Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                      <input
                        type="tel"
                        name="emergencyPhone"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="08012345678"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                      <select
                        name="emergencyRelationship"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Relationship</option>
                        <option value="Mother">Mother</option>
                        <option value="Father">Father</option>
                        <option value="Guardian">Guardian</option>
                        <option value="Uncle">Uncle</option>
                        <option value="Aunt">Aunt</option>
                        <option value="Grandparent">Grandparent</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Medical Information</label>
                      <input
                        type="text"
                        name="medicalInfo"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Any medical conditions or allergies"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                      <textarea
                        name="specialInstructions"
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Any special pickup/drop-off instructions"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Register Student
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
