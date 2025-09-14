import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import container from '../../../../container';
import { theme } from '../../../../theme';
import { Tour } from '../../domain/entities/Tour';
import { HomeViewModelToken } from '../../home.di';
import { HomeViewModel } from '../viewmodels/HomeViewModel';

const HomeScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = theme[colorScheme];
  const [tours, setTours] = useState<Tour[]>([]);

  useEffect(() => {
    const homeViewModel = container.resolve<HomeViewModel>(HomeViewModelToken);
    homeViewModel.getHotTours().then(setTours);
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
      height: 300,
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
        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2R-D8bon07gNln5JYqh2DiwvqM5mD-4EtOIjoAPGd1e-IrwZseSxR8ONqLPRRLEQIturvHZWU1YaxJ4rQ04GAeWG_-1OroireJvI9p-tIbeYAr9-ryL9A0-ZhWhtaVzVlWyEf0B3BHjONWCgXJeA0h7UTbaSfTCYBP0y05epzqCjgkpxPQlwsocRiwiOcPDLzkcc8bz7RweQ2XS3mSt1ae7b_WqpaZTjeMw2a4YKn4LZQFS4CUzSVkehP3SQU99sezw5okLxauKCC' }}
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tent'in Himalayas</Text>
        <TouchableOpacity style={styles.notificationIcon}>
          <MaterialIcons name="notifications-none" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={tours}
        numColumns={2}
        renderItem={({ item }) => (
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
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 7.5 }}
        ListHeaderComponent={renderHeader}
      />
    </View>
  );
};

export default HomeScreen;