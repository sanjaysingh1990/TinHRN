import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';

const { width, height } = Dimensions.get('window');

const PostDetailsScreen: React.FC = () => {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const params = useLocalSearchParams();

  const {
    postId,
    title,
    imageUrl,
    description,
    userName,
    userAvatar,
    category,
    viewsCount
  } = params;

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
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      fontFamily: 'SplineSans',
      flex: 1,
      textAlign: 'center',
      marginHorizontal: 16,
    },
    shareButton: {
      padding: 8,
    },
    imageContainer: {
      width: width,
      height: height * 0.4,
      backgroundColor: colors.cardBackgroundColor,
    },
    postImage: {
      width: '100%',
      height: '100%',
    },
    imageOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    viewsOverlay: {
      position: 'absolute',
      top: 16,
      right: 16,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    viewsText: {
      color: '#FFFFFF',
      fontSize: 14,
      marginLeft: 6,
      fontWeight: '600',
    },
    contentContainer: {
      flex: 1,
      padding: 20,
    },
    categoryBadge: {
      alignSelf: 'flex-start',
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginBottom: 16,
    },
    categoryText: {
      color: isDarkMode ? '#111714' : '#FFFFFF',
      fontSize: 12,
      fontWeight: '600',
      fontFamily: 'NotoSans',
    },
    postTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
      lineHeight: 32,
      fontFamily: 'SplineSans',
    },
    postDescription: {
      fontSize: 16,
      color: colors.secondary,
      lineHeight: 24,
      marginBottom: 24,
      fontFamily: 'NotoSans',
    },
    authorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: colors.cardBackgroundColor,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.borderColor,
      borderStyle: 'dashed',
    },
    authorAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      marginRight: 12,
    },
    authorInfo: {
      flex: 1,
    },
    authorName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
      fontFamily: 'SplineSans',
    },
    authorLabel: {
      fontSize: 12,
      color: colors.secondary,
      fontFamily: 'NotoSans',
    },
    contactButton: {
      padding: 8,
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
        <Text style={styles.headerTitle} numberOfLines={1}>Post Details</Text>
        <TouchableOpacity style={styles.shareButton}>
          <MaterialIcons name="share" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Post Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl as string }} style={styles.postImage} />
          <View style={styles.imageOverlay} />
          <View style={styles.viewsOverlay}>
            <MaterialIcons name="visibility" size={16} color="#FFFFFF" />
            <Text style={styles.viewsText}>{parseInt(viewsCount as string || '0').toLocaleString()}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {/* Category Badge */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>

          {/* Post Title */}
          <Text style={styles.postTitle}>{title}</Text>

          {/* Post Description */}
          <Text style={styles.postDescription}>{description}</Text>

          {/* Author Information */}
          <View style={styles.authorContainer}>
            <Image source={{ uri: userAvatar as string }} style={styles.authorAvatar} />
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>{userName}</Text>
              <Text style={styles.authorLabel}>Photographer</Text>
            </View>
            <TouchableOpacity style={styles.contactButton}>
              <MaterialIcons name="message" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PostDetailsScreen;