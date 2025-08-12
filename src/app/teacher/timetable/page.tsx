'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  BookOpen, 
  Filter,
  Download,
  Edit3,
  Plus,
  Coffee,
  Utensils,
  RefreshCw,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  School,
  Users
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface Period {
  _id: string;
  periodNumber: number;
  startTime: string;
  endTime: string;
  subjectId: string;
  subjectName: string;
  teacherId?: string;
  teacherName?: string;
  venue: string;
  duration: number;
  isBreak: boolean;
}

interface Timetable {
  _id: string;
  classId: string;
  className: string;
  term: 'First' | 'Second' | 'Third';
  academicYear: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  periods: Period[];
  status: 'Active' | 'Draft' | 'Archived';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export default function TeacherTimetablePage() {
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('First');
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [refreshing, setRefreshing] = useState(false);

  const classes = ['JSS 1A', 'JSS 1B', 'JSS 2A', 'JSS 2B', 'JSS 3A', 'JSS 3B', 'SS 1A', 'SS 1B', 'SS 2A', 'SS 2B', 'SS 3A', 'SS 3B'];
  const terms = ['First', 'Second', 'Third'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const academicYear = '2024/2025';

  // Sample current week for demonstration
  const getCurrentWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - currentDay + 1 + (selectedWeek * 7));
    
    return days.map((day, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return {
        day,
        date: date.getDate(),
        month: date.toLocaleDateString('en-NG', { month: 'short' }),
        isToday: date.toDateString() === today.toDateString()
      };
    });
  };

  const weekDates = getCurrentWeekDates();

  const fetchTimetables = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        term: selectedTerm,
        academicYear
      });

      if (selectedClass) {
        params.append('className', selectedClass);
      }

      const response = await fetch(`/api/timetable?${params}`);
      if (response.ok) {
        const data = await response.json();
        setTimetables(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching timetables:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedClass, selectedTerm]);

  const refreshTimetables = async () => {
    setRefreshing(true);
    await fetchTimetables();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchTimetables();
  }, [fetchTimetables]);

  // Group timetables by day and class
  const getTimetableForDay = (day: string) => {
    return timetables.filter(t => t.dayOfWeek === day);
  };

  const getTimeSlots = () => {
    const allPeriods = timetables.flatMap(t => t.periods);
    const uniqueSlots = Array.from(new Set(allPeriods.map(p => p.startTime)))
      .sort()
      .map(startTime => {
        const period = allPeriods.find(p => p.startTime === startTime);
        return {
          startTime,
          endTime: period?.endTime || '',
          periodNumber: period?.periodNumber || 0
        };
      });
    return uniqueSlots;
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour24 = parseInt(hours);
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    const hour12 = hour24 % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getPeriodColor = (period: Period) => {
    if (period.isBreak) {
      return period.subjectName.toLowerCase().includes('lunch') 
        ? 'bg-orange-100 border-orange-200 text-orange-800'
        : 'bg-green-100 border-green-200 text-green-800';
    }
    
    const colors = [
      'bg-blue-100 border-blue-200 text-blue-800',
      'bg-purple-100 border-purple-200 text-purple-800',
      'bg-pink-100 border-pink-200 text-pink-800',
      'bg-indigo-100 border-indigo-200 text-indigo-800',
      'bg-cyan-100 border-cyan-200 text-cyan-800',
      'bg-teal-100 border-teal-200 text-teal-800',
    ];
    
    return colors[period.periodNumber % colors.length];
  };

  const renderGridView = () => (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Time
              </th>
              {weekDates.map(({ day, date, month, isToday }) => (
                <th key={day} className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider border-b ${
                  isToday ? 'bg-blue-50 text-blue-700' : 'text-gray-500'
                }`}>
                  <div>
                    <div className="font-semibold">{day}</div>
                    <div className="text-sm font-normal">{date} {month}</div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {getTimeSlots().map((slot, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="font-semibold">{formatTime(slot.startTime)}</div>
                      <div className="text-xs text-gray-500">{formatTime(slot.endTime)}</div>
                    </div>
                  </div>
                </td>
                {days.map(day => {
                  const dayTimetables = getTimetableForDay(day);
                  const period = dayTimetables
                    .flatMap(t => t.periods)
                    .find(p => p.startTime === slot.startTime);
                  
                  return (
                    <td key={day} className="px-4 py-4 text-sm">
                      {period ? (
                        <div className={`p-3 rounded-lg border-l-4 ${getPeriodColor(period)}`}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                {period.isBreak ? (
                                  period.subjectName.toLowerCase().includes('lunch') ? (
                                    <Utensils className="h-4 w-4 flex-shrink-0" />
                                  ) : (
                                    <Coffee className="h-4 w-4 flex-shrink-0" />
                                  )
                                ) : (
                                  <BookOpen className="h-4 w-4 flex-shrink-0" />
                                )}
                                <span className="font-semibold text-sm truncate">
                                  {period.subjectName}
                                </span>
                              </div>
                              {!period.isBreak && (
                                <div className="space-y-1">
                                  {period.teacherName && (
                                    <div className="flex items-center space-x-1 text-xs">
                                      <User className="h-3 w-3" />
                                      <span className="truncate">{period.teacherName}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center space-x-1 text-xs">
                                    <MapPin className="h-3 w-3" />
                                    <span className="truncate">{period.venue}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-16 flex items-center justify-center text-gray-400 text-xs">
                          Free Period
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderListView = () => (
    <div className="space-y-6">
      {days.map(day => {
        const dayTimetables = getTimetableForDay(day);
        const allPeriods = dayTimetables.flatMap(t => t.periods).sort((a, b) => a.periodNumber - b.periodNumber);
        const dayDate = weekDates.find(d => d.day === day);

        return (
          <div key={day} className="bg-white rounded-lg shadow-sm border">
            <div className={`px-6 py-4 border-b ${dayDate?.isToday ? 'bg-blue-50' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Calendar className={`h-5 w-5 ${dayDate?.isToday ? 'text-blue-600' : 'text-gray-500'}`} />
                  <div>
                    <h3 className={`text-lg font-semibold ${dayDate?.isToday ? 'text-blue-900' : 'text-gray-900'}`}>
                      {day}
                    </h3>
                    <p className={`text-sm ${dayDate?.isToday ? 'text-blue-600' : 'text-gray-500'}`}>
                      {dayDate?.date} {dayDate?.month}
                      {dayDate?.isToday && ' (Today)'}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {allPeriods.length} period{allPeriods.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>

            <div className="p-6">
              {allPeriods.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p>No classes scheduled for {day}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {allPeriods.map((period, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${getPeriodColor(period)}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          {period.isBreak ? (
                            period.subjectName.toLowerCase().includes('lunch') ? (
                              <Utensils className="h-5 w-5 flex-shrink-0 mt-1" />
                            ) : (
                              <Coffee className="h-5 w-5 flex-shrink-0 mt-1" />
                            )
                          ) : (
                            <BookOpen className="h-5 w-5 flex-shrink-0 mt-1" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-base">{period.subjectName}</h4>
                              <span className="text-sm font-medium">
                                {formatTime(period.startTime)} - {formatTime(period.endTime)}
                              </span>
                            </div>
                            {!period.isBreak && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                {period.teacherName && (
                                  <div className="flex items-center space-x-2">
                                    <User className="h-4 w-4" />
                                    <span>{period.teacherName}</span>
                                  </div>
                                )}
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-4 w-4" />
                                  <span>{period.venue}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <DashboardLayout userRole="teacher">
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Timetable 📅</h1>
                    <p className="text-gray-600">View and manage class schedules</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={refreshTimetables}
                    disabled={refreshing}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters and Controls */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class
                  </label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
                  >
                    <option value="">All Classes</option>
                    {classes.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Term
                  </label>
                  <select
                    value={selectedTerm}
                    onChange={(e) => setSelectedTerm(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
                  >
                    {terms.map((term) => (
                      <option key={term} value={term}>
                        {term} Term
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Academic Year
                  </label>
                  <input
                    type="text"
                    value={academicYear}
                    readOnly
                    className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 min-w-[120px]"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Week Navigation */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedWeek(selectedWeek - 1)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-medium text-gray-700 min-w-[100px] text-center">
                    Week {selectedWeek === 0 ? 'Current' : selectedWeek > 0 ? `+${selectedWeek}` : selectedWeek}
                  </span>
                  <button
                    onClick={() => setSelectedWeek(selectedWeek + 1)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Timetable Display */}
          {loading ? (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <RefreshCw className="mx-auto h-8 w-8 text-gray-400 animate-spin mb-4" />
              <p className="text-gray-500">Loading timetables...</p>
            </div>
          ) : timetables.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No timetables found</h3>
              <p className="text-gray-500 mb-6">
                {selectedClass ? `No timetables found for ${selectedClass}` : 'No timetables available for the selected criteria'}
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto">
                <Plus className="h-4 w-4" />
                <span>Create Timetable</span>
              </button>
            </div>
          ) : (
            <>
              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm border p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <School className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Classes</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Set(timetables.map(t => t.className)).size}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <BookOpen className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Subjects</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Set(timetables.flatMap(t => t.periods.filter(p => !p.isBreak).map(p => p.subjectName))).size}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Teachers</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Set(timetables.flatMap(t => t.periods.filter(p => p.teacherName).map(p => p.teacherName))).size}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Clock className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Periods</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {timetables.reduce((total, t) => total + t.periods.filter(p => !p.isBreak).length, 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timetable Content */}
              {viewMode === 'grid' ? renderGridView() : renderListView()}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
