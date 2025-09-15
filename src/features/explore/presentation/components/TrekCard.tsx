import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';
import { TopTrek } from '../../domain/entities/Explore';

interface TrekCardProps {
  trek: TopTrek;
  onExplore: () => void;
}

const TrekCard: React.FC<TrekCardProps> = ({ trek, onExplore }) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: colors.cardBackgroundColor,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.borderColor,
      borderStyle: 'dashed',
      padding: 16,
      marginBottom: 16,
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: 12,
      marginRight: 16,
      resizeMode: 'cover',
    },
    content: {
      flex: 1,
      justifyContent: 'space-between',
    },
    titleContainer: {
      flex: 1,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      fontFamily: 'SplineSans',
      marginBottom: 4,
    },
    details: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 8,
    },
    duration: {
      fontSize: 12,
      color: colors.secondary,
      fontFamily: 'NotoSans',
      marginRight: 12,
    },
    difficulty: {
      fontSize: 12,
      color: colors.primary,
      fontFamily: 'NotoSans',
      fontWeight: '600',
      marginRight: 12,
    },
    altitude: {
      fontSize: 12,
      color: colors.secondary,
      fontFamily: 'NotoSans',
    },
    buttonContainer: {
      alignItems: 'flex-end',
    },
    exploreButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    exploreButtonText: {
      color: colors.background,
      fontSize: 12,
      fontWeight: '600',
      fontFamily: 'SplineSans',
    },
  });

  return (
    <View style={styles.container}>
      <Image source={{ uri: trek.image }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>{trek.name}</Text>
          <View style={styles.details}>
            <Text style={styles.duration}>{trek.duration}</Text>
            <Text style={styles.difficulty}>{trek.difficulty}</Text>
            <Text style={styles.altitude}>{trek.altitude}</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.exploreButton} onPress={onExplore} activeOpacity={0.7}>
            <Text style={styles.exploreButtonText}>Explore</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default TrekCard;