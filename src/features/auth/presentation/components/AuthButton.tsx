
import React from 'react';
import { Text, TouchableOpacity, useColorScheme } from 'react-native';
import { theme } from '../../../../theme';
import { getAuthStyles } from '../styles/auth.styles';

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  accessibilityLabel: string;
}

const AuthButton: React.FC<AuthButtonProps> = ({ title, onPress, accessibilityLabel }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = theme[colorScheme];
  const styles = getAuthStyles(colors, colorScheme);

  return (
    <TouchableOpacity style={styles.button} onPress={onPress} accessibilityLabel={accessibilityLabel}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default AuthButton;
