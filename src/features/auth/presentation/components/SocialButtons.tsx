
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, useColorScheme, View } from 'react-native';
import { theme } from '../../../../theme';
import { getAuthStyles } from '../styles/auth.styles';

const SocialButtons = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = theme[colorScheme];
  const styles = getAuthStyles(colors, colorScheme);

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
        style={[styles.socialButton, { backgroundColor: colorScheme === 'dark' ? '#ffffff' : '#000000' }]} 
        onPress={handleAppleLogin}
        accessibilityLabel="Sign in with Apple"
      >
        <MaterialIcons name="phone-iphone" size={24} color={colorScheme === 'dark' ? '#000000' : '#ffffff'} />
      </TouchableOpacity>
    </View>
  );
};

export default SocialButtons;
