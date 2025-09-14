
import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface PreferenceItemProps {
  icon: string;
  title: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const PreferenceItem: React.FC<PreferenceItemProps> = ({ icon, title, value, onValueChange }) => {
  return (
    <View style={styles.container}>
      <MaterialIcons name={icon as any} size={24} color="#9eb7a8" />
      <Text style={styles.title}>{title}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#3a362f', true: '#38e07b' }}
        thumbColor={value ? '#fff' : '#9eb7a8'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#3d5245',
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    marginLeft: 15,
  },
});

export default PreferenceItem;
