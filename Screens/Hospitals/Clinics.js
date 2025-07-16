/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useCallback } from "react";
import { 
  ScrollView, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity,
  Linking, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator,
  RefreshControl 
} from 'react-native';
import { useNavigation, useRoute } from "@react-navigation/native";
import { getHospitalList } from "../../utils/Api";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
export default function Clinics() {
  const navigation = useNavigation();
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
const route = useRoute();

  const { voice } = route.params || {};
  const fetchHospitals = useCallback(async () => {
    try {
      const response = await getHospitalList();
      setHospitals(response.data);
      setFilteredHospitals(response.data);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchHospitals();
  }, [fetchHospitals]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    if (query === "") {
      setFilteredHospitals(hospitals);
    } else {
      const filtered = hospitals.filter((hospital) =>
        hospital.hospital_name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredHospitals(filtered);
    }
  }, [hospitals]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchHospitals();
  }, [fetchHospitals]);

const ShowHospitalProfile = useCallback(
  (hospitalId) => {
    const screenName =
      voice === 1 ? "Book Appointment" : "Book Voice Consultation";
    navigation.navigate(screenName, { hospitalId });
  },
  [navigation, voice] // voice is now a dependency
);

// ... rest of the component remains the same

  const handleCall = useCallback((phone) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    } else {
      alert("No helpline number available.");
    }
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning" size={50} color="#FF3B30" />
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchHospitals}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Ionicons name="arrow-back" size={24} color="#274A8A" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Find Clinics Near You</Text>
      </View>
      <Text style={styles.subHeaderText}>Quality healthcare at your fingertips</Text>
    </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Clinics..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={handleSearch}
          clearButtonMode="while-editing"
        />
      </View>

      <FlatList
        data={filteredHospitals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.hospitalContainer}>
            <View style={styles.hospitalHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name="medkit" size={20} color="white" />
              </View>
              <Text style={styles.hospitalName}>{item.hospital_name}</Text>
            </View>
            
            <View style={styles.addressContainer}>
              <Ionicons name="location" size={16} color="#4A90E2" />
              <Text style={styles.hospitalAddress}>{item.google_address}</Text>
            </View>
            
            <View style={styles.hospitalInfo}>
              <View style={styles.infoItem}>
                <Ionicons name="time" size={16} color="#4A90E2" />
                <Text style={styles.infoText}>24/7</Text>
              </View>
              
            </View>
            
           
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.helplineButton}
                onPress={() => handleCall(item.phone)}
              >
                <Ionicons name="call" size={16} color="white" />
                <Text style={styles.buttonText}>Call</Text>
              </TouchableOpacity>
              
            





            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-off" size={50} color="#888" />
            <Text style={styles.emptyText}>No hospitals found</Text>
          </View>
        }
        refreshControl={
          <RefreshControl 
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4A90E2']}
            tintColor="#4A90E2"
          />
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}





const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    backgroundColor: '#f7f9fc',
  },
  header: {
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  headerText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#274A8A',
    marginBottom: 8,
  },
  subHeaderText: {
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 3,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  hospitalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  hospitalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
    headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap:10
  },
  iconContainer: {
    backgroundColor: '#4A90E2',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    flexShrink: 1,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  hospitalAddress: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    flex: 1,
  },
  hospitalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 4,
  },
  departmentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  departmentBadge: {
    backgroundColor: '#E8F0FE',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  departmentText: {
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  helplineButton: {
    flex: 1,
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButton: {
    flex: 1,
    backgroundColor: '#274A8A',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f9fc',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7f9fc',
  },
  errorText: {
    fontSize: 16,
    color: '#333',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    marginTop: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
});