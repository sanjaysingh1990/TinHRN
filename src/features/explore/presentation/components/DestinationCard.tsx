import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';
import { Destination } from '../../domain/entities/Explore';

interface DestinationCardProps {
  destination: Destination;
  onPress: () => void;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ destination, onPress }) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      width: 250,
      backgroundColor: colors.cardBackgroundColor,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.borderColor,
      borderStyle: 'dashed',
      marginRight: 16,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: 140,
      resizeMode: 'cover',
    },
    content: {
      padding: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      fontFamily: 'SplineSans',
      flex: 1,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 8,
    },
    rating: {
      fontSize: 12,
      color: colors.primary,
      fontWeight: '600',
      marginLeft: 4,
    },
    location: {
      fontSize: 14,
      color: colors.secondary,
      fontFamily: 'NotoSans',
    },
  });

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <MaterialIcons key={i} name="star" size={14} color={colors.primary} />
      );
    }
    
    return stars;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Image source={{ uri: destination.image }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{destination.name}</Text>
          <View style={styles.ratingContainer}>
            {renderStars(destination.rating)}
            <Text style={styles.rating}>{destination.rating}</Text>
          </View>
        </View>
        <Text style={styles.location}>{destination.country}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default DestinationCard;