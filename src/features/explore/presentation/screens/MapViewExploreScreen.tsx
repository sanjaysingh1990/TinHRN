import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';
import ExploreMapContent from '../components/ExploreMapContent';

interface MapViewExploreScreenProps {
  hideHeader?: boolean;
}

const MapViewExploreScreen: React.FC<MapViewExploreScreenProps> = ({ hideHeader = false }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {!hideHeader && <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />}
      <ExploreMapContent />
    </SafeAreaView>
  );
};

export default MapViewExploreScreen;