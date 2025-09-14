
import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  TextInput
} from 'react-native';
import { theme } from '../../../../theme';
import { HomeViewModel } from '../viewmodels/HomeViewModel';
import { Tour } from '../../domain/entities/Tour';
import container from '../../../../container';
import { HomeViewModelToken } from '../../home.di';
import { MaterialIcons } from '@expo/vector-icons';
import TourCardSkeleton from '../components/TourCardSkeleton';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '../components/SearchBar';

const HomeScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = theme[colorScheme];
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const page = useRef(1);
  const [hasMore, setHasMore] = useState(true);
  const [searching, setSearching] = useState(false);

  const homeViewModel = container.resolve<HomeViewModel>(HomeViewModelToken);

  const loadTours = () => {
    if (!hasMore || loadingMore) return;

    if (page.current === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    homeViewModel.getHotToursPaginated(page.current, 10).then(newTours => {
      if (newTours.length === 0) {
        setHasMore(false);
      } else {
        setTours(prevTours => [...prevTours, ...newTours]);
        page.current += 1;
      }
      setLoading(false);
      setLoadingMore(false);
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

  useEffect(() => {
    loadTours();
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
      height: 200,
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
        source={{ uri: 'https://images.unsplash.com/photo-1604537466158-c3a759f4c3d7?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
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

  const skeletonData = Array.from({ length: 10 }, (_, i) => ({ id: `skeleton-${i}` }));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tent'in Himalayas</Text>
        <TouchableOpacity style={styles.notificationIcon}>
          <MaterialIcons name="notifications-none" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={loading ? skeletonData : tours}
        numColumns={2}
        renderItem={({ item }) => (
          loading ? renderSkeleton() :
          <View style={styles.tourCard}>
            <Image source={{ uri: item.image }} style={styles.tourImage} />
            <View style={styles.tourInfo}>
              <View style={{flex: 1}}>
                <Text style={styles.tourName}>{item.name}</Text>
                <Text style={styles.tourDuration}>{item.duration}</Text>
              </View>
              <TouchableOpacity style={styles.exploreButton}>
                <Text style={styles.exploreButtonText}>Explore</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 7.5 }}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        onEndReached={loadTours}
        onEndReachedThreshold={0.5}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
