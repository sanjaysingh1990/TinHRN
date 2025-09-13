
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import { theme } from '../../../theme';

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

const { width } = Dimensions.get('window');

const OnboardingScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = theme[colorScheme];
  const scrollRef = useRef<ScrollView>(null);
  const [page, setPage] = useState(0);

  const handleNext = () => {
    if (page < ONBOARDING_DATA.length - 1) {
      scrollRef.current?.scrollTo({ x: width * (page + 1), animated: true });
    } else {
      router.push('/login');
    }
  };

  const handleSkip = () => {
    scrollRef.current?.scrollTo({ x: width * (ONBOARDING_DATA.length - 1), animated: true });
  };

  const onScroll = (event: any) => {
    const newPage = Math.round(event.nativeEvent.contentOffset.x / width);
    setPage(newPage);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    page: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      width: width,
    },
    image: {
      width: 250,
      height: 250,
      marginBottom: 40,
    },
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 10,
    },
    subheading: {
      fontSize: 16,
      color: colors.secondary,
      textAlign: 'center',
    },
    footer: {
      position: 'absolute',
      bottom: 40,
      left: 20,
      right: 20,
      alignItems: 'center',
    },
    indicatorContainer: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.secondary,
      marginHorizontal: 4,
    },
    activeDot: {
      backgroundColor: colors.primary,
    },
    nextButton: {
      backgroundColor: colors.primary,
      paddingVertical: 15,
      paddingHorizontal: 100,
      borderRadius: 12,
      marginBottom: 20,
    },
    nextButtonText: {
      color: colors.background,
      fontWeight: 'bold',
      fontSize: 16,
    },
    skipText: {
      color: colors.secondary,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {ONBOARDING_DATA.map((item, index) => (
          <View key={index} style={styles.page}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.heading}>{item.heading}</Text>
            <Text style={styles.subheading}>{item.subheading}</Text>
          </View>
        ))}
      </ScrollView>
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
