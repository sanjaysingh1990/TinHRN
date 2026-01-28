import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';

interface ExploreHeaderProps {
    hideHeader?: boolean;
    isDarkMode: boolean;
    onSearchPress: () => void;
}

const ExploreHeader: React.FC<ExploreHeaderProps> = ({ hideHeader, isDarkMode, onSearchPress }) => {
    const { colors } = useTheme();

    if (hideHeader) return null;

    const handleSearchPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onSearchPress();
    };

    return (
        <>
            <StatusBar style={isDarkMode ? 'light' : 'dark'} />
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Explore</Text>
                <TouchableOpacity
                    style={[styles.searchButton, { backgroundColor: colors.cardBackgroundColor, borderColor: colors.borderColor }]}
                    onPress={handleSearchPress}
                >
                    <MaterialIcons name="search" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingTop: 40,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        fontFamily: 'SplineSans',
    },
    searchButton: {
        padding: 8,
        borderRadius: 12,
        borderWidth: 1,
    },
});

export default ExploreHeader;
