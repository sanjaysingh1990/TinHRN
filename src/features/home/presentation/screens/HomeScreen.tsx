import { MaterialIcons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import container from '../../../../container';
import { useTheme } from '../../../../hooks/useTheme';
import { Tour } from '../../domain/entities/Tour';
import { HomeViewModelToken } from '../../home.di';
import SearchBar from '../components/SearchBar';
import TourCardSkeleton from '../components/TourCardSkeleton';
import { HomeViewModel } from '../viewmodels/HomeViewModel';

import { useRouter } from 'expo-router';

import { StatusBar } from 'expo-status-bar';

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const { colors, colorScheme } = useTheme();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searching, setSearching] = useState(false);
  const page = useRef(1);
  const isFetching = useRef(false); // Prevent multiple simultaneous requests

  const homeViewModel = container.resolve<HomeViewModel>(HomeViewModelToken);

  const loadTours = () => {
    // Prevent multiple simultaneous requests
    if (isFetching.current) {
      console.log('loadTours skipped: already fetching');
      return;
    }
    
    if (!hasMore || loadingMore) {
      console.log(`loadTours skipped: hasMore=${hasMore}, loadingMore=${loadingMore}`);
      return;
    }

    isFetching.current = true;
    
    if (page.current === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    console.log(`Loading tours for page ${page.current}`);
    
    homeViewModel.getHotToursPaginated(page.current, 10).then(newTours => {
      console.log(`Received ${newTours.length} tours for page ${page.current}`);
      
      if (newTours.length === 0) {
        console.log('No more tours to load');
        setHasMore(false);
      } else {
        // Ensure no duplicate tours are added
        setTours(prevTours => {
          const existingIds = new Set(prevTours.map(tour => 
            typeof tour.id === 'number' ? tour.id.toString() : tour.id
          ));
          
          const uniqueNewTours = newTours.filter(tour => {
            const tourId = typeof tour.id === 'number' ? tour.id.toString() : tour.id;
            const isDuplicate = existingIds.has(tourId);
            if (isDuplicate) {
              console.log(`Duplicate tour found with ID: ${tourId}`);
            }
            return !isDuplicate;
          });
          
          console.log(`Adding ${uniqueNewTours.length} new unique tours`);
          return [...prevTours, ...uniqueNewTours];
        });
        page.current += 1;
        console.log(`Page incremented to ${page.current}`);
      }
      setLoading(false);
      setLoadingMore(false);
      isFetching.current = false;
    }).catch(error => {
      console.error('Error loading tours:', error);
      setLoading(false);
      setLoadingMore(false);
      isFetching.current = false;
    });
  };

  const handleSearch = (query: string) => {
    if (!query) {
      page.current = 1;
      setTours([]);
      setHasMore(true);
      loadTours();
      return;
    }
    setSearching(true);
    homeViewModel.searchTours(query).then(newTours => {
      setTours(newTours);
      setHasMore(false);
      setSearching(false);
    });
  };

  const refreshTours = () => {
    console.log('Refreshing tours');
    page.current = 1;
    setTours([]);
    setHasMore(true);
    isFetching.current = false; // Reset the fetching flag
    loadTours();
  };

  useEffect(() => {
    refreshTours();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 15,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginTop: 10,
    },
    notificationIcon: {
      position: 'absolute',
      right: 15,
    },
    heroSection: {
      height: 300,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 15,
      borderRadius: 12,
      overflow: 'hidden',
    },
    heroTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: 'center',
    },
    heroSubtitle: {
      fontSize: 16,
      color: '#FFFFFF',
      textAlign: 'center',
      marginTop: 10,
    },
    heroButton: {
      backgroundColor: colors.primary,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      marginTop: 20,
    },
    heroButtonText: {
      color: colors.background,
      fontWeight: 'bold',
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      margin: 15,
    },
    tourCard: {
      flex: 1,
      margin: 7.5,
      backgroundColor: colors.inputBackground,
      borderRadius: 12,
      overflow: 'hidden',
    },
    tourImage: {
      width: '100%',
      height: 150,
    },
    tourInfo: {
      flex: 1,
      padding: 10,
      justifyContent: 'space-between',
    },
    tourName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    tourDuration: {
      color: colors.secondary,
    },
    exploreButton: {
      backgroundColor: colors.primary,
      padding: 8,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 10,
    },
    exploreButtonText: {
      color: colors.background,
      fontWeight: 'bold',
    },
    footerLoader: {
      paddingVertical: 20,
    },
  });

  const renderHeader = useCallback(() => (
    <>
      <SearchBar onSearch={handleSearch} searching={searching} />
      <ImageBackground 
        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2R-D8bon07gNln5JYqh2DiwvqM5mD-4EtOIjoAPGd1e-IrwZseSxR8ONqLPRRLEQIturvHZWU1YaxJ4rQ04GAeWG_-1OroireJvI9p-tIbeYAr9-ryL9A0-ZhWhtaVzVlWyEf0B3BHjONWCgXJeA0h7UTbaSfTCYBP0y05epzqCjgkpxPQlwsocRiwiOcPDLzkcc8bz7RweQ2XS3mSt1ae7b_WqpaZTjeMw2a4YKn4LZQFS4CUzSVkehP3SQU99sezw5okLxauKCC' }}
        style={styles.heroSection}
      >
        <Text style={styles.heroTitle}>Discover the Himalayas</Text>
        <Text style={styles.heroSubtitle}>Your next adventure awaits</Text>
        <TouchableOpacity style={styles.heroButton}>
          <Text style={styles.heroButtonText}>Explore Now</Text>
        </TouchableOpacity>
      </ImageBackground>

      <Text style={styles.sectionTitle}>Hot Tours</Text>
    </>
  ), [searching, colors]);

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  const renderSkeleton = () => (
    <View style={{flex: 1, margin: 7.5}}>
      <TourCardSkeleton />
    </View>
  );

  const skeletonData: Tour[] = Array.from({ length: 10 }, (_, i) => ({ 
    id: i, 
    name: '', 
    duration: '', 
    image: '' 
  }));

  // Helper function to convert ID to string for keyExtractor
  const getKey = (item: Tour, index: number) => {
    const id = typeof item.id === 'number' ? item.id.toString() : item.id;
    return `${id}_${index}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={colorScheme === 'dark' ? "light" : "dark"} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tent'in Himalayas</Text>
        <TouchableOpacity style={styles.notificationIcon} onPress={() => router.push('/notifications')}>
          <MaterialIcons name="notifications-none" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={loading ? skeletonData : tours}
        numColumns={2}
        renderItem={({ item, index }) => (
          loading ? renderSkeleton() :
          <View style={styles.tourCard}>
            <Image source={{ uri: item.image }} style={styles.tourImage} />
            <View style={styles.tourInfo}>
              <View style={{flex: 1}}>
                <Text style={styles.tourName}>{item.name}</Text>
                <Text style={styles.tourDuration}>{item.duration}</Text>
              </View>
              <TouchableOpacity style={styles.exploreButton} onPress={() => router.push({
                pathname: '/tour/[id]',
                params: { id: typeof item.id === 'number' ? item.id.toString() : item.id, name: item.name, image: item.image }
              })}>
                <Text style={styles.exploreButtonText}>Explore</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => getKey(item, index)}
        contentContainerStyle={{ paddingHorizontal: 7.5 }}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        onEndReached={loadTours}
        onEndReachedThreshold={0.5}
        keyboardShouldPersistTaps="handled"
        refreshing={loading && page.current === 1}
        onRefresh={refreshTours}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;