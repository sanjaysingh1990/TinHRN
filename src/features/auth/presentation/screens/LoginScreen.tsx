import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useI18n } from '../../../../hooks/useI18n';
import { useTheme } from '../../../../hooks/useTheme';
import { useViewModel } from '../../../../hooks/useViewModel';
import { LoginViewModelToken } from '../../auth.di';
import AuthButton from '../components/AuthButton';
import AuthFooter from '../components/AuthFooter';
import AuthInput from '../components/AuthInput';
import ErrorToast from '../components/ErrorToast';
import SocialButtons from '../components/SocialButtons';
import { useAuth } from '../context/AuthContext';
import { getAuthStyles } from '../styles/auth.styles';
import { LoginViewModel } from '../viewmodels/LoginViewModel';

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const { t } = useI18n();
  const styles = getAuthStyles(colors, isDarkMode ? 'dark' : 'light');
  const { isLoading: authLoading } = useAuth();

  const viewModel = useViewModel<LoginViewModel>(LoginViewModelToken);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { viewState, formData } = viewModel;

  const handleLogin = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (!viewState.isFormValid) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      viewModel.validateFormManually();
      return;
    }

    try {
      const user = await viewModel.login();
      if (user) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        try {
          await AsyncStorage.setItem('@viewedOnboarding', 'true');
        } catch (error) {
          console.error('Error setting onboarding flag:', error);
        }
        router.replace('/(tabs)');
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setErrorMessage(viewState.errors.general || 'Login failed. Please try again.');
        setShowErrorToast(true);
      }
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setErrorMessage(error.message || 'An error occurred during login');
      setShowErrorToast(true);
    }
  };

  const handleForgotPassword = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Forgot Password', 'This feature will be implemented soon.');
  };

  const handleSignUpPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/signup');
  };

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
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../../../assets/images/icon.png')}
          style={styles.appLogo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.title}>{t('auth.loginTitle')}</Text>
      <Text style={styles.subtitle}>{t('auth.loginSubtitle')}</Text>

      <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
        <Text style={styles.forgotPasswordText}>{t('auth.forgotPassword')}</Text>
      </TouchableOpacity>

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

      <View style={styles.passwordContainer}>
        <AuthInput
          placeholder={t('auth.passwordPlaceholder')}
          value={formData.password}
          onChangeText={viewModel.setPassword.bind(viewModel)}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
          secureTextEntry={!showPassword}
          focused={passwordFocused}
          style={styles.passwordInput}
        />
        <TouchableOpacity onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setShowPassword(!showPassword);
        }} style={styles.eyeIcon}>
          <MaterialIcons name={showPassword ? 'visibility-off' : 'visibility'} size={24} color={colors.secondary} />
        </TouchableOpacity>
      </View>
      {viewState.errors.password && (
        <Text style={[styles.errorText, { color: isDarkMode ? '#ff6b6b' : '#ff4757' }]}>
          {viewState.errors.password}
        </Text>
      )}

      <AuthButton
        title={viewState.isLoading ? t('auth.loggingIn') : t('auth.loginButton')}
        onPress={handleLogin}
        accessibilityLabel="Login button"
        disabled={viewState.isLoading}
      />

      <View style={styles.dividerContainer}>
        <View style={styles.stitch} />
        <Text style={styles.dividerText}>{t('auth.socialLogin')}</Text>
        <View style={styles.stitch} />
      </View>

      {authLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>{t('auth.signingIn')}</Text>
        </View>
      ) : (
        <SocialButtons />
      )}

      <AuthFooter
        text={t('auth.noAccount')}
        linkText={t('auth.signUp')}
        onPress={handleSignUpPress}
      />
    </SafeAreaView>
  );
};

export default LoginScreen;