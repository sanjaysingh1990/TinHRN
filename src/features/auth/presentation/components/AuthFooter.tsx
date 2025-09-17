
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';
import { getAuthStyles } from '../styles/auth.styles';

interface AuthFooterProps {
  text: string;
  linkText: string;
  onPress: () => void;
}

const AuthFooter: React.FC<AuthFooterProps> = ({ text, linkText, onPress }) => {
  const { colors, isDarkMode } = useTheme();
  const styles = getAuthStyles(colors, isDarkMode ? 'dark' : 'light');

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
