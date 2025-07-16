import React, { useState,  useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions,ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
const { width, height } = Dimensions.get('window');
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseUrl } from '../../utils/BaseApi';

const BookLabTestScreen = ({ route }) => {
  //const {testDetail } = route.params;
  const navigation = useNavigation();
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLabId, setSelectedLabId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
      
      
    //fetchAvailableTests();
   
    
}, []);
const fetchAvailableTests = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${BaseUrl}/get-labs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
      });
      console.log('fetching...');
      setLabs(response.data);
      //console.log(response.data);
      setLoading(false);
  } catch (error) {
      Alert.alert('Error', 'Failed to fetch appointments');
      setLoading(false);
  }
  
};
if (loading) {
  return <Text>
    <ActivityIndicator size={"large"}/>
  </Text>;
}

if (error) {
  return <Text>Error: {error}</Text>;
}

  const filteredLabs = labs.filter(lab => 
    lab.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLabSelection = (labId) => {
    setSelectedLabId(labId);
    console.log('Selected Lab ID:', labId); // For debugging purposes
    // Here you can also navigate to another screen or perform any action
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={navigation.navigate("Available Test")}>
          <Icon name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Lab Test</Text>
      </View>

      <View style={styles.locationContainer}>
        <Icon name="location-outline" size={20} color="#276EF1" />
        <Text style={styles.locationText}>Dublin</Text>
        <Icon name="chevron-down-outline" size={20} color="#276EF1" />
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="Search Labs"
        placeholderTextColor="#A9A9A9"
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}
      />

      <Text style={styles.sectionTitle}>Top Laboratories</Text>

      <ScrollView style={styles.scrollView}>
        {filteredLabs.map(lab => (
          <View key={lab.id} style={styles.labItem}>
            <View style={styles.labDetails}>
              <Icon name="flask-outline" size={40} color="#276EF1" />
              <View style={styles.labTextContainer}>
                <Text style={styles.labName}>{lab.name}</Text>
                <Text style={styles.labBranches}>{lab.address}</Text>
                <Text style={styles.labHours}>
                  <Icon name="time-outline" size={16} color="#276EF1" /> 
                  { moment(lab.start_time, 'HH:mm').format('hh:mm A')} to { moment(lab.end_time, 'HH:mm').format('hh:mm A')}
                </Text>
              </View>
            </View>
            <View style={styles.discountContainer}>
              <Text style={styles.discountText}>0</Text>
            </View>
            <TouchableOpacity 
              style={styles.viewProfileButton} 
              onPress={() => handleLabSelection(lab.id)} // Handle lab selection
            >
              <Text style={styles.viewProfileText}>View Profile</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
  },
  header: {
    height: height * 0.08,
    backgroundColor: '#276EF1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
    marginLeft: width * 0.03,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: width * 0.05,
    marginVertical: height * 0.02,
    backgroundColor: '#fff',
    padding: height * 0.015,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  locationText: {
    flex: 1,
    fontSize: 16,
    color: '#276EF1',
    marginLeft: width * 0.02,
  },
  searchBar: {
    marginHorizontal: width * 0.05,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.03,
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  sectionTitle: {
    marginHorizontal: width * 0.05,
    marginTop: height * 0.02,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  scrollView: {
    marginHorizontal: width * 0.05,
  },
  labItem: {
    backgroundColor: '#fff',
    padding: width * 0.03,
    marginBottom: height * 0.02,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  labDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labTextContainer: {
    marginLeft: width * 0.03,
  },
  labName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  labBranches: {
    fontSize: 14,
    color: '#888',
    marginTop: height * 0.005,
  },
  labHours: {
    fontSize: 14,
    color: '#276EF1',
    marginTop: height * 0.005,
  },
  discountContainer: {
    backgroundColor: '#00C853',
    paddingHorizontal: width * 0.02,
    paddingVertical: height * 0.005,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginTop: height * 0.02,
  },
  discountText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  viewProfileButton: {
    marginTop: height * 0.02,
    backgroundColor: '#276EF1',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.15,
    borderRadius: 10,
  },
  viewProfileText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default BookLabTestScreen;
