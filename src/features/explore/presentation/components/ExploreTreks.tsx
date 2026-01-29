import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useI18n } from '../../../../hooks/useI18n';
import { useTheme } from '../../../../hooks/useTheme';
import { TopTrek } from '../../domain/entities/Explore';
import TrekCard from './TrekCard';
import TrekShimmer from './TrekShimmer';

interface ExploreTreksProps {
    treks: TopTrek[];
    isLoading: boolean;
    onTrekExplore: (trek: TopTrek) => void;
}

const ExploreTreks: React.FC<ExploreTreksProps> = ({ treks, isLoading, onTrekExplore }) => {
    const { colors } = useTheme();
    const { t } = useI18n();

    const data = isLoading ? Array.from({ length: 5 }, (_, i) => i) : treks;

    if (!isLoading && treks.length === 0) return null;

    const handleExplore = (trek: TopTrek) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onTrekExplore(trek);
    };

    return (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('home.hotTours')}</Text>
            <View style={styles.treksContainer}>
                {data.map((item, index) => (
                    <View key={index}>
                        {isLoading ? (
                            <TrekShimmer />
                        ) : (
                            <TrekCard
                                trek={item as TopTrek}
                                onExplore={() => handleExplore(item as TopTrek)}
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
    treksContainer: {
        paddingHorizontal: 0,
    },
});

export default ExploreTreks;
