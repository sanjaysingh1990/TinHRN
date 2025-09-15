import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import container from '../../../../container';
import { useTheme } from '../../../../hooks/useTheme';
import { Notification } from '../../domain/models/Notification';
import { NotificationsViewModelToken } from '../../notifications.di';
import NotificationItem from '../components/NotificationItem';
import NotificationShimmer from '../components/NotificationShimmer';
import { NotificationsViewModel } from '../viewmodels/NotificationsViewModel';

const NotificationsScreen: React.FC = () => {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const notificationsViewModel = container.resolve<NotificationsViewModel>(NotificationsViewModelToken);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const notificationsList = await notificationsViewModel.getNotifications();
      setNotifications(notificationsList);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    // Handle notification tap - could mark as read, navigate to relevant screen, etc.
    console.log('Notification pressed:', notification);
  };

  const renderShimmer = () => <NotificationShimmer />;

  const renderNotification = ({ item }: { item: Notification }) => (
    <NotificationItem
      notification={item}
      onPress={() => handleNotificationPress(item)}
    />
  );

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.borderColor }]}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Loading Shimmers */}
        <View style={styles.list}>
          {Array.from({ length: 8 }, (_, i) => (
            <NotificationShimmer key={`shimmer-${i}`} />
          ))}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.borderColor }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 20, // Additional top margin for better spacing
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: 40, // Compensate for back button width
  },
  headerSpacer: {
    width: 40, // Same width as back button to center title
  },
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
  },
});

export default NotificationsScreen;