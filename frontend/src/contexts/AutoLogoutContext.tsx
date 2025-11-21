'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface AutoLogoutContextType {
  isWarningVisible: boolean;
  timeLeft: number;
  resetTimer: () => void;
  stayLoggedIn: () => void;
  logoutNow: () => void;
  updateTimeoutDuration: (minutes: number) => void;
  timeoutDuration: number;
}

const AutoLogoutContext = createContext<AutoLogoutContextType | undefined>(undefined);

export const useAutoLogout = () => {
  const context = useContext(AutoLogoutContext);
  if (context === undefined) {
    throw new Error('useAutoLogout must be used within an AutoLogoutProvider');
  }
  return context;
};

interface AutoLogoutProviderProps {
  children: ReactNode;
}

export const AutoLogoutProvider: React.FC<AutoLogoutProviderProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const [timeoutDuration, setTimeoutDuration] = useState(10); // 10 minutes default
  const [warningDuration] = useState(60); // 60 seconds warning
  const [timeLeft, setTimeLeft] = useState(timeoutDuration * 60);
  const [isWarningVisible, setIsWarningVisible] = useState(false);
  
  // Use refs to avoid dependency issues
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const warningIdRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimeouts = useCallback(() => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
    if (warningIdRef.current) {
      clearInterval(warningIdRef.current);
      warningIdRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    // Clear existing timeouts
    clearTimeouts();
    
    setIsWarningVisible(false);
    setTimeLeft(timeoutDuration * 60);

    // Set new timeout for warning
    timeoutIdRef.current = setTimeout(() => {
      setIsWarningVisible(true);
      setTimeLeft(warningDuration);
      
      // Start countdown for warning
      warningIdRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            logout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, (timeoutDuration - 1) * 60 * 1000); // Show warning 1 minute before timeout
  }, [timeoutDuration, warningDuration, logout, clearTimeouts]);

  const stayLoggedIn = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  const logoutNow = useCallback(() => {
    logout();
  }, [logout]);

  const updateTimeoutDuration = useCallback((minutes: number) => {
    setTimeoutDuration(minutes);
    resetTimer();
  }, [resetTimer]);

  // Track user activity
  useEffect(() => {
    if (!user) {
      clearTimeouts();
      return;
    }

    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    const handleActivity = () => {
      // Reset timer on any activity
      resetTimer();
    };

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true);
    });

    // Initial timer setup
    resetTimer();

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });
      clearTimeouts();
    };
  }, [user, resetTimer, clearTimeouts]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeouts();
    };
  }, [clearTimeouts]);

  const value = {
    isWarningVisible,
    timeLeft,
    resetTimer,
    stayLoggedIn,
    logoutNow,
    updateTimeoutDuration,
    timeoutDuration,
  };

  return <AutoLogoutContext.Provider value={value}>{children}</AutoLogoutContext.Provider>;
};