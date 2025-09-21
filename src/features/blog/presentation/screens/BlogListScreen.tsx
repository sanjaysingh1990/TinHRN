import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import container from '../../../../container';
import { useTheme } from '../../../../hooks/useTheme';
import { BlogListViewModelToken } from '../../blog.di';
import { Blog } from '../../domain/models/Blog';
import { BlogListViewModel } from '../viewmodels/BlogListViewModel';

const BlogListScreen: React.FC = () => {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  
  // Local state for UI concerns (following the same pattern as HomeScreen)
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Get the ViewModel instance once and memoize it (fix for infinite loop)
  const blogListViewModel = useMemo(() => {
    console.log('[BlogListScreen] Creating blogListViewModel instance');
    return container.resolve<BlogListViewModel>(BlogListViewModelToken);
  }, []);

  // Load blogs function that uses the ViewModel for data fetching
  const loadBlogs = useCallback(async () => {
    console.log('[BlogListScreen] loadBlogs called');
    // Don't set loading to true when refreshing, only when initially loading
    if (!refreshing) {
      setLoading(true);
    }
    setError(null);
    
    try {
      console.log('[BlogListScreen] Calling blogListViewModel.fetchBlogs()');
      await blogListViewModel.fetchBlogs();
      console.log('[BlogListScreen] blogListViewModel.fetchBlogs completed, blogs count:', blogListViewModel.blogs.length);
      
      // Update local state with data from ViewModel
      setBlogs(blogListViewModel.blogs);
      setError(blogListViewModel.error);
    } catch (err) {
      console.error('[BlogListScreen] Error loading blogs:', err);
      setError('Failed to load blogs. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false); // Always set refreshing to false when done
      console.log('[BlogListScreen] loadBlogs finished, final state:', {
        loading: false,
        refreshing: false,
        blogsCount: blogs.length,
        hasError: !!error
      });
    }
  }, [blogListViewModel, refreshing]);

  useEffect(() => {
    console.log('[BlogListScreen] useEffect triggered');
    loadBlogs();
  }, [loadBlogs]);

  const onRefresh = useCallback(async () => {
    console.log('[BlogListScreen] onRefresh called');
    setRefreshing(true);
    await loadBlogs();
    console.log('[BlogListScreen] onRefresh completed');
  }, [loadBlogs]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderBlogCard = ({ item }: { item: Blog }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.inputBackground }]}
      onPress={() => router.push({
        pathname: '/blog/[id]',
        params: { id: item.id }
      })}
    >
      <View style={styles.imageContainer}>
        <ShimmerPlaceHolder
          visible={!!item.thumbnail}
          shimmerColors={isDarkMode ? ['#211911', '#332517', '#211911'] : ['#f8f7f6', '#e0dcd8', '#f8f7f6']}
          LinearGradient={LinearGradient}
        >
          <View style={styles.imagePlaceholder}>
            {item.thumbnail ? (
              <View style={styles.image} />
            ) : null}
          </View>
        </ShimmerPlaceHolder>
      </View>
      
      <View style={styles.contentContainer}>
        {item.tags && item.tags.length > 0 && (
          <View style={[styles.tag, { backgroundColor: '#cf7317' }]}>
            <Text style={styles.tagText}>{item.tags[0]}</Text>
          </View>
        )}
        
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        
        <Text style={[styles.excerpt, { color: colors.secondary }]} numberOfLines={3}>
          {item.excerpt}
        </Text>
        
        <View style={styles.footer}>
          <Text style={[styles.date, { color: colors.secondary }]}>
            {formatDate(item.createdAt)}
          </Text>
          <TouchableOpacity 
            style={styles.readMoreButton}
            onPress={() => router.push({
              pathname: '/blog/[id]',
              params: { id: item.id }
            })}
          >
            <Text style={[styles.readMoreText, { color: '#cf7317' }]}>Read More</Text>
            <MaterialIcons name="arrow-forward" size={16} color="#cf7317" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderShimmer = () => (
    <View style={[styles.card, { backgroundColor: colors.inputBackground }]}>
      <ShimmerPlaceHolder
        visible={false}
        shimmerColors={isDarkMode ? ['#211911', '#332517', '#211911'] : ['#f8f7f6', '#e0dcd8', '#f8f7f6']}
        LinearGradient={LinearGradient}
        style={styles.imagePlaceholder}
      />
      
      <View style={styles.contentContainer}>
        <ShimmerPlaceHolder
          visible={false}
          shimmerColors={isDarkMode ? ['#211911', '#332517', '#211911'] : ['#f8f7f6', '#e0dcd8', '#f8f7f6']}
          LinearGradient={LinearGradient}
          style={styles.shimmerTag}
        />
        
        <ShimmerPlaceHolder
          visible={false}
          shimmerColors={isDarkMode ? ['#211911', '#332517', '#211911'] : ['#f8f7f6', '#e0dcd8', '#f8f7f6']}
          LinearGradient={LinearGradient}
          style={styles.shimmerTitle}
        />
        
        <ShimmerPlaceHolder
          visible={false}
          shimmerColors={isDarkMode ? ['#211911', '#332517', '#211911'] : ['#f8f7f6', '#e0dcd8', '#f8f7f6']}
          LinearGradient={LinearGradient}
          style={styles.shimmerExcerpt}
        />
        
        <ShimmerPlaceHolder
          visible={false}
          shimmerColors={isDarkMode ? ['#211911', '#332517', '#211911'] : ['#f8f7f6', '#e0dcd8', '#f8f7f6']}
          LinearGradient={LinearGradient}
          style={styles.shimmerDate}
        />
      </View>
    </View>
  );

  // Show loading state only when we're actually loading and have no blogs
  if (loading && blogs.length === 0) {
    console.log('[BlogListScreen] Rendering shimmer/loading state');
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Blog</Text>
        </View>
        <FlatList
          data={[1, 2, 3, 4]}
          renderItem={renderShimmer}
          keyExtractor={(item) => item.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }

  if (error) {
    console.log('[BlogListScreen] Rendering error state');
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <MaterialIcons name="error-outline" size={48} color={isDarkMode ? '#ff6b6b' : '#ff4757'} />
        <Text style={[styles.errorText, { color: colors.text, marginBottom: 16 }]}>{error}</Text>
        <TouchableOpacity style={[styles.retryButton, { backgroundColor: '#cf7317' }]} onPress={loadBlogs}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  console.log('[BlogListScreen] Rendering blog list with', blogs.length, 'blogs');
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Blog</Text>
      </View>
      
      <FlatList
        data={blogs}
        renderItem={renderBlogCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="article" size={48} color={colors.secondary} />
            <Text style={[styles.emptyText, { color: colors.text }]}>No blogs available</Text>
          </View>
        }
      />
    </View>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    height: 180,
  },
  imagePlaceholder: {
    height: 180,
    width: '100%',
  },
  image: {
    height: 180,
    width: '100%',
    backgroundColor: '#e0e0e0',
  },
  contentContainer: {
    padding: 16,
  },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  excerpt: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  shimmerTag: {
    width: 60,
    height: 20,
    borderRadius: 4,
    marginBottom: 8,
  },
  shimmerTitle: {
    height: 20,
    width: '80%',
    marginBottom: 8,
  },
  shimmerExcerpt: {
    height: 16,
    width: '100%',
    marginBottom: 4,
  },
  shimmerDate: {
    height: 12,
    width: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 64,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 32,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default BlogListScreen;