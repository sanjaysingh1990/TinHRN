
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  useColorScheme, 
  Image 
} from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../../theme';

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = theme[colorScheme];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      padding: 20,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 40,
    },
    logo: {
      width: 80,
      height: 80,
      borderRadius: 40,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      color: colors.secondary,
      textAlign: 'center',
      marginBottom: 30,
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      marginBottom: 10,
    },
    forgotPasswordText: {
      color: colors.secondary,
    },
    input: {
      height: 50,
      backgroundColor: colors.inputBackground,
      borderRadius: 10,
      paddingHorizontal: 15,
      color: colors.text,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    inputFocused: {
      borderColor: colors.primary,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 5,
    },
    loginButton: {
      backgroundColor: colors.primary,
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginBottom: 20,
    },
    loginButtonText: {
      color: colors.background,
      fontWeight: 'bold',
      fontSize: 16,
    },
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    stitch: {
      flex: 1,
      height: 1,
      borderTopWidth: 1,
      borderColor: colors.secondary,
      borderStyle: 'dashed',
    },
    dividerText: {
      color: colors.secondary,
      marginHorizontal: 10,
    },
    socialButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 20,
    },
    socialButton: {
      width: 60,
      height: 60,
      borderRadius: 30,
      borderWidth: 1,
      borderColor: colorScheme === 'dark' ? colors.borderColor : 'transparent',
      backgroundColor: colors.inputBackground,
      justifyContent: 'center',
      alignItems: 'center',
    },
    socialIcon: {
      fontSize: 24,
      color: colors.text,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 20,
    },
    footerText: {
      color: colors.secondary,
    },
    signupText: {
      color: colors.primary,
      fontWeight: 'bold',
      textDecorationLine: 'underline',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={{ uri: 'https://tentinhimalayas.com/wp-content/uploads/2024/05/cropped-TTH-logo-with-background-1-180x180.png' }} 
          style={styles.logo} 
        />
      </View>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Log in to continue your adventure.</Text>
      
      <TouchableOpacity style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TextInput
        style={[styles.input, emailFocused && styles.inputFocused]}
        placeholder="Email or Username"
        placeholderTextColor={colors.secondary}
        value={email}
        onChangeText={setEmail}
        onFocus={() => setEmailFocused(true)}
        onBlur={() => setEmailFocused(false)}
        keyboardType="email-address"
        autoCapitalize="none"
        accessibilityLabel="Email or Username input"
      />
      <TextInput
        style={[styles.input, passwordFocused && styles.inputFocused]}
        placeholder="Password"
        placeholderTextColor={colors.secondary}
        value={password}
        onChangeText={setPassword}
        onFocus={() => setPasswordFocused(true)}
        onBlur={() => setPasswordFocused(false)}
        secureTextEntry
        accessibilityLabel="Password input"
      />

      <TouchableOpacity style={styles.loginButton} accessibilityLabel="Login button">
        <Text style={styles.loginButtonText}>Log In</Text>
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.stitch} />
        <Text style={styles.dividerText}>Or log in with</Text>
        <View style={styles.stitch} />
      </View>

      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity style={styles.socialButton} accessibilityLabel="Login with Google">
          <Text style={styles.socialIcon}>G</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton} accessibilityLabel="Login with Facebook">
          <Text style={styles.socialIcon}>F</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton} accessibilityLabel="Login with Apple">
          <Text style={styles.socialIcon}>A</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/signup')} accessibilityLabel="Sign up button">
          <Text style={styles.signupText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
