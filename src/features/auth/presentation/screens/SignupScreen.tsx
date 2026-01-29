import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import CountryPicker, { CountryCode } from 'react-native-country-picker-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useI18n } from '../../../../hooks/useI18n';
import { useTheme } from '../../../../hooks/useTheme';
import { useViewModel } from '../../../../hooks/useViewModel';
import { SignupViewModelToken } from '../../auth.di';
import AuthButton from '../components/AuthButton';
import AuthFooter from '../components/AuthFooter';
import AuthHeader from '../components/AuthHeader';
import AuthInput from '../components/AuthInput';
import ErrorToast from '../components/ErrorToast';
import SocialButtons from '../components/SocialButtons';
import { useAuth } from '../context/AuthContext';
import { getAuthStyles } from '../styles/auth.styles';
import { SignupViewModel } from '../viewmodels/SignupViewModel';

const SignupScreen: React.FC = () => {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const { t } = useI18n();
  const styles = getAuthStyles(colors, isDarkMode ? 'dark' : 'light');
  const { isLoading: authLoading } = useAuth();

  const viewModel = useViewModel<SignupViewModel>(SignupViewModelToken);
  const [countryCode, setCountryCode] = useState<CountryCode>('US');
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    viewModel.setCountryInfo('US', '+1');
  }, [viewModel]);

  const { viewState, formData } = viewModel;

  const handleSignup = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (!viewState.isFormValid) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      viewModel.validateFormManually();
      return;
    }

    try {
      const user = await viewModel.signup();
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
        setErrorMessage(viewState.errors.general || 'Signup failed. Please try again.');
        setShowErrorToast(true);
      }
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setErrorMessage(error.message || 'An error occurred during signup');
      setShowErrorToast(true);
    }
  };

  const handleSigninPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }

  return (
    <SafeAreaView style={styles.container}>
      <ErrorToast
        message={errorMessage}
        visible={showErrorToast}
        onHide={() => setShowErrorToast(false)}
      />
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <AuthHeader title={t('auth.createAccount')} />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={{ height: 15 }} />

          <AuthInput
            placeholder={t('auth.namePlaceholder')}
            value={formData.name}
            onChangeText={viewModel.setName.bind(viewModel)}
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
            focused={nameFocused}
          />
          {viewState.errors.name && (
            <Text style={[styles.errorText, { color: isDarkMode ? '#ff6b6b' : '#ff4757' }]}>
              {viewState.errors.name}
            </Text>
          )}

          <AuthInput
            placeholder={t('auth.email')}
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

          <View style={styles.phoneInputContainer}>
            <CountryPicker
              withFilter
              withFlag
              withCountryNameButton={false}
              withAlphaFilter
              withCallingCode
              withEmoji
              onSelect={(country) => {
                Haptics.selectionAsync();
                setCountryCode(country.cca2);
                viewModel.setCountryInfo(country.cca2, country.callingCode ? `+${country.callingCode[0]}` : '+1');
              }}
              countryCode={countryCode}
            />
            <AuthInput
              placeholder={t('auth.phonePlaceholder')}
              value={formData.phone}
              onChangeText={viewModel.setPhone.bind(viewModel)}
              onFocus={() => setPhoneFocused(true)}
              onBlur={() => setPhoneFocused(false)}
              keyboardType="phone-pad"
              focused={phoneFocused}
              style={styles.phoneInput}
            />
          </View>
          {viewState.errors.phone && (
            <Text style={[styles.errorText, { color: isDarkMode ? '#ff6b6b' : '#ff4757' }]}>
              {viewState.errors.phone}
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
          <Text style={styles.passwordNote}>{t('auth.passwordNote')}</Text>
          {viewState.errors.password && (
            <Text style={[styles.errorText, { color: isDarkMode ? '#ff6b6b' : '#ff4757' }]}>
              {viewState.errors.password}
            </Text>
          )}

          <View style={styles.passwordContainer}>
            <AuthInput
              placeholder={t('auth.confirmPassword')}
              value={formData.confirmPassword}
              onChangeText={viewModel.setConfirmPassword.bind(viewModel)}
              onFocus={() => setConfirmPasswordFocused(true)}
              onBlur={() => setConfirmPasswordFocused(false)}
              secureTextEntry={!showConfirmPassword}
              focused={confirmPasswordFocused}
              style={styles.passwordInput}
            />
            <TouchableOpacity onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowConfirmPassword(!showConfirmPassword);
            }} style={styles.eyeIcon}>
              <MaterialIcons name={showConfirmPassword ? 'visibility-off' : 'visibility'} size={24} color={colors.secondary} />
            </TouchableOpacity>
          </View>
          {viewState.errors.confirmPassword && (
            <Text style={[styles.errorText, { color: isDarkMode ? '#ff6b6b' : '#ff4757' }]}>
              {viewState.errors.confirmPassword}
            </Text>
          )}

          <AuthButton
            title={viewState.isLoading ? t('auth.creatingAccount') : t('auth.signUpButton')}
            onPress={handleSignup}
            accessibilityLabel="Sign up button"
            disabled={viewState.isLoading}
          />

          <View style={styles.dividerContainer}>
            <View style={styles.stitch} />
            <Text style={styles.dividerText}>{t('auth.socialSignup')}</Text>
            <View style={styles.stitch} />
          </View>

          {authLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.text }]}>{t('auth.signingUp')}</Text>
            </View>
          ) : (
            <SocialButtons />
          )}

          <AuthFooter
            text={t('auth.hasAccount')}
            linkText={t('auth.signIn')}
            onPress={handleSigninPress}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen;