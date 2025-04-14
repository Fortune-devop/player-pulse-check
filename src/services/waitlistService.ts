
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'sonner';

/**
 * Add a user to the waitlist
 */
export const addToWaitlist = async (name: string, email: string): Promise<void> => {
  try {
    // Check if email already exists in waitlist
    const waitlistQuery = query(collection(db, "waitlist"), where("email", "==", email));
    const waitlistDocs = await getDocs(waitlistQuery);
    
    if (!waitlistDocs.empty) {
      throw new Error('This email already exists in our waitlist.');
    }
    
    // Add the user to the waitlist collection
    await addDoc(collection(db, "waitlist"), {
      name,
      email,
      createdAt: serverTimestamp(),
      status: 'pending' // pending, approved, rejected
    });
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to join waitlist';
    toast.error(errorMessage);
    throw error;
  }
};
