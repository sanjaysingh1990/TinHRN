import { MaterialIcons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useMemo } from 'react';
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';
import { TeamMember } from '../../domain/models/TeamMember';

interface TeamMemberBottomSheetProps {
  member: TeamMember | null;
  onClose: () => void;
}

const TeamMemberBottomSheet = forwardRef<BottomSheet, TeamMemberBottomSheetProps>(
  ({ member, onClose }, ref) => {
    const { colors, isDarkMode } = useTheme();
    const snapPoints = useMemo(() => ['50%', '75%'], []);

    const handleCall = () => {
      if (member?.phone) {
        Linking.openURL(`tel:${member.phone}`);
      }
    };

    const handleEmail = () => {
      if (member?.email) {
        Linking.openURL(`mailto:${member.email}`);
      }
    };

    const styles = StyleSheet.create({
      bottomSheetBackground: {
        backgroundColor: colors.cardBackgroundColor,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      },
      content: {
        flex: 1,
        alignItems: 'center',
        padding: 24,
      },
      profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
        borderWidth: 4,
        borderColor: colors.primary,
      },
      name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        textAlign: 'center',
        marginBottom: 8,
      },
      designation: {
        fontSize: 16,
        color: colors.primary,
        textAlign: 'center',
        fontWeight: '600',
        marginBottom: 16,
      },
      tagline: {
        fontSize: 14,
        color: colors.secondary,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
        paddingHorizontal: 20,
      },
      contactContainer: {
        width: '100%',
        gap: 12,
      },
      contactButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.borderColor,
      },
      contactIcon: {
        marginRight: 16,
      },
      contactInfo: {
        flex: 1,
      },
      contactLabel: {
        fontSize: 12,
        color: colors.secondary,
        marginBottom: 2,
      },
      contactValue: {
        fontSize: 16,
        color: colors.text,
        fontWeight: '500',
      },
    });

    if (!member) return null;

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={{ backgroundColor: colors.borderColor }}
        onChange={(index) => {
          if (index === -1) {
            onClose();
          }
        }}
      >
        <BottomSheetView style={styles.content}>
          <Image source={{ uri: member.image }} style={styles.profileImage} />
          <Text style={styles.name}>{member.name}</Text>
          <Text style={styles.designation}>{member.designation}</Text>
          <Text style={styles.tagline}>{member.tagline}</Text>
          
          <View style={styles.contactContainer}>
            <TouchableOpacity style={styles.contactButton} onPress={handleCall}>
              <MaterialIcons 
                name="phone" 
                size={24} 
                color={colors.primary} 
                style={styles.contactIcon}
              />
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Phone</Text>
                <Text style={styles.contactValue}>{member.phone}</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.contactButton} onPress={handleEmail}>
              <MaterialIcons 
                name="email" 
                size={24} 
                color={colors.primary} 
                style={styles.contactIcon}
              />
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>{member.email}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

TeamMemberBottomSheet.displayName = 'TeamMemberBottomSheet';

export default TeamMemberBottomSheet;