'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MailtrapTestPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testMailtrap = async () => {
    if (!email) {
      alert('Please enter a test email address');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-mailtrap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testEmail: email }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Network error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📧 Mailtrap Test
          </h1>
          <p className="text-gray-600 mb-8">
            Test your Pacey School email configuration safely
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Test Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="your-email@example.com"
            />
            <p className="mt-2 text-sm text-gray-500">
              This email will be captured in Mailtrap, not actually delivered
            </p>
          </div>

          <button
            onClick={testMailtrap}
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Testing...
              </>
            ) : (
              'Test Mailtrap Configuration 🚀'
            )}
          </button>

          {result && (
            <div className={`mt-6 p-4 rounded-md ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              {result.success ? (
                <div>
                  <h3 className="text-green-800 font-semibold mb-2">✅ Success!</h3>
                  <p className="text-green-700 text-sm mb-2">{result.message}</p>
                  {result.instructions && (
                    <ul className="text-green-700 text-sm space-y-1">
                      {result.instructions.map((instruction: string, index: number) => (
                        <li key={index}>• {instruction}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <div>
                  <h3 className="text-red-800 font-semibold mb-2">❌ Error</h3>
                  <p className="text-red-700 text-sm mb-2">{result.error}</p>
                  {result.suggestion && (
                    <p className="text-red-700 text-sm mb-2">
                      <strong>Suggestion:</strong> {result.suggestion}
                    </p>
                  )}
                  {result.setup && (
                    <p className="text-red-700 text-sm">
                      <strong>Setup:</strong> {result.setup}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-blue-800 font-semibold mb-2">🔧 Setup Instructions:</h3>
          <ol className="text-blue-700 text-sm space-y-1">
            <li>1. Go to <a href="https://mailtrap.io" target="_blank" rel="noopener noreferrer" className="underline">mailtrap.io</a> and sign up</li>
            <li>2. Create an inbox and get SMTP credentials</li>
            <li>3. Update your <code className="bg-blue-100 px-1 rounded">.env.local</code> file</li>
            <li>4. Test configuration using this page</li>
            <li>5. Check your Mailtrap inbox to see captured emails</li>
          </ol>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-500 text-sm"
          >
            ← Back to Pacey School Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
