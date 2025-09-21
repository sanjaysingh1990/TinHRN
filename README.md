# TiNHRn - Tourism App

A modern tourism application built with React Native and Expo, featuring AI-powered recommendations and a clean, intuitive user interface.

## Features

- **AI-Powered Recommendations**: Gemini AI integration for personalized tour suggestions
- **Tour Discovery**: Browse and search for tours with detailed information
- **User Authentication**: Complete authentication system with email/password and social login (Google, Facebook, Apple)
- **Tour Booking**: Seamless booking process with payment integration
- **User Profiles**: Personalized user profiles with booking history
- **Interactive Maps**: Location-based tour discovery
- **Clean Architecture**: Well-structured codebase following clean architecture principles
- **Responsive Design**: Optimized for all device sizes
- **Dark Mode**: Eye-friendly dark theme support

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **AI**: Google Gemini API
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation
- **UI Components**: Custom component library with Material Design principles
- **Dependency Injection**: TSyringe
- **Animations**: React Native Reanimated

## Authentication

The app features a complete authentication system with:

- Email/Password registration and login
- Social login (Google, Facebook, Apple) with Firebase integration
- Password reset functionality
- Email verification
- User profile management

### Social Login Setup

To enable social login providers, follow the setup guide in [SOCIAL_LOGIN_SETUP.md](SOCIAL_LOGIN_SETUP.md).

## Project Structure

```
src/
├── features/
│   ├── auth/           # Authentication module
│   ├── tours/          # Tours discovery and booking
│   └── profile/        # User profile management
├── infrastructure/     # Firebase configuration and utilities
├── hooks/              # Custom React hooks
├── components/         # Shared UI components
├── utils/              # Utility functions
└── container.ts        # Dependency injection container
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Follow the Expo CLI instructions to run on your device or simulator

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
GEMINI_API_KEY=your_gemini_api_key
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License.
