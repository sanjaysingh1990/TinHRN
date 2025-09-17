import { inject, injectable } from 'tsyringe';
import { LoginUseCaseToken } from '../../auth.di';
import { User } from '../../domain/entities/User';
import { LoginUseCase } from '../../domain/usecases/LoginUseCase';

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginValidationErrors {
  email?: string;
  password?: string;
  general?: string;
}

export interface LoginViewState {
  isLoading: boolean;
  errors: LoginValidationErrors;
  isFormValid: boolean;
}

@injectable()
export class LoginViewModel {
  private _updateCallback?: () => void;
  
  public viewState: LoginViewState = {
    isLoading: false,
    errors: {},
    isFormValid: false,
  };

  public formData: LoginFormData = {
    email: '',
    password: '',
  };

  constructor(
    @inject(LoginUseCaseToken) private loginUseCase: LoginUseCase
  ) {}

  setUpdateCallback(callback: () => void): void {
    this._updateCallback = callback;
  }

  private notifyUpdate(): void {
    this._updateCallback?.();
  }

  setEmail(email: string): void {
    this.formData.email = email;
    this.validateForm();
    this.notifyUpdate();
  }

  setPassword(password: string): void {
    this.formData.password = password;
    this.validateForm();
    this.notifyUpdate();
  }

  private validateEmail(email: string): string | undefined {
    if (!email.trim()) {
      return 'Email is required';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    
    return undefined;
  }

  private validatePassword(password: string): string | undefined {
    if (!password) {
      return 'Password is required';
    }
    
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    
    return undefined;
  }

  private validateForm(): void {
    const errors: LoginValidationErrors = {};
    
    const emailError = this.validateEmail(this.formData.email);
    const passwordError = this.validatePassword(this.formData.password);
    
    if (emailError) errors.email = emailError;
    if (passwordError) errors.password = passwordError;
    
    this.viewState.errors = errors;
    this.viewState.isFormValid = Object.keys(errors).length === 0;
  }

  validateFormManually(): void {
    this.validateForm();
    this.notifyUpdate();
  }

  clearErrors(): void {
    this.viewState.errors = {};
    this.notifyUpdate();
  }

  clearGeneralError(): void {
    this.viewState.errors.general = undefined;
    this.notifyUpdate();
  }

  async login(): Promise<User | null> {
    console.log('[LoginViewModel] Starting login process...');
    console.log('[LoginViewModel] Form data:', {
      email: this.formData.email
    });
    
    try {
      this.viewState.isLoading = true;
      this.viewState.errors = {};
      this.notifyUpdate();

      console.log('[LoginViewModel] Validating form...');
      // Validate form before submission
      this.validateForm();
      if (!this.viewState.isFormValid) {
        console.log('[LoginViewModel] Form validation failed:', this.viewState.errors);
        this.viewState.isLoading = false;
        this.notifyUpdate();
        return null;
      }

      console.log('[LoginViewModel] Form validation passed, calling login use case...');
      const user = await this.loginUseCase.execute({
        email: this.formData.email.trim(),
        password: this.formData.password,
      });

      console.log('[LoginViewModel] Login use case completed successfully.');
      this.viewState.isLoading = false;
      this.notifyUpdate();
      return user;
    } catch (error: any) {
      console.log('[LoginViewModel] Login failed with error:', error);
      this.viewState.isLoading = false;
      
      // Handle different types of errors
      if (error.name === 'AuthenticationError') {
        // This is a user-friendly error from our AuthRepository
        this.viewState.errors.general = error.message;
      } else {
        // This is an unexpected error
        this.viewState.errors.general = error.message || 'Login failed. Please try again.';
      }
      
      this.notifyUpdate();
      return null;
    }
  }

  reset(): void {
    this.formData = {
      email: '',
      password: '',
    };
    this.viewState = {
      isLoading: false,
      errors: {},
      isFormValid: false,
    };
    this.notifyUpdate();
  }
}