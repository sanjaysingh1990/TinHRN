import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import container from '../../../../container';
import { useTheme } from '../../../../hooks/useTheme';
import { BookingConfirmation } from '../../../tour-details/data/repositories/TourDetailsRepository';
import { BookingConfirmationViewModelToken } from '../../bookingConfirmation.di';
import BookingConfirmationSkeleton from '../components/BookingConfirmationSkeleton';
import { BookingConfirmationViewModel } from '../viewmodels/BookingConfirmationViewModel';

const BookingConfirmationScreen = () => {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const { bookingId, tourId } = useLocalSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState<BookingConfirmation | null>(null);

  useEffect(() => {
    const loadBookingConfirmation = async () => {
      try {
        const viewModel = container.resolve<BookingConfirmationViewModel>(
          BookingConfirmationViewModelToken
        );
        // Use bookingId if available, otherwise fallback to old method with tourId
        const data = bookingId 
          ? await viewModel.getBookingDetails(bookingId as string)
          : await viewModel.confirmBooking(tourId as string);
          
        setBookingData(data);
      } catch (error) {
        Alert.alert('Error', 'Failed to load booking confirmation');
      } finally {
        setLoading(false);
      }
    };

    loadBookingConfirmation();
  }, [bookingId]);

  const handleShare = async () => {
    if (!bookingData) return;
    
    try {
      await Share.share({
        message: `🏔️ My Tent&apos;in Himalayas Adventure is Confirmed!

📅 Tour: ${bookingData.tourName}
🎫 Reference: ${bookingData.bookingReference}
📆 Date: ${bookingData.date}
⏱️ Duration: ${bookingData.duration}
💰 Amount: ${bookingData.totalAmount}

Can&apos;t wait for this amazing journey!`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share booking details');
    }
  };

  const handleViewBookingDetails = () => {
    // Navigate to booking details screen
    router.push('/(tabs)/bookings');
  };

  const handleBackToHome = () => {
    // Navigate to home screen
    router.push('/(tabs)');
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
        
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.borderColor }]}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Order Confirmation</Text>
          <View style={styles.headerSpacer} />
        </View>

        <BookingConfirmationSkeleton />
      </SafeAreaView>
    );
  }

  if (!bookingData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>
            Failed to load booking confirmation
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      
      {/* Fixed Header */}
      <View style={[styles.header, { borderBottomColor: colors.borderColor }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Order Confirmation</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}
        <View style={styles.successIconContainer}>
          <View style={[styles.successIconCircle, { borderColor: colors.primary }]}>
            <MaterialIcons name="check" size={48} color={colors.primary} />
          </View>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text }]}>
          Booking Confirmed!
        </Text>

        {/* Subtitle */}
        <Text style={[styles.subtitle, { color: colors.secondary }]}>
          Your adventure with Tent&apos;in Himalayas is set. We&apos;re thrilled to have you join us!
        </Text>

        {/* Booking Info Card */}
        <View style={[styles.bookingCard, { backgroundColor: isDarkMode ? '#231f1c' : '#f8f8f8' }]}>
          <View style={styles.bookingRow}>
            <Text style={[styles.bookingLabel, { color: colors.secondary }]}>Tour Name</Text>
            <Text style={[styles.bookingValue, { color: colors.text }]}>{bookingData.tourName}</Text>
          </View>
          
          <View style={[styles.bookingRow, styles.borderTop, { borderTopColor: colors.borderColor }]}>
            <Text style={[styles.bookingLabel, { color: colors.secondary }]}>Reference</Text>
            <Text style={[styles.bookingValue, { color: colors.text }]}>{bookingData.bookingReference}</Text>
          </View>
          
          <View style={[styles.bookingRow, styles.borderTop, { borderTopColor: colors.borderColor }]}>
            <Text style={[styles.bookingLabel, { color: colors.secondary }]}>Date</Text>
            <Text style={[styles.bookingValue, { color: colors.text }]}>{bookingData.date}</Text>
          </View>
          
          <View style={[styles.bookingRow, styles.borderTop, { borderTopColor: colors.borderColor }]}>
            <Text style={[styles.bookingLabel, { color: colors.secondary }]}>Duration</Text>
            <Text style={[styles.bookingValue, { color: colors.text }]}>{bookingData.duration}</Text>
          </View>
          
          <View style={[styles.bookingRow, styles.borderTop, { borderTopColor: colors.borderColor }]}>
            <Text style={[styles.bookingLabel, { color: colors.secondary }]}>Total Amount</Text>
            <Text style={[styles.bookingValue, styles.totalAmount, { color: colors.text }]}>{bookingData.totalAmount}</Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          {/* Primary Button */}
          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={handleViewBookingDetails}
          >
            <Text style={[styles.primaryButtonText, { color: isDarkMode ? '#111714' : '#ffffff' }]}>
              View Booking Details
            </Text>
          </TouchableOpacity>

          {/* Secondary Buttons Row */}
          <View style={styles.secondaryButtonRow}>
            <TouchableOpacity 
              style={[styles.secondaryButton, { backgroundColor: isDarkMode ? '#383029' : '#e5e5e5' }]}
              onPress={handleShare}
            >
              <MaterialIcons name="share" size={20} color={colors.text} />
              <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
                Share Booking
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.tertiaryButton, { borderColor: colors.borderColor }]}
              onPress={handleBackToHome}
            >
              <Text style={[styles.tertiaryButtonText, { color: colors.text }]}>
                Back to Home
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    paddingTop: '10%', // Using 10% margin as requested for consistency throughout the app
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold', // Made header text bold
    fontFamily: 'Manrope',
  },
  headerSpacer: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  successIconContainer: {
    marginBottom: 32,
  },
  successIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Manrope',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Noto Sans',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 16,
  },
  bookingCard: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
  },
  bookingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  borderTop: {
    borderTopWidth: 1,
  },
  bookingLabel: {
    fontSize: 16,
    fontFamily: 'Noto Sans',
  },
  bookingValue: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Manrope',
  },
  totalAmount: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  buttonContainer: {
    width: '100%',
  },
  primaryButton: {
    width: '100%',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Manrope',
  },
  secondaryButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Manrope',
    marginLeft: 8,
  },
  tertiaryButton: {
    width: '48%',
    borderRadius: 12,
    borderWidth: 2,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  tertiaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Manrope',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default BookingConfirmationScreen;