
import React from 'react';
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { getAuthStyles } from '../styles/auth.styles';
import { theme } from '../../../theme';

const SocialButtons = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = theme[colorScheme];
  const styles = getAuthStyles(colors, colorScheme);

  return (
    <View style={styles.socialButtonsContainer}>
      <TouchableOpacity style={styles.socialButton} accessibilityLabel="Sign up with Google">
        <Text style={styles.socialIcon}>G</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialButton} accessibilityLabel="Sign up with Facebook">
        <Text style={styles.socialIcon}>F</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialButton} accessibilityLabel="Sign up with Apple">
        <Text style={styles.socialIcon}>A</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SocialButtons;
