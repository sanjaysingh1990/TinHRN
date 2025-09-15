import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../../hooks/useTheme';
import container from '../../../../container';
import { ProfileViewModelToken } from '../../profile.di';
import { ProfileViewModel } from '../viewmodels/ProfileViewModel';
import { Achievement } from '../../domain/models/Achievement';
import { Favorite } from '../../domain/models/Favorite';
import ProfileHeader from '../components/ProfileHeader';
import AchievementItem from '../components/AchievementItem';
import FavoriteCard from '../components/FavoriteCard';
import AccountItem from '../components/AccountItem';
import PreferenceItem from '../components/PreferenceItem';
import ProfileSkeleton from '../components/ProfileSkeleton';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const ProfileScreen = () => {
  const { isDarkMode, colors, colorScheme, toggleDarkMode } = useTheme();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('English');

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleLanguageSelect = (lang: string) => {
    setLanguage(lang);
    bottomSheetRef.current?.close();
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => console.log('Logout Pressed') },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    const viewModel = container.resolve<ProfileViewModel>(ProfileViewModelToken);
    Promise.all([
      viewModel.getAchievements(),
      viewModel.getFavorites(),
    ]).then(([achievements, favorites]) => {
      setAchievements(achievements);
      setFavorites(favorites);
      setLoading(false);
    });
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
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
        <ScrollView style={styles.scrollView}>
          <ProfileHeader />
          {loading ? <ProfileSkeleton /> : (
            <View style={styles.content}>
              <View style={styles.card}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>ACHIEVEMENTS</Text>
                </View>
                <View style={styles.grid}>
                  {achievements.map(item => (
                    <AchievementItem key={item.id} achievement={item} />
                  ))}
                </View>
              </View>

              <View style={styles.card}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>FAVORITES</Text>
                </View>
                <FlatList
                  data={favorites}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => <FavoriteCard favorite={item} />}
                  keyExtractor={item => item.id.toString()}
                />
              </View>

              <View style={styles.card}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>ACCOUNT</Text>
                </View>
                <AccountItem icon="person-outline" title="Personal Info" onPress={() => {}} />
                <AccountItem icon="history" title="Booking History" onPress={() => {}} />
                <AccountItem icon="payment" title="Payment Methods" onPress={() => {}} />
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
                <AccountItem icon="language" title="Language" onPress={() => bottomSheetRef.current?.snapToIndex(0)} />
              </View>

              <View style={styles.card}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>OTHERS</Text>
                </View>
                <AccountItem icon="info-outline" title="About Us" onPress={() => {}} />
                <AccountItem icon="help-outline" title="FAQ" onPress={() => {}} />
                <AccountItem icon="description" title="Terms and Conditions" onPress={() => {}} />
              </View>

              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          )}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#111714',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#1C2620',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3d5245',
    borderStyle: 'dashed',
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -14,
    backgroundColor: '#38e07b',
    borderRadius: 14,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  badgeText: {
    color: '#111714',
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

export default ProfileScreen;