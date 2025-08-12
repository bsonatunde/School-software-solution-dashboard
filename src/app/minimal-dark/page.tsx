'use client';

import { useState, useEffect } from 'react';

export default function MinimalDarkTest() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('minimal-theme', 'dark');
      console.log('🌙 Switched to dark mode');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('minimal-theme', 'light');
      console.log('☀️ Switched to light mode');
    }
    
    console.log('HTML classes:', document.documentElement.className);
    console.log('Has dark class:', document.documentElement.classList.contains('dark'));
  };

  useEffect(() => {
    setMounted(true);
    // Load saved theme
    const saved = localStorage.getItem('minimal-theme');
    if (saved === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8 transition-all duration-300">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-3xl font-bold">🔬 Minimal Dark Mode Test</h1>
        
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
          <p>Current mode: <strong>{isDark ? 'Dark 🌙' : 'Light ☀️'}</strong></p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            HTML dark class: {mounted ? document.documentElement.classList.contains('dark').toString() : 'loading...'}
          </p>
        </div>

        <button
          onClick={toggleTheme}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
        >
          Switch to {isDark ? 'Light ☀️' : 'Dark 🌙'} Mode
        </button>

        <div className="space-y-3">
          <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
            <span className="text-sm">📄 This should be white in light mode, dark gray in dark mode</span>
          </div>
          
          <div className="p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded">
            <span className="text-sm text-red-800 dark:text-red-200">🔴 Red themed element</span>
          </div>
          
          <div className="p-3 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded">
            <span className="text-sm text-green-800 dark:text-green-200">🟢 Green themed element</span>
          </div>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p>💡 This is a minimal test without any complex providers</p>
          <p>🎯 Click the button and watch the colors change instantly</p>
          <p>🔄 Refresh the page - it should remember your choice</p>
        </div>
      </div>
    </div>
  );
}
