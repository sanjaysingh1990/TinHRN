import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';
import { getAuthStyles } from '../styles/auth.styles';

interface AuthHeaderProps {
  title: string;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ title }) => {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const styles = getAuthStyles(colors, isDarkMode ? 'dark' : 'light');

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityLabel="Go back">
        <MaterialIcons name="arrow-back-ios" size={24} color={colors.text} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

export default AuthHeader;