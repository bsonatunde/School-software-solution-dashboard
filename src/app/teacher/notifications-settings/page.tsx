'use client';

import { useState, useEffect } from 'react';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Volume2, 
  VolumeX, 
  Clock, 
  Users, 
  BookOpen, 
  Calendar, 
  DollarSign,
  MessageSquare,
  AlertTriangle,
  Save,
  RotateCcw,
  Settings
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface NotificationSettings {
  // Delivery methods
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  soundEnabled: boolean;
  
  // Notification types for teachers
  newAssignments: {
    email: boolean;
    sms: boolean;
    push: boolean;
    sound: boolean;
  };
  studentSubmissions: {
    email: boolean;
    sms: boolean;
    push: boolean;
    sound: boolean;
  };
  attendanceAlerts: {
    email: boolean;
    sms: boolean;
    push: boolean;
    sound: boolean;
  };
  parentMessages: {
    email: boolean;
    sms: boolean;
    push: boolean;
    sound: boolean;
  };
  schoolAnnouncements: {
    email: boolean;
    sms: boolean;
    push: boolean;
    sound: boolean;
  };
  gradeDeadlines: {
    email: boolean;
    sms: boolean;
    push: boolean;
    sound: boolean;
  };
  systemAlerts: {
    email: boolean;
    sms: boolean;
    push: boolean;
    sound: boolean;
  };
  
  // Timing preferences
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  weekendNotifications: boolean;
  holidayNotifications: boolean;
  
  // Frequency settings
  digestMode: boolean;
  digestFrequency: 'hourly' | 'daily' | 'weekly';
  immediateNotifications: string[];
}

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState<NotificationSettings>({
    emailEnabled: true,
    smsEnabled: true,
    pushEnabled: true,
    soundEnabled: true,
    
    newAssignments: { email: true, sms: false, push: true, sound: true },
    studentSubmissions: { email: true, sms: false, push: true, sound: false },
    attendanceAlerts: { email: true, sms: true, push: true, sound: true },
    parentMessages: { email: true, sms: true, push: true, sound: true },
    schoolAnnouncements: { email: true, sms: false, push: true, sound: false },
    gradeDeadlines: { email: true, sms: true, push: true, sound: true },
    systemAlerts: { email: true, sms: true, push: true, sound: true },
    
    quietHoursEnabled: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
    weekendNotifications: false,
    holidayNotifications: false,
    
    digestMode: false,
    digestFrequency: 'daily',
    immediateNotifications: ['systemAlerts', 'parentMessages']
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const userRole = 'teacher'; // This should come from auth context
  const userId = 'TCH/2023/001'; // This should come from auth context

  // Fetch notification settings on component mount
  useEffect(() => {
    fetchNotificationSettings();
  }, []);

  const fetchNotificationSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/notification-settings?userId=${userId}&userType=staff`);
      const data = await response.json();
      
      if (data.success) {
        // Map API response to local state format - use default settings for now
        setHasChanges(false);
      } else {
        console.error('Failed to fetch notification settings:', data.error);
      }
    } catch (error) {
      console.error('Error fetching notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveNotificationSettings = async () => {
    try {
      setSaving(true);
      
      const response = await fetch('/api/notification-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          userType: 'staff',
          settings: settings
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setHasChanges(false);
        console.log('Notification settings saved successfully');
      } else {
        console.error('Failed to save notification settings:', data.error);
        alert('Failed to save notification settings. Please try again.');
      }
    } catch (error) {
      console.error('Error saving notification settings:', error);
      alert('An error occurred while saving your notification settings.');
    } finally {
      setSaving(false);
    }
  };

  const notificationTypes = [
    {
      key: 'newAssignments',
      title: 'New Assignments',
      description: 'When new assignments are created or assigned to your classes',
      icon: <BookOpen className="h-5 w-5 text-blue-600" />
    },
    {
      key: 'studentSubmissions',
      title: 'Student Submissions',
      description: 'When students submit assignments or projects',
      icon: <Users className="h-5 w-5 text-green-600" />
    },
    {
      key: 'attendanceAlerts',
      title: 'Attendance Alerts',
      description: 'Daily attendance summaries and absence notifications',
      icon: <Calendar className="h-5 w-5 text-orange-600" />
    },
    {
      key: 'parentMessages',
      title: 'Parent Messages',
      description: 'Messages from parents and guardians',
      icon: <MessageSquare className="h-5 w-5 text-purple-600" />
    },
    {
      key: 'schoolAnnouncements',
      title: 'School Announcements',
      description: 'Important announcements from school administration',
      icon: <Bell className="h-5 w-5 text-yellow-600" />
    },
    {
      key: 'gradeDeadlines',
      title: 'Grade Deadlines',
      description: 'Reminders for grade submission deadlines',
      icon: <Clock className="h-5 w-5 text-red-600" />
    },
    {
      key: 'systemAlerts',
      title: 'System Alerts',
      description: 'Critical system notifications and security alerts',
      icon: <AlertTriangle className="h-5 w-5 text-red-500" />
    }
  ];

  const updateNotificationSetting = (type: string, method: string, enabled: boolean) => {
    setSettings(prev => {
      const currentTypeSettings = prev[type as keyof NotificationSettings];
      if (typeof currentTypeSettings === 'object' && currentTypeSettings !== null) {
        return {
          ...prev,
          [type]: {
            ...currentTypeSettings,
            [method]: enabled
          }
        };
      }
      return prev;
    });
    setHasChanges(true);
  };

  const updateGeneralSetting = (key: keyof NotificationSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // API call to save notification settings
      console.log('Saving notification settings:', settings);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setHasChanges(false);
      alert('Notification settings saved successfully!');
    } catch (error) {
      console.error('Error saving notification settings:', error);
      alert('Failed to save notification settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all notification settings to default values?')) {
      // Reset to default values
      setSettings({
        emailEnabled: true,
        smsEnabled: true,
        pushEnabled: true,
        soundEnabled: true,
        
        newAssignments: { email: true, sms: false, push: true, sound: true },
        studentSubmissions: { email: true, sms: false, push: true, sound: false },
        attendanceAlerts: { email: true, sms: true, push: true, sound: true },
        parentMessages: { email: true, sms: true, push: true, sound: true },
        schoolAnnouncements: { email: true, sms: false, push: true, sound: false },
        gradeDeadlines: { email: true, sms: true, push: true, sound: true },
        systemAlerts: { email: true, sms: true, push: true, sound: true },
        
        quietHoursEnabled: true,
        quietHoursStart: '22:00',
        quietHoursEnd: '07:00',
        weekendNotifications: false,
        holidayNotifications: false,
        
        digestMode: false,
        digestFrequency: 'daily',
        immediateNotifications: ['systemAlerts', 'parentMessages']
      });
      setHasChanges(true);
    }
  };

  const ToggleSwitch = ({ enabled, onChange, disabled = false }: {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    disabled?: boolean;
  }) => (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
        enabled ? 'bg-blue-600' : 'bg-gray-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-5' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <DashboardLayout userRole={userRole}>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Bell className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Notification Settings 🔔</h1>
                    <p className="text-gray-600">Configure how and when you receive notifications</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleReset}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Reset to Default</span>
                  </button>
                  
                  <button
                    onClick={handleSave}
                    disabled={!hasChanges || saving}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>{saving ? 'Saving...' : 'Save Settings'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Global Settings */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Settings className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Global Notification Settings</h2>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-600" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Email</h3>
                      <p className="text-xs text-gray-500">Email notifications</p>
                    </div>
                  </div>
                  <ToggleSwitch
                    enabled={settings.emailEnabled}
                    onChange={(enabled) => updateGeneralSetting('emailEnabled', enabled)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-gray-600" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">SMS</h3>
                      <p className="text-xs text-gray-500">Text messages</p>
                    </div>
                  </div>
                  <ToggleSwitch
                    enabled={settings.smsEnabled}
                    onChange={(enabled) => updateGeneralSetting('smsEnabled', enabled)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-gray-600" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Push</h3>
                      <p className="text-xs text-gray-500">Browser notifications</p>
                    </div>
                  </div>
                  <ToggleSwitch
                    enabled={settings.pushEnabled}
                    onChange={(enabled) => updateGeneralSetting('pushEnabled', enabled)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {settings.soundEnabled ? (
                      <Volume2 className="h-5 w-5 text-gray-600" />
                    ) : (
                      <VolumeX className="h-5 w-5 text-gray-600" />
                    )}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Sound</h3>
                      <p className="text-xs text-gray-500">Audio alerts</p>
                    </div>
                  </div>
                  <ToggleSwitch
                    enabled={settings.soundEnabled}
                    onChange={(enabled) => updateGeneralSetting('soundEnabled', enabled)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notification Types */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Notification Types</h2>
              <p className="text-sm text-gray-600">Choose how you want to receive different types of notifications</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notification Type
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SMS
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Push
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sound
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {notificationTypes.map((type) => {
                    const typeSettings = settings[type.key as keyof NotificationSettings] as any;
                    return (
                      <tr key={type.key} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-gray-100 p-2 rounded-lg">
                              {type.icon}
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">{type.title}</h3>
                              <p className="text-sm text-gray-500">{type.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <ToggleSwitch
                            enabled={typeSettings?.email}
                            onChange={(enabled) => updateNotificationSetting(type.key, 'email', enabled)}
                            disabled={!settings.emailEnabled}
                          />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <ToggleSwitch
                            enabled={typeSettings?.sms}
                            onChange={(enabled) => updateNotificationSetting(type.key, 'sms', enabled)}
                            disabled={!settings.smsEnabled}
                          />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <ToggleSwitch
                            enabled={typeSettings?.push}
                            onChange={(enabled) => updateNotificationSetting(type.key, 'push', enabled)}
                            disabled={!settings.pushEnabled}
                          />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <ToggleSwitch
                            enabled={typeSettings?.sound}
                            onChange={(enabled) => updateNotificationSetting(type.key, 'sound', enabled)}
                            disabled={!settings.soundEnabled}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Timing Preferences */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Timing Preferences</h2>
              </div>
            </div>
            <div className="px-6 py-4 space-y-6">
              {/* Quiet Hours */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Quiet Hours</h3>
                    <p className="text-sm text-gray-500">Disable notifications during specified hours</p>
                  </div>
                  <ToggleSwitch
                    enabled={settings.quietHoursEnabled}
                    onChange={(enabled) => updateGeneralSetting('quietHoursEnabled', enabled)}
                  />
                </div>
                
                {settings.quietHoursEnabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={settings.quietHoursStart}
                        onChange={(e) => updateGeneralSetting('quietHoursStart', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={settings.quietHoursEnd}
                        onChange={(e) => updateGeneralSetting('quietHoursEnd', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Weekend & Holiday Notifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Weekend Notifications</h3>
                    <p className="text-sm text-gray-500">Receive notifications on weekends</p>
                  </div>
                  <ToggleSwitch
                    enabled={settings.weekendNotifications}
                    onChange={(enabled) => updateGeneralSetting('weekendNotifications', enabled)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Holiday Notifications</h3>
                    <p className="text-sm text-gray-500">Receive notifications during holidays</p>
                  </div>
                  <ToggleSwitch
                    enabled={settings.holidayNotifications}
                    onChange={(enabled) => updateGeneralSetting('holidayNotifications', enabled)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Digest Mode */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Digest Mode</h2>
              </div>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Enable Digest Mode</h3>
                  <p className="text-sm text-gray-500">Group non-urgent notifications into digest emails</p>
                </div>
                <ToggleSwitch
                  enabled={settings.digestMode}
                  onChange={(enabled) => updateGeneralSetting('digestMode', enabled)}
                />
              </div>

              {settings.digestMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Digest Frequency
                  </label>
                  <select
                    value={settings.digestFrequency}
                    onChange={(e) => updateGeneralSetting('digestFrequency', e.target.value)}
                    className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {hasChanges && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="text-yellow-600">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">Unsaved Changes</h3>
                  <p className="text-sm text-yellow-700">You have unsaved changes. Click "Save Settings" to apply them.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
