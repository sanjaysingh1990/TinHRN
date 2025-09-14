
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface AccountItemProps {
  icon: string;
  title: string;
  onPress: () => void;
}

const AccountItem: React.FC<AccountItemProps> = ({ icon, title, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <MaterialIcons name={icon as any} size={24} color="#9eb7a8" />
      <Text style={styles.title}>{title}</Text>
      <MaterialIcons name="chevron-right" size={24} color="#9eb7a8" />
    </TouchableOpacity>
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

export default AccountItem;
