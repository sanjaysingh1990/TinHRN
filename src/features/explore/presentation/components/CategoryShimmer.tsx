import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';

const CategoryShimmer: React.FC = () => {
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
      backgroundColor: colors.cardBackgroundColor,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.borderColor,
      borderStyle: 'dashed',
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
      height: 120,
      overflow: 'hidden',
    },
    iconPlaceholder: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: shimmerColor,
      marginBottom: 12,
    },
    textPlaceholder: {
      height: 16,
      width: 60,
      backgroundColor: shimmerColor,
      borderRadius: 4,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.iconPlaceholder} />
      <View style={styles.textPlaceholder} />
      
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

export default CategoryShimmer;