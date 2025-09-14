
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Achievement } from '../../domain/models/Achievement';

interface AchievementItemProps {
  achievement: Achievement;
}

const AchievementItem: React.FC<AchievementItemProps> = ({ achievement }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: achievement.locked ? '#3a362f' : achievement.color }]}>
        <MaterialIcons name={achievement.icon as any} size={24} color={achievement.locked ? '#9eb7a8' : '#111714'} />
      </View>
      <Text style={[styles.title, { color: achievement.locked ? '#9eb7a8' : '#fff' }]}>{achievement.title}</Text>
    </View>
  );
};

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

export default AchievementItem;
