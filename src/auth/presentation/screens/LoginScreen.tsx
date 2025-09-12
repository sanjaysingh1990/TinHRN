
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import container from '../../../container';
import { LoginUseCase } from '../../application/usecases/LoginUseCase';
import { LoginUseCaseToken } from '../../tokens';
import { loginStart, loginSuccess, loginFailure } from '../state/auth.slice';

const LoginScreen: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginUseCase = container.resolve<LoginUseCase>(LoginUseCaseToken);

  const handleLogin = async () => {
    dispatch(loginStart());
    try {
      const user = await loginUseCase.execute({ email, password });
      dispatch(loginSuccess({ user, token: 'dummy-token' }));
      router.replace('/(tabs)');
    } catch (e) {
      dispatch(loginFailure(e.message));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
      <Button title="Login" onPress={handleLogin} />
      <Button title="Go to Signup" onPress={() => router.push('/signup')} />
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

export default LoginScreen;
