import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const ParkingLayoutScreen: React.FC = () => {
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [occupiedSpots, setOccupiedSpots] = useState<string[]>([]);
  
  // Define parking spots data
  const sections = {
    A: ['A-2', 'A-3', 'A-4'],
    B: ['B-1', 'B-4'],
    C: ['C-1', 'C-5'],
    D: ['D-1', 'D-2']
  };

  const handleSlotClick = (slot: string) => {
    if (!occupiedSpots.includes(slot)) {
      setSelectedSlot(slot);
    }
  };

  const handleBookSpace = () => {
    if (selectedSlot) {
      // Add the selected slot to occupied spots
      setOccupiedSpots([...occupiedSpots, selectedSlot]);
      
      // Show confirmation message
      Alert.alert(
        "Space Booked",
        `You have successfully booked parking space ${selectedSlot}`,
        [{ text: "OK" }]
      );
      
      // Clear selection
      setSelectedSlot(null);
    }
  };

  const renderParkingSpot = (spot: string) => {
    const isOccupied = occupiedSpots.includes(spot);
    const isSelected = selectedSlot === spot;
    
    return (
      <TouchableOpacity
        key={spot}
        style={[
          styles.parkingSpot,
          isOccupied ? styles.occupiedSpot : styles.availableSpot,
          isSelected ? styles.selectedSpot : null,
        ]}
        onPress={() => handleSlotClick(spot)}
        disabled={isOccupied}
      >
        {isOccupied && (
          <MaterialCommunityIcons name="car" size={22} color="#fff" />
        )}
        <Text style={[
          styles.spotLabel,
          (isOccupied || isSelected) ? styles.spotLabelLight : styles.spotLabelDark
        ]}>
          {spot}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <MaterialCommunityIcons name="chevron-left" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Space</Text>
      </View>
      
      {/* Floor selection tabs */}
      <View style={styles.floorTabsContainer}>
        {[1, 2, 3, 4].map((floor) => (
          <TouchableOpacity
            key={floor}
            style={[
              styles.floorTab,
              selectedFloor === floor ? styles.activeFloorTab : styles.inactiveFloorTab
            ]}
            onPress={() => setSelectedFloor(floor)}
          >
            <Text 
              style={[
                styles.floorTabText,
                selectedFloor === floor ? styles.activeFloorTabText : styles.inactiveFloorTabText
              ]}
            >
              {floor}{floor === 1 ? 'st' : floor === 2 ? 'nd' : floor === 3 ? 'rd' : 'th'} Floor
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Parking layout */}
      <ScrollView style={styles.layoutContainer}>
        <View style={styles.parkingLayout}>
          {/* Section Labels */}
          <View style={styles.sectionLabelsRow}>
            <Text style={[styles.sectionLabel, { left: '25%' }]}>A</Text>
            <Text style={[styles.sectionLabel, { right: '25%' }]}>B</Text>
          </View>
          
          {/* Entry */}
          <View style={styles.entryContainer}>
            <Text style={styles.entryLabel}>ENTRY</Text>
            <View style={styles.entryLine} />
          </View>
          
          {/* Upper Rows */}
          <View style={styles.parkingRow}>
            <View style={styles.leftSection}>
              {sections.A.map(spot => renderParkingSpot(spot))}
            </View>
            <View style={styles.rightSection}>
              {sections.B.map(spot => renderParkingSpot(spot))}
            </View>
          </View>
          
          {/* Section Labels */}
          <View style={styles.sectionLabelsRow}>
            <Text style={[styles.sectionLabel, { left: '25%' }]}>C</Text>
            <Text style={[styles.sectionLabel, { right: '25%' }]}>D</Text>
          </View>
          
          {/* Lower Rows */}
          <View style={styles.parkingRow}>
            <View style={styles.leftSection}>
              {sections.C.map(spot => renderParkingSpot(spot))}
            </View>
            <View style={styles.rightSection}>
              {sections.D.map(spot => renderParkingSpot(spot))}
            </View>
          </View>
          
          {/* Exit */}
          <View style={styles.exitContainer}>
            <View style={styles.exitLine} />
            <Text style={styles.exitLabel}>EXIT</Text>
          </View>
        </View>
      </ScrollView>
      
      {/* Book Space Button - Only active when a slot is selected */}
      <TouchableOpacity 
        style={[
          styles.bookButton,
          !selectedSlot ? styles.bookButtonDisabled : null
        ]}
        onPress={handleBookSpace}
        disabled={!selectedSlot}
      >
        <Text style={styles.bookButtonText}>Book Space</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  floorTabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  floorTab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  activeFloorTab: {
    backgroundColor: '#ff6347', // Orange-red like in the image
  },
  inactiveFloorTab: {
    backgroundColor: '#e0e0e0',
  },
  floorTabText: {
    fontWeight: '500',
  },
  activeFloorTabText: {
    color: '#fff',
  },
  inactiveFloorTabText: {
    color: '#999',
  },
  layoutContainer: {
    flex: 1,
  },
  parkingLayout: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 16,
  },
  sectionLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
    marginVertical: 12,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '600',
    position: 'absolute',
  },
  entryContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  entryLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  entryLine: {
    width: 1,
    height: 20,
    backgroundColor: '#ccc',
    marginTop: 4,
  },
  parkingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  leftSection: {
    width: '45%',
    alignItems: 'center',
  },
  rightSection: {
    width: '45%',
    alignItems: 'center',
  },
  parkingSpot: {
    width: 60,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    position: 'relative',
  },
  availableSpot: {
    backgroundColor: '#6BCB77', // Green color for available spots
  },
  occupiedSpot: {
    backgroundColor: '#FF6B6B', // Red color for occupied spots
  },
  selectedSpot: {
    borderWidth: 3,
    borderColor: '#FF6B6B',
    transform: [{scale: 1.05}],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  spotLabel: {
    fontSize: 10,
    fontWeight: '500',
    position: 'absolute',
    bottom: 3,
  },
  spotLabelDark: {
    color: '#333',
  },
  spotLabelLight: {
    color: '#fff',
  },
  exitContainer: {
    alignItems: 'center',
    marginVertical: 12,
    alignSelf: 'flex-end',
    marginRight: '25%',
  },
  exitLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  exitLine: {
    width: 1,
    height: 20,
    backgroundColor: '#ccc',
    marginBottom: 4,
  },
  bookButton: {
    backgroundColor: '#673ab7', // Purple as in the image
    paddingVertical: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  bookButtonDisabled: {
    backgroundColor: '#9e9e9e', // Gray when disabled
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ParkingLayoutScreen;