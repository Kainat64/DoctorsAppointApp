import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { BaseUrl } from '../../utils/BaseApi';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
const PrescriptionDetailScreen = ({ route, navigation }) => {
  const { prescriptionId } = route.params;
  const [prescriptionDetails, setPrescriptionDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptionDetails();
  }, []);
  const fetchPrescriptionDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${BaseUrl}/get-prescription-detail/${prescriptionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPrescriptionDetails(response.data);
      setLoading(false);
      console.log("prescriptions", response.data)
    } catch (error) {
      console.error('Error fetching prescription details:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#1f6f78" style={styles.loading} />;
  }

  if (!prescriptionDetails) {
    return <Text style={styles.errorText}>No details available.</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Prescription')}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Prescription Detail</Text>
      </View>

    

      {/* Patient and Pharmacy Info */}
      <View style={styles.infoContainer}>
        <FontAwesome name="user" size={20} color="#333" style={styles.icon} />
        <Text style={styles.label}>Patient: {prescriptionDetails.patient.name}</Text>
      </View>
      <View style={styles.infoContainer}>
        <FontAwesome name="calendar" size={20} color="#333" style={styles.icon} />
        <Text style={styles.label}>Date: {prescriptionDetails.date}</Text>
      </View>
      <View style={styles.infoContainer}>
        <FontAwesome name="building" size={20} color="#333" style={styles.icon} />
        <Text style={styles.label}>Pharmacy: {prescriptionDetails.pharmacy.name}</Text>
      </View>

      {/* Medications Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Medications</Text>
        {prescriptionDetails.medications.map((med, index) => (
          <View key={index} style={styles.medicationItem}>
            <Text style={styles.medicationText}>Name: {med.medicine_name}</Text>
            <Text style={styles.medicationText}>Dosage: {med.dosage}</Text>
            <Text style={styles.medicationText}>Frequency: {med.frequency}</Text>
            <Text style={styles.medicationText}>Duration: {med.duration}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fc',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  backText: {
    fontSize: 24,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f6f78',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f6f78',
    marginBottom: 10,
    textAlign: 'left',
  },
  medicationItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medicationText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
});

export default PrescriptionDetailScreen;
