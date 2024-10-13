import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons'; // Icon import

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isEmailFocused, setIsEmailFocused] = useState<boolean>(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState<boolean>(false);
  const [isPasswordVisible, setPasswordVisible] = useState<boolean>(false); // Password visibility state

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate an API call
      Alert.alert('Login Successful', `Welcome ${email}`);
    } catch (error) {
      Alert.alert('Error', 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#F0F4F8', '#D9E4EC']} style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('@/assets/images/parth.png')} />
      </View>
      <LinearGradient
        colors={['#ffffff', '#EAF0F1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.loginBox}
      >
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={[styles.input, isEmailFocused && { borderColor: '#2980B9' }]}
          onFocus={() => setIsEmailFocused(true)}
          onBlur={() => setIsEmailFocused(false)}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.passwordInput, isPasswordFocused && { borderColor: '#2980B9' }]}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
            placeholder="Password"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible} // Toggle visibility
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!isPasswordVisible)}
            style={styles.eyeIcon}
          >
            <FontAwesome5
              name={isPasswordVisible ? 'eye-slash' : 'eye'}
              size={20}
              color="#2980B9"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.button, loading && { backgroundColor: '#BDC3C7' }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>
      </LinearGradient>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20, // Reduced space between logo and login box
    alignItems: 'center',
  },
  loginBox: {
    width: '85%',
    paddingVertical: 30, // Adjusted padding
    paddingHorizontal: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 15, // Optional: Adjust if needed
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 20, // Adjusted spacing
    textAlign: 'center',
    letterSpacing: 1,
  },
  input: {
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 5,
    fontSize: 16,
  },
  eyeIcon: {
    marginLeft: 10,
  },
  button: {
    height: 50,
    backgroundColor: '#2980B9',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default LoginScreen;
