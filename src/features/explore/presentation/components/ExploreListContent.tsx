import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import container from '../../../../container';
import { useTheme } from '../../../../hooks/useTheme';
import { Category, Destination, ExploreData, TopTrek } from '../../domain/entities/Explore';
import { ExploreViewModelToken } from '../../explore.di';
import { ExploreViewModel } from '../viewmodels/ExploreViewModel';
import CategoryCard from './CategoryCard';
import CategoryShimmer from './CategoryShimmer';
import DestinationCard from './DestinationCard';
import DestinationShimmer from './DestinationShimmer';
import TrekCard from './TrekCard';
import TrekShimmer from './TrekShimmer';

const ExploreListContent: React.FC = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const [exploreData, setExploreData] = useState<ExploreData>({
    categories: [],
    popularDestinations: [],
    topTreks: []
  });
  const [isLoading, setIsLoading] = useState(true);

  const exploreViewModel = container.resolve<ExploreViewModel>(ExploreViewModelToken);

  useEffect(() => {
    loadExploreData();
  }, []);

  const loadExploreData = async () => {
    setIsLoading(true);
    try {
      const data = await exploreViewModel.getExploreData();
      setExploreData(data);
    } catch (error) {
      console.error('Error loading explore data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryPress = (category: Category) => {
    // Navigate to category specific screen
    console.log('Category pressed:', category.name);
  };

  const handleDestinationPress = (destination: Destination) => {
    // Navigate to destination details
    console.log('Destination pressed:', destination.name);
  };

  const handleTrekExplore = (trek: TopTrek) => {
    // Navigate to tour details screen
    router.push(`/tour/${trek.id}`);
  };

  const renderCategory = ({ item, index }: { item: Category | number; index: number }) => {
    if (isLoading) {
      return <CategoryShimmer key={`category-shimmer-${index}`} />;
    }
    return <CategoryCard category={item as Category} onPress={() => handleCategoryPress(item as Category)} />;
  };

  const renderDestination = ({ item, index }: { item: Destination | number; index: number }) => {
    if (isLoading) {
      return <DestinationShimmer key={`destination-shimmer-${index}`} />;
    }
    return <DestinationCard destination={item as Destination} onPress={() => handleDestinationPress(item as Destination)} />;
  };

  const renderTrek = ({ item, index }: { item: TopTrek | number; index: number }) => {
    if (isLoading) {
      return <TrekShimmer key={`trek-shimmer-${index}`} />;
    }
    return <TrekCard trek={item as TopTrek} onExplore={() => handleTrekExplore(item as TopTrek)} />;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContainer: {
      flex: 1,
    },
    section: {
      paddingHorizontal: 20,
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
      fontFamily: 'SplineSans',
    },
    categoriesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    categoryItem: {
      width: '48%',
      marginBottom: 16,
    },
    destinationsContainer: {
      paddingLeft: 0, // Align with heading
    },
    treksContainer: {
      paddingHorizontal: 0, // Align with heading
    },
  });

  const categoriesData = isLoading ? Array.from({ length: 4 }, (_, i) => i) : exploreData.categories;
  const destinationsData = isLoading ? Array.from({ length: 5 }, (_, i) => i) : exploreData.popularDestinations;
  const treksData = isLoading ? Array.from({ length: 5 }, (_, i) => i) : exploreData.topTreks;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesGrid}>
            {categoriesData.map((item, index) => (
              <View key={index} style={styles.categoryItem}>
                {renderCategory({ item, index })}
              </View>
            ))}
          </View>
        </View>

        {/* Popular Destinations Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Destinations</Text>
          <FlatList
            data={destinationsData}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderDestination}
            keyExtractor={(_, index) => `destination-${index}`}
            contentContainerStyle={styles.destinationsContainer}
          />
        </View>

        {/* Top Treks Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Treks</Text>
          <View style={styles.treksContainer}>
            {treksData.map((item, index) => (
              <View key={index}>
                {renderTrek({ item, index })}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ExploreListContent;