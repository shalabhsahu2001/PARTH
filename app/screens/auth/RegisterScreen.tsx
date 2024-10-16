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
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import TermsConditionsModal from './TermsConditionsModal'; // Import the new component

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  // Form state
  const [nameDLRC, setNameDLRC] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [vehicleModel, setVehicleModel] = useState<string>('');
  const [licensePlate, setLicensePlate] = useState<string>('');

  // Checkbox state
  const [isAgreed, setIsAgreed] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  // Animation state
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

  const handleRegister = () => {
    if (!nameDLRC || !email || !password || !confirmPassword || !licensePlate) {
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

    Alert.alert('Registration Successful', 'You have successfully registered.');
    navigation.navigate('Login');
  };

  const handleGoogleSignUp = () => {
    Alert.alert('Google Sign-Up', 'Google sign-up is not yet implemented');
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

  const renderInput = (placeholder: string, value: string, onChange: (text: string) => void, icon: string) => {
    return (
      <View style={styles.inputCard}>
        <FontAwesome5 name={icon} size={20} color="#3498DB" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#aaa"
          value={value}
          onChangeText={onChange}
        />
      </View>
    );
  };

  const toggleTermsCondition = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LinearGradient colors={['#E3FDFD', '#FEFCFD']} style={styles.formContainer}>
        <Animated.View style={[styles.formContent, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.title}>Create Your Account</Text>

          {/* Name as per DL/RC Input */}
          {renderInput('Name as per DL/RC', nameDLRC, setNameDLRC, 'user')}

          {/* Email Input */}
          {renderInput('Email', email, setEmail, 'envelope')}

          {/* Password Input */}
          {renderInput('Password', password, setPassword, 'lock')}

          {/* Confirm Password Input */}
          {renderInput('Confirm Password', confirmPassword, setConfirmPassword, 'lock')}

          {/* Mobile Number Input */}
          {renderInput('Mobile Number', licensePlate, setLicensePlate, 'id-card')}

          {/* Checkbox for Terms and Conditions */}
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

          {/* Register Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              animateButton();
              handleRegister();
            }}
            disabled={!isAgreed} // Disable button if terms not agreed
          >
            <Animated.View style={[styles.buttonGradient, { transform: [{ scale: buttonAnimation }] }]}>
              <Text style={styles.buttonText}>Register</Text>
            </Animated.View>
          </TouchableOpacity>

          {/* Sign Up with Google */}
          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignUp}>
            <Image source={require('../../../assets/images/google-logo.png')} style={styles.googleLogo} />
            <Text style={styles.googleButtonText}>Sign Up with Google</Text>
          </TouchableOpacity>

          {/* Back to Login */}
          <View style={styles.backContainer}>
            <Text style={styles.backButtonText}>Already have an account? </Text>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>

      {/* Terms and Conditions Modal */}
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
    width: 120,
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
    fontSize: 22,
    fontWeight: '700',
  },
  googleButton: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleButtonText: {
    color: '#333',
    fontSize: 18,
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
    fontWeight: 'bold',
    color: '#2980B9',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#2980B9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checked: {
    backgroundColor: '#2980B9',
  },
  unchecked: {
    backgroundColor: '#fff',
  },
  checkboxText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  termsText: {
    fontSize: 16,
    color: '#333',
  },
  termsCondition: {
    color: '#2980B9',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
