import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';
import { TeamMember } from '../../domain/models/TeamMember';

interface TeamMemberCardProps {
  member: TeamMember & { 
    title?: string; 
    profilePic?: string; 
    description?: string;
  };
  onPress: (member: TeamMember) => void;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, onPress }) => {
  const { colors } = useTheme();

  // Handle both old and new data structures
  const name = member.name;
  const designation = member.designation || member.title || '';
  const image = member.image || member.profilePic || '';
  const tagline = member.tagline || '';

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
      <Image source={{ uri: image }} style={styles.profileImage} />
      <Text style={styles.name} numberOfLines={1}>{name}</Text>
      <Text style={styles.designation} numberOfLines={1}>{designation}</Text>
      <Text style={styles.tagline} numberOfLines={2}>{tagline}</Text>
    </TouchableOpacity>
  );
};

export default TeamMemberCard;