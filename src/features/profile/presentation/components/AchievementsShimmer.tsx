import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';

const AchievementsShimmer = () => {
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
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      marginTop: 20,
    },
    achievementItem: {
      alignItems: 'center',
      width: '25%',
      marginBottom: 20,
    },
    achievementIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: isDarkMode ? '#2A261F' : '#E5E5E5',
      marginBottom: 8,
      overflow: 'hidden',
    },
    textLine: {
      width: '80%',
      height: 10,
      backgroundColor: isDarkMode ? '#2A261F' : '#E5E5E5',
      borderRadius: 4,
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
    <View style={styles.grid}>
      {[...Array(4)].map((_, i) => (
        <View key={i} style={styles.achievementItem}>
          <View style={styles.achievementIcon}>
            <Shimmer />
          </View>
          <View style={styles.textLine}>
            <Shimmer />
          </View>
        </View>
      ))}
    </View>
  );
};

export default AchievementsShimmer;