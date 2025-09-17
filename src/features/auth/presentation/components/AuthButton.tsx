
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';
import { getAuthStyles } from '../styles/auth.styles';

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  accessibilityLabel: string;
  disabled?: boolean;
}

const AuthButton: React.FC<AuthButtonProps> = ({ title, onPress, accessibilityLabel, disabled = false }) => {
  const { colors, isDarkMode } = useTheme();
  const styles = getAuthStyles(colors, isDarkMode ? 'dark' : 'light');

  return (
    <TouchableOpacity 
      style={[styles.button, disabled && styles.buttonDisabled]} 
      onPress={disabled ? undefined : onPress} 
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default AuthButton;
