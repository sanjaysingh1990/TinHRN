
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IntroScreen: React.FC = () => {
  const router = useRouter();
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);

  useEffect(() => {
    const checkFirstTime = async () => {
      try {
        const value = await AsyncStorage.getItem('@viewedIntro');
        if (value !== null) {
          setIsFirstTime(false);
        } else {
          setIsFirstTime(true);
        }
      } catch (e) {
        // error reading value
        setIsFirstTime(true);
      }
    };
    checkFirstTime();
  }, []);

  const handleContinue = async () => {
    try {
      await AsyncStorage.setItem('@viewedIntro', 'true');
      router.replace('/login');
    } catch (e) {
      // saving error
    }
  };

  if (isFirstTime === null) {
    return null; // Or a loading indicator
  }

  if (!isFirstTime) {
    return <Redirect href="/login" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to TiNHRn!</Text>
      <Text style={styles.subtitle}>Your adventure starts here.</Text>
      <Button title="Continue" onPress={handleContinue} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 30,
  },
});

export default IntroScreen;
