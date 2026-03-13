import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { apiClient, authApi } from '../../services/api';
import { toast } from 'sonner';
import { jwtDecode } from 'jwt-decode';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'technician' | 'admin';
  phone?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  handleUnauthorized: () => void;
  isTokenExpired: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if JWT token is expired
  const isTokenExpired = useCallback(() => {
    if (!token) return true;
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }, [token]);

  // Handle 401 Unauthorized - logout user
  const handleUnauthorized = useCallback(async () => {
    console.warn('Unauthorized access - logging out');
    setUser(null);
    setToken(null);
    apiClient.clearToken();
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    toast.error('Session expired. Please sign in again.');
  }, []);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('currentUser');

    if (storedToken && storedUser) {
      try {
        // Check if token is expired
        try {
          const decoded: any = jwtDecode(storedToken);
          const currentTime = Date.now() / 1000;
          if (decoded.exp < currentTime) {
            // Token is expired
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
            setIsLoading(false);
            return;
          }
        } catch (decodeError) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('currentUser');
          setIsLoading(false);
          return;
        }

        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        apiClient.setToken(storedToken);
      } catch (error) {
        console.error('Failed to restore auth state:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
      }
    }

    setIsLoading(false);
  }, []);

  // Check token expiration periodically
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      if (isTokenExpired()) {
        handleUnauthorized();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [token, isTokenExpired, handleUnauthorized]);

  const login = async (email: string, password: string, role: string) => {
    setIsLoading(true);
    try {
      console.log('Attempting login with:', { email, role });

      const response = await authApi.login(
        email,
        password,
        role as 'customer' | 'technician' | 'admin'
      );

      if (response?.user && response?.token) {
        setUser(response.user);
        setToken(response.token);
        apiClient.setToken(response.token);

        localStorage.setItem('authToken', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));

        toast.success(`Welcome back, ${response.user.name}!`);
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, phone: string, role: string) => {
    setIsLoading(true);
    try {
      console.log('Attempting registration with:', { name, email, phone, role });

      const response = await authApi.register(
        email,
        password,
        name,
        phone,
        role as 'customer' | 'technician'
      );

      if (response?.user) {
        toast.success('Account created successfully! Please sign in.');
      } else {
        throw new Error('Invalid registration response');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();

      setUser(null);
      setToken(null);
      apiClient.clearToken();

      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');

      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token && !isTokenExpired(),
        login,
        register,
        logout,
        setUser,
        handleUnauthorized,
        isTokenExpired,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
