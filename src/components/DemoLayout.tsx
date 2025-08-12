'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { 
  Menu, 
  X, 
  Bell, 
  School,
  ArrowLeft,
  Play,
  Users,
  GraduationCap,
  BookOpen
} from 'lucide-react';

interface DemoLayoutProps {
  children: ReactNode;
  userType: 'admin' | 'teacher' | 'student';
  userName: string;
  userInitials: string;
  unreadCount?: number;
  navigationItems: Array<{
    id: string;
    label: string;
    icon: any;
  }>;
  selectedTab: string;
  onTabChange: (tabId: string) => void;
}

const DemoLayout = ({
  children,
  userType,
  userName,
  userInitials,
  unreadCount = 0,
  navigationItems,
  selectedTab,
  onTabChange
}: DemoLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getBannerConfig = () => {
    switch (userType) {
      case 'admin':
        return {
          bg: 'bg-red-600',
          icon: '🎯',
          title: 'Administrator Dashboard',
          description: 'Explore full school management capabilities'
        };
      case 'teacher':
        return {
          bg: 'bg-green-600',
          icon: '👩‍🏫',
          title: 'Teacher Dashboard',
          description: 'Manage classes, assignments, and student progress'
        };
      case 'student':
        return {
          bg: 'bg-purple-600',
          icon: '🎓',
          title: 'Student Portal',
          description: 'Access assignments, results, and school information'
        };
      default:
        return {
          bg: 'bg-blue-600',
          icon: '📚',
          title: 'Demo Dashboard',
          description: 'Explore the school management system'
        };
    }
  };

  const getThemeColor = () => {
    switch (userType) {
      case 'admin':
        return {
          primary: 'text-red-600',
          bg: 'bg-red-600',
          light: 'bg-red-100',
          active: 'bg-red-100 text-red-700'
        };
      case 'teacher':
        return {
          primary: 'text-green-600',
          bg: 'bg-green-600',
          light: 'bg-green-100',
          active: 'bg-green-100 text-green-700'
        };
      case 'student':
        return {
          primary: 'text-purple-600',
          bg: 'bg-purple-600',
          light: 'bg-purple-100',
          active: 'bg-purple-100 text-purple-700'
        };
      default:
        return {
          primary: 'text-blue-600',
          bg: 'bg-blue-600',
          light: 'bg-blue-100',
          active: 'bg-blue-100 text-blue-700'
        };
    }
  };

  const bannerConfig = getBannerConfig();
  const themeColors = getThemeColor();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Banner */}
      <div className={`${bannerConfig.bg} text-white px-4 py-2 text-center text-sm`}>
        {bannerConfig.icon} <strong>Demo Mode:</strong> {bannerConfig.title} - {bannerConfig.description}
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
                <School className={`h-8 w-8 ${themeColors.primary}`} />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {bannerConfig.title.split(' ')[0]} Dashboard
                  </h1>
                  <p className="text-sm text-gray-500">Pacey School Solution</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Demo Info Button */}
              <Link
                href="/demo"
                className="hidden sm:flex items-center space-x-2 text-gray-600 hover:text-gray-900 text-sm"
              >
                <Play className="h-4 w-4" />
                <span>Try Other Demos</span>
              </Link>
              
              <button className="p-2 text-gray-600 hover:text-gray-900 relative">
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              <div className={`h-8 w-8 ${themeColors.bg} rounded-full flex items-center justify-center`}>
                <span className="text-white font-medium text-sm">
                  {userInitials}
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
          
          {/* Demo Navigation */}
          <div className="p-4 border-b border-gray-200">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">Demo Navigation</div>
            <div className="space-y-1">
              <Link
                href="/demo/admin"
                className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                  userType === 'admin' ? 'bg-red-100 text-red-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Users className="mr-2 h-4 w-4" />
                Admin Demo
              </Link>
              <Link
                href="/demo/teacher"
                className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                  userType === 'teacher' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <GraduationCap className="mr-2 h-4 w-4" />
                Teacher Demo
              </Link>
              <Link
                href="/demo/student"
                className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                  userType === 'student' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Student Demo
              </Link>
            </div>
          </div>
          
          <nav className="mt-4 px-4">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">
              {userName.split(' ')[0]}'s Dashboard
            </div>
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      selectedTab === item.id
                        ? themeColors.active
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
            {children}
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
};

export default DemoLayout;
