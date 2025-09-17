
import React from 'react';
import { TextInput, useColorScheme } from 'react-native';
import { getAuthStyles } from '../styles/auth.styles';
import { theme } from '../../../../theme';

const AuthInput = (props) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = theme[colorScheme];
  const styles = getAuthStyles(colors, colorScheme);

  return (
    <TextInput
      style={[styles.input, props.focused && styles.inputFocused]}
      placeholderTextColor={colors.secondary}
      {...props}
    />
  );
};

export default AuthInput;
