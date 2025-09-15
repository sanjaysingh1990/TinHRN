import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
import { Post } from '../src/features/gallery/domain/entities/Gallery';
import { GridItemShimmer } from '../src/features/gallery/presentation/components/GalleryShimmers';
import { GalleryViewModel } from '../src/features/gallery/presentation/viewmodels/GalleryViewModel';
import { useTheme } from '../src/hooks/useTheme';

const CategoryPostsScreen: React.FC = () => {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const { categoryId, categoryName } = useLocalSearchParams<{
    categoryId: string;
    categoryName: string;
  }>();
  
  const [galleryViewModel] = useState(() => container.resolve<GalleryViewModel>(GalleryViewModelToken));
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    loadCategoryPosts();
  }, [categoryId]);

  const loadCategoryPosts = async () => {
    setLoading(true);
    try {
      await galleryViewModel.loadGalleryData();
      // Filter posts by category - simulate getting posts for specific category
      const categoryPosts = galleryViewModel.recentUploads.filter(
        post => post.category === categoryName
      );
      // If no posts found for exact match, return some related posts
      if (categoryPosts.length === 0) {
        setPosts(galleryViewModel.recentUploads.slice(0, 6));
      } else {
        setPosts(categoryPosts);
      }
    } catch (error) {
      console.error('Error loading category posts:', error);
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

  const renderPostItem = ({ item }: { item: Post }) => (
    <TouchableOpacity 
      style={styles.postItem} 
      onPress={() => handlePostPress(item)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
      <View style={styles.postOverlay} />
      <View style={styles.postContent}>
        <View style={styles.postUserInfo}>
          <Image source={{ uri: item.userAvatar }} style={styles.postUserAvatar} />
          <Text style={[styles.postUserName, { color: '#FFFFFF' }]} numberOfLines={1}>
            {item.userName}
          </Text>
        </View>
        <View style={styles.postViewsOverlay}>
          <MaterialIcons name="visibility" size={14} color="#FFFFFF" />
          <Text style={styles.postViewsText}>{item.viewsCount.toLocaleString()}</Text>
        </View>
      </View>
      <View style={styles.postTitleContainer}>
        <Text style={[styles.postTitle, { color: '#FFFFFF' }]} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderPostShimmer = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.postItem}>
      <GridItemShimmer key={`post-shimmer-${index}`} />
    </View>
  );

  const renderLoadingGrid = () => (
    <FlatList
      data={Array.from({ length: 8 }, (_, i) => ({ id: `shimmer-${i}` }))}
      renderItem={renderPostShimmer}
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
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      fontFamily: 'SplineSans',
      textAlign: 'center',
      flex: 1,
      marginHorizontal: 16,
    },
    placeholder: {
      width: 40,
    },
    gridContainer: {
      padding: 16,
    },
    postItem: {
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
    postImage: {
      width: '100%',
      height: '100%',
    },
    postOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    postContent: {
      position: 'absolute',
      top: 12,
      left: 12,
      right: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    postUserInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    postUserAvatar: {
      width: 24,
      height: 24,
      borderRadius: 12,
      marginRight: 8,
    },
    postUserName: {
      fontSize: 12,
      fontWeight: '600',
      fontFamily: 'NotoSans',
      flex: 1,
    },
    postViewsOverlay: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      paddingHorizontal: 6,
      paddingVertical: 4,
      borderRadius: 10,
    },
    postViewsText: {
      color: '#FFFFFF',
      fontSize: 10,
      marginLeft: 4,
      fontWeight: '600',
    },
    postTitleContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 12,
    },
    postTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      fontFamily: 'SplineSans',
      lineHeight: 18,
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
        <Text style={styles.headerTitle} numberOfLines={1}>
          {categoryName || 'Category Posts'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Posts Grid */}
      {loading ? (
        renderLoadingGrid()
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPostItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default CategoryPostsScreen;