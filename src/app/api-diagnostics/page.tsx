"use client";

import { useState } from 'react';

export default function ApiDiagnostics() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const testApi = async (name: string, url: string) => {
    try {
      console.log(`Testing ${name} API: ${url}`);
      const response = await fetch(url);
      const text = await response.text();
      
      // Check if response looks like HTML
      const isHtml = text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html');
      
      let parsedData = null;
      let parseError = null;
      
      if (isHtml) {
        parseError = 'Response is HTML, not JSON';
      } else {
        try {
          parsedData = JSON.parse(text);
        } catch (e) {
          parseError = e instanceof Error ? e.message : 'Parse error';
        }
      }
      
      return {
        status: response.status,
        statusText: response.statusText,
        responseType: isHtml ? 'HTML' : 'JSON',
        responseLength: text.length,
        responsePreview: text.substring(0, 200),
        parsedData,
        parseError,
        success: response.ok && !parseError
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  };

  const runDiagnostics = async () => {
    setLoading(true);
    const studentId = 'PSS/2025/001';
    
    const tests = [
      { name: 'Students', url: `/api/students/${encodeURIComponent(studentId)}` },
      { name: 'Attendance', url: `/api/attendance?studentId=${encodeURIComponent(studentId)}` },
      { name: 'Results', url: `/api/results?studentId=${encodeURIComponent(studentId)}` },
      { name: 'Fees', url: `/api/fees?studentId=${encodeURIComponent(studentId)}` },
      { name: 'Notifications', url: `/api/notifications?studentId=${encodeURIComponent(studentId)}&limit=5` }
    ];
    
    const testResults: any = {};
    
    for (const test of tests) {
      testResults[test.name] = await testApi(test.name, test.url);
    }
    
    setResults(testResults);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">API Diagnostics</h1>
      
      <button
        onClick={runDiagnostics}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-md mb-6 disabled:opacity-50"
      >
        {loading ? 'Running Tests...' : 'Run API Tests'}
      </button>
      
      {Object.keys(results).length > 0 && (
        <div className="space-y-6">
          {Object.entries(results).map(([apiName, result]: [string, any]) => (
            <div key={apiName} className="bg-white border rounded-lg p-4">
              <h3 className={`text-lg font-semibold mb-2 ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                {apiName} API {result.success ? '✅' : '❌'}
              </h3>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Status:</strong> {result.status} {result.statusText}
                </div>
                <div>
                  <strong>Response Type:</strong> {result.responseType}
                </div>
                <div>
                  <strong>Response Length:</strong> {result.responseLength} chars
                </div>
                <div>
                  <strong>Parse Error:</strong> {result.parseError || 'None'}
                </div>
              </div>
              
              <div className="mt-4">
                <strong>Response Preview:</strong>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
                  {result.responsePreview}
                </pre>
              </div>
              
              {result.parsedData && (
                <div className="mt-4">
                  <strong>Parsed Data:</strong>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
                    {JSON.stringify(result.parsedData, null, 2)}
                  </pre>
                </div>
              )}
              
              {result.error && (
                <div className="mt-4 text-red-600">
                  <strong>Error:</strong> {result.error}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
