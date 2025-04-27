// app/screens/HomeScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen: React.FC = () => {
  // Dynamic greeting based on time
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return 'Good Morning ☀️';
    else if (currentHour < 18) return 'Good Afternoon ☀️';
    else return 'Good Evening 🌙';
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

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Greeting Section */}
        <View style={styles.greetingSection}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.username}>Shalabh Sahu</Text>
            </View>
            <TouchableOpacity style={styles.notification}>
              <Ionicons name="notifications-outline" size={24} color="#fff" />
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
        <ParkingCard
          image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
          name="Mayo Hall Multilevel Parking"
          location="Mayo Hall Crossing, Prayagraj"
          price="Rs 18/hour"
        />
        <ParkingCard
          image="https://images.unsplash.com/photo-1570129477492-45c003edd2be"
          name="Azaad Park Parking"
          location="Stanley Road, Prayagraj"
          price="Rs 15/hour"
        />
      </ScrollView>
    </View>
  );
};

const Category = ({ icon, label, color }: { icon: any; label: string; color: string }) => (
  <TouchableOpacity style={styles.categoryButton}>
    <View style={[styles.categoryIcon, { backgroundColor: color + '20' }]}>
      <MaterialCommunityIcons name={icon} size={24} color={color} />
    </View>
    <Text style={styles.categoryLabel}>{label}</Text>
  </TouchableOpacity>
);

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
  notification: {
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
});

export default HomeScreen;