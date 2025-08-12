'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: 'admin' | 'teacher' | 'parent' | 'student';
}

export default function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigationItems = {
    admin: [
      { name: 'Dashboard', href: '/admin', icon: '📊' },
      { name: 'Students', href: '/students', icon: '👨‍🎓' },
      { name: 'Teachers', href: '/teachers', icon: '👨‍🏫' },
      { name: 'Staff', href: '/staff', icon: '👥' },
      { name: 'Classes', href: '/admin/classes', icon: '🏫' },
      { name: 'Assignments', href: '/admin/assignments', icon: '📝' },
      { name: 'Attendance', href: '/attendance', icon: '📅' },
      { name: 'Results', href: '/results', icon: '📈' },
      { name: 'Leave Management', href: '/admin/leave-management', icon: '🏖️' },
      { name: 'Timetable', href: '/timetable', icon: '🗓️' },
      { name: 'Library', href: '/library', icon: '📚' },
      { name: 'Transport', href: '/transport', icon: '🚌' },
      { name: 'Fees', href: '/fees', icon: '💰' },
      { name: 'Payroll', href: '/payroll', icon: '💵' },
      { name: 'Messages', href: '/admin/messages', icon: '📨' },
      { name: 'Reports', href: '/admin/reports', icon: '📋' },
      { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
    ],
    teacher: [
      { name: 'Dashboard', href: '/teacher', icon: '📊' },
      { name: 'My Classes', href: '/teacher/classes', icon: '🏫' },
      { name: 'Assignments', href: '/teacher/assignments', icon: '📝' },
      { name: 'Attendance', href: '/teacher/attendance', icon: '📅' },
      { name: 'Results', href: '/teacher/results', icon: '📈' },
      { name: 'Students', href: '/teacher/students', icon: '👨‍🎓' },
      { name: 'Messages', href: '/teacher/messages', icon: '📨' },
      { name: 'Timetable', href: '/teacher/timetable', icon: '🕐' },
    ],
    parent: [
      { name: 'Dashboard', href: '/parent', icon: '📊' },
      { name: 'My Children', href: '/parent/children', icon: '👨‍👩‍👧' },
      { name: 'Attendance', href: '/parent/attendance', icon: '📅' },
      { name: 'Results', href: '/parent/results', icon: '📈' },
      { name: 'Fees', href: '/parent/fees', icon: '💰' },
      { name: 'Messages', href: '/parent/messages', icon: '📨' },
      { name: 'Timetable', href: '/parent/timetable', icon: '🕐' },
    ],
    student: [
      { name: 'Dashboard', href: '/student', icon: '📊' },
      { name: 'My Classes', href: '/student/classes', icon: '🏫' },
      { name: 'Attendance', href: '/student/attendance', icon: '📅' },
      { name: 'Results', href: '/student/results', icon: '📈' },
      { name: 'Assignments', href: '/student/assignments', icon: '📝' },
      { name: 'Messages', href: '/student/messages', icon: '📨' },
      { name: 'Timetable', href: '/student/timetable', icon: '🕐' },
    ]
  };

  const currentNav = navigationItems[userRole] || navigationItems.admin;

  // Fetch notifications
  const fetchNotifications = async () => {
    if (userRole === 'student') {
      try {
        setLoading(true);
        const response = await fetch('/api/notifications?studentId=student-001&limit=5');
        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            setNotifications(data.data || []);
            setUnreadCount(data.stats?.unread || 0);
          } else {
            console.error('Notifications API returned non-JSON response');
          }
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // For other roles, use message API for notifications
      try {
        setLoading(true);
        const response = await fetch('/api/messages?limit=5');
        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            const unreadMessages = (data.data || []).filter((msg: any) => msg.status !== 'Read');
            setNotifications(data.data || []);
            setUnreadCount(unreadMessages.length);
          } else {
            console.error('Messages API returned non-JSON response');
          }
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole]);

  const markAsRead = async (notificationId: string) => {
    // Implement mark as read functionality
    setNotifications(prev => 
      prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)}h ago`;
    } else if (diffDays < 7) {
      return `${Math.floor(diffDays)}d ago`;
    } else {
      return date.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-center h-16 bg-primary-600 dark:bg-primary-700">
          <h1 className="text-white text-xl font-bold">📚 Pacey School</h1>
        </div>
        
        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {currentNav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-700 hover:text-primary-700 dark:hover:text-primary-400 transition-colors group"
              >
                <span className="text-xl mr-3">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 w-full p-4">
          <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-10 h-10 bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {userRole === 'admin' ? '👑' : userRole === 'teacher' ? '👨‍🏫' : userRole === 'parent' ? '👨‍👩‍👧' : '👨‍🎓'}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">{userRole}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">John Doe</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Top navbar */}
        <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 lg:hidden"
            >
              <span className="text-2xl">☰</span>
            </button>
            <h2 className="ml-4 text-xl font-semibold text-gray-800 dark:text-gray-200 capitalize">
              {userRole} Dashboard
            </h2>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Notifications Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 relative"
              >
                <span className="text-xl">🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {loading ? (
                      <div className="p-4 text-center text-gray-500">
                        Loading notifications...
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        <span className="text-4xl mb-2 block">🔔</span>
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((notification, index) => (
                        <div
                          key={notification._id || index}
                          className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                            !notification.isRead ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => markAsRead(notification._id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <span className="text-2xl">
                                {notification.type === 'assignment' ? '📝' : 
                                 notification.type === 'grade' ? '📊' : 
                                 notification.type === 'message' ? '💬' : '📢'}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.title || notification.subject || 'New notification'}
                              </p>
                              <p className="text-sm text-gray-600 truncate">
                                {notification.message || notification.content || 'No content available'}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {formatDate(notification.createdAt || notification.sentDate)}
                              </p>
                            </div>
                            {!notification.isRead && (
                              <div className="flex-shrink-0">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="p-4 border-t">
                    <Link 
                      href={userRole === 'student' ? '/student/notifications' : `/${userRole}/messages`}
                      className="block text-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                      onClick={() => setShowNotifications(false)}
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Settings Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <span className="text-xl">⚙️</span>
              </button>

              {showSettings && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-50">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
                      <button
                        onClick={() => setShowSettings(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <Link
                      href={`/${userRole}/profile`}
                      className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                      onClick={() => setShowSettings(false)}
                    >
                      <span className="mr-3">👤</span>
                      Profile Settings
                    </Link>
                    
                    <Link
                      href={`/${userRole}/preferences`}
                      className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                      onClick={() => setShowSettings(false)}
                    >
                      <span className="mr-3">🎨</span>
                      Preferences
                    </Link>
                    
                    <Link
                      href={`/${userRole}/notifications-settings`}
                      className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                      onClick={() => setShowSettings(false)}
                    >
                      <span className="mr-3">🔔</span>
                      Notification Settings
                    </Link>
                    
                    {userRole === 'admin' && (
                      <>
                        <Link
                          href="/admin/system-settings"
                          className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                          onClick={() => setShowSettings(false)}
                        >
                          <span className="mr-3">🛠️</span>
                          System Settings
                        </Link>
                        
                        <Link
                          href="/admin/database"
                          className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                          onClick={() => setShowSettings(false)}
                        >
                          <span className="mr-3">🗄️</span>
                          Database Management
                        </Link>
                      </>
                    )}
                    
                    <hr className="my-2" />
                    
                    <button
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      onClick={() => {
                        setShowSettings(false);
                        // Add help/support functionality
                        alert('Help & Support feature coming soon!');
                      }}
                    >
                      <span className="mr-3">❓</span>
                      Help & Support
                    </button>
                    
                    <button
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      onClick={() => {
                        setShowSettings(false);
                        // Add about functionality
                        alert('Pacey School Management System v1.0\n\nBuilt for Nigerian Educational Institutions\n\n© 2025 Pacey Solutions');
                      }}
                    >
                      <span className="mr-3">ℹ️</span>
                      About
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
              onClick={() => {
                // TODO: Add actual sign out logic here (e.g., clear cookies, localStorage, call API)
                if (typeof window !== 'undefined') {
                  localStorage.clear();
                  sessionStorage.clear();
                  // Optionally, call an API endpoint to invalidate the session
                  window.location.href = '/login';
                }
              }}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Dropdown overlays */}
      {(showNotifications || showSettings) && (
        <div 
          className="fixed inset-0 z-30"
          onClick={() => {
            setShowNotifications(false);
            setShowSettings(false);
          }}
        />
      )}
    </div>
  );
}
