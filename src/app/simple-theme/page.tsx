'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/components/ThemeProvider';

export default function SimpleThemeTest() {
  const { theme, setTheme, actualTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8 transition-colors duration-200">
      <div className="max-w-lg mx-auto space-y-6">
        <h1 className="text-2xl font-bold">🎨 Simple Theme Test</h1>
        
        <div className="space-y-3">
          <button
            onClick={() => setTheme('light')}
            className="block w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            ☀️ Light Mode
          </button>
          <button
            onClick={() => setTheme('dark')}
            className="block w-full px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg"
          >
            🌙 Dark Mode
          </button>
        </div>

        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p>Current theme: <strong>{actualTheme}</strong></p>
          <p>HTML class: <strong>{mounted ? document.documentElement.className : 'loading...'}</strong></p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg">
            <p className="text-sm">White/Dark card</p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-100">Blue themed card</p>
          </div>
        </div>
      </div>
    </div>
  );
}
