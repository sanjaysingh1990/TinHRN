
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = () => {
  const [redirect, setRedirect] = useState<string | null>(null);

  useEffect(() => {
    const prepare = async () => {
      try {
        const value = await AsyncStorage.getItem('@viewedIntro');
        if (value !== null) {
          setRedirect('/login');
        } else {
          setRedirect('/intro');
        }
      } catch (e) {
        setRedirect('/intro');
      }
    };

    setTimeout(() => {
      prepare();
    }, 5000); // 5 second delay
  }, []);

  if (redirect) {
    return <Redirect href={redirect} />;
  }

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo.svg')} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 100,
    height: 100,
  },
});

export default SplashScreen;
