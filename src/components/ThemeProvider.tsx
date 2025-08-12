'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  systemTheme: 'light' | 'dark';
  actualTheme: 'light' | 'dark'; // The actual theme being used (resolved from system if needed)
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = 'light' }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  // Get the actual theme being used
  const actualTheme = theme === 'system' ? systemTheme : theme;

  // Initialize theme from localStorage on mount
  useEffect(() => {
    // First, check what's in localStorage
    const savedTheme = localStorage.getItem('theme') as Theme;
    console.log('Saved theme from localStorage:', savedTheme);
    
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setTheme(savedTheme);
      console.log('Set theme to:', savedTheme);
    }

    // Check system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const systemPrefersDark = mediaQuery.matches;
    setSystemTheme(systemPrefersDark ? 'dark' : 'light');
    console.log('System prefers dark:', systemPrefersDark);

    // Listen for system theme changes
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
      console.log('System theme changed to:', e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove any previous theme classes
    root.classList.remove('light', 'dark');
    
    // Apply new theme
    if (actualTheme === 'dark') {
      root.classList.add('dark');
      console.log('✅ Applied dark mode to HTML element');
    } else {
      root.classList.remove('dark');
      console.log('✅ Removed dark mode from HTML element');
    }

    // Save theme preference
    localStorage.setItem('theme', theme);
    
    // Force a repaint by temporarily changing a style
    root.style.display = 'none';
    root.offsetHeight; // Trigger reflow
    root.style.display = '';
    
    console.log('Current HTML classes:', root.className);
    console.log('Dark mode active:', root.classList.contains('dark'));
  }, [theme, actualTheme]);

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        setTheme: handleSetTheme, 
        systemTheme, 
        actualTheme 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
