/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet, Image, Keyboard, PermissionsAndroid, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import debounce from 'lodash.debounce';
import Icon from 'react-native-vector-icons/FontAwesome';
import GetLocation from 'react-native-get-location';
import haversine from 'haversine-distance';
import { BaseUrl } from '../../utils/BaseApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { getSetting } from '../../utils/SettingsService';

const HospitalSearchScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [region, setRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [userAddress, setUserAddress] = useState('');
  const mapRef = useRef(null);

  // 1. Get User Location
  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: "Location Permission",
              message: "We need your location to show nearby hospitals",
              buttonPositive: "OK"
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            fetchUserLocation();
          }
        } catch (err) {
          console.warn(err);
        }
      } else {
        fetchUserLocation();
      }
    };

    requestLocationPermission();
  }, []);

  const fetchUserLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
    .then(location => {
      const { latitude, longitude } = location;
      setUserLocation({ latitude, longitude });
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      getAddressFromCoordinates(latitude, longitude);
    })
    .catch(error => {
      console.warn(error.code, error.message);
      // Default to Cork if location fails
      setRegion({
        latitude: 51.8985,
        longitude: -8.4756,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      });
    });
  };
  
  
 const mapapikey = getSetting('maps_platform_api_key');
 console.log('mapapikey', mapapikey);

  // 2. Get Address from Coordinates
const googleMapsApiKey = Platform.OS === 'android'
  ? getSetting('maps_platform_api_key')
  : getSetting('maps_platform_api_key');
  const getAddressFromCoordinates = async (lat, lng) => {
       const API_KEY = googleMapsApiKey;
   //const API_KEY = 'AIzaSyBpMcgqMMDkwDziXSTEBDTVgwIdpRGTy5Y';
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
      );
      const data = await response.json();
      if (data.results.length > 0) {
        setUserAddress(data.results[0].formatted_address);
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    }
  };

  // 3. Calculate Distance Between User and Hospitals
  const calculateDistance = (hospitalLat, hospitalLng) => {
    if (!userLocation || !hospitalLat || !hospitalLng) return null;
    
    const userCoords = {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude
    };
    
    const hospitalCoords = {
      latitude: parseFloat(hospitalLat),
      longitude: parseFloat(hospitalLng)
    };
    
    const distanceInMeters = haversine(userCoords, hospitalCoords);
    return (distanceInMeters / 1000).toFixed(1); // Convert to km
  };

  // 4. Search Hospitals with Distance
 const searchHospitals = debounce(async (text) => {
    if (text.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('No authentication token found');
        return;
      }
      console.log("searching....", token);
      console.log('base url', BaseUrl);
      const response = await axios.get(`${BaseUrl}/search-clinics`, { // Ensure endpoint is correct
        params: { query: text },
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000 // Add timeout to prevent hanging requests
      });

         // setSuggestions(response.data);

      
      // Add distance to each hospital
      const hospitalsWithDistance = response.data.data.map(hospital => ({
        ...hospital,
        distance: calculateDistance(hospital.lat, hospital.lng)
      }));
      
      // Sort by distance if available
      const sortedHospitals = hospitalsWithDistance.sort((a, b) => {
        if (a.distance && b.distance) return a.distance - b.distance;
        return 0;
      });
      
      setSuggestions(sortedHospitals);
      
      // Center map on first result
      if (sortedHospitals.length > 0) {
        animateToLocation({
          latitude: parseFloat(sortedHospitals[0].lat),
          longitude: parseFloat(sortedHospitals[0].lng)
        });
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  }, 300);

  
  const animateToLocation = (coords) => {
    mapRef.current?.animateToRegion({
      ...coords,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }, 1000);
  };

  const handleSelectHospital = (hospital) => {
    animateToLocation({
      latitude: parseFloat(hospital.lat),
      longitude: parseFloat(hospital.lng)
    });
    navigation.navigate('Book Appointment', { hospitalId:hospital.id });
  };
   
  return (
    <View style={styles.container}>
      {/* Search Input with User Location */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={`Search near ${userAddress || 'your location'}`}
          placeholderTextColor={'#888'}
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            searchHospitals(text);
          }}
        />
      </View>

      {/* Search Results */}
      {suggestions.length > 0 && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.hospitalItem}
                onPress={() => handleSelectHospital(item)}
              >
                <Text style={styles.hospitalName}>{item.hospital_name}</Text>
                <Text style={styles.hospitalAddress}>{item.google_address}</Text>
                {item.distance && (
                  <Text style={styles.distanceText}>
                    📍 {item.distance} km from your location
                  </Text>
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Map with User Location and Hospitals */}
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {suggestions.map(hospital => (
          <Marker
            key={hospital.id}
            coordinate={{
              latitude: parseFloat(hospital.lat),
              longitude: parseFloat(hospital.lng),
            }}
            title={hospital.hospital_name}
            description={`${hospital.distance ? `${hospital.distance} km away` : ''}`}
          >
            <View style={styles.marker}>
              <Text style={styles.markerText}>
                {hospital.distance ? `${hospital.distance}km` : ''}
              </Text>
            </View>
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    zIndex: 1,
    elevation: 3,
  },
  searchInput: {
    color: '#333',
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  resultsContainer: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    maxHeight: 200,
    backgroundColor: 'white',
    borderRadius: 10,
    zIndex: 1,
    elevation: 3,
  },
  hospitalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  hospitalName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  hospitalAddress: {
    color: '#666',
    marginVertical: 4,
  },
  distanceText: {
    color: '#2ecc71',
    fontWeight: 'bold',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  marker: {
    backgroundColor: '#3498db',
    padding: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
  markerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default HospitalSearchScreen;