
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../../hooks/useTheme';
import container from '../../../../container';
import { MyBookingsViewModelToken } from '../../mybookings.di';
import { MyBookingsViewModel } from '../viewmodels/MyBookingsViewModel';
import { Booking } from '../../domain/models/Booking';
import BookingCard from '../components/BookingCard';
import ShimmerBookingCard from '../components/ShimmerBookingCard';
import { MaterialIcons } from '@expo/vector-icons';


const MyBookingsScreen = () => {
  const { colors, isDarkMode } = useTheme();
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const viewModel = container.resolve<MyBookingsViewModel>(MyBookingsViewModelToken);
    Promise.all([
      viewModel.getUpcomingBookings(),
      viewModel.getPastBookings(),
    ]).then(([upcoming, past]) => {
      setUpcomingBookings(upcoming);
      setPastBookings(past);
      setLoading(false);
    });
  }, []);

  const sections = [
    {
      title: 'Upcoming',
      data: upcomingBookings,
    },
    {
      title: 'Past',
      data: pastBookings,
    },
  ];

  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
  );

  const renderBookingItem = ({ item }: { item: Booking }) => (
    <BookingCard booking={item} />
  );

  const renderShimmerItems = () => (
    <View style={styles.content}>
      <ShimmerBookingCard />
      <ShimmerBookingCard />
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <View style={[styles.header, { borderBottomColor: colors.borderColor }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Bookings</Text>
      </View>
      {loading ? (
        renderShimmerItems()
      ) : (
        <SectionList
          sections={sections}
          renderItem={renderBookingItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
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
    justifyContent: 'center',
    padding: 15,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 20,
  },
  content: {
    padding: 16,
  },
});

export default MyBookingsScreen;
