import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useI18n } from '../../../../hooks/useI18n';
import { useTheme } from '../../../../hooks/useTheme';
import { useViewModel } from '../../../../hooks/useViewModel';
import { ForgotPasswordViewModelToken } from '../../auth.di';
import AuthButton from '../components/AuthButton';
import AuthFooter from '../components/AuthFooter';
import AuthInput from '../components/AuthInput';
import ErrorToast from '../components/ErrorToast';
import { getAuthStyles } from '../styles/auth.styles';
import { ForgotPasswordViewModel } from '../viewmodels/ForgotPasswordViewModel';

const ForgotPasswordScreen: React.FC = () => {
    const router = useRouter();
    const { colors, isDarkMode } = useTheme();
    const { t } = useI18n();
    const styles = getAuthStyles(colors, isDarkMode ? 'dark' : 'light');

    const viewModel = useViewModel<ForgotPasswordViewModel>(ForgotPasswordViewModelToken);
    const [emailFocused, setEmailFocused] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { viewState, formData } = viewModel;

    const handleResetPassword = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        if (!viewState.isFormValid) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            viewModel.validateFormManually();
            return;
        }

        try {
            const success = await viewModel.sendResetEmail();
            if (success) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } else {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                if (viewState.errors.general) {
                    setErrorMessage(viewState.errors.general);
                    setShowErrorToast(true);
                }
            }
        } catch (error: any) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            setErrorMessage(error.message || 'An error occurred');
            setShowErrorToast(true);
        }
    };

    const handleBackToLogin = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.back();
    };

    // Success state - email sent
    if (viewState.isEmailSent) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar
                    barStyle={isDarkMode ? "light-content" : "dark-content"}
                    backgroundColor={colors.background}
                />

                <TouchableOpacity
                    style={[styles.backButton, { position: 'relative', left: 0, marginTop: 10, marginLeft: 15 }]}
                    onPress={handleBackToLogin}
                >
                    <MaterialIcons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>

                <View style={styles.logoContainer}>
                    <View style={{
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        backgroundColor: colors.primary + '20',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <MaterialIcons name="mark-email-read" size={40} color={colors.primary} />
                    </View>
                </View>

                <Text style={styles.title}>{t('auth.checkEmail')}</Text>
                <Text style={[styles.subtitle, { marginBottom: 20 }]}>
                    {t('auth.resetEmailSent')}
                </Text>
                <Text style={[styles.subtitle, { color: colors.primary, fontWeight: '600' }]}>
                    {formData.email}
                </Text>
                <Text style={[styles.subtitle, { marginTop: 20 }]}>
                    {t('auth.resetEmailInstructions')}
                </Text>

                <View style={{ marginTop: 30 }}>
                    <AuthButton
                        title={t('auth.backToLogin')}
                        onPress={handleBackToLogin}
                        accessibilityLabel="Back to login button"
                    />
                </View>

                <TouchableOpacity
                    style={{ marginTop: 20, alignItems: 'center' }}
                    onPress={handleResetPassword}
                >
                    <Text style={{ color: colors.primary, fontSize: 14 }}>
                        {t('auth.resendEmail')}
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ErrorToast
                message={errorMessage}
                visible={showErrorToast}
                onHide={() => setShowErrorToast(false)}
            />
            <StatusBar
                barStyle={isDarkMode ? "light-content" : "dark-content"}
                backgroundColor={colors.background}
            />

            <TouchableOpacity
                style={[styles.backButton, { position: 'relative', left: 0, marginTop: 10, marginLeft: 15 }]}
                onPress={handleBackToLogin}
            >
                <MaterialIcons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>

            <View style={styles.logoContainer}>
                <Image
                    source={require('../../../../../assets/images/icon.png')}
                    style={styles.appLogo}
                    resizeMode="contain"
                />
            </View>

            <Text style={styles.title}>{t('auth.forgotPasswordTitle')}</Text>
            <Text style={styles.subtitle}>{t('auth.forgotPasswordSubtitle')}</Text>

            <AuthInput
                placeholder={t('auth.emailPlaceholder')}
                value={formData.email}
                onChangeText={viewModel.setEmail.bind(viewModel)}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                keyboardType="email-address"
                autoCapitalize="none"
                focused={emailFocused}
            />
            {viewState.errors.email && (
                <Text style={[styles.errorText, { color: isDarkMode ? '#ff6b6b' : '#ff4757' }]}>
                    {viewState.errors.email}
                </Text>
            )}

            <AuthButton
                title={viewState.isLoading ? t('auth.sendingEmail') : t('auth.sendResetLink')}
                onPress={handleResetPassword}
                accessibilityLabel="Send reset link button"
                disabled={viewState.isLoading}
            />

            <AuthFooter
                text={t('auth.rememberPassword')}
                linkText={t('auth.signIn')}
                onPress={handleBackToLogin}
            />
        </SafeAreaView>
    );
};

export default ForgotPasswordScreen;
