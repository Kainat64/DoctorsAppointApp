/* eslint-disable no-catch-shadow */
/* eslint-disable no-shadow */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import { getDoctorById, getHospitalById } from '../../utils/Api';
import { BaseUrl } from '../../utils/BaseApi';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
const VideoConsultion = ({ route }) => {
  const navigation = useNavigation();
  const { hospitalId } = route.params;

  // State management
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
  });
  const [hospital, setHospital] = useState(null);
  const [slots, setSlots] = useState([]);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [loading, setLoading] = useState({
    doctor: true,
    slots: false,
  });
  const [error, setError] = useState(null);

const screenWidth = Dimensions.get('window').width;
const numColumns = screenWidth > 300 ? 3 : 2;
const slotWidth = `${100 / numColumns - 5}%`; // e.g. ~30% or ~45%
  useEffect(() => {
    const generateDates = () => {
      const tempDates = [];
      for (let i = 0; i < 7; i++) {
        tempDates.push(moment().add(i, 'days').toDate());
      }
      setDates(tempDates);

      // Set default selected date to today and fetch slots
      const today = tempDates[0];
      setSelectedDate(today);
      fetchTimeSlots(today);
    };

    generateDates();
  }, []);


  // Load doctor profile
  useEffect(() => {
    const loadHospital = async () => {
      try {
        const response = await getHospitalById(hospitalId);
        setHospital(response.data[0]);
        console.log("hospital info", response.data)
      } catch (err) {
        setError('Failed to load clinic profile');
      } finally {
        setLoading(prev => ({ ...prev, hospital: false }));
      }
    };
    loadHospital();
  }, [hospitalId]);

  // Fetch time slots when date changes
  const fetchTimeSlots = async selectedDate => {
    console.log('Fetching time slots...');
    setLoading(true);

    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      console.log('Selected date:', formattedDate);

      // Check day-off status
      let isDayOff = false;
      try {
        const dayOffResponse = await fetch(`${BaseUrl}/day-off/${hospitalId}`);
        if (dayOffResponse.ok) {
          const dayOffs = await dayOffResponse.json();
          if (Array.isArray(dayOffs)) {
            isDayOff = dayOffs.some(dayOff => dayOff.date === formattedDate);
          }
        }
      } catch (error) {
        console.warn('Day-off check failed:', error.message);
      }

      if (isDayOff) {
        Alert.alert('Doctor is not available on this day due to a day-off.');
        setSlots([]); // Clear any old slots
        return; // 🔁 Stop here, don't fetch time slots
      }

      // Fetch available time slots
      const response = await fetch(`${BaseUrl}/available-slots/${hospitalId}/${formattedDate}`);
      if (!response.ok) {throw new Error('Failed to fetch doctor time slots.');}

      const data = await response.json();
       const formattedSlots = data
        .map(slot => moment(slot, 'hh:mm A'))
        .sort((a, b) => a - b)
        .map(slot => slot.format('hh:mm A'));

      setSlots(formattedSlots);

      //console.log('Available slots:', formattedSlots);
    } catch (error) {
      console.error('Error fetching time slots:', error);
      setError(error.message);
      setSlots([]);
      Alert.alert('No time slots found or failed to fetch.');
    } finally {
      setLoading(false);
    }
  };


  // Handle form input changes
  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Book appointment
  const bookAppointment = async () => {
    // Trim all input values first
   
    // Validate all required fields
    if (!selectedTimeSlot || !selectedDate) {
      Alert.alert('Error', 'Please fill all fields and select a time slot');
      return;
    }

    // Name validation (2-50 characters, letters and spaces only)
    


    // Date validation (not in the past)
    //if (moment(selectedDate).isBefore(moment(), 'day')) {
     // Alert.alert('Error', 'Appointment date cannot be in the past');
     // return;
    //}

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'Session expired. Please login again.');
        return;
      }

      const timeSlot24Hour = moment(selectedTimeSlot, 'hh:mm A').format('HH:mm:ss');

      const response = await axios.post(
        `${BaseUrl}/book-appointments`,
        {
          
          date: moment(selectedDate).format('YYYY-MM-DD'),
          time: timeSlot24Hour,
          hospital_id: hospitalId,
          types: 2, // Video consultation type
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const { appointment_id } = response.data;
      if (!appointment_id) {
        throw new Error('Appointment ID missing in response');
      }

      const checkoutUrl = await createStripeCheckoutSession(appointment_id);
      if (!checkoutUrl) {
        throw new Error('Failed to create payment session');
      }

      navigation.navigate('StripeCheckoutScreen', { checkoutUrl });

    } catch (err) {
      console.error('Appointment error:', err);

      let errorMessage = 'Failed to book appointment. Please try again.';

      if (err.response) {
        // Handle specific API error responses
        if (err.response.status === 400) {
          errorMessage = err.response.data?.message || 'Invalid request data';
        } else if (err.response.status === 401) {
          errorMessage = 'Session expired. Please login again.';
        } else if (err.response.status === 409) {
          errorMessage = 'This time slot is already booked. Please choose another.';
        }
      }

      Alert.alert('Error', errorMessage);
    }
  };

  // Create Stripe checkout session
  const createStripeCheckoutSession = async (appointmentId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(
        `${BaseUrl}/create-checkout-session`,
        { appointment_id: appointmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.url;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  // Render date item for FlatList
  const renderDateItem = ({ item }) => {
    const isSelected = moment(item).isSame(selectedDate, 'day');
    return (
      <TouchableOpacity
        style={[styles.dateButton, isSelected && styles.selectedDateButton]}
        onPress={() => {
          setSelectedDate(item);
          fetchTimeSlots(item);
        }}
      >
        <Text style={[styles.dateText, isSelected && styles.selectedDateText]}>
          {moment(item).format('ddd MMM D')}
        </Text>
      </TouchableOpacity>
    );
  };

  // Render time slot button
  const renderTimeSlot = (slot, index) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.timeSlotButton,
        selectedTimeSlot === slot && styles.selectedTimeSlotButton,
      ]}
      onPress={() => setSelectedTimeSlot(slot)}
    >
      <FontAwesome name="clock-o" size={16} color="#fff" style={styles.timeSlotIcon} />
      <Text style={styles.timeSlotText}>{slot}</Text>
    </TouchableOpacity>
  );

  if (loading.doctor) {return <LoadingView />;}
  if (error && !hospital) {return <ErrorView error={error} />;}
  if (!hospital) {return <LoadingView />;}

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
              {/* Back Button with Arrow and Text */}
              <TouchableOpacity
                onPress={() => navigation.navigate('Doctors')}
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
      {/* Doctor Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: hospital.image_url || 'https://via.placeholder.com/100' }}
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {hospital.hospital_name}
          </Text>
          
          <View style={styles.statusBadge}>
            <FontAwesome name="video-camera" size={14} color="#fff" />
            <Text style={styles.statusText}> Video Consultations</Text>
          </View>
        </View>
      </View>

      {/* Steps Indicator */}
      <View style={styles.stepsContainer}>
        {['24hrs Service', 'Online Prescriptions', 'Qualified Doctors'].map((text, index) => (
          <StepBox key={index} number={index + 1} text={text} />
        ))}
      </View>

     

      {/* Date Selection */}
      <Text style={styles.sectionTitle}>Select Appointment Date</Text>
      <FlatList
        data={dates}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderDateItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.dateList}
      />

      {/* Time Slot Selection */}
            <Text style={styles.sectionTitle}>Select Time Slot</Text>
      <View style={styles.timeSlotsContainer}>
        {loading.slots ? (
          <ActivityIndicator size="small" color="#274A8A" />
        ) : slots.length > 0 ? (
          slots.map((slot, index) => (
            <View key={index} style={[styles.slotBox, { width: slotWidth }]}>
              {renderTimeSlot(slot)}
            </View>
          ))
        ) : (
          <Text style={styles.noSlotsText}>No available time slots</Text>
        )}
      </View>


      {/* Book Button */}
      <TouchableOpacity
        style={[
          styles.consultButton,
          ( !selectedTimeSlot) && styles.disabledButton,
        ]}
        onPress={bookAppointment}
        disabled={!selectedTimeSlot}
      >
        <Text style={styles.consultButtonText}>Book Consultation</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Reusable Components
const LoadingView = () => (
  <View style={styles.centered}>
    <ActivityIndicator size="large" color="#274A8A" />
  </View>
);

const ErrorView = ({ error }) => (
  <View style={styles.centered}>
    <FontAwesome name="exclamation-triangle" size={50} color="#FF5722" />
    <Text style={styles.errorText}>{error}</Text>
  </View>
);

const NotFoundView = () => (
  <View style={styles.centered}>
    <FontAwesome name="user-times" size={50} color="#9E9E9E" />
    <Text style={styles.errorText}>Loading</Text>
  </View>
);

const StepBox = ({ number, text }) => (
  <View style={styles.stepBox}>
    <View style={styles.stepNumber}>
      <Text style={styles.stepNumberText}>{number}</Text>
    </View>
    <Text style={styles.stepText}>{text}</Text>
  </View>
);

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#FF5722',
    marginTop: 20,
    textAlign: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  profileSpecialty: {
    fontSize: 14,
    color: '#555',
    marginVertical: 3,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  stepBox: {
    width: 100,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#243B6B',
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepNumber: {
    backgroundColor: '#243B6B',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 12,
    color: '#243B6B',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#243B6B',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#a0c4ff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#f8f9fa',
    color: 'black',
  },
  dateList: {
    paddingVertical: 10,
  },
  dateButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 5,
    width: 100,
    alignItems: 'center',
  },
  selectedDateButton: {
    backgroundColor: '#274A8A',
  },
  dateText: {
    fontSize: 14,
    color: '#333',
  },
  selectedDateText: {
    color: '#fff',
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  timeSlotButton: {
    backgroundColor: '#274A8A',
    padding: 8,
    margin: 5,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    textAlign:'center',
    justifyContent:'center',
    minWidth: 90,
  },
  selectedTimeSlotButton: {
    backgroundColor: '#379956',
  },
  timeSlotIcon: {
    marginRight: 5,



  },
  timeSlotText: {
    color: '#fff',
    fontSize: 14,
    textAlign:'center'
  },
  noSlotsText: {
    color: '#757575',
    fontSize: 14,
    marginVertical: 20,
    textAlign: 'center',
    width: '100%',
  },
    slotBox: {
      textAlign:'center',
    marginBottom: 10,
  },
  consultButton: {
    backgroundColor: '#243B6B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
  consultButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VideoConsultion;
