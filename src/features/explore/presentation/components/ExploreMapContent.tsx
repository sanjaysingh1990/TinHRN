import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import container from '../../../../container';
import { useTheme } from '../../../../hooks/useTheme';
import { ExploreLocation, MapViewExploreScreenViewModel } from '../viewmodels/MapViewExploreScreenViewModel';
import ExploreCardShimmer from './ExploreCardShimmer';

const { width, height } = Dimensions.get('window');

const ExploreMapContent: React.FC = () => {
  const { colors, isDarkMode } = useTheme();
  const [viewModel] = useState(() => container.resolve(MapViewExploreScreenViewModel));
  const [loading, setLoading] = useState(true);
  const [exploreData, setExploreData] = useState<ExploreLocation[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<ExploreLocation | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Animation for pulsating marker
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  // Mock region state for compatibility
  const [region, setRegion] = useState({
    latitude: 30.7316,
    longitude: 79.6089,
    latitudeDelta: 2.0,
    longitudeDelta: 2.0,
  });

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
          duration: 750, // 1.5 second total cycle / 2 = 0.75 seconds each direction
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 750, // 1.5 second total cycle / 2 = 0.75 seconds each direction
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
    // Mock animation - just update the selected location
    console.log('Selected location:', location.title);
  };

  const handleZoomIn = () => {
    // Mock zoom functionality
    setRegion(prev => ({
      ...prev,
      latitudeDelta: prev.latitudeDelta * 0.5,
      longitudeDelta: prev.longitudeDelta * 0.5,
    }));
  };

  const handleZoomOut = () => {
    // Mock zoom functionality
    setRegion(prev => ({
      ...prev,
      latitudeDelta: prev.latitudeDelta * 2,
      longitudeDelta: prev.longitudeDelta * 2,
    }));
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
    },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 160, // Adjusted to be below header
      paddingBottom: 16,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: 'transparent',
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
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
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
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    mapContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      flex: 1,
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    markerContainer: {
      position: 'absolute',
      zIndex: 100,
    },
    marker: {
      padding: 8,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: '#ffffff',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    controls: {
      position: 'absolute',
      right: 20,
      top: 240, // Positioned below search bar
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
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    bottomContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.background,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 100, // Extra padding for tab bar
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      borderTopWidth: 1,
      borderTopColor: colors.borderColor,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: -2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 10,
      maxHeight: 220, // Limit height to show more map
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
      fontFamily: 'SplineSans',
    },
    cardsContainer: {
      paddingLeft: 0,
    },
    exploreCard: {
      width: 280,
      borderRadius: 16,
      borderWidth: 1,
      borderStyle: 'dashed',
      marginRight: 16,
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
    <View style={styles.container}>
      {/* Full Screen Map Background */}
      <View style={styles.mapContainer}>
        <ImageBackground
          source={{
            uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
          }}
          style={styles.map}
          resizeMode="cover"
        >
          {/* Render location markers */}
          {exploreData.map((location, index) => (
            <TouchableOpacity
              key={location.id}
              style={[
                styles.markerContainer,
                {
                  left: `${20 + (index * 15)}%`,
                  top: `${30 + (index * 10)}%`,
                }
              ]}
              onPress={() => handleLocationPress(location)}
            >
              <Animated.View style={[
                styles.marker,
                {
                  backgroundColor: colors.primary,
                  transform: [{ scale: pulseAnimation }],
                }
              ]}>
                <MaterialIcons name="place" size={20} color={isDarkMode ? '#111714' : '#ffffff'} />
              </Animated.View>
            </TouchableOpacity>
          ))}
        </ImageBackground>

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

      {/* Search Row */}
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
    </View>
  );
};

export default ExploreMapContent;