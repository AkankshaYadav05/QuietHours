'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = fetch('/api/auth/verify', {
          headers: { Authorization: `Bearer ${token}` },
        });
        response.then(async (res) => {
          if (res.ok) {
            const userData = await res.json();
            setUser(userData.user);
          } else {
            localStorage.removeItem('token');
          }
          setIsLoading(false);
        });
      } catch {
        localStorage.removeItem('token');
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { token, user: userData } = await response.json();
        localStorage.setItem('token', token);
        setUser(userData);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        const { token, user: userData } = await response.json();
        localStorage.setItem('token', token);
        setUser(userData);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
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