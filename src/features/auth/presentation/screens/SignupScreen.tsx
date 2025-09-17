import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import container from '../../../../container';
import { useTheme } from '../../../../hooks/useTheme';
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
  const styles = getAuthStyles(colors, isDarkMode ? 'dark' : 'light');
  const { signup: authSignup } = useAuth();

  const [viewModel] = useState(() => container.resolve<SignupViewModel>(SignupViewModelToken));
  const [countryCode, setCountryCode] = useState<CountryCode>('US');
  const [country, setCountry] = useState<Country | null>(null);

  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [viewState, setViewState] = useState(viewModel.viewState);
  const [formData, setFormData] = useState(viewModel.formData);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    viewModel.setUpdateCallback(() => {
      setViewState({ ...viewModel.viewState });
      setFormData({ ...viewModel.formData });
      
      // Show error toast if there's a general error
      if (viewModel.viewState.errors.general && !showErrorToast) {
        setErrorMessage(viewModel.viewState.errors.general);
        setShowErrorToast(true);
      }
    });

    return () => {
      viewModel.reset();
    };
  }, [showErrorToast]);

  const handleSignup = async () => {
    console.log('[SignupScreen] Starting signup process...');
    try {
      console.log('[SignupScreen] Calling viewModel.signup...');
      const user = await viewModel.signup();
      if (user) {
        console.log('[SignupScreen] Signup successful, user created:', {
          id: user.id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber
        });
        
        Alert.alert(
          'Account Created!', 
          'Your account has been created successfully. Please check your email for verification.',
          [
            {
              text: 'OK',
              onPress: () => {
                console.log('[SignupScreen] Navigating to tabs screen...');
                router.replace('/(tabs)');
              }
            }
          ]
        );
      } else {
        console.log('[SignupScreen] Signup returned null user');
        setErrorMessage('Signup failed. Please try again.');
        setShowErrorToast(true);
      }
    } catch (error: any) {
      console.error('[SignupScreen] Signup failed with error:', error);
      
      // Check if it's an email already exists error
      if (error.message && error.message.includes('already exists')) {
        Alert.alert(
          'Account Already Exists',
          'An account with this email already exists. Would you like to sign in instead?',
          [
            {
              text: 'Cancel',
              style: 'cancel'
            },
            {
              text: 'Sign In',
              onPress: () => {
                console.log('[SignupScreen] Redirecting to login screen...');
                router.push('/login');
              }
            }
          ]
        );
      } else {
        setErrorMessage(error.message || 'An error occurred during signup');
        setShowErrorToast(true);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ErrorToast 
        message={errorMessage}
        visible={showErrorToast}
        onHide={() => setShowErrorToast(false)}
      />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <AuthHeader title="Create Account" />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={{ height: 15 }} />

          <AuthInput
            placeholder="Name"
            value={formData.name}
            onChangeText={viewModel.setName.bind(viewModel)}
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
            accessibilityLabel="Name input"
            focused={nameFocused}
          />
          {viewState.errors.name && (
            <Text style={{ 
              color: isDarkMode ? '#ff6b6b' : '#ff4757', 
              fontSize: 12, 
              marginTop: 4, 
              marginBottom: 8,
              fontWeight: '500'
            }}>
              {viewState.errors.name}
            </Text>
          )}

          <AuthInput
            placeholder="Email"
            value={formData.email}
            onChangeText={viewModel.setEmail.bind(viewModel)}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            keyboardType="email-address"
            autoCapitalize="none"
            accessibilityLabel="Email input"
            focused={emailFocused}
          />
          {viewState.errors.email && (
            <Text style={{ 
              color: isDarkMode ? '#ff6b6b' : '#ff4757', 
              fontSize: 12, 
              marginTop: 4, 
              marginBottom: 8,
              fontWeight: '500'
            }}>
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
                setCountryCode(country.cca2);
                setCountry(country);
                viewModel.setCountryInfo(country.cca2, country.callingCode ? `+${country.callingCode[0]}` : '+1');
              }}
              countryCode={countryCode}
            />
            <AuthInput
              placeholder="Phone Number"
              value={formData.phone}
              onChangeText={viewModel.setPhone.bind(viewModel)}
              onFocus={() => setPhoneFocused(true)}
              onBlur={() => setPhoneFocused(false)}
              keyboardType="phone-pad"
              accessibilityLabel="Phone number input"
              focused={phoneFocused}
              style={{
                flex: 1, 
                paddingHorizontal: 0, 
                backgroundColor: 'transparent', 
                marginBottom: 0,
                color: colors.text
              }}
            />
          </View>
          {viewState.errors.phone && (
            <Text style={{ 
              color: isDarkMode ? '#ff6b6b' : '#ff4757', 
              fontSize: 12, 
              marginTop: 4, 
              marginBottom: 8,
              fontWeight: '500'
            }}>
              {viewState.errors.phone}
            </Text>
          )}
          
          <View style={styles.passwordContainer}>
            <AuthInput
              placeholder="Password"
              value={formData.password}
              onChangeText={viewModel.setPassword.bind(viewModel)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              secureTextEntry={!showPassword}
              accessibilityLabel="Password input"
              focused={passwordFocused}
              style={{
                flex: 1, 
                paddingHorizontal: 0, 
                backgroundColor: 'transparent', 
                marginBottom: 0,
                color: colors.text
              }}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <MaterialIcons name={showPassword ? 'visibility-off' : 'visibility'} size={24} color={colors.secondary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.passwordNote}>Use 8 or more characters with a mix of letters, numbers & symbols.</Text>
          {viewState.errors.password && (
            <Text style={{ 
              color: isDarkMode ? '#ff6b6b' : '#ff4757', 
              fontSize: 12, 
              marginTop: 4, 
              marginBottom: 8,
              fontWeight: '500'
            }}>
              {viewState.errors.password}
            </Text>
          )}

          <View style={styles.passwordContainer}>
            <AuthInput
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={viewModel.setConfirmPassword.bind(viewModel)}
              onFocus={() => setConfirmPasswordFocused(true)}
              onBlur={() => setConfirmPasswordFocused(false)}
              secureTextEntry={!showConfirmPassword}
              accessibilityLabel="Confirm password input"
              focused={confirmPasswordFocused}
              style={{
                flex: 1, 
                paddingHorizontal: 0, 
                backgroundColor: 'transparent', 
                marginBottom: 0,
                color: colors.text
              }}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
              <MaterialIcons name={showConfirmPassword ? 'visibility-off' : 'visibility'} size={24} color={colors.secondary} />
            </TouchableOpacity>
          </View>
          {viewState.errors.confirmPassword && (
            <Text style={{ 
              color: isDarkMode ? '#ff6b6b' : '#ff4757', 
              fontSize: 12, 
              marginTop: 4, 
              marginBottom: 8,
              fontWeight: '500'
            }}>
              {viewState.errors.confirmPassword}
            </Text>
          )}

          <AuthButton 
            title={viewState.isLoading ? "Creating Account..." : "Sign Up"} 
            onPress={handleSignup} 
            accessibilityLabel="Sign up button"
            disabled={viewState.isLoading}
          />

          <View style={styles.dividerContainer}>
            <View style={styles.stitch} />
            <Text style={styles.dividerText}>Or continue with</Text>
            <View style={styles.stitch} />
          </View>

          <SocialButtons />

          <AuthFooter 
            text="Already have an account? "
            linkText="Sign In"
            onPress={() => router.back()}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen;