import * as Haptics from 'expo-haptics';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';
import { Destination } from '../../domain/entities/Explore';
import DestinationCard from './DestinationCard';
import DestinationShimmer from './DestinationShimmer';

interface ExploreDestinationsProps {
    destinations: Destination[];
    isLoading: boolean;
    onDestinationPress: (destination: Destination) => void;
}

const ExploreDestinations: React.FC<ExploreDestinationsProps> = ({ destinations, isLoading, onDestinationPress }) => {
    const { colors } = useTheme();

    const data = isLoading ? Array.from({ length: 5 }, (_, i) => i) : destinations;

    const handlePress = (destination: Destination) => {
        Haptics.selectionAsync();
        onDestinationPress(destination);
    };

    const renderItem = ({ item }: { item: Destination | number }) => {
        if (isLoading) {
            return <DestinationShimmer />;
        }
        return (
            <DestinationCard
                destination={item as Destination}
                onPress={() => handlePress(item as Destination)}
            />
        );
    };

    return (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Popular Destinations</Text>
            <FlatList
                data={data}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={renderItem}
                keyExtractor={(_, index) => `destination-${index}`}
                contentContainerStyle={styles.container}
            />
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
    container: {
        paddingLeft: 0,
    },
});

export default ExploreDestinations;
