import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
  const [viewModel] = useState(() => container.resolve<BlogDetailViewModel>(BlogDetailViewModelToken));
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    console.log('[BlogDetailScreen] useEffect called with id:', id);
    if (id) {
      loadBlogDetail(id as string);
    } else {
      console.log('[BlogDetailScreen] No id provided');
    }
  }, [id]);

  const loadBlogDetail = async (blogId: string) => {
    console.log('[BlogDetailScreen] loadBlogDetail called with blogId:', blogId);
    await viewModel.fetchBlogDetail(blogId);
    console.log('[BlogDetailScreen] loadBlogDetail completed. Loading:', viewModel.loading, 'Error:', viewModel.error);
  };

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

  if (viewModel.loading) {
    console.log('[BlogDetailScreen] Rendering loading state');
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        <ScrollView showsVerticalScrollIndicator={false}>
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
            
            <View style={styles.metaContainer}>
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

  if (viewModel.error) {
    console.log('[BlogDetailScreen] Rendering error state:', viewModel.error);
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <MaterialIcons name="error-outline" size={48} color={isDarkMode ? '#ff6b6b' : '#ff4757'} />
        <Text style={[styles.errorText, { color: colors.text, marginBottom: 16 }]}>{viewModel.error}</Text>
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: '#cf7317' }]} 
          onPress={() => loadBlogDetail(id as string)}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!viewModel.blog || !viewModel.content) {
    console.log('[BlogDetailScreen] Rendering not found state. Blog:', viewModel.blog, 'Content:', viewModel.content);
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <MaterialIcons name="article" size={48} color={colors.secondary} />
        <Text style={[styles.errorText, { color: colors.text }]}>Blog not found</Text>
      </View>
    );
  }

  console.log('[BlogDetailScreen] Rendering content state. Blog:', viewModel.blog, 'Content:', viewModel.content);
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner Image */}
        <View style={styles.bannerImage}>
          <Image 
            source={{ uri: viewModel.blog.thumbnail }} 
            style={styles.bannerImage} 
            resizeMode="cover"
          />
        </View>
        
        <View style={styles.contentContainer}>
          {/* Title */}
          <Text style={[styles.title, { color: colors.text }]}>{viewModel.blog.title}</Text>
          
          {/* Meta Info */}
          <View style={styles.metaContainer}>
            {viewModel.blog.tags && viewModel.blog.tags.length > 0 && (
              <View style={[styles.tag, { backgroundColor: '#cf7317' }]}>
                <Text style={styles.tagText}>{viewModel.blog.tags[0]}</Text>
              </View>
            )}
            <Text style={[styles.date, { color: colors.secondary }]}>{formatDate(viewModel.blog.createdAt)}</Text>
          </View>
          
          {/* Description */}
          <View style={styles.descriptionContainer}>
            <WebView
              originWhitelist={['*']}
              source={{ html: `<div style="color: ${colors.text}; font-family: -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6;">${viewModel.content.description}</div>` }}
              style={styles.webView}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
          
          {/* Images Carousel */}
          {viewModel.content.images && viewModel.content.images.length > 0 && (
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
                {viewModel.content.images.map((image, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image source={{ uri: image }} style={styles.carouselImage} resizeMode="cover" />
                  </View>
                ))}
              </ScrollView>
              
              {/* Image Indicators */}
              <View style={styles.indicatorsContainer}>
                {viewModel.content.images.map((_, index) => (
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
          {viewModel.content.youtubeVideoId && (
            <TouchableOpacity 
              style={[styles.videoContainer, { backgroundColor: colors.inputBackground }]}
              onPress={() => openYouTubeVideo(viewModel.content!.youtubeVideoId!)}
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
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  date: {
    fontSize: 14,
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