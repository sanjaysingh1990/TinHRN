import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';

interface ProfileSectionProps {
    title: string;
    children: React.ReactNode;
    style?: ViewStyle;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ title, children, style }) => {
    const { colors } = useTheme();

    return (
        <View style={[styles.card, { backgroundColor: colors.cardBackgroundColor, borderColor: colors.borderColor }, style]}>
            <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                <Text style={[styles.badgeText, { color: colors.background }]}>{title}</Text>
            </View>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        borderWidth: 1,
        borderStyle: 'dashed',
        padding: 20,
        marginBottom: 24,
        alignItems: 'center',
    },
    badge: {
        position: 'absolute',
        top: -14,
        borderRadius: 14,
        paddingVertical: 4,
        paddingHorizontal: 12,
    },
    badgeText: {
        fontWeight: 'bold',
        fontSize: 12,
    },
});

export default ProfileSection;
