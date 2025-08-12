'use client';

import { useTheme } from '@/components/ThemeProvider';

export default function ThemeTestPage() {
  const { theme, setTheme, actualTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🧪 Theme Test Page</h1>
        
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Theme Status</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Selected Theme:</strong> {theme}</p>
            <p><strong>Active Theme:</strong> {actualTheme}</p>
            <p><strong>HTML dark class:</strong> {typeof window !== 'undefined' ? document.documentElement.classList.contains('dark').toString() : 'unknown'}</p>
            <p><strong>All HTML classes:</strong> {typeof window !== 'undefined' ? document.documentElement.className : 'unknown'}</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <h2 className="text-xl font-semibold">Theme Controls</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setTheme('light')}
              className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                theme === 'light'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              ☀️ Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                theme === 'dark'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              🌙 Dark
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                theme === 'system'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              💻 System
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Visual Tests</h2>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-4 rounded-lg">
            <p className="text-gray-900 dark:text-gray-100">
              ✅ This card should have white background and dark text in light mode, dark background and light text in dark mode.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 p-4 rounded-lg">
            <p className="text-blue-900 dark:text-blue-100">
              🔵 This is a blue themed card that should adapt to the current theme.
            </p>
          </div>

          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 p-4 rounded-lg">
            <p className="text-red-900 dark:text-red-100">
              🔴 This is a red themed card that should adapt to the current theme.
            </p>
          </div>
        </div>

        <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg">
          <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">🎯 What to Look For:</h3>
          <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
            <li>• Background should change from white to dark gray</li>
            <li>• Text should change from dark to light</li>
            <li>• All cards should adapt their colors</li>
            <li>• Changes should be immediate when clicking theme buttons</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
