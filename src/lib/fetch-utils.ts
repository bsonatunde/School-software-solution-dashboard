// Utility functions for safe API calls

export interface SafeFetchResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}

/**
 * Safe fetch function that handles JSON parsing errors
 */
export async function safeFetch<T = any>(
  url: string,
  options?: RequestInit
): Promise<SafeFetchResponse<T>> {
  try {
    const response = await fetch(url, options);
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    
    if (!response.ok) {
      if (isJson) {
        try {
          const errorData = await response.json();
          return {
            success: false,
            error: errorData.error || errorData.message || `Request failed with status ${response.status}`,
            status: response.status
          };
        } catch {
          // JSON parsing failed, return text error
          const text = await response.text();
          return {
            success: false,
            error: `Request failed with status ${response.status}: ${response.statusText}`,
            status: response.status
          };
        }
      } else {
        // Non-JSON error response
        const text = await response.text();
        return {
          success: false,
          error: `Server returned non-JSON response (${response.status}): ${response.statusText}`,
          status: response.status
        };
      }
    }
    
    if (!isJson) {
      const text = await response.text();
      console.error('Non-JSON response received:', { 
        status: response.status, 
        contentType, 
        url,
        preview: text.substring(0, 200) 
      });
      
      return {
        success: false,
        error: `Server returned non-JSON response (${response.status})`,
        status: response.status
      };
    }
    
    const data = await response.json();
    return {
      success: true,
      data,
      status: response.status
    };
    
  } catch (error) {
    console.error('Fetch error:', { url, error });
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred',
      status: 0
    };
  }
}

/**
 * Safe JSON parsing for response objects
 */
export async function safeParseJson<T = any>(response: Response): Promise<SafeFetchResponse<T>> {
  try {
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    
    if (!isJson) {
      const text = await response.text();
      console.error('Non-JSON response received:', { 
        status: response.status, 
        contentType, 
        preview: text.substring(0, 200) 
      });
      
      return {
        success: false,
        error: `Server returned non-JSON response (${response.status})`,
        status: response.status
      };
    }
    
    const data = await response.json();
    return {
      success: true,
      data,
      status: response.status
    };
    
  } catch (error) {
    console.error('JSON parsing error:', error);
    return {
      success: false,
      error: 'Failed to parse server response as JSON',
      status: response.status
    };
  }
}

/**
 * Handles API error responses with better error messages
 */
export function handleApiError(error: any): string {
  if (error instanceof Error) {
    // Check for common error patterns
    if (error.message.includes('Unexpected token')) {
      return 'Server returned invalid response format. Please try again.';
    }
    if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
      return 'Network connection error. Please check your internet connection.';
    }
    if (error.message.includes('Invalid credentials')) {
      return 'Invalid credentials. Please check your email and password.';
    }
    
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
}
