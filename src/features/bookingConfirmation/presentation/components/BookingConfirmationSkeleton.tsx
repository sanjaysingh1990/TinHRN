import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../../hooks/useTheme';

const BookingConfirmationSkeleton = () => {
  const { colors, isDarkMode } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  const Shimmer = () => (
    <Animated.View
      style={{
        ...StyleSheet.absoluteFillObject,
        transform: [{ translateX }],
      }}
    >
      <LinearGradient
        colors={isDarkMode 
          ? ['transparent', 'rgba(255, 255, 255, 0.1)', 'transparent']
          : ['transparent', 'rgba(255, 255, 255, 0.8)', 'transparent']
        }
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={{ flex: 1 }}
      />
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Success Icon Skeleton */}
      <View style={[styles.successIcon, { backgroundColor: isDarkMode ? '#2A261F' : '#E5E5E5' }]}>
        <Shimmer />
      </View>

      {/* Title Skeleton */}
      <View style={[styles.titleSkeleton, { backgroundColor: isDarkMode ? '#2A261F' : '#E5E5E5' }]}>
        <Shimmer />
      </View>

      {/* Subtitle Skeleton */}
      <View style={[styles.subtitleSkeleton, { backgroundColor: isDarkMode ? '#2A261F' : '#E5E5E5' }]}>
        <Shimmer />
      </View>
      
      {/* Booking Info Card Skeleton */}
      <View style={[styles.card, { backgroundColor: isDarkMode ? '#231f1c' : '#f8f8f8' }]}>
        {[...Array(5)].map((_, i) => (
          <View key={i} style={styles.cardRow}>
            <View style={[styles.cardLabel, { backgroundColor: isDarkMode ? '#2A261F' : '#E5E5E5' }]}>
              <Shimmer />
            </View>
            <View style={[styles.cardValue, { backgroundColor: isDarkMode ? '#2A261F' : '#E5E5E5' }]}>
              <Shimmer />
            </View>
          </View>
        ))}
      </View>

      {/* Buttons Skeleton */}
      <View style={styles.buttonContainer}>
        <View style={[styles.buttonSkeleton, styles.primaryButton, { backgroundColor: isDarkMode ? '#2A261F' : '#E5E5E5' }]}>
          <Shimmer />
        </View>
        <View style={styles.buttonRow}>
          <View style={[styles.buttonSkeleton, styles.secondaryButton, { backgroundColor: isDarkMode ? '#2A261F' : '#E5E5E5' }]}>
            <Shimmer />
          </View>
          <View style={[styles.buttonSkeleton, styles.secondaryButton, { backgroundColor: isDarkMode ? '#2A261F' : '#E5E5E5' }]}>
            <Shimmer />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 60,
    marginBottom: 32,
    overflow: 'hidden',
  },
  titleSkeleton: {
    width: 200,
    height: 28,
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  subtitleSkeleton: {
    width: 280,
    height: 40,
    borderRadius: 8,
    marginBottom: 40,
    overflow: 'hidden',
  },
  card: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
    overflow: 'hidden',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardLabel: {
    width: 100,
    height: 16,
    borderRadius: 4,
    overflow: 'hidden',
  },
  cardValue: {
    width: 120,
    height: 16,
    borderRadius: 4,
    overflow: 'hidden',
  },
  buttonContainer: {
    width: '100%',
  },
  buttonSkeleton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  primaryButton: {
    height: 56,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    height: 56,
    width: '48%',
  },
});

export default BookingConfirmationSkeleton;