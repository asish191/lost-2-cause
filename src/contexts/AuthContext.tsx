'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, RegisterPayload } from '../types';
import { logout as logoutService } from '../services/authService';
import { API_ENDPOINTS } from '../constants/api';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (payload: RegisterPayload) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(() => {
    const token = Cookies.get('auth_token');
    if (token) {
      return {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        token
      };
    }
    return null;
  });

  const isAuthenticated = !!user;

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      if (user?.token) {
        try {
          const response = await fetch(API_ENDPOINTS.USER, {
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(prev => prev && {
              ...prev,
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email
            });
          } else {
            logout();
          }
        } catch (error) {
          logout();
        }
      }
    };
    loadUserData();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      const token = data.user.token;
      
      // Store token securely in cookies
      Cookies.set('auth_token', token, { 
        expires: 7, // 7 days
        secure: true, // Only send over HTTPS
        sameSite: 'strict' // Prevent CSRF
      });
      
      setUser({
        id: data.user.userId,
        firstName: data.user.firstName || '',
        lastName: data.user.lastName || '',
        email: data.user.email,
        token
      });
      
      // Redirect to dashboard after successful login
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (userData: RegisterPayload) => {
    try {
      const response = await fetch(API_ENDPOINTS.SIGNUP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      if (data.statusCode === 201) {
        setUser({
          id: data.body.user.user.email,
          firstName: userData.first_name,
          lastName: userData.last_name,
          email: userData.email,
          token: data.body.user.token
        });
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (user?.token) {
        await logoutService(user.token);
      }
      setUser(null);
      Cookies.remove('auth_token');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if server logout fails, we still clear local state
      setUser(null);
      Cookies.remove('auth_token');
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
