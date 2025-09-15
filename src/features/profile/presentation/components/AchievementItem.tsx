
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Achievement } from '../../domain/models/Achievement';
import { useTheme } from '../../../../hooks/useTheme';

interface AchievementItemProps {
  achievement: Achievement;
}

const AchievementItem: React.FC<AchievementItemProps> = ({ achievement }) => {
  const { colors, isDarkMode } = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      width: '25%',
      marginBottom: 20,
    },
    iconContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    title: {
      fontSize: 12,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <View style={[
        styles.iconContainer, 
        { 
          backgroundColor: achievement.locked 
            ? (isDarkMode ? '#3a362f' : '#e0e0e0') 
            : achievement.color 
        }
      ]}>
        <MaterialIcons 
          name={achievement.icon as any} 
          size={24} 
          color={achievement.locked ? colors.secondary : (isDarkMode ? '#111714' : '#fff')} 
        />
      </View>
      <Text style={[
        styles.title, 
        { color: achievement.locked ? colors.secondary : colors.text }
      ]}>
        {achievement.title}
      </Text>
    </View>
  );
};

export default AchievementItem;
