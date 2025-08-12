'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface DatabaseStatus {
  success: boolean;
  totalDocuments: number;
  collections: Record<string, number>;
  timestamp: string;
}

interface CleanupResult {
  success: boolean;
  message: string;
  summary: {
    totalCollections: number;
    successfulCollections: number;
    totalDocumentsBefore: number;
    totalDocumentsDeleted: number;
    timestamp: string;
  };
  details: Record<string, any>;
}

export default function DatabaseManagementPage() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null);
  const [cleanupResult, setCleanupResult] = useState<CleanupResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const fetchDatabaseStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug/clean-database', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Error fetching database status:', error);
      alert('❌ Error fetching database status');
    } finally {
      setLoading(false);
    }
  };

  const cleanDatabase = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug/clean-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          confirmToken: 'CONFIRM_DELETE_ALL_DATA'
        }),
      });
      const data = await response.json();
      
      if (data.success) {
        setCleanupResult(data);
        alert('✅ Database cleaned successfully!');
        // Refresh status
        await fetchDatabaseStatus();
      } else {
        alert('❌ Error cleaning database: ' + data.error);
      }
    } catch (error) {
      console.error('Error cleaning database:', error);
      alert('❌ Error cleaning database');
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🗃️ Database Management</h1>
            <p className="text-gray-600">Monitor and manage your school database</p>
          </div>
          <button
            onClick={fetchDatabaseStatus}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            {loading ? '🔄 Loading...' : '📊 Check Status'}
          </button>
        </div>

        {/* Current Status Card */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">📈 Current Database Status</h2>
            {status && (
              <span className="text-sm text-gray-500">
                Last updated: {new Date(status.timestamp).toLocaleString()}
              </span>
            )}
          </div>

          {!status ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📊</div>
              <p className="text-gray-600">Click &ldquo;Check Status&rdquo; to view database information</p>
            </div>
          ) : (
            <div>
              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {status.totalDocuments}
                  </div>
                  <p className="text-blue-800 font-medium">Total Documents</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {Object.values(status.collections).filter(count => count > 0).length}
                  </div>
                  <p className="text-green-800 font-medium">Active Collections</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-gray-600 mb-2">
                    {Object.keys(status.collections).length}
                  </div>
                  <p className="text-gray-800 font-medium">Total Collections</p>
                </div>
              </div>

              {/* Collections Detail */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(status.collections).map(([collection, count]) => (
                  <div
                    key={collection}
                    className={`p-3 rounded-lg border ${
                      count > 0
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {collection.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        count > 0
                          ? 'bg-yellow-200 text-yellow-800'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Database Actions */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">⚙️ Database Actions</h2>
          
          <div className="space-y-4">
            {/* Clean Database Action */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">🗑️ Clean Database</h3>
                  <p className="text-red-700 text-sm mb-2">
                    Remove all data from your database to start fresh. This action cannot be undone.
                  </p>
                  <div className="flex items-center text-red-600 text-xs">
                    <span className="mr-2">⚠️</span>
                    <span>This will delete ALL students, staff, classes, and other data!</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowConfirmModal(true)}
                  disabled={loading || (status?.totalDocuments === 0)}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-3 rounded-lg font-medium transition-colors ml-4"
                >
                  {loading ? '🔄 Processing...' : '🗑️ Clean Database'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cleanup Results */}
        {cleanupResult && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">✅ Cleanup Results</h2>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">🎉</span>
                <span className="text-green-800 font-semibold">
                  {cleanupResult.message}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-green-600 font-medium">Collections Processed:</span>
                  <div className="text-green-800 font-bold">
                    {cleanupResult.summary.successfulCollections}/{cleanupResult.summary.totalCollections}
                  </div>
                </div>
                <div>
                  <span className="text-green-600 font-medium">Documents Before:</span>
                  <div className="text-green-800 font-bold">
                    {cleanupResult.summary.totalDocumentsBefore}
                  </div>
                </div>
                <div>
                  <span className="text-green-600 font-medium">Documents Deleted:</span>
                  <div className="text-green-800 font-bold">
                    {cleanupResult.summary.totalDocumentsDeleted}
                  </div>
                </div>
                <div>
                  <span className="text-green-600 font-medium">Completed At:</span>
                  <div className="text-green-800 text-xs">
                    {new Date(cleanupResult.summary.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Information Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start">
            <div className="text-2xl mr-4">💡</div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Getting Started</h3>
              <p className="text-blue-800 mb-3">
                After cleaning your database, you can start adding fresh data through the following pages:
              </p>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• 👨‍🎓 <strong>Students:</strong> Go to Students → Add New Student</li>
                <li>• 👥 <strong>Staff:</strong> Go to Staff → Add New Staff Member</li>
                <li>• 👨‍🏫 <strong>Teachers:</strong> Go to Teachers → Add New Teacher</li>
                <li>• 🏫 <strong>Classes:</strong> Go to Admin → Classes → Add New Class</li>
                <li>• 📚 <strong>Subjects:</strong> Create subjects when adding teachers</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-lg w-full">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">⚠️</div>
                  <div>
                    <h2 className="text-xl font-semibold text-red-900">Confirm Database Cleanup</h2>
                    <p className="text-red-700 text-sm">This action cannot be undone!</p>
                  </div>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800 text-sm mb-3">
                    <strong>This will permanently delete:</strong>
                  </p>
                  <ul className="text-red-700 text-sm space-y-1">
                    <li>• All student records and academic data</li>
                    <li>• All staff and teacher information</li>
                    <li>• Class and subject assignments</li>
                    <li>• Attendance records and results</li>
                    <li>• Fee records and payment history</li>
                    <li>• Leave requests and approvals</li>
                    <li>• Library and transport records</li>
                  </ul>
                </div>

                {status && status.totalDocuments > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                    <p className="text-yellow-800 text-sm">
                      <strong>Current database contains:</strong> {status.totalDocuments} documents
                    </p>
                  </div>
                )}
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    ↩️ Cancel
                  </button>
                  <button
                    onClick={cleanDatabase}
                    disabled={loading}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    {loading ? '🔄 Cleaning...' : '🗑️ Yes, Clean Database'}
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
