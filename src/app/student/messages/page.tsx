"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Message {
  _id: string;
  senderId: string;
  senderType: string;
  recipientType: string;
  recipientIds: string[];
  title: string;
  content: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Draft' | 'Sent' | 'Delivered' | 'Read';
  sentDate: string;
  deliveryMethod: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export default function StudentMessages() {
  const [studentId, setStudentId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all');

  useEffect(() => {
    // Get student data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setStudentId(user.profileId || user.studentId || user.id);
      } catch (e) {
        console.error('Error parsing user data:', e);
        setError('Invalid user session. Please login again.');
      }
    } else {
      setError('No user session found. Please login again.');
    }
  }, []);

  useEffect(() => {
    if (!studentId) return;
    fetchMessages();
  }, [studentId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchMessages = async () => {
    if (!studentId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/messages?studentId=${studentId}&limit=50`);
      const data = await response.json();
      
      if (data.success) {
        setMessages(data.data);
      } else {
        setError(data.error || 'Failed to fetch messages');
      }
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const response = await fetch(`/api/messages?id=${messageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Read' })
      });

      if (response.ok) {
        setMessages(messages.map(msg => 
          msg._id === messageId ? { ...msg, status: 'Read' } : msg
        ));
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const filteredMessages = messages.filter(message => {
    switch (filter) {
      case 'unread':
        return message.status !== 'Read';
      case 'important':
        return message.priority === 'High' || message.priority === 'Urgent';
      default:
        return true;
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'text-red-600 bg-red-100';
      case 'High':
        return 'text-orange-600 bg-orange-100';
      case 'Medium':
        return 'text-blue-600 bg-blue-100';
      case 'Low':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSenderTypeColor = (senderType: string) => {
    switch (senderType) {
      case 'Admin':
        return 'text-purple-600 bg-purple-100';
      case 'Teacher':
        return 'text-green-600 bg-green-100';
      case 'Parent':
        return 'text-pink-600 bg-pink-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <DashboardLayout userRole="student">
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout userRole="student">
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
            <p className="text-red-600">{error}</p>
            <Link href="/login" className="mt-4 inline-block text-blue-600 hover:underline">
              Go to Login
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="student">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">📨 Messages & Notifications</h1>
          <p className="text-gray-600">View messages from teachers, admin, and parents</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Messages ({messages.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'unread'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Unread ({messages.filter(m => m.status !== 'Read').length})
          </button>
          <button
            onClick={() => setFilter('important')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'important'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Important ({messages.filter(m => m.priority === 'High' || m.priority === 'Urgent').length})
          </button>
        </div>

        {/* Messages List */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {filteredMessages.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
                  <p className="text-gray-500">
                    {filter === 'all' 
                      ? "You don't have any messages yet." 
                      : `No ${filter} messages at the moment.`}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredMessages.map((message) => (
                    <div
                      key={message._id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        message.status !== 'Read' ? 'bg-blue-50' : ''
                      } ${selectedMessage?._id === message._id ? 'bg-blue-100' : ''}`}
                      onClick={() => {
                        setSelectedMessage(message);
                        if (message.status !== 'Read') {
                          markAsRead(message._id);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSenderTypeColor(message.senderType)}`}>
                              {message.senderType}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(message.priority)}`}>
                              {message.priority}
                            </span>
                            {message.status !== 'Read' && (
                              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                            )}
                          </div>
                          <h3 className={`font-medium ${message.status !== 'Read' ? 'text-gray-900' : 'text-gray-700'}`}>
                            {message.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {message.content}
                          </p>
                        </div>
                        <div className="text-xs text-gray-400 ml-4">
                          {formatDate(message.sentDate)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border">
              {selectedMessage ? (
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSenderTypeColor(selectedMessage.senderType)}`}>
                      {selectedMessage.senderType}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedMessage.priority)}`}>
                      {selectedMessage.priority}
                    </span>
                  </div>
                  
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    {selectedMessage.title}
                  </h2>
                  
                  <div className="text-sm text-gray-500 mb-4">
                    <p>From: {selectedMessage.senderType}</p>
                    <p>Sent: {new Date(selectedMessage.sentDate).toLocaleString()}</p>
                    <p>To: {selectedMessage.recipientType}</p>
                  </div>
                  
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700">
                      {selectedMessage.content}
                    </div>
                  </div>
                  
                  {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Attachments:</h4>
                      <div className="space-y-1">
                        {selectedMessage.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm text-blue-600">
                            <span>📎</span>
                            <span>{attachment}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <div className="text-4xl mb-4">📧</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a message</h3>
                  <p className="text-gray-500">Choose a message from the list to view its details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
