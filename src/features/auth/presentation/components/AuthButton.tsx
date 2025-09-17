
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';
import { getAuthStyles } from '../styles/auth.styles';

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  accessibilityLabel: string;
}

const AuthButton: React.FC<AuthButtonProps> = ({ title, onPress, accessibilityLabel }) => {
  const { colors, isDarkMode } = useTheme();
  const styles = getAuthStyles(colors, isDarkMode ? 'dark' : 'light');

  return (
    <TouchableOpacity style={styles.button} onPress={onPress} accessibilityLabel={accessibilityLabel}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default AuthButton;
