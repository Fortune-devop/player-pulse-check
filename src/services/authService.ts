
import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { toast } from 'sonner';

/**
 * Register a new user
 */
export const registerUser = async (name: string, email: string, password: string): Promise<FirebaseUser> => {
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
      isApproved: false, // New users are not approved by default
      createdAt: serverTimestamp()
    });
    
    toast.success('Account created successfully! Please check your email to verify your account. You will be notified when your account is approved.');
    return userCredential.user;
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to create account';
    toast.error(errorMessage);
    throw error;
  }
};

/**
 * Send verification email to current user
 */
export const sendVerificationEmailToUser = async (): Promise<void> => {
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

/**
 * Login user with email and password
 */
export const loginUser = async (email: string, password: string): Promise<FirebaseUser> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Check if user is approved
    const userDocRef = doc(db, "users", userCredential.user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.data()?.isApproved) {
      await signOut(auth);
      toast.error('Your account is pending approval. You will be notified when approved.');
      throw new Error('Account pending approval');
    }
    
    if (!userCredential.user.emailVerified) {
      toast.warning('Please verify your email address to access all features.');
    } else {
      toast.success('Signed in successfully!');
    }
    
    return userCredential.user;
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to sign in';
    toast.error(errorMessage);
    throw error;
  }
};

/**
 * Sign in with Google
 */
export const googleSignIn = async (): Promise<FirebaseUser> => {
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
        isApproved: false, // New Google users need approval too
        createdAt: serverTimestamp()
      });
      
      toast.info('Your account has been created and is pending approval.');
      await signOut(auth); // Sign out until approved
      throw new Error('Account pending approval');
    } else if (!userDoc.data()?.isApproved) {
      toast.error('Your account is pending approval.');
      await signOut(auth);
      throw new Error('Account pending approval');
    }
    
    toast.success('Signed in with Google successfully!');
    return result.user;
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to sign in with Google';
    toast.error(errorMessage);
    throw error;
  }
};

/**
 * Log out the current user
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    toast.success('Logged out successfully');
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to log out';
    toast.error(errorMessage);
    throw error;
  }
};

/**
 * Update user profile information
 */
export const updateUserProfileInfo = async (
  userId: string,
  data: { name?: string; avatar?: string | null }
): Promise<void> => {
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
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, data, { merge: true });
    
    toast.success('Profile updated successfully!');
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to update profile';
    toast.error(errorMessage);
    throw error;
  }
};
