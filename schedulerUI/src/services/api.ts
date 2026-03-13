// API configuration and client setup
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  meta?: {
    timestamp: string;
    version: string;
  };
}

interface ApiRequestOptions extends RequestInit {
  timeout?: number;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('authToken');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  private getHeaders(headers?: HeadersInit): HeadersInit {
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      defaultHeaders['Authorization'] = `Bearer ${this.token}`;
    }

    return { ...defaultHeaders, ...headers };
  }

  async request<T = any>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const { timeout = 30000, ...fetchOptions } = options;
    const url = `${this.baseUrl}${endpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      console.log(`[API] ${fetchOptions.method || 'GET'} ${endpoint}`);
      
      const response = await fetch(url, {
        ...fetchOptions,
        headers: this.getHeaders(fetchOptions.headers),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type');
      let responseData: any;

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      console.log(`[API] Response:`, responseData);

      if (!response.ok) {
        // Handle new serialized error response format
        if (responseData?.success === false) {
          if (responseData.errors) {
            const errorMessages = Object.entries(responseData.errors)
              .map(([key, msgs]: [string, any]) => `${key}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
              .join('; ');
            throw new Error(errorMessages);
          }
          throw new Error(responseData.error || responseData.message || response.statusText);
        }
        // Handle legacy error format
        const error = responseData?.error || responseData?.message || response.statusText;
        throw new Error(error);
      }

      // Handle new serialized response format
      if (responseData?.success === true && responseData.data !== undefined) {
        return responseData.data;
      }

      // Handle legacy response format
      return responseData;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        console.error(`[API] Error:`, error.message);
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  get<T = any>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T = any>(endpoint: string, data?: any, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put<T = any>(endpoint: string, data?: any, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  patch<T = any>(endpoint: string, data?: any, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete<T = any>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();

// Auth API with proper type safety
export const authApi = {
  login: async (email: string, password: string, role: 'customer' | 'technician' | 'admin') => {
    const result = await apiClient.post<{
      user: {
        id: string;
        email: string;
        name: string;
        phone?: string;
        role: string;
      };
      token: string;
    }>('/auth/login', { email, password, role });
    return result;
  },

  register: async (
    email: string,
    password: string,
    name: string,
    phone: string,
    role: 'customer' | 'technician'
  ) => {
    const result = await apiClient.post<{
      user: {
        id: string;
        email: string;
        name: string;
        phone: string;
        role: string;
      };
      token: string;
    }>('/auth/register', { email, password, name, phone, role });
    return result;
  },

  logout: () => {
    apiClient.clearToken();
    return apiClient.post('/auth/logout');
  },

  getCurrentUser: () =>
    apiClient.get<{
      id: string;
      email: string;
      name: string;
      phone?: string;
      role: string;
    }>('/auth/me'),
};

// Users API
export const usersApi = {
  getAll: () => apiClient.get('/users'),
  getById: (id: string) => apiClient.get(`/users/${id}`),
  create: (data: any) => apiClient.post('/users', data),
  update: (id: string, data: any) => apiClient.put(`/users/${id}`, data),
  delete: (id: string) => apiClient.delete(`/users/${id}`),
};

// Appointments API
export const appointmentsApi = {
  getAll: () => apiClient.get('/appointments'),
  getById: (id: string) => apiClient.get(`/appointments/${id}`),
  create: (data: any) => apiClient.post('/appointments', data),
  update: (id: string, data: any) => apiClient.put(`/appointments/${id}`, data),
  cancel: (id: string, reason?: string) => apiClient.patch(`/appointments/${id}/cancel`, { reason }),
  delete: (id: string) => apiClient.delete(`/appointments/${id}`),
};

// Technicians API
export const techniciansApi = {
  getAll: () => apiClient.get('/technicians'),
  getById: (id: string) => apiClient.get(`/technicians/${id}`),
  create: (data: any) => apiClient.post('/technicians', data),
  update: (id: string, data: any) => apiClient.put(`/technicians/${id}`, data),
  delete: (id: string) => apiClient.delete(`/technicians/${id}`),
};

// Service Centres API
export const serviceCentresApi = {
  getAll: () => apiClient.get('/service-centres'),
  getById: (id: string) => apiClient.get(`/service-centres/${id}`),
  create: (data: any) => apiClient.post('/service-centres', data),
  update: (id: string, data: any) => apiClient.put(`/service-centres/${id}`, data),
  delete: (id: string) => apiClient.delete(`/service-centres/${id}`),
};
