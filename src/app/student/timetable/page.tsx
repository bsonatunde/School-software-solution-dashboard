"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Period {
  periodNumber: number;
  startTime: string;
  endTime: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  venue: string;
  duration: number;
  isBreak: boolean;
}

interface Timetable {
  _id: string;
  classId: string;
  className: string;
  term: string;
  academicYear: string;
  dayOfWeek: string;
  periods: Period[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function StudentTimetable() {
  const [studentId, setStudentId] = useState<string | null>(null);
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [currentPeriod, setCurrentPeriod] = useState<number | null>(null);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    // Get student data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        const extractedStudentId = user.profileId || user.studentId || user.id;
        if (extractedStudentId) {
          setStudentId(extractedStudentId);
        } else {
          // Fallback to demo student ID if no ID found in user data
          setStudentId('ADM/2025/0001');
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
        // Fallback to demo student ID for testing
        setStudentId('ADM/2025/0001');
      }
    } else {
      // No user data found, use demo student ID for testing
      setStudentId('ADM/2025/0001');
    }
  }, []);

  useEffect(() => {
    if (!studentId) return;
    fetchTimetables();
    
    // Set current period based on time
    setCurrentPeriodFromTime();
    
    // Update current period every minute
    const interval = setInterval(setCurrentPeriodFromTime, 60000);
    return () => clearInterval(interval);
  }, [studentId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchTimetables = async () => {
    if (!studentId) return;
    
    setLoading(true);
    try {
      console.log('Fetching timetables for student:', studentId);
      const response = await fetch(`/api/timetable?studentId=${encodeURIComponent(studentId)}&term=First&academicYear=2024/2025`);
      
      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned non-JSON response');
      }
      
      const data = await response.json();
      console.log('Timetable API response:', data);
      
      if (data.success) {
        setTimetables(data.data);
        if (data.data.length === 0) {
          console.log('No timetables found for student:', studentId);
          // Try to fetch by className as fallback
          const fallbackResponse = await fetch(`/api/timetable?className=JSS 1A&term=First&academicYear=2024/2025`);
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            if (fallbackData.success && fallbackData.data.length > 0) {
              setTimetables(fallbackData.data);
              console.log('Using fallback timetables:', fallbackData.data);
            }
          }
        }
      } else {
        setError(data.error || 'Failed to fetch timetable');
      }
    } catch (error: any) {
      console.error('Error fetching timetable:', error);
      if (error.message.includes('JSON')) {
        setError('Server error - please try refreshing the page');
      } else {
        setError('Failed to load timetable');
      }
    } finally {
      setLoading(false);
    }
  };

  const setCurrentPeriodFromTime = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Current time in minutes
    
    // School periods timing (in minutes from midnight)
    const periods = [
      { start: 8 * 60, end: 8 * 60 + 40 }, // 08:00-08:40
      { start: 8 * 60 + 40, end: 9 * 60 + 20 }, // 08:40-09:20
      { start: 9 * 60 + 20, end: 10 * 60 }, // 09:20-10:00
      { start: 10 * 60, end: 10 * 60 + 20 }, // 10:00-10:20 (Break)
      { start: 10 * 60 + 20, end: 11 * 60 }, // 10:20-11:00
      { start: 11 * 60, end: 11 * 60 + 40 }, // 11:00-11:40
      { start: 11 * 60 + 40, end: 12 * 60 + 20 }, // 11:40-12:20
      { start: 12 * 60 + 20, end: 13 * 60 }, // 12:20-13:00 (Lunch)
      { start: 13 * 60, end: 13 * 60 + 40 } // 13:00-13:40
    ];

    for (let i = 0; i < periods.length; i++) {
      if (currentTime >= periods[i].start && currentTime <= periods[i].end) {
        setCurrentPeriod(i + 1);
        return;
      }
    }
    setCurrentPeriod(null);
  };

  const getCurrentDayTimetable = () => {
    return timetables.find(tt => tt.dayOfWeek === selectedDay);
  };

  const getTodayTimetable = () => {
    const today = new Date().getDay();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = dayNames[today];
    
    return timetables.find(tt => tt.dayOfWeek === todayName);
  };

  const formatTime = (time: string) => {
    return time;
  };

  const getSubjectColor = (subjectName: string) => {
    const colors: { [key: string]: string } = {
      'Mathematics': 'bg-blue-100 text-blue-800 border-blue-200',
      'English Language': 'bg-green-100 text-green-800 border-green-200',
      'Basic Science': 'bg-purple-100 text-purple-800 border-purple-200',
      'Social Studies': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'French': 'bg-pink-100 text-pink-800 border-pink-200',
      'Computer Studies': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Physical Education': 'bg-orange-100 text-orange-800 border-orange-200',
      'Morning Break': 'bg-gray-100 text-gray-600 border-gray-200',
      'Lunch Break': 'bg-gray-100 text-gray-600 border-gray-200'
    };
    
    return colors[subjectName] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const isPeriodActive = (periodNumber: number) => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return selectedDay === today && currentPeriod === periodNumber;
  };

  const getNextClass = () => {
    const todayTimetable = getTodayTimetable();
    if (!todayTimetable || !currentPeriod) return null;

    const nextPeriod = todayTimetable.periods.find(p => p.periodNumber > currentPeriod && !p.isBreak);
    return nextPeriod;
  };

  if (loading) {
    return (
      <DashboardLayout userRole="student">
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout userRole="student">
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
            <p className="text-red-600">{error}</p>
            <Link href="/login" className="mt-4 inline-block text-blue-600 hover:underline">
              Go to Login
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const currentDayTimetable = getCurrentDayTimetable();

  return (
    <DashboardLayout userRole="student">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">🕐 My Timetable</h1>
          <p className="text-gray-600">View your weekly class schedule</p>
        </div>

        {/* Quick Info Card */}
        {getNextClass() && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-blue-600 text-lg">🔔</span>
              <div>
                <h3 className="font-medium text-blue-900">Next Class</h3>
                <p className="text-blue-700">
                  {getNextClass()?.subjectName} at {getNextClass()?.startTime} in {getNextClass()?.venue}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Day Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg overflow-x-auto">
          {daysOfWeek.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                selectedDay === day
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Timetable */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {currentDayTimetable ? (
            <div>
              {/* Header */}
              <div className="bg-gray-50 px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedDay} - {currentDayTimetable.className}
                </h2>
                <p className="text-sm text-gray-600">
                  {currentDayTimetable.term} Term {currentDayTimetable.academicYear}
                </p>
              </div>

              {/* Periods */}
              <div className="divide-y divide-gray-200">
                {currentDayTimetable.periods.map((period) => (
                  <div
                    key={period.periodNumber}
                    className={`p-4 transition-all ${
                      isPeriodActive(period.periodNumber)
                        ? 'bg-blue-50 border-l-4 border-blue-500'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">
                            {period.periodNumber}
                          </div>
                          <div className="text-xs text-gray-500">
                            Period
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getSubjectColor(period.subjectName)}`}>
                            {period.subjectName}
                          </div>
                          {!period.isBreak && (
                            <div className="mt-1 text-sm text-gray-600">
                              👨‍🏫 {period.teacherName}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-medium text-gray-900">
                          {formatTime(period.startTime)} - {formatTime(period.endTime)}
                        </div>
                        <div className="text-sm text-gray-600">
                          📍 {period.venue}
                        </div>
                        {isPeriodActive(period.periodNumber) && (
                          <div className="text-xs text-blue-600 font-medium mt-1">
                            ● Current Period
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No timetable found</h3>
              <p className="text-gray-500">
                No classes scheduled for {selectedDay}
              </p>
            </div>
          )}
        </div>

        {/* Weekly Overview */}
        {timetables.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Weekly Overview</h3>
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      {daysOfWeek.map(day => (
                        <th key={day} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Array.from({ length: 9 }, (_, periodIndex) => {
                      const periodNumber = periodIndex + 1;
                      return (
                        <tr key={periodNumber}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            Period {periodNumber}
                          </td>
                          {daysOfWeek.map(day => {
                            const dayTimetable = timetables.find(tt => tt.dayOfWeek === day);
                            const period = dayTimetable?.periods.find(p => p.periodNumber === periodNumber);
                            
                            return (
                              <td key={day} className="px-4 py-3 text-sm text-gray-500">
                                {period ? (
                                  <div className={`px-2 py-1 rounded text-xs ${getSubjectColor(period.subjectName)}`}>
                                    {period.subjectName}
                                  </div>
                                ) : (
                                  <span className="text-gray-300">—</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
