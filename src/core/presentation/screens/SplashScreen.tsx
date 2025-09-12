
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Image } from 'expo-image';

const SplashScreen = () => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.stitch} />
      <View style={styles.centeredContent}>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <View style={styles.dashedBorder}>
            <Image
              source={{ uri: 'https://tentinhimalayas.com/wp-content/uploads/2024/05/cropped-TTH-logo-with-background-1-180x180.png' }}
              style={styles.logo}
              contentFit="contain"
            />
          </View>
        </Animated.View>
        <Text style={styles.title}>Tent'in</Text>
        <Text style={styles.subtitle}>HIMALAYAS</Text>
      </View>
      <View style={[styles.stitch, styles.bottomStitch]} />
      <Text style={styles.tagline}>
        Handcrafted journeys, stitched with nature.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#171511',
  },
  centeredContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stitch: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    height: 1,
    borderTopWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#b7af9e',
    opacity: 0.5,
  },
  bottomStitch: {
    top: 'auto',
    bottom: 80,
  },
  dashedBorder: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#df9c20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 128,
    height: 128,
    borderRadius: 64,
  },
  title: {
    color: '#df9c20',
    fontFamily: 'SplineSans_700Bold',
    fontSize: 30,
    fontWeight: 'bold',
    letterSpacing: 3, // tracking-wide
    marginTop: 32,
  },
  subtitle: {
    color: '#b7af9e',
    fontFamily: 'NotoSans_400Regular',
    fontSize: 14,
    letterSpacing: 2.8, // tracking-widest
    textTransform: 'uppercase',
  },
  tagline: {
    position: 'absolute',
    bottom: 40,
    color: 'rgba(183, 175, 158, 0.7)',
    fontSize: 12,
    fontFamily: 'NotoSans_400Regular',
  },
});

export default SplashScreen;
