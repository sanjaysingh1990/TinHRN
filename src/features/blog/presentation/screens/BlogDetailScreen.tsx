import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import WebView from 'react-native-webview';
import container from '../../../../container';
import { useTheme } from '../../../../hooks/useTheme';
import { BlogDetailViewModelToken } from '../../blog.di';
import { BlogDetailViewModel } from '../viewmodels/BlogDetailViewModel';

const { width } = Dimensions.get('window');

const BlogDetailScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colors, isDarkMode } = useTheme();
  
  // Local state for UI concerns
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blog, setBlog] = useState<any>(null);
  const [content, setContent] = useState<any>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [webViewHeight, setWebViewHeight] = useState(200); // Default height

  // Refs
  const webViewRef = useRef<WebView>(null);

  // Get the ViewModel instance once and memoize it (fix for infinite loop)
  const blogDetailViewModel = useMemo(() => {
    console.log('[BlogDetailScreen] Creating blogDetailViewModel instance');
    return container.resolve<BlogDetailViewModel>(BlogDetailViewModelToken);
  }, []);

  useEffect(() => {
    console.log('[BlogDetailScreen] useEffect called with id:', id);
    if (id) {
      loadBlogDetail(id as string);
    } else {
      console.log('[BlogDetailScreen] No id provided');
    }
  }, [id]);

  const loadBlogDetail = useCallback(async (blogId: string) => {
    console.log('[BlogDetailScreen] loadBlogDetail called with blogId:', blogId);
    setLoading(true);
    setError(null);
    
    try {
      await blogDetailViewModel.fetchBlogDetail(blogId);
      console.log('[BlogDetailScreen] fetchBlogDetail completed. Blog:', blogDetailViewModel.blog, 'Content:', blogDetailViewModel.content);
      
      // Update local state with data from ViewModel
      setBlog(blogDetailViewModel.blog);
      setContent(blogDetailViewModel.content);
      setError(blogDetailViewModel.error);
    } catch (err) {
      console.error('[BlogDetailScreen] Error loading blog detail:', err);
      setError('Failed to load blog details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [blogDetailViewModel]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const openYouTubeVideo = (videoId: string) => {
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    Linking.openURL(youtubeUrl).catch(() => {
      // Fallback if YouTube app is not installed
      const webUrl = `https://www.youtube.com/embed/${videoId}`;
      Linking.openURL(webUrl);
    });
  };

  // Function to handle WebView height changes
  const onWebViewMessage = (event: any) => {
    try {
      const height = parseInt(event.nativeEvent.data, 10);
      if (!isNaN(height)) {
        setWebViewHeight(Math.max(height, 200)); // Minimum height of 200
      }
    } catch (error) {
      console.log('Error parsing WebView height:', error);
    }
  };

  if (loading) {
    console.log('[BlogDetailScreen] Rendering loading state');
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Add top padding for back button */}
        <View style={[styles.header, { paddingTop: 10 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <ShimmerPlaceHolder
            visible={false}
            shimmerColors={isDarkMode ? ['#211911', '#332517', '#211911'] : ['#f8f7f6', '#e0dcd8', '#f8f7f6']}
            LinearGradient={LinearGradient}
            style={styles.bannerImage}
          />
          
          <View style={styles.contentContainer}>
            <ShimmerPlaceHolder
              visible={false}
              shimmerColors={isDarkMode ? ['#211911', '#332517', '#211911'] : ['#f8f7f6', '#e0dcd8', '#f8f7f6']}
              LinearGradient={LinearGradient}
              style={styles.shimmerTitle}
            />
            
            <View style={styles.tagsContainer}>
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
                style={styles.shimmerDate}
              />
            </View>
            
            <ShimmerPlaceHolder
              visible={false}
              shimmerColors={isDarkMode ? ['#211911', '#332517', '#211911'] : ['#f8f7f6', '#e0dcd8', '#f8f7f6']}
              LinearGradient={LinearGradient}
              style={styles.shimmerDescription}
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  if (error) {
    console.log('[BlogDetailScreen] Rendering error state:', error);
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <MaterialIcons name="error-outline" size={48} color={isDarkMode ? '#ff6b6b' : '#ff4757'} />
        <Text style={[styles.errorText, { color: colors.text, marginBottom: 16 }]}>{error}</Text>
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: '#cf7317' }]} 
          onPress={() => loadBlogDetail(id as string)}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!blog || !content) {
    console.log('[BlogDetailScreen] Rendering not found state. Blog:', blog, 'Content:', content);
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <MaterialIcons name="article" size={48} color={colors.secondary} />
        <Text style={[styles.errorText, { color: colors.text }]}>Blog not found</Text>
      </View>
    );
  }

  // HTML content with JavaScript to communicate height
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 16px;
          color: ${colors.text};
          background-color: ${colors.background};
        }
        img {
          max-width: 100%;
          height: auto;
        }
        a {
          color: #cf7317;
        }
      </style>
    </head>
    <body>
      <div id="content">${content.description}</div>
      <script>
        setTimeout(function() {
          const content = document.getElementById('content');
          if (content) {
            const height = Math.max(content.scrollHeight, content.offsetHeight, content.clientHeight);
            window.ReactNativeWebView.postMessage(height.toString());
          }
        }, 500);
      </script>
    </body>
    </html>
  `;

  console.log('[BlogDetailScreen] Rendering content state. Blog:', blog, 'Content:', content);
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Add top padding for back button */}
      <View style={[styles.header, { paddingTop: 50 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Banner Image */}
        <View style={styles.bannerImage}>
          <Image 
            source={{ uri: blog.thumbnail }} 
            style={styles.bannerImage} 
            resizeMode="cover"
          />
        </View>
        
        <View style={styles.contentContainer}>
          {/* Title */}
          <Text style={[styles.title, { color: colors.text }]}>{blog.title}</Text>
          
          {/* Tags - Show all tags instead of just the first one */}
          {blog.tags && blog.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {blog.tags.map((tag: string, index: number) => (
                <View key={index} style={[styles.tag, { backgroundColor: '#cf7317' }]}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
          
          {/* Date */}
          <Text style={[styles.date, { color: colors.secondary }]}>{formatDate(blog.createdAt)}</Text>
          
          {/* Description - Properly render HTML content with dynamic height */}
          <View style={styles.descriptionContainer}>
            <WebView
              ref={webViewRef}
              originWhitelist={['*']}
              source={{ html: htmlContent }}
              style={[styles.webView, { height: webViewHeight }]}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              onMessage={onWebViewMessage}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              scalesPageToFit={false}
              bounces={false}
              automaticallyAdjustContentInsets={false}
            />
          </View>
          
          {/* Images Carousel */}
          {content.images && content.images.length > 0 && (
            <View style={styles.imagesSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Gallery</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                onScroll={(event) => {
                  const index = Math.round(event.nativeEvent.contentOffset.x / (width - 32));
                  setActiveImageIndex(index);
                }}
              >
                {content.images.map((image: string, index: number) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image source={{ uri: image }} style={styles.carouselImage} resizeMode="cover" />
                  </View>
                ))}
              </ScrollView>
              
              {/* Image Indicators */}
              <View style={styles.indicatorsContainer}>
                {content.images.map((_: any, index: number) => (
                  <View 
                    key={index} 
                    style={[
                      styles.indicator, 
                      { 
                        backgroundColor: index === activeImageIndex ? '#cf7317' : colors.secondary 
                      }
                    ]} 
                  />
                ))}
              </View>
            </View>
          )}
          
          {/* YouTube Video */}
          {content.youtubeVideoId && (
            <TouchableOpacity 
              style={[styles.videoContainer, { backgroundColor: colors.inputBackground }]}
              onPress={() => openYouTubeVideo(content.youtubeVideoId!)}
            >
              <MaterialIcons name="play-circle-filled" size={48} color="#cf7317" />
              <Text style={[styles.videoText, { color: colors.text }]}>Watch Video</Text>
              <MaterialIcons name="open-in-new" size={20} color={colors.secondary} />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    padding: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    // Add shadow for better visibility
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scrollContent: {
    // Add bottom padding for the watch video section
    paddingBottom: 30,
  },
  bannerImage: {
    width: '100%',
    height: 250,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  date: {
    fontSize: 14,
    marginBottom: 16,
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  webView: {
    width: '100%',
    minHeight: 200,
  },
  imagesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  imageContainer: {
    width: width - 32,
    height: 200,
    marginRight: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  indicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  videoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    // Add shadow for better visibility
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  videoText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  shimmerTitle: {
    height: 30,
    width: '80%',
    marginBottom: 16,
  },
  shimmerTag: {
    width: 60,
    height: 20,
    borderRadius: 4,
    marginBottom: 8,
  },
  shimmerDate: {
    height: 16,
    width: 120,
  },
  shimmerDescription: {
    height: 200,
    width: '100%',
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

export default BlogDetailScreen;