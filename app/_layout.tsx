import { Stack } from 'expo-router';
import * as SystemUI from 'expo-system-ui';
import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import 'react-native-reanimated'; // 👈 must be first
import { Provider } from 'react-redux';
import 'reflect-metadata';
import '../src/container';
import { store } from '../src/providers/store';
import { theme } from '../src/theme';


import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { PortalProvider } from '@gorhom/portal';

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = theme[colorScheme];

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background);
  }, [colorScheme]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PortalProvider>
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
            <Stack.Screen 
              name="tour/[id]" 
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen 
              name="booking-confirmation" 
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
              }}
            />
          </Stack>
        </Provider>
      </PortalProvider>
    </GestureHandlerRootView>
  );
}
