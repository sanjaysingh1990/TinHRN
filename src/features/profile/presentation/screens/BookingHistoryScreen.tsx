import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import container from '../../../../container';
import { useTheme } from '../../../../hooks/useTheme';
import { Booking } from '../../../mybookings/domain/models/Booking';
import { BookingHistoryViewModelToken } from '../../profile.di';
import BookingHistoryItem from '../components/BookingHistoryItem';
import BookingHistoryShimmer from '../components/BookingHistoryShimmer';
import { BookingHistoryViewModel } from '../viewmodels/BookingHistoryViewModel';

const BookingHistoryScreen = () => {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const viewModel = container.resolve<BookingHistoryViewModel>(BookingHistoryViewModelToken);
      const bookingList = await viewModel.getAllBookings();
      setBookings(bookingList);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderBookingItem = ({ item }: { item: Booking }) => (
    <BookingHistoryItem booking={item} />
  );

  const renderShimmerItems = () => (
    <View style={styles.content}>
      <BookingHistoryShimmer />
      <BookingHistoryShimmer />
      <BookingHistoryShimmer />
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <View style={[styles.header, { borderBottomColor: colors.borderColor }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Booking History</Text>
      </View>
      {loading ? (
        renderShimmerItems()
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBookingItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          onRefresh={loadBookings}
          refreshing={loading}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
});

export default BookingHistoryScreen;