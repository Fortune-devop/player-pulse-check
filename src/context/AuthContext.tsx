
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword, 
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { toast } from 'sonner';

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  emailVerified: boolean;
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
          emailVerified: firebaseUser.emailVerified
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
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with name
      await updateProfile(userCredential.user, {
        displayName: name
      });

      // Send verification email
      await sendEmailVerification(userCredential.user);

      // Store additional user information in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email,
        avatar: null,
        emailVerified: false,
        createdAt: new Date()
      });
      
      toast.success('Account created successfully! Please check your email to verify your account.');
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create account';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Send verification email
  const sendVerificationEmail = async (): Promise<void> => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await sendEmailVerification(currentUser);
        toast.success('Verification email sent! Please check your inbox.');
      } else {
        toast.error('No user is currently signed in.');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to send verification email';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Login with email/password
  const login = async (email: string, password: string): Promise<void> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (!userCredential.user.emailVerified) {
        toast.warning('Please verify your email address to access all features.');
      } else {
        toast.success('Signed in successfully!');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to sign in';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Google Sign In
  const googleSignIn = async (): Promise<void> => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if this is a new user
      const userDocRef = doc(db, "users", result.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Store user info in Firestore for new users
        await setDoc(userDocRef, {
          name: result.user.displayName,
          email: result.user.email,
          avatar: result.user.photoURL,
          createdAt: new Date()
        });
      }
      
      toast.success('Signed in with Google successfully!');
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to sign in with Google';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to log out';
      toast.error(errorMessage);
    }
  };

  // Update user profile
  const updateUserProfile = async (data: { name?: string; avatar?: string | null }): Promise<void> => {
    if (!user) return;
    
    try {
      // Update Firebase Auth profile if name or avatar changed
      const currentUser = auth.currentUser;
      if (currentUser) {
        const updates: { displayName?: string; photoURL?: string | null } = {};
        
        if (data.name) updates.displayName = data.name;
        if (data.avatar !== undefined) updates.photoURL = data.avatar;
        
        if (Object.keys(updates).length > 0) {
          await updateProfile(currentUser, updates);
        }
      }
      
      // Update additional data in Firestore
      const userDocRef = doc(db, "users", user.id);
      await setDoc(userDocRef, data, { merge: true });
      
      // Update local user state
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          name: data.name || prev.name,
          avatar: data.avatar !== undefined ? data.avatar : prev.avatar
        };
      });
      
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update profile';
      toast.error(errorMessage);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    googleSignIn,
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
