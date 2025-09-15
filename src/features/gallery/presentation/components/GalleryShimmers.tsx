import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';

const { width } = Dimensions.get('window');

export const FeaturedPostShimmer: React.FC = () => {
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

  const shimmerColor = colors.shimmerColor;
  const gradientColors = isDarkMode 
    ? ['transparent', 'rgba(255, 255, 255, 0.1)', 'transparent'] as const
    : ['transparent', 'rgba(255, 255, 255, 0.8)', 'transparent'] as const;

  return (
    <View style={[styles.featuredContainer, { backgroundColor: colors.cardBackgroundColor, borderColor: colors.primary }]}>
      <View style={[styles.featuredImage, { backgroundColor: shimmerColor }]}>
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            {
              transform: [{ translateX }],
            },
          ]}
        >
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>
      </View>
      <View style={styles.featuredContent}>
        <View style={[styles.featuredTitle, { backgroundColor: shimmerColor }]}>
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              {
                transform: [{ translateX }],
              },
            ]}
          >
            <LinearGradient
              colors={gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFillObject}
            />
          </Animated.View>
        </View>
        <View style={[styles.featuredDescription, { backgroundColor: shimmerColor }]}>
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              {
                transform: [{ translateX }],
              },
            ]}
          >
            <LinearGradient
              colors={gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFillObject}
            />
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

export const CategoryShimmer: React.FC = () => {
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

  const shimmerColor = colors.shimmerColor;
  const gradientColors = isDarkMode 
    ? ['transparent', 'rgba(255, 255, 255, 0.1)', 'transparent'] as const
    : ['transparent', 'rgba(255, 255, 255, 0.8)', 'transparent'] as const;

  return (
    <View style={styles.categoryItem}>
      <View style={[styles.categoryImage, { backgroundColor: shimmerColor }]}>
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            {
              transform: [{ translateX }],
            },
          ]}
        >
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>
      </View>
      <View style={styles.categoryTextContainer}>
        <View style={[styles.categoryText, { backgroundColor: shimmerColor }]}>
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              {
                transform: [{ translateX }],
              },
            ]}
          >
            <LinearGradient
              colors={gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFillObject}
            />
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

export const GridItemShimmer: React.FC = () => {
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

  const shimmerColor = colors.shimmerColor;
  const gradientColors = isDarkMode 
    ? ['transparent', 'rgba(255, 255, 255, 0.1)', 'transparent'] as const
    : ['transparent', 'rgba(255, 255, 255, 0.8)', 'transparent'] as const;

  return (
    <View style={[styles.gridItem, { backgroundColor: shimmerColor }]}>
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  featuredContainer: {
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    overflow: 'hidden',
    marginHorizontal: 20,
    marginBottom: 24,
  },
  featuredImage: {
    width: '100%',
    height: 200,
  },
  featuredContent: {
    padding: 16,
  },
  featuredTitle: {
    height: 24,
    borderRadius: 4,
    marginBottom: 12,
  },
  featuredDescription: {
    height: 16,
    borderRadius: 4,
    width: '80%',
  },
  categoryItem: {
    width: 144, // w-36 equivalent
    height: 192, // h-48 equivalent
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryTextContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  categoryText: {
    height: 16,
    borderRadius: 4,
  },
  gridItem: {
    flex: 1,
    aspectRatio: 1,
    margin: 4,
    borderRadius: 12,
  },
});