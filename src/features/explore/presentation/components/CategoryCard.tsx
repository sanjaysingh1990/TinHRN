import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';
import { Category } from '../../domain/entities/Explore';

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.cardBackgroundColor,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.borderColor,
      borderStyle: 'dashed',
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
      height: 120,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: category.color,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    categoryName: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      fontFamily: 'SplineSans',
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <MaterialIcons 
          name={category.icon as any} 
          size={20} 
          color="#FFFFFF" 
        />
      </View>
      <Text style={styles.categoryName}>{category.name}</Text>
    </TouchableOpacity>
  );
};

export default CategoryCard;