
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ShimmerBookingCard = () => {
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
    <View style={styles.card}>
      <View style={styles.image} />
      <View style={styles.info}>
        <View style={[styles.textLine, { width: '40%' }]} />
        <View style={[styles.textLine, { width: '80%', height: 20, marginVertical: 5 }]} />
        <View style={[styles.textLine, { width: '60%' }]} />
        <View style={styles.actions}>
          <View style={styles.button} />
          <View style={styles.button} />
        </View>
      </View>
      <Shimmer />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#1C2620',
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    overflow: 'hidden',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#3a362f',
  },
  info: {
    flex: 1,
    marginLeft: 15,
  },
  textLine: {
    height: 12,
    backgroundColor: '#3a362f',
    borderRadius: 4,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 10,
  },
  button: {
    width: 100,
    height: 36,
    borderRadius: 20,
    backgroundColor: '#3a362f',
    marginRight: 10,
  },
});

export default ShimmerBookingCard;
