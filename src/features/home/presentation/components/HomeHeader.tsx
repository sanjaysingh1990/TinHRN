import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';

interface HomeHeaderProps {
    onNotificationPress: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ onNotificationPress }) => {
    const { colors } = useTheme();

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onNotificationPress();
    };

    return (
        <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Tent'in Himalayas</Text>
            <TouchableOpacity style={styles.notificationIcon} onPress={handlePress}>
                <MaterialIcons name="notifications-none" size={24} color={colors.text} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    notificationIcon: {
        position: 'absolute',
        right: 15,
    },
});

export default HomeHeader;
