import { inject, injectable } from 'tsyringe';
import { BaseViewModel } from '../../../../core/presentation/BaseViewModel';
import { SendPasswordResetEmailUseCaseToken } from '../../auth.di';
import { SendPasswordResetEmailUseCase } from '../../domain/usecases/SendPasswordResetEmailUseCase';

export interface ForgotPasswordFormData {
    email: string;
}

export interface ForgotPasswordValidationErrors {
    email?: string;
    general?: string;
}

export interface ForgotPasswordViewState {
    isLoading: boolean;
    errors: ForgotPasswordValidationErrors;
    isFormValid: boolean;
    isEmailSent: boolean;
}

@injectable()
export class ForgotPasswordViewModel extends BaseViewModel {
    public viewState: ForgotPasswordViewState = {
        isLoading: false,
        errors: {},
        isFormValid: false,
        isEmailSent: false,
    };

    public formData: ForgotPasswordFormData = {
        email: '',
    };

    constructor(
        @inject(SendPasswordResetEmailUseCaseToken) private sendPasswordResetEmailUseCase: SendPasswordResetEmailUseCase
    ) {
        super();
    }

    setEmail(email: string): void {
        this.formData.email = email;
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

    private validateForm(): void {
        const errors: ForgotPasswordValidationErrors = {};

        const emailError = this.validateEmail(this.formData.email);
        if (emailError) errors.email = emailError;

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

    async sendResetEmail(): Promise<boolean> {
        console.log('[ForgotPasswordViewModel] Starting password reset process...');

        try {
            this.viewState.isLoading = true;
            this.viewState.errors.general = undefined;
            this.notifyUpdate();

            this.validateForm();
            if (!this.viewState.isFormValid) {
                console.log('[ForgotPasswordViewModel] Form validation failed:', this.viewState.errors);
                this.viewState.isLoading = false;
                this.notifyUpdate();
                return false;
            }

            console.log('[ForgotPasswordViewModel] Sending password reset email...');
            await this.sendPasswordResetEmailUseCase.execute({
                email: this.formData.email.trim(),
            });

            console.log('[ForgotPasswordViewModel] Password reset email sent successfully.');
            this.viewState.isLoading = false;
            this.viewState.isEmailSent = true;
            this.notifyUpdate();
            return true;
        } catch (error: any) {
            console.log('[ForgotPasswordViewModel] Password reset failed with error:', error);
            this.viewState.isLoading = false;
            this.viewState.errors.general = error.message || 'Failed to send reset email. Please try again.';
            this.notifyUpdate();
            return false;
        }
    }

    reset(): void {
        this.formData = {
            email: '',
        };
        this.viewState = {
            isLoading: false,
            errors: {},
            isFormValid: false,
            isEmailSent: false,
        };
        this.notifyUpdate();
    }
}
