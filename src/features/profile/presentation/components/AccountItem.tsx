
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../../../hooks/useTheme';

interface AccountItemProps {
  icon: string;
  title: string;
  onPress: () => void;
}

const AccountItem: React.FC<AccountItemProps> = ({ icon, title, onPress }) => {
  const { colors } = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderColor,
    },
    title: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      marginLeft: 15,
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <MaterialIcons name={icon as any} size={24} color={colors.secondary} />
      <Text style={styles.title}>{title}</Text>
      <MaterialIcons name="chevron-right" size={24} color={colors.secondary} />
    </TouchableOpacity>
  );
};

export default AccountItem;
