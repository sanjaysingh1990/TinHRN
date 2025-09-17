
import { User } from '../entities/User';

export interface IAuthRepository {
  // Authentication methods
  login(email: string, password: string): Promise<User>;
  signup(name: string, email: string, password: string): Promise<User>;
  logout(): Promise<void>;
  
  // User state methods
  getCurrentUser(): Promise<User | null>;
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
  
  // Password management
  sendPasswordResetEmail(email: string): Promise<void>;
  
  // Profile management
  updateProfile(updates: Partial<Pick<User, 'name' | 'photoURL'>>): Promise<void>;
  
  // Email verification
  sendEmailVerification(): Promise<void>;
  reloadUser(): Promise<void>;
}
