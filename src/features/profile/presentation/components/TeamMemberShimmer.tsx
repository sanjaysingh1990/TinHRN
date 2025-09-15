import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';

const TeamMemberShimmer: React.FC = () => {
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
      width: 200,
      backgroundColor: colors.cardBackgroundColor,
      borderRadius: 16,
      padding: 16,
      marginRight: 16,
      borderWidth: 1,
      borderColor: colors.borderColor,
      borderStyle: 'dashed',
      alignItems: 'center',
      overflow: 'hidden',
    },
    profileImagePlaceholder: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: shimmerColor,
      marginBottom: 12,
    },
    namePlaceholder: {
      height: 16,
      width: '80%',
      backgroundColor: shimmerColor,
      borderRadius: 4,
      marginBottom: 8,
    },
    designationPlaceholder: {
      height: 12,
      width: '90%',
      backgroundColor: shimmerColor,
      borderRadius: 4,
      marginBottom: 8,
    },
    taglinePlaceholder: {
      height: 10,
      width: '100%',
      backgroundColor: shimmerColor,
      borderRadius: 4,
      marginBottom: 4,
    },
    taglinePlaceholder2: {
      height: 10,
      width: '70%',
      backgroundColor: shimmerColor,
      borderRadius: 4,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.profileImagePlaceholder} />
      <View style={styles.namePlaceholder} />
      <View style={styles.designationPlaceholder} />
      <View style={styles.taglinePlaceholder} />
      <View style={styles.taglinePlaceholder2} />
      
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

export default TeamMemberShimmer;