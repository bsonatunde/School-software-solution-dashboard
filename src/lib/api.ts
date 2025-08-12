// API client utility functions

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${BASE_URL}/api${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Check if response is JSON by looking at content-type
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');
      
      if (!isJson) {
        // If it's not JSON, get the text to see what was returned
        const text = await response.text();
        console.error('Non-JSON response received:', { 
          status: response.status, 
          statusText: response.statusText, 
          contentType, 
          url,
          preview: text.substring(0, 200) 
        });
        
        throw new Error(`Server returned non-JSON response (${response.status}): ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        // Use a more specific error message for 401 Unauthorized
        if (response.status === 401) {
          throw new Error('Invalid credentials');
        }
        throw new Error(data.error || `API request failed with status ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('API request error:', { url, error });
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string, userType?: string) {
    console.log('API Client login called with:', { email, userType }); // Debug log
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Dashboard endpoints
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  // Student endpoints
  async getStudents(params?: {
    page?: number;
    limit?: number;
    search?: string;
    classId?: string;
    status?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    return this.request(`/students${queryString ? `?${queryString}` : ''}`);
  }

  async getStudent(id: string) {
    return this.request(`/students/${encodeURIComponent(id)}`);
  }

  async createStudent(data: any) {
    return this.request('/students', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateStudent(id: string, data: any) {
    return this.request(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteStudent(id: string) {
    return this.request(`/students/${id}`, {
      method: 'DELETE',
    });
  }

  // Classes endpoints
  async getClasses() {
    return this.request('/classes');
  }

  // Teachers endpoints
  async getTeachers() {
    return this.request('/teachers');
  }

  // Assignment endpoints
  async getAssignments(params?: {
    studentId?: string;
    teacherId?: string;
    classId?: string;
    subject?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    return this.request(`/assignments?${searchParams.toString()}`);
  }

  async createAssignment(data: any) {
    return this.request('/assignments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async submitAssignment(data: any) {
    return this.request('/assignments/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async gradeSubmission(submissionId: string, data: any) {
    return this.request(`/assignments/submissions/${submissionId}/grade`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getAssignmentSubmissions(assignmentId: string) {
    return this.request(`/assignments/${assignmentId}/submissions`);
  }

  // Notifications endpoints
  async getNotifications(params?: {
    studentId?: string;
    page?: number;
    limit?: number;
    isRead?: boolean;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    return this.request(`/notifications?${searchParams.toString()}`);
  }

  async markNotificationAsRead(data: { notificationId?: string; studentId: string; markAllAsRead?: boolean }) {
    return this.request('/notifications', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient();

// React hooks for API calls
export const useApi = () => {
  return apiClient;
};

// Utility functions for handling API responses
export const handleApiError = (error: any) => {
  if (error instanceof Error) {
    // Provide more specific error messages for common cases
    if (error.message.includes('Invalid credentials')) {
      return '❌ Invalid email or password. Please check your credentials and try again.';
    }
    if (error.message.includes('Network')) {
      return '🌐 Network error. Please check your internet connection.';
    }
    if (error.message.includes('404')) {
      return '📭 Resource not found. Please try again.';
    }
    if (error.message.includes('500')) {
      return '⚠️ Server error. Please try again later.';
    }
    return `⚠️ ${error.message}`;
  }
  return '❌ An unexpected error occurred. Please try again.';
};

// Assignment endpoints
class AssignmentApiMethods {
  private request: any;
  
  constructor(request: any) {
    this.request = request;
  }

  async getAssignments(params?: {
    studentId?: string;
    teacherId?: string;
    classId?: string;
    subject?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    return this.request(`/assignments?${searchParams.toString()}`);
  }

  async createAssignment(data: any) {
    return this.request('/assignments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async submitAssignment(data: any) {
    return this.request('/assignments/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Message API methods
  async getMessages(params?: { 
    studentId?: string; 
    recipientType?: string; 
    limit?: number; 
    page?: number; 
  }) {
    const searchParams = new URLSearchParams();
    if (params?.studentId) searchParams.append('studentId', params.studentId);
    if (params?.recipientType) searchParams.append('recipientType', params.recipientType);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.page) searchParams.append('page', params.page.toString());
    
    const query = searchParams.toString();
    return this.request(`/messages${query ? `?${query}` : ''}`);
  }

  async sendMessage(data: {
    senderId: string;
    senderType: string;
    recipientType: string;
    recipientIds?: string[];
    title: string;
    content: string;
    priority?: string;
    deliveryMethod?: string;
  }) {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMessage(messageId: string, data: any) {
    return this.request(`/messages?id=${messageId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async createSampleMessages() {
    return this.request('/create-sample-messages', {
      method: 'POST',
    });
  }

  // Timetable API methods
  async getTimetables(params?: { 
    studentId?: string; 
    classId?: string; 
    className?: string;
    day?: string; 
    term?: string;
    academicYear?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.studentId) searchParams.append('studentId', params.studentId);
    if (params?.classId) searchParams.append('classId', params.classId);
    if (params?.className) searchParams.append('className', params.className);
    if (params?.day) searchParams.append('day', params.day);
    if (params?.term) searchParams.append('term', params.term);
    if (params?.academicYear) searchParams.append('academicYear', params.academicYear);
    
    const query = searchParams.toString();
    return this.request(`/timetable${query ? `?${query}` : ''}`);
  }

  async createTimetable(data: {
    classId: string;
    className: string;
    term: string;
    academicYear: string;
    dayOfWeek: string;
    periods: any[];
    createdBy: string;
  }) {
    return this.request('/timetable', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTimetable(timetableId: string, data: any) {
    return this.request(`/timetable?id=${timetableId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTimetable(timetableId: string) {
    return this.request(`/timetable?id=${timetableId}`, {
      method: 'DELETE',
    });
  }

  async createSampleTimetables() {
    return this.request('/create-sample-timetables', {
      method: 'POST',
    });
  }
}

export const formatCurrency = (amount: number, currency: string = '₦') => {
  return `${currency}${amount.toLocaleString()}`;
};

export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateTime = (date: string | Date) => {
  return new Date(date).toLocaleString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
