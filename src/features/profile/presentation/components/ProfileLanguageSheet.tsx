import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';

interface ProfileLanguageSheetProps {
    bottomSheetRef: React.RefObject<BottomSheet | null>;
    snapPoints: string[];
    onSelectLanguage: (lang: string) => void;
}

const ProfileLanguageSheet: React.FC<ProfileLanguageSheetProps> = ({ bottomSheetRef, snapPoints, onSelectLanguage }) => {
    const { colors } = useTheme();

    const handleSelect = (lang: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onSelectLanguage(lang);
    };

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose
            backgroundStyle={{ backgroundColor: colors.cardBackgroundColor }}
        >
            <BottomSheetView style={[styles.bottomSheetContent, { backgroundColor: colors.cardBackgroundColor }]}>
                <TouchableOpacity style={styles.languageOption} onPress={() => handleSelect('English')}>
                    <Text style={{ color: colors.text }}>English</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.languageOption} onPress={() => handleSelect('Hindi')}>
                    <Text style={{ color: colors.text }}>Hindi</Text>
                </TouchableOpacity>
            </BottomSheetView>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    bottomSheetContent: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    languageOption: {
        padding: 15,
        width: '100%',
        alignItems: 'center',
    },
});

export default ProfileLanguageSheet;
