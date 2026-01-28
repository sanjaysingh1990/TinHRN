import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../../hooks/useTheme';
import { useViewModel } from '../../../../hooks/useViewModel';
import { Booking } from '../../../mybookings/domain/models/Booking';
import { BookingHistoryViewModelToken } from '../../profile.di';
import BookingHistoryItem from '../components/BookingHistoryItem';
import BookingHistoryShimmer from '../components/BookingHistoryShimmer';
import { BookingHistoryViewModel } from '../viewmodels/BookingHistoryViewModel';

const BookingHistoryScreen = () => {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const viewModel = useViewModel<BookingHistoryViewModel>(BookingHistoryViewModelToken);

  useEffect(() => {
    viewModel.loadBookings();
  }, [viewModel]);

  const { bookings, isLoading } = viewModel;

  const handleBack = () => {
    Haptics.selectionAsync();
    router.back();
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
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Booking History</Text>
      </View>
      {isLoading && bookings.length === 0 ? (
        renderShimmerItems()
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBookingItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          onRefresh={() => viewModel.loadBookings()}
          refreshing={isLoading}
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