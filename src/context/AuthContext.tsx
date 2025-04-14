
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import {
  registerUser,
  loginUser,
  googleSignIn,
  logoutUser,
  updateUserProfileInfo,
  sendVerificationEmailToUser
} from '../services/authService';

// Re-export the addToWaitlist function
export { addToWaitlist } from '../services/waitlistService';

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  emailVerified: boolean;
  isApproved?: boolean;
} | null;

type AuthContextType = {
  user: User;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  googleSignIn: () => Promise<void>;
  updateUserProfile: (data: { name?: string; avatar?: string | null }) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get additional user data from Firestore
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        const userData: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || userDoc.data()?.name || 'User',
          email: firebaseUser.email || '',
          avatar: firebaseUser.photoURL || userDoc.data()?.avatar || null,
          emailVerified: firebaseUser.emailVerified,
          isApproved: userDoc.data()?.isApproved ?? true // Default to true for existing users
        };
        
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Register new user
  const register = async (name: string, email: string, password: string): Promise<void> => {
    await registerUser(name, email, password);
  };

  // Send verification email
  const sendVerificationEmail = async (): Promise<void> => {
    await sendVerificationEmailToUser();
  };

  // Login with email/password
  const login = async (email: string, password: string): Promise<void> => {
    await loginUser(email, password);
  };

  // Google Sign In wrapper
  const handleGoogleSignIn = async (): Promise<void> => {
    await googleSignIn();
  };

  // Logout wrapper
  const logout = async (): Promise<void> => {
    await logoutUser();
  };

  // Update user profile
  const updateUserProfile = async (data: { name?: string; avatar?: string | null }): Promise<void> => {
    if (!user) return;
    await updateUserProfileInfo(user.id, data);
    
    // Update local user state
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        name: data.name || prev.name,
        avatar: data.avatar !== undefined ? data.avatar : prev.avatar
      };
    });
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    googleSignIn: handleGoogleSignIn,
    updateUserProfile,
    sendVerificationEmail
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
