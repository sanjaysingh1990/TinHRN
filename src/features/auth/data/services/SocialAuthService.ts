import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
// Platform import is now being used

// Make sure to call this early in your app to ensure proper redirect handling
WebBrowser.maybeCompleteAuthSession();

// These would need to be configured with your actual credentials
// You should use environment variables for these in a production app
const GOOGLE_CLIENT_ID = '1541243417-dob94vu2eupb1q0krpc0bomeiht0p14s.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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'; // Add your Google Client Secret here
const FACEBOOK_APP_ID = 'YOUR_FACEBOOK_APP_ID';

// Configure the redirect URI properly for Google OAuth
// Google only accepts HTTPS URLs, so we use the Expo auth proxy for all environments
const getRedirectUri = () => {
  // For all environments, use the Expo auth proxy which Google will accept
  return `https://auth.expo.io/@sanjubisht/TiNHRn`;
};

const REDIRECT_URI = getRedirectUri();

export class SocialAuthService {
  // Google Sign In
  static async signInWithGoogle() {
    try {
      console.log('[SocialAuthService] Starting Google Sign In with redirect URI:', REDIRECT_URI);
      
      // Discovery document for Google OAuth
      const discovery = {
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenEndpoint: 'https://oauth2.googleapis.com/token',
        revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
      };

      // Create the request for Google OAuth
      const request = new AuthSession.AuthRequest({
        clientId: GOOGLE_CLIENT_ID,
        redirectUri: REDIRECT_URI,
        responseType: Platform.OS === 'ios' ? 'code' : 'code', // Always use code for consistency
        scopes: ['openid', 'profile', 'email'],
        usePKCE: true, // Add PKCE for better security
      });
      
      // Start the authentication flow
      const response = await request.promptAsync(discovery, {
        windowFeatures: { width: 500, height: 600 }
      });
      
      console.log('[SocialAuthService] Google OAuth response:', response);
      
      // Check if the response was successful
      if (response.type === 'success') {
        // For code response type, we need to exchange the code for tokens
        if (response.params.code) {
          console.log('[SocialAuthService] Exchanging code for tokens');
          // Exchange the authorization code for tokens
          const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `client_id=${GOOGLE_CLIENT_ID}&client_secret=${GOOGLE_CLIENT_SECRET}&code=${response.params.code}&grant_type=authorization_code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`,
          });
          
          const tokenData = await tokenResponse.json();
          console.log('[SocialAuthService] Token response:', tokenData);
          
          if (tokenData.id_token) {
            return tokenData.id_token;
          } else {
            throw new Error('Failed to get ID token from Google: ' + JSON.stringify(tokenData));
          }
        } 
        // For token response type, we might get the token directly
        else if (response.params.id_token) {
          console.log('[SocialAuthService] Received ID token directly');
          return response.params.id_token;
        } else {
          throw new Error('No valid token received from Google');
        }
      } else if (response.type === 'dismiss') {
        throw new Error('Google Sign In was dismissed by the user.');
      } else {
        throw new Error('Google Sign In was cancelled or failed.');
      }
    } catch (error) {
      console.error('[SocialAuthService] Google Sign In error:', error);
      throw error;
    }
  }

  // Facebook Sign In
  static async signInWithFacebook() {
    try {
      // For Facebook, we can use the custom scheme as Facebook is more flexible with redirect URIs
      const facebookRedirectUri = AuthSession.makeRedirectUri({
        scheme: 'tinhrn',
        path: 'oauthredirect',
       
      });
      
      console.log('[SocialAuthService] Starting Facebook Sign In with redirect URI:', facebookRedirectUri);
      
      // Discovery document for Facebook OAuth
      const discovery = {
        authorizationEndpoint: 'https://www.facebook.com/v10.0/dialog/oauth',
        tokenEndpoint: 'https://graph.facebook.com/v10.0/oauth/access_token',
      };

      // Create the request for Facebook OAuth
      const request = new AuthSession.AuthRequest({
        clientId: FACEBOOK_APP_ID,
        redirectUri: facebookRedirectUri,
        responseType: 'token',
        scopes: ['email', 'public_profile'],
      });
      
      // Start the authentication flow
      const response = await request.promptAsync(discovery, {
        windowFeatures: { width: 500, height: 600 }
      });
      
      console.log('[SocialAuthService] Facebook OAuth response:', response);
      
      // Check if the response was successful
      if (response.type === 'success' && response.params.access_token) {
        // Get user info from Facebook
        const userInfoResponse = await fetch(
          `https://graph.facebook.com/me?access_token=${response.params.access_token}&fields=id,name,email,picture`
        );
        
        const userInfo = await userInfoResponse.json();
        console.log('[SocialAuthService] Facebook user info:', userInfo);
        
        // Return the access token and user info
        return {
          accessToken: response.params.access_token,
          userInfo
        };
      } else if (response.type === 'dismiss') {
        throw new Error('Facebook Sign In was dismissed by the user.');
      } else {
        throw new Error('Facebook Sign In was cancelled or failed.');
      }
    } catch (error) {
      console.error('[SocialAuthService] Facebook Sign In error:', error);
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