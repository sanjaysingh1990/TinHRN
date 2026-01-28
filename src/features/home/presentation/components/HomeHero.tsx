import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';

interface HomeHeroProps {
    onExplorePress: () => void;
}

const HomeHero: React.FC<HomeHeroProps> = ({ onExplorePress }) => {
    const { colors } = useTheme();

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onExplorePress();
    };

    return (
        <View style={styles.heroSection}>
            <ImageBackground
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2R-D8bon07gNln5JYqh2DiwvqM5mD-4EtOIjoAPGd1e-IrwZseSxR8ONqLPRRLEQIturvHZWU1YaxJ4rQ04GAeWG_-1OroireJvI9p-tIbeYAr9-ryL9A0-ZhWhtaVzVlWyEf0B3BHjONWCgXJeA0h7UTbaSfTCYBP0y05epzqCjgkpxPQlwsocRiwiOcPDLzkcc8bz7RweQ2XS3mSt1ae7b_WqpaZTjeMw2a4YKn4LZQFS4CUzSVkehP3SQU99sezw5okLxauKCC' }}
                style={StyleSheet.absoluteFillObject}
            />
            <LinearGradient
                colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.4)']}
                style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>Discover the Himalayas</Text>
                <Text style={styles.heroSubtitle}>Your next adventure awaits</Text>
                <TouchableOpacity style={[styles.heroButton, { backgroundColor: colors.primary }]} onPress={handlePress}>
                    <Text style={[styles.heroButtonText, { color: colors.background }]}>Explore Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    heroSection: {
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 15,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    heroContent: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    heroSubtitle: {
        fontSize: 16,
        color: '#FFFFFF',
        textAlign: 'center',
        marginTop: 10,
    },
    heroButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 20,
    },
    heroButtonText: {
        fontWeight: 'bold',
    },
});

export default HomeHero;
