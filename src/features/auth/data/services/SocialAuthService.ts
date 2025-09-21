import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
// Platform import is not used, removing it

// Make sure to call this early in your app to ensure proper redirect handling
WebBrowser.maybeCompleteAuthSession();

// These would need to be configured with your actual credentials
// You should use environment variables for these in a production app
const GOOGLE_CLIENT_ID = '1541243417-dob94vu2eupb1q0krpc0bomeiht0p14s.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'YOUR_GOOGLE_CLIENT_SECRET'; // Add your Google Client Secret here
const FACEBOOK_APP_ID = 'YOUR_FACEBOOK_APP_ID';

// For development, you can use these redirect URIs
const REDIRECT_URI = AuthSession.makeRedirectUri({
  // Using Expo's auth proxy for development
  // native: 'your.app://redirect', // Uncomment and replace with your actual redirect URI for production
});

export class SocialAuthService {
  // Google Sign In
  static async signInWithGoogle() {
    try {
      // Create the request for Google OAuth
      const request = new AuthSession.AuthRequest({
        clientId: GOOGLE_CLIENT_ID,
        redirectUri: REDIRECT_URI,
        responseType: 'code',
        scopes: ['openid', 'profile', 'email'],
      });
      
      // Start the authentication flow
      const response = await request.promptAsync(
        { authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth' },
        { windowFeatures: { width: 500, height: 600 } }
      );
      
      if (response.type === 'success' && response.params.code) {
        // Exchange the authorization code for tokens
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `client_id=${GOOGLE_CLIENT_ID}&client_secret=${GOOGLE_CLIENT_SECRET}&code=${response.params.code}&grant_type=authorization_code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`,
        });
        
        const tokenData = await tokenResponse.json();
        
        if (tokenData.id_token) {
          return tokenData.id_token;
        } else {
          throw new Error('Failed to get ID token from Google: ' + JSON.stringify(tokenData));
        }
      } else {
        throw new Error('Google Sign In was cancelled or failed.');
      }
    } catch (error) {
      console.error('Google Sign In error:', error);
      throw error;
    }
  }

  // Facebook Sign In
  static async signInWithFacebook() {
    try {
      // Create the request for Facebook OAuth
      const request = new AuthSession.AuthRequest({
        clientId: FACEBOOK_APP_ID,
        redirectUri: REDIRECT_URI,
        responseType: 'token',
        scopes: ['email', 'public_profile'],
      });
      
      // Start the authentication flow
      const response = await request.promptAsync(
        { authorizationEndpoint: 'https://www.facebook.com/v10.0/dialog/oauth' },
        { windowFeatures: { width: 500, height: 600 } }
      );
      
      if (response.type === 'success' && response.params.access_token) {
        // Get user info from Facebook
        const userInfoResponse = await fetch(
          `https://graph.facebook.com/me?access_token=${response.params.access_token}&fields=id,name,email,picture`
        );
        
        const userInfo = await userInfoResponse.json();
        
        // Return the access token and user info
        return {
          accessToken: response.params.access_token,
          userInfo
        };
      } else {
        throw new Error('Facebook Sign In was cancelled or failed.');
      }
    } catch (error) {
      console.error('Facebook Sign In error:', error);
      throw error;
    }
  }

  // Apple Sign In (already implemented in AuthRepository)
  static async signInWithApple() {
    // Apple Sign In is already properly implemented in AuthRepository
    // This method is just here for consistency
    throw new Error('Apple Sign In should be called directly from AuthRepository');
  }
}