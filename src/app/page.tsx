export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary-600">
                  📚 Pacey School Solution
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/login" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                Login
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Smart School Management
            <span className="block text-primary-600">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Digitize your school operations with our comprehensive management system. 
            Perfect for Nigerian schools looking to modernize their processes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/demo" className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors inline-block text-center">
              🎯 Try Interactive Demo
            </a>
            <a href="/login" className="border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-50 transition-colors inline-block text-center">
              Login to Dashboard
            </a>
          </div>
          
          {/* Demo Quick Links */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href="/demo/admin" className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-red-200 transition-colors">
              👤 Admin Demo
            </a>
            <a href="/demo/teacher" className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-green-200 transition-colors">
              👩‍🏫 Teacher Demo
            </a>
            <a href="/demo/student" className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors">
              🎓 Student Demo
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything Your School Needs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Student Management */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">👨‍🎓</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Student Information System</h3>
              <p className="text-gray-600">Secure database of student profiles, academic history, and contact information.</p>
            </div>

            {/* Attendance */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Attendance Tracker</h3>
              <p className="text-gray-600">Daily attendance logging with automated reports and analytics.</p>
            </div>

            {/* Results */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Result Management</h3>
              <p className="text-gray-600">Automated grading and report card generation with detailed analytics.</p>
            </div>

            {/* Parent Portal */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">👨‍👩‍👧</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Parent Portal</h3>
              <p className="text-gray-600">Parents can check results, fees, and receive important messages.</p>
            </div>

            {/* Fee Management */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fee Management</h3>
              <p className="text-gray-600">Invoice generation, online payments, and debt tracking made easy.</p>
            </div>

            {/* Communication */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Admin Messaging</h3>
              <p className="text-gray-600">Internal notices and bulk SMS/Email for announcements.</p>
            </div>
          </div>
        </div>

        {/* User Roles Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Built for All School Stakeholders
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏫</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">School Owners</h3>
              <p className="text-gray-600">Complete oversight and management control</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚙️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Administrators</h3>
              <p className="text-gray-600">Streamlined administrative processes</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👨‍🏫</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Teachers</h3>
              <p className="text-gray-600">Easy class management and grading</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👪</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Parents</h3>
              <p className="text-gray-600">Stay connected with your child&apos;s progress</p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mt-20 bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Why Choose Pacey School Solution?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-600 text-sm">🇳🇬</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Tailored for Nigerian Schools</h3>
                <p className="text-gray-600">Built specifically for the Nigerian education system</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-600 text-sm">📱</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Mobile-Friendly Interface</h3>
                <p className="text-gray-600">Access from anywhere on any device</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-600 text-sm">⚡</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Real-time Data Sync</h3>
                <p className="text-gray-600">Instant updates across all devices</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-600 text-sm">🔒</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Secure & Scalable</h3>
                <p className="text-gray-600">Enterprise-grade security for your data</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Digitize Your School?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join hundreds of Nigerian schools already using Pacey School Solution
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors">
              Get Started Today
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">📚 Pacey School Solution</h3>
            <p className="text-gray-400 mb-6">
              Empowering Nigerian schools with modern technology
            </p>
            <div className="mb-6">
              <p className="text-blue-400 font-semibold mb-2">Need Help?</p>
              <a 
                href="mailto:onatunde.samuel@gmail.com" 
                className="text-blue-300 hover:text-blue-200 transition-colors text-lg"
              >
                📧 onatunde.samuel@gmail.com
              </a>
            </div>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a>
            </div>
            <p className="text-gray-500 mt-6">
              © 2025 Pacey School Solution. All rights reserved.
            </p>
            <p className="text-gray-400 mt-2 text-sm">
              Designed by bsonat +2348138873454
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
