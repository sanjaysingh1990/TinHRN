import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';

interface ProfileHeaderProps {
  userProfile?: any;
  loading?: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userProfile, loading }) => {
  const { colors, isDarkMode } = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      padding: 20,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginTop: 10,
    },
    email: {
      fontSize: 16,
      color: colors.secondary,
      marginTop: 5,
    },
    editButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      marginTop: 15,
    },
    editButtonText: {
      color: isDarkMode ? '#111714' : '#fff',
      fontWeight: 'bold',
      marginLeft: 5,
    },
  });

  // Show loading state or default values
  const displayName = loading ? 'Loading...' : (userProfile?.name || 'John Doe');
  const displayEmail = loading ? 'Loading...' : (userProfile?.email || 'john.doe@example.com');
  const displayPhoto = userProfile?.photoURL || 'https://randomuser.me/api/portraits/men/81.jpg';

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: displayPhoto }}
        style={styles.avatar}
      />
      <Text style={styles.name}>{displayName}</Text>
      <Text style={styles.email}>{displayEmail}</Text>
      <TouchableOpacity style={styles.editButton}>
        <MaterialIcons name="edit" size={16} color={isDarkMode ? '#111714' : '#fff'} />
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileHeader;