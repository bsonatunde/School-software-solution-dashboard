'use client';

import { Check, X } from 'lucide-react';

export default function DemoFeaturesPage() {
  const features = [
    {
      category: 'User Management',
      items: [
        { name: 'Student Information System', admin: true, teacher: true, student: true },
        { name: 'Teacher Management', admin: true, teacher: false, student: false },
        { name: 'User Role Management', admin: true, teacher: false, student: false },
        { name: 'Profile Management', admin: true, teacher: true, student: true },
      ]
    },
    {
      category: 'Academic Management',
      items: [
        { name: 'Assignment Creation', admin: true, teacher: true, student: false },
        { name: 'Assignment Submission', admin: false, teacher: false, student: true },
        { name: 'Grade Management', admin: true, teacher: true, student: false },
        { name: 'Results Viewing', admin: true, teacher: true, student: true },
        { name: 'Report Card Generation', admin: true, teacher: true, student: true },
      ]
    },
    {
      category: 'Attendance & Monitoring',
      items: [
        { name: 'Attendance Marking', admin: true, teacher: true, student: false },
        { name: 'Attendance Reports', admin: true, teacher: true, student: true },
        { name: 'Analytics Dashboard', admin: true, teacher: true, student: false },
        { name: 'Performance Tracking', admin: true, teacher: true, student: true },
      ]
    },
    {
      category: 'Communication',
      items: [
        { name: 'School Announcements', admin: true, teacher: false, student: true },
        { name: 'Direct Messaging', admin: true, teacher: true, student: true },
        { name: 'Parent Notifications', admin: true, teacher: true, student: false },
        { name: 'Emergency Alerts', admin: true, teacher: false, student: true },
      ]
    },
    {
      category: 'Administrative',
      items: [
        { name: 'System Settings', admin: true, teacher: false, student: false },
        { name: 'Database Management', admin: true, teacher: false, student: false },
        { name: 'Backup & Recovery', admin: true, teacher: false, student: false },
        { name: 'User Analytics', admin: true, teacher: false, student: false },
      ]
    }
  ];

  const FeatureIcon = ({ hasFeature }: { hasFeature: boolean }) => (
    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
      hasFeature ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
    }`}>
      {hasFeature ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Demo Features Comparison
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore what each user role can access in our comprehensive school management system
          </p>
        </div>

        {/* Role Headers */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
            {/* Feature Category Header */}
            <div className="lg:col-span-1 bg-gray-50 p-6 border-b lg:border-b-0 lg:border-r border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Features</h3>
            </div>
            
            {/* User Role Headers */}
            <div className="lg:col-span-3 grid grid-cols-3 gap-0">
              <div className="bg-red-50 p-6 border-b lg:border-b-0 border-gray-200 text-center">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">A</span>
                </div>
                <h4 className="font-semibold text-gray-900">Administrator</h4>
                <p className="text-sm text-gray-600 mt-1">Full System Access</p>
              </div>
              
              <div className="bg-green-50 p-6 border-b lg:border-b-0 border-gray-200 text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">T</span>
                </div>
                <h4 className="font-semibold text-gray-900">Teacher</h4>
                <p className="text-sm text-gray-600 mt-1">Class Management</p>
              </div>
              
              <div className="bg-purple-50 p-6 border-b lg:border-b-0 border-gray-200 text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">S</span>
                </div>
                <h4 className="font-semibold text-gray-900">Student</h4>
                <p className="text-sm text-gray-600 mt-1">Learning Portal</p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="divide-y divide-gray-200">
            {features.map((category) => (
              <div key={category.category}>
                {/* Category Header */}
                <div className="bg-gray-50 px-6 py-4">
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                    {category.category}
                  </h4>
                </div>
                
                {/* Category Features */}
                {category.items.map((feature) => (
                  <div key={feature.name} className="grid grid-cols-1 lg:grid-cols-4 gap-0 hover:bg-gray-50">
                    <div className="lg:col-span-1 px-6 py-4 border-b lg:border-b-0 lg:border-r border-gray-200">
                      <span className="text-sm font-medium text-gray-900">{feature.name}</span>
                    </div>
                    
                    <div className="lg:col-span-3 grid grid-cols-3 gap-0">
                      <div className="px-6 py-4 flex justify-center border-b lg:border-b-0 border-gray-200">
                        <FeatureIcon hasFeature={feature.admin} />
                      </div>
                      <div className="px-6 py-4 flex justify-center border-b lg:border-b-0 border-gray-200">
                        <FeatureIcon hasFeature={feature.teacher} />
                      </div>
                      <div className="px-6 py-4 flex justify-center border-b lg:border-b-0 border-gray-200">
                        <FeatureIcon hasFeature={feature.student} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Experience All Features?
          </h3>
          <p className="text-lg text-gray-600 mb-8">
            Try each demo to see how our system works for different user roles
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/demo/admin" 
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Try Admin Demo
            </a>
            <a 
              href="/demo/teacher" 
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Try Teacher Demo
            </a>
            <a 
              href="/demo/student" 
              className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Try Student Demo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
