'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  BarChart3, 
  Calendar, 
  MessageSquare,
  DollarSign,
  Shield,
  ChevronRight,
  Play,
  UserCheck,
  School
} from 'lucide-react';

export default function DemoPage() {
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);

  const demoRoles = [
    {
      id: 'admin',
      title: 'Administrator Dashboard',
      description: 'Complete school management overview with analytics, user management, and system controls',
      icon: Shield,
      color: 'bg-red-500',
      features: ['Student & Teacher Management', 'Analytics & Reports', 'System Settings', 'Messaging System'],
      href: '/demo/admin'
    },
    {
      id: 'teacher',
      title: 'Teacher Dashboard',
      description: 'Classroom management tools for assignments, attendance, and student progress tracking',
      icon: GraduationCap,
      color: 'bg-blue-500',
      features: ['Class Management', 'Assignment Creation', 'Attendance Tracking', 'Grade Management'],
      href: '/demo/teacher'
    },
    {
      id: 'student',
      title: 'Student Portal',
      description: 'Student-focused interface for accessing assignments, results, and school information',
      icon: BookOpen,
      color: 'bg-green-500',
      features: ['View Assignments', 'Check Results', 'Attendance History', 'School Messages'],
      href: '/demo/student'
    }
  ];

  const systemFeatures = [
    { icon: Users, title: 'Student Management', description: 'Complete student information system' },
    { icon: UserCheck, title: 'Attendance Tracking', description: 'Real-time attendance monitoring' },
    { icon: BarChart3, title: 'Results & Analytics', description: 'Comprehensive performance tracking' },
    { icon: Calendar, title: 'Timetable Management', description: 'Automated scheduling system' },
    { icon: MessageSquare, title: 'Communication Hub', description: 'Integrated messaging platform' },
    { icon: DollarSign, title: 'Fee Management', description: 'Payment tracking and invoicing' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <School className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Pacey School Solution</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link 
                href="/login" 
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Login
              </Link>
              <Link 
                href="/" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Play className="h-4 w-4" />
            <span>Interactive Demo</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Experience Our
            <span className="block text-blue-600">School Management System</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Explore all features through our interactive demo. Choose your role and see how our system 
            streamlines school management for administrators, teachers, and students.
          </p>
        </div>
      </section>

      {/* Demo Role Selection */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Choose Your Demo Experience
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Select a role to explore the tailored dashboard and features
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {demoRoles.map((role) => {
              const IconComponent = role.icon;
              return (
                <div
                  key={role.id}
                  className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 ${
                    selectedDemo === role.id ? 'border-blue-500' : 'border-transparent'
                  }`}
                  onMouseEnter={() => setSelectedDemo(role.id)}
                  onMouseLeave={() => setSelectedDemo(null)}
                >
                  <div className="p-8">
                    <div className={`${role.color} rounded-xl p-4 w-16 h-16 flex items-center justify-center mb-6`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {role.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-6">
                      {role.description}
                    </p>
                    
                    <ul className="space-y-2 mb-8">
                      {role.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-700">
                          <ChevronRight className="h-4 w-4 text-blue-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Link
                      href={role.href}
                      className={`inline-flex items-center justify-center w-full px-6 py-3 rounded-lg font-semibold transition-all ${role.color} text-white hover:opacity-90`}
                    >
                      Launch {role.title.split(' ')[0]} Demo
                      <ChevronRight className="h-5 w-5 ml-2" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* System Features Overview */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive School Management Features
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to run a modern school efficiently
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {systemFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center p-6">
                  <div className="bg-blue-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your School?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Start your journey with our comprehensive school management solution
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link
              href="/login"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/contact"
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Contact Sales
            </Link>
          </div>
          <Link
            href="/demo/features"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            📊 Compare Features Across User Roles
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <School className="h-8 w-8" />
              <span className="text-xl font-bold">Pacey School Solution</span>
            </div>
            <p className="text-gray-400">
              Empowering Nigerian schools with modern management technology
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
