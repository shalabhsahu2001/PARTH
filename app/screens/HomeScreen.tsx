// app/screens/HomeScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Image, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Parking: undefined;
  Profile: undefined;
  Maps: undefined;
  IoTParking: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const drawerWidth = 280;
  const translateX = React.useRef(new Animated.Value(drawerWidth)).current;
  
  const toggleDrawer = () => {
    if (drawerVisible) {
      // Close drawer
      Animated.timing(translateX, {
        toValue: drawerWidth,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setDrawerVisible(false));
    } else {
      // Open drawer
      setDrawerVisible(true);
      Animated.timing(translateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  // Dynamic greeting based on time
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return 'Good Morning ☀️';
    else if (currentHour < 18) return 'Good Afternoon ☀️';
    else return 'Good Evening 🌙';
  };

  // Handle parking card click to navigate to the ParkingLayoutScreen
  const handleParkingCardPress = () => {
    navigation.navigate('Parking');
  };

  return (
    <View style={styles.wrapper}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#a18cd1', '#fbc2eb']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />

      {/* Drawer Overlay */}
      {drawerVisible && (
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={toggleDrawer}
        />
      )}

      {/* Drawer */}
      <Animated.View 
        style={[
          styles.drawer,
          { transform: [{ translateX: translateX }] }
        ]}
      >
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitle}>PARTH</Text>
        </View>
        
        <View style={styles.drawerContent}>
          <TouchableOpacity style={styles.drawerItem}>
            <Ionicons name="home" size={24} color="#333" />
            <Text style={styles.drawerItemText}>Home</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.drawerItem}>
            <Ionicons name="person" size={24} color="#333" />
            <Text style={styles.drawerItemText}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('Maps')}>
            <Ionicons name="map" size={24} color="#333" />
            <Text style={styles.drawerItemText}>Maps</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.signOutButton}>
          <Ionicons name="log-out" size={24} color="#fff" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Greeting Section */}
        <View style={styles.greetingSection}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.username}>Shalabh Sahu</Text>
            </View>
            <TouchableOpacity style={styles.drawerButton} onPress={toggleDrawer}>
              <Ionicons name="menu" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Search Section */}
        <View style={styles.searchSection}>
          <Text style={styles.title}>Find your{'\n'}Parking Space</Text>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#aaa" style={{ marginLeft: 10 }} />
            <TextInput
              placeholder="Search space..."
              placeholderTextColor="#bbb"
              style={styles.searchInput}
            />
          </View>

          {/* Vehicle Categories */}
          <View style={styles.categories}>
            <Category icon="car" label="Car" color="#FF6B6B" />
            <Category icon="bus" label="Bus" color="#6BCB77" />
            <Category icon="bike" label="Bike" color="#4D96FF" />
            <Category icon="van-utility" label="Van" color="#B983FF" />
          </View>
        </View>

        {/* Nearby Spaces */}
        <Text style={styles.nearbyTitle}>Nearby Spaces</Text>
        <TouchableOpacity onPress={handleParkingCardPress}>
          <ParkingCard
            image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
            name="Mayo Hall Multilevel Parking"
            location="Mayo Hall Crossing, Prayagraj"
            price="Rs 18/hour"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleParkingCardPress}>
          <ParkingCard
            image="https://images.unsplash.com/photo-1570129477492-45c003edd2be"
            name="Azaad Park Parking"
            location="Stanley Road, Prayagraj"
            price="Rs 15/hour"
          />
        </TouchableOpacity>
        {/* IoT test */}
        <TouchableOpacity onPress={()=> navigation.navigate('IoTParking')}>
          <ParkingCard
            image="https://images.unsplash.com/photo-1570129477492-45c003edd2be"
            name="IoT Test Parking"
            location="Stanley Road, Prayagraj"
            price="Rs 15/hour"
          />
        </TouchableOpacity>
        
      </ScrollView>
    </View>
  );
};

// Category component for vehicle type selection
const Category = ({ icon, label, color }: { icon: any; label: string; color: string }) => (
  <TouchableOpacity style={styles.categoryButton}>
    <View style={[styles.categoryIcon, { backgroundColor: color + '20' }]}>
      <MaterialCommunityIcons name={icon} size={24} color={color} />
    </View>
    <Text style={styles.categoryLabel}>{label}</Text>
  </TouchableOpacity>
);

// ParkingCard component to display each parking space
const ParkingCard = ({ image, name, location, price }: { image: string; name: string; location: string; price: string }) => (
  <View style={styles.card}>
    <Image source={{ uri: image }} style={styles.cardImage} />
    <View style={{ flex: 1, marginLeft: 10 }}>
      <Text style={styles.cardTitle}>{name}</Text>
      <Text style={styles.cardSubtitle}>{location}</Text>
      <Text style={styles.cardPrice}>{price}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  container: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  greetingSection: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 14,
    color: '#f9f9f9',
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  drawerButton: {
    backgroundColor: '#b983ff',
    padding: 10,
    borderRadius: 30,
  },
  searchSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingVertical: 12,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
  },
  categories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryButton: {
    alignItems: 'center',
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryLabel: {
    fontSize: 12,
    color: '#555',
    fontWeight: '600',
  },
  nearbyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 15,
    color: '#333',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#777',
    marginVertical: 2,
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6bcb77',
  },
  // Drawer styles
  drawer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 280,
    height: '100%',
    backgroundColor: '#fff',
    zIndex: 999,
    paddingTop: 50,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 998,
  },
  drawerHeader: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#a18cd1',
  },
  drawerContent: {
    flex: 1,
    paddingVertical: 20,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  drawerItemText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
  },
  signOutButton: {
    backgroundColor: '#FF6B6B',
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signOutText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;