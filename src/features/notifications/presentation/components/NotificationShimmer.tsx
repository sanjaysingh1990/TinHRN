import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';

const NotificationShimmer: React.FC = () => {
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
      backgroundColor: colors.background,
      overflow: 'hidden',
    },
    content: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: 16,
    },
    iconPlaceholder: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: shimmerColor,
      marginRight: 12,
    },
    textContainer: {
      flex: 1,
      marginRight: 12,
    },
    titlePlaceholder: {
      height: 16,
      backgroundColor: shimmerColor,
      borderRadius: 4,
      marginBottom: 8,
      width: '70%',
    },
    messagePlaceholder: {
      height: 12,
      backgroundColor: shimmerColor,
      borderRadius: 4,
      marginBottom: 4,
      width: '100%',
    },
    timePlaceholder: {
      height: 10,
      backgroundColor: shimmerColor,
      borderRadius: 4,
      width: '40%',
      marginTop: 8,
    },
    indicatorPlaceholder: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: shimmerColor,
      marginTop: 8,
    },
    divider: {
      height: 1,
      backgroundColor: colors.borderColor,
      marginLeft: 76,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconPlaceholder} />
        <View style={styles.textContainer}>
          <View style={styles.titlePlaceholder} />
          <View style={styles.messagePlaceholder} />
          <View style={styles.timePlaceholder} />
        </View>
        <View style={styles.indicatorPlaceholder} />
      </View>
      <View style={styles.divider} />
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

export default NotificationShimmer;