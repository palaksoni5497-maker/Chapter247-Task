'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    const userData = Cookies.get('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        // Set up axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error('Error parsing user data:', error);
        Cookies.remove('token');
        Cookies.remove('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login with:', { username, password });
      
      // First, try to login with DummyJSON API
      try {
        const response = await fetch('https://dummyjson.com/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password,
          }),
        });

        console.log('DummyJSON Response status:', response.status);
        console.log('DummyJSON Response ok:', response.ok);

        if (response.ok) {
          const userData = await response.json();
          console.log('DummyJSON Login response data:', userData);

          // DummyJSON returns accessToken instead of token
          const token = userData.accessToken || userData.token;
          if (token) {
            // Normalize the user data structure
            const normalizedUser = {
              ...userData,
              token: token,
            };
            
            setUser(normalizedUser);
            
            // Store in cookies
            Cookies.set('token', token, { expires: 7 }); // 7 days
            Cookies.set('user', JSON.stringify(normalizedUser), { expires: 7 });
            
            // Set up axios default header
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            console.log('DummyJSON Login successful!');
            return true;
          }
        } else {
          const errorData = await response.json();
          console.log('DummyJSON API Error Response:', errorData);
        }
      } catch (apiError) {
        console.log('DummyJSON API failed, trying mock users:', apiError);
      }

      // If DummyJSON fails, try mock users from localStorage
      const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      const mockUser = mockUsers.find((user: any) => 
        user.username === username && user.password === password
      );

      if (mockUser) {
        console.log('Mock user found:', mockUser);
        setUser(mockUser);
        
        // Store in cookies
        Cookies.set('token', mockUser.token, { expires: 7 });
        Cookies.set('user', JSON.stringify(mockUser), { expires: 7 });
        
        // Set up axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${mockUser.token}`;
        
        console.log('Mock user login successful!');
        return true;
      }
      
      console.log('No matching user found');
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      console.log('Attempting registration with:', userData);
      
      // Since DummyJSON doesn't support user creation, we'll create a mock user
      // and store it in localStorage for demo purposes
      const mockUser = {
        id: Date.now(), // Simple ID generation
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        password: userData.password, // In real app, this should be hashed
        age: 25,
        gender: 'other',
        image: 'https://via.placeholder.com/150',
        token: `mock_token_${Date.now()}`,
      };

      // Store the mock user in localStorage
      const existingUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      existingUsers.push(mockUser);
      localStorage.setItem('mockUsers', JSON.stringify(existingUsers));

      console.log('Mock user created:', mockUser);
      
      // Set the user and store in cookies
      setUser(mockUser);
      Cookies.set('token', mockUser.token, { expires: 7 });
      Cookies.set('user', JSON.stringify(mockUser), { expires: 7 });
      axios.defaults.headers.common['Authorization'] = `Bearer ${mockUser.token}`;
      
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    Cookies.remove('token');
    Cookies.remove('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
