
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../../../hooks/useTheme';

const ProfileHeader = () => {
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

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://randomuser.me/api/portraits/men/81.jpg' }}
        style={styles.avatar}
      />
      <Text style={styles.name}>John Doe</Text>
      <Text style={styles.email}>john.doe@example.com</Text>
      <TouchableOpacity style={styles.editButton}>
        <MaterialIcons name="edit" size={16} color={isDarkMode ? '#111714' : '#fff'} />
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileHeader;
