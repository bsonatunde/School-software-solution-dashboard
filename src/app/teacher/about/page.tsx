'use client';

import { 
  Info, 
  Users, 
  Shield, 
  Award, 
  ExternalLink, 
  Heart, 
  Code, 
  Globe,
  Mail,
  MapPin,
  Phone
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function AboutPage() {
  const userRole = 'teacher'; // This should come from auth context

  const features = [
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: 'Student Management',
      description: 'Comprehensive student information system with enrollment, attendance, and academic records'
    },
    {
      icon: <Award className="h-8 w-8 text-green-600" />,
      title: 'Academic Excellence',
      description: 'Grade management, report cards, and academic analytics following Nigerian educational standards'
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with role-based access control and data protection'
    },
    {
      icon: <Globe className="h-8 w-8 text-orange-600" />,
      title: 'Multi-platform',
      description: 'Web-based platform accessible from anywhere with mobile-responsive design'
    }
  ];

  const team = [
    {
      name: 'Adebayo Johnson',
      role: 'Lead Developer',
      bio: 'Full-stack developer with 8+ years experience in educational technology'
    },
    {
      name: 'Kemi Oladele',
      role: 'UI/UX Designer',
      bio: 'Designer passionate about creating intuitive interfaces for educational platforms'
    },
    {
      name: 'Chidi Okwu',
      role: 'Product Manager',
      bio: 'Educational consultant with deep understanding of Nigerian school systems'
    },
    {
      name: 'Fatima Bello',
      role: 'Quality Assurance',
      bio: 'QA specialist ensuring reliable and bug-free software for schools'
    }
  ];

  const technologies = [
    'Next.js 15', 'TypeScript', 'React', 'Node.js', 'MongoDB', 'Tailwind CSS',
    'Vercel', 'REST APIs', 'JWT Authentication', 'Responsive Design'
  ];

  return (
    <DashboardLayout userRole={userRole}>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Info className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">About Pacey School ℹ️</h1>
                  <p className="text-gray-600">Learn more about our school management system</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
          {/* Hero Section */}
          <div className="text-center">
            <div className="text-6xl mb-6">📚</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Pacey School Management System</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive school management solution designed specifically for Nigerian educational institutions, 
              empowering schools to manage students, staff, academics, and administration efficiently.
            </p>
          </div>

          {/* Version & Info */}
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <h3 className="text-2xl font-bold text-blue-600">v1.0.0</h3>
                <p className="text-gray-600">Current Version</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-green-600">2025</h3>
                <p className="text-gray-600">Year Released</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-purple-600">100+</h3>
                <p className="text-gray-600">Schools Supported</p>
              </div>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-xl leading-relaxed max-w-4xl mx-auto">
                To digitize and modernize education management in Nigeria by providing schools with 
                powerful, user-friendly tools that enhance teaching, learning, and administrative efficiency 
                while maintaining the highest standards of data security and user experience.
              </p>
            </div>
          </div>

          {/* Key Features */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Key Features</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Nigerian Education Focus */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Built for Nigerian Schools</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Educational Standards</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center space-x-2">
                      <span className="text-green-600">✓</span>
                      <span>WAEC grading system integration</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-green-600">✓</span>
                      <span>Nigerian curriculum alignment</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-green-600">✓</span>
                      <span>Term-based academic calendar</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-green-600">✓</span>
                      <span>JSS/SS class structure</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Local Features</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center space-x-2">
                      <span className="text-green-600">✓</span>
                      <span>Naira (₦) currency support</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-green-600">✓</span>
                      <span>Nigerian date/time formats</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-green-600">✓</span>
                      <span>SMS integration for parent communication</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-green-600">✓</span>
                      <span>Multi-language support (English, Hausa, Igbo, Yoruba)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Technology Stack</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Built with modern, reliable technologies to ensure performance, security, and scalability.
              </p>
              <div className="flex flex-wrap gap-3">
                {technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Development Team */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Development Team</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {team.map((member, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{member.name}</h3>
                        <p className="text-sm text-blue-600">{member.role}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{member.bio}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Company Information</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Pacey Solutions Ltd</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-600" />
                      <span className="text-gray-600">Lagos, Nigeria</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-600" />
                      <span className="text-gray-600">info@paceysolutions.com</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-600" />
                      <span className="text-gray-600">+234 803 PACEY-00 (722393)</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="h-5 w-5 text-gray-600" />
                      <a href="#" className="text-blue-600 hover:text-blue-700">
                        www.paceysolutions.com
                      </a>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Support & Resources</h3>
                  <div className="space-y-3">
                    <a href="#" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-gray-900">Documentation</span>
                      <ExternalLink className="h-4 w-4 text-gray-500" />
                    </a>
                    <a href="#" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-gray-900">API Reference</span>
                      <ExternalLink className="h-4 w-4 text-gray-500" />
                    </a>
                    <a href="#" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-gray-900">GitHub Repository</span>
                      <ExternalLink className="h-4 w-4 text-gray-500" />
                    </a>
                    <a href="#" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-gray-900">Release Notes</span>
                      <ExternalLink className="h-4 w-4 text-gray-500" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Legal & Compliance */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Legal & Compliance</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Data Protection</h3>
                  <p className="text-sm text-gray-600">GDPR & Nigerian Data Protection Regulation compliant</p>
                </div>
                <div className="text-center">
                  <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Security</h3>
                  <p className="text-sm text-gray-600">ISO 27001 security standards implementation</p>
                </div>
                <div className="text-center">
                  <Code className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Open Source</h3>
                  <p className="text-sm text-gray-600">MIT License - Open source components</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center py-8 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-2 text-gray-600 mb-4">
              <span>Made with</span>
              <Heart className="h-5 w-5 text-red-500" />
              <span>for Nigerian Schools</span>
            </div>
            <p className="text-sm text-gray-500">
              © 2025 Pacey Solutions Ltd. All rights reserved. | Version 1.0.0
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
