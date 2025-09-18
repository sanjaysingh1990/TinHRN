import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';

const BookingHistoryShimmer = () => {
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

  const styles = StyleSheet.create({
    card: {
      flexDirection: 'row',
      backgroundColor: colors.cardBackgroundColor,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.borderColor,
      borderStyle: 'dashed',
      padding: 15,
      marginBottom: 15,
      overflow: 'hidden',
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 12,
      backgroundColor: colors.shimmerColor,
    },
    info: {
      flex: 1,
      marginLeft: 15,
    },
    textLine: {
      height: 12,
      backgroundColor: colors.shimmerColor,
      borderRadius: 4,
      marginBottom: 8,
    },
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
    <View style={styles.card}>
      <View style={styles.image} />
      <View style={styles.info}>
        <View style={[styles.textLine, { width: '40%' }]} />
        <View style={[styles.textLine, { width: '80%', height: 20, marginVertical: 5 }]} />
        <View style={[styles.textLine, { width: '60%' }]} />
        <View style={[styles.textLine, { width: '30%' }]} />
      </View>
      <Shimmer />
    </View>
  );
};

export default BookingHistoryShimmer;