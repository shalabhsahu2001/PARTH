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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

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

  // Animation state
  const [buttonAnimation] = useState(new Animated.Value(1)); // Button scale animation
  const [fadeAnim] = useState(new Animated.Value(0)); // Fade animation for form
  const [slideAnim] = useState(new Animated.Value(-100)); // Slide animation for form

  useEffect(() => {
    // Start fade-in and slide-in effect for form content
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
    if (!nameDLRC || !email || !password || !confirmPassword || !vehicleModel || !licensePlate) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    Alert.alert('Registration Successful', 'You have successfully registered.');
    navigation.navigate('Login');
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonAnimation, {
        toValue: 0.95, // Scale down
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnimation, {
        toValue: 1, // Scale back up
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

          {/* Vehicle Model Input */}
          {renderInput('Vehicle Model', vehicleModel, setVehicleModel, 'car')}

          {/* License Plate Input */}
          {renderInput('License Plate', licensePlate, setLicensePlate, 'id-card')}

          {/* Register Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              animateButton();
              handleRegister();
            }}
          >
            <Animated.View
              style={[styles.buttonGradient, { transform: [{ scale: buttonAnimation }] }]}
            >
              <Text style={styles.buttonText}>Register</Text>
            </Animated.View>
          </TouchableOpacity>

          {/* Back to Login */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.backButtonText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
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
    height: 55,
    borderRadius: 15,
    overflow: 'hidden',
  },
  buttonGradient: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2980B9',
    elevation: 5, // Added elevation for shadow effect
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  backButton: {
    marginTop: 30,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3498DB',
    textAlign: 'center',
  },
});

export default RegisterScreen;
