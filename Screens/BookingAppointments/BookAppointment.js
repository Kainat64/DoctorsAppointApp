/* eslint-disable no-trailing-spaces */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable curly */
/* eslint-disable no-catch-shadow */
/* eslint-disable no-shadow */
/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  Button,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {FontFamily, Color, Padding, Border, FontSize} from '../../GlobalStyles';

import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-date-picker';
import {getDoctorById, getHospitalById} from '../../utils/Api';
import {bookAppointment} from '../../utils/Api';
import moment from 'moment';
import axios from 'axios';
import {BaseUrl} from '../../utils/BaseApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
export default function BookAppointment({route}) {
  const navigation = useNavigation();
 const { hospitalId } = route.params || {};
 // Inside the Clinics screen component


// Use 'voice' to conditionally render the correct button
  const [name, setName] = useState('');
  const [hospital, setHospital] = useState([]);
  const [date, setDate] = useState(new Date());
  const [mobile, setMobile] = useState('');
  const [time, setTime] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  // Add this state at the top of your component
  const [refreshSlots, setRefreshSlots] = useState(false);

  // Modify your useEffect to include refreshSlots as a dependency
  useEffect(() => {
    if (hospitalId && date) {
      fetchTimeSlots(date);
    }
  }, [hospitalId, date, refreshSlots]); // Add refreshSlots here
  const handleTimeSlotPress = timeSlot => {
    setSelectedTimeSlot(timeSlot);
  };

  useEffect(() => {
    if (route.params?.hospitalId) {
      loadHospitalProfile(route.params.hospitalId);
    }
  }, [route.params?.hospitalId]);

 const loadHospitalProfile = async hospitalId => {
  try {
    const response = await getHospitalById(hospitalId);
    // Handle array response
    const hospitalData = Array.isArray(response.data) ? response.data[0] : response.data;
    setHospital([hospitalData]); // Keep as array for mapping
    console.log('Processed hospital data:', hospitalData);
  } catch (error) {
    console.error('Error loading hospital profile:', error);
    setError(error.message);
  }
};

  // Generate the next 7 days for the date picker
  useEffect(() => {
    const generateDates = () => {
      const tempDates = [];
      for (let i = 0; i < 30; i++) {
        const date = moment().add(i, 'days').toDate();
        tempDates.push(date);
      }
      setDates(tempDates);
    };
    generateDates();
  }, []);

 const fetchTimeSlots = async (selectedDate) => {
  console.log('Fetching time slots...');
  setLoading(true);

  try {
    const formattedDate = selectedDate.toISOString().split('T')[0];
    console.log('Selected date:', formattedDate);

    let isDayOff = false;
    try {
      const dayOffResponse = await fetch(`${BaseUrl}/day-off/${hospitalId}`);
      console.log('Day-off response status:', dayOffResponse.status);
      if (dayOffResponse.ok) {
        const dayOffs = await dayOffResponse.json();
        console.log('Day-offs:', dayOffs);
        if (Array.isArray(dayOffs)) {
          isDayOff = dayOffs.some((dayOff) => dayOff.date === formattedDate);
        }
      }
    } catch (error) {
      console.warn('Day-off check failed:', error.message);
    }

    if (isDayOff) {
      Alert.alert('Doctor is not available on this day due to a day-off.');
      setSlots([]);
      return;
    }

    console.log('Calling time slot API...');
    const response = await fetch(
      `${BaseUrl}/available-slots/${hospitalId}/${formattedDate}`
    );
    console.log('Time slot response status:', response.status);

    // Handle 503 specifically as no slots available
    if (response.status === 503) {
      console.log('No slots available (treated from 503)');
      setSlots([]);
      return;
    }

    if (!response.ok) {
      throw new Error('fetchTimeSlots() failed to fetch hospital time slots.');
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Invalid data format for slots.');
    }

    const formattedSlots = data.map((slot) =>
      moment(slot, 'HH:mm:ss').format('hh:mm A')
    );

    setSlots(formattedSlots);
    console.log('Available slots:', formattedSlots);
  } catch (error) {
    console.error('fetchTimeSlots() error:', error);
    setError(error.message);
    setSlots([]);
    // Only show alert for non-503 errors
    if (!error.message.includes('503')) {
      Alert.alert('No time slots found or failed to fetch.');
    }
  } finally {
    setLoading(false);
  }
};
  
  

  useEffect(() => {
    if (hospitalId&& date) {
      fetchTimeSlots(date);
    }
  }, [hospitalId, date]);

  const onChange = selectedDate => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    fetchTimeSlots(currentDate);
  };

  const handleDateSelect = date => {
    setSelectedDate(date);
    
  };

  const bookAppointment = async () => {
    // Validation checks
    if (!selectedDate) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
  
    // Name validation (letters and spaces only, 2-50 characters)
   
  
    // Phone number validation (digits only, max 15 characters)
    
  
    try {
      const token = await AsyncStorage.getItem('userToken');
      const timeSlot24Hour = moment(selectedTimeSlot, 'hh:mm A').format('HH:mm:ss');
      
      await axios.post(
        `${BaseUrl}/book-appointments`,
        {
         
          date: moment(selectedDate).format('YYYY-MM-DD'),
          time: '00:00:00',
          hospital_id: hospitalId,
          types: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      
      Alert.alert('Success', 'Appointment booked successfully');
      setName('');
      setMobile('');
      navigation.navigate('Appointment Success');
    } catch (error) {
      console.error('Booking error:', error);
      let errorMessage = 'Failed to book appointment. Please try again.';
      
      // More specific error messages
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = error.response.data.message || 'Invalid request data';
        } else if (error.response.status === 401) {
          errorMessage = 'Session expired. Please login again.';
        }
      }
      
      Alert.alert('Error', errorMessage);
    }
  };

  const renderDateItem = ({item}) => {
    const isSelected = moment(item).isSame(selectedDate, 'day');
    return (
      <TouchableOpacity
        style={[styles.dateButton, isSelected && styles.selectedDateButton]}
        onPress={() => handleDateSelect(item)}>
        <Text style={[styles.dateText, isSelected && styles.selectedDateText]}>
          {moment(item).format('ddd MMM D')}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading && hospital.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Color.blue1} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Button title="Retry" onPress={() => loadHospitalProfile(hospitalId)} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        {/* Back Button with Arrow and Text */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Clinics', { consultationType: 'walk' })}
          style={styles.backButton}
          activeOpacity={0.7}>
          <View style={styles.backButtonContent}>
            <FontAwesome
              name="arrow-left"
              size={20}
              color="#274A8A"
              style={styles.backIcon}
            />
            <Text style={styles.backText}>Back</Text>
          </View>
        </TouchableOpacity>

        {/* Your other header content can go here */}
      </View>
      {hospital.length > 0 &&
  hospital.map((hospitalItem, index) => ( // Renamed to hospitalItem for clarity
    <View key={index} style={styles.card}>
      {/* Hospital Profile Section */}
      <View style={styles.doctorProfile}>
        <Image
          style={styles.doctorImage}
          resizeMode="cover"
          source={{
            uri: hospitalItem.image_url || 'https://via.placeholder.com/100',
          }}
        /><View style={styles.doctorInfo}>
          <View style={styles.doctorNameContainer}>
            <Text style={styles.doctorName}>
              {hospitalItem.hospital_name} {/* Corrected reference */}
            </Text>
            <Image
              style={styles.verifiedIcon}
              resizeMode="cover"
              source={require('../../assets/check-16019958-1.png')}
            />
          </View>
          {/* <Text style={styles.qualification}>
            {hospitalItem.distance || 'No distance specified'} 
          </Text> */}
        </View>
      </View>

            {/* Doctor Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>1</Text>
                <Text style={styles.statLabel}>Verified Doctor</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>2</Text>
                <Text style={styles.statLabel}>Online Prescriptions</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>3</Text>
                <Text style={styles.statLabel}>Free Chat With Doctor</Text>
              </View>
            </View>

            {/* Date Selection */}
            <Text style={styles.sectionTitle}>Select Date:</Text>
            <FlatList
              data={dates}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={renderDateItem}
              keyExtractor={(item, index) => index.toString()}
              style={styles.dateList}
            />

            {/* Patient Information Form */}
         

            {/* Time Slots */}
            {/* <Text style={styles.sectionTitle}>Available Time Slots:</Text>
            {loading ? (
              <ActivityIndicator size="small" color={Color.blue1} />
            ) : slots.length > 0 ? (
              <View style={styles.slotsContainer}>
                {slots.map((slot, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.timeSlotButton,
                      selectedTimeSlot === slot &&
                        styles.selectedTimeSlotButton,
                    ]}
                    onPress={() => handleTimeSlotPress(slot)}>
                    <Text
                      style={[
                        styles.timeSlotText,
                        selectedTimeSlot === slot &&
                          styles.selectedTimeSlotText,
                      ]}>
                      {slot}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={styles.noSlotsText}>No available time slots</Text>
            )} */}

            {/* Book Appointment Button */}
            <TouchableOpacity
              style={[
                styles.bookButton,
              
              ]}
              onPress={bookAppointment}
              >
              <Text style={styles.bookButtonText}>Book Appointment</Text>
            </TouchableOpacity>
          </View>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginLeft:20,
  },
  backButton: {
    // Removed fixed width to allow content to determine size
  },
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    marginRight: 8, // Space between icon and text
  },
  backText: {
    color: '#274A8A',
    fontSize: 16,
    fontWeight: '500',
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
    color: 'red',
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  doctorProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: Color.blue1,
  },
  doctorInfo: {
    flex: 1,
    marginLeft: 15,
  },
  doctorNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '600',
    color: Color.blue1,
  },
  verifiedIcon: {
    width: 18,
    height: 18,
    marginLeft: 5,
  },
  specialization: {
    fontSize: 14,
    color: Color.inActiveFieldsColor,
    marginTop: 5,
  },
  qualification: {
    fontSize: 14,
    color: Color.inActiveFieldsColor,
    marginTop: 3,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  statBox: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 10,
    width: '30%',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Color.blue1,
  },
  statLabel: {
    fontSize: 12,
    color: Color.inActiveFieldsColor,
    textAlign: 'center',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Color.blue1,
    marginVertical: 10,
  },
  dateList: {
    marginVertical: 10,
  },
  dateButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedDateButton: {
    backgroundColor: Color.blue1,
  },
  dateText: {
    fontSize: 14,
    color: '#333',
  },
  selectedDateText: {
    color: 'white',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    fontSize: 16,
    color: "black"
  },
  slotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginVertical: 10,
  },
  timeSlotButton: {
    backgroundColor: Color.blue1,
    padding: 10,
    borderRadius: 8,
    margin: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  selectedTimeSlotButton: {
    backgroundColor: '#4CAF50',
  },
  timeSlotText: {
    color: 'white',
    fontSize: 14,
  },
  noSlotsText: {
    textAlign: 'center',
    color: Color.inActiveFieldsColor,
    marginVertical: 15,
  },
  bookButton: {
    backgroundColor: Color.blue1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
