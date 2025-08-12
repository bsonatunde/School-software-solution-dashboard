'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Users,
  Calendar,
  FileText,
  BarChart3,
  MessageSquare,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  UserCheck,
  PlusCircle,
  Eye,
  Edit,
  Clock,
  CheckCircle,
  AlertCircle,
  School,
  GraduationCap
} from 'lucide-react';
import { demoAssignments, demoStudents, getStudentsByClass, demoTeachers } from '@/lib/demo-data';

export default function TeacherDemoPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  
  // Demo teacher data
  const currentTeacher = demoTeachers[0]; // Mrs. Sarah Ibrahim
  const myClasses = currentTeacher.classes;
  const mySubjects = currentTeacher.subjects;
  const myAssignments = demoAssignments.filter(a => a.teacher === currentTeacher.name);

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'classes', label: 'My Classes', icon: Users },
    { id: 'assignments', label: 'Assignments', icon: BookOpen },
    { id: 'attendance', label: 'Attendance', icon: UserCheck },
    { id: 'grades', label: 'Grades', icon: FileText },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
  ];

  const StatCard = ({ title, value, subtitle, icon: Icon, color, onClick }: any) => (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white p-6">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center">
            <GraduationCap className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Welcome back, {currentTeacher.name}!</h2>
            <p className="text-blue-100">Mathematics Department • {currentTeacher.employeeId}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="My Classes"
          value={myClasses.length}
          subtitle={`${mySubjects.length} subjects`}
          icon={Users}
          color="bg-blue-500"
          onClick={() => setSelectedTab('classes')}
        />
        <StatCard
          title="Active Assignments"
          value={myAssignments.filter(a => a.status === 'Active').length}
          subtitle={`${myAssignments.filter(a => a.status === 'Overdue').length} overdue`}
          icon={BookOpen}
          color="bg-green-500"
          onClick={() => setSelectedTab('assignments')}
        />
        <StatCard
          title="Students Present"
          value="89"
          subtitle="94% attendance today"
          icon={UserCheck}
          color="bg-emerald-500"
          onClick={() => setSelectedTab('attendance')}
        />
        <StatCard
          title="Pending Grades"
          value="12"
          subtitle="Assignments to grade"
          icon={FileText}
          color="bg-purple-500"
          onClick={() => setSelectedTab('grades')}
        />
      </div>

      {/* Today's Schedule & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-blue-600">8:00 AM</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Mathematics - SS 2A</p>
                <p className="text-xs text-gray-500">Room 204 • Algebra</p>
              </div>
              <div className="text-xs text-green-600 font-medium">Current</div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-600">10:00 AM</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Further Math - SS 3A</p>
                <p className="text-xs text-gray-500">Room 204 • Calculus</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-600">2:00 PM</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Mathematics - SS 1A</p>
                <p className="text-xs text-gray-500">Room 204 • Geometry</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Assignment graded</p>
                <p className="text-xs text-gray-500">Quadratic Equations - SS 2A</p>
              </div>
              <div className="text-xs text-gray-500">2 hours ago</div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <BookOpen className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New assignment created</p>
                <p className="text-xs text-gray-500">Trigonometry Practice - SS 1A</p>
              </div>
              <div className="text-xs text-gray-500">1 day ago</div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <UserCheck className="h-4 w-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Attendance marked</p>
                <p className="text-xs text-gray-500">SS 3A - 28/30 present</p>
              </div>
              <div className="text-xs text-gray-500">2 days ago</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setSelectedTab('assignments')}
            className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors"
          >
            <PlusCircle className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Create Assignment</p>
          </button>
          <button
            onClick={() => setSelectedTab('attendance')}
            className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors"
          >
            <UserCheck className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Mark Attendance</p>
          </button>
          <button
            onClick={() => setSelectedTab('grades')}
            className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors"
          >
            <FileText className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Grade Papers</p>
          </button>
          <button
            onClick={() => setSelectedTab('messages')}
            className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors"
          >
            <MessageSquare className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Send Message</p>
          </button>
        </div>
      </div>
    </div>
  );

  const renderClasses = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Classes</h2>
        <div className="text-sm text-gray-500">
          {myClasses.length} classes • {mySubjects.join(', ')}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myClasses.map((className, index) => {
          const classStudents = getStudentsByClass(className);
          return (
            <div key={className} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{className}</h3>
                <div className="p-2 bg-blue-100 rounded-full">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Students:</span>
                  <span className="font-medium">{classStudents.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subject:</span>
                  <span className="font-medium">{mySubjects[index % mySubjects.length]}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Attendance Today:</span>
                  <span className="font-medium text-green-600">94%</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setSelectedTab('attendance')}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Take Attendance
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderAssignments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Assignments</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <PlusCircle className="h-4 w-4" />
          <span>Create Assignment</span>
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search assignments..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select className="border border-gray-300 rounded-lg px-3 py-2">
              <option>All Status</option>
              <option>Active</option>
              <option>Completed</option>
              <option>Overdue</option>
            </select>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {myAssignments.map((assignment) => (
            <div key={assignment.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      assignment.status === 'Active' ? 'bg-green-100 text-green-800' :
                      assignment.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {assignment.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <span>{assignment.subject} • {assignment.class}</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">{assignment.description}</p>
                </div>
                
                <div className="ml-6 text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {assignment.submissions}/{assignment.totalStudents}
                  </div>
                  <div className="text-xs text-gray-500">submissions</div>
                  <div className="mt-2 flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900 text-sm">
                      View
                    </button>
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (selectedTab) {
      case 'overview':
        return renderOverview();
      case 'classes':
        return renderClasses();
      case 'assignments':
        return renderAssignments();
      case 'attendance':
        return (
          <div className="text-center py-12">
            <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Attendance Management</h3>
            <p className="text-gray-500">Mark and track student attendance for your classes.</p>
          </div>
        );
      case 'grades':
        return (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Grade Management</h3>
            <p className="text-gray-500">Grade assignments and track student performance.</p>
          </div>
        );
      case 'messages':
        return (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Messages</h3>
            <p className="text-gray-500">Communicate with students, parents, and colleagues.</p>
          </div>
        );
      case 'schedule':
        return (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Schedule</h3>
            <p className="text-gray-500">View your teaching schedule and upcoming events.</p>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Banner */}
      <div className="bg-green-600 text-white px-4 py-2 text-center text-sm">
        👩‍🏫 <strong>Demo Mode:</strong> Teacher Dashboard - Manage classes, assignments, and student progress
        <Link href="/demo" className="ml-4 underline hover:no-underline">
          ← Back to Demo Selection
        </Link>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-3">
                <School className="h-8 w-8 text-green-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Teacher Dashboard</h1>
                  <p className="text-sm text-gray-500">Pacey School Solution</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 relative">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  2
                </span>
              </button>
              <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">SI</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:transition-none`}>
          <div className="flex items-center justify-between p-4 lg:hidden">
            <span className="text-lg font-semibold">Menu</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="mt-8 px-4">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      selectedTab === item.id
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent className="mr-3 h-5 w-5" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
