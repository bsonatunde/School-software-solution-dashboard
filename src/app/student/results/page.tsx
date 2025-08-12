"use client";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useEffect, useState } from 'react';

interface Result {
  term: string;
  session: string;
  subject: string;
  score: number;
  grade: string;
  remark: string;
}

export default function StudentResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // TODO: Replace with real student ID from auth/session
    const studentId = 'demo-student-id';
    fetch(`/api/results?studentId=${studentId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Defensive: ensure results is always an array
          setResults(Array.isArray(data.results) ? data.results : []);
        } else {
          setResults([]);
          setError('No results found.');
        }
      })
      .catch(() => {
        setResults([]);
        setError('Failed to fetch results.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout userRole="student">
      <div className="max-w-3xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-blue-700 mb-2 flex items-center gap-2">
          📝 My Results
        </h1>
        <p className="text-gray-600 mb-6">View your academic results for the current session and term.</p>
        {loading ? (
          <div className="text-blue-600">Loading results...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="bg-white rounded-xl shadow border p-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remark</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Term</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {results.map((res, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-800">{res.subject}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-blue-700 font-bold">{res.score}</td>
                    <td className="px-4 py-2 whitespace-nowrap font-semibold {res.grade === 'A' ? 'text-green-600' : res.grade === 'F' ? 'text-red-600' : 'text-yellow-600'}">{res.grade}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{res.remark}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{res.term}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{res.session}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
