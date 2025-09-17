
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';
import { getAuthStyles } from '../styles/auth.styles';

const SocialButtons = () => {
  const { colors, isDarkMode } = useTheme();
  const styles = getAuthStyles(colors, isDarkMode ? 'dark' : 'light');

  const handleGoogleLogin = () => {
    // TODO: Implement Google login
    console.log('Google login pressed');
  };

  const handleFacebookLogin = () => {
    // TODO: Implement Facebook login
    console.log('Facebook login pressed');
  };

  const handleAppleLogin = () => {
    // TODO: Implement Apple login
    console.log('Apple login pressed');
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
