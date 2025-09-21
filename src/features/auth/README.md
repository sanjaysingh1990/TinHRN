# Authentication Module

This module handles all authentication-related functionality for the TiNHRn application, including user registration, login, logout, and social authentication.

## Features

- Email/Password authentication
- Social login (Google, Facebook, Apple) with Firebase integration
- Password reset functionality
- Email verification
- User profile management
- Persistent user sessions
- Loading states and error handling

## Architecture

The authentication module follows clean architecture principles with a clear separation of concerns:

```
auth/
├── data/               # Data layer implementations
│   ├── repositories/   # Repository implementations
│   └── services/       # External service integrations
├── domain/             # Business logic and entities
│   ├── entities/       # Domain entities
│   ├── repositories/   # Repository interfaces
│   └── usecases/       # Business use cases
└── presentation/       # UI layer
    ├── components/     # Reusable UI components
    ├── context/        # Authentication context
    ├── screens/        # Authentication screens
    └── styles/         # Styling
```

## Social Authentication

The module supports social authentication with:

1. **Google Sign In** - Fully implemented with Firebase integration
2. **Facebook Sign In** - Fully implemented with Firebase integration
3. **Apple Sign In** - Fully implemented with Firebase integration

### Setup

To configure social authentication providers, follow the setup guide in [SOCIAL_LOGIN_SETUP.md](../../../SOCIAL_LOGIN_SETUP.md).

## Data Flow

1. **Presentation Layer**: UI components interact with the AuthContext
2. **Domain Layer**: AuthContext uses use cases to perform business logic
3. **Data Layer**: Repositories handle data operations with external services
4. **External Services**: Firebase Authentication and SocialAuthService handle actual authentication

## Key Components

### AuthContext
The central authentication context that manages user state and provides authentication methods to the application.

### AuthRepository
Implementation of the IAuthRepository interface that handles all authentication operations with Firebase.

### SocialAuthService
Service that handles OAuth flows for social authentication providers.

### Screens
- LoginScreen: Email/password login with social login options
- SignupScreen: User registration with social login options
- ForgotPasswordScreen: Password reset functionality

## Error Handling

The module includes comprehensive error handling with user-friendly error messages for all authentication operations.

## Persistence

User sessions are persisted using AsyncStorage for faster loading times and better user experience.

## Security

- All sensitive operations are handled securely through Firebase Authentication
- Passwords are never stored locally
- Secure token handling for social authentication
- Email verification for new accounts