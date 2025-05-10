// app/screens/IoTParkingScreen.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { Client } from 'paho-mqtt';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const IoTParkingScreen: React.FC = () => {
  const [sensorData, setSensorData] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const broker = 'test.mosquitto.org';
    const port = 8080; // Port as a number
    const clientId = 'clientID-' + new Date().getTime(); // Unique client ID

    // Create a new Paho.Client instance  
    const client = new Client(broker, port, clientId);

    // Set callback handlers
    client.onConnectionLost = (responseObject) => {
      if (responseObject.errorCode !== 0) {
        console.log('Connection lost: ' + responseObject.errorMessage);
        setIsConnected(false);
      }
    };

    client.onMessageArrived = (message) => {
      console.log('Message arrived: ', message.payloadString);
      try {
        const data = JSON.parse(message.payloadString);
        setSensorData(data);
        setLastUpdated(new Date().toLocaleTimeString());

        // Animate fade-in of the sensor data card
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.error('Error parsing MQTT message:', error);
      }
    };

    // Connect to the broker
    client.connect({
      onSuccess: () => {
        console.log('Connected to MQTT broker');
        setIsConnected(true);
        client.subscribe('parking/status');
      },
      onFailure: (err) => {
        console.error('Connection failed:', err);
      },
      useSSL: false, // Change this to true if SSL is required
    });

    // Cleanup on unmount
    return () => {
      if (client && client.isConnected()) {
        client.disconnect();
      }
    };
  }, [cardOpacity]);

  // Optional refresh: triggers a fade-out then fade back in for a visual refresh effect.
  const handleRefresh = () => {
    Animated.sequence([
      Animated.timing(cardOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Determine background color based on status - green for free, red for occupied
  const getCardBackground = () => {
    if (sensorData?.slot1) {
      return sensorData.slot1.toLowerCase() === 'free' ? '#C8E6C9' : '#FFCDD2';
    }
    return '#fff';
  };

  return (
    <LinearGradient colors={['#8EC5FC', '#E0C3FC']} style={styles.gradient}>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <Ionicons name="speedometer-outline" size={60} color="#fff" />
          <Text style={styles.title}>IoT Parking Sensor</Text>
        </View>

        {/* Connection Status */}
        <View style={styles.statusContainer}>
          {isConnected ? (
            <Text style={[styles.status, styles.connected]}>MQTT Connected</Text>
          ) : (
            <Text style={[styles.status, styles.connecting]}>
              Connecting to MQTT...
            </Text>
          )}
        </View>

        {/* Sensor Data Card */}
        {sensorData ? (
          <Animated.View
            style={[
              styles.card,
              { backgroundColor: getCardBackground(), opacity: cardOpacity },
            ]}
          >
            <Ionicons
              name={
                sensorData.slot1.toLowerCase() === 'free'
                  ? 'checkmark-circle-outline'
                  : 'close-circle-outline'
              }
              size={40}
              color={sensorData.slot1.toLowerCase() === 'free' ? '#388E3C' : '#D32F2F'}
            />
            <Text style={styles.cardText}>
              Slot 1 Status: {sensorData.slot1 || 'N/A'}
            </Text>
            {lastUpdated ? (
              <Text style={styles.timestamp}>Last Updated: {lastUpdated}</Text>
            ) : null}
          </Animated.View>
        ) : (
          <ActivityIndicator size="large" color="#fff" style={styles.loader} />
        )}

        {/* Refresh Button */}
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Ionicons name="refresh" size={24} color="#fff" />
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default IoTParkingScreen;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 10,
  },
  statusContainer: {
    marginVertical: 15,
  },
  status: {
    fontSize: 18,
    fontWeight: '600',
  },
  connected: {
    color: '#4CAF50', // Green
  },
  connecting: {
    color: '#FFC107', // Amber
  },
  card: {
    width: width * 0.85,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    marginBottom: 20,
  },
  cardText: {
    fontSize: 22,
    fontWeight: '500',
    marginTop: 10,
    color: '#333',
  },
  timestamp: {
    marginTop: 8,
    fontSize: 16,
    color: '#777',
  },
  loader: {
    marginTop: 20,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 3,
  },
  refreshText: {
    marginLeft: 8,
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
