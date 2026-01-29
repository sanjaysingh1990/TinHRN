import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useI18n } from '../../../../hooks/useI18n';
import { useTheme } from '../../../../hooks/useTheme';
import { Category } from '../../domain/entities/Explore';
import CategoryCard from './CategoryCard';
import CategoryShimmer from './CategoryShimmer';

interface ExploreCategoriesProps {
    categories: Category[];
    isLoading: boolean;
    onCategoryPress: (category: Category) => void;
}

const ExploreCategories: React.FC<ExploreCategoriesProps> = ({ categories, isLoading, onCategoryPress }) => {
    const { colors } = useTheme();
    const { t } = useI18n();

    const data = isLoading ? Array.from({ length: 4 }, (_, i) => i) : categories;

    const handlePress = (category: Category) => {
        Haptics.selectionAsync();
        onCategoryPress(category);
    };

    return (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('gallery.categories')}</Text>
            <View style={styles.categoriesGrid}>
                {data.map((item, index) => (
                    <View key={index} style={styles.categoryItem}>
                        {isLoading ? (
                            <CategoryShimmer />
                        ) : (
                            <CategoryCard
                                category={item as Category}
                                onPress={() => handlePress(item as Category)}
                            />
                        )}
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        paddingHorizontal: 20,
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        fontFamily: 'SplineSans',
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    categoryItem: {
        width: '48%',
        marginBottom: 16,
    },
});

export default ExploreCategories;
