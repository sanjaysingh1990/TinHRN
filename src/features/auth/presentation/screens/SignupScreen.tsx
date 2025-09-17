import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Alert
} from 'react-native';
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../../hooks/useTheme';
import container from '../../../../container';
import { SignupViewModelToken } from '../../auth.di';
import { SignupViewModel } from '../viewmodels/SignupViewModel';
import { useAuth } from '../context/AuthContext';
import AuthButton from '../components/AuthButton';
import AuthFooter from '../components/AuthFooter';
import AuthHeader from '../components/AuthHeader';
import AuthInput from '../components/AuthInput';
import SocialButtons from '../components/SocialButtons';
import { getAuthStyles } from '../styles/auth.styles';

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

  useEffect(() => {
    viewModel.setUpdateCallback(() => {
      setViewState({ ...viewModel.viewState });
      setFormData({ ...viewModel.formData });
    });

    return () => {
      viewModel.reset();
    };
  }, []);

  const handleSignup = async () => {
    try {
      const user = await viewModel.signup();
      if (user) {
        // Use the AuthContext signup as well to update global state
        await authSignup(formData.name, formData.email, formData.password);
        Alert.alert(
          'Account Created!', 
          'Your account has been created successfully. Please check your email for verification.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(tabs)')
            }
          ]
        );
      }
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message || 'An error occurred during signup');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <AuthHeader title="Create Account" />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={{ height: 15 }} />
          
          {viewState.errors.general && (
            <View style={{ backgroundColor: '#ff6b6b', padding: 12, borderRadius: 8, marginBottom: 16 }}>
              <Text style={{ color: 'white', fontSize: 14 }}>{viewState.errors.general}</Text>
            </View>
          )}

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
            <Text style={{ color: '#ff6b6b', fontSize: 12, marginTop: 4, marginBottom: 8 }}>
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
            <Text style={{ color: '#ff6b6b', fontSize: 12, marginTop: 4, marginBottom: 8 }}>
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
              style={{flex: 1}}
            />
          </View>
          {viewState.errors.phone && (
            <Text style={{ color: '#ff6b6b', fontSize: 12, marginTop: 4, marginBottom: 8 }}>
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
              style={{flex: 1, paddingHorizontal: 0, backgroundColor: 'transparent', marginBottom: 0}}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <MaterialIcons name={showPassword ? 'visibility-off' : 'visibility'} size={24} color={colors.secondary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.passwordNote}>Use 8 or more characters with a mix of letters, numbers & symbols.</Text>
          {viewState.errors.password && (
            <Text style={{ color: '#ff6b6b', fontSize: 12, marginTop: 4, marginBottom: 8 }}>
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
              style={{flex: 1, paddingHorizontal: 0, backgroundColor: 'transparent', marginBottom: 0}}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
              <MaterialIcons name={showConfirmPassword ? 'visibility-off' : 'visibility'} size={24} color={colors.secondary} />
            </TouchableOpacity>
          </View>
          {viewState.errors.confirmPassword && (
            <Text style={{ color: '#ff6b6b', fontSize: 12, marginTop: 4, marginBottom: 8 }}>
              {viewState.errors.confirmPassword}
            </Text>
          )}

          <AuthButton 
            title={viewState.isLoading ? "Creating Account..." : "Sign Up"} 
            onPress={handleSignup} 
            accessibilityLabel="Sign up button" 
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