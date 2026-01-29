import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import {
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useI18n } from '../../../../hooks/useI18n';
import { useTheme } from '../../../../hooks/useTheme';
import { useViewModel } from '../../../../hooks/useViewModel';
import { Booking } from '../../domain/models/Booking';
import { MyBookingsViewModelToken } from '../../mybookings.di';
import BookingCard from '../components/BookingCard';
import ShimmerBookingCard from '../components/ShimmerBookingCard';
import { MyBookingsViewModel } from '../viewmodels/MyBookingsViewModel';

const MyBookingsScreen = () => {
  const { colors, isDarkMode } = useTheme();
  const { t } = useI18n();
  const viewModel = useViewModel<MyBookingsViewModel>(MyBookingsViewModelToken);

  useEffect(() => {
    viewModel.loadBookings();
  }, [viewModel]);

  const { upcomingBookings, pastBookings, isLoading, hasMoreUpcoming, hasMorePast } = viewModel;

  const handleRefresh = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    viewModel.loadBookings();
  };

  const handleLoadMoreUpcoming = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    viewModel.loadMoreUpcoming();
  };

  const handleLoadMorePast = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    viewModel.loadMorePast();
  };

  const sections = [
    ...(upcomingBookings.length > 0 ? [{
      title: t('bookings.upcoming'),
      data: upcomingBookings,
      loadMore: handleLoadMoreUpcoming,
      hasMore: hasMoreUpcoming
    }] : []),
    ...(pastBookings.length > 0 ? [{
      title: t('bookings.past'),
      data: pastBookings,
      loadMore: handleLoadMorePast,
      hasMore: hasMorePast
    }] : []),
  ];

  const renderSectionHeader = ({ section }: { section: any }) => (
    <View style={styles.sectionHeader}>
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
      <Text style={[styles.emptyText, { color: colors.text }]}>{t('bookings.empty')}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <View style={[styles.header, { borderBottomColor: colors.borderColor }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('bookings.title')}</Text>
      </View>
      {isLoading && (upcomingBookings.length === 0 && pastBookings.length === 0) ? (
        renderShimmerItems()
      ) : sections.length > 0 ? (
        <SectionList
          sections={sections}
          renderItem={renderBookingItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          onRefresh={handleRefresh}
          refreshing={isLoading}
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  loadMoreButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  loadMoreText: {
    fontWeight: 'bold',
    fontSize: 14,
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