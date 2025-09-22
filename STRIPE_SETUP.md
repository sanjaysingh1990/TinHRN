# Stripe Setup Guide

## Overview
This guide explains how to properly configure Stripe for the TiNHRn application to prevent crashes and ensure proper payment processing.

## Prerequisites
1. Stripe account (for production) or use test keys
2. Expo development environment set up
3. @stripe/stripe-react-native package installed

## Configuration Steps

### 1. Update app.json
Add the Stripe configuration to your app.json file:

```json
{
  "expo": {
    "plugins": [
      "@stripe/stripe-react-native"
    ]
  }
}
```

### 2. iOS Specific Configuration
For iOS, you need to add the following to your Info.plist (in ios/ directory):

```xml
<key>NSCameraUsageDescription</key>
<string>Camera access is required to scan payment cards</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>Location access is required for Apple Pay</string>
```

### 3. Android Specific Configuration
For Android, add the following to your AndroidManifest.xml:

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

### 4. Rebuild the App
After making these changes, you need to rebuild the app:

```bash
# For development
npx expo run:ios
# or
npx expo run:android

# For production builds
eas build
```

## Test Card Numbers
Use these test card numbers to test payments:

- Visa: 4242 4242 4242 4242
- Mastercard: 5555 5555 5555 4444
- American Express: 3782 822463 10005
- Visa (declined): 4000 0000 0000 0002

## Common Issues and Solutions

### 1. "No task registered for key StripeKeepJsAwakeTask"
This warning occurs on iOS when the Stripe SDK is not properly configured. To fix:

1. Add the Stripe plugin to app.json as shown above
2. Rebuild the app with `npx expo run:ios`

### 2. App Crashes During Payment
This usually happens due to:

1. Incorrect configuration
2. Missing permissions
3. Network issues

Solution:
- Ensure all configuration steps are completed
- Check console logs for specific error messages
- Test with stable internet connection

### 3. Payment Sheet Not Appearing
This can happen due to:

1. Invalid client secret
2. Incorrect publishable key
3. Network issues

Solution:
- Verify client secret and publishable key
- Check network connectivity
- Ensure test environment is properly set up

## Error Handling
The app implements comprehensive error handling:

1. Network errors are caught and displayed to the user
2. Payment cancellations are handled gracefully
3. Validation errors are shown with specific messages
4. App crashes are prevented through try/catch blocks
5. Timeout mechanisms prevent indefinite waiting

## Production Considerations
Before deploying to production:

1. Replace test keys with production keys
2. Set up backend to create real payment intents
3. Configure Apple Pay and Google Pay merchant identifiers
4. Test thoroughly with real payment methods
5. Ensure proper SSL/HTTPS configuration
6. Implement proper error logging and monitoring

## Security
- All payment processing is handled by Stripe
- No sensitive payment information is stored in the app
- Communication with Stripe uses HTTPS
- Test environment is used by default to prevent real transactions

## Troubleshooting
If you encounter issues:

1. Check the Expo logs for specific error messages
2. Verify all configuration steps are completed
3. Ensure the app is rebuilt after configuration changes
4. Test with different network connections
5. Consult the Stripe React Native SDK documentation