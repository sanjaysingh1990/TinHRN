import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';
import { TeamMember } from '../../domain/models/TeamMember';

interface TeamMemberCardProps {
  member: TeamMember;
  onPress: (member: TeamMember) => void;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, onPress }) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      width: 200,
      backgroundColor: colors.cardBackgroundColor,
      borderRadius: 16,
      padding: 16,
      marginRight: 16,
      borderWidth: 1,
      borderColor: colors.borderColor,
      borderStyle: 'dashed',
      alignItems: 'center',
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginBottom: 12,
    },
    name: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 4,
    },
    designation: {
      fontSize: 12,
      color: colors.primary,
      textAlign: 'center',
      fontWeight: '600',
      marginBottom: 8,
    },
    tagline: {
      fontSize: 11,
      color: colors.secondary,
      textAlign: 'center',
      lineHeight: 16,
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(member)} activeOpacity={0.7}>
      <Image source={{ uri: member.image }} style={styles.profileImage} />
      <Text style={styles.name} numberOfLines={1}>{member.name}</Text>
      <Text style={styles.designation} numberOfLines={1}>{member.designation}</Text>
      <Text style={styles.tagline} numberOfLines={2}>{member.tagline}</Text>
    </TouchableOpacity>
  );
};

export default TeamMemberCard;