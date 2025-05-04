// app/screens/MapsScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  Linking,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

const MapsScreen: React.FC = () => {
  // State for the device's current location
  const [deviceLocation, setDeviceLocation] = useState<Location.LocationObject | null>(null);
  // State for the region displayed on the map
  const [mapRegion, setMapRegion] = useState<Region | null>(null);
  // State for any error messages (e.g., location permission issues)
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  // State for the search query from the TextInput
  const [searchQuery, setSearchQuery] = useState<string>('');
  // State for the geocoded search result location
  const [searchResult, setSearchResult] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      // Request the foreground permission for location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      // Continuously update the device location using watchPositionAsync
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (loc) => {
          setDeviceLocation(loc);
          // If no region is set (i.e., on first update), center the map on the device's location
          if (!mapRegion) {
            setMapRegion({
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          }
        }
      );
    })();

    return () => {
      subscription && subscription.remove();
    };
  }, [mapRegion]);

  // Handle address search using Expo's geocoding service
  const handleSearch = async () => {
    if (!searchQuery.trim()) return; // Skip empty searches
    try {
      const results = await Location.geocodeAsync(searchQuery);
      if (results && results.length > 0) {
        const { latitude, longitude } = results[0];
        setSearchResult({ latitude, longitude });
        setMapRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } else {
        setErrorMsg('Location not found. Please try a different address.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error finding location, please try again.');
    }
  };

  // Handle navigation by opening Google Maps with directions from deviceLocation to searchResult
  const handleNavigation = () => {
    if (!deviceLocation || !searchResult) return;

    const origin = `${deviceLocation.coords.latitude},${deviceLocation.coords.longitude}`;
    const destination = `${searchResult.latitude},${searchResult.longitude}`;

    // Construct the URL for Google Maps directions
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;

    Linking.openURL(url).catch((err) =>
      console.error('Failed opening navigation URL', err)
    );
  };

  // Display any error messages
  if (errorMsg) {
    return (
      <View style={styles.center}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  // Wait for the map region to be set before rendering MapView
  if (!mapRegion) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={mapRegion}
        showsUserLocation={true}
        onRegionChangeComplete={(region) => setMapRegion(region)}
      >
        {/* Device's current location marker */}
        {deviceLocation && (
          <Marker
            coordinate={{
              latitude: deviceLocation.coords.latitude,
              longitude: deviceLocation.coords.longitude,
            }}
            title="You are here"
          />
        )}
        {/* Search result marker */}
        {searchResult && (
          <Marker
            coordinate={{
              latitude: searchResult.latitude,
              longitude: searchResult.longitude,
            }}
            title="Search Result"
          />
        )}
      </MapView>

      {/* Search bar overlay */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a location..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {/* Navigation button appears only if a search result is available */}
      {searchResult && (
        <TouchableOpacity style={styles.navigateButton} onPress={handleNavigation}>
          <Ionicons name="navigate" size={24} color="#fff" />
          <Text style={styles.navigateButtonText}>Navigate</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    position: 'absolute',
    top: 40,
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 5,
  },
  searchButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#007AFF',
    borderRadius: 4,
    marginLeft: 8,
  },
  navigateButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  navigateButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MapsScreen;
