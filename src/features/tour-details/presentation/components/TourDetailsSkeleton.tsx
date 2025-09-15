
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';

const TourDetailsSkeleton = () => {
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

  const styles = StyleSheet.create({
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
      overflow: 'hidden',
    },
    badge: {
      position: 'absolute',
      top: -14,
      alignSelf: 'center',
      width: 100,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.shimmerColor,
    },
    textLine: {
      height: 16,
      backgroundColor: colors.shimmerColor,
      borderRadius: 4,
      marginBottom: 10,
    },
  });

  return (
    <View style={styles.content}>
      <View style={styles.card}>
        <View style={styles.badge} />
        <View style={[styles.textLine, { width: '60%', height: 24, marginBottom: 10 }]} />
        <View style={[styles.textLine, { width: '40%', height: 16, marginBottom: 20 }]} />
        <View style={[styles.textLine, { width: '100%' }]} />
        <View style={[styles.textLine, { width: '100%' }]} />
        <View style={[styles.textLine, { width: '80%' }]} />
        <Shimmer />
      </View>
      <View style={styles.card}>
        <View style={styles.badge} />
        <View style={[styles.textLine, { width: '100%', height: 40, marginBottom: 20 }]} />
        <View style={[styles.textLine, { width: '100%', height: 40, marginBottom: 20 }]} />
        <View style={[styles.textLine, { width: '100%', height: 40, marginBottom: 20 }]} />
        <Shimmer />
      </View>
    </View>
  );
};

export default TourDetailsSkeleton;
