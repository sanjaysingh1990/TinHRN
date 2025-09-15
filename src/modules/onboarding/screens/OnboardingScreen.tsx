
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { theme } from '../../../theme';

const { width, height } = Dimensions.get('window');

const ONBOARDING_DATA = [
  {
    image: require('../../../../assets/images/start_screen_background.jpg'),
    heading: 'Welcome to Tent\'in Himalayas',
    subheading: 'Your next adventure awaits.',
  },
  {
    image: require('../../../../assets/images/start_screen_background.jpg'),
    heading: 'Discover Hidden Gems',
    subheading: 'Explore places known only to locals.',
  },
  {
    image: require('../../../../assets/images/start_screen_background.jpg'),
    heading: 'Craft Your Journey',
    subheading: 'Personalize your itinerary to match your style.',
  },
  {
    image: require('../../../../assets/images/start_screen_background.jpg'),
    heading: 'Ready to Go?',
    subheading: 'Let\'s start your Himalayan adventure.',
  },
];

const OnboardingScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = theme[colorScheme];
  const pagerRef = useRef<PagerView>(null);
  const [page, setPage] = useState(0);
  const parallaxAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate parallax effect when page changes
    Animated.timing(parallaxAnim, {
      toValue: page * 20, // Positive value for downward movement
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [page]);

  const handleNext = () => {
    if (page < ONBOARDING_DATA.length - 1) {
      pagerRef.current?.setPage(page + 1);
    } else {
      router.push('/login');
    }
  };

  const handleSkip = () => {
    pagerRef.current?.setPage(ONBOARDING_DATA.length - 1);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    backgroundImage: {
      position: 'absolute',
      width: width,
      height: height + 150, // Extra height for parallax effect
      resizeMode: 'cover',
      top: -75, // Center the extra height
    },
    gradientOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: height * 0.7, // Increased to 70% for better shadow coverage
      zIndex: 1,
    },
    page: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-end', // Changed to position content at bottom
      padding: 20,
      paddingBottom: 160, // Space above indicators
      zIndex: 2,
    },
    textContainer: {
      alignItems: 'center',
      marginBottom: 30, // Margin above indicators
    },
    heading: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: 12,
      textShadowColor: 'rgba(0, 0, 0, 0.9)',
      textShadowOffset: { width: 0, height: 3 },
      textShadowRadius: 6,
      letterSpacing: 0.5,
    },
    subheading: {
      fontSize: 18,
      color: '#F5F5F5',
      textAlign: 'center',
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
      lineHeight: 24,
    },
    footer: {
      position: 'absolute',
      bottom: 40,
      left: 20,
      right: 20,
      alignItems: 'center',
      zIndex: 3,
    },
    indicatorContainer: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      marginHorizontal: 4,
    },
    activeDot: {
      backgroundColor: '#FFFFFF',
    },
    nextButton: {
      backgroundColor: colors.primary,
      paddingVertical: 15,
      paddingHorizontal: 100,
      borderRadius: 12,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    nextButtonText: {
      color: colors.background,
      fontWeight: 'bold',
      fontSize: 16,
    },
    skipText: {
      color: '#FFFFFF',
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
  });

  return (
    <View style={styles.container}>
      {/* Full-screen background image with animated parallax effect */}
      <Animated.Image 
        source={ONBOARDING_DATA[page].image} 
        style={[
          styles.backgroundImage,
          {
            transform: [{
              translateY: parallaxAnim // Smooth animated parallax effect
            }]
          }
        ]} 
      />
      
      {/* Enhanced gradient shadow overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0.8)']}
        style={styles.gradientOverlay}
        locations={[0, 0.3, 0.6, 1]}
      />
      
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={(e) => setPage(e.nativeEvent.position)}
      >
        {ONBOARDING_DATA.map((item, index) => (
          <View key={index} style={styles.page}>
            <View style={styles.textContainer}>
              <Text style={styles.heading}>{item.heading}</Text>
              <Text style={styles.subheading}>{item.subheading}</Text>
            </View>
          </View>
        ))}
      </PagerView>
      <View style={styles.footer}>
        <View style={styles.indicatorContainer}>
          {ONBOARDING_DATA.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, page === index && styles.activeDot]}
            />
          ))}
        </View>
        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>
            {page === ONBOARDING_DATA.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
        {page < ONBOARDING_DATA.length - 1 && (
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default OnboardingScreen;
