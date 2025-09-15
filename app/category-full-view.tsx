import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import container from '../src/container';
import { GalleryViewModelToken } from '../src/features/gallery/data/di/tokens';
import { Category } from '../src/features/gallery/domain/entities/Gallery';
import { CategoryShimmer } from '../src/features/gallery/presentation/components/GalleryShimmers';
import { GalleryViewModel } from '../src/features/gallery/presentation/viewmodels/GalleryViewModel';
import { useTheme } from '../src/hooks/useTheme';

const CategoryFullViewScreen: React.FC = () => {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const [galleryViewModel] = useState(() => container.resolve<GalleryViewModel>(GalleryViewModelToken));
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      await galleryViewModel.loadGalleryData();
      setCategories(galleryViewModel.categories);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity style={styles.categoryItem} activeOpacity={0.7}>
      <Image source={{ uri: item.imageUrl }} style={styles.categoryImage} />
      <View style={styles.categoryOverlay} />
      <View style={styles.categoryTextContainer}>
        <Text style={[styles.categoryText, { color: '#FFFFFF' }]} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={[styles.categoryCount, { color: '#F5F5F5' }]}>
          {item.postsCount} posts
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryShimmer = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.categoryItem}>
      <CategoryShimmer key={`category-shimmer-${index}`} />
    </View>
  );

  const renderLoadingGrid = () => (
    <FlatList
      data={Array.from({ length: 8 }, (_, i) => ({ id: `shimmer-${i}` }))}
      renderItem={renderCategoryShimmer}
      keyExtractor={(item, index) => `shimmer-${index}`}
      numColumns={2}
      contentContainerStyle={styles.gridContainer}
      showsVerticalScrollIndicator={false}
    />
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      paddingTop: 40,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderColor,
    },
    backButton: {
      padding: 8,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      fontFamily: 'SplineSans',
    },
    placeholder: {
      width: 40,
    },
    gridContainer: {
      padding: 16,
    },
    categoryItem: {
      flex: 1,
      aspectRatio: 0.75,
      margin: 8,
      borderRadius: 16,
      overflow: 'hidden',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    categoryImage: {
      width: '100%',
      height: '100%',
    },
    categoryOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    categoryTextContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 16,
    },
    categoryText: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
      fontFamily: 'SplineSans',
    },
    categoryCount: {
      fontSize: 12,
      fontFamily: 'NotoSans',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Categories</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Categories Grid */}
      {loading ? (
        renderLoadingGrid()
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default CategoryFullViewScreen;