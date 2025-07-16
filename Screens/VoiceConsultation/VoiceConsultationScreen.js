import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, ScrollView, Dimensions, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { getDoctors, getHospitalList } from '../../utils/Api';

const { width } = Dimensions.get('window');

const VoiceConsultationScreen = () => {
  const navigation = useNavigation();
  const [hospital, setHospital] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadHospitals = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getHospitalList();
      setHospital(response.data);
      console.log("hospitals voice", response.data)
    } catch (err) {
      setError('Failed to load hsopital. Please try again.');
      console.error('Error loading hospitals:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHospitals();
  }, [loadHospitals]);

  const handleBookAppointment = useCallback((hospitalId) => {
    navigation.navigate('Book Voice Consultation', { hospitalId });
  }, [navigation]);

  const filteredHospitals = hospital.filter(hospital =>
    `${hospital.hospital_name}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2a5698" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadHospitals}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar with improved styling */}
      <View style={styles.headerContainer}>
          {/* Back Arrow Button */}
          <TouchableOpacity 
            onPress={() => navigation.navigate('Home')}
            style={styles.backButton}
          >
            <FontAwesome name="arrow-left" size={20} color="#274A8A" />
          </TouchableOpacity>

          {/* Search Container */}
          <View style={styles.searchContainer}>
            <FontAwesome name="search" size={18} color="#8e8e93" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Find a Hospital by name"
              placeholderTextColor="#8e8e93"
              value={searchQuery}
              onChangeText={setSearchQuery}
              clearButtonMode="while-editing"
            />
          </View>
        </View>

      {/* Tab Bar with subtle indicator */}
      <View style={styles.tabContainer}>
        <View style={styles.tabActiveContainer}>
          <Text style={styles.tabActive}>Available Hospitals</Text>
          <View style={styles.activeTabIndicator} />
        </View>
      </View>

      {/* Doctor Cards with empty state handling */}
      <ScrollView 
        style={styles.cardContainer}
        contentContainerStyle={filteredHospitals.length === 0 && styles.emptyContainer}
      >
        {filteredHospitals.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome name="user-md" size={50} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchQuery ? 'No Hospitals match your search' : 'No hospitals available at the moment'}
            </Text>
          </View>
        ) : (
          filteredHospitals.map((hospital) => (
            <DoctorCard 
              key={hospital.id}
              doctor={hospital}
              onPress={() => handleBookAppointment(hospital.id)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

// Extracted DoctorCard component for better reusability and performance
const DoctorCard = React.memo(({ hospital, onPress }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Image
        style={styles.profilePic}
        resizeMode="cover"
        source={{
          uri: hospital.image_url || 'https://via.placeholder.com/100',
        }}
      />
      <View style={styles.cardInfo}>
        <Text style={styles.doctorName}>
          {hospital.hospital_name}
        </Text>
        <Text style={styles.specialization}>{hospital.distance}</Text>
        <View style={styles.availabilityBadge}>
          <FontAwesome name="circle" size={8} color="#4CAF50" style={styles.availabilityIcon} />
          <Text style={styles.availabilityText}>Available On Call</Text>
        </View>
      </View>
      <FontAwesome name="check-circle" size={18} color="#4CAF50" />
    </View>

    <Text style={styles.doctorDetails}>{hospital.about_me || 'No description available'}</Text>

    

    <View style={styles.consultationBox}>
      <View style={styles.consultationHeader}>
        <FontAwesome name="phone" size={16} color="#2a5698" />
        <Text style={styles.consultationText}>Consultations on Call</Text>
      </View>
      <View style={styles.consultationDetails}>
        <View style={styles.timeContainer}>
          <FontAwesome name="clock-o" size={14} color="#2a5698" />
          <Text style={styles.consultationHours}>
            {moment(hospital.start_time, 'HH:mm').format('hh:mm A')} -{' '}
            {moment(hospital.end_time, 'HH:mm').format('hh:mm A')}
          </Text>
        </View>
        <Text style={styles.consultationPrice}>${hospital.checkup_fee}</Text>
      </View>
    </View>

    <TouchableOpacity 
      style={styles.bookButton} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <FontAwesome name="phone" size={16} color="#fff" />
      <Text style={styles.bookButtonText}>Book a Call Consultation</Text>
    </TouchableOpacity>
  </View>
));

// Extracted StatItem component
const StatItem = ({ value, label }) => (
  <View style={styles.statItem}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#2a5698',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 10,
    marginRight: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  tabContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginHorizontal: 15,
  },
  tabActiveContainer: {
    alignItems: 'center',
  },
  tabActive: {
    color: '#2a5698',
    fontWeight: '600',
    fontSize: 16,
    paddingBottom: 10,
  },
  activeTabIndicator: {
    height: 3,
    width: 40,
    backgroundColor: '#2a5698',
    borderRadius: 3,
  },
  cardContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 15,
    color: '#8e8e93',
    fontSize: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  specialization: {
    color: '#666',
    fontSize: 14,
    marginTop: 2,
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  availabilityIcon: {
    marginRight: 5,
  },
  availabilityText: {
    color: '#4CAF50',
    fontSize: 13,
    fontWeight: '500',
  },
  doctorDetails: {
    marginVertical: 10,
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2a5698',
  },
  statLabel: {
    fontSize: 12,
    color: '#8e8e93',
    marginTop: 4,
  },
  consultationBox: {
    backgroundColor: '#f0f7ff',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  consultationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  consultationText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '600',
    color: '#2a5698',
  },
  consultationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  consultationHours: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
  },
  consultationPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2a5698',
  },
  bookButton: {
    backgroundColor: '#2a5698',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    marginTop: 15,
    shadowColor: '#2a5698',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  bookButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 15,
  },
});

export default VoiceConsultationScreen;