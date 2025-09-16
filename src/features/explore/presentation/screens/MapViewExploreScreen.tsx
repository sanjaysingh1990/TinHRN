import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// Dynamic import for react-native-maps to avoid module errors
let MapView: any = null;
let Marker: any = null;

try {
  const maps = require('react-native-maps');
  MapView = maps.default;
  Marker = maps.Marker;
} catch (error) {
  console.warn('react-native-maps not available:', error);
}

import container from '../../../../container';
import { useTheme } from '../../../../hooks/useTheme';
import { MapViewExploreScreenViewModelToken } from '../../explore.di';
import ExploreCardShimmer from '../components/ExploreCardShimmer';
import { ExploreLocation, MapViewExploreScreenViewModel } from '../viewmodels/MapViewExploreScreenViewModel';

const { width, height } = Dimensions.get('window');

interface MapViewExploreScreenProps {
  hideHeader?: boolean;
}

const MapViewExploreScreen: React.FC<MapViewExploreScreenProps> = ({ hideHeader = false }) => {
  const { colors, isDarkMode } = useTheme();
  
  // Check if MapView is available
  if (!MapView || !Marker) {
    // Fallback to a simple error component if maps are not available
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Text style={{ color: colors.text, fontSize: 18 }}>Maps not available</Text>
        <Text style={{ color: colors.secondaryTextColor, fontSize: 14, marginTop: 8 }}>Please use development build</Text>
      </SafeAreaView>
    );
  }
  
  const [viewModel] = useState(() => container.resolve<MapViewExploreScreenViewModel>(MapViewExploreScreenViewModelToken));
  const [loading, setLoading] = useState(true);
  const [exploreData, setExploreData] = useState<ExploreLocation[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<ExploreLocation | null>(null);
  const mapRef = useRef<any>(null);
  
  // Animation for pulsating marker
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const flatListRef = useRef<FlatList>(null);

  // Initial region centered on Nepal/Himalayas
  const [region, setRegion] = useState({
    latitude: 28.3949,
    longitude: 84.1240,
    latitudeDelta: 3.0,
    longitudeDelta: 3.0,
  });

  useEffect(() => {
    // Set up ViewModel callback
    viewModel.setUpdateCallback(() => {
      setLoading(viewModel.loading);
      setExploreData(viewModel.exploreData);
    });

    // Load data
    viewModel.loadExploreData();

    // Start pulsing animation for primary marker
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.5,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    pulse();

    return () => {
      viewModel.reset();
    };
  }, []);

  const handleLocationPress = (location: ExploreLocation, index: number) => {
    setSelectedLocation(location);
    
    // Animate map to location
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      }, 1000);
    }

    // Scroll to corresponding card
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ 
        index, 
        animated: true,
        viewPosition: 0.5 
      });
    }
  };

  const handleCardPress = (location: ExploreLocation, index: number) => {
    handleLocationPress(location, index);
  };

  const handleZoomIn = () => {
    // Simplified zoom - use region-based approach for Expo compatibility
    if (mapRef.current) {
      const newRegion = {
        ...region,
        latitudeDelta: region.latitudeDelta * 0.5,
        longitudeDelta: region.longitudeDelta * 0.5,
      };
      setRegion(newRegion);
      mapRef.current.animateToRegion(newRegion, 300);
    }
  };

  const handleZoomOut = () => {
    // Simplified zoom - use region-based approach for Expo compatibility
    if (mapRef.current) {
      const newRegion = {
        ...region,
        latitudeDelta: Math.min(region.latitudeDelta * 2, 10),
        longitudeDelta: Math.min(region.longitudeDelta * 2, 10),
      };
      setRegion(newRegion);
      mapRef.current.animateToRegion(newRegion, 300);
    }
  };

  const handleMyLocation = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(region, 1000);
    }
  };

  const renderExploreCard = ({ item, index }: { item: ExploreLocation; index: number }) => (
    <TouchableOpacity 
      style={[styles.exploreCard, { 
        backgroundColor: colors.cardBackgroundColor, 
        borderColor: colors.borderColor,
        marginLeft: index === 0 ? 20 : 0,
        marginRight: index === exploreData.length - 1 ? 20 : 16,
      }]}
      onPress={() => handleCardPress(item, index)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.cardDescription, { color: colors.secondaryTextColor }]} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderShimmerCard = ({ index }: { index: number }) => (
    <View style={{ marginLeft: index === 0 ? 20 : 0, marginRight: 16 }}>
      <ExploreCardShimmer key={`shimmer-${index}`} />
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    map: {
      flex: 1,
    },
    searchRow: {
      position: 'absolute',
      top: hideHeader ? 60 : 100,
      left: 20,
      right: 20,
      flexDirection: 'row',
      alignItems: 'center',
      zIndex: 1000,
    },
    searchContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardBackgroundColor,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginRight: 12,
      borderWidth: 1,
      borderColor: colors.borderColor,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      fontFamily: 'NotoSans',
    },
    filterButton: {
      width: 48,
      height: 48,
      borderRadius: 12,
      backgroundColor: colors.cardBackgroundColor,
      borderWidth: 1,
      borderColor: colors.borderColor,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    controls: {
      position: 'absolute',
      right: 20,
      top: hideHeader ? 180 : 220,
      flexDirection: 'column',
      zIndex: 1000,
    },
    controlButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.cardBackgroundColor,
      borderWidth: 1,
      borderColor: colors.borderColor,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    primaryMarker: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.primary,
      borderWidth: 3,
      borderColor: '#ffffff',
      justifyContent: 'center',
      alignItems: 'center',
    },
    secondaryMarker: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.secondary,
      borderWidth: 2,
      borderColor: '#ffffff',
      justifyContent: 'center',
      alignItems: 'center',
    },
    bottomContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.background,
      paddingTop: 20,
      paddingBottom: 100,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      borderTopWidth: 1,
      borderTopColor: colors.borderColor,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 10,
      maxHeight: 220,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
      marginHorizontal: 20,
      fontFamily: 'SplineSans',
    },
    exploreCard: {
      width: 280,
      borderRadius: 16,
      borderWidth: 1,
      borderStyle: 'dashed',
      overflow: 'hidden',
    },
    cardImage: {
      width: '100%',
      height: 120,
      resizeMode: 'cover',
    },
    cardContent: {
      padding: 16,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
      fontFamily: 'SplineSans',
    },
    cardDescription: {
      fontSize: 12,
      lineHeight: 16,
      fontFamily: 'NotoSans',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {!hideHeader && (
        <StatusBar 
          barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
          backgroundColor={colors.background}
        />
      )}
      
      {/* Google Maps */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={false}
        onPress={() => setSelectedLocation(null)}
      >
        {/* Primary pulsating marker at center */}
        <Marker
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <Animated.View 
            style={[
              styles.primaryMarker,
              { transform: [{ scale: pulseAnimation }] }
            ]}
          >
            <MaterialIcons 
              name="place" 
              size={16} 
              color={isDarkMode ? '#171511' : '#ffffff'} 
            />
          </Animated.View>
        </Marker>

        {/* Secondary markers for explore locations */}
        {exploreData.map((location, index) => (
          <Marker
            key={location.id}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            onPress={() => handleLocationPress(location, index)}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.secondaryMarker}>
              <MaterialIcons 
                name="explore" 
                size={12} 
                color={isDarkMode ? '#171511' : '#ffffff'} 
              />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Search Bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <MaterialIcons 
            name="search" 
            size={20} 
            color={colors.secondaryTextColor} 
            style={{ marginRight: 8 }} 
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search locations..."
            placeholderTextColor={colors.secondaryTextColor}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <MaterialIcons name="tune" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Zoom Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={handleZoomIn}>
          <MaterialIcons name="add" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={handleZoomOut}>
          <MaterialIcons name="remove" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={handleMyLocation}>
          <MaterialIcons name="my-location" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Bottom Cards */}
      <View style={styles.bottomContainer}>
        <Text style={styles.sectionTitle}>Discover Places</Text>
        {loading ? (
          <FlatList
            data={Array.from({ length: 3 }, (_, i) => i)}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderShimmerCard}
            keyExtractor={(_, index) => `shimmer-${index}`}
          />
        ) : (
          <FlatList
            ref={flatListRef}
            data={exploreData}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderExploreCard}
            keyExtractor={(item) => item.id}
            snapToInterval={296} // card width (280) + margin (16)
            decelerationRate="fast"
            snapToAlignment="start"
            onScrollToIndexFailed={() => {}} // Handle potential scroll errors gracefully
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default MapViewExploreScreen;