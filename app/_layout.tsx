import { Stack } from 'expo-router';
import * as SystemUI from 'expo-system-ui';
import React, { useEffect } from 'react';
import 'react-native-reanimated'; // 👈 must be first
import { Provider, useSelector } from 'react-redux';
import 'reflect-metadata';
import '../src/container';
import { AuthProvider } from '../src/features/auth/presentation/context/AuthContext';
import { I18nProvider } from '../src/hooks/useI18n';
import { RootState, store } from '../src/providers/store';
import { theme } from '../src/theme';


import { PortalProvider } from '@gorhom/portal';
import { StripeProvider } from '@stripe/stripe-react-native';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import container from '../src/container';
import { GlobalProgressBar } from '../src/core/presentation/components/GlobalProgressBar';
import { UploadService } from '../src/core/services/UploadService';

const AppContent = () => {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const colors = theme[isDarkMode ? 'dark' : 'light'];
  const [isUploading, setIsUploading] = React.useState(false);

  useEffect(() => {
    const uploadService = container.resolve(UploadService);
    return uploadService.subscribe((status) => {
      setIsUploading(status.isUploading);
    });
  }, []);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background);
  }, [isDarkMode, colors.background]);

  return (
    <View style={{ flex: 1, paddingTop: isUploading ? 28 : 0 }}>
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
          name="add-post"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
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
        <Stack.Screen
          name="about-us"
          options={{
            presentation: 'modal',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="faq"
          options={{
            presentation: 'modal',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="post-details"
          options={{
            presentation: 'modal',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="category-full-view"
          options={{
            presentation: 'modal',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="category-posts"
          options={{
            presentation: 'modal',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="customize-tour"
          options={{
            presentation: 'modal',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="map-explore"
          options={{
            presentation: 'modal',
            animation: 'slide_from_right',
          }}
        />
      </Stack>
      <GlobalProgressBar />
    </View>
  );
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PortalProvider>
        <Provider store={store}>
          <AuthProvider>
            <I18nProvider>
              <StripeProvider
                publishableKey="pk_test_51Pz4JbRvCfHkDdNn0XvDz6F3vY7Q2p9aB8cD1eF5gH6iJ7kL8mN9oP0qR1sT2uV3wX4yZ5"
                merchantIdentifier="merchant.com.tentinhimalayas"
              >
                <AppContent />
              </StripeProvider>
            </I18nProvider>
          </AuthProvider>
        </Provider>
      </PortalProvider>
    </GestureHandlerRootView>
  );
}
