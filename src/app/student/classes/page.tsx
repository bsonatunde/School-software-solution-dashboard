"use client";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useEffect, useState } from 'react';

interface Subject {
  name: string;
  teacher: string;
}
interface StudentClass {
  className: string;
  classTeacher: string;
  subjects: Subject[];
}

export default function StudentClassesPage() {
  const [classes, setClasses] = useState<StudentClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // TODO: Replace with real studentId from auth/session
    const studentId = '1';
    fetch(`/api/classes?studentId=${studentId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setClasses(data.data);
        } else {
          setClasses([]);
          setError('No classes found.');
        }
      })
      .catch(() => {
        setClasses([]);
        setError('Failed to fetch classes.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout userRole="student">
      <div className="max-w-3xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-blue-700 mb-2 flex items-center gap-2">
          🏫 My Classes
        </h1>
        <p className="text-gray-600 mb-6">View your assigned classes, subjects, and teachers for the current term.</p>
        <div className="space-y-8">
          {loading ? (
            <div className="text-blue-600">Loading classes...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            classes.map((cls) => (
              <div key={cls.className} className="bg-white rounded-xl shadow border p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div className="flex items-center gap-2 text-xl font-semibold text-blue-600">
                    <span>📚</span>
                    <span>{cls.className}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-2 md:mt-0">
                    👩‍🏫 Class Teacher: <span className="font-medium text-gray-700">{cls.classTeacher}</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {cls.subjects?.map((subj) => (
                        <tr key={subj.name}>
                          <td className="px-4 py-2 whitespace-nowrap text-gray-800">{subj.name}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-gray-700">{subj.teacher}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
