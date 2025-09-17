
import React from 'react';
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { theme } from '../../../../theme';
import { getAuthStyles } from '../styles/auth.styles';

interface AuthFooterProps {
  text: string;
  linkText: string;
  onPress: () => void;
}

const AuthFooter: React.FC<AuthFooterProps> = ({ text, linkText, onPress }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = theme[colorScheme];
  const styles = getAuthStyles(colors, colorScheme);

  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>{text}</Text>
      <TouchableOpacity onPress={onPress} accessibilityLabel={linkText}>
        <Text style={styles.linkText}>{linkText}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthFooter;
