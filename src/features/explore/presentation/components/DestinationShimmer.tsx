import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';

const DestinationShimmer: React.FC = () => {
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
  const gradientColors = isDarkMode 
    ? ['transparent', 'rgba(255, 255, 255, 0.1)', 'transparent'] as const
    : ['transparent', 'rgba(255, 255, 255, 0.8)', 'transparent'] as const;

  const styles = StyleSheet.create({
    container: {
      width: 250,
      backgroundColor: colors.cardBackgroundColor,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.borderColor,
      borderStyle: 'dashed',
      marginRight: 16,
      overflow: 'hidden',
    },
    imagePlaceholder: {
      width: '100%',
      height: 140,
      backgroundColor: shimmerColor,
    },
    content: {
      padding: 16,
    },
    titlePlaceholder: {
      height: 18,
      backgroundColor: shimmerColor,
      borderRadius: 4,
      marginBottom: 8,
      width: '80%',
    },
    locationPlaceholder: {
      height: 14,
      backgroundColor: shimmerColor,
      borderRadius: 4,
      width: '60%',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.imagePlaceholder} />
      <View style={styles.content}>
        <View style={styles.titlePlaceholder} />
        <View style={styles.locationPlaceholder} />
      </View>
      
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          transform: [{ translateX }],
        }}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
};

export default DestinationShimmer;