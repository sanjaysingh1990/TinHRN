# Social Login Setup Guide

This guide explains how to set up social login (Google, Facebook, and Apple) for the TiNHRn application.

## Current Status

The social login functionality has been fully implemented with Firebase integration:

1. **Apple Sign In** - Fully implemented and should work on iOS devices
2. **Google Sign In** - Fully implemented and enabled with Firebase integration
3. **Facebook Sign In** - Fully implemented with Firebase integration

## Prerequisites

Before setting up social login, ensure you have:

1. A Firebase project set up
2. The Firebase configuration in `src/infrastructure/firebase/firebase.config.ts`
3. Expo configured properly in `app.json`

## Apple Sign In Setup

Apple Sign In is already implemented and should work out of the box on iOS devices with the following requirements:

1. The app must be built with Apple Sign In capabilities enabled
2. For testing, you need to run on a physical iOS device (simulator won't work)

No additional configuration is needed in the codebase for Apple Sign In.

## Google Sign In Setup

To enable Google Sign In, you need to:

### 1. Configure Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials:
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application" as the application type
   - Add authorized redirect URIs for both development and production
   - For Expo development, add: `https://auth.expo.io/@your-username/your-app-slug`
   - For production, add your custom domain redirect URI

### 2. Update Configuration

1. Update `src/features/auth/data/services/SocialAuthService.ts`:
   ```typescript
   const GOOGLE_CLIENT_ID = '1541243417-dob94vu2eupb1q0krpc0bomeiht0p14s.apps.googleusercontent.com'; // Already configured
   const GOOGLE_CLIENT_SECRET = 'YOUR_GOOGLE_CLIENT_SECRET'; // Add your Google Client Secret here
   ```

2. Update `app.json` to include the Google Services configuration:
   ```json
   {
     "expo": {
       "ios": {
         "config": {
           "googleSignIn": {
             "reservedClientId": "YOUR_REVERSED_CLIENT_ID"
           }
         }
       }
     }
   }
   ```

### 3. Enable Google Sign In in Firebase

1. Go to the Firebase Console
2. Navigate to Authentication > Sign-in method
3. Enable Google sign-in provider

## Facebook Sign In Setup

To enable Facebook Sign In, you need to:

### 1. Create Facebook App

1. Go to the [Facebook Developers Console](https://developers.facebook.com/)
2. Create a new app or select an existing one
3. Add the "Facebook Login" product
4. Configure the OAuth redirect URI:
   - For Expo development: `https://auth.expo.io/@your-username/your-app-slug`
   - For production: your custom domain redirect URI

### 2. Update Configuration

1. Update `src/features/auth/data/services/SocialAuthService.ts`:
   ```typescript
   const FACEBOOK_APP_ID = 'YOUR_FACEBOOK_APP_ID';
   ```

### 3. Enable Facebook Sign In in Firebase

1. Go to the Firebase Console
2. Navigate to Authentication > Sign-in method
3. Enable Facebook sign-in provider
4. Add your Facebook App ID and App Secret

## Testing Social Login

To test social login functionality:

1. Run the app on a physical device (recommended)
2. Navigate to the Login or Signup screen
3. Tap on the Google login button
4. Complete the authentication flow

## Troubleshooting

### Common Issues

1. **Redirect URI mismatch**: Ensure all redirect URIs are properly configured in both Google/Facebook developer consoles and Firebase
2. **Platform-specific issues**: Some features may not work in simulators; always test on physical devices
3. **Missing permissions**: Ensure all required permissions are granted in app.json
4. **Invalid credentials**: Double-check all client IDs and secrets

### Debugging Tips

1. Check the console logs for detailed error messages
2. Verify all credentials are correct
3. Ensure the Firebase Authentication providers are enabled
4. Test each social login provider separately

## Security Considerations

1. Never commit sensitive credentials to version control
2. Use environment variables for storing API keys and client IDs
3. Implement proper error handling to avoid exposing sensitive information
4. Regularly rotate credentials and monitor usage
5. Use HTTPS for all redirect URIs in production

## Future Improvements

1. Add environment-specific configuration files
2. Implement more robust error handling
3. Add analytics for tracking social login usage
4. Implement account linking for users who sign up with multiple providers