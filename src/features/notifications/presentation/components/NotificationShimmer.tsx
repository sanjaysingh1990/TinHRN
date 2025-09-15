import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const NotificationShimmer: React.FC = () => {
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
          colors={['transparent', 'rgba(255, 255, 255, 0.1)', 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C1917',
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
    backgroundColor: '#2A261F',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  titlePlaceholder: {
    height: 16,
    backgroundColor: '#2A261F',
    borderRadius: 4,
    marginBottom: 8,
    width: '70%',
  },
  messagePlaceholder: {
    height: 12,
    backgroundColor: '#2A261F',
    borderRadius: 4,
    marginBottom: 4,
    width: '100%',
  },
  timePlaceholder: {
    height: 10,
    backgroundColor: '#2A261F',
    borderRadius: 4,
    width: '40%',
    marginTop: 8,
  },
  indicatorPlaceholder: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2A261F',
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#2A261F',
    marginLeft: 76,
  },
});

export default NotificationShimmer;