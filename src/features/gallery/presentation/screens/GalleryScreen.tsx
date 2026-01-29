import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../../hooks/useTheme';
import { useViewModel } from '../../../../hooks/useViewModel';
import { GalleryViewModelToken } from '../../data/di/tokens';
import { Category, Post } from '../../domain/entities/Gallery';
import { CategoryShimmer, FeaturedPostShimmer, GridItemShimmer } from '../components/GalleryShimmers';
import { GalleryViewModel } from '../viewmodels/GalleryViewModel';

const { width } = Dimensions.get('window');

const GalleryScreen: React.FC = () => {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const viewModel = useViewModel<GalleryViewModel>(GalleryViewModelToken);

  useEffect(() => {
    viewModel.loadGalleryData();
  }, []);

  const handlePostPress = (post: Post) => {
    Haptics.selectionAsync();
    router.push({
      pathname: '/post-details',
      params: {
        postId: post.id,
        title: post.title,
        imageUrl: post.imageUrl,
        description: post.description,
        userName: post.userName,
        userAvatar: post.userAvatar,
        category: post.category,
        viewsCount: post.viewsCount.toString()
      }
    });
  };

  const handleCategoryPress = (category: Category) => {
    Haptics.selectionAsync();
    router.push({
      pathname: '/category-posts',
      params: {
        categoryId: category.id,
        categoryName: category.name
      }
    });
  };

  const handleAddPost = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/add-post');
  };

  const renderFeaturedPost = () => {
    if (viewModel.loading && !viewModel.featuredPost) {
      return <FeaturedPostShimmer />;
    }

    if (!viewModel.featuredPost) return null;

    return (
      <TouchableOpacity
        style={[styles.featuredContainer, { backgroundColor: colors.cardBackgroundColor, borderColor: colors.primary }]}
        onPress={() => handlePostPress(viewModel.featuredPost!)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: viewModel.featuredPost.imageUrl }} style={styles.featuredImage} />
        <View style={styles.featuredOverlay} />
        <View style={styles.featuredContent}>
          <View style={[styles.featuredTextContainer, { borderColor: colors.primary }]}>
            <Text style={[styles.featuredTitle, { color: '#FFFFFF' }]} numberOfLines={2}>
              {viewModel.featuredPost.title}
            </Text>
            <Text style={[styles.featuredDescription, { color: '#F5F5F5' }]} numberOfLines={2}>
              {viewModel.featuredPost.description}
            </Text>
          </View>
          <View style={styles.viewsOverlay}>
            <MaterialIcons name="visibility" size={16} color="#FFFFFF" />
            <Text style={styles.viewsText}>{viewModel.featuredPost.viewsCount.toLocaleString()}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      activeOpacity={0.7}
      onPress={() => handleCategoryPress(item)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.categoryImage} />
      <View style={styles.categoryOverlay} />
      <View style={styles.categoryTextContainer}>
        <Text style={[styles.categoryText, { color: '#FFFFFF' }]}>{item.name}</Text>
        <View style={styles.categoryCountContainer}>
          <MaterialIcons name="collections" size={12} color="#F5F5F5" />
          <Text style={[styles.categoryCount, { color: '#F5F5F5' }]}> {item.postsCount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategoriesShimmer = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
      {Array.from({ length: 5 }, (_, index) => (
        <CategoryShimmer key={`category-shimmer-${index}`} />
      ))}
    </ScrollView>
  );

  const renderCategories = () => {
    if (viewModel.loading && viewModel.categories.length === 0) {
      return renderCategoriesShimmer();
    }

    return (
      <FlatList
        data={viewModel.categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      />
    );
  };

  const renderGridItem = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => handlePostPress(item)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.gridImage} />
      <View style={styles.gridOverlay} />
      <View style={styles.gridUserInfo}>
        <Image source={{ uri: item.userAvatar }} style={styles.gridUserAvatar} />
        <Text style={[styles.gridUserName, { color: '#FFFFFF' }]} numberOfLines={1}>
          {item.userName}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderGridShimmer = () => (
    <View style={styles.gridContainer}>
      {Array.from({ length: 6 }, (_, index) => (
        <GridItemShimmer key={`grid-shimmer-${index}`} />
      ))}
    </View>
  );

  const renderGrid = () => {
    if (viewModel.loading && viewModel.recentUploads.length === 0) {
      return renderGridShimmer();
    }

    return (
      <FlatList
        data={viewModel.recentUploads}
        renderItem={renderGridItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        scrollEnabled={false}
        contentContainerStyle={styles.gridContainer}
      />
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.borderColor }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Himalayan Gallery</Text>
        <TouchableOpacity style={styles.moreButton}>
          <MaterialIcons name="more-vert" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Featured Post */}
        {renderFeaturedPost()}

        {/* Categories Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
          <TouchableOpacity onPress={() => router.push('/category-full-view')} activeOpacity={0.7}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>
        {renderCategories()}

        {/* Recent Uploads Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Uploads</Text>
        </View>
        {renderGrid()}
      </ScrollView>

      {/* Floating Plus Button */}
      <TouchableOpacity
        style={[styles.floatingButton, { backgroundColor: colors.primary }]}
        onPress={handleAddPost}
        activeOpacity={0.7}
      >
        <MaterialIcons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'SplineSans',
    marginTop: 10,
  },
  moreButton: {
    position: 'absolute',
    right: 20,
    bottom: 12,
  },
  scrollContainer: {
    flex: 1,
  },
  featuredContainer: {
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    overflow: 'hidden',
    marginTop: 20,
    marginBottom: 24,
    marginHorizontal: 'auto',
    alignSelf: 'center',
    width: width - 40,
    aspectRatio: 1,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  featuredContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 16,
  },
  featuredTextContainer: {
    borderLeftWidth: 3,
    borderStyle: 'dashed',
    paddingLeft: 12,
    maxWidth: '80%',
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'SplineSans',
  },
  featuredDescription: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: 'NotoSans',
  },
  viewsOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  viewsText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'SplineSans',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'NotoSans',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  categoryItem: {
    width: 144,
    height: 192,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
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
    padding: 12,
  },
  categoryCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'SplineSans',
  },
  categoryCount: {
    fontSize: 12,
    fontFamily: 'NotoSans',
  },
  gridContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  gridItem: {
    flex: 1,
    aspectRatio: 1,
    margin: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  gridUserInfo: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridUserAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  gridUserName: {
    fontSize: 10,
    fontWeight: '600',
    flex: 1,
    fontFamily: 'NotoSans',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default GalleryScreen;