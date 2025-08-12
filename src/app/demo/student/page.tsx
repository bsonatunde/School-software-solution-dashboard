'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Calendar,
  BarChart3,
  MessageSquare,
  FileText,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Award,
  Bell,
  Search,
  Menu,
  X,
  Download,
  Eye,
  School,
  GraduationCap,
  TrendingUp
} from 'lucide-react';
import { 
  demoStudents, 
  demoAssignments, 
  demoResults, 
  demoMessages, 
  demoAttendance,
  getResultsByStudent,
  getAttendanceByStudent,
  getUnreadMessages
} from '@/lib/demo-data';

export default function StudentDemoPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  
  // Demo student data - using Chioma Adebayo
  const currentStudent = demoStudents[0];
  const studentResults = getResultsByStudent(currentStudent.id);
  const studentAttendance = getAttendanceByStudent(currentStudent.id);
  const unreadMessages = getUnreadMessages(currentStudent.email);
  
  // Get assignments for student's class
  const classAssignments = demoAssignments.filter(a => a.class === currentStudent.class);

  const navigationItems = [
    { id: 'overview', label: 'Dashboard', icon: BarChart3 },
    { id: 'assignments', label: 'Assignments', icon: BookOpen },
    { id: 'results', label: 'Results', icon: FileText },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'profile', label: 'Profile', icon: User },
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
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl text-white p-6">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center">
            <GraduationCap className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Welcome back, {currentStudent.name.split(' ')[0]}!</h2>
            <p className="text-purple-100">{currentStudent.class} • {currentStudent.admissionNumber}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Pending Assignments"
          value={classAssignments.filter(a => a.status === 'Active').length}
          subtitle={`${classAssignments.filter(a => a.status === 'Overdue').length} overdue`}
          icon={BookOpen}
          color="bg-blue-500"
          onClick={() => setSelectedTab('assignments')}
        />
        <StatCard
          title="Current Average"
          value="87%"
          subtitle="A1 Grade"
          icon={Award}
          color="bg-green-500"
          onClick={() => setSelectedTab('results')}
        />
        <StatCard
          title="Attendance Rate"
          value="94%"
          subtitle="This term"
          icon={Calendar}
          color="bg-emerald-500"
          onClick={() => setSelectedTab('attendance')}
        />
        <StatCard
          title="Unread Messages"
          value={unreadMessages.length}
          subtitle="New notifications"
          icon={MessageSquare}
          color="bg-purple-500"
          onClick={() => setSelectedTab('messages')}
        />
      </div>

      {/* Recent Assignments & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Assignments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Assignments</h3>
            <button 
              onClick={() => setSelectedTab('assignments')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {classAssignments.slice(0, 3).map((assignment) => (
              <div key={assignment.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-full ${
                  assignment.status === 'Active' ? 'bg-blue-100' :
                  assignment.status === 'Overdue' ? 'bg-red-100' : 'bg-green-100'
                }`}>
                  <BookOpen className={`h-4 w-4 ${
                    assignment.status === 'Active' ? 'text-blue-600' :
                    assignment.status === 'Overdue' ? 'text-red-600' : 'text-green-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{assignment.title}</p>
                  <p className="text-xs text-gray-500">{assignment.subject} • Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  assignment.status === 'Active' ? 'bg-blue-100 text-blue-800' :
                  assignment.status === 'Overdue' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {assignment.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Performance</h3>
          <div className="space-y-4">
            {studentResults.slice(0, 3).map((result) => (
              <div key={result.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{result.subject}</p>
                  <p className="text-xs text-gray-500">{result.term} • {result.session}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{result.grade}</p>
                  <p className="text-xs text-gray-500">{result.total}%</p>
                </div>
              </div>
            ))}
            <button 
              onClick={() => setSelectedTab('results')}
              className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium py-2"
            >
              View Full Report Card
            </button>
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
            <BookOpen className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">View Assignments</p>
          </button>
          <button
            onClick={() => setSelectedTab('results')}
            className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors"
          >
            <FileText className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Check Results</p>
          </button>
          <button
            onClick={() => setSelectedTab('attendance')}
            className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors"
          >
            <Calendar className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Attendance</p>
          </button>
          <button
            onClick={() => setSelectedTab('messages')}
            className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors"
          >
            <MessageSquare className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Messages</p>
          </button>
        </div>
      </div>
    </div>
  );

  const renderAssignments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Assignments</h2>
        <div className="text-sm text-gray-500">
          {currentStudent.class} • {classAssignments.length} total assignments
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search assignments..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <select className="border border-gray-300 rounded-lg px-3 py-2">
              <option>All Subjects</option>
              <option>Mathematics</option>
              <option>English</option>
              <option>Biology</option>
            </select>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {classAssignments.map((assignment) => (
            <div key={assignment.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      assignment.status === 'Active' ? 'bg-blue-100 text-blue-800' :
                      assignment.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {assignment.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <span>{assignment.subject}</span>
                    <span>{assignment.teacher}</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">{assignment.description}</p>
                </div>
                
                <div className="ml-6 flex space-x-2">
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </button>
                  {assignment.status === 'Active' && (
                    <button className="border border-purple-600 text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors">
                      Submit
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Academic Results</h2>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Download Report</span>
        </button>
      </div>
      
      {/* Current Term Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Term Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">87%</div>
            <div className="text-sm text-gray-600">Overall Average</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">A1</div>
            <div className="text-sm text-gray-600">Current Grade</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">2nd</div>
            <div className="text-sm text-gray-600">Class Position</div>
          </div>
        </div>
      </div>

      {/* Subject Results */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Subject Performance</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CA (30%)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam (70%)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {studentResults.map((result) => (
                <tr key={result.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {result.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {result.continuousAssessment}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {result.examination}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {result.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      result.grade.startsWith('A') ? 'bg-green-100 text-green-800' :
                      result.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                      result.grade.startsWith('C') ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {result.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {result.position}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (selectedTab) {
      case 'overview':
        return renderOverview();
      case 'assignments':
        return renderAssignments();
      case 'results':
        return renderResults();
      case 'attendance':
        return (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Attendance History</h3>
            <p className="text-gray-500">View your attendance record and history.</p>
          </div>
        );
      case 'messages':
        return (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Messages</h3>
            <p className="text-gray-500">View messages from teachers and school administration.</p>
          </div>
        );
      case 'profile':
        return (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Student Profile</h3>
            <p className="text-gray-500">View and manage your personal information.</p>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Banner */}
      <div className="bg-purple-600 text-white px-4 py-2 text-center text-sm">
        🎓 <strong>Demo Mode:</strong> Student Portal - Access assignments, results, and school information
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
                <School className="h-8 w-8 text-purple-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Student Portal</h1>
                  <p className="text-sm text-gray-500">Pacey School Solution</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 relative">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadMessages.length}
                </span>
              </button>
              <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {currentStudent.name.split(' ').map(n => n[0]).join('')}
                </span>
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
                        ? 'bg-purple-100 text-purple-700'
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
