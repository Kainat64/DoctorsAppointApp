/* eslint-disable prettier/prettier */
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Image,
  Modal,
  Alert,
  StyleSheet,
  Dimensions,
  PixelRatio,
  Platform
} from 'react-native';
import axios from 'axios';
import { BaseUrl } from '../utils/BaseApi';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
const {width, height} = Dimensions.get('window');
const scale = width / 375; // iPhone 11 width, used as baseline

import LinearGradient from 'react-native-linear-gradient';
const normalize = size => {
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
};
const gap = 10;
const totalGaps = 2 * gap;
const itemWidth = (width - totalGaps - 20) / 3; // 20 is padding/margin
// Responsive font
const rf = size => PixelRatio.roundToNearestPixel((size * width) / 375);

export default function SubscribeNewsletter () {
  const [email, setEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current; // ✅ useRef instead of useState for Animated.Value

  const handleSubscribe = async () => {
  try {
    // Validate email format
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      Alert.alert('Authentication Error', 'Please login to subscribe');
      return;
    }

    const response = await axios.post(
      `${BaseUrl}/save-subscriber`,
      { email: email.trim() },
      {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000, // 10 second timeout
      }
    );

    // Check for successful response
    if (response.status >= 200 && response.status < 300) {
      console.log('Subscription successful:', response.data);
      setSubscribedEmail(email.trim());
      setEmail('');
      setModalVisible(false);
      showSuccessMessage();
    } else {
      throw new Error(`Server returned status ${response.status}`);
    }
  } catch (error) {
    console.error('Subscription error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    let errorMessage = 'Subscriptions failed. Please try again.';
    
    if (error.response) {
      // Handle specific HTTP error codes
      if (error.response.status === 401) {
        errorMessage = 'Session expired. Please login again.';
      } else if (error.response.status === 409) {
        errorMessage = 'This email is already subscribed.';
      } else if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      }
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Request timed out. Please check your connection.';
    } else if (error.message.includes('Network Error')) {
      errorMessage = 'Network error. Please check your internet connection.';
    }

    Alert.alert('Error', errorMessage);
  }
};

  const showSuccessMessage = () => {
    setIsSubscribed(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => hideSuccessMessage(), 5000);
    });
  };

  const hideSuccessMessage = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => setIsSubscribed(false));
  };

  return (
     <LinearGradient
       colors={['#c31432','#240b36', ]}
       start={{ x: 0, y: 0 }}
       end={{ x: 1, y: 0 }}
       style={styles.featuredContainer}
     >
      <View style={styles.featureContainer}>
        <View style={styles.leftColumn}>
          <Text style={styles.headerText}>Stay Updated!</Text>
          <Text style={styles.subText}>Subscribe to newsletter for updates.</Text>
          <Text style={styles.subText}>Don’t miss out — sign up now.</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>Subscribe</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rightColumn}>
          <Image
            source={require('../assets/doctors.png')}
            style={styles.featureImage}
            resizeMode="contain"
          />
        </View>
      </View>

      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        transparent={true}
        animationType="slide"
        hardwareAccelerated={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Subscribe to Newsletter</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="Enter your email"
              placeholderTextColor={'gray'}
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              onSubmitEditing={handleSubscribe}
            />
            <TouchableOpacity 
              style={styles.buttons} 
              onPress={handleSubscribe}
              disabled={!email}
            >
              <Text style={styles.buttonsText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {isSubscribed && (
        <Animated.View style={[styles.successContainer, { opacity: fadeAnim }]}>
          <Text style={styles.successText}>
            🎉 Success! Thank you for subscribing, {subscribedEmail}!
          </Text>
          <TouchableOpacity onPress={hideSuccessMessage} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
      
  </LinearGradient>
    
  );
};





const styles = StyleSheet.create({
  // Base styles
  
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 5,
    marginRight: 0,
  },


 

   headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color:'white'
  },
 



  subText: {
    fontSize: 12,
    color: 'white',
    marginBottom: 4,
    fontWeight:'bold'
  },
    button: {
      marginTop:10,
      marginBottom:10,
    backgroundColor: 'white',
    paddingVertical: 5,
    paddingHorizontal: 5,
    width:100,
    borderRadius: 6,
    shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 }, // Push shadow to bottom
  shadowOpacity: 0.15, // Lower opacity for a softer look
  shadowRadius: 4, // Tighter radius to keep shadow under control
  elevation: 4, // Required for Android
 
  },
    buttons: {
      marginTop:10,
    backgroundColor: '#274A8A',
    paddingVertical: 5,
    paddingHorizontal: 5,
    width:100,
    borderRadius: 6,
    shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 }, // Push shadow to bottom
  shadowOpacity: 0.15, // Lower opacity for a softer look
  shadowRadius: 4, // Tighter radius to keep shadow under control
  elevation: 4, // Required for Android
 
  },
  buttonText: {
    color: '#c31432',
    fontSize: 12,
    textAlign: 'center',
    fontWeight:'bold'
    
  },

 buttonsText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    
  },


 featureContainer: {
   flexDirection: 'row',
  flex: 1, // Ensures it takes available vertical space
 paddingTop:10
  },
   featuredContainer: {
    flexDirection: 'row',
     overflow: 'hidden',
  margin: 10,
    marginVertical:20,
    marginHorizontal:10,
    borderRadius:10,
    shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 }, // Push shadow to bottom
  shadowOpacity: 0.15, // Lower opacity for a softer look
  shadowRadius: 4, // Tighter radius to keep shadow under control
  elevation: 4, // Required for Android
// Required for iOS shadow
  marginBottom: 10,
    backgroundColor:'#ddeedf',
    alignItems: 'center',
  },
  leftColumn: {
    flex: 2,
    paddingLeft:10,
   
   
  },
rightColumn: {
  flex: 1,
  justifyContent: 'flex-end', // Align the image at the bottom
  alignItems: 'center', // Ensure the image is horizontally centered

},

  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,

  }, 
  serialNumberContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  serialNumberText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  featureText: {
    flex: 1,
    fontSize: 14,
  },
 featureImage: {
  width: width * 0.4, // 40% of screen width
  height: width * 0.3, // adjust as needed
  resizeMode: 'contain'},

  // Notification modal
 modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationModal: {
    width: '85%',
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 1,
  },
  closeText: {
    fontSize: 24,
    color: '#aaa',
  },


  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#274A8A',
    justifyContent: 'center',
    alignItems: 'center',
  },
   modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
modalHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 15,
},
  successContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: '#d4edda',
    padding: 15,
    borderRadius: 8,
    borderColor: '#c3e6cb',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  successText: {
    color: '#155724',
    fontSize: 14,
    flex: 1,
  },
  closeButton: {
    marginLeft: 10,
    paddingHorizontal: 8,
  },
  closeButtonText: {
    color: '#155724',
    fontSize: 24,
    lineHeight: 24,
  },

closeIcon: {
  fontSize: 18,
  color: '#333',
  
},
});