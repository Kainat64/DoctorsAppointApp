import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
const {width, height} = Dimensions.get('window');
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BaseUrl} from '../../utils/BaseApi';
import AvailableTestsScreen from './AvailableTestsScreen';
const BookLabTestScreen = ({route}) => {
  const {tests} = route.params;
  // console.log('load param....',tests);
  const navigation = useNavigation();
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLabId, setSelectedLabId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAvailableLabs();
  }, []);
  const fetchAvailableLabs = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${BaseUrl}/get-clinic-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('fetching...', response.data);
      setLabs(response.data);
      //console.log(response.data);
      setLoading(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch appointments');
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <Text>
        <ActivityIndicator size={'large'} />
      </Text>
    );
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }
  const filteredLabs = labs.filter(lab =>
    lab.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleLabSelection = labId => {
    setSelectedLabId(labId);
    console.log('Selected Lab ID:', labId); // For debugging purposes
  };
  const bookLabAppointment = () => {
    if (selectedLabId) {
      navigation.navigate('Confirm Test', {labId: selectedLabId, tests: tests});
    } else {
      Alert.alert('Please select a lab first'); // Alert if no lab is selected
    }
  };
  // Function to open lab location in maps
  const openLocation = () => {
    if (labs && labs.location) {
      Linking.openURL(labs.location).catch(err =>
        Alert.alert('Error', 'Failed to open location'),
      );
    } else {
      Alert.alert('Location Not Available', 'Lab location is not available');
    }
  };
  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Available Test', {tests: tests})
            }>
            <Icon name="arrow-back" size={30} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Back</Text>
        </View>

        <View style={styles.searchContainer}>
          <Icon
            name="search"
            size={20}
            color="#A9A9A9"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchBar}
            placeholder="Search Labs"
            placeholderTextColor="#A9A9A9"
            value={searchQuery}
            onChangeText={text => setSearchQuery(text)}
          />
        </View>

        <Text style={styles.sectionTitle}>Top Laboratories</Text>

        <ScrollView style={styles.scrollView}>
          {filteredLabs.map(lab => (
            <TouchableOpacity
              key={lab.id}
              style={[
                styles.labItem,
                selectedLabId === lab.id && styles.selectedLab,
              ]}
              onPress={() => handleLabSelection(lab.id)}>
              <View style={styles.labDetails}>
                <Icon name="flask-outline" size={30} color="#276EF1" />

                <View style={styles.labTextContainer}>
                  <Text style={styles.labName}>{lab.name}</Text>
                  <Text style={styles.labBranches}>{lab.google_address}</Text>

                  <View style={styles.labHoursContainer}>
                    <Icon name="time-outline" size={20} color="#276EF1" />
                    <Text style={styles.labHoursText}>24/7</Text>
                  </View>
                </View>
              </View>

             
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View>
          <TouchableOpacity
            style={styles.appointmentButton}
            onPress={bookLabAppointment}>
            <Text style={styles.viewProfileText}>Book Appointment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
  },
  header: {
    height: height * 0.08,
    backgroundColor: '#274A8A',
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
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: width * 0.05,
    marginTop: height * 0.02,
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.015,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },

  searchIcon: {
    marginRight: 10,
  },

  searchBar: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },

  sectionTitle: {
    marginHorizontal: width * 0.05,
    marginTop: height * 0.02,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: height * 0.02,
  },
  scrollView: {
    marginHorizontal: width * 0.05,
  },
  labItem: {
    backgroundColor: '#fff',
    padding: width * 0.03,
    marginBottom: height * 0.02,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  selectedLab: {
    backgroundColor: '#DCEFFC', // Change color for selected lab
  },
  labDetails: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Changed from 'center' to 'flex-start' for better alignment
  },
  labTextContainer: {
    marginLeft: width * 0.03,
    flex: 1, // Added to take remaining space
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
  labHoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.005,
  },
  labHoursText: {
    fontSize: 14,
    color: '#276EF1',
    marginLeft: 15, // Added for spacing between icon and text
  },
  labHoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.005,
  },

  labHoursText: {
    fontSize: 14,
    color: '#276EF1',
  },


  appointmentButton: {
    marginTop: height * 0.02,
    backgroundColor: '#274A8A',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.2,
    borderRadius: 10,
    marginBottom: height * 0.002,
  },
  viewProfileText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
export default BookLabTestScreen;
