import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, SafeAreaView, StatusBar, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { theme } from '../../../../theme';
import AuthButton from '../components/AuthButton';
import AuthFooter from '../components/AuthFooter';
import AuthInput from '../components/AuthInput';
import SocialButtons from '../components/SocialButtons';
import { getAuthStyles } from '../styles/auth.styles';

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = theme[colorScheme];
  const styles = getAuthStyles(colors, colorScheme);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleLogin = () => {
    // TODO: Implement login logic
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle={colorScheme === 'dark' ? "light-content" : "dark-content"} 
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
      
      <TouchableOpacity style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <AuthInput
        placeholder="Email or Username"
        value={email}
        onChangeText={setEmail}
        onFocus={() => setEmailFocused(true)}
        onBlur={() => setEmailFocused(false)}
        keyboardType="email-address"
        autoCapitalize="none"
        accessibilityLabel="Email or Username input"
        focused={emailFocused}
      />
      <AuthInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        onFocus={() => setPasswordFocused(true)}
        onBlur={() => setPasswordFocused(false)}
        secureTextEntry
        accessibilityLabel="Password input"
        focused={passwordFocused}
      />

      <AuthButton title="Log In" onPress={handleLogin} accessibilityLabel="Login button" />

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