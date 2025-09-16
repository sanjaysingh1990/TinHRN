import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
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
  ImageBackground,
} from 'react-native';
import container from '../../../../container';
import { useTheme } from '../../../../hooks/useTheme';
import { MapViewExploreScreenViewModelToken } from '../../explore.di';
import ExploreCardShimmer from '../components/ExploreCardShimmer';
import { ExploreLocation, MapViewExploreScreenViewModel } from '../viewmodels/MapViewExploreScreenViewModel';

const { width } = Dimensions.get('window');

interface MapViewExploreScreenFallbackProps {
  hideHeader?: boolean;
}

const MapViewExploreScreenFallback: React.FC<MapViewExploreScreenFallbackProps> = ({ hideHeader = false }) => {
  const { colors, isDarkMode } = useTheme();
  const [viewModel] = useState(() => container.resolve<MapViewExploreScreenViewModel>(MapViewExploreScreenViewModelToken));
  const [loading, setLoading] = useState(true);
  const [exploreData, setExploreData] = useState<ExploreLocation[]>([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    // Set up ViewModel callback
    viewModel.setUpdateCallback(() => {
      setLoading(viewModel.loading);
      setExploreData(viewModel.exploreData);
    });

    // Load data
    viewModel.loadExploreData();

    return () => {
      viewModel.reset();
    };
  }, []);

  const renderExploreCard = ({ item, index }: { item: ExploreLocation; index: number }) => (
    <TouchableOpacity 
      style={[styles.exploreCard, { 
        backgroundColor: colors.cardBackgroundColor, 
        borderColor: colors.borderColor,
        marginLeft: index === 0 ? 20 : 0,
        marginRight: index === exploreData.length - 1 ? 20 : 16,
      }]}
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
    mapContainer: {
      flex: 1,
      position: 'relative',
    },
    mapPlaceholder: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    mapPlaceholderText: {
      fontSize: 18,
      color: colors.text,
      fontFamily: 'SplineSans',
      marginBottom: 8,
    },
    mapPlaceholderSubtext: {
      fontSize: 14,
      color: colors.secondaryTextColor,
      fontFamily: 'NotoSans',
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
    bottomContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.background,
      paddingTop: 20,
      paddingBottom: 10,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      borderTopWidth: 1,
      borderTopColor: colors.borderColor,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 10,
      minHeight: 200,
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
      
      {/* Map Container with Placeholder */}
      <View style={styles.mapContainer}>
        <ImageBackground
          source={{
            uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
          }}
          style={styles.mapPlaceholder}
          resizeMode="cover"
        >
          <View style={[{ backgroundColor: colors.background, padding: 20, borderRadius: 12, opacity: 0.9 }]}>
            <Text style={styles.mapPlaceholderText}>Map View</Text>
            <Text style={styles.mapPlaceholderSubtext}>Interactive map coming soon</Text>
          </View>
        </ImageBackground>
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
          />
        ) : (
          <FlatList
            data={exploreData}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderExploreCard}
            keyExtractor={(item) => item.id}
            snapToInterval={296}
            decelerationRate="fast"
            snapToAlignment="start"
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default MapViewExploreScreenFallback;