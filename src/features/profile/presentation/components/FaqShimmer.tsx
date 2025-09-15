import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';

const FaqShimmer: React.FC = () => {
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
      marginBottom: 16,
      padding: 20,
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    questionContainer: {
      flex: 1,
      marginRight: 12,
    },
    questionPlaceholder: {
      height: 18,
      backgroundColor: shimmerColor,
      borderRadius: 4,
      marginBottom: 8,
      width: '95%',
    },
    questionPlaceholder2: {
      height: 16,
      backgroundColor: shimmerColor,
      borderRadius: 4,
      width: '70%',
    },
    categoryPlaceholder: {
      height: 12,
      backgroundColor: shimmerColor,
      borderRadius: 4,
      width: '40%',
      marginTop: 8,
    },
    iconPlaceholder: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: shimmerColor,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.questionContainer}>
          <View style={styles.questionPlaceholder} />
          <View style={styles.questionPlaceholder2} />
          <View style={styles.categoryPlaceholder} />
        </View>
        <View style={styles.iconPlaceholder} />
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

export default FaqShimmer;