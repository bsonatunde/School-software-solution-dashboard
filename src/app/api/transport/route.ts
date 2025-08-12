import { NextRequest, NextResponse } from 'next/server';

// Mock database for vehicles
const mockVehicles = [
  {
    id: 'vehicle1',
    vehicleNumber: 'SCH-001-NGR',
    type: 'Bus',
    capacity: 35,
    driverName: 'Mr. Ibrahim Musa',
    driverPhone: '08012345678',
    driverLicense: 'ABC123456789',
    route: 'Victoria Island - Lekki',
    status: 'active',
    condition: 'good',
    lastMaintenance: '2024-10-15',
    nextMaintenance: '2024-12-15',
    insuranceExpiry: '2025-06-30',
    roadWorthinessExpiry: '2025-03-15',
    fuelType: 'diesel',
    yearOfManufacture: 2020,
    engineNumber: 'ENG123456',
    chassisNumber: 'CHS789012',
    registrationDate: '2020-08-15',
    averageFuelConsumption: 8.5, // km per liter
    monthlyMaintenanceCost: 45000,
    gpsTrackingId: 'GPS-001'
  },
  {
    id: 'vehicle2',
    vehicleNumber: 'SCH-002-NGR',
    type: 'Van',
    capacity: 18,
    driverName: 'Mr. Emeka Okafor',
    driverPhone: '08023456789',
    driverLicense: 'DEF123456789',
    route: 'Ikeja - Maryland',
    status: 'active',
    condition: 'good',
    lastMaintenance: '2024-11-01',
    nextMaintenance: '2025-01-01',
    insuranceExpiry: '2025-08-20',
    roadWorthinessExpiry: '2025-05-10',
    fuelType: 'petrol',
    yearOfManufacture: 2019,
    engineNumber: 'ENG234567',
    chassisNumber: 'CHS890123',
    registrationDate: '2019-05-20',
    averageFuelConsumption: 12.0,
    monthlyMaintenanceCost: 35000,
    gpsTrackingId: 'GPS-002'
  },
  {
    id: 'vehicle3',
    vehicleNumber: 'SCH-003-NGR',
    type: 'Bus',
    capacity: 40,
    driverName: 'Mr. Kola Adebayo',
    driverPhone: '08034567890',
    driverLicense: 'GHI123456789',
    route: 'Surulere - Yaba',
    status: 'maintenance',
    condition: 'fair',
    lastMaintenance: '2024-11-20',
    nextMaintenance: '2024-12-20',
    insuranceExpiry: '2025-04-15',
    roadWorthinessExpiry: '2025-02-28',
    fuelType: 'diesel',
    yearOfManufacture: 2018,
    engineNumber: 'ENG345678',
    chassisNumber: 'CHS901234',
    registrationDate: '2018-03-10',
    averageFuelConsumption: 7.8,
    monthlyMaintenanceCost: 55000,
    gpsTrackingId: 'GPS-003'
  }
];

// Mock database for routes
const mockRoutes = [
  {
    id: 'route1',
    name: 'Victoria Island - Lekki Route',
    code: 'VIL-001',
    startLocation: 'Victoria Island',
    endLocation: 'School (Lekki)',
    distance: 15.5, // km
    estimatedDuration: 45, // minutes
    stops: [
      { name: 'Victoria Island Bus Stop', time: '07:00', coordinates: { lat: 6.4281, lng: 3.4219 } },
      { name: 'Falomo Bridge', time: '07:10', coordinates: { lat: 6.4394, lng: 3.4308 } },
      { name: 'Ikoyi Link Bridge', time: '07:20', coordinates: { lat: 6.4630, lng: 3.4536 } },
      { name: 'Lekki Phase 1', time: '07:35', coordinates: { lat: 6.4698, lng: 3.4630 } },
      { name: 'School Gate (Lekki)', time: '07:45', coordinates: { lat: 6.4892, lng: 3.4781 } }
    ],
    fare: 2500,
    vehicleId: 'vehicle1',
    status: 'active',
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    morningDeparture: '07:00',
    afternoonDeparture: '15:30'
  },
  {
    id: 'route2',
    name: 'Ikeja - Maryland Route',
    code: 'IKM-002',
    startLocation: 'Ikeja',
    endLocation: 'School (Lekki)',
    distance: 22.3,
    estimatedDuration: 60,
    stops: [
      { name: 'Ikeja Bus Terminal', time: '06:45', coordinates: { lat: 6.5924, lng: 3.3375 } },
      { name: 'Allen Avenue', time: '06:55', coordinates: { lat: 6.5974, lng: 3.3539 } },
      { name: 'Maryland Mall', time: '07:10', coordinates: { lat: 6.5733, lng: 3.3669 } },
      { name: 'National Theatre', time: '07:25', coordinates: { lat: 6.4641, lng: 3.3895 } },
      { name: 'Third Mainland Bridge', time: '07:35', coordinates: { lat: 6.4503, lng: 3.3951 } },
      { name: 'School Gate (Lekki)', time: '07:45', coordinates: { lat: 6.4892, lng: 3.4781 } }
    ],
    fare: 3000,
    vehicleId: 'vehicle2',
    status: 'active',
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    morningDeparture: '06:45',
    afternoonDeparture: '15:30'
  },
  {
    id: 'route3',
    name: 'Surulere - Yaba Route',
    code: 'SYR-003',
    startLocation: 'Surulere',
    endLocation: 'School (Lekki)',
    distance: 18.7,
    estimatedDuration: 55,
    stops: [
      { name: 'Surulere Stadium', time: '06:50', coordinates: { lat: 6.5080, lng: 3.3515 } },
      { name: 'Shitta Market', time: '07:00', coordinates: { lat: 6.5043, lng: 3.3578 } },
      { name: 'Yaba Market', time: '07:15', coordinates: { lat: 6.5158, lng: 3.3707 } },
      { name: 'University of Lagos', time: '07:25', coordinates: { lat: 6.5158, lng: 3.3889 } },
      { name: 'Herbert Macaulay Way', time: '07:35', coordinates: { lat: 6.4889, lng: 3.3611 } },
      { name: 'School Gate (Lekki)', time: '07:45', coordinates: { lat: 6.4892, lng: 3.4781 } }
    ],
    fare: 2800,
    vehicleId: 'vehicle3',
    status: 'suspended',
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    morningDeparture: '06:50',
    afternoonDeparture: '15:30'
  }
];

// Mock database for student transport records
const mockStudentTransport = [
  {
    id: 'transport1',
    studentId: 'STU001',
    studentName: 'Adebayo Johnson',
    studentClass: 'SS 2A',
    routeId: 'route1',
    routeName: 'Victoria Island - Lekki Route',
    pickupStop: 'Victoria Island Bus Stop',
    dropoffStop: 'Victoria Island Bus Stop',
    monthlyFee: 2500,
    status: 'active',
    paymentStatus: 'paid',
    lastPaymentDate: '2024-11-01',
    nextPaymentDue: '2024-12-01',
    emergencyContact: {
      name: 'Mrs. Folake Johnson',
      phone: '08011111111',
      relationship: 'Mother'
    },
    medicalInfo: 'No known allergies',
    specialInstructions: 'Pick up at gate number 2'
  },
  {
    id: 'transport2',
    studentId: 'STU002',
    studentName: 'Fatima Ibrahim',
    studentClass: 'JSS 3B',
    routeId: 'route2',
    routeName: 'Ikeja - Maryland Route',
    pickupStop: 'Allen Avenue',
    dropoffStop: 'Allen Avenue',
    monthlyFee: 3000,
    status: 'active',
    paymentStatus: 'pending',
    lastPaymentDate: '2024-10-01',
    nextPaymentDue: '2024-11-01',
    emergencyContact: {
      name: 'Mr. Usman Ibrahim',
      phone: '08022222222',
      relationship: 'Father'
    },
    medicalInfo: 'Asthmatic - inhaler required',
    specialInstructions: 'Ensure inhaler is accessible'
  },
  {
    id: 'transport3',
    studentId: 'STU003',
    studentName: 'Emmanuel Okonkwo',
    studentClass: 'SS 1B',
    routeId: 'route1',
    routeName: 'Victoria Island - Lekki Route',
    pickupStop: 'Lekki Phase 1',
    dropoffStop: 'Lekki Phase 1',
    monthlyFee: 2500,
    status: 'active',
    paymentStatus: 'paid',
    lastPaymentDate: '2024-11-01',
    nextPaymentDue: '2024-12-01',
    emergencyContact: {
      name: 'Mrs. Grace Okonkwo',
      phone: '08033333333',
      relationship: 'Mother'
    },
    medicalInfo: 'No medical conditions',
    specialInstructions: 'None'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'vehicles', 'routes', 'students'
    const status = searchParams.get('status');
    const routeId = searchParams.get('routeId');
    const search = searchParams.get('search');

    let result = {};

    if (type === 'vehicles' || !type) {
      let filteredVehicles = [...mockVehicles];

      if (status && status !== '') {
        filteredVehicles = filteredVehicles.filter(vehicle => vehicle.status === status);
      }

      if (search && search !== '') {
        const searchTerm = search.toLowerCase();
        filteredVehicles = filteredVehicles.filter(vehicle =>
          vehicle.vehicleNumber.toLowerCase().includes(searchTerm) ||
          vehicle.driverName.toLowerCase().includes(searchTerm) ||
          vehicle.route.toLowerCase().includes(searchTerm)
        );
      }

      result = { ...result, vehicles: filteredVehicles };
    }

    if (type === 'routes' || !type) {
      let filteredRoutes = [...mockRoutes];

      if (status && status !== '') {
        filteredRoutes = filteredRoutes.filter(route => route.status === status);
      }

      if (search && search !== '') {
        const searchTerm = search.toLowerCase();
        filteredRoutes = filteredRoutes.filter(route =>
          route.name.toLowerCase().includes(searchTerm) ||
          route.code.toLowerCase().includes(searchTerm) ||
          route.startLocation.toLowerCase().includes(searchTerm) ||
          route.endLocation.toLowerCase().includes(searchTerm)
        );
      }

      result = { ...result, routes: filteredRoutes };
    }

    if (type === 'students' || !type) {
      let filteredStudents = [...mockStudentTransport];

      if (routeId && routeId !== '') {
        filteredStudents = filteredStudents.filter(student => student.routeId === routeId);
      }

      if (status && status !== '') {
        filteredStudents = filteredStudents.filter(student => student.status === status);
      }

      if (search && search !== '') {
        const searchTerm = search.toLowerCase();
        filteredStudents = filteredStudents.filter(student =>
          student.studentName.toLowerCase().includes(searchTerm) ||
          student.studentClass.toLowerCase().includes(searchTerm) ||
          student.routeName.toLowerCase().includes(searchTerm)
        );
      }

      result = { ...result, students: filteredStudents };
    }

    // Calculate statistics
    const statistics = {
      totalVehicles: mockVehicles.length,
      activeVehicles: mockVehicles.filter(v => v.status === 'active').length,
      maintenanceVehicles: mockVehicles.filter(v => v.status === 'maintenance').length,
      totalRoutes: mockRoutes.length,
      activeRoutes: mockRoutes.filter(r => r.status === 'active').length,
      totalStudents: mockStudentTransport.length,
      activeStudents: mockStudentTransport.filter(s => s.status === 'active').length,
      pendingPayments: mockStudentTransport.filter(s => s.paymentStatus === 'pending').length,
      monthlyRevenue: mockStudentTransport
        .filter(s => s.status === 'active')
        .reduce((sum, s) => sum + s.monthlyFee, 0),
      averageRouteDistance: mockRoutes.reduce((sum, r) => sum + r.distance, 0) / mockRoutes.length,
      totalCapacity: mockVehicles.reduce((sum, v) => sum + v.capacity, 0),
      utilizationRate: ((mockStudentTransport.filter(s => s.status === 'active').length / 
        mockVehicles.filter(v => v.status === 'active').reduce((sum, v) => sum + v.capacity, 0)) * 100).toFixed(1)
    };

    return NextResponse.json({
      success: true,
      ...result,
      statistics
    });

  } catch (error) {
    console.error('Error fetching transport data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transport data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { type } = data; // 'vehicle', 'route', 'student'

    if (type === 'vehicle') {
      // Add new vehicle
      const requiredFields = ['vehicleNumber', 'type', 'capacity', 'driverName', 'driverPhone', 'route'];
      for (const field of requiredFields) {
        if (!data[field]) {
          return NextResponse.json(
            { success: false, error: `${field} is required` },
            { status: 400 }
          );
        }
      }

      // Check if vehicle number already exists
      const existingVehicle = mockVehicles.find(v => v.vehicleNumber === data.vehicleNumber);
      if (existingVehicle) {
        return NextResponse.json(
          { success: false, error: 'Vehicle number already exists' },
          { status: 400 }
        );
      }

      const newVehicle = {
        id: `vehicle${mockVehicles.length + 1}`,
        vehicleNumber: data.vehicleNumber,
        type: data.type,
        capacity: parseInt(data.capacity),
        driverName: data.driverName,
        driverPhone: data.driverPhone,
        driverLicense: data.driverLicense || '',
        route: data.route,
        status: data.status || 'active',
        condition: data.condition || 'good',
        lastMaintenance: data.lastMaintenance || new Date().toISOString().split('T')[0],
        nextMaintenance: data.nextMaintenance || '',
        insuranceExpiry: data.insuranceExpiry || '',
        roadWorthinessExpiry: data.roadWorthinessExpiry || '',
        fuelType: data.fuelType || 'petrol',
        yearOfManufacture: parseInt(data.yearOfManufacture) || new Date().getFullYear(),
        engineNumber: data.engineNumber || '',
        chassisNumber: data.chassisNumber || '',
        registrationDate: data.registrationDate || new Date().toISOString().split('T')[0],
        averageFuelConsumption: parseFloat(data.averageFuelConsumption) || 10.0,
        monthlyMaintenanceCost: parseFloat(data.monthlyMaintenanceCost) || 30000,
        gpsTrackingId: data.gpsTrackingId || ''
      };

      mockVehicles.push(newVehicle);

      return NextResponse.json({
        success: true,
        message: 'Vehicle added successfully',
        vehicle: newVehicle
      });

    } else if (type === 'route') {
      // Add new route
      const requiredFields = ['name', 'code', 'startLocation', 'endLocation', 'distance', 'fare'];
      for (const field of requiredFields) {
        if (!data[field]) {
          return NextResponse.json(
            { success: false, error: `${field} is required` },
            { status: 400 }
          );
        }
      }

      const newRoute = {
        id: `route${mockRoutes.length + 1}`,
        name: data.name,
        code: data.code,
        startLocation: data.startLocation,
        endLocation: data.endLocation,
        distance: parseFloat(data.distance),
        estimatedDuration: parseInt(data.estimatedDuration) || 60,
        stops: data.stops || [],
        fare: parseFloat(data.fare),
        vehicleId: data.vehicleId || '',
        status: data.status || 'active',
        operatingDays: data.operatingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        morningDeparture: data.morningDeparture || '07:00',
        afternoonDeparture: data.afternoonDeparture || '15:30'
      };

      mockRoutes.push(newRoute);

      return NextResponse.json({
        success: true,
        message: 'Route added successfully',
        route: newRoute
      });

    } else if (type === 'student') {
      // Add student to transport
      const requiredFields = ['studentId', 'studentName', 'studentClass', 'routeId', 'pickupStop'];
      for (const field of requiredFields) {
        if (!data[field]) {
          return NextResponse.json(
            { success: false, error: `${field} is required` },
            { status: 400 }
          );
        }
      }

      // Check if student already registered for transport
      const existingStudent = mockStudentTransport.find(s => s.studentId === data.studentId);
      if (existingStudent) {
        return NextResponse.json(
          { success: false, error: 'Student already registered for transport' },
          { status: 400 }
        );
      }

      // Find route to get fee and name
      const route = mockRoutes.find(r => r.id === data.routeId);
      if (!route) {
        return NextResponse.json(
          { success: false, error: 'Route not found' },
          { status: 404 }
        );
      }

      const newStudentTransport = {
        id: `transport${mockStudentTransport.length + 1}`,
        studentId: data.studentId,
        studentName: data.studentName,
        studentClass: data.studentClass,
        routeId: data.routeId,
        routeName: route.name,
        pickupStop: data.pickupStop,
        dropoffStop: data.dropoffStop || data.pickupStop,
        monthlyFee: route.fare,
        status: data.status || 'active',
        paymentStatus: data.paymentStatus || 'pending',
        lastPaymentDate: data.lastPaymentDate || '',
        nextPaymentDue: data.nextPaymentDue || '',
        emergencyContact: data.emergencyContact || {},
        medicalInfo: data.medicalInfo || '',
        specialInstructions: data.specialInstructions || ''
      };

      mockStudentTransport.push(newStudentTransport);

      return NextResponse.json({
        success: true,
        message: 'Student registered for transport successfully',
        studentTransport: newStudentTransport
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid type specified' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error adding transport data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add transport data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');
    const updateData = await request.json();

    if (!id || !type) {
      return NextResponse.json(
        { success: false, error: 'ID and type are required' },
        { status: 400 }
      );
    }

    if (type === 'vehicle') {
      const vehicleIndex = mockVehicles.findIndex(v => v.id === id);
      if (vehicleIndex === -1) {
        return NextResponse.json(
          { success: false, error: 'Vehicle not found' },
          { status: 404 }
        );
      }

      mockVehicles[vehicleIndex] = {
        ...mockVehicles[vehicleIndex],
        ...updateData
      };

      return NextResponse.json({
        success: true,
        message: 'Vehicle updated successfully',
        vehicle: mockVehicles[vehicleIndex]
      });

    } else if (type === 'route') {
      const routeIndex = mockRoutes.findIndex(r => r.id === id);
      if (routeIndex === -1) {
        return NextResponse.json(
          { success: false, error: 'Route not found' },
          { status: 404 }
        );
      }

      mockRoutes[routeIndex] = {
        ...mockRoutes[routeIndex],
        ...updateData
      };

      return NextResponse.json({
        success: true,
        message: 'Route updated successfully',
        route: mockRoutes[routeIndex]
      });

    } else if (type === 'student') {
      const studentIndex = mockStudentTransport.findIndex(s => s.id === id);
      if (studentIndex === -1) {
        return NextResponse.json(
          { success: false, error: 'Student transport record not found' },
          { status: 404 }
        );
      }

      mockStudentTransport[studentIndex] = {
        ...mockStudentTransport[studentIndex],
        ...updateData
      };

      return NextResponse.json({
        success: true,
        message: 'Student transport record updated successfully',
        studentTransport: mockStudentTransport[studentIndex]
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid type specified' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error updating transport data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update transport data' },
      { status: 500 }
    );
  }
}
