import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
} from "react-native";

interface TermsConditionsModalProps {
  visible: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const TermsConditionsModal: React.FC<TermsConditionsModalProps> = ({
  visible,
  onClose,
  onAccept,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Start fully transparent

  useEffect(() => {
    if (visible) {
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1, // Fully opaque
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0, // Fully transparent
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal transparent={true} visible={visible} animationType="none">
      <View style={styles.modalContainer}>
        <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
          <Text style={styles.modalTitle}>Terms and Conditions</Text>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <Text style={styles.modalText}>
              Welcome to <Text style={styles.bold}>Parth – The Smart Parking System</Text>. 
              By registering for and using the Parth mobile application, you agree to the following 
              terms and conditions. Please read them carefully.
            </Text>

            <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
            <Text style={styles.modalText}>
              By signing up, accessing, or using Parth, you acknowledge that you have read, 
              understood, and agreed to be bound by these Terms and Conditions. If you do not 
              agree, please do not use the app.
            </Text>

            <Text style={styles.sectionTitle}>2. User Registration</Text>
            <Text style={styles.modalText}>
              • You must provide accurate and complete information during registration.{"\n"}
              • You are responsible for maintaining the confidentiality of your login credentials.{"\n"}
              • You must be at least 18 years old to use the app, or have parental/guardian consent.
            </Text>

            <Text style={styles.sectionTitle}>3. Use of the App</Text>
            <Text style={styles.modalText}>
              • The app allows users to find and book parking slots.{"\n"}
              • Users must comply with all local parking laws and regulations.{"\n"}
              • Parth is not responsible for any fines, penalties, or legal actions arising 
              from parking violations.
            </Text>

            <Text style={styles.sectionTitle}>4. Payments & Refunds</Text>
            <Text style={styles.modalText}>
              • If the app includes paid parking, users must ensure successful payment before 
              using a reserved spot.{"\n"}
              • Refunds, if applicable, will be processed as per our Refund Policy.
            </Text>

            <Text style={styles.sectionTitle}>5. Limitation of Liability</Text>
            <Text style={styles.modalText}>
              • Parth provides information on available parking slots but does not guarantee 
              their availability at the time of arrival.{"\n"}
              • We are not responsible for damages, theft, or any incidents occurring at parking locations.
            </Text>

            <Text style={styles.sectionTitle}>6. Account Termination</Text>
            <Text style={styles.modalText}>
              We reserve the right to suspend or terminate accounts if:{"\n"}
              • Any fraudulent or suspicious activity is detected.{"\n"}
              • Users violate these Terms & Conditions.
            </Text>

            <Text style={styles.sectionTitle}>7. Privacy Policy</Text>
            <Text style={styles.modalText}>
              Your personal data will be handled as per our{" "}
              <Text style={styles.linkText}>Privacy Policy</Text>
            </Text>

            <Text style={styles.sectionTitle}>8. Changes to Terms</Text>
            <Text style={styles.modalText}>
              We may update these Terms & Conditions from time to time. Continued use of the 
              app signifies acceptance of any changes.
            </Text>

            <Text style={styles.sectionTitle}>9. Contact Us</Text>
            <Text style={styles.modalText}>
              For any questions regarding these terms, please contact us at{" "}
              <Text style={styles.linkText}>support@parth.com</Text>.
            </Text>

            <Text style={styles.agreementText}>
              By clicking <Text style={styles.bold}>"Agree & Continue"</Text>, you confirm that 
              you have read, understood, and accepted these Terms & Conditions.
            </Text>
          </ScrollView>

          <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
            <Text style={styles.buttonText}>I Accept</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    width: "85%",
    height: "75%",
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  scrollView: {
    maxHeight: "75%",
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    color: "#444",
    lineHeight: 22,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginTop: 10,
    marginBottom: 5,
  },
  bold: {
    fontWeight: "bold",
    color: "#000",
  },
  linkText: {
    color: "#2980B9",
    fontWeight: "bold",
  },
  agreementText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
    color: "#2c3e50",
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: "#27ae60",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "#e74c3c",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TermsConditionsModal;
