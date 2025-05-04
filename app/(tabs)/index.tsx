// app/(tabs)/index.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';  // Import the HomeScreen
import ParkingLayoutScreen from '../screens/ParkingLayout';
import { UserProvider } from '../context/userContext';
import MapsScreen from '../screens/MapScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <UserProvider>
      <NavigationContainer independent={true}>
        <Stack.Navigator
          initialRouteName="Login" // Set the initial route to HomeScreen
          screenOptions={{
            headerShown: false, // Hide headers for all screens
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Parking" component={ParkingLayoutScreen} />
          <Stack.Screen name="Maps" component={MapsScreen} />
          
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;
