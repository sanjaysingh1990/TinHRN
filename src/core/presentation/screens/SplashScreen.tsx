import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { container, InjectionToken } from 'tsyringe';
import { GetCurrentUserUseCaseToken } from '../../../features/auth/auth.di';
import { GetCurrentUserUseCase } from '../../../features/auth/domain/usecases/GetCurrentUserUseCase';
import { auth } from '../../../infrastructure/firebase/firebase.config';
// Ensure container is initialized
import '../../../container';

const SplashScreen = () => {
  const rotation = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Check user session and onboarding status
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      console.log('[SplashScreen] Starting user session check...');
      
      // Wait for Firebase auth to be fully initialized
      await new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          console.log('[SplashScreen] Firebase auth initialized with user:', user);
          unsubscribe(); // Stop listening after first call
          resolve(user);
        });
        
        // Timeout after 5 seconds if no auth state change
        setTimeout(() => {
          console.log('[SplashScreen] Firebase auth initialization timeout');
          unsubscribe();
          resolve(null);
        }, 5000);
      });
      
      // Add a small delay to ensure everything is ready
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if user is already logged in
      // Use a more defensive approach to handle DI issues
      let user = null;
      try {
        // Check if the token is registered before trying to resolve it
        if (container.isRegistered(GetCurrentUserUseCaseToken as InjectionToken)) {
          const getCurrentUserUseCase = container.resolve<GetCurrentUserUseCase>(GetCurrentUserUseCaseToken);
          user = await getCurrentUserUseCase.execute();
        } else {
          console.log('[SplashScreen] GetCurrentUserUseCaseToken not registered, falling back to direct auth check');
          // Fallback to direct Firebase auth check
          const firebaseUser = auth.currentUser;
          if (firebaseUser) {
            user = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || '',
              email: firebaseUser.email || '',
              photoURL: firebaseUser.photoURL || undefined,
              emailVerified: firebaseUser.emailVerified,
              createdAt: new Date(),
              updatedAt: new Date()
            };
          }
        }
      } catch (diError) {
        console.log('[SplashScreen] Dependency injection error, falling back to direct auth check:', diError);
        // Fallback to direct Firebase auth check
        const firebaseUser = auth.currentUser;
        if (firebaseUser) {
          user = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || '',
            email: firebaseUser.email || '',
            photoURL: firebaseUser.photoURL || undefined,
            emailVerified: firebaseUser.emailVerified,
            createdAt: new Date(),
            updatedAt: new Date()
          };
        }
      }
      
      console.log('[SplashScreen] Final user check result:', user);
      
      if (user) {
        console.log('[SplashScreen] User is logged in, navigating to home screen');
        // Store the user session for faster loading next time
        try {
          await AsyncStorage.setItem('@currentUser', JSON.stringify(user));
        } catch (storageError) {
          console.log('[SplashScreen] Error storing user session:', storageError);
        }
        // User is logged in, navigate directly to home screen
        router.replace('/(tabs)');
      } else {
        console.log('[SplashScreen] User is not logged in, checking onboarding status');
        // User is not logged in, check if it's first time opening the app
        const hasViewedOnboarding = await AsyncStorage.getItem('@viewedOnboarding');
        
        if (hasViewedOnboarding === null) {
          console.log('[SplashScreen] First time user, navigating to start screen');
          // First time user, show start screen which leads to onboarding
          router.replace('/start');
        } else {
          console.log('[SplashScreen] Returning user, navigating to login screen');
          // Not first time, show login screen directly
          router.replace('/login');
        }
      }
    } catch (error) {
      console.error('[SplashScreen] Error checking user session:', error);
      // In case of error, default to start screen
      router.replace('/start');
    }
  };

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