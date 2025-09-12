
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import container from '../../../container';
import { SignupUseCase } from '../../application/usecases/SignupUseCase';
import { SignupUseCaseToken } from '../../tokens';
import { loginStart, loginSuccess, loginFailure } from '../state/auth.slice';

const SignupScreen: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signupUseCase = container.resolve<SignupUseCase>(SignupUseCaseToken);

  const handleSignup = async () => {
    dispatch(loginStart());
    try {
      const user = await signupUseCase.execute({ name, email, password });
      dispatch(loginSuccess({ user, token: 'dummy-token' }));
      router.replace('/(tabs)');
    } catch (e) {
      dispatch(loginFailure(e.message));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign Up" onPress={handleSignup} />
      <Button title="Go to Login" onPress={() => router.push('/login')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default SignupScreen;
