import { MaterialIcons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useI18n } from '../../../../hooks/useI18n';
import { useTheme } from '../../../../hooks/useTheme';

interface ProfileLanguageSheetProps {
    bottomSheetRef: React.RefObject<BottomSheet | null>;
    snapPoints: string[];
    onSelectLanguage: (lang: 'en' | 'hi') => void;
}

const ProfileLanguageSheet: React.FC<ProfileLanguageSheetProps> = ({ bottomSheetRef, snapPoints, onSelectLanguage }) => {
    const { colors } = useTheme();
    const { locale, t } = useI18n();

    const handleSelect = (lang: 'en' | 'hi') => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onSelectLanguage(lang);
    };

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose
            backgroundStyle={{ backgroundColor: colors.cardBackgroundColor, borderRadius: 24 }}
        >
            <BottomSheetView style={[styles.bottomSheetContent, { backgroundColor: colors.cardBackgroundColor }]}>
                <Text style={[styles.sheetTitle, { color: colors.text }]}>{t('profile.selectLanguage')}</Text>

                <TouchableOpacity
                    style={[styles.languageOption, locale === 'en' && { backgroundColor: colors.primary + '10' }]}
                    onPress={() => handleSelect('en')}
                >
                    <Text style={{ color: colors.text, fontWeight: locale === 'en' ? 'bold' : 'normal' }}>English</Text>
                    {locale === 'en' && <MaterialIcons name="check" size={20} color={colors.primary} />}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.languageOption, locale === 'hi' && { backgroundColor: colors.primary + '10' }]}
                    onPress={() => handleSelect('hi')}
                >
                    <Text style={{ color: colors.text, fontWeight: locale === 'hi' ? 'bold' : 'normal' }}>Hindi (हिंदी)</Text>
                    {locale === 'hi' && <MaterialIcons name="check" size={20} color={colors.primary} />}
                </TouchableOpacity>
            </BottomSheetView>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    bottomSheetContent: {
        flex: 1,
        alignItems: 'center',
        padding: 24,
    },
    sheetTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    languageOption: {
        padding: 16,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 12,
        marginBottom: 8,
    },
});

export default ProfileLanguageSheet;
