import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import container from '../../../../container';
import { useAuth } from '../../../../features/auth/presentation/context/AuthContext';
import { useI18n } from '../../../../hooks/useI18n';
import { useTheme } from '../../../../hooks/useTheme';
import { Achievement } from '../../domain/models/Achievement';
import { Favorite } from '../../domain/models/Favorite';
import { ProfileViewModelToken } from '../../profile.di';
import AccountItem from '../components/AccountItem';
import AchievementItem from '../components/AchievementItem';
import AchievementsShimmer from '../components/AchievementsShimmer';
import FavoriteCard from '../components/FavoriteCard';
import FavoritesShimmer from '../components/FavoritesShimmer';
import PreferenceItem from '../components/PreferenceItem';
import ProfileHeader from '../components/ProfileHeader';
import { ProfileViewModel } from '../viewmodels/ProfileViewModel';

const ProfileScreen = () => {
  const router = useRouter();
  const { isDarkMode, colors, colorScheme, toggleDarkMode } = useTheme();
  const { locale, setLocale } = useI18n();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [achievementsLoading, setAchievementsLoading] = useState(true);
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState(locale === 'hi' ? 'Hindi' : 'English');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userProfileLoading, setUserProfileLoading] = useState(true);

  const { logout } = useAuth();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleLanguageSelect = (lang: string) => {
    setLanguage(lang);
    setLocale(lang === 'hi' ? 'hi' : 'en');
    bottomSheetRef.current?.close();
  };

  const handleTermsAndConditions = async () => {
    const url = 'https://www.tentinhimalayas.com/term_and_condition.html';
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to open the Terms and Conditions page. Please try again later.');
      }
    } catch (error) {
      console.error('Error opening Terms and Conditions:', error);
      Alert.alert('Error', 'Unable to open the Terms and Conditions page. Please try again later.');
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'OK', 
          onPress: async () => {
            try {
              await logout();
              // Redirect to login screen and remove all existing screens
              router.replace('/login');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    const viewModel = container.resolve<ProfileViewModel>(ProfileViewModelToken);
    
    // Load user profile
    viewModel.getUserProfile().then((profile) => {
      setUserProfile(profile);
      setUserProfileLoading(false);
    }).catch((error) => {
      console.error('Error loading user profile:', error);
      setUserProfileLoading(false);
    });
    
    // Load achievements with dummy data
    setAchievements([
      {
        id: 1,
        title: 'First Booking',
        icon: 'trophy',
        color: '#FFD700',
      },
      {
        id: 2,
        title: 'Adventure Master',
        icon: 'mountain',
        color: '#87CEEB',
      },
      {
        id: 3,
        title: 'Explorer',
        icon: 'map',
        color: '#98FB98',
      },
      {
        id: 4,
        title: 'Eco Warrior',
        icon: 'leaf',
        color: '#90EE90',
      },
    ]);
    setAchievementsLoading(false);
    
    // Load favorites with dummy data
    setFavorites([
      {
        id: 1,
        title: 'Himalayan Trek',
        location: 'Manali, Himachal Pradesh',
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      },
      {
        id: 2,
        title: 'Campfire Nights',
        location: 'Leh, Ladakh',
        imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      },
      {
        id: 3,
        title: 'River Rafting',
        location: 'Rishikesh, Uttarakhand',
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      },
    ]);
    setFavoritesLoading(false);
  }, []);

  const createStyles = (colors: any) => StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 16,
    },
    card: {
      backgroundColor: colors.cardBackgroundColor,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.borderColor,
      borderStyle: 'dashed',
      padding: 20,
      marginBottom: 24,
      alignItems: 'center',
    },
    badge: {
      position: 'absolute',
      top: -14,
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingVertical: 4,
      paddingHorizontal: 12,
    },
    badgeText: {
      color: colors.background,
      fontWeight: 'bold',
      fontSize: 12,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      marginTop: 20,
    },
    logoutButton: {
      backgroundColor: '#ff4d4d',
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 10,
    },
    logoutButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    bottomSheetContent: {
      flex: 1,
      alignItems: 'center',
      padding: 20,
    },
    languageOption: {
      padding: 15,
      width: '100%',
      alignItems: 'center',
    },
  });

  const styles = createStyles(colors);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}  edges={['top', 'left', 'right']}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
        <ScrollView style={styles.scrollView}>
          <ProfileHeader userProfile={userProfile} loading={userProfileLoading} />
          <View style={styles.content}>
            {/* Achievements Section */}
            <View style={styles.card}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>ACHIEVEMENTS</Text>
              </View>
              {achievementsLoading ? (
                <AchievementsShimmer />
              ) : (
                <View style={styles.grid}>
                  {achievements.map(item => (
                    <AchievementItem key={item.id} achievement={item} />
                  ))}
                </View>
              )}
            </View>

            {/* Favorites Section */}
            <View style={styles.card}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>FAVORITES</Text>
              </View>
              {favoritesLoading ? (
                <FavoritesShimmer />
              ) : (
                <FlatList
                  data={favorites}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => <FavoriteCard favorite={item} />}
                  keyExtractor={item => item.id.toString()}
                />
              )}
            </View>

              <View style={styles.card}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>ACCOUNT</Text>
                </View>
                <AccountItem icon="person-outline" title="Personal Info" onPress={() => {}} />
                <AccountItem icon="history" title="Booking History" onPress={() => router.push('/booking-history')} />
                <AccountItem icon="payment" title="Payment Methods" onPress={() => {}} noBorder />
              </View>

              <View style={styles.card}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>PREFERENCES</Text>
                </View>
                <PreferenceItem
                  icon="notifications-none"
                  title="Notifications"
                  value={notifications}
                  onValueChange={setNotifications}
                />
                <PreferenceItem
                  icon="brightness-4"
                  title="Dark Mode"
                  value={isDarkMode}
                  onValueChange={toggleDarkMode}
                />
                <AccountItem icon="language" title="Language" onPress={() => bottomSheetRef.current?.snapToIndex(0)} noBorder />
              </View>

              <View style={styles.card}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>OTHERS</Text>
                </View>
                <AccountItem icon="info-outline" title="About Us" onPress={() => router.push('/about-us')} />
                <AccountItem icon="help-outline" title="FAQ" onPress={() => router.push('/faq')} />
                <AccountItem icon="description" title="Terms and Conditions" onPress={handleTermsAndConditions} noBorder />
              </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          enablePanDownToClose
          backgroundStyle={{ backgroundColor: colors.cardBackgroundColor }}
        >
          <BottomSheetView style={[styles.bottomSheetContent, { backgroundColor: colors.cardBackgroundColor }]}>
            <TouchableOpacity style={styles.languageOption} onPress={() => handleLanguageSelect('English')}>
              <Text style={{ color: colors.text }}>English</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.languageOption} onPress={() => handleLanguageSelect('Hindi')}>
              <Text style={{ color: colors.text }}>Hindi</Text>
            </TouchableOpacity>
          </BottomSheetView>
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default ProfileScreen;