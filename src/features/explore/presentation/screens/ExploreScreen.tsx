import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';
import { useViewModel } from '../../../../hooks/useViewModel';
import { Category, Destination, TopTrek } from '../../domain/entities/Explore';
import { ExploreViewModelToken } from '../../explore.di';
import ExploreCategories from '../components/ExploreCategories';
import ExploreDestinations from '../components/ExploreDestinations';
import ExploreHeader from '../components/ExploreHeader';
import ExploreTreks from '../components/ExploreTreks';
import { ExploreViewModel } from '../viewmodels/ExploreViewModel';

interface ExploreScreenProps {
  hideHeader?: boolean;
  onSearchPress?: () => void;
}

const ExploreScreen: React.FC<ExploreScreenProps> = ({ hideHeader = false, onSearchPress }) => {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const viewModel = useViewModel<ExploreViewModel>(ExploreViewModelToken);

  useEffect(() => {
    viewModel.loadExploreData();
  }, [viewModel]);

  const { exploreData, isLoading } = viewModel;

  const handleCategoryPress = (category: Category) => {
    console.log('Category pressed:', category.name);
  };

  const handleDestinationPress = (destination: Destination) => {
    console.log('Destination pressed:', destination.name);
  };

  const handleTrekExplore = (trek: TopTrek) => {
    router.push({
      pathname: '/tour/[id]',
      params: {
        id: trek.id,
        name: trek.name,
        image: trek.image
      }
    });
  };

  const handleSearchPress = () => {
    if (onSearchPress) {
      onSearchPress();
    } else {
      console.log('Search pressed');
    }
  };

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContainer: {
      flex: 1,
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ExploreHeader
        hideHeader={hideHeader}
        isDarkMode={isDarkMode}
        onSearchPress={handleSearchPress}
      />

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <ExploreCategories
          categories={exploreData.categories}
          isLoading={isLoading}
          onCategoryPress={handleCategoryPress}
        />

        <ExploreDestinations
          destinations={exploreData.popularDestinations}
          isLoading={isLoading}
          onDestinationPress={handleDestinationPress}
        />

        <ExploreTreks
          treks={exploreData.topTreks}
          isLoading={isLoading}
          onTrekExplore={handleTrekExplore}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExploreScreen;