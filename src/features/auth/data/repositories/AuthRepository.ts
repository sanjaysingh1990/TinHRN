
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
    return {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || additionalData?.name || '',
      email: firebaseUser.email || '',
      phoneNumber: firebaseUser.phoneNumber || undefined,
      photoURL: firebaseUser.photoURL || undefined,
      emailVerified: firebaseUser.emailVerified,
      createdAt: additionalData?.createdAt?.toDate() || new Date(),
      updatedAt: additionalData?.updatedAt?.toDate() || new Date()
    };
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Get additional user data from Firestore
      const userDoc = await getDoc(doc(firestore, 'users', firebaseUser.uid));
      const additionalData = userDoc.exists() ? userDoc.data() : {};
      
      return this.mapFirebaseUserToUser(firebaseUser, additionalData);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error));
    }
  }

  async signup(name: string, email: string, password: string, phoneNumber?: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Update the user's display name
      await firebaseUpdateProfile(firebaseUser, {
        displayName: name
      });
      
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
      
      await setDoc(doc(firestore, 'users', firebaseUser.uid), userData);
      
      // Send email verification
      await firebaseSendEmailVerification(firebaseUser);
      
      return this.mapFirebaseUserToUser(firebaseUser, userData);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error));
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error));
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
      throw new Error(this.getErrorMessage(error));
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
      throw new Error(this.getErrorMessage(error));
    }
  }

  async sendEmailVerification(): Promise<void> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) throw new Error('No authenticated user');
    
    try {
      await firebaseSendEmailVerification(firebaseUser);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error));
    }
  }

  async reloadUser(): Promise<void> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) throw new Error('No authenticated user');
    
    try {
      await reload(firebaseUser);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error));
    }
  }

  private getErrorMessage(error: any): string {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'No user found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      default:
        return error.message || 'An error occurred during authentication.';
    }
  }
}
