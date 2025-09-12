
import 'reflect-metadata';
import '../src/container';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '../src/providers/store';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import * as SystemUI from 'expo-system-ui';
import { theme } from '../src/theme';

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = theme[colorScheme];

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background);
  }, [colorScheme]);

  return (
    <Provider store={store}>
      <Stack 
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="intro" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </Provider>
  );
}
