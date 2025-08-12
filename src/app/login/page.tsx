'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient, handleApiError } from '../../lib/api';
import { Eye, EyeOff, School, Mail, Lock, User } from 'lucide-react';

export default function LoginPage() {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    userType: 'student'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simple validation
    if (!loginData.email || !loginData.password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiClient.login(loginData.email, loginData.password, loginData.userType);
      
      if (response.success) {
        localStorage.setItem('user', JSON.stringify(response.data));
        const userRole = (response.data as any)?.role?.toLowerCase() || loginData.userType;
        router.push(`/${userRole}`);
      } else {
        setError(response.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = handleApiError(error);
      
      if (errorMessage.includes('Invalid credentials') || errorMessage.includes('Invalid') || errorMessage.includes('401')) {
        setError('Invalid email or password. Please check your credentials and try again.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const userTypes = [
    { value: 'student', label: 'Student', icon: '🎓', description: 'Access assignments and results' },
    { value: 'teacher', label: 'Teacher', icon: '👨‍🏫', description: 'Manage classes and students' },
    { value: 'admin', label: 'Administrator', icon: '👨‍💼', description: 'Full system access' },
    { value: 'parent', label: 'Parent', icon: '👨‍👩‍👧‍👦', description: 'Monitor child\'s progress' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
          <div className="mb-8">
            <School className="h-16 w-16 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-center">
            Pacey School Solution
          </h1>
          <p className="text-xl text-blue-100 text-center mb-8 max-w-md">
            Modern school management for the digital age
          </p>
          
          <div className="grid grid-cols-2 gap-6 max-w-md">
            <div className="text-center">
              <div className="bg-white/20 rounded-lg p-4 mb-3">
                <span className="text-2xl">📚</span>
              </div>
              <p className="text-sm text-blue-100">Student Management</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-lg p-4 mb-3">
                <span className="text-2xl">📊</span>
              </div>
              <p className="text-sm text-blue-100">Analytics & Reports</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-lg p-4 mb-3">
                <span className="text-2xl">💰</span>
              </div>
              <p className="text-sm text-blue-100">Fee Management</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-lg p-4 mb-3">
                <span className="text-2xl">📱</span>
              </div>
              <p className="text-sm text-blue-100">Communication</p>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-white/10 rounded-full"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="lg:hidden mb-6">
              <School className="h-12 w-12 text-blue-600 mx-auto" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">
              Sign in to access your dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I am signing in as:
              </label>
              <div className="grid grid-cols-2 gap-3">
                {userTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`relative flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-300 ${
                      loginData.userType === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="userType"
                      value={type.value}
                      checked={loginData.userType === type.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <span className="text-2xl mb-2">{type.icon}</span>
                    <span className="text-sm font-medium text-gray-900">{type.label}</span>
                    <span className="text-xs text-gray-500 text-center mt-1">{type.description}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={loginData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-red-500">⚠️</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Additional Links */}
          <div className="mt-8 text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>
            
            <Link
              href="/demo"
              className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              🎯 Try Interactive Demo
            </Link>

            <p className="text-xs text-gray-500">
              Need help? Contact{' '}
              <a href="mailto:support@paceyschool.com" className="text-blue-600 hover:text-blue-800">
                support@paceyschool.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
