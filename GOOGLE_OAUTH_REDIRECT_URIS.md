# Google OAuth Redirect URIs Configuration

Based on your Expo app configuration, you need to add the following redirect URIs to your Google Cloud Console OAuth 2.0 Client ID:

## For All Environments (Google only accepts HTTPS URLs)

Add this URI which works for all environments (Expo Go, development, and standalone apps):
```
https://auth.expo.io/@sanjubisht/TiNHRn
```

This is the Expo auth proxy URL that Google will accept because it uses HTTPS and ends with a valid domain.

## How to Configure in Google Cloud Console

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to "APIs & Services" > "Credentials"
4. Find your OAuth 2.0 Client ID for web application (or create one if it doesn't exist)
5. Under "Authorized redirect URIs", add the URI listed above
6. Click "Save"

## Important Notes

- Google OAuth only accepts HTTPS URLs with valid domains as redirect URIs
- The Expo auth proxy (`https://auth.expo.io/@username/projectslug`) is specifically designed to work with Google's requirements
- Remove any custom scheme URIs (like `tinhrn://oauthredirect`) from your Google Cloud Console as Google will reject them
- After adding this URI, wait a few minutes for Google to propagate the changes

## Testing the Configuration

After updating the redirect URIs in Google Cloud Console:

1. Restart your Expo development server
2. Try Google Sign In again
3. Check the console logs for any error messages