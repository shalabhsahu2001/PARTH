import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import TermsConditionsModal from './TermsConditionsModal';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [buttonAnimation] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword || !mobile) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!isAgreed) {
      Alert.alert('Error', 'You must agree to the terms and conditions');
      return;
    }

    const userData = {
      name,
      email,
      password,
      mobile,
    };

    setLoading(true);

    try {
      console.log('Sending data:', userData);

      // Ensure you use the correct API endpoint here, change the IP if needed
      const response = await axios.post('http://192.168.30.110:5000/api/register', userData);

      if (response.status === 200 || response.status === 201) {
        Alert.alert('Registration Successful', 'You have successfully registered.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Registration Failed', 'There was an issue with registration.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'There was an issue with registration.');
    } finally {
      setLoading(false);
    }
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonAnimation, {
        toValue: 0.95,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const renderInput = (
    placeholder: string,
    value: string,
    onChange: (text: string) => void,
    icon: string,
    secure?: boolean
  ) => (
    <View style={styles.inputCard}>
      <FontAwesome5 name={icon} size={20} color="#3498DB" style={styles.inputIcon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        value={value}
        onChangeText={onChange}
        secureTextEntry={secure}
      />
    </View>
  );

  const toggleTermsCondition = () => setIsModalVisible(!isModalVisible);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LinearGradient colors={['#E3FDFD', '#FEFCFD']} style={styles.formContainer}>
        <Animated.View style={[styles.formContent, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.title}>Create Your Account</Text>

          {renderInput('Name as per DL/RC', name, setName, 'user')}
          {renderInput('Email', email, setEmail, 'envelope')}
          {renderInput('Password', password, setPassword, 'lock', true)}
          {renderInput('Confirm Password', confirmPassword, setConfirmPassword, 'lock', true)}
          {renderInput('Mobile Number', mobile, setMobile, 'id-card')}

          <View style={styles.checkboxContainer}>
            <TouchableOpacity onPress={() => setIsAgreed(!isAgreed)}>
              <View style={[styles.checkbox, isAgreed ? styles.checked : styles.unchecked]}>
                {isAgreed && <Text style={styles.checkboxText}>✔</Text>}
              </View>
            </TouchableOpacity>
            <Text style={styles.termsText}>
              I agree to the{' '}
              <Text style={styles.termsCondition} onPress={toggleTermsCondition}>
                Terms and Conditions
              </Text>
            </Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              animateButton();
              handleRegister();
            }}
            disabled={!isAgreed || loading}
          >
            <Animated.View style={[styles.buttonGradient, { transform: [{ scale: buttonAnimation }] }]}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
            </Animated.View>
          </TouchableOpacity>

          <View style={styles.backContainer}>
            <Text style={styles.backButtonText}>Already have an account?</Text>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginText}> Login</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>

      <TermsConditionsModal
        visible={isModalVisible}
        onClose={toggleTermsCondition}
        onAccept={() => {
          setIsAgreed(true);
          setIsModalVisible(false);
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F6F9FC',
  },
  formContainer: {
    width: '100%',
    padding: 25,
    borderRadius: 25,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  formContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 20,
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  inputIcon: {
    marginRight: 10,
  },
  button: {
    marginTop: 20,
    height: 50,
    width: 140,
    borderRadius: 15,
    overflow: 'hidden',
  },
  buttonGradient: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2980B9',
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  backContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#333',
  },
  backButton: {
    marginLeft: 5,
  },
  loginText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2980B9',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#3498DB',
    borderColor: '#3498DB',
  },
  unchecked: {
    borderColor: '#ccc',
  },
  checkboxText: {
    color: '#fff',
    fontSize: 14,
  },
  termsText: {
    fontSize: 14,
    color: '#333',
  },
  termsCondition: {
    color: '#2980B9',
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;
