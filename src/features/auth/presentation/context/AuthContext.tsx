import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import container from '../../../../container';
import { AuthRepositoryToken } from '../../auth.di';
import { AuthState, User } from '../../domain/entities/User';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<Pick<User, 'name' | 'photoURL'>>) => Promise<void>;
  sendEmailVerification: () => Promise<void>;
  reloadUser: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });
  const [error, setError] = useState<string | null>(null);
  
  const authRepository = container.resolve<IAuthRepository>(AuthRepositoryToken);

  useEffect(() => {
    // Set up authentication state listener
    const unsubscribe = authRepository.onAuthStateChanged((user: User | null) => {
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: !!user,
      });
    });

    return unsubscribe;
  }, []);

  const clearError = () => setError(null);

  const handleError = (error: any) => {
    setError(error.message || 'An error occurred');
    console.error('Auth error:', error);
  };

  const login = async (email: string, password: string) => {
    try {
      clearError();
      setAuthState((prev: AuthState) => ({ ...prev, isLoading: true }));
      await authRepository.login(email, password);
      // User state will be updated via onAuthStateChanged
    } catch (error) {
      handleError(error);
      setAuthState((prev: AuthState) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    console.log('[AuthContext] Starting signup process...');
    console.log('[AuthContext] Signup params:', { name, email });
    
    try {
      clearError();
      setAuthState((prev: AuthState) => ({ ...prev, isLoading: true }));
      console.log('[AuthContext] Calling authRepository.signup...');
      await authRepository.signup(name, email, password);
      console.log('[AuthContext] Signup completed successfully.');
      // User state will be updated via onAuthStateChanged
    } catch (error) {
      console.error('[AuthContext] Signup failed:', error);
      handleError(error);
      setAuthState((prev: AuthState) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      clearError();
      await authRepository.logout();
      // User state will be updated via onAuthStateChanged
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const sendPasswordResetEmail = async (email: string) => {
    try {
      clearError();
      await authRepository.sendPasswordResetEmail(email);
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<Pick<User, 'name' | 'photoURL'>>) => {
    try {
      clearError();
      await authRepository.updateProfile(updates);
      // Reload current user to get updated data
      const updatedUser = await authRepository.getCurrentUser();
      setAuthState((prev: AuthState) => ({ ...prev, user: updatedUser }));
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const sendEmailVerification = async () => {
    try {
      clearError();
      await authRepository.sendEmailVerification();
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const reloadUser = async () => {
    try {
      clearError();
      await authRepository.reloadUser();
      // Get updated user data
      const updatedUser = await authRepository.getCurrentUser();
      setAuthState((prev: AuthState) => ({ ...prev, user: updatedUser }));
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    signup,
    logout,
    sendPasswordResetEmail,
    updateProfile,
    sendEmailVerification,
    reloadUser,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};