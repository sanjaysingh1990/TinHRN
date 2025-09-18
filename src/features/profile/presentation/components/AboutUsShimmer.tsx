import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';

const AboutUsShimmer: React.FC = () => {
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
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      height: 28,
      marginBottom: 16,
      borderRadius: 4,
      backgroundColor: shimmerColor,
    },
    sectionText: {
      height: 16,
      marginBottom: 8,
      borderRadius: 4,
      backgroundColor: shimmerColor,
    },
    teamMembersShimmer: {
      flexDirection: 'row',
      marginTop: 20,
    },
    teamMemberShimmer: {
      width: 200,
      height: 150,
      borderRadius: 16,
      backgroundColor: shimmerColor,
      marginRight: 16,
    },
  });

  return (
    <View>
      {/* Our Mission Section Shimmer */}
      <View style={styles.section}>
        <View style={styles.sectionTitle} />
        <View style={styles.sectionText} />
        <View style={styles.sectionText} />
        <View style={styles.sectionText} />
        
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

      {/* Our Team Section Shimmer */}
      <View style={styles.section}>
        <View style={styles.sectionTitle} />
        <View style={styles.sectionText} />
        <View style={styles.sectionText} />
        
        {/* Team Members Shimmer */}
        <View style={styles.teamMembersShimmer}>
          <View style={styles.teamMemberShimmer} />
          <View style={styles.teamMemberShimmer} />
          <View style={styles.teamMemberShimmer} />
          
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
      </View>
    </View>
  );
};

export default AboutUsShimmer;