
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Image,
    ImageBackground,
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

const TourDetailsScreen = () => {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const { id, name, image } = useLocalSearchParams();
  const [details, setDetails] = useState<TourDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const viewModel = container.resolve<TourDetailsViewModel>(TourDetailsViewModelToken);
    viewModel.getTourDetails(id as string).then(data => {
      setDetails(data);
      setLoading(false);
    });
  }, [id]);

  const onBackPress = () => router.back();
  
  const onBookPress = async () => {
    if (bookingLoading) return; // Prevent multiple clicks
    
    try {
      setBookingLoading(true);
      const viewModel = container.resolve<TourDetailsViewModel>(TourDetailsViewModelToken);
      const result = await viewModel.bookTour(id as string);
      
      // Navigate to booking confirmation with booking ID
      router.push(`/booking-confirmation?bookingId=${result.bookingId}`);
    } catch (error) {
      console.error('Booking failed:', error);
      // Handle error - could show an alert or toast
    } finally {
      setBookingLoading(false);
    }
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

  const styles = StyleSheet.create({
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
    itineraryItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      width: '100%',
      marginBottom: 16,
    },
    itineraryMarker: {
      alignItems: 'center',
      marginRight: 16,
    },
    itineraryIconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    itineraryLine: {
      flex: 1,
      width: 2,
      backgroundColor: colors.borderColor,
      marginTop: 4,
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
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <ImageBackground
          source={{ uri: image as string || 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
          style={styles.heroImage}
        />

        {loading ? <TourDetailsSkeleton /> : (
          <View style={styles.content}>
            {/* Overview Section */}
            <View style={styles.card}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>OVERVIEW</Text>
              </View>
              <Text style={styles.cardTitle}>{name}</Text>
              <Text style={styles.cardSubtitle}>{details?.itinerary.length} Days • Max Altitude: 4,130m</Text>
              <Text style={styles.cardBody}>
                {details?.overview}
              </Text>
            </View>

            {/* Itinerary Section */}
            <View style={styles.card}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>ITINERARY</Text>
              </View>
              {details?.itinerary.map((item, index) => (
                <View key={index} style={styles.itineraryItem}>
                  <View style={styles.itineraryMarker}>
                    <View style={styles.itineraryIconContainer}>
                      <MaterialIcons name={item.icon as any} size={16} color={isDarkMode ? '#111714' : '#fff'} />
                    </View>
                    {index < details.itinerary.length - 1 && <View style={styles.itineraryLine} />}
                  </View>
                  <View style={styles.itineraryContent}>
                    <Text style={styles.itineraryDay}>Day {item.day}</Text>
                    <Text style={styles.itineraryTitle}>{item.title}</Text>
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
            <View style={styles.card}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>REVIEWS</Text>
              </View>
              {details?.reviews.map((review) => (
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
        <View style={styles.headerButton} />
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
            <Text style={styles.bookButtonText}>Book This Tour</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TourDetailsScreen;
