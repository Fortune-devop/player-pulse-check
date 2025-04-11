
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
} | null;

type AuthContextType = {
  user: User;
  isAuthenticated: boolean;
  login: (user: Omit<NonNullable<User>, 'id'> & { id: string }) => void;
  logout: () => void;
  googleSignIn: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);

  // Check for existing user session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse user from localStorage', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (userData: Omit<NonNullable<User>, 'id'> & { id: string }) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
  };

  // Google Sign In simulation
  const googleSignIn = async (): Promise<void> => {
    // In a real app, this would integrate with Google OAuth
    // For demo purposes, we'll simulate a successful Google login
    return new Promise((resolve) => {
      setTimeout(() => {
        const googleUser = {
          id: 'google123',
          name: 'Google User',
          email: 'google.user@gmail.com',
          avatar: null,
        };
        
        setUser(googleUser);
        localStorage.setItem('user', JSON.stringify(googleUser));
        resolve();
      }, 1000); // Simulate network delay
    });
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    googleSignIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
