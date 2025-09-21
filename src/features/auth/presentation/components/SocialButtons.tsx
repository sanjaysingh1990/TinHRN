import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';
import { useAuth } from '../context/AuthContext';
import { getAuthStyles } from '../styles/auth.styles';

const SocialButtons = () => {
  const { colors, isDarkMode } = useTheme();
  const styles = getAuthStyles(colors, isDarkMode ? 'dark' : 'light');
  const { signInWithGoogle, signInWithFacebook, signInWithApple } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error: any) {
      console.error('Google Sign In Error:', error);
      Alert.alert(
        'Google Sign In', 
        error.message || 'Failed to sign in with Google. Please try again. Make sure the redirect URIs are properly configured in Google Cloud Console.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      setIsLoading(true);
      await signInWithFacebook();
    } catch (error: any) {
      console.error('Facebook Sign In Error:', error);
      Alert.alert(
        'Facebook Sign In', 
        error.message || 'Failed to sign in with Facebook. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    try {
      setIsLoading(true);
      await signInWithApple();
    } catch (error: any) {
      console.error('Apple Sign In Error:', error);
      Alert.alert('Error', error.message || 'Failed to sign in with Apple');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.socialButtonsContainer}>
      <TouchableOpacity 
        style={[styles.socialButton, { backgroundColor: '#db4437' }]} 
        onPress={handleGoogleLogin}
        disabled={isLoading}
        accessibilityLabel="Sign in with Google"
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <MaterialIcons name="account-circle" size={24} color="white" />
        )}
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.socialButton, { backgroundColor: '#4267B2' }]} 
        onPress={handleFacebookLogin}
        accessibilityLabel="Sign in with Facebook"
      >
        <MaterialIcons name="facebook" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.socialButton, { backgroundColor: isDarkMode ? '#ffffff' : '#000000' }]} 
        onPress={handleAppleLogin}
        accessibilityLabel="Sign in with Apple"
      >
        <MaterialIcons name="phone-iphone" size={24} color={isDarkMode ? '#000000' : '#ffffff'} />
      </TouchableOpacity>
    </View>
  );
};

export default SocialButtons;