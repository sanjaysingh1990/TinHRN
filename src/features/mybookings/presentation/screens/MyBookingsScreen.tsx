
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import container from '../../../../container';
import { MyBookingsViewModelToken } from '../../mybookings.di';
import { MyBookingsViewModel } from '../viewmodels/MyBookingsViewModel';
import { Booking } from '../../domain/models/Booking';
import BookingsSection from '../components/BookingsSection';
import ShimmerBookingCard from '../components/ShimmerBookingCard';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const MyBookingsScreen = () => {
  const router = useRouter();
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        {loading ? (
          <View style={styles.content}>
            <ShimmerBookingCard />
            <ShimmerBookingCard />
          </View>
        ) : (
          <View style={styles.content}>
            <BookingsSection title="Upcoming" bookings={upcomingBookings} />
            <BookingsSection title="Past" bookings={pastBookings} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#111714',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#3d5245',
  },
  backButton: {
    position: 'absolute',
    left: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
});

export default MyBookingsScreen;
