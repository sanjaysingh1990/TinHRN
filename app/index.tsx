
import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import SplashScreenComponent from '../src/core/presentation/screens/SplashScreen';

const Index = () => {
  const [redirect, setRedirect] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setRedirect(true);
    }, 5000); // 5 second delay
  }, []);

  if (redirect) {
    return <Redirect href="/start" />;
  }

  return <SplashScreenComponent />;
};

export default Index;
