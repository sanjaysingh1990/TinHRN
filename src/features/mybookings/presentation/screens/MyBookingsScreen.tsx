import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import container from '../../../../container';
import { useTheme } from '../../../../hooks/useTheme';
import { Booking } from '../../domain/models/Booking';
import { MyBookingsViewModelToken } from '../../mybookings.di';
import BookingCard from '../components/BookingCard';
import ShimmerBookingCard from '../components/ShimmerBookingCard';
import { MyBookingsViewModel } from '../viewmodels/MyBookingsViewModel';

const MyBookingsScreen = () => {
  const { colors, isDarkMode } = useTheme();
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [upcomingLastDoc, setUpcomingLastDoc] = useState<any>(null);
  const [pastLastDoc, setPastLastDoc] = useState<any>(null);
  const [hasMoreUpcoming, setHasMoreUpcoming] = useState(true);
  const [hasMorePast, setHasMorePast] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const viewModel = container.resolve<MyBookingsViewModel>(MyBookingsViewModelToken);
      const [upcomingResult, pastResult] = await Promise.all([
        viewModel.getUpcomingBookings(5),
        viewModel.getPastBookings(5)
      ]);
      
      setUpcomingBookings(upcomingResult.bookings);
      setPastBookings(pastResult.bookings);
      setUpcomingLastDoc(upcomingResult.lastDoc);
      setPastLastDoc(pastResult.lastDoc);
      setHasMoreUpcoming(upcomingResult.bookings.length === 5);
      setHasMorePast(pastResult.bookings.length === 5);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreUpcoming = async () => {
    if (!hasMoreUpcoming || !upcomingLastDoc) return;
    
    try {
      const viewModel = container.resolve<MyBookingsViewModel>(MyBookingsViewModelToken);
      const result = await viewModel.getUpcomingBookings(5, upcomingLastDoc);
      
      setUpcomingBookings(prev => [...prev, ...result.bookings]);
      setUpcomingLastDoc(result.lastDoc);
      setHasMoreUpcoming(result.bookings.length === 5);
    } catch (error) {
      console.error('Error loading more upcoming bookings:', error);
    }
  };

  const loadMorePast = async () => {
    if (!hasMorePast || !pastLastDoc) return;
    
    try {
      const viewModel = container.resolve<MyBookingsViewModel>(MyBookingsViewModelToken);
      const result = await viewModel.getPastBookings(5, pastLastDoc);
      
      setPastBookings(prev => [...prev, ...result.bookings]);
      setPastLastDoc(result.lastDoc);
      setHasMorePast(result.bookings.length === 5);
    } catch (error) {
      console.error('Error loading more past bookings:', error);
    }
  };

  // Filter out empty sections
  const sections = [
    ...(upcomingBookings.length > 0 ? [{
      title: 'Upcoming',
      data: upcomingBookings,
      loadMore: loadMoreUpcoming,
      hasMore: hasMoreUpcoming
    }] : []),
    ...(pastBookings.length > 0 ? [{
      title: 'Past',
      data: pastBookings,
      loadMore: loadMorePast,
      hasMore: hasMorePast
    }] : []),
  ];

  const renderSectionHeader = ({ section }: { section: any }) => (
    <View>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
      {section.hasMore && (
        <TouchableOpacity onPress={section.loadMore} style={styles.loadMoreButton}>
          <Text style={[styles.loadMoreText, { color: colors.primary }]}>Load More</Text>
        </TouchableOpacity>
      )}
    </View>
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

  const renderEmptyView = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons 
        name="event-busy" 
        size={64} 
        color={colors.secondary} 
      />
      <Text style={[styles.emptyText, { color: colors.text }]}>No data found</Text>
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
      ) : sections.length > 0 ? (
        <SectionList
          sections={sections}
          renderItem={renderBookingItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          onRefresh={loadBookings}
          refreshing={loading}
        />
      ) : (
        renderEmptyView()
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
  loadMoreButton: {
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  loadMoreText: {
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
});

export default MyBookingsScreen;