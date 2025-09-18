import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import container from '../../../../container';
import { useTheme } from '../../../../hooks/useTheme';
import { TourDetails } from '../../domain/entities/TourDetails';
import { TourDetailsViewModelToken } from '../../tour-details.di';
import TourDetailsSkeleton from '../components/TourDetailsSkeleton';
import { TourDetailsViewModel } from '../viewmodels/TourDetailsViewModel';

const { width } = Dimensions.get('window');

// Move styles outside the component to ensure they're defined before use
const getStyles = (colors: any, isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for the sticky footer
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 16,
    height: 60 + (StatusBar.currentHeight || 0),
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  heroImage: {
    width: '100%',
    height: 360,
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: colors.cardBackgroundColor,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderStyle: 'dashed',
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -14,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  badgeText: {
    color: isDarkMode ? '#111714' : '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  cardSubtitle: {
    color: colors.secondary,
    fontSize: 14,
    marginTop: 4,
    marginBottom: 16,
  },
  cardBody: {
    color: colors.secondary,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  chip: {
    backgroundColor: colors.primary + '20',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },
  chipText: {
    color: colors.primary,
    fontSize: 14,
  },
  itineraryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 16,
    position: 'relative',
  },
  itineraryMarker: {
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
    zIndex: 1,
  },
  itineraryIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  itineraryLine: {
    position: 'absolute',
    top: 32,
    left: 15,
    width: 2,
    height: 120,
    backgroundColor: colors.borderColor,
  },
  itineraryContent: {
    flex: 1,
  },
  itineraryDay: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  itineraryTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  itineraryDetail: {
    color: colors.secondary,
    fontSize: 14,
    marginTop: 2,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  pricingLabel: {
    color: colors.text,
    fontSize: 16,
  },
  pricingValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewItem: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 20,
  },
  reviewAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  reviewContent: {
    flex: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewName: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  reviewDate: {
    color: colors.secondary,
    fontSize: 12,
  },
  reviewStars: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  reviewText: {
    color: colors.secondary,
    fontSize: 14,
    lineHeight: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeMoreText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 16,
    right: 16,
    backgroundColor: isDarkMode ? 'rgba(17, 23, 20, 0.8)' : 'rgba(255, 255, 255, 0.8)',
  },
  bookButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  bookButtonLoading: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingIcon: {
    marginRight: 8,
  },
  bookButtonText: {
    color: isDarkMode ? '#111714' : '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  loadMoreButton: {
    padding: 16,
    alignItems: 'center',
  },
  loadMoreText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const TourDetailsScreen = () => {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const { id, name, image } = useLocalSearchParams();
  const [details, setDetails] = useState<TourDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [itineraryModalVisible, setItineraryModalVisible] = useState(false);
  const [reviewsModalVisible, setReviewsModalVisible] = useState(false);
  const [allReviews, setAllReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [lastReviewDoc, setLastReviewDoc] = useState<any>(null);
  const [hasMoreReviews, setHasMoreReviews] = useState(true);

  useEffect(() => {
    const viewModel = container.resolve<TourDetailsViewModel>(TourDetailsViewModelToken);
    viewModel.getTourDetails(id as string).then(data => {
      setDetails(data);
      setLoading(false);
    });
  }, [id]);

  const loadReviews = async (loadMore = false) => {
    if (reviewsLoading || (!loadMore && allReviews.length > 0)) return;
    
    setReviewsLoading(true);
    try {
      const viewModel = container.resolve<TourDetailsViewModel>(TourDetailsViewModelToken);
      const reviews = await viewModel.getTourReviews(
        id as string, 
        10, 
        loadMore ? lastReviewDoc : undefined
      );
      
      if (loadMore) {
        setAllReviews(prev => [...prev, ...reviews]);
      } else {
        setAllReviews(reviews);
      }
      
      if (reviews.length > 0) {
        setLastReviewDoc(reviews[reviews.length - 1].doc);
      }
      
      setHasMoreReviews(reviews.length === 10);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const onBackPress = () => router.back();
  
  const onSettingsPress = () => {
    router.push('/customize-tour');
  };
  
  const onBookPress = async () => {
    // Navigate to customization screen with tour info
    router.push({
      pathname: '/customize-tour',
      params: { 
        tourId: id as string,
        tourName: name as string,
        tourImage: image as string,
        tourDuration: details?.duration || '',
        tourDifficulty: details?.difficulty || '',
        tourAltitude: details?.altitude || '',
        bestTime: details?.bestTime ? JSON.stringify(details.bestTime) : '[]'
      }
    });
  };

  const onReviewPress = () => {
    router.push({
      pathname: '/add-review',
      params: { 
        tourId: id as string
      }
    });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <MaterialIcons
          key={i}
          name={i <= rating ? 'star' : 'star-border'}
          size={16}
          color="#f5b331"
        />
      );
    }
    return stars;
  };

  const renderChips = (items: string[], title: string) => {
    if (!items || items.length === 0) return null;
    
    return (
      <View style={styles.card}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{title.toUpperCase()}</Text>
        </View>
        <View style={styles.chipsContainer}>
          {items.map((item, index) => (
            <View key={index} style={styles.chip}>
              <Text style={styles.chipText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderSeeMoreButton = (onPress: () => void) => (
    <TouchableOpacity onPress={onPress} style={styles.seeMoreButton}>
      <Text style={styles.seeMoreText}>See More</Text>
      <MaterialIcons name="arrow-forward" size={16} color={colors.primary} />
    </TouchableOpacity>
  );

  const ItineraryModal = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={itineraryModalVisible}
      onRequestClose={() => setItineraryModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Full Itinerary</Text>
          <TouchableOpacity onPress={() => setItineraryModalVisible(false)}>
            <MaterialIcons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.modalContent}>
          {details?.itinerary.map((item, index, array) => (
            <View key={index} style={styles.itineraryItem}>
              <View style={styles.itineraryMarker}>
                <View style={styles.itineraryIconContainer}>
                  <MaterialIcons name="terrain" size={16} color={isDarkMode ? '#111714' : '#fff'} />
                </View>
                {index < array.length - 1 && <View style={styles.itineraryLine} />}
              </View>
              <View style={styles.itineraryContent}>
                <Text style={styles.itineraryDay}>Day {item.day}</Text>
                <Text style={styles.itineraryTitle}>{item.activity || item.title}</Text>
                {item.location ? <Text style={styles.itineraryDetail}>Location: {item.location}</Text> : null}
                {item.accommodation ? <Text style={styles.itineraryDetail}>Accommodation: {item.accommodation}</Text> : null}
                {item.transport ? <Text style={styles.itineraryDetail}>Transport: {item.transport}</Text> : null}
                {item.distance ? <Text style={styles.itineraryDetail}>Distance: {item.distance}</Text> : null}
                {item.duration ? <Text style={styles.itineraryDetail}>Duration: {item.duration}</Text> : null}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );

  const ReviewsModal = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={reviewsModalVisible}
      onRequestClose={() => setReviewsModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>All Reviews</Text>
          <TouchableOpacity onPress={() => setReviewsModalVisible(false)}>
            <MaterialIcons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <ScrollView 
          style={styles.modalContent}
          refreshControl={
            <RefreshControl
              refreshing={reviewsLoading}
              onRefresh={() => loadReviews(false)}
              colors={[colors.primary]}
            />
          }
        >
          {allReviews.map((review) => (
            <View key={review.id} style={styles.reviewItem}>
              <Image source={{ uri: review.avatar }} style={styles.reviewAvatar} />
              <View style={styles.reviewContent}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewName}>{review.name}</Text>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
                <View style={styles.reviewStars}>{renderStars(review.rating)}</View>
                <Text style={styles.reviewText}>{review.review}</Text>
              </View>
            </View>
          ))}
          {hasMoreReviews && (
            <TouchableOpacity 
              onPress={() => loadReviews(true)} 
              style={styles.loadMoreButton}
              disabled={reviewsLoading}
            >
              <Text style={styles.loadMoreText}>
                {reviewsLoading ? 'Loading...' : 'Load More Reviews'}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </Modal>
  );

  // Get styles with current theme
  const styles = getStyles(colors, isDarkMode);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      
      <ItineraryModal />
      <ReviewsModal />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <ImageBackground
          source={{ uri: image as string || details?.image || 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
          style={styles.heroImage}
        />

        {loading ? <TourDetailsSkeleton /> : (
          <View style={styles.content}>
            {/* Overview Section */}
            <View style={styles.card}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>OVERVIEW</Text>
              </View>
              <Text style={styles.cardTitle}>{name || details?.name}</Text>
              <Text style={styles.cardSubtitle}>{details?.duration} • Max Altitude: {details?.altitude}</Text>
              <Text style={styles.cardBody}>
                {details?.overview}
              </Text>
            </View>

            {/* Highlights Section */}
            {renderChips(details?.highlights || [], 'Highlights')}

            {/* Includes Section */}
            {renderChips(details?.includes || [], 'Includes')}

            {/* Excludes Section */}
            {renderChips(details?.excludes || [], 'Excludes')}

            {/* Best Time Section */}
            {renderChips(details?.bestTime || [], 'Best Time')}

            {/* Itinerary Section */}
            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>ITINERARY</Text>
                {details && details.itinerary.length > 5 && renderSeeMoreButton(() => setItineraryModalVisible(true))}
              </View>
              {(details?.itinerary.slice(0, 5) || []).map((item, index, array) => (
                <View key={index} style={styles.itineraryItem}>
                  <View style={styles.itineraryMarker}>
                    <View style={styles.itineraryIconContainer}>
                      <MaterialIcons name="terrain" size={16} color={isDarkMode ? '#111714' : '#fff'} />
                    </View>
                    {index < array.length - 1 && <View style={styles.itineraryLine} />}
                  </View>
                  <View style={styles.itineraryContent}>
                    <Text style={styles.itineraryDay}>Day {item.day}</Text>
                    <Text style={styles.itineraryTitle}>{item.activity || item.title}</Text>
                    {item.location ? <Text style={styles.itineraryDetail}>Location: {item.location}</Text> : null}
                    {item.accommodation ? <Text style={styles.itineraryDetail}>Accommodation: {item.accommodation}</Text> : null}
                    {item.transport ? <Text style={styles.itineraryDetail}>Transport: {item.transport}</Text> : null}
                    {item.distance ? <Text style={styles.itineraryDetail}>Distance: {item.distance}</Text> : null}
                    {item.duration ? <Text style={styles.itineraryDetail}>Duration: {item.duration}</Text> : null}
                  </View>
                </View>
              ))}
            </View>

            {/* Pricing Section */}
            <View style={styles.card}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>PRICING</Text>
              </View>
              <View style={styles.pricingRow}>
                <Text style={styles.pricingLabel}>Standard Package</Text>
                <Text style={styles.pricingValue}>{details?.pricing.standard}</Text>
              </View>
              <View style={styles.pricingRow}>
                <Text style={styles.pricingLabel}>Premium Package</Text>
                <Text style={styles.pricingValue}>{details?.pricing.premium}</Text>
              </View>
            </View>

            {/* Reviews Section */}
            {details?.reviews && details.reviews.length > 0 && (
              <View style={styles.card}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Reviews</Text>
                  {details.reviews.length >= 5 && renderSeeMoreButton(() => {
                    loadReviews();
                    setReviewsModalVisible(true);
                  })}
                </View>
                {details.reviews.map((review) => (
                  <View key={review.id} style={styles.reviewItem}>
                    <Image source={{ uri: review.avatar }} style={styles.reviewAvatar} />
                    <View style={styles.reviewContent}>
                      <View style={styles.reviewHeader}>
                        <Text style={styles.reviewName}>{review.name}</Text>
                        <Text style={styles.reviewDate}>{review.date}</Text>
                      </View>
                      <View style={styles.reviewStars}>{renderStars(review.rating)}</View>
                      <Text style={styles.reviewText}>{review.review}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Sticky Header */}
      <View style={styles.headerContainer}>
        <BlurView intensity={80} tint={isDarkMode ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
        <TouchableOpacity onPress={onBackPress} style={styles.headerButton}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tour Details</Text>
        <TouchableOpacity onPress={onReviewPress} style={styles.headerButton}>
          <MaterialIcons name="rate-review" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Sticky Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          onPress={onBookPress} 
          style={[styles.bookButton, bookingLoading && styles.bookButtonLoading]}
          disabled={bookingLoading}
        >
          {bookingLoading ? (
            <View style={styles.buttonContent}>
              <MaterialIcons name="hourglass-empty" size={20} color={isDarkMode ? '#111714' : '#fff'} style={styles.loadingIcon} />
              <Text style={styles.bookButtonText}>Booking...</Text>
            </View>
          ) : (
            <Text style={styles.bookButtonText}>Next</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TourDetailsScreen;