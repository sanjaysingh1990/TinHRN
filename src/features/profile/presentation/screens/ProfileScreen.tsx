import BottomSheet from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { useAuth } from '../../../../features/auth/presentation/context/AuthContext';
import { useI18n } from '../../../../hooks/useI18n';
import { useTheme } from '../../../../hooks/useTheme';
import { useViewModel } from '../../../../hooks/useViewModel';
import { ProfileViewModelToken } from '../../profile.di';
import AccountItem from '../components/AccountItem';
import AchievementItem from '../components/AchievementItem';
import AchievementsShimmer from '../components/AchievementsShimmer';
import FavoriteCard from '../components/FavoriteCard';
import FavoritesShimmer from '../components/FavoritesShimmer';
import PreferenceItem from '../components/PreferenceItem';
import ProfileHeader from '../components/ProfileHeader';
import ProfileLanguageSheet from '../components/ProfileLanguageSheet';
import ProfileSection from '../components/ProfileSection';
import { ProfileViewModel } from '../viewmodels/ProfileViewModel';

const ProfileScreen = () => {
  const router = useRouter();
  const { isDarkMode, colors, toggleDarkMode } = useTheme();
  const { setLocale } = useI18n();
  const { logout } = useAuth();

  const viewModel = useViewModel<ProfileViewModel>(ProfileViewModelToken);
  const [notifications, setNotifications] = useState(true);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  useEffect(() => {
    viewModel.loadProfileData();
  }, [viewModel]);

  const { profile, achievements, favorites, isLoading } = viewModel;

  const handleLanguageSelect = (lang: string) => {
    setLocale(lang === 'hi' ? 'hi' : 'en');
    bottomSheetRef.current?.close();
  };

  const handleTermsAndConditions = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: async () => {
            try {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              await logout();
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

  const handleItemPress = (path: string) => {
    Haptics.selectionAsync();
    router.push(path as any);
  }

  const styles = StyleSheet.create({
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
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
        <ScrollView style={styles.scrollView}>
          <ProfileHeader userProfile={profile} loading={isLoading && !profile} />
          <View style={styles.content}>

            <ProfileSection title="ACHIEVEMENTS">
              {isLoading && achievements.length === 0 ? (
                <AchievementsShimmer />
              ) : (
                <View style={styles.grid}>
                  {achievements.map(item => (
                    <AchievementItem key={item.id} achievement={item} />
                  ))}
                </View>
              )}
            </ProfileSection>

            <ProfileSection title="FAVORITES">
              {isLoading && favorites.length === 0 ? (
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
            </ProfileSection>

            <ProfileSection title="ACCOUNT">
              <AccountItem icon="person-outline" title="Personal Info" onPress={() => Haptics.selectionAsync()} />
              <AccountItem icon="history" title="Booking History" onPress={() => handleItemPress('/booking-history')} />
              <AccountItem icon="payment" title="Payment Methods" onPress={() => Haptics.selectionAsync()} noBorder />
            </ProfileSection>

            <ProfileSection title="PREFERENCES">
              <PreferenceItem
                icon="notifications-none"
                title="Notifications"
                value={notifications}
                onValueChange={(val) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setNotifications(val);
                }}
              />
              <PreferenceItem
                icon="brightness-4"
                title="Dark Mode"
                value={isDarkMode}
                onValueChange={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  toggleDarkMode();
                }}
              />
              <AccountItem icon="language" title="Language" onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                bottomSheetRef.current?.snapToIndex(0);
              }} noBorder />
            </ProfileSection>

            <ProfileSection title="OTHERS">
              <AccountItem icon="info-outline" title="About Us" onPress={() => handleItemPress('/about-us')} />
              <AccountItem icon="help-outline" title="FAQ" onPress={() => handleItemPress('/faq')} />
              <AccountItem icon="description" title="Terms and Conditions" onPress={handleTermsAndConditions} noBorder />
            </ProfileSection>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <ProfileLanguageSheet
          bottomSheetRef={bottomSheetRef}
          snapPoints={snapPoints}
          onSelectLanguage={handleLanguageSelect}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default ProfileScreen;