import { MaterialIcons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import container from '../../../../container';
import { useTheme } from '../../../../hooks/useTheme';
import { useI18n } from '../../../../hooks/useI18n';
import { TeamMember } from '../../domain/models/TeamMember';
import { AboutUsViewModelToken } from '../../profile.di';
import TeamMemberBottomSheet from '../components/TeamMemberBottomSheet';
import TeamMemberCard from '../components/TeamMemberCard';
import TeamMemberShimmer from '../components/TeamMemberShimmer';
import { AboutUsViewModel } from '../viewmodels/AboutUsViewModel';

const AboutUsScreen: React.FC = () => {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const { t } = useI18n();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoadingTeam, setIsLoadingTeam] = useState(true);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const aboutUsViewModel = container.resolve<AboutUsViewModel>(AboutUsViewModelToken);

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    setIsLoadingTeam(true);
    try {
      const members = await aboutUsViewModel.getTeamMembers();
      setTeamMembers(members);
    } catch (error) {
      console.error('Error loading team members:', error);
    } finally {
      setIsLoadingTeam(false);
    }
  };

  const handleTeamMemberPress = (member: TeamMember) => {
    setSelectedMember(member);
    bottomSheetRef.current?.snapToIndex(0);
  };

  const handleBottomSheetClose = () => {
    setSelectedMember(null);
  };

  const renderTeamMember = ({ item }: { item: TeamMember }) => (
    <TeamMemberCard member={item} onPress={handleTeamMemberPress} />
  );

  const renderTeamShimmer = ({ index }: { index: number }) => (
    <TeamMemberShimmer key={`shimmer-${index}`} />
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 16,
      paddingTop: 20, // Header margin requirement from memory
      backgroundColor: colors.background,
    },
    backButton: {
      padding: 8,
      marginRight: 8,
    },
    logoContainer: {
      flex: 1,
      alignItems: 'center',
    },
    logoImage: {
      width: 120,
      height: 40,
      resizeMode: 'contain',
    },
    headerSpacer: {
      width: 40, // Same width as back button to center logo
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginVertical: 24,
      fontFamily: 'SplineSans', // Font family from requirements
    },
    heroImageContainer: {
      width: '100%',
      height: 250,
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: 32,
      borderWidth: 2,
      borderStyle: 'dashed',
      borderColor: colors.borderColor,
      position: 'relative',
      backgroundColor: colors.cardBackgroundColor,
    },
    heroImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    heroGradientOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
      fontFamily: 'SplineSans',
    },
    sectionText: {
      fontSize: 16,
      lineHeight: 24,
      color: colors.secondary,
      textAlign: 'left',
      fontFamily: 'NotoSans',
      paddingHorizontal: 4,
    },
    teamContainer: {
      marginTop: 20,
    },
    teamList: {
      paddingLeft: 4,
    },
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      {/* Header with back button, logo, and spacer */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back-ios" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/120x40/df9c20/ffffff?text=Tent+in+Himalayas' }}
            style={styles.logoImage}
          />
        </View>
        
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.title}>{t('aboutUs.title')}</Text>

        {/* Hero Image with gradient overlay and dashed border */}
        <View style={styles.heroImageContainer}>
          <Image
            source={{ 
              uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' 
            }}
            style={styles.heroImage}
          />
          <View style={styles.heroGradientOverlay} />
        </View>

        {/* Our Mission Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('aboutUs.missionTitle')}</Text>
          <Text style={styles.sectionText}>{t('aboutUs.missionText')}</Text>
        </View>

        {/* Our Team Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('aboutUs.teamTitle')}</Text>
          <Text style={styles.sectionText}>{t('aboutUs.teamText')}</Text>
          
          {/* Team Members Horizontal List */}
          <View style={styles.teamContainer}>
            {isLoadingTeam ? (
              <FlatList
                data={Array.from({ length: 5 }, (_, i) => i)}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={renderTeamShimmer}
                keyExtractor={(_, index) => `shimmer-${index}`}
                contentContainerStyle={styles.teamList}
              />
            ) : (
              <FlatList
                data={teamMembers}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={renderTeamMember}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.teamList}
              />
            )}
          </View>
        </View>
      </ScrollView>

      {/* Team Member Bottom Sheet */}
      <TeamMemberBottomSheet
        ref={bottomSheetRef}
        member={selectedMember}
        onClose={handleBottomSheetClose}
      />
    </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default AboutUsScreen;