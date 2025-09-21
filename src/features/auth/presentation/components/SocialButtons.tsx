import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';
import { getAuthStyles } from '../styles/auth.styles';
import { useAuth } from '../context/AuthContext';

const SocialButtons = () => {
  const { colors, isDarkMode } = useTheme();
  const styles = getAuthStyles(colors, isDarkMode ? 'dark' : 'light');
  const { signInWithGoogle, signInWithFacebook, signInWithApple } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      console.error('Google Sign In Error:', error);
      Alert.alert(
        'Google Sign In', 
        error.message || 'Failed to sign in with Google. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await signInWithFacebook();
    } catch (error: any) {
      console.error('Facebook Sign In Error:', error);
      Alert.alert(
        'Facebook Sign In', 
        error.message || 'Failed to sign in with Facebook. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleAppleLogin = async () => {
    try {
      await signInWithApple();
    } catch (error: any) {
      console.error('Apple Sign In Error:', error);
      Alert.alert('Error', error.message || 'Failed to sign in with Apple');
    }
  };

  return (
    <View style={styles.socialButtonsContainer}>
      <TouchableOpacity 
        style={[styles.socialButton, { backgroundColor: '#db4437' }]} 
        onPress={handleGoogleLogin}
        accessibilityLabel="Sign in with Google"
      >
        <MaterialIcons name="account-circle" size={24} color="white" />
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