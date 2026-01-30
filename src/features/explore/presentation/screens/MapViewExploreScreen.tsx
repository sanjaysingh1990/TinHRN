import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
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
let Polyline: any = null;
let isMapAvailable = false;

try {
  const maps = require('react-native-maps');
  MapView = maps.default;
  Marker = maps.Marker;
  Polyline = maps.Polyline;
  isMapAvailable = true;
  console.log('react-native-maps loaded successfully');
} catch (error) {
  console.warn('react-native-maps not available:', error);
  isMapAvailable = false;
}

import container from '../../../../container';
import { useTheme } from '../../../../hooks/useTheme';
import { MapViewExploreScreenViewModelToken } from '../../explore.di';
import ExploreCardShimmer from '../components/ExploreCardShimmer';
import { ExploreLocation, MapViewExploreScreenViewModel } from '../viewmodels/MapViewExploreScreenViewModel';
import ExploreFilterBottomSheet from './ExploreFilterBottomSheet';
import { FilterState } from './ExploreFilterViewModel';

const { width, height } = Dimensions.get('window');

interface MapViewExploreScreenProps {
  hideHeader?: boolean;
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

// Haversine formula to calculate distance between two coordinates in kilometers
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const MapViewExploreScreen: React.FC<MapViewExploreScreenProps> = ({ hideHeader = false }) => {
  const { colors, isDarkMode } = useTheme();

  const [viewModel] = useState(() => container.resolve<MapViewExploreScreenViewModel>(MapViewExploreScreenViewModelToken));
  const [loading, setLoading] = useState(true);
  const [exploreData, setExploreData] = useState<ExploreLocation[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<ExploreLocation | null>(null);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [showPath, setShowPath] = useState(false);
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

  // Request location permission and get current location
  const requestLocationPermission = async (): Promise<UserLocation | null> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'Please enable location permission to see distance and path to destinations.',
          [{ text: 'OK' }]
        );
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords: UserLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setUserLocation(coords);
      return coords;
    } catch (error) {
      console.warn('Error getting location:', error);
      Alert.alert('Location Error', 'Unable to get your current location.');
      return null;
    }
  };

  // Create styles object early
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    searchRow: {
      position: 'absolute',
      top: hideHeader ? 120 : 140,
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
      paddingVertical: 6,
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
    userLocationMarker: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: '#4285F4',
      borderWidth: 3,
      borderColor: '#ffffff',
      justifyContent: 'center',
      alignItems: 'center',
    },
    markerContainer: {
      padding: 6,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      flexDirection: 'row',
      alignItems: 'center',
    },
    markerDuration: {
      fontSize: 10,
      fontWeight: 'bold',
      marginLeft: 2,
      fontFamily: 'SplineSans',
    },
    bottomContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.background,
      paddingTop: 12,
      paddingBottom: 8,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      borderTopWidth: 1,
      borderTopColor: colors.borderColor,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 10,
      minHeight: 140,
      overflow: 'hidden',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 12,
      marginHorizontal: 20,
      fontFamily: 'SplineSans',
    },
    exploreCard: {
      width: 240,
      borderRadius: 12,
      borderWidth: 1,
      borderStyle: 'dashed',
      overflow: 'hidden',
    },
    cardImage: {
      width: '100%',
      height: 80,
      resizeMode: 'cover',
    },
    cardContent: {
      padding: 12,
    },
    cardTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 2,
      fontFamily: 'SplineSans',
    },
    cardDescription: {
      fontSize: 12,
      lineHeight: 16,
      fontFamily: 'NotoSans',
    },
    distanceBadge: {
      position: 'absolute',
      top: hideHeader ? 200 : 220,
      left: 20,
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      zIndex: 1000,
    },
    distanceText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: isDarkMode ? '#111714' : '#FFFFFF',
      marginLeft: 6,
      fontFamily: 'SplineSans',
    },
    clearPathButton: {
      marginLeft: 8,
      padding: 2,
    },
  });

  const handleFilterPress = () => {
    setShowFilterSheet(true);
  };

  const handleApplyFilters = (filters: FilterState) => {
    viewModel.applyFilters(filters);
    setShowFilterSheet(false);
  };

  const renderExploreCard = ({ item, index }: { item: ExploreLocation; index: number }) => (
    <TouchableOpacity
      style={[styles.exploreCard, {
        backgroundColor: colors.cardBackgroundColor,
        borderColor: selectedLocation?.id === item.id ? colors.primary : colors.borderColor,
        marginLeft: index === 0 ? 20 : 8,
        marginRight: index === exploreData.length - 1 ? 20 : 8,
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
        {selectedLocation?.id === item.id && distance !== null && (
          <Text style={[styles.cardDescription, { color: colors.primary, marginTop: 4 }]}>
            📍 {distance.toFixed(1)} km away
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const onMomentumScrollEnd = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / 256);
    if (exploreData[index]) {
      const location = exploreData[index];
      handleCardPress(location, index);
    }
  };

  const renderShimmerCard = ({ index }: { index: number }) => (
    <View style={{ marginLeft: index === 0 ? 20 : 8, marginRight: 8 }}>
      <ExploreCardShimmer key={`shimmer-${index}`} />
    </View>
  );

  const handleCardPress = async (location: ExploreLocation, index: number) => {
    setSelectedLocation(location);

    // Request location permission and get current location
    let currentLocation = userLocation;
    if (!currentLocation) {
      currentLocation = await requestLocationPermission();
    }

    // Calculate distance if we have user location
    if (currentLocation) {
      const dist = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        location.latitude,
        location.longitude
      );
      setDistance(dist);
      setShowPath(true);

      // Fit map to show both markers
      if (mapRef.current) {
        mapRef.current.fitToCoordinates(
          [
            { latitude: currentLocation.latitude, longitude: currentLocation.longitude },
            { latitude: location.latitude, longitude: location.longitude }
          ],
          {
            edgePadding: { top: 150, right: 50, bottom: 200, left: 50 },
            animated: true,
          }
        );
      }
    } else {
      // Without location, just animate to the destination
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }, 1000);
      }
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

  const handleLocationPress = async (location: ExploreLocation, index: number) => {
    await handleCardPress(location, index);
  };

  const clearPath = () => {
    setShowPath(false);
    setDistance(null);
    setSelectedLocation(null);
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

  const handleMyLocation = async () => {
    const location = await requestLocationPermission();
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }, 1000);
    }
  };

  const darkMapStyle = [
    {
      "elementType": "geometry",
      "stylers": [{ "color": "#212121" }]
    },
    {
      "elementType": "labels.icon",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#757575" }]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#212121" }]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [{ "color": "#757575" }]
    },
    {
      "featureType": "administrative.country",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#9e9e9e" }]
    },
    {
      "featureType": "administrative.land_parcel",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#bdbdbd" }]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#757575" }]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [{ "color": "#181818" }]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#616161" }]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#1b1b1b" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry.fill",
      "stylers": [{ "color": "#2c2c2c" }]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#8a8a8a" }]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [{ "color": "#373737" }]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [{ "color": "#3c3c3c" }]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry",
      "stylers": [{ "color": "#4e4e4e" }]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#616161" }]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#757575" }]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{ "color": "#000000" }]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#3d3d3d" }]
    }
  ];

  useEffect(() => {
    // Set up ViewModel callback
    viewModel.setUpdateCallback(() => {
      setLoading(viewModel.loading);
      setExploreData(viewModel.exploreData);
    });

    // Load data
    viewModel.loadExploreData();

    // Start pulsing animation for primary marker only if maps are available
    if (isMapAvailable) {
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
    }

    return () => {
      viewModel.reset();
    };
  }, []);

  // Check if MapView is available
  if (!isMapAvailable || !MapView || !Marker) {
    // Fallback to a simple map-like interface if maps are not available
    return (
      <SafeAreaView style={styles.container}>
        {!hideHeader && (
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={colors.background}
          />
        )}

        {/* Fallback Map Background */}
        <View style={{
          flex: 1,
          backgroundColor: isDarkMode ? '#2d3a2e' : '#e8f5e8',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <MaterialIcons name="map" size={100} color={colors.secondaryTextColor} />
          <Text style={{ color: colors.text, fontSize: 18, marginTop: 16 }}>Maps not available in Expo Go</Text>
          <Text style={{ color: colors.secondaryTextColor, fontSize: 14, marginTop: 8, textAlign: 'center', paddingHorizontal: 40 }}>
            Use "npx expo run:ios" or "npx expo run:android" for development build with Google Maps
          </Text>
        </View>

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
          <TouchableOpacity style={styles.filterButton} onPress={handleFilterPress}>
            <MaterialIcons name="tune" size={24} color={colors.text} />
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
              snapToInterval={256}
              contentContainerStyle={{ paddingRight: 20 }}
              decelerationRate="fast"
              snapToAlignment="start"
              onScrollToIndexFailed={() => { }}
            />
          )}
        </View>

        {/* Filter Bottom Sheet */}
        <ExploreFilterBottomSheet
          visible={showFilterSheet}
          onClose={() => setShowFilterSheet(false)}
          onApplyFilters={handleApplyFilters}
        />
      </SafeAreaView>
    );
  }

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
        customMapStyle={isDarkMode ? darkMapStyle : []}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={false}
        onPress={() => clearPath()}
      >
        {/* User location marker */}
        {userLocation && showPath && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.userLocationMarker}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' }} />
            </View>
          </Marker>
        )}

        {/* Path line between user and destination */}
        {userLocation && selectedLocation && showPath && Polyline && (
          <Polyline
            coordinates={[
              { latitude: userLocation.latitude, longitude: userLocation.longitude },
              { latitude: selectedLocation.latitude, longitude: selectedLocation.longitude }
            ]}
            strokeColor={colors.primary}
            strokeWidth={3}
            lineDashPattern={[10, 5]}
          />
        )}

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
            <View style={[
              styles.markerContainer,
              { backgroundColor: selectedLocation?.id === location.id ? colors.primary : colors.cardBackgroundColor }
            ]}>
              <MaterialIcons
                name="terrain"
                size={16}
                color={selectedLocation?.id === location.id ? (isDarkMode ? '#111714' : '#FFFFFF') : colors.primary}
              />
              {location.duration && (
                <Text style={[
                  styles.markerDuration,
                  { color: selectedLocation?.id === location.id ? (isDarkMode ? '#111714' : '#FFFFFF') : colors.text }
                ]}>
                  {location.duration}d
                </Text>
              )}
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
        <TouchableOpacity style={styles.filterButton} onPress={handleFilterPress}>
          <MaterialIcons name="tune" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Distance Badge */}
      {showPath && distance !== null && selectedLocation && (
        <View style={styles.distanceBadge}>
          <MaterialIcons name="directions" size={18} color={isDarkMode ? '#111714' : '#FFFFFF'} />
          <Text style={styles.distanceText}>{distance.toFixed(1)} km</Text>
          <TouchableOpacity style={styles.clearPathButton} onPress={clearPath}>
            <MaterialIcons name="close" size={16} color={isDarkMode ? '#111714' : '#FFFFFF'} />
          </TouchableOpacity>
        </View>
      )}

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
        <Text style={styles.sectionTitle}>
          {selectedLocation ? `📍 ${selectedLocation.title}` : 'Discover Places'}
        </Text>
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
            snapToInterval={256} // card width (240) + margin (16)
            contentContainerStyle={{ paddingRight: 20 }}
            decelerationRate="fast"
            snapToAlignment="start"
            onMomentumScrollEnd={onMomentumScrollEnd}
            onScrollToIndexFailed={() => { }} // Handle potential scroll errors gracefully
          />
        )}
      </View>

      {/* Filter Bottom Sheet */}
      <ExploreFilterBottomSheet
        visible={showFilterSheet}
        onClose={() => setShowFilterSheet(false)}
        onApplyFilters={handleApplyFilters}
      />
    </SafeAreaView>
  );
};

export default MapViewExploreScreen;