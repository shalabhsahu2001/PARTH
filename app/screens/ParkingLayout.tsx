import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Dimensions,
  Modal,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useUserContext } from '../context/userContext';

const { width } = Dimensions.get('window');

const ParkingLayoutScreen: React.FC = () => {
  // Global context for the logged in user
  const { userEmail } = useUserContext();

  const [selectedFloor, setSelectedFloor] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [occupiedSpots, setOccupiedSpots] = useState<string[]>([]);

  // NEW STATES for duration selection modal
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<number>(1); // default to 1 hour

  // Define parking sections
  const sections = {
    A: ['A-1', 'A-2', 'A-3'],
    B: ['B-1', 'B-2'],
    C: ['C-1', 'C-2'],
    D: ['D-1', 'D-2']
  };

  useEffect(() => {
    const fetchOccupiedSlots = async () => {
      try {
        const response = await fetch(
          `http://192.168.1.35:5000/api/slots/occupied-slots?t=${new Date().getTime()}`
        );
        const result = await response.json();
        console.log('Fetched occupied slots response:', result);
        if (response.ok) {
          // Extract the slotId string from the result
          const occupied = Array.isArray(result.occupiedSlots)
            ? result.occupiedSlots.map((item: any) => item.slotId)
            : [];
          console.log('Occupied slots after mapping:', occupied);
          setOccupiedSpots(occupied);
        } else {
          console.error('Failed to fetch occupied slots:', result.message);
        }
      } catch (error) {
        console.error('Error fetching occupied slots:', error);
      }
    };

    fetchOccupiedSlots();
  }, []);

  // When a slot is clicked, if not occupied then select it & open the duration selector
  const handleSlotClick = (slot: string) => {
    if (!occupiedSpots.includes(slot)) {
      setSelectedSlot(slot);
      // Open the bottom drawer for duration selection
      setShowDurationModal(true);
    }
  };

  // Called when user confirms duration selection from the bottom drawer
  const handleConfirmDuration = async () => {
    // Now that we have both slot and duration ready, proceed to book space
    console.log('User:', userEmail);
    console.log('Slot:', selectedSlot, 'Duration:', selectedDuration, 'hour(s)');
    if (selectedSlot && userEmail) {
      try {
        // Update your backend API as required to include duration if needed.
        const response = await fetch('http://192.168.1.35:5000/api/slots/book', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            slotId: selectedSlot, 
            email: userEmail,
            duration: selectedDuration // included duration in request body
          }),
        });
      
        const result = await response.json();
        if (response.status === 200 || response.status === 201) {
          // Reflect the booked slot in UI locally
          setOccupiedSpots([...occupiedSpots, selectedSlot]);
          Alert.alert(
            "Space Booked",
            `You have successfully booked parking space ${selectedSlot} for ${selectedDuration} hour(s)`,
            [{ text: "OK" }]
          );
          setSelectedSlot(null);
        } else {
          Alert.alert("Error", result.message || "Failed to book slot");
        }
      } catch (error) {
        Alert.alert("Error", "Network request failed");
      }
    } else {
      Alert.alert("Error", "Please select a slot and ensure you're logged in");
    }
    // Close the duration selection modal
    setShowDurationModal(false);
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
        activeOpacity={0.7}
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
          <MaterialCommunityIcons name="chevron-left" size={30} color="#333" />
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
            activeOpacity={0.8}
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
      <View style={styles.layoutWrapper}>
        <ScrollView style={styles.layoutContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.parkingLayout}>
            {/* Section Labels with background */}
            <View style={styles.sectionLabelsRow}>
              <View style={styles.sectionLabelContainer}>
                <Text style={styles.sectionLabel}>A</Text>
              </View>
              <View style={styles.sectionLabelContainer}>
                <Text style={styles.sectionLabel}>B</Text>
              </View>
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
              <View style={styles.dottedDivider} />
              <View style={styles.rightSection}>
                {sections.B.map(spot => renderParkingSpot(spot))}
              </View>
            </View>

            {/* Section Labels */}
            <View style={styles.sectionLabelsRow}>
              <View style={styles.sectionLabelContainer}>
                <Text style={styles.sectionLabel}>C</Text>
              </View>
              <View style={styles.sectionLabelContainer}>
                <Text style={styles.sectionLabel}>D</Text>
              </View>
            </View>

            {/* Lower Rows */}
            <View style={styles.parkingRow}>
              <View style={styles.leftSection}>
                {sections.C.map(spot => renderParkingSpot(spot))}
              </View>
              <View style={styles.dottedDivider} />
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
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={styles.legendColor} />
          <Text style={styles.legendText}>Available</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#FF6B6B' }]} />
          <Text style={styles.legendText}>Occupied</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#fff', borderWidth: 2, borderColor: '#FF6B6B' }]} />
          <Text style={styles.legendText}>Selected</Text>
        </View>
      </View>

      {/* Book Space Button – you can remove or repurpose this since duration selection now comes via modal */}
      {/* <TouchableOpacity 
        style={[
          styles.bookButton,
          !selectedSlot ? styles.bookButtonDisabled : null
        ]}
        onPress={handleBookSpace}
        disabled={!selectedSlot}
        activeOpacity={0.8}
      >
        <Text style={styles.bookButtonText}>
          {selectedSlot ? `Book Space ${selectedSlot}` : 'Book Space'}
        </Text>
      </TouchableOpacity> */}

      {/* Bottom Drawer: Duration Selector Modal */}
      <DurationSelector
        visible={showDurationModal}
        selectedDuration={selectedDuration}
        onSelect={(duration: number) => setSelectedDuration(duration)}
        onClose={() => setShowDurationModal(false)}
        onConfirm={handleConfirmDuration}
      />
    </SafeAreaView>
  );
};

interface DurationSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (duration: number) => void;
  selectedDuration: number;
  onConfirm: () => void;
}

const DurationSelector: React.FC<DurationSelectorProps> = ({
  visible,
  onClose,
  onSelect,
  selectedDuration,
  onConfirm,
}) => {
  // Hours from 1 to 12 for selection
  const hoursArray = Array.from({ length: 12 }, (_, i) => i + 1);
  const containerSize = 250;
  const center = containerSize / 2; // 125
  const buttonSize = 40;
  const radius = 100;

  // Helper to compute circular button positions
  const getPosition = (index: number, total: number) => {
    const angle = (2 * Math.PI * index) / total - Math.PI / 2; // start from top
    const x = center + radius * Math.cos(angle) - buttonSize / 2;
    const y = center + radius * Math.sin(angle) - buttonSize / 2;
    return { left: x, top: y };
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Duration (in hours)</Text>
          <View style={styles.circularContainer}>
            {hoursArray.map((hour, index) => {
              const pos = getPosition(index, hoursArray.length);
              const isSelected = selectedDuration === hour;
              return (
                <TouchableOpacity
                  key={hour}
                  style={[styles.hourButton, pos, isSelected && styles.hourButtonSelected]}
                  onPress={() => onSelect(hour)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.hourText, isSelected && styles.hourTextSelected]}>
                    {hour}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {/* Optional Action Buttons */}
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  floorTabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  floorTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activeFloorTab: {
    backgroundColor: '#ff6347',
  },
  inactiveFloorTab: {
    backgroundColor: '#f0f0f0',
  },
  floorTabText: {
    fontWeight: '600',
    fontSize: 14,
  },
  activeFloorTabText: {
    color: '#fff',
  },
  inactiveFloorTabText: {
    color: '#666',
  },
  layoutWrapper: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  layoutContainer: {
    flex: 1,
  },
  parkingLayout: {
    padding: 20,
    paddingBottom: 30,
  },
  sectionLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  sectionLabelContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: width * 0.15,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#444',
  },
  entryContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  entryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    letterSpacing: 1,
  },
  entryLine: {
    width: 1,
    height: 24,
    backgroundColor: '#ccc',
    marginTop: 4,
  },
  parkingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    position: 'relative',
  },
  dottedDivider: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#ccc',
    marginLeft: -1,
    height: '100%',
    zIndex: -1,
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
    width: 70,
    height: 42,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    position: 'relative',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  availableSpot: {
    backgroundColor: '#6BCB77',
  },
  occupiedSpot: {
    backgroundColor: '#FF6B6B',
  },
  selectedSpot: {
    borderWidth: 3,
    borderColor: '#FF6B6B',
    backgroundColor: '#fff',
    transform: [{ scale: 1.05 }],
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  spotLabel: {
    fontSize: 12,
    fontWeight: '600',
    position: 'absolute',
    bottom: 4,
  },
  spotLabelDark: {
    color: '#444',
  },
  spotLabelLight: {
    color: '#fff',
  },
  exitContainer: {
    alignItems: 'center',
    marginVertical: 16,
    alignSelf: 'flex-end',
    marginRight: '25%',
  },
  exitLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    letterSpacing: 1,
  },
  exitLine: {
    width: 1,
    height: 24,
    backgroundColor: '#ccc',
    marginBottom: 4,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#6BCB77',
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  bookButton: {
    backgroundColor: '#673ab7',
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  bookButtonDisabled: {
    backgroundColor: '#9e9e9e',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  // New Modal / Duration Selector styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
  },
  circularContainer: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  hourButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hourButtonSelected: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  hourText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  hourTextSelected: {
    color: '#007AFF',
  },
  modalActions: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#ccc',
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#333',
  },
  confirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default ParkingLayoutScreen;