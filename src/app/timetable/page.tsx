'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';

interface Subject {
  id: string;
  name: string;
  code: string;
  category: string;
  teacher: string;
  level: string;
}

interface Period {
  periodNumber: number;
  time: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  venue: string;
  duration: number;
}

interface Timetable {
  id: string;
  class: string;
  day: string;
  periods: Period[];
}

export default function TimetablePage() {
  const [selectedView, setSelectedView] = useState<'subjects' | 'timetable'>('subjects');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [showTimetableEditor, setShowTimetableEditor] = useState(false);
  const router = useRouter();

  const classes = [
    'JSS 1A', 'JSS 1B', 'JSS 2A', 'JSS 2B', 'JSS 3A', 'JSS 3B',
    'SS 1A', 'SS 1B', 'SS 2A', 'SS 2B', 'SS 3A', 'SS 3B'
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  const timeSlots = [
    '08:00-08:40', '08:40-09:20', '09:20-10:00', '10:00-10:20', 
    '10:20-11:00', '11:00-11:40', '11:40-12:20', '12:20-13:00', '13:00-13:40'
  ];

  const categories = ['Core', 'Science', 'Social Science', 'Language', 'Arts', 'Vocational', 'Physical', 'Religious'];

  useEffect(() => {
    fetchSubjects();
    if (selectedClass) {
      fetchTimetables();
    }
  }, [selectedClass]);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/subjects');
      const data = await response.json();
      
      if (data.success) {
        setSubjects(data.data);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimetables = async () => {
    try {
      const response = await fetch(`/api/timetable?class=${selectedClass}`);
      const data = await response.json();
      
      if (data.success) {
        setTimetables(data.data);
      }
    } catch (error) {
      console.error('Error fetching timetables:', error);
    }
  };

  const handleAddSubject = async (formData: any) => {
    try {
      const response = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        setSubjects([...subjects, data.data]);
        setShowAddSubjectModal(false);
        alert('Subject added successfully!');
      } else {
        alert(data.error || 'Failed to add subject');
      }
    } catch (error) {
      console.error('Error adding subject:', error);
      alert('Failed to add subject');
    }
  };

  const getTimetableForDay = (day: string): Timetable | undefined => {
    return timetables.find(tt => tt.day === day);
  };

  const renderSubjectsView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Subject Management</h2>
          <p className="text-gray-600">Manage school subjects and curriculum</p>
        </div>
        <button
          onClick={() => setShowAddSubjectModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          ➕ Add Subject
        </button>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <div key={subject.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{subject.name}</h3>
                <p className="text-sm text-gray-500">Code: {subject.code}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                subject.category === 'Core' ? 'bg-blue-100 text-blue-800' :
                subject.category === 'Science' ? 'bg-green-100 text-green-800' :
                subject.category === 'Language' ? 'bg-purple-100 text-purple-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {subject.category}
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">Teacher:</span> {subject.teacher}</p>
              <p><span className="font-medium">Level:</span> {subject.level}</p>
            </div>

            <div className="mt-4 flex space-x-2">
              <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200">
                ✏️ Edit
              </button>
              <button className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-200">
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Subject Modal */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Subject</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleAddSubject({
                name: formData.get('name'),
                code: formData.get('code'),
                category: formData.get('category'),
                level: formData.get('level'),
                teacher: formData.get('teacher'),
                description: formData.get('description')
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Mathematics"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject Code</label>
                  <input
                    type="text"
                    name="code"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., MTH"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="category"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                  <select
                    name="level"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Level</option>
                    <option value="JSS">Junior Secondary (JSS)</option>
                    <option value="SS">Senior Secondary (SS)</option>
                    <option value="Both">Both JSS & SS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
                  <input
                    type="text"
                    name="teacher"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Mr. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description of the subject"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddSubjectModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderTimetableView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Class Timetables</h2>
          <p className="text-gray-600">View and manage weekly class schedules</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowTimetableEditor(true)}
            disabled={!selectedClass}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            📝 Edit Timetable
          </button>
          <button 
            onClick={() => router.push('/timetable/reports')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            📊 Generate Report
          </button>
        </div>
      </div>

      {/* Class Selection */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose a class</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Day</label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Days</option>
              {days.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Timetable Display */}
      {selectedClass && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedClass} - Weekly Timetable
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  {days.map(day => (
                    <th key={day} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {timeSlots.map((timeSlot, index) => (
                  <tr key={timeSlot} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {timeSlot}
                    </td>
                    {days.map(day => {
                      const dayTimetable = getTimetableForDay(day);
                      const period = dayTimetable?.periods.find(p => p.time === timeSlot);
                      
                      return (
                        <td key={day} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {period ? (
                            <div className={`p-2 rounded text-xs ${
                              period.subjectId === 'BREAK' ? 'bg-yellow-100 text-yellow-800' :
                              period.subjectId === 'LUNCH' ? 'bg-orange-100 text-orange-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              <div className="font-medium">{period.subjectName}</div>
                              {period.teacherName && (
                                <div className="text-xs mt-1">{period.teacherName}</div>
                              )}
                              {period.venue && (
                                <div className="text-xs">{period.venue}</div>
                              )}
                            </div>
                          ) : (
                            <div className="text-gray-400 text-center">-</div>
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
      )}

      {/* Instructions */}
      {!selectedClass && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-blue-400 text-xl">ℹ️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Getting Started with Timetables</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ol className="list-decimal list-inside space-y-1">
                  <li>First, ensure all subjects are properly configured in the Subject Management section</li>
                  <li>Select a class from the dropdown above to view its current timetable</li>
                  <li>Use "Edit Timetable" to modify class schedules and assign teachers</li>
                  <li>The system will automatically detect and prevent teacher scheduling conflicts</li>
                  <li>Generate reports to analyze class loads and teacher workloads</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📚 Timetable & Subject Management</h1>
            <p className="text-gray-600">Manage subjects, schedules, and class timetables</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/timetable/reports')}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              📊 View Reports
            </button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="bg-white rounded-lg p-1 shadow-sm inline-flex">
          <button
            onClick={() => setSelectedView('subjects')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              selectedView === 'subjects'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📖 Subjects
          </button>
          <button
            onClick={() => setSelectedView('timetable')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              selectedView === 'timetable'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🗓️ Timetables
          </button>
        </div>

        {/* Content */}
        {selectedView === 'subjects' ? renderSubjectsView() : renderTimetableView()}

        {/* Timetable Editor Modal */}
        {showTimetableEditor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Edit Timetable - {selectedClass}
                </h3>
                <button
                  onClick={() => setShowTimetableEditor(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {classes.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Academic Session</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="2024/2025">2024/2025</option>
                    <option value="2025/2026">2025/2026</option>
                  </select>
                </div>
              </div>

              {/* Weekly Timetable Grid */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 grid grid-cols-6 gap-px">
                  <div className="bg-gray-100 p-3 font-medium text-gray-700">Time</div>
                  {days.map(day => (
                    <div key={day} className="bg-gray-100 p-3 font-medium text-gray-700 text-center">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Time Slots */}
                {[
                  { period: 1, time: '8:00-8:40' },
                  { period: 2, time: '8:40-9:20' },
                  { period: 3, time: '9:20-10:00' },
                  { period: 4, time: '10:20-11:00' },
                  { period: 5, time: '11:00-11:40' },
                  { period: 6, time: '11:40-12:20' },
                  { period: 7, time: '1:20-2:00' },
                  { period: 8, time: '2:00-2:40' }
                ].map(slot => (
                  <div key={slot.period} className="grid grid-cols-6 gap-px bg-gray-200">
                    <div className="bg-gray-50 p-3 font-medium text-gray-600 text-sm">
                      Period {slot.period}<br />
                      <span className="text-xs text-gray-500">{slot.time}</span>
                    </div>
                    {days.map(day => {
                      const periodData = timetables
                        .find(t => t.class === selectedClass && t.day === day)
                        ?.periods.find(p => p.periodNumber === slot.period);
                      
                      return (
                        <div key={`${day}-${slot.period}`} className="bg-white p-2 min-h-[60px] hover:bg-gray-50 cursor-pointer border">
                          {periodData ? (
                            <div className="text-xs">
                              <div className="font-medium text-blue-600">{periodData.subjectName}</div>
                              <div className="text-gray-600">{periodData.teacherName}</div>
                              <div className="text-gray-500">{periodData.venue}</div>
                            </div>
                          ) : (
                            <div className="text-gray-400 text-xs text-center">
                              + Add Subject
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Quick Add Section */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Quick Add Period</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="">Select Day</option>
                    {days.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="">Select Period</option>
                    {[1,2,3,4,5,6,7,8].map(period => (
                      <option key={period} value={period}>Period {period}</option>
                    ))}
                  </select>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="">Select Subject</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>{subject.name}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Venue"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm">
                    Add Period
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center mt-6">
                <div className="flex space-x-2">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                    📊 Conflict Check
                  </button>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm">
                    📋 Copy from Template
                  </button>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowTimetableEditor(false)}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                    Save Timetable
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
