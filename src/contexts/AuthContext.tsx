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
        token,
        isAdmin: false // Default to false for initial user
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
      console.log('LOGIN RESPONSE USER:', data.body.user); // Debug log
      const userData = data.body.user.user; // Fix: go one level deeper

      // Store token securely in cookies
      Cookies.set('auth_token', userData.token, { 
        expires: 7, // 7 days
        secure: true, // Only send over HTTPS
        sameSite: 'strict' // Prevent CSRF
      });
      
      setUser({
        id: userData.userID,
        firstName: userData.name?.split(' ')[0] || '',
        lastName: userData.name?.split(' ')[1] || '',
        email: userData.email,
        token: userData.token,
        isAdmin: userData.isAdmin ?? false
      });
      
      // Redirect based on isAdmin
      if (userData.isAdmin) {
        router.push('/admin-dashboard');
      } else {
        router.push('/dashboard');
      }
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
          token: data.body.user.token,
          isAdmin: false // RegisterPayload does not have isAdmin, so default to false
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
      router.push('/'); // Redirect to homepage instead of login
    } catch (error) {
      console.error('Logout error:', error);
      // Even if server logout fails, we still clear local state
      setUser(null);
      Cookies.remove('auth_token');
      router.push('/'); // Redirect to homepage instead of login
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
