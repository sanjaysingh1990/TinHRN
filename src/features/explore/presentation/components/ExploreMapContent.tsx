import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import container from '../../../../container';
import { useTheme } from '../../../../hooks/useTheme';
import ExploreCardShimmer from './ExploreCardShimmer';
import { ExploreLocation, MapViewExploreScreenViewModel } from '../viewmodels/MapViewExploreScreenViewModel';

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
    },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 16,
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
      backgroundColor: isDarkMode ? '#1a1a1a' : '#f0f0f0',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
      marginHorizontal: 20,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.borderColor,
      borderStyle: 'dashed',
    },
    mapPlaceholder: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
      position: 'relative',
    },
    mapPlaceholderText: {
      fontSize: 16,
      color: colors.secondary,
      textAlign: 'center',
      marginTop: 12,
      fontFamily: 'NotoSans',
    },
    pulsatingMarker: {
      position: 'absolute',
      top: '40%',
      left: '50%',
      marginLeft: -8,
      marginTop: -8,
    },
    pulsatingDot: {
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: colors.primary,
      borderWidth: 2,
      borderColor: '#ffffff',
    },
    controls: {
      position: 'absolute',
      right: 16,
      top: '30%',
      flexDirection: 'column',
    },
    controlButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.cardBackgroundColor,
      borderWidth: 1,
      borderColor: colors.borderColor,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    bottomContainer: {
      paddingHorizontal: 20,
      paddingBottom: 20,
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

      {/* Map Placeholder */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <MaterialIcons name="map" size={48} color={colors.secondary} />
          <Text style={styles.mapPlaceholderText}>
            Map View{'\n'}(Install react-native-maps for full functionality)
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
    </View>
  );
};

export default ExploreMapContent;