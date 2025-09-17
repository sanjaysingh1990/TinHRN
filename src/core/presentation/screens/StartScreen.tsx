import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions } from 'react-native';
const { height } = Dimensions.get('window');

import {
  Animated,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { theme } from '../../../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StartScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = theme[colorScheme];
  const scaleValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleBeginAdventure = async () => {
    try {
      // Set onboarding flag when user begins the adventure
      await AsyncStorage.setItem('@viewedOnboarding', 'true');
    } catch (error) {
      console.error('Error setting onboarding flag:', error);
    }
    router.push('/onboarding');
  };

  const animatedStyle = {
    transform: [{ scale: scaleValue }],
  };

  return (
    <ImageBackground
      source={require('../../../../assets/images/start_screen_background.jpg')} // Replace with your image
      style={styles.background}
    >
      <LinearGradient
        colors={['transparent', 'rgba(23, 21, 17, 0.8)', '#171511']}
        style={styles.overlay}
      />
      <View style={styles.stitchOverlay} />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Welcome to Tent'in Himalayas</Text>
        <Text style={styles.subtitle}>
          Discover curated tours and breathtaking destinations in the heart of the majestic Himalayas.
        </Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handleBeginAdventure}
        accessibilityLabel="Begin Your Adventure"
      >
        <Animated.View style={[styles.button, animatedStyle]}>
          <Text style={styles.buttonText}>Begin Your Adventure</Text>
          <MaterialIcons name="arrow-forward" size={24} color="#171511" />
        </Animated.View>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#171511',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '80%',
  },
  stitchOverlay: {
    position: 'absolute',
    bottom: height * 0.8,
    left: 20,
    right: 20,
    height: 1,
    borderTopWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#b7af9e',
    opacity: 0.5,
  },
  contentContainer: {
    position: 'absolute',
    bottom: 200,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: 'SplineSans_700Bold',
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontFamily: 'NotoSans_400Regular',
    fontSize: 16,
    color: '#b7af9e',
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#df9c20',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    fontFamily: 'SplineSans_700Bold',
    fontSize: 18,
    color: '#171511',
    marginRight: 10,
  },
});

export default StartScreen;