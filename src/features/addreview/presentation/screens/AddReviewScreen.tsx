import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar, 
  Alert,
  Animated,
  Dimensions
} from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';
import container from '../../../../container';
import { AddReviewScreenViewModel } from '../viewmodels/AddReviewScreenViewModel';
import { AddReviewScreenViewModelToken } from '../../addreview.di';
import { GetCurrentUserUseCase } from '../../../../features/auth/domain/usecases/GetCurrentUserUseCase';
import { GetCurrentUserUseCaseToken } from '../../../../features/auth/auth.di';

const { width } = Dimensions.get('window');

const AddReviewScreen: React.FC = () => {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const { tourId } = useLocalSearchParams();
  const [viewModel] = useState(() => container.resolve<AddReviewScreenViewModel>(AddReviewScreenViewModelToken));
  const [getCurrentUserUseCase] = useState(() => container.resolve<GetCurrentUserUseCase>(GetCurrentUserUseCaseToken));
  
  const [user, setUser] = useState<any>(null);
  const [starAnimations] = useState(() => Array(5).fill(0).map(() => new Animated.Value(1)));
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUserUseCase.execute();
        setUser(currentUser);
      } catch (error) {
        console.error('Error fetching user:', error);
        Alert.alert('Error', 'Failed to fetch user information');
      }
    };
    
    fetchUser();
  }, []);

  const handleStarPress = (rating: number) => {
    viewModel.setRating(rating);
    
    // Animate the selected star
    Animated.sequence([
      Animated.timing(starAnimations[rating - 1], {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(starAnimations[rating - 1], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Error', 'User not found');
      return;
    }
    
    if (!tourId) {
      Alert.alert('Error', 'Tour ID not found');
      return;
    }
    
    const success = await viewModel.submitReview(
      tourId as string,
      user.id,
      user.name || 'Anonymous',
      user.photoURL || ''
    );
    
    if (success) {
      Alert.alert('Success', 'Review submitted successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } else if (viewModel.error) {
      Alert.alert('Error', viewModel.error);
    }
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {Array.from({ length: 5 }, (_, index) => {
          const starValue = index + 1;
          const isSelected = starValue <= viewModel.rating;
          
          return (
            <TouchableOpacity
              key={starValue}
              onPress={() => handleStarPress(starValue)}
              style={styles.starButton}
            >
              <Animated.View
                style={{
                  transform: [{ scale: starAnimations[index] }],
                }}
              >
                <MaterialIcons
                  name={isSelected ? 'star' : 'star-border'}
                  size={40}
                  color={isSelected ? '#FFD700' : colors.text}
                />
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderColor,
      paddingTop: StatusBar.currentHeight,
    },
    backButton: {
      position: 'absolute',
      left: 16,
      padding: 8,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    sectionSubtitle: {
      fontSize: 14,
      color: colors.secondary,
      marginBottom: 24,
    },
    starsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 32,
    },
    starButton: {
      marginHorizontal: 8,
    },
    textAreaContainer: {
      borderWidth: 1,
      borderColor: colors.borderColor,
      borderRadius: 12,
      borderStyle: 'dashed',
      minHeight: 120,
      marginBottom: 32,
    },
    textArea: {
      textAlignVertical: 'top',
      padding: 16,
      fontSize: 16,
      color: colors.text,
      minHeight: 120,
    },
    submitButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    submitButtonDisabled: {
      opacity: 0.7,
    },
    submitButtonText: {
      color: isDarkMode ? '#111714' : '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    loadingText: {
      color: isDarkMode ? '#111714' : '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 8,
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={colors.background} 
      />
      
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Leave a Review</Text>
        </View>
        
        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>How was your trek?</Text>
          <Text style={styles.sectionSubtitle}>
            Your review helps others choose the perfect adventure
          </Text>
          
          {/* Star Rating */}
          {renderStars()}
          
          {/* Review Text Area */}
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              placeholder="Share your experience..."
              placeholderTextColor={colors.secondary}
              multiline
              numberOfLines={4}
              value={viewModel.reviewText}
              onChangeText={(text) => viewModel.setReviewText(text)}
              editable={!viewModel.loading}
            />
          </View>
          
          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              viewModel.loading && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={viewModel.loading}
          >
            {viewModel.loading ? (
              <View style={styles.loadingContainer}>
                <MaterialIcons name="hourglass-empty" size={20} color={isDarkMode ? '#111714' : '#fff'} />
                <Text style={styles.loadingText}>Submitting...</Text>
              </View>
            ) : (
              <Text style={styles.submitButtonText}>Submit Review</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddReviewScreen;