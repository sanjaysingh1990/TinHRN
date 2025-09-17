import { inject, injectable } from 'tsyringe';
import { SignupUseCaseToken } from '../../auth.di';
import { User } from '../../domain/entities/User';
import { SignupUseCase } from '../../domain/usecases/SignupUseCase';

export interface SignupFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  countryCode?: string;
  callingCode?: string;
}

export interface SignupValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export interface SignupViewState {
  isLoading: boolean;
  errors: SignupValidationErrors;
  isFormValid: boolean;
}

@injectable()
export class SignupViewModel {
  private _updateCallback?: () => void;
  
  public viewState: SignupViewState = {
    isLoading: false,
    errors: {},
    isFormValid: false,
  };

  public formData: SignupFormData = {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    countryCode: 'US', // Will be updated by country picker
    callingCode: '+1', // Will be updated by country picker
  };

  constructor(
    @inject(SignupUseCaseToken) private signupUseCase: SignupUseCase
  ) {}

  setUpdateCallback(callback: () => void): void {
    this._updateCallback = callback;
  }

  private notifyUpdate(): void {
    this._updateCallback?.();
  }

  setName(name: string): void {
    this.formData.name = name;
    this.validateForm();
    this.notifyUpdate();
  }

  setEmail(email: string): void {
    this.formData.email = email;
    this.validateForm();
    this.notifyUpdate();
  }

  setPhone(phone: string): void {
    this.formData.phone = phone;
    this.validateForm();
    this.notifyUpdate();
  }

  setPassword(password: string): void {
    this.formData.password = password;
    this.validateForm();
    this.notifyUpdate();
  }

  setConfirmPassword(confirmPassword: string): void {
    this.formData.confirmPassword = confirmPassword;
    this.validateForm();
    this.notifyUpdate();
  }

  setCountryInfo(countryCode: string, callingCode: string): void {
    this.formData.countryCode = countryCode;
    this.formData.callingCode = callingCode;
    this.validateForm();
    this.notifyUpdate();
  }

  getFormattedPhoneNumber(): string {
    if (!this.formData.phone.trim()) return '';
    
    // Clean the phone number by removing spaces and other formatting
    const cleanedPhone = this.formData.phone.replace(/[\s\-\(\)\.]/g, '').trim();
    
    // If it already starts with a +, it might have the country code included
    if (cleanedPhone.startsWith('+')) {
      return cleanedPhone;
    }
    
    // If it starts with the country code without +, add the +
    if (this.formData.callingCode && cleanedPhone.startsWith(this.formData.callingCode.replace('+', ''))) {
      return `+${cleanedPhone}`;
    }
    
    // Otherwise, prepend the calling code
    const callingCode = this.formData.callingCode || '+1';
    return `${callingCode}${cleanedPhone}`;
  }

  private validateName(name: string): string | undefined {
    if (!name.trim()) {
      return 'Name is required';
    }
    
    if (name.trim().length < 2) {
      return 'Name must be at least 2 characters';
    }
    
    return undefined;
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

  private validatePhone(phone: string): string | undefined {
    if (!phone.trim()) {
      return 'Phone number is required';
    }
    
    // Allow more flexible phone number formats
    // Remove spaces and other formatting characters for validation
    const cleanedPhone = phone.replace(/[\s\-\(\)\.]/g, '');
    
    // Check if it's a valid phone number (7-15 digits)
    const phoneRegex = /^[\+]?[1-9][\d]{6,14}$/;
    if (!phoneRegex.test(cleanedPhone)) {
      return 'Please enter a valid phone number (7-15 digits)';
    }
    
    return undefined;
  }

  private validatePassword(password: string): string | undefined {
    if (!password) {
      return 'Password is required';
    }
    
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    
    // Check for mix of letters, numbers & symbols
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!hasLetter || !hasNumber) {
      return 'Password must contain letters and numbers';
    }
    
    return undefined;
  }

  private validateConfirmPassword(password: string, confirmPassword: string): string | undefined {
    if (!confirmPassword) {
      return 'Please confirm your password';
    }
    
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    
    return undefined;
  }

  private validateForm(): void {
    const errors: SignupValidationErrors = {};
    
    const nameError = this.validateName(this.formData.name);
    const emailError = this.validateEmail(this.formData.email);
    const phoneError = this.validatePhone(this.formData.phone);
    const passwordError = this.validatePassword(this.formData.password);
    const confirmPasswordError = this.validateConfirmPassword(this.formData.password, this.formData.confirmPassword);
    
    if (nameError) errors.name = nameError;
    if (emailError) errors.email = emailError;
    if (phoneError) errors.phone = phoneError;
    if (passwordError) errors.password = passwordError;
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
    
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

  async signup(): Promise<User | null> {
    console.log('[SignupViewModel] Starting signup process...');
    console.log('[SignupViewModel] Form data:', {
      name: this.formData.name,
      email: this.formData.email,
      phone: this.formData.phone,
      formattedPhone: this.getFormattedPhoneNumber()
    });
    
    try {
      this.viewState.isLoading = true;
      // Don't clear errors here, preserve them for the UI
      // Only clear general errors
      this.viewState.errors.general = undefined;
      this.notifyUpdate();

      console.log('[SignupViewModel] Validating form...');
      // Validate form before submission
      this.validateForm();
      if (!this.viewState.isFormValid) {
        console.log('[SignupViewModel] Form validation failed:', this.viewState.errors);
        this.viewState.isLoading = false;
        this.notifyUpdate();
        return null;
      }
      
      console.log('[SignupViewModel] Form validation passed, calling signup use case...');
      const user = await this.signupUseCase.execute({
        name: this.formData.name.trim(),
        email: this.formData.email.trim(),
        password: this.formData.password,
        phoneNumber: this.getFormattedPhoneNumber() || undefined,
      });
      
      console.log('[SignupViewModel] Signup use case completed successfully.');
      this.viewState.isLoading = false;
      this.notifyUpdate();
      return user;
    } catch (error: any) {
      console.log('[SignupViewModel] Signup failed with error:', error);
      this.viewState.isLoading = false;
      
      // Handle different types of errors
      if (error.name === 'AuthenticationError') {
        // This is a user-friendly error from our AuthRepository
        this.viewState.errors.general = error.message;
      } else {
        // This is an unexpected error
        this.viewState.errors.general = error.message || 'Signup failed. Please try again.';
      }
      
      this.notifyUpdate();
      return null;
    }
  }

  reset(): void {
    // Preserve the country code and calling code
    const currentCountryCode = this.formData.countryCode || 'US';
    const currentCallingCode = this.formData.callingCode || '+1';
    
    this.formData = {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      countryCode: currentCountryCode,
      callingCode: currentCallingCode,
    };
    this.viewState = {
      isLoading: false,
      errors: {},
      isFormValid: false,
    };
    this.notifyUpdate();
  }
}