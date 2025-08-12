"use client";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useEffect, useState } from 'react';

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  date: string;
  status: string;
  timeIn: string | null;
  timeOut: string | null;
  remarks: string;
}

export default function StudentAttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // TODO: Replace with real studentId from auth/session
    const studentId = '1';
    fetch(`/api/attendance?studentId=${studentId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAttendance(data);
        } else if (Array.isArray(data.attendance)) {
          setAttendance(data.attendance);
        } else {
          setAttendance([]);
          setError('No attendance records found.');
        }
      })
      .catch(() => {
        setAttendance([]);
        setError('Failed to fetch attendance records.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout userRole="student">
      <div className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-blue-700 mb-2 flex items-center gap-2">
          📅 My Attendance
        </h1>
        <p className="text-gray-600 mb-6">Track your daily attendance for the current term.</p>
        <div className="bg-white rounded-xl shadow border p-6">
          {loading ? (
            <div className="text-blue-600">Loading attendance...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remark</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {attendance.map((rec) => (
                  <tr key={rec.id}>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-800">{rec.date}</td>
                    <td className={`px-4 py-2 whitespace-nowrap font-semibold ${rec.status === 'Present' ? 'text-green-600' : rec.status === 'Absent' ? 'text-red-600' : 'text-yellow-600'}`}>{rec.status}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{rec.remarks || (rec.status === 'Present' ? '✔️' : rec.status === 'Late' ? '⏰' : '')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
