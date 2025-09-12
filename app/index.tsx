
import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreenComponent from '../src/core/presentation/screens/SplashScreen';

const Index = () => {
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

  return <SplashScreenComponent />;
};

export default Index;
