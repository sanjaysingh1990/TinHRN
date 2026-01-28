import { MaterialIcons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
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
import { useI18n } from '../../../../hooks/useI18n';
import { useTheme } from '../../../../hooks/useTheme';
import { useViewModel } from '../../../../hooks/useViewModel';
import { TeamMember } from '../../domain/models/TeamMember';
import { AboutUsViewModelToken } from '../../profile.di';
import AboutUsShimmer from '../components/AboutUsShimmer';
import TeamMemberBottomSheet from '../components/TeamMemberBottomSheet';
import TeamMemberCard from '../components/TeamMemberCard';
import { AboutUsViewModel } from '../viewmodels/AboutUsViewModel';

const AboutUsScreen: React.FC = () => {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const { t } = useI18n();

  const viewModel = useViewModel<AboutUsViewModel>(AboutUsViewModelToken);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    viewModel.loadData();
  }, [viewModel]);

  const { aboutData, teamMembers, isLoading } = viewModel;

  const handleBack = () => {
    Haptics.selectionAsync();
    router.back();
  };

  const handleTeamMemberPress = (member: TeamMember) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedMember(member);
    bottomSheetRef.current?.snapToIndex(0);
  };

  const handleBottomSheetClose = () => {
    setSelectedMember(null);
  };

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 16,
      paddingTop: 20,
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
      width: 40,
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
      fontFamily: 'SplineSans',
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

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
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
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>{t('aboutUs.title')}</Text>

          <View style={styles.heroImageContainer}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
              }}
              style={styles.heroImage}
            />
            <View style={styles.heroGradientOverlay} />
          </View>

          {isLoading && !aboutData ? (
            <AboutUsShimmer />
          ) : (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {aboutData?.ourMission?.heading || t('aboutUs.missionTitle')}
                </Text>
                <Text style={styles.sectionText}>
                  {aboutData?.ourMission?.description || t('aboutUs.missionText')}
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {aboutData?.ourTeam?.heading || t('aboutUs.teamTitle')}
                </Text>
                <Text style={styles.sectionText}>
                  {aboutData?.ourTeam?.description || t('aboutUs.teamText')}
                </Text>

                <View style={styles.teamContainer}>
                  {teamMembers.length > 0 ? (
                    <FlatList
                      data={teamMembers}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      renderItem={({ item }) => (
                        <TeamMemberCard
                          member={{
                            id: item.id,
                            name: item.name,
                            designation: item.title || '',
                            tagline: item.tagline || '',
                            phone: item.phone || '',
                            email: item.email || '',
                            image: item.profilePic || ''
                          }}
                          onPress={handleTeamMemberPress}
                        />
                      )}
                      keyExtractor={(item) => item.id}
                      contentContainerStyle={styles.teamList}
                    />
                  ) : !isLoading ? (
                    <Text style={[styles.sectionText, { fontStyle: 'italic' }]}>
                      {t('aboutUs.noTeamMembers')}
                    </Text>
                  ) : null}
                </View>
              </View>
            </>
          )}
        </ScrollView>

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