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
import BottomSheet from '@gorhom/bottom-sheet';

const ProfileScreen = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
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
                value={darkMode}
                onValueChange={setDarkMode}
              />
              <TouchableOpacity onPress={() => bottomSheetRef.current?.expand()}>
                <AccountItem icon="language" title="Language" onPress={() => bottomSheetRef.current?.expand()} />
              </TouchableOpacity>
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
      >
        <View style={styles.bottomSheetContent}>
          <TouchableOpacity style={styles.languageOption} onPress={() => handleLanguageSelect('English')}>
            <Text>English</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.languageOption} onPress={() => handleLanguageSelect('Hindi')}>
            <Text>Hindi</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </SafeAreaView>
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