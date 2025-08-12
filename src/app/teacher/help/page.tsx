'use client';

import { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  Search, 
  Book, 
  MessageCircle, 
  Phone, 
  Mail, 
  FileText, 
  Video, 
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Send,
  CheckCircle
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface SupportTicket {
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  description: string;
}

// Static FAQ data - moved outside component to avoid dependency issues
const staticFaqData: FAQItem[] = [
  {
    id: '1',
    question: 'How do I create a new assignment for my students?',
    answer: 'To create a new assignment, go to the Assignments section from your dashboard, click "Create Assignment", fill in the details including title, description, due date, and attach any necessary files. You can then assign it to specific classes or students.',
    category: 'assignments'
  },
  {
    id: '2',
    question: 'How can I view and update student attendance?',
    answer: 'Navigate to the Attendance section from your dashboard. Select the class and date, then mark students as present, absent, or late. The system automatically saves your changes and generates attendance reports.',
    category: 'attendance'
  },
  {
    id: '3',
    question: 'How do I enter student grades and results?',
    answer: 'Go to the Results section, select the class, subject, and term. You can enter continuous assessment scores and examination marks. The system automatically calculates total scores, grades, and remarks based on the Nigerian grading system.',
    category: 'grading'
  },
  {
    id: '4',
    question: 'How can I communicate with parents?',
    answer: 'Use the Messages section to send notifications to parents. You can send individual messages, class-wide announcements, or important updates. Parents will receive notifications via the app, SMS, or email based on their preferences.',
    category: 'communication'
  },
  {
    id: '5',
    question: 'How do I view my teaching timetable?',
    answer: 'Your teaching schedule is available in the Timetable section. You can view it by day, week, or month, and see all your classes, venues, and time slots. You can also export or print your timetable.',
    category: 'timetable'
  },
  {
    id: '6',
    question: 'What should I do if I forgot my password?',
    answer: 'Click "Forgot Password" on the login page and enter your email address. You will receive a password reset link. If you don\'t receive the email, contact the school administrator or IT support.',
    category: 'account'
  },
  {
    id: '7',
    question: 'How can I update my profile information?',
    answer: 'Go to Settings > Profile Settings from the top navigation. You can update your personal information, contact details, emergency contacts, and change your password.',
    category: 'account'
  },
  {
    id: '8',
    question: 'How do I customize my notification preferences?',
    answer: 'Visit Settings > Notification Settings to configure how you receive notifications. You can choose between email, SMS, and push notifications for different types of updates.',
    category: 'settings'
  }
];

export default function HelpSupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'faq' | 'contact' | 'resources' | 'tickets'>('faq');
  const [ticket, setTicket] = useState<SupportTicket>({
    subject: '',
    category: 'general',
    priority: 'medium',
    description: ''
  });
  const [submittingTicket, setSubmittingTicket] = useState(false);
  const [faqData, setFaqData] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);

  const userRole = 'teacher'; // This should come from auth context
  const userId = 'TCH/2023/001'; // This should come from auth context

  // Fetch FAQ data on component mount
  useEffect(() => {
    const fetchFAQData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/support?action=faq');
        const data = await response.json();
        
        if (data.success) {
          setFaqData(data.data);
        } else {
          console.error('Failed to fetch FAQ data:', data.error);
          // Fallback to static FAQ data
          setFaqData(staticFaqData);
        }
      } catch (error) {
        console.error('Error fetching FAQ data:', error);
        // Fallback to static FAQ data
        setFaqData(staticFaqData);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQData();
  }, []);

  const submitSupportTicket = async () => {
    if (!ticket.subject || !ticket.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSubmittingTicket(true);
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          userType: 'staff',
          userName: 'John Adebayo', // This should come from user profile
          email: 'john.adebayo@paceyschool.edu.ng', // This should come from user profile
          category: ticket.category,
          subject: ticket.subject,
          description: ticket.description,
          priority: ticket.priority
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`Support ticket created successfully! Ticket ID: ${data.data.ticketId}`);
        setTicket({
          subject: '',
          category: 'general',
          priority: 'medium',
          description: ''
        });
        setActiveTab('faq'); // Switch back to FAQ tab
      } else {
        console.error('Failed to create support ticket:', data.error);
        alert('Failed to create support ticket. Please try again.');
      }
    } catch (error) {
      console.error('Error creating support ticket:', error);
      alert('An error occurred while creating your support ticket.');
    } finally {
      setSubmittingTicket(false);
    }
  };

  const categories = [
    { id: 'all', name: 'All Topics', icon: <Book className="h-4 w-4" /> },
    { id: 'assignments', name: 'Assignments', icon: <FileText className="h-4 w-4" /> },
    { id: 'attendance', name: 'Attendance', icon: <CheckCircle className="h-4 w-4" /> },
    { id: 'grading', name: 'Grading & Results', icon: <FileText className="h-4 w-4" /> },
    { id: 'communication', name: 'Communication', icon: <MessageCircle className="h-4 w-4" /> },
    { id: 'timetable', name: 'Timetable', icon: <FileText className="h-4 w-4" /> },
    { id: 'account', name: 'Account', icon: <FileText className="h-4 w-4" /> },
    { id: 'settings', name: 'Settings', icon: <FileText className="h-4 w-4" /> }
  ];

  const resources = [
    {
      title: 'Teacher User Guide',
      description: 'Comprehensive guide for teachers using the Pacey School System',
      type: 'PDF',
      icon: <FileText className="h-5 w-5 text-red-600" />,
      url: '#'
    },
    {
      title: 'Getting Started Video',
      description: 'Video tutorial covering basic system navigation and features',
      type: 'Video',
      icon: <Video className="h-5 w-5 text-blue-600" />,
      url: '#'
    },
    {
      title: 'Grading System Guide',
      description: 'Understanding the Nigerian grading system implementation',
      type: 'PDF',
      icon: <FileText className="h-5 w-5 text-green-600" />,
      url: '#'
    },
    {
      title: 'Communication Best Practices',
      description: 'Guidelines for effective parent-teacher communication',
      type: 'PDF',
      icon: <FileText className="h-5 w-5 text-purple-600" />,
      url: '#'
    }
  ];

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleTicketSubmit = async () => {
    if (!ticket.subject || !ticket.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSubmittingTicket(true);
      // API call to submit support ticket
      console.log('Submitting support ticket:', ticket);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Support ticket submitted successfully! We will get back to you within 24 hours.');
      setTicket({
        subject: '',
        category: 'general',
        priority: 'medium',
        description: ''
      });
    } catch (error) {
      console.error('Error submitting ticket:', error);
      alert('Failed to submit support ticket');
    } finally {
      setSubmittingTicket(false);
    }
  };

  return (
    <DashboardLayout userRole={userRole}>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <HelpCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Help & Support ❓</h1>
                  <p className="text-gray-600">Find answers to common questions and get help when you need it</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm border mb-8">
            <nav className="flex space-x-8 px-6 py-4">
              {[
                { id: 'faq', name: 'FAQ', icon: <HelpCircle className="h-4 w-4" /> },
                { id: 'contact', name: 'Contact Support', icon: <MessageCircle className="h-4 w-4" /> },
                { id: 'resources', name: 'Resources', icon: <Book className="h-4 w-4" /> },
                { id: 'tickets', name: 'Submit Ticket', icon: <Send className="h-4 w-4" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="space-y-6">
              {/* Search */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search frequently asked questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* FAQ List */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Frequently Asked Questions</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {filteredFAQs.map((faq) => (
                    <div key={faq.id} className="px-6 py-4">
                      <button
                        onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <h3 className="text-sm font-medium text-gray-900 pr-4">{faq.question}</h3>
                        {expandedFAQ === faq.id ? (
                          <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        )}
                      </button>
                      {expandedFAQ === faq.id && (
                        <div className="mt-3 pr-8">
                          <p className="text-sm text-gray-600">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  {filteredFAQs.length === 0 && (
                    <div className="px-6 py-8 text-center text-gray-500">
                      <HelpCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p>No FAQ items found matching your search.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Contact Support Tab */}
          {activeTab === 'contact' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Get in Touch</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Phone className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Phone Support</h3>
                      <p className="text-sm text-gray-600">+234 803 PACEY-HELP (722394)</p>
                      <p className="text-xs text-gray-500">Available Mon-Fri, 8AM-5PM WAT</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Mail className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Email Support</h3>
                      <p className="text-sm text-gray-600">support@paceyschool.edu.ng</p>
                      <p className="text-xs text-gray-500">Response within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <MessageCircle className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Live Chat</h3>
                      <p className="text-sm text-gray-600">Available on our website</p>
                      <p className="text-xs text-gray-500">Mon-Fri, 9AM-4PM WAT</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
                <div className="space-y-3">
                  <a href="#" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-sm font-medium text-gray-900">System Status</span>
                    <ExternalLink className="h-4 w-4 text-gray-500" />
                  </a>
                  <a href="#" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-sm font-medium text-gray-900">Feature Requests</span>
                    <ExternalLink className="h-4 w-4 text-gray-500" />
                  </a>
                  <a href="#" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-sm font-medium text-gray-900">Bug Reports</span>
                    <ExternalLink className="h-4 w-4 text-gray-500" />
                  </a>
                  <a href="#" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-sm font-medium text-gray-900">Training Videos</span>
                    <ExternalLink className="h-4 w-4 text-gray-500" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Documentation & Resources</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {resources.map((resource, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex items-start space-x-3">
                        <div className="bg-gray-100 p-2 rounded-lg">
                          {resource.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900">{resource.title}</h3>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {resource.type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                          <a
                            href={resource.url}
                            className="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 mt-2"
                          >
                            <span>Download</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Submit Ticket Tab */}
          {activeTab === 'tickets' && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Submit Support Ticket</h2>
                <p className="text-sm text-gray-600">Can't find what you're looking for? Submit a support ticket and we'll help you out.</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      value={ticket.subject}
                      onChange={(e) => setTicket(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Brief description of your issue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={ticket.category}
                      onChange={(e) => setTicket(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="general">General Support</option>
                      <option value="technical">Technical Issue</option>
                      <option value="account">Account Problem</option>
                      <option value="feature">Feature Request</option>
                      <option value="bug">Bug Report</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'low', label: 'Low', color: 'bg-green-100 text-green-700 border-green-200' },
                      { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
                      { value: 'high', label: 'High', color: 'bg-red-100 text-red-700 border-red-200' }
                    ].map((priority) => (
                      <button
                        key={priority.value}
                        onClick={() => setTicket(prev => ({ ...prev, priority: priority.value as any }))}
                        className={`px-4 py-2 rounded-md border-2 text-sm font-medium transition-colors ${
                          ticket.priority === priority.value
                            ? priority.color
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {priority.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={ticket.description}
                    onChange={(e) => setTicket(prev => ({ ...prev, description: e.target.value }))}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Please provide a detailed description of your issue, including any error messages and steps to reproduce the problem."
                  />
                </div>

                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => setTicket({
                      subject: '',
                      category: 'general',
                      priority: 'medium',
                      description: ''
                    })}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Clear Form
                  </button>
                  <button
                    onClick={submitSupportTicket}
                    disabled={submittingTicket || !ticket.subject || !ticket.description}
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    <Send className="h-4 w-4" />
                    <span>{submittingTicket ? 'Submitting...' : 'Submit Ticket'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
