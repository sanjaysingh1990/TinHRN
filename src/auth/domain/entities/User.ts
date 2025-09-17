
export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  photoURL?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
