
import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';
import { getAuthStyles } from '../styles/auth.styles';

interface AuthInputProps extends TextInputProps {
  focused?: boolean;
}

const AuthInput: React.FC<AuthInputProps> = (props) => {
  const { colors, isDarkMode } = useTheme();
  const styles = getAuthStyles(colors, isDarkMode ? 'dark' : 'light');

  return (
    <TextInput
      style={[styles.input, props.focused && styles.inputFocused]}
      placeholderTextColor={colors.secondary}
      {...props}
    />
  );
};

export default AuthInput;
