import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';

const FavoritesShimmer = () => {
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
    container: {
      flexDirection: 'row',
      marginTop: 20,
      width: '100%', // Ensure container doesn't exceed parent width
    },
    favoriteCard: {
      width: 140, // Reduced width to fit within the card container
      height: 150,
      borderRadius: 12,
      backgroundColor: isDarkMode ? '#2A261F' : '#E5E5E5',
      marginRight: 12, // Use marginRight instead of marginHorizontal to control spacing better
      overflow: 'hidden',
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
    <View style={styles.container}>
      <View style={styles.favoriteCard}>
        <Shimmer />
      </View>
      <View style={styles.favoriteCard}>
        <Shimmer />
      </View>
    </View>
  );
};

export default FavoritesShimmer;