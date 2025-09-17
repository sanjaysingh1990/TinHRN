import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import container from '../../../../container';
import { useTheme } from '../../../../hooks/useTheme';
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
  const styles = getAuthStyles(colors, isDarkMode ? 'dark' : 'light');
  const { login: authLogin } = useAuth();
  
  const [viewModel] = useState(() => container.resolve<LoginViewModel>(LoginViewModelToken));
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [viewState, setViewState] = useState(viewModel.viewState);
  const [formData, setFormData] = useState(viewModel.formData);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    viewModel.setUpdateCallback(() => {
      setViewState({ ...viewModel.viewState });
      // Only update formData if it's actually different to prevent unnecessary resets
      setFormData(prevFormData => {
        if (prevFormData.email !== viewModel.formData.email || 
            prevFormData.password !== viewModel.formData.password) {
          return { ...viewModel.formData };
        }
        return prevFormData;
      });
      
      // Show error toast if there's a general error
      if (viewModel.viewState.errors.general && !showErrorToast) {
        setErrorMessage(viewModel.viewState.errors.general);
        setShowErrorToast(true);
      }
    });

    // Don't reset the form when component unmounts to preserve user input
    return () => {
      // viewModel.reset(); // Commented out to preserve form data
    };
  }, []); // Empty dependency array to only run once on mount

  const handleLogin = async () => {
    console.log('[LoginScreen] Starting login process...');
    
    // First validate the form
    viewModel.validateFormManually();
    
    // Check if form is valid before proceeding
    if (!viewModel.viewState.isFormValid) {
      console.log('[LoginScreen] Form validation failed, not proceeding with login');
      console.log('[LoginScreen] Validation errors:', viewModel.viewState.errors);
      return;
    }
    
    try {
      console.log('[LoginScreen] Form is valid, calling viewModel.login...');
      const user = await viewModel.login();
      if (user) {
        console.log('[LoginScreen] Login successful, user:', {
          id: user.id,
          name: user.name,
          email: user.email
        });
        
        router.replace('/(tabs)');
      } else {
        console.log('[LoginScreen] Login returned null user');
        // Use the specific error message from the ViewModel if available
        const viewModelErrorMessage = viewModel.viewState.errors.general;
        if (viewModelErrorMessage) {
          setErrorMessage(viewModelErrorMessage);
        } else {
          setErrorMessage('Login failed. Please try again.');
        }
        setShowErrorToast(true);
        // Don't clear the form fields on error
      }
    } catch (error: any) {
      console.error('[LoginScreen] Login failed with error:', error);
      
      // Parse the error to show exact message
      let errorMessage = 'An error occurred during login';
      
      // Check if it's our custom AuthenticationError (from AuthRepository)
      if (error.name === 'AuthenticationError' && error.message) {
        errorMessage = error.message;
      }
      // Check if it's a direct Firebase error with a code
      else if (error.code && error.message) {
        errorMessage = error.message;
      }
      // Check if it's a general error with message
      else if (error.message) {
        errorMessage = error.message;
      }
      
      setErrorMessage(errorMessage);
      setShowErrorToast(true);
      // Don't clear the form fields on error
    }
  };

  const handleForgotPassword = () => {
    // TODO: Navigate to forgot password screen
    Alert.alert('Forgot Password', 'This feature will be implemented soon.');
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
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Log in to continue your adventure.</Text>
      
      <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <AuthInput
        placeholder="Email or Username"
        value={formData.email}
        onChangeText={viewModel.setEmail.bind(viewModel)}
        onFocus={() => setEmailFocused(true)}
        onBlur={() => setEmailFocused(false)}
        keyboardType="email-address"
        autoCapitalize="none"
        accessibilityLabel="Email or Username input"
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
      
      <AuthInput
        placeholder="Password"
        value={formData.password}
        onChangeText={viewModel.setPassword.bind(viewModel)}
        onFocus={() => setPasswordFocused(true)}
        onBlur={() => setPasswordFocused(false)}
        secureTextEntry
        accessibilityLabel="Password input"
        focused={passwordFocused}
      />
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

      <AuthButton 
        title={viewState.isLoading ? "Logging In..." : "Log In"} 
        onPress={handleLogin} 
        accessibilityLabel="Login button"
        disabled={viewState.isLoading}
      />

      <View style={styles.dividerContainer}>
        <View style={styles.stitch} />
        <Text style={styles.dividerText}>Or log in with</Text>
        <View style={styles.stitch} />
      </View>

      <SocialButtons />

      <AuthFooter 
        text="Don't have an account? "
        linkText="Sign up"
        onPress={() => router.push('/signup')}
      />
    </SafeAreaView>
  );
};

export default LoginScreen;