
import React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import { Favorite } from '../../domain/models/Favorite';

interface FavoriteCardProps {
  favorite: Favorite;
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({ favorite }) => {
  return (
    <ImageBackground
      source={{ uri: favorite.imageUrl }}
      style={styles.container}
      imageStyle={styles.image}
    >
      <View style={styles.overlay} />
      <Text style={styles.title}>{favorite.title}</Text>
      <Text style={styles.location}>{favorite.location}</Text>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: 15,
    marginBottom: 15,
    marginHorizontal: 10,
  },
  image: {
    borderRadius: 12,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  location: {
    fontSize: 14,
    color: '#fff',
  },
});

export default FavoriteCard;
