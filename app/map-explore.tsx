import React from 'react';
import { SafeAreaView, StatusBar, Text, View } from 'react-native';
import { useTheme } from '../src/hooks/useTheme';

const MapExploreScreen: React.FC = () => {
  const { colors, isDarkMode } = useTheme();
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: colors.text, fontSize: 18 }}>Map feature is no longer available</Text>
        <Text style={{ color: colors.secondary, fontSize: 14, marginTop: 8 }}>Please use the main explore tab</Text>
      </View>
    </SafeAreaView>
  );
};

export default MapExploreScreen;