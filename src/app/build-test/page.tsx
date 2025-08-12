'use client';

// Build test page to help diagnose module resolution issues
import { useState } from 'react';

export default function BuildTestPage() {
  const [testResults, setTestResults] = useState<string[]>([]);

  const runTests = () => {
    const results: string[] = [];
    
    try {
      // Test if we can dynamically import the DashboardLayout
      import('@/components/layout/DashboardLayout').then(() => {
        results.push('✅ DashboardLayout import successful');
        setTestResults([...results]);
      }).catch((error) => {
        results.push(`❌ DashboardLayout import failed: ${error.message}`);
        setTestResults([...results]);
      });
      
      // Test if we can dynamically import the API utilities
      import('@/lib/api').then(() => {
        results.push('✅ API lib import successful');
        setTestResults([...results]);
      }).catch((error) => {
        results.push(`❌ API lib import failed: ${error.message}`);
        setTestResults([...results]);
      });
    } catch (error) {
      results.push(`❌ Test execution failed: ${error}`);
      setTestResults(results);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Build Diagnostics
          </h1>
          
          <div className="space-y-4">
            <button
              onClick={runTests}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Run Import Tests
            </button>
            
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Test Results:</h2>
              {testResults.length === 0 ? (
                <p className="text-gray-500">No tests run yet</p>
              ) : (
                <ul className="space-y-1">
                  {testResults.map((result, index) => (
                    <li key={index} className="text-sm font-mono">
                      {result}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Environment Info:</h2>
              <ul className="text-sm font-mono space-y-1">
                <li>Environment: {process.env.NODE_ENV || 'unknown'}</li>
                <li>Next.js Version: {process.env.__NEXT_VERSION__ || 'unknown'}</li>
                <li>Build Time: {new Date().toISOString()}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
