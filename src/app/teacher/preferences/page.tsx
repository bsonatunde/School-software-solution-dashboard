'use client';

import { useState, useEffect } from 'react';
import { 
  Palette, 
  Monitor, 
  Moon, 
  Sun, 
  Globe, 
  Clock, 
  Volume2, 
  VolumeX, 
  Mail, 
  Smartphone,
  Bell,
  Save,
  RotateCcw
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useTheme } from '@/components/ThemeProvider';

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  currency: string;
  soundEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  dashboardLayout: 'compact' | 'comfortable' | 'spacious';
  sidebarCollapsed: boolean;
  tablePageSize: number;
  autoRefresh: boolean;
  autoRefreshInterval: number;
}

export default function PreferencesPage() {
  const { theme, setTheme, actualTheme } = useTheme();
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'light',
    language: 'en-NG',
    timezone: 'Africa/Lagos',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
    currency: 'NGN',
    soundEnabled: true,
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    dashboardLayout: 'comfortable',
    sidebarCollapsed: false,
    tablePageSize: 10,
    autoRefresh: true,
    autoRefreshInterval: 30
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const userRole = 'teacher'; // This should come from auth context
  const userId = 'TCH/2023/001'; // This should come from auth context

  // Fetch preferences on component mount and sync theme
  useEffect(() => {
    setMounted(true);
    fetchPreferences();
  }, []);

  // Sync local preferences with theme provider
  useEffect(() => {
    setPreferences(prev => ({ ...prev, theme }));
  }, [theme]);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/profile?userId=${userId}&userType=staff`);
      const data = await response.json();
      
      if (data.success && data.data.profile) {
        const profile = data.data.profile;
        
        // Map profile preferences to local preferences structure
        setPreferences(prev => ({
          ...prev,
          theme: profile.preferences?.theme || 'light',
          language: profile.preferences?.language || 'en-NG',
          pushNotifications: profile.preferences?.notifications || true,
          emailNotifications: profile.preferences?.emailNotifications || true
        }));
        setHasChanges(false);
      } else {
        console.error('Failed to fetch preferences:', data.error);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    try {
      setSaving(true);
      
      // Get current profile first
      const profileResponse = await fetch(`/api/profile?userId=${userId}&userType=staff`);
      const profileData = await profileResponse.json();
      
      if (!profileData.success) {
        throw new Error('Failed to fetch current profile');
      }
      
      // Update the profile with new preferences
      const updatedProfile = {
        ...profileData.data.profile,
        preferences: {
          theme: preferences.theme,
          language: preferences.language,
          notifications: preferences.pushNotifications,
          emailNotifications: preferences.emailNotifications
        }
      };
      
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          userType: 'staff',
          updates: updatedProfile
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setHasChanges(false);
        console.log('Preferences saved successfully');
        
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        successMsg.textContent = '✅ Preferences saved successfully!';
        document.body.appendChild(successMsg);
        
        setTimeout(() => {
          document.body.removeChild(successMsg);
        }, 3000);
      } else {
        console.error('Failed to save preferences:', data.error);
        alert('Failed to save preferences. Please try again.');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('An error occurred while saving your preferences.');
    } finally {
      setSaving(false);
    }
  };

  const resetPreferences = async () => {
    if (confirm('Are you sure you want to reset all preferences to default values?')) {
      try {
        setSaving(true);
        const response = await fetch(`/api/preferences?userId=${userId}&userType=staff`, {
          method: 'DELETE',
        });

        const data = await response.json();
        
        if (data.success) {
          await fetchPreferences(); // Reload default preferences
          console.log('Preferences reset to default');
        } else {
          console.error('Failed to reset preferences:', data.error);
          alert('Failed to reset preferences. Please try again.');
        }
      } catch (error) {
        console.error('Error resetting preferences:', error);
        alert('An error occurred while resetting your preferences.');
      } finally {
        setSaving(false);
      }
    }
  };

  const languages = [
    { code: 'en-NG', name: 'English (Nigeria)' },
    { code: 'ha-NG', name: 'Hausa' },
    { code: 'ig-NG', name: 'Igbo' },
    { code: 'yo-NG', name: 'Yoruba' },
    { code: 'en-US', name: 'English (US)' },
    { code: 'fr-FR', name: 'French' }
  ];

  const timezones = [
    { value: 'Africa/Lagos', label: 'West Africa Time (WAT)' },
    { value: 'UTC', label: 'Coordinated Universal Time (UTC)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
    { value: 'America/New_York', label: 'Eastern Standard Time (EST)' }
  ];

  const dateFormats = [
    'DD/MM/YYYY',
    'MM/DD/YYYY',
    'YYYY-MM-DD',
    'DD-MM-YYYY',
    'MMM DD, YYYY'
  ];

  const currencies = [
    { code: 'NGN', name: 'Nigerian Naira (₦)', symbol: '₦' },
    { code: 'USD', name: 'US Dollar ($)', symbol: '$' },
    { code: 'EUR', name: 'Euro (€)', symbol: '€' },
    { code: 'GBP', name: 'British Pound (£)', symbol: '£' }
  ];

  const updatePreference = (key: keyof UserPreferences, value: any) => {
    // Handle theme changes through the theme provider
    if (key === 'theme') {
      setTheme(value);
    }
    
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const PreferenceSection = ({ title, icon, children }: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
            {icon}
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
        </div>
      </div>
      <div className="px-6 py-4 space-y-4">
        {children}
      </div>
    </div>
  );

  const ToggleSwitch = ({ enabled, onChange, label, description }: {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    label: string;
    description?: string;
  }) => (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</h3>
        {description && <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <DashboardLayout userRole={userRole}>
      {loading ? (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading preferences...</p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                      <Palette className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Preferences 🎨</h1>
                      <p className="text-gray-600 dark:text-gray-400">Customize your experience and interface settings</p>
                      
                      {/* Debug info - can be removed in production */}
                      <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-xs">
                        <p className="text-gray-600 dark:text-gray-400">Theme: {theme} (Active: {actualTheme})</p>
                        <p className="text-gray-600 dark:text-gray-400">Dark mode classes applied: {mounted ? document.documentElement.classList.contains('dark').toString() : 'loading...'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={resetPreferences}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Reset to Default</span>
                    </button>
                    
                    <button
                      onClick={savePreferences}
                      disabled={!hasChanges || saving}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 transition-colors"
                    >
                      <Save className="h-4 w-4" />
                      <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Theme & Appearance */}
          <PreferenceSection 
            title="Theme & Appearance" 
            icon={<Palette className="h-5 w-5 text-blue-600" />}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Theme Preference
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'light', label: 'Light', icon: <Sun className="h-4 w-4" /> },
                  { value: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" /> },
                  { value: 'system', label: 'System', icon: <Monitor className="h-4 w-4" /> }
                ].map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => updatePreference('theme', theme.value)}
                    className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                      preferences.theme === theme.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {theme.icon}
                    <span className="text-sm font-medium">{theme.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Dashboard Layout
              </label>
              <select
                value={preferences.dashboardLayout}
                onChange={(e) => updatePreference('dashboardLayout', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="compact">Compact</option>
                <option value="comfortable">Comfortable</option>
                <option value="spacious">Spacious</option>
              </select>
            </div>

            <ToggleSwitch
              enabled={!preferences.sidebarCollapsed}
              onChange={(enabled) => updatePreference('sidebarCollapsed', !enabled)}
              label="Expanded Sidebar"
              description="Keep the sidebar expanded by default"
            />
          </PreferenceSection>

          {/* Localization */}
          <PreferenceSection 
            title="Localization" 
            icon={<Globe className="h-5 w-5 text-blue-600" />}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <select
                value={preferences.language}
                onChange={(e) => updatePreference('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Timezone
              </label>
              <select
                value={preferences.timezone}
                onChange={(e) => updatePreference('timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {timezones.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date Format
                </label>
                <select
                  value={preferences.dateFormat}
                  onChange={(e) => updatePreference('dateFormat', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  {dateFormats.map((format) => (
                    <option key={format} value={format}>
                      {format} (e.g., {new Date().toLocaleDateString('en-NG')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time Format
                </label>
                <select
                  value={preferences.timeFormat}
                  onChange={(e) => updatePreference('timeFormat', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="12h">12 Hour (2:30 PM)</option>
                  <option value="24h">24 Hour (14:30)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Currency
              </label>
              <select
                value={preferences.currency}
                onChange={(e) => updatePreference('currency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.name}
                  </option>
                ))}
              </select>
            </div>
          </PreferenceSection>

          {/* Notifications */}
          <PreferenceSection 
            title="Notification Preferences" 
            icon={<Bell className="h-5 w-5 text-blue-600" />}
          >
            <ToggleSwitch
              enabled={preferences.soundEnabled}
              onChange={(enabled) => updatePreference('soundEnabled', enabled)}
              label="Sound Notifications"
              description="Play sound for new notifications"
            />

            <ToggleSwitch
              enabled={preferences.emailNotifications}
              onChange={(enabled) => updatePreference('emailNotifications', enabled)}
              label="Email Notifications"
              description="Receive notifications via email"
            />

            <ToggleSwitch
              enabled={preferences.smsNotifications}
              onChange={(enabled) => updatePreference('smsNotifications', enabled)}
              label="SMS Notifications"
              description="Receive important notifications via SMS"
            />

            <ToggleSwitch
              enabled={preferences.pushNotifications}
              onChange={(enabled) => updatePreference('pushNotifications', enabled)}
              label="Push Notifications"
              description="Receive browser push notifications"
            />
          </PreferenceSection>

          {/* Data & Performance */}
          <PreferenceSection 
            title="Data & Performance" 
            icon={<Clock className="h-5 w-5 text-blue-600" />}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Table Page Size
              </label>
              <select
                value={preferences.tablePageSize}
                onChange={(e) => updatePreference('tablePageSize', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value={5}>5 items per page</option>
                <option value={10}>10 items per page</option>
                <option value={25}>25 items per page</option>
                <option value={50}>50 items per page</option>
                <option value={100}>100 items per page</option>
              </select>
            </div>

            <ToggleSwitch
              enabled={preferences.autoRefresh}
              onChange={(enabled) => updatePreference('autoRefresh', enabled)}
              label="Auto Refresh"
              description="Automatically refresh data at intervals"
            />

            {preferences.autoRefresh && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Auto Refresh Interval
                </label>
                <select
                  value={preferences.autoRefreshInterval}
                  onChange={(e) => updatePreference('autoRefreshInterval', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value={15}>Every 15 seconds</option>
                  <option value={30}>Every 30 seconds</option>
                  <option value={60}>Every minute</option>
                  <option value={300}>Every 5 minutes</option>
                  <option value={600}>Every 10 minutes</option>
                </select>
              </div>
            )}
          </PreferenceSection>

          {hasChanges && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="text-yellow-600 dark:text-yellow-500">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Unsaved Changes</h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">You have unsaved changes. Click "Save Changes" to apply them.</p>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
