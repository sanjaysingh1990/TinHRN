import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useI18n } from '../../../../hooks/useI18n';
import { useTheme } from '../../../../hooks/useTheme';
import { useViewModel } from '../../../../hooks/useViewModel';
import { Tour } from '../../domain/entities/Tour';
import { HomeViewModelToken } from '../../home.di';
import HomeHeader from '../components/HomeHeader';
import HomeHero from '../components/HomeHero';
import HomeTourCard from '../components/HomeTourCard';
import SearchBar from '../components/SearchBar';
import TourCardSkeleton from '../components/TourCardSkeleton';
import { HomeViewModel } from '../viewmodels/HomeViewModel';

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const { colors, colorScheme } = useTheme();
  const { t } = useI18n();
  const viewModel = useViewModel<HomeViewModel>(HomeViewModelToken);

  useEffect(() => {
    viewModel.loadTours();
  }, [viewModel]);

  const { tours, isLoading, loadingMore, hasMore } = viewModel;

  const handleSearchPress = () => {
    router.push('/search');
  };

  const refreshTours = () => {
    viewModel.refreshTours();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      margin: 15,
    },
    footerLoader: {
      paddingVertical: 20,
    },
    tourCardContainer: {
      flex: 1,
      margin: 7.5
    }
  });

  const renderHeader = useCallback(() => (
    <>
      <TouchableOpacity activeOpacity={0.9} onPress={handleSearchPress}>
        <View pointerEvents="none">
          <SearchBar onSearch={() => { }} searching={false} />
        </View>
      </TouchableOpacity>
      <HomeHero onExplorePress={() => router.push('/(tabs)/explore')} />
      <Text style={styles.sectionTitle}>{t('home.hotTours')}</Text>
    </>
  ), [colors, tours.length, isLoading]);

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator animating size="large" color={colors.primary} />
      </View>
    );
  };

  const renderSkeleton = () => (
    <View style={styles.tourCardContainer}>
      <TourCardSkeleton />
    </View>
  );

  const skeletonData: Tour[] = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    name: '',
    duration: '',
    image: ''
  }));

  const getKey = (item: Tour, index: number) => {
    const id = typeof item.id === 'number' ? item.id.toString() : item.id;
    return `${id}_${index}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style={colorScheme === 'dark' ? "light" : "dark"} />

      <HomeHeader onNotificationPress={() => router.push('/notifications')} />

      <FlatList
        data={isLoading && tours.length === 0 ? skeletonData : tours}
        numColumns={2}
        renderItem={({ item }) => (
          isLoading && tours.length === 0 ? renderSkeleton() :
            <HomeTourCard tour={item} />
        )}
        keyExtractor={(item, index) => getKey(item, index)}
        contentContainerStyle={{ paddingHorizontal: 7.5 }}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        onEndReached={() => viewModel.loadTours()}
        onEndReachedThreshold={0.5}
        keyboardShouldPersistTaps="handled"
        refreshing={isLoading && tours.length > 0}
        onRefresh={refreshTours}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;