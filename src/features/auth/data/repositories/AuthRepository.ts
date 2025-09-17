
import {
  createUserWithEmailAndPassword,
  sendEmailVerification as firebaseSendEmailVerification,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  updateProfile as firebaseUpdateProfile,
  User as FirebaseUser,
  onAuthStateChanged,
  reload,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { injectable } from 'tsyringe';
import { auth, firestore } from '../../../../infrastructure/firebase/firebase.config';
import { User } from '../../domain/entities/User';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';

@injectable()
export class AuthRepository implements IAuthRepository {
  
  private mapFirebaseUserToUser(firebaseUser: FirebaseUser, additionalData?: any): User {
    console.log('[AuthRepository] Mapping Firebase user to User entity...');
    console.log('[AuthRepository] Additional data:', additionalData);
    
    // Handle timestamp conversion safely
    let createdAt = new Date();
    let updatedAt = new Date();
    
    if (additionalData?.createdAt) {
      if (typeof additionalData.createdAt.toDate === 'function') {
        // It's a Firestore Timestamp
        createdAt = additionalData.createdAt.toDate();
      } else if (additionalData.createdAt instanceof Date) {
        // It's already a Date object
        createdAt = additionalData.createdAt;
      }
      // If it's serverTimestamp(), it will be null during creation, so use current date
    }
    
    if (additionalData?.updatedAt) {
      if (typeof additionalData.updatedAt.toDate === 'function') {
        // It's a Firestore Timestamp
        updatedAt = additionalData.updatedAt.toDate();
      } else if (additionalData.updatedAt instanceof Date) {
        // It's already a Date object
        updatedAt = additionalData.updatedAt;
      }
      // If it's serverTimestamp(), it will be null during creation, so use current date
    }
    
    const mappedUser = {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || additionalData?.name || '',
      email: firebaseUser.email || '',
      phoneNumber: additionalData?.phoneNumber || firebaseUser.phoneNumber || undefined,
      photoURL: firebaseUser.photoURL || undefined,
      emailVerified: firebaseUser.emailVerified,
      createdAt,
      updatedAt
    };
    
    console.log('[AuthRepository] User mapped successfully:', {
      id: mappedUser.id,
      name: mappedUser.name,
      email: mappedUser.email,
      phoneNumber: mappedUser.phoneNumber
    });
    
    return mappedUser;
  }

  async login(email: string, password: string): Promise<User> {
    console.log('[AuthRepository] Starting login process...');
    console.log('[AuthRepository] Login params:', { email });
    
    try {
      console.log('[AuthRepository] Attempting Firebase sign in...');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      console.log('[AuthRepository] Firebase sign in successful. UID:', firebaseUser.uid);
      
      console.log('[AuthRepository] Fetching additional user data from Firestore...');
      // Get additional user data from Firestore
      const userDoc = await getDoc(doc(firestore, 'users', firebaseUser.uid));
      const additionalData = userDoc.exists() ? userDoc.data() : {};
      console.log('[AuthRepository] User data fetched successfully.');
      
      const mappedUser = this.mapFirebaseUserToUser(firebaseUser, additionalData);
      console.log('[AuthRepository] Login completed successfully. User:', {
        id: mappedUser.id,
        name: mappedUser.name,
        email: mappedUser.email
      });
      
      return mappedUser;
    } catch (error: any) {
      console.log('[AuthRepository] Login failed with error:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      
      // Get user-friendly error message
      const errorMessage = this.getErrorMessage(error);
      console.log('[AuthRepository] Throwing user-friendly error:', errorMessage);
      
      // Create a new error with the user-friendly message but preserve original error info
      const userError = new Error(errorMessage);
      userError.name = 'AuthenticationError';
      throw userError;
    }
  }

  async signup(name: string, email: string, password: string, phoneNumber?: string): Promise<User> {
    console.log('[AuthRepository] Starting signup process...');
    console.log('[AuthRepository] Signup params:', { name, email, phoneNumber: phoneNumber || 'none' });
    
    try {
      // First, check if user is already signed in
      const currentUser = auth.currentUser;
      if (currentUser) {
        console.log('[AuthRepository] User already signed in with UID:', currentUser.uid);
        console.log('[AuthRepository] Current user email:', currentUser.email);
        console.log('[AuthRepository] Signup email:', email);
        
        if (currentUser.email === email) {
          console.log('[AuthRepository] Same email as current user, returning existing user data');
          const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
          const additionalData = userDoc.exists() ? userDoc.data() : {};
          return this.mapFirebaseUserToUser(currentUser, additionalData);
        } else {
          console.log('[AuthRepository] Different email, signing out current user first');
          await signOut(auth);
          console.log('[AuthRepository] Current user signed out successfully');
        }
      }
      
      console.log('[AuthRepository] Creating user with email and password...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      console.log('[AuthRepository] User created successfully. UID:', firebaseUser.uid);
      
      console.log('[AuthRepository] Updating user profile...');
      // Update the user's display name
      await firebaseUpdateProfile(firebaseUser, {
        displayName: name
      });
      console.log('[AuthRepository] Profile updated successfully.');
      
      console.log('[AuthRepository] Creating Firestore document...');
      // Create user document in Firestore with all user information
      const userData = {
        id: firebaseUser.uid,
        name,
        email,
        phoneNumber: phoneNumber || null,
        emailVerified: firebaseUser.emailVerified,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      console.log('[AuthRepository] User data to be saved:', { ...userData, createdAt: 'serverTimestamp()', updatedAt: 'serverTimestamp()' });
      
      await setDoc(doc(firestore, 'users', firebaseUser.uid), userData);
      console.log('[AuthRepository] Firestore document created successfully.');
      
      console.log('[AuthRepository] Sending email verification...');
      // Send email verification
      await firebaseSendEmailVerification(firebaseUser);
      console.log('[AuthRepository] Email verification sent successfully.');
      
      // For the return value, we need to pass the current timestamp since serverTimestamp() 
      // will be null until the document is actually written to Firestore
      const userDataForMapping = {
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const mappedUser = this.mapFirebaseUserToUser(firebaseUser, userDataForMapping);
      console.log('[AuthRepository] Signup completed successfully. User:', {
        id: mappedUser.id,
        name: mappedUser.name,
        email: mappedUser.email,
        phoneNumber: mappedUser.phoneNumber
      });
      
      return mappedUser;
    } catch (error: any) {
      console.log('[AuthRepository] Signup failed with error:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      
      // Special handling for email already in use error
      if (error.code === 'auth/email-already-in-use') {
        console.log('[AuthRepository] Email already in use. Checking if user is already authenticated...');
        
        // Check if the current user is already signed in with this email
        const currentUser = auth.currentUser;
        if (currentUser && currentUser.email === email) {
          console.log('[AuthRepository] User is already authenticated, returning existing user data');
          try {
            const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
            const additionalData = userDoc.exists() ? userDoc.data() : {};
            return this.mapFirebaseUserToUser(currentUser, additionalData);
          } catch (fetchError) {
            console.log('[AuthRepository] Error fetching existing user data:', fetchError);
            // Fall through to original error handling
          }
        }
        
        throw new Error('This email is already registered. Please try logging in instead, or use a different email address.');
      }
      
      throw new Error(this.getErrorMessage(error));
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.log('[AuthRepository] Logout failed with error:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      
      // Get user-friendly error message
      const errorMessage = this.getErrorMessage(error);
      console.log('[AuthRepository] Throwing user-friendly error:', errorMessage);
      
      // Create a new error with the user-friendly message but preserve original error info
      const userError = new Error(errorMessage);
      userError.name = 'AuthenticationError';
      throw userError;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return null;
    
    // Get additional user data from Firestore
    const userDoc = await getDoc(doc(firestore, 'users', firebaseUser.uid));
    const additionalData = userDoc.exists() ? userDoc.data() : {};
    
    return this.mapFirebaseUserToUser(firebaseUser, additionalData);
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get additional user data from Firestore
        const userDoc = await getDoc(doc(firestore, 'users', firebaseUser.uid));
        const additionalData = userDoc.exists() ? userDoc.data() : {};
        
        const user = this.mapFirebaseUserToUser(firebaseUser, additionalData);
        callback(user);
      } else {
        callback(null);
      }
    });
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await firebaseSendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.log('[AuthRepository] Password reset email failed with error:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      
      // Get user-friendly error message
      const errorMessage = this.getErrorMessage(error);
      console.log('[AuthRepository] Throwing user-friendly error:', errorMessage);
      
      // Create a new error with the user-friendly message but preserve original error info
      const userError = new Error(errorMessage);
      userError.name = 'AuthenticationError';
      throw userError;
    }
  }

  async updateProfile(updates: Partial<Pick<User, 'name' | 'photoURL'>>): Promise<void> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) throw new Error('No authenticated user');
    
    try {
      // Update Firebase Auth profile
      const profileUpdates: any = {};
      if (updates.name) profileUpdates.displayName = updates.name;
      if (updates.photoURL) profileUpdates.photoURL = updates.photoURL;
      
      if (Object.keys(profileUpdates).length > 0) {
        await firebaseUpdateProfile(firebaseUser, profileUpdates);
      }
      
      // Update Firestore document
      const firestoreUpdates: any = {
        updatedAt: serverTimestamp()
      };
      if (updates.name) firestoreUpdates.name = updates.name;
      
      await updateDoc(doc(firestore, 'users', firebaseUser.uid), firestoreUpdates);
    } catch (error: any) {
      console.log('[AuthRepository] Profile update failed with error:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      
      // Get user-friendly error message
      const errorMessage = this.getErrorMessage(error);
      console.log('[AuthRepository] Throwing user-friendly error:', errorMessage);
      
      // Create a new error with the user-friendly message but preserve original error info
      const userError = new Error(errorMessage);
      userError.name = 'AuthenticationError';
      throw userError;
    }
  }

  async sendEmailVerification(): Promise<void> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) throw new Error('No authenticated user');
    
    try {
      await firebaseSendEmailVerification(firebaseUser);
    } catch (error: any) {
      console.log('[AuthRepository] Email verification failed with error:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      
      // Get user-friendly error message
      const errorMessage = this.getErrorMessage(error);
      console.log('[AuthRepository] Throwing user-friendly error:', errorMessage);
      
      // Create a new error with the user-friendly message but preserve original error info
      const userError = new Error(errorMessage);
      userError.name = 'AuthenticationError';
      throw userError;
    }
  }

  async reloadUser(): Promise<void> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) throw new Error('No authenticated user');
    
    try {
      await reload(firebaseUser);
    } catch (error: any) {
      console.log('[AuthRepository] User reload failed with error:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      
      // Get user-friendly error message
      const errorMessage = this.getErrorMessage(error);
      console.log('[AuthRepository] Throwing user-friendly error:', errorMessage);
      
      // Create a new error with the user-friendly message but preserve original error info
      const userError = new Error(errorMessage);
      userError.name = 'AuthenticationError';
      throw userError;
    }
  }

  async clearAuthState(): Promise<void> {
    console.log('[AuthRepository] Clearing auth state...');
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        console.log('[AuthRepository] Signing out current user:', currentUser.uid);
        await signOut(auth);
        console.log('[AuthRepository] Auth state cleared successfully');
      } else {
        console.log('[AuthRepository] No current user to sign out');
      }
    } catch (error: any) {
      console.log('[AuthRepository] Error clearing auth state:', error);
      
      // Get user-friendly error message
      const errorMessage = this.getErrorMessage(error);
      console.log('[AuthRepository] Throwing user-friendly error:', errorMessage);
      
      // Create a new error with the user-friendly message but preserve original error info
      const userError = new Error(errorMessage);
      userError.name = 'AuthenticationError';
      throw userError;
    }
  }

  private getErrorMessage(error: any): string {
    console.log('[AuthRepository] Processing error:', {
      code: error.code,
      message: error.message,
      name: error.name
    });
    
    switch (error.code) {
      case 'auth/user-not-found':
        return 'No user found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please check your credentials and try again.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. Please sign in instead or use a different email address.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Invalid email address. Please enter a valid email.';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled. Please contact support.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later or reset your password.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection and try again.';
      case 'auth/internal-error':
        return 'An internal error occurred. Please try again later.';
      case 'auth/invalid-api-key':
        return 'Authentication service is misconfigured. Please contact support.';
      case 'auth/app-deleted':
        return 'Authentication service is unavailable. Please contact support.';
      case 'auth/requires-recent-login':
        return 'Please sign in again to complete this action.';
      default:
        console.log('[AuthRepository] Unhandled error code:', error.code);
        
        // If it's a Firebase auth error but not handled above
        if (error.code && error.code.startsWith('auth/')) {
          return `Authentication error: ${error.message || 'Please try again.'}`;
        }
        
        // If it's not a Firebase auth error, return the original message
        if (error.message && !error.code) {
          return error.message;
        }
        
        return 'An unexpected error occurred during authentication. Please try again.';
    }
  }
}
