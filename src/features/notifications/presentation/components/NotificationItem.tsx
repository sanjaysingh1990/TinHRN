import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C1917',
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
    color: '#FFFFFF',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#b7ab9e',
    lineHeight: 20,
    marginBottom: 8,
  },
  time: {
    fontSize: 12,
    color: '#808080',
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
    backgroundColor: '#2A261F',
    marginLeft: 76,
  },
});

export default NotificationItem;