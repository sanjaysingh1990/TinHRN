import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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
import container from '../../../../container';
import { useTheme } from '../../../../hooks/useTheme';
import ExploreCardShimmer from '../components/ExploreCardShimmer';
import { ExploreLocation, MapViewExploreScreenViewModel } from '../viewmodels/MapViewExploreScreenViewModel';

const { width, height } = Dimensions.get('window');

const MapViewExploreScreen: React.FC = () => {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const [viewModel] = useState(() => container.resolve(MapViewExploreScreenViewModel));
  const [loading, setLoading] = useState(true);
  const [exploreData, setExploreData] = useState<ExploreLocation[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<ExploreLocation | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Animation for pulsating marker
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  // Default center location (Himalayas region)
  const defaultLocation = {
    latitude: 30.7316,
    longitude: 79.6089,
    latitudeDelta: 2.0,
    longitudeDelta: 2.0,
  };

  useEffect(() => {
    // Set up ViewModel callback
    viewModel.setUpdateCallback(() => {
      setLoading(viewModel.loading);
      setExploreData(viewModel.exploreData);
      setForceUpdate(prev => prev + 1);
    });

    // Load data
    viewModel.loadExploreData();

    // Start pulsing animation
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    pulse();

    return () => {
      viewModel.reset();
    };
  }, []);

  const handleLocationPress = (location: ExploreLocation) => {
    setSelectedLocation(location);
    // Map animation would go here when react-native-maps is installed
  };

  const handleZoomIn = () => {
    // Implementation for zoom in
  };

  const handleZoomOut = () => {
    // Implementation for zoom out
  };

  const renderExploreCard = ({ item }: { item: ExploreLocation }) => (
    <TouchableOpacity 
      style={[styles.exploreCard, { backgroundColor: colors.cardBackgroundColor, borderColor: colors.borderColor }]}
      onPress={() => handleLocationPress(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.cardDescription, { color: colors.secondary }]} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderShimmerCard = ({ index }: { index: number }) => (
    <ExploreCardShimmer key={`shimmer-${index}`} />
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: colors.background,
      paddingTop: 50,
      paddingHorizontal: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderColor,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.cardBackgroundColor,
      borderWidth: 1,
      borderColor: colors.borderColor,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    headerTitle: {
      flex: 1,
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      fontFamily: 'SplineSans',
    },
    navigationButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    searchContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.inputBackground,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginRight: 12,
      borderWidth: 1,
      borderColor: colors.borderColor,
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
    },
    mapContainer: {
      flex: 1,
      marginTop: 140, // Space for header
      backgroundColor: isDarkMode ? '#1a1a1a' : '#f0f0f0',
      justifyContent: 'center',
      alignItems: 'center',
    },
    mapPlaceholder: {
      width: '90%',
      height: '80%',
      borderRadius: 16,
      backgroundColor: colors.cardBackgroundColor,
      borderWidth: 2,
      borderColor: colors.borderColor,
      borderStyle: 'dashed',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    mapPlaceholderText: {
      fontSize: 16,
      color: colors.secondary,
      fontFamily: 'NotoSans',
      textAlign: 'center',
      marginTop: 12,
    },
    controls: {
      position: 'absolute',
      right: 20,
      top: 200,
      zIndex: 1000,
    },
    controlButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.borderColor,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    pulsatingMarker: {
      position: 'absolute',
      top: '45%',
      left: '45%',
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    pulsatingDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: isDarkMode ? '#111714' : '#ffffff',
    },
    bottomContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.borderColor,
      paddingTop: 20,
      paddingBottom: 30,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
      paddingHorizontal: 20,
      fontFamily: 'SplineSans',
    },
    cardsContainer: {
      paddingLeft: 20,
    },
    exploreCard: {
      width: 280,
      height: 160,
      borderRadius: 16,
      borderWidth: 1,
      borderStyle: 'dashed',
      marginRight: 16,
      overflow: 'hidden',
      padding: 16,
    },
    cardImage: {
      width: '100%',
      height: 80,
      borderRadius: 12,
      marginBottom: 12,
    },
    cardContent: {
      flex: 1,
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
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Explore Map</Text>
          <TouchableOpacity style={styles.navigationButton}>
            <MaterialIcons name="navigation" size={20} color={isDarkMode ? '#111714' : '#ffffff'} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={20} color={colors.secondary} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search locations..."
              placeholderTextColor={colors.secondary}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <MaterialIcons name="tune" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <MaterialIcons name="map" size={48} color={colors.secondary} />
          <Text style={styles.mapPlaceholderText}>
            Map View\n(Install react-native-maps for full functionality)
          </Text>
          
          {/* Pulsating center marker */}
          <Animated.View style={[styles.pulsatingMarker, { transform: [{ scale: pulseAnimation }] }]}>
            <View style={styles.pulsatingDot} />
          </Animated.View>
          
          {/* Sample location markers */}
          {exploreData.slice(0, 3).map((location, index) => (
            <TouchableOpacity
              key={location.id}
              style={{
                position: 'absolute',
                top: `${30 + index * 15}%`,
                left: `${40 + index * 10}%`,
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor: colors.primary,
                borderWidth: 2,
                borderColor: '#ffffff',
              }}
              onPress={() => handleLocationPress(location)}
            />
          ))}
        </View>

        {/* Zoom Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={handleZoomIn}>
            <MaterialIcons name="add" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={handleZoomOut}>
            <MaterialIcons name="remove" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
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
            contentContainerStyle={styles.cardsContainer}
          />
        ) : (
          <FlatList
            data={exploreData}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderExploreCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.cardsContainer}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default MapViewExploreScreen;