import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { theme } from '../../../../theme';
import { Notification } from '../../domain/models/Notification';

interface NotificationItemProps {
  notification: Notification;
  onPress?: () => void;
}

const getIconName = (type: Notification['type']): keyof typeof MaterialIcons.glyphMap => {
  switch (type) {
    case 'booking':
      return 'event-note';
    case 'guide':
      return 'person';
    case 'offer':
      return 'local-offer';
    case 'weather':
      return 'wb-cloudy';
    case 'trail':
      return 'terrain';
    default:
      return 'notifications';
  }
};

const getIconColor = (type: Notification['type']): string => {
  switch (type) {
    case 'booking':
      return '#4CAF50';
    case 'guide':
      return '#2196F3';
    case 'offer':
      return '#FF9800';
    case 'weather':
      return '#00BCD4';
    case 'trail':
      return '#795548';
    default:
      return '#9E9E9E';
  }
};

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onPress }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = theme[colorScheme];
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: 16,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    textContainer: {
      flex: 1,
      marginRight: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    message: {
      fontSize: 14,
      color: colors.secondary,
      lineHeight: 20,
      marginBottom: 8,
    },
    time: {
      fontSize: 12,
      color: colorScheme === 'dark' ? '#808080' : '#666666',
    },
    unreadIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#FF5252',
      marginTop: 8,
    },
    divider: {
      height: 1,
      backgroundColor: colors.borderColor,
      marginLeft: 76,
    },
  });
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: getIconColor(notification.type) }]}>
          <MaterialIcons 
            name={getIconName(notification.type)} 
            size={24} 
            color="#FFFFFF" 
          />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>{notification.title}</Text>
          <Text style={styles.message} numberOfLines={2}>
            {notification.message}
          </Text>
          <Text style={styles.time}>{notification.time}</Text>
        </View>
        
        {!notification.read && <View style={styles.unreadIndicator} />}
      </View>
      <View style={styles.divider} />
    </TouchableOpacity>
  );
};

export default NotificationItem;