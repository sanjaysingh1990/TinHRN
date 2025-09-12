
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  useColorScheme, 
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../../theme';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';

const SignupScreen: React.FC = () => {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = theme[colorScheme];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('USA');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderColor,
    },
    backButton: {
      position: 'absolute',
      left: 15,
    },
    backButtonText: {
      color: colors.text,
      fontSize: 24,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: 20,
    },
    input: {
      height: 50,
      backgroundColor: colors.inputBackgroundDark,
      borderRadius: 12,
      paddingHorizontal: 15,
      color: colors.text,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    inputFocused: {
      borderColor: colors.primary,
    },
    pickerContainer: {
      backgroundColor: colors.inputBackgroundDark,
      borderRadius: 12,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    picker: {
      color: colors.text,
    },
    signupButton: {
      backgroundColor: colors.primary,
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginBottom: 20,
    },
    signupButtonText: {
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
      backgroundColor: colors.inputBackgroundDark,
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
    signinText: {
      color: colors.primary,
      fontWeight: 'bold',
      textDecorationLine: 'underline',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityLabel="Go back">
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Account</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TextInput
            style={[styles.input, nameFocused && styles.inputFocused]}
            placeholder="Name"
            placeholderTextColor={colors.secondary}
            value={name}
            onChangeText={setName}
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
            accessibilityLabel="Name input"
          />
          <TextInput
            style={[styles.input, emailFocused && styles.inputFocused]}
            placeholder="Email"
            placeholderTextColor={colors.secondary}
            value={email}
            onChangeText={setEmail}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            keyboardType="email-address"
            autoCapitalize="none"
            accessibilityLabel="Email input"
          />
          <TextInput
            style={[styles.input, phoneFocused && styles.inputFocused]}
            placeholder="Phone Number"
            placeholderTextColor={colors.secondary}
            value={phone}
            onChangeText={setPhone}
            onFocus={() => setPhoneFocused(true)}
            onBlur={() => setPhoneFocused(false)}
            keyboardType="phone-pad"
            accessibilityLabel="Phone number input"
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={country}
              onValueChange={(itemValue) => setCountry(itemValue)}
              style={styles.picker}
              dropdownIconColor={colors.primary}
            >
              <Picker.Item label="USA" value="USA" />
              <Picker.Item label="Canada" value="Canada" />
              <Picker.Item label="Mexico" value="Mexico" />
            </Picker>
          </View>
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
          <TextInput
            style={[styles.input, confirmPasswordFocused && styles.inputFocused]}
            placeholder="Confirm Password"
            placeholderTextColor={colors.secondary}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onFocus={() => setConfirmPasswordFocused(true)}
            onBlur={() => setConfirmPasswordFocused(false)}
            secureTextEntry
            accessibilityLabel="Confirm password input"
          />

          <TouchableOpacity style={styles.signupButton} accessibilityLabel="Sign up button">
            <Text style={styles.signupButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.stitch} />
            <Text style={styles.dividerText}>Or continue with</Text>
            <View style={styles.stitch} />
          </View>

          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity style={styles.socialButton} accessibilityLabel="Sign up with Google">
              <Text style={styles.socialIcon}>G</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} accessibilityLabel="Sign up with Facebook">
              <Text style={styles.socialIcon}>F</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} accessibilityLabel="Sign up with Apple">
              <Text style={styles.socialIcon}>A</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Sign in button">
              <Text style={styles.signinText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen;
