/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {getLabById} from '../../utils/Api';
import {useNavigation} from '@react-navigation/native';
import { BaseUrl } from "../../utils/BaseApi";
import { useColorScheme } from 'react-native';
import moment from 'moment';
import { getHospitalById } from '../../utils/Api';
const ConfirmLabsTestScreen = ({route}) => {
  const navigation = useNavigation();
  const {tests, labId} = route.params;
  const [labs, setLabs] = useState([]);
   const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [preference, setPreference] = useState('Lab Visit');
  const [includeConsultation, setIncludeConsultation] = useState(false);
  const [hasConsultationTest, setHasConsultationTest] = useState(false);
  // Calculate the full total price including all tests
const fullTotalPrice = tests.reduce((sum, test) => {
  return sum + parseFloat(test.offer_price || 0);
}, 0);

// Calculate discount (€10 if consultation is included and available)
const discount = includeConsultation && hasConsultationTest ? 10 : 0;

// Final price is full total minus discount
const finalPrice = Math.max(0, fullTotalPrice - discount);

  const scheme = useColorScheme();
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
    const handleDateSelect = date => {
    setSelectedDate(date);
    
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
  useEffect(() => {
  if (route.params?.labId) {
    loadLabProfile(route.params.labId);
  }

  // Change from string '1' to number 1 comparison
  const hasConsult = tests.some(test => test.is_consultation === 1);
  setHasConsultationTest(hasConsult);
}, [route.params?.labId, tests]);


  const loadLabProfile = async labId => {
    try {
      const response = await getHospitalById(labId);
      setLabs(response.data);
      //console.log('lab profile', response.data);
    } catch (error) {
      console.error('Error loading lab profile:', error);
      Alert.alert('Error', 'Failed to load lab profile');
    }
  };

  const createStripeCheckoutSession = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(
        `${BaseUrl}/create-checkout-session-lab`,
        { amount: finalPrice },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.url;
    } catch (error) {
      console.error('Error creating Stripe checkout session:', error);
      Alert.alert('Error', 'Failed to create Stripe checkout session');
    }
  };

  const handleSaveAppointment = async () => {
  try {
    console.log('Starting appointment booking process...');
    
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      throw new Error('User token not found');
    }

    console.log('Sending request to save lab test appointment...');
    const requestData = {
      lab_id: labId,
      date: moment(selectedDate).format('YYYY-MM-DD'),
      preference,
      tests: JSON.stringify(tests),
      amount: finalPrice, // Changed from totalPrice to finalPrice to include discounts
    };

    console.log('Request payload:', requestData);

    const response = await axios.post(
      `${BaseUrl}/save-lab-test-appointments`,
      requestData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('API Response:', response.data);

    if (!response.data) {
      throw new Error('Empty response from server');
    }

    console.log('Creating Stripe checkout session...');
    const checkoutUrl = await createStripeCheckoutSession();
    
    if (!checkoutUrl) {
      throw new Error('Failed to get checkout URL');
    }

    console.log('Navigating to Stripe checkout...');
    navigation.navigate('StripeCheckoutScreen', { checkoutUrl });

  } catch (error) {
    console.error('Booking Error:', error);
    
    let errorMessage = 'Failed to book appointment';
    
    if (error.response) {
      // Server responded with error status
      console.error('Server Error Data:', error.response.data);
      console.error('Server Error Status:', error.response.status);
      console.error('Server Error Headers:', error.response.headers);
      
      errorMessage = error.response.data?.message || 
                    error.response.data?.error || 
                    error.response.statusText || 
                    errorMessage;
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
      errorMessage = 'No response from server. Please check your connection.';
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
      errorMessage = error.message || errorMessage;
    }

    Alert.alert('Error', errorMessage);
  }
};

  const handleCancelBooking = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel the booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => navigation.navigate('Home'),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Book Lab', {labId, tests})}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.header}>Confirm Order</Text>
      </View>

      <View style={[styles.labContainer]}>
        <Icon name="flask-outline" size={40} color="#276EF1" />
        <Text style={styles.labTitle}>{labs[0]?.hospital_name}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.totalPrice}>Total: € {finalPrice.toFixed(2)}</Text>
        {includeConsultation && hasConsultationTest && (
          <Text style={{ color: 'green', fontWeight: 'bold' }}>
            (€10 discount applied for consultation)
          </Text>
        )}
      </View>

      <FlatList
        data={tests}
        renderItem={({item}) => (
          <TouchableOpacity style={styles.testsContainer}>
            <Text style={styles.labName}>{item.name}</Text>
            <Text style={styles.labPrice}>€ {item.offer_price}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id.toString()}
      />
       <Text style={styles.sectionTitle}>Select Date:</Text>
                  <FlatList
                    data={dates}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderDateItem}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.dateList}
                  />
     {hasConsultationTest && (
  <View style={styles.consultationToggle}>
    <TouchableOpacity
      onPress={() => setIncludeConsultation(prev => !prev)}
      style={styles.checkbox}>
      {includeConsultation && <View style={styles.checkedBox} />}
    </TouchableOpacity>
    <Text style={styles.checkboxLabel}>Include Consultation</Text>
  </View>
)}


      {/* <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      /> */}
{/* 
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#888"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={text => setPhone(text.replace(/[^0-9]/g, '').slice(0, 12))}
      /> */}

      <View style={styles.preferenceContainer}>
        <TouchableOpacity
          style={[styles.preferenceButton, preference === 'Lab Visit' && styles.selectedPreference]}
          onPress={() => setPreference('Lab Visit')}>
          <Text style={styles.preferenceText}>Lab Visit</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={[styles.preferenceButton, preference === 'Home Sample' && styles.selectedPreference]}
          onPress={() => setPreference('Home Sample')}>
          <Text style={styles.preferenceText}>Home Sample</Text>
        </TouchableOpacity> */}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSaveAppointment}>
          <Text style={styles.buttonText}>Confirm Booking</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonCancel} onPress={handleCancelBooking}>
          <Text style={styles.buttonTextCancel}>Cancel Booking</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
   dateList: {
    marginVertical: 10,
  },
dateButton: {
  width: 80, // Fixed width (can be up to 100 as you requested)
  height: 30, // Fixed height
  padding: 0, // Remove padding since we're controlling dimensions
  borderRadius: 8,
  backgroundColor: '#f0f0f0',
  marginHorizontal: 5,
  marginVertical: 5, // Add vertical margin if using multiple rows
  alignItems: 'center',
  justifyContent: 'center', // Center content vertically
},
    selectedDateButton: {
      backgroundColor: '#274A8A',
    },
    dateText: {
      fontSize: 14,
      color: '#333',
    },
    selectedDateText: {
      color: 'white',
    },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  labContainer: {
    backgroundColor: '#FFF',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row',
    
    alignItems: 'center',
  },
  testsContainer: {
    backgroundColor: '#FFF',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
  },
  labTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  
 row: {
  backgroundColor: '#C4DAD2',
  padding: 15,
  marginBottom: 10,
  borderRadius: 8,
  flexDirection: 'column', // stack texts vertically
  justifyContent: 'center',
  alignItems: 'flex-start', // left-align text
},

discountNote: {
  color: 'green',
  fontWeight: 'bold',
  marginTop: 4,
  fontSize: 14,
},

  labName: {
    fontSize: 16,
    fontWeight: '500',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: '500',
  },
  labPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#27AE60',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#FFF',
    color: '#000',
  },
  preferenceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  preferenceButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#E5E5E5',
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedPreference: {
    backgroundColor: '#27AE60',
  },
  preferenceText: {
    color: '#142d4c',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2F80ED',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  buttonCancel: {
    backgroundColor: '#E91E63',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonTextCancel: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  consultationToggle: {
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: 10,
},
checkbox: {
  width: 24,
  height: 24,
  borderRadius: 4,
  borderWidth: 2,
  borderColor: '#2F80ED',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 10,
},
checkedBox: {
  width: 14,
  height: 14,
  backgroundColor: '#2F80ED',
  borderRadius: 2,
},
checkboxLabel: {
  fontSize: 16,
  color: '#000',
},

});

export default ConfirmLabsTestScreen;
