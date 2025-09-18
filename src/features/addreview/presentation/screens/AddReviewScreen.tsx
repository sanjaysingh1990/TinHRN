import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import container from '../../../../container';
import { GetCurrentUserUseCaseToken } from '../../../../features/auth/auth.di';
import { GetCurrentUserUseCase } from '../../../../features/auth/domain/usecases/GetCurrentUserUseCase';
import { useTheme } from '../../../../hooks/useTheme';
import { AddReviewScreenViewModelToken } from '../../addreview.di';
import { AddReviewScreenViewModel } from '../viewmodels/AddReviewScreenViewModel';

// Add ErrorToast component
const ErrorToast: React.FC<{ 
  message: string; 
  visible: boolean; 
  onHide: () => void; 
  duration?: number;
}> = ({ 
  message, 
  visible, 
  onHide, 
  duration = 4000 
}) => {
  const { colors, isDarkMode } = useTheme();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 60,
          left: 20,
          right: 20,
          padding: 16,
          borderRadius: 12,
          borderWidth: 1,
          zIndex: 1000,
          elevation: 1000,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          backgroundColor: isDarkMode ? '#ff6b6b' : '#ff4757',
          borderColor: isDarkMode ? '#ff8e8e' : '#ff3838',
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={{
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
      }}>{message}</Text>
    </Animated.View>
  );
};

const { width } = Dimensions.get('window');

const AddReviewScreen: React.FC = () => {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const { tourId } = useLocalSearchParams();
  const [viewModel] = useState(() => container.resolve<AddReviewScreenViewModel>(AddReviewScreenViewModelToken));
  const [getCurrentUserUseCase] = useState(() => container.resolve<GetCurrentUserUseCase>(GetCurrentUserUseCaseToken));
  
  const [user, setUser] = useState<any>(null);
  const [rating, setRating] = useState(0); // Local state for rating
  const [reviewText, setReviewText] = useState(''); // Local state for review text
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUserUseCase.execute();
        setUser(currentUser);
      } catch (error) {
        console.error('Error fetching user:', error);
        setErrorMessage('Failed to fetch user information');
        setShowErrorToast(true);
      }
    };
    
    fetchUser();
  }, []);

  const handleStarPress = (starIndex: number) => {
    console.log('Star pressed:', starIndex);
    // starIndex is 1-based (1 to 5)
    const newRating = rating === starIndex ? 0 : starIndex;
    console.log('New rating:', newRating);
    setRating(newRating);
    viewModel.setRating(newRating);
  };

  const handleTextChange = (text: string) => {
    console.log('Text changed:', text); // Debug log
    setReviewText(text);
    viewModel.setReviewText(text);
  };

  const handleSubmit = async () => {
    if (!user) {
      setErrorMessage('User not found');
      setShowErrorToast(true);
      return;
    }
    
    if (!tourId) {
      setErrorMessage('Tour ID not found');
      setShowErrorToast(true);
      return;
    }
    
    // Update ViewModel with current local state before submitting
    viewModel.setRating(rating);
    viewModel.setReviewText(reviewText);
    console.log("user",user);
    // Use local rating state instead of viewModel.rating
    const success = await viewModel.submitReview(
      tourId as string,
      user.id,
      user.name || 'Anonymous',
      user.photoURL || ''
    );
    
    if (success) {
      // Show success message and navigate back
      setErrorMessage('Review submitted successfully');
      setShowErrorToast(true);
      setTimeout(() => {
        router.back();
      }, 1000);
    } else if (viewModel.error) {
      setErrorMessage(viewModel.error);
      setShowErrorToast(true);
    }
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {Array.from({ length: 5 }, (_, index) => {
          const starValue = index + 1;
          // isSelected should be true if the starValue is less than or equal to the current rating
          const isSelected = starValue <= rating;
          
          return (
            <TouchableOpacity
              key={starValue}
              onPress={() => handleStarPress(starValue)}
              style={styles.starButton}
            >
              <MaterialIcons
                name={isSelected ? 'star' : 'star-border'}
                size={40}
                color={isSelected ? '#FFD700' : colors.text}
              />
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
      justifyContent: 'flex-start', // Align items to the left
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderColor,
      paddingTop: StatusBar.currentHeight,
      minHeight: 60 + (StatusBar.currentHeight || 0),
    },
    backButton: {
      padding: 8,
      marginRight: 16,
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
      padding: 10, // Increase touchable area
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
      
      {/* Error Toast */}
      <ErrorToast 
        message={errorMessage}
        visible={showErrorToast}
        onHide={() => setShowErrorToast(false)}
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
              value={reviewText}
              onChangeText={handleTextChange}
              editable={!viewModel.loading}
              textAlignVertical="top" // Ensure text starts at the top
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