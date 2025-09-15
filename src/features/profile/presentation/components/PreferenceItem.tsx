
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';

interface PreferenceItemProps {
  icon: string;
  title: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const PreferenceItem: React.FC<PreferenceItemProps> = ({ icon, title, value, onValueChange }) => {
  const { colors, isDarkMode } = useTheme();
  
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
    <View style={styles.container}>
      <MaterialIcons name={icon as any} size={24} color={colors.secondary} />
      <Text style={styles.title}>{title}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ 
          false: isDarkMode ? '#3a362f' : '#e0e0e0', 
          true: colors.primary 
        }}
        thumbColor={value ? '#fff' : colors.secondary}
      />
    </View>
  );
};

export default PreferenceItem;
