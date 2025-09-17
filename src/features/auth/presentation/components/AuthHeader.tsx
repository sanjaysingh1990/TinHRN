
import React from 'react';
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { getAuthStyles } from '../styles/auth.styles';
import { theme } from '../../../../theme';

interface AuthHeaderProps {
  title: string;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ title }) => {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = theme[colorScheme];
  const styles = getAuthStyles(colors, colorScheme);

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityLabel="Go back">
        <Text style={styles.backButtonText}>‹</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

export default AuthHeader;
