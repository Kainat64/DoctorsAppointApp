import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, TextInput, ActivityIndicator } from 'react-native';
import { BaseUrl } from '../../utils/BaseApi';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const PrescriptionHistoryScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPrescription = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${BaseUrl}/get-patient-prescription`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrescriptions(response.data);
    } catch (error) {
      console.error('Error fetching prescription:', error);
      setError('Failed to load prescriptions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchPrescription();
    }, [])
  );

  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.patient?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#274A8A" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <FontAwesome name="exclamation-circle" size={40} color="#d32f2f" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchPrescription}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="chevron-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Prescription History</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={18} color="#8e8e93" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by patient name"
          placeholderTextColor="#8e8e93"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {filteredPrescriptions.length === 0 ? (
          <View style={styles.emptyState}>
            <Image 
              source={require('../../assets/images/no-prescription.png')} 
              style={styles.emptyImage} 
              resizeMode="contain"
            />
            <Text style={styles.emptyTitle}>No Prescriptions Found</Text>
            <Text style={styles.emptyText}>
              {searchQuery ? 
                "No prescriptions match your search" : 
                "You don't have any prescriptions yet"}
            </Text>
          </View>
        ) : (
          filteredPrescriptions.map((prescription) => (
            <PrescriptionCard 
              key={prescription.id} 
              prescription={prescription} 
              navigation={navigation}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

// Extracted Prescription Card Component
const PrescriptionCard = React.memo(({ prescription, navigation }) => (
  <View style={styles.cardContainer}>
    <View style={styles.card}>
      <Image 
        source={prescription.patient?.image_url ? 
          { uri: prescription.patient.image_url } : 
          require('../../assets/images/avator.png')} 
        style={styles.image} 
      />
      <View style={styles.info}>
        <Text style={styles.name}>{prescription.patient?.name || 'Unknown Patient'}</Text>
        
        <View style={styles.detailRow}>
          <FontAwesome name="calendar" size={16} color="#4CAF50" style={styles.icon} />
          <Text style={styles.detailText}>Date: {prescription.date || 'N/A'}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <FontAwesome name="calendar-check-o" size={16} color="#FF5252" style={styles.icon} />
          <Text style={styles.detailText}>Next Visit: {prescription.next_appointment_date || 'Not scheduled'}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <FontAwesome name="medkit" size={16} color="#2196F3" style={styles.icon} />
          <Text style={styles.detailText}>Pharmacy: {prescription.pharmacy?.name || 'Not specified'}</Text>
        </View>
        
       
      </View>
    </View>
    
    <TouchableOpacity 
      style={styles.viewButton}
      onPress={() => navigation.navigate('Prescription Detail', { prescriptionId: prescription.id })}
      activeOpacity={0.8}
    >
      <Text style={styles.viewButtonText}>View Full Prescription</Text>
      <FontAwesome name="chevron-right" size={14} color="#fff" />
    </TouchableOpacity>
  </View>
));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f7fa',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 16,
    marginTop: 15,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#274A8A',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#274A8A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginRight: 35, // To balance the back button space
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    margin: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 5,
  },
  scrollContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyImage: {
    width: width * 0.6,
    height: width * 0.6,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  cardContainer: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  card: {
    flexDirection: 'row',
    padding: 16,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  info: {
    flex: 1,
    marginLeft: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    marginLeft: 8,
    color: '#555',
    fontSize: 14,
  },
  viewButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#274A8A',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  viewButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginRight: 8,
  },
});

export default PrescriptionHistoryScreen;