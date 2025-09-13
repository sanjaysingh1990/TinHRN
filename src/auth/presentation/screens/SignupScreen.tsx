import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useColorScheme
} from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../../theme';
import { getAuthStyles } from '../styles/auth.styles';
import AuthHeader from '../components/AuthHeader';
import AuthInput from '../components/AuthInput';
import AuthButton from '../components/AuthButton';
import SocialButtons from '../components/SocialButtons';
import AuthFooter from '../components/AuthFooter';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';

const SignupScreen: React.FC = () => {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = theme[colorScheme];
  const styles = getAuthStyles(colors, colorScheme);

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

  const handleSignup = () => {
    // TODO: Implement signup logic
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <AuthHeader title="Create Account" />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <AuthInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
            accessibilityLabel="Name input"
            focused={nameFocused}
          />
          <AuthInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            keyboardType="email-address"
            autoCapitalize="none"
            accessibilityLabel="Email input"
            focused={emailFocused}
          />
          <AuthInput
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            onFocus={() => setPhoneFocused(true)}
            onBlur={() => setPhoneFocused(false)}
            keyboardType="phone-pad"
            accessibilityLabel="Phone number input"
            focused={phoneFocused}
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
          <AuthInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onFocus={() => setConfirmPasswordFocused(true)}
            onBlur={() => setConfirmPasswordFocused(false)}
            secureTextEntry
            accessibilityLabel="Confirm password input"
            focused={confirmPasswordFocused}
          />

          <AuthButton title="Sign Up" onPress={handleSignup} accessibilityLabel="Sign up button" />

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