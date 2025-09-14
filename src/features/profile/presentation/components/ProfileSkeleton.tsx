
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ProfileSkeleton = () => {
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

  const Shimmer = () => (
    <Animated.View
      style={{
        ...StyleSheet.absoluteFillObject,
        transform: [{ translateX }],
      }}
    >
      <LinearGradient
        colors={['transparent', 'rgba(255, 255, 255, 0.1)', 'transparent']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={{ flex: 1 }}
      />
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Achievements Skeleton */}
      <View style={styles.card}>
        <View style={styles.badge} />
        <View style={styles.grid}>
          {[...Array(4)].map((_, i) => (
            <View key={i} style={styles.achievementItem}>
              <View style={styles.achievementIcon} />
              <View style={styles.textLine} />
            </View>
          ))}
        </View>
        <Shimmer />
      </View>

      {/* Favorites Skeleton */}
      <View style={styles.card}>
        <View style={styles.badge} />
        <View style={styles.favoriteCard} />
        <View style={styles.favoriteCard} />
        <Shimmer />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: '#1C2620',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    overflow: 'hidden',
  },
  badge: {
    position: 'absolute',
    top: -14,
    alignSelf: 'center',
    width: 100,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3a362f',
  },
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
    backgroundColor: '#3a362f',
    marginBottom: 8,
  },
  textLine: {
    width: '80%',
    height: 10,
    backgroundColor: '#3a362f',
    borderRadius: 4,
  },
  favoriteCard: {
    height: 150,
    borderRadius: 12,
    backgroundColor: '#3a362f',
    marginBottom: 15,
  },
});

export default ProfileSkeleton;
