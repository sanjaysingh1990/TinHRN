import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Image, SafeAreaView, StatusBar, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';
import container from '../../../../container';
import { LoginViewModelToken } from '../../auth.di';
import { LoginViewModel } from '../viewmodels/LoginViewModel';
import { useAuth } from '../context/AuthContext';
import AuthButton from '../components/AuthButton';
import AuthFooter from '../components/AuthFooter';
import AuthInput from '../components/AuthInput';
import SocialButtons from '../components/SocialButtons';
import { getAuthStyles } from '../styles/auth.styles';

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

  useEffect(() => {
    viewModel.setUpdateCallback(() => {
      setViewState({ ...viewModel.viewState });
      setFormData({ ...viewModel.formData });
    });

    return () => {
      viewModel.reset();
    };
  }, []);

  const handleLogin = async () => {
    try {
      const user = await viewModel.login();
      if (user) {
        // Use the AuthContext login as well to update global state
        await authLogin(formData.email, formData.password);
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'An error occurred during login');
    }
  };

  const handleForgotPassword = () => {
    // TODO: Navigate to forgot password screen
    Alert.alert('Forgot Password', 'This feature will be implemented soon.');
  };

  return (
    <SafeAreaView style={styles.container}>
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

      {viewState.errors.general && (
        <View style={{ backgroundColor: '#ff6b6b', padding: 12, borderRadius: 8, marginBottom: 16 }}>
          <Text style={{ color: 'white', fontSize: 14 }}>{viewState.errors.general}</Text>
        </View>
      )}

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
        <Text style={{ color: '#ff6b6b', fontSize: 12, marginTop: 4, marginBottom: 8 }}>
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
        <Text style={{ color: '#ff6b6b', fontSize: 12, marginTop: 4, marginBottom: 8 }}>
          {viewState.errors.password}
        </Text>
      )}

      <AuthButton 
        title={viewState.isLoading ? "Logging In..." : "Log In"} 
        onPress={handleLogin} 
        accessibilityLabel="Login button"
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