
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Image
} from 'react-native';
import { theme } from '../../../../theme';
import { HomeViewModel } from '../viewmodels/HomeViewModel';
import { Tour } from '../../domain/entities/Tour';
import container from '../../../../container';
import { HomeViewModelToken } from '../../home.di';
import { MaterialIcons } from '@expo/vector-icons';
import TourCardSkeleton from '../components/TourCardSkeleton';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = theme[colorScheme];
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const homeViewModel = container.resolve<HomeViewModel>(HomeViewModelToken);
    homeViewModel.getHotTours().then(tours => {
      setTours(tours);
      setLoading(false);
    });
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 15,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginTop: 10,
    },
    notificationIcon: {
      position: 'absolute',
      right: 15,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.inputBackground,
      borderRadius: 10,
      padding: 10,
      margin: 15,
      borderWidth: 1,
      borderColor: colors.borderColor,
      borderStyle: 'dashed',
    },
    heroSection: {
      height: 200,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 15,
      borderRadius: 12,
      overflow: 'hidden',
    },
    heroTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: 'center',
    },
    heroSubtitle: {
      fontSize: 16,
      color: '#FFFFFF',
      textAlign: 'center',
      marginTop: 10,
    },
    heroButton: {
      backgroundColor: colors.primary,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      marginTop: 20,
    },
    heroButtonText: {
      color: colors.background,
      fontWeight: 'bold',
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      margin: 15,
    },
    tourCard: {
      flex: 1,
      margin: 7.5,
      backgroundColor: colors.inputBackground,
      borderRadius: 12,
      overflow: 'hidden',
    },
    tourImage: {
      width: '100%',
      height: 150,
    },
    tourInfo: {
      padding: 10,
    },
    tourName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    tourDuration: {
      color: colors.secondary,
    },
    exploreButton: {
      backgroundColor: colors.primary,
      padding: 8,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 10,
    },
    exploreButtonText: {
      color: colors.background,
      fontWeight: 'bold',
    },
  });

  const renderHeader = () => (
    <>
      <View style={styles.searchBar}>
        <MaterialIcons name="search" size={24} color={colors.secondary} />
        <Text style={{ color: colors.secondary, marginLeft: 10 }}>Search destinations</Text>
      </View>

      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1604537466158-c3a759f4c3d7?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
        style={styles.heroSection}
      >
        <Text style={styles.heroTitle}>Discover the Himalayas</Text>
        <Text style={styles.heroSubtitle}>Your next adventure awaits</Text>
        <TouchableOpacity style={styles.heroButton}>
          <Text style={styles.heroButtonText}>Explore Now</Text>
        </TouchableOpacity>
      </ImageBackground>

      <Text style={styles.sectionTitle}>Hot Tours</Text>
    </>
  );

  const renderSkeleton = () => (
    <View style={{flex: 1, margin: 7.5}}>
      <TourCardSkeleton />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tent'in Himalayas</Text>
        <TouchableOpacity style={styles.notificationIcon}>
          <MaterialIcons name="notifications-none" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={loading ? [1, 2, 3, 4] : tours}
        numColumns={2}
        renderItem={({ item }) => (
          loading ? renderSkeleton() :
          <View style={styles.tourCard}>
            <Image source={{ uri: item.image }} style={styles.tourImage} />
            <View style={styles.tourInfo}>
              <Text style={styles.tourName}>{item.name}</Text>
              <Text style={styles.tourDuration}>{item.duration}</Text>
              <TouchableOpacity style={styles.exploreButton}>
                <Text style={styles.exploreButtonText}>Explore</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingHorizontal: 7.5 }}
        ListHeaderComponent={renderHeader}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
