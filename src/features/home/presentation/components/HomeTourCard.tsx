import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';
import { Tour } from '../../domain/entities/Tour';

interface HomeTourCardProps {
    tour: Tour;
}

const HomeTourCard: React.FC<HomeTourCardProps> = ({ tour }) => {
    const router = useRouter();
    const { colors } = useTheme();

    const handleExplore = () => {
        Haptics.selectionAsync();
        router.push({
            pathname: '/tour/[id]',
            params: {
                id: typeof tour.id === 'number' ? tour.id.toString() : tour.id,
                name: tour.name,
                image: tour.image
            }
        });
    };

    return (
        <View style={[styles.tourCard, { backgroundColor: colors.inputBackground }]}>
            <Image source={{ uri: tour.image }} style={styles.tourImage} />
            <View style={styles.tourInfo}>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.tourName, { color: colors.text }]}>{tour.name}</Text>
                    <Text style={[styles.tourDuration, { color: colors.secondary }]}>{tour.duration}</Text>
                </View>
                <TouchableOpacity style={[styles.exploreButton, { backgroundColor: colors.primary }]} onPress={handleExplore}>
                    <Text style={[styles.exploreButtonText, { color: colors.background }]}>Explore</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    tourCard: {
        flex: 1,
        margin: 7.5,
        borderRadius: 12,
        overflow: 'hidden',
    },
    tourImage: {
        width: '100%',
        height: 150,
    },
    tourInfo: {
        flex: 1,
        padding: 10,
        justifyContent: 'space-between',
    },
    tourName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    tourDuration: {
        marginTop: 4,
    },
    exploreButton: {
        padding: 8,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    exploreButtonText: {
        fontWeight: 'bold',
    },
});

export default HomeTourCard;
