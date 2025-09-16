import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';

const ExploreCardShimmer: React.FC = () => {
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

  const shimmerColor = isDarkMode ? '#2A261F' : '#E5E5E5';
  
  const styles = StyleSheet.create({
    card: {
      width: 280,
      height: 160,
      borderRadius: 16,
      backgroundColor: colors.cardBackgroundColor,
      borderWidth: 1,
      borderColor: colors.borderColor,
      borderStyle: 'dashed',
      marginRight: 16,
      overflow: 'hidden',
      padding: 16,
    },
    imageShimmer: {
      width: '100%',
      height: 80,
      borderRadius: 12,
      backgroundColor: shimmerColor,
      marginBottom: 12,
      overflow: 'hidden',
    },
    titleShimmer: {
      width: '70%',
      height: 16,
      borderRadius: 4,
      backgroundColor: shimmerColor,
      marginBottom: 8,
      overflow: 'hidden',
    },
    descriptionShimmer: {
      width: '90%',
      height: 12,
      borderRadius: 4,
      backgroundColor: shimmerColor,
      marginBottom: 4,
      overflow: 'hidden',
    },
    descriptionShimmer2: {
      width: '60%',
      height: 12,
      borderRadius: 4,
      backgroundColor: shimmerColor,
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
    <View style={styles.card}>
      <View style={styles.imageShimmer}>
        <Shimmer />
      </View>
      <View style={styles.titleShimmer}>
        <Shimmer />
      </View>
      <View style={styles.descriptionShimmer}>
        <Shimmer />
      </View>
      <View style={styles.descriptionShimmer2}>
        <Shimmer />
      </View>
    </View>
  );
};

export default ExploreCardShimmer;