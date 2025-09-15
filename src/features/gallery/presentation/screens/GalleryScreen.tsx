import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import container from '../../../../container';
import { useTheme } from '../../../../hooks/useTheme';
import { GalleryViewModelToken } from '../../data/di/tokens';
import { Category, Post } from '../../domain/entities/Gallery';
import { CategoryShimmer, FeaturedPostShimmer, GridItemShimmer } from '../components/GalleryShimmers';
import { GalleryViewModel } from '../viewmodels/GalleryViewModel';

const { width } = Dimensions.get('window');

const GalleryScreen: React.FC = () => {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const [galleryViewModel] = useState(() => container.resolve<GalleryViewModel>(GalleryViewModelToken));
  const [loading, setLoading] = useState(true);
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [recentUploads, setRecentUploads] = useState<Post[]>([]);

  useEffect(() => {
    loadGalleryData();
  }, []);

  const loadGalleryData = async () => {
    setLoading(true);
    try {
      await galleryViewModel.loadGalleryData();
      setFeaturedPost(galleryViewModel.featuredPost);
      setCategories(galleryViewModel.categories);
      setRecentUploads(galleryViewModel.recentUploads);
    } catch (error) {
      console.error('Error loading gallery data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostPress = (post: Post) => {
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

  const renderFeaturedPost = () => {
    if (loading) {
      return <FeaturedPostShimmer />;
    }

    if (!featuredPost) return null;

    return (
      <TouchableOpacity 
        style={[styles.featuredContainer, { backgroundColor: colors.cardBackgroundColor, borderColor: colors.primary }]}
        onPress={() => handlePostPress(featuredPost)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: featuredPost.imageUrl }} style={styles.featuredImage} />
        <View style={styles.featuredOverlay} />
        <View style={styles.featuredContent}>
          <View style={[styles.featuredTextContainer, { borderColor: colors.primary }]}>
            <Text style={[styles.featuredTitle, { color: '#FFFFFF' }]} numberOfLines={2}>
              {featuredPost.title}
            </Text>
            <Text style={[styles.featuredDescription, { color: '#F5F5F5' }]} numberOfLines={2}>
              {featuredPost.description}
            </Text>
          </View>
          <View style={styles.viewsOverlay}>
            <MaterialIcons name="visibility" size={16} color="#FFFFFF" />
            <Text style={styles.viewsText}>{featuredPost.viewsCount.toLocaleString()}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity style={styles.categoryItem} activeOpacity={0.7}>
      <Image source={{ uri: item.imageUrl }} style={styles.categoryImage} />
      <View style={styles.categoryOverlay} />
      <View style={styles.categoryTextContainer}>
        <Text style={[styles.categoryText, { color: '#FFFFFF' }]}>{item.name}</Text>
        <Text style={[styles.categoryCount, { color: '#F5F5F5' }]}>{item.postsCount} posts</Text>
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
    if (loading) {
      return renderCategoriesShimmer();
    }

    return (
      <FlatList
        data={categories}
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
    if (loading) {
      return renderGridShimmer();
    }

    return (
      <FlatList
        data={recentUploads}
        renderItem={renderGridItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        scrollEnabled={false}
        contentContainerStyle={styles.gridContainer}
      />
    );
  };

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
    moreButton: {
      padding: 8,
    },
    scrollContainer: {
      flex: 1,
    },
    featuredContainer: {
      borderRadius: 16,
      borderWidth: 2,
      borderStyle: 'dashed',
      overflow: 'hidden',
      marginHorizontal: 20,
      marginTop: 20, // Added top margin
      marginBottom: 24,
      aspectRatio: 1, // Changed from 4/3 to 1:1 ratio
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
      color: colors.text,
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
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Himalayan Gallery</Text>
        <TouchableOpacity style={styles.moreButton}>
          <MaterialIcons name="more-vert" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Featured Post */}
        {renderFeaturedPost()}

        {/* Categories Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity onPress={() => router.push('/category-full-view')} activeOpacity={0.7}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>
        {renderCategories()}

        {/* Recent Uploads Section */}
        <Text style={styles.sectionTitle}>Recent Uploads</Text>
        {renderGrid()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default GalleryScreen;