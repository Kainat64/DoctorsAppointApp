import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, Animated, Easing, StyleSheet, Dimensions, Alert, ImageBackground, Linking, Platform, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { GooglePlacesAutocomplete } from 'react-native-gp-autocomplete';
import LinearGradient from 'react-native-linear-gradient';
import { BaseUrl } from '../../utils/BaseApi';
const { width } = Dimensions.get('window');
import axios from 'axios';
import { getPrivacyPolicy } from '../../utils/PrivacySetting';
 //import { fetchPrivacyPolicy } from '../../utils/PrivacySetting';
const RegisterPage = () => {
  
  const API_KEY = 'AIzaSyAXxcc6u8a1UYcRJj2ZW8gdk0RgJY3rSP4';
  //const API_KEY = getSetting('android_sdk_api_key');
  const navigation = useNavigation();
  const [isChecked, setIsChecked] = useState(false);
    const [privacyLink, setPrivacyLink] = useState('');

  const loadPrivacyPolicy = async () => {
    try {
      const response = await fetch(`${BaseUrl}/get-privacy-url`);
      const data = await response.json();

      console.log('Fetch privacy url:', data);
      if (data.privacy_policy_link) {
        setPrivacyLink(data.privacy_policy_link);
      }
    } catch (error) {
      console.log('Fetch error:', error.message);
    }
  };

  useEffect(() => {
    loadPrivacyPolicy();
  }, []);
 const openPrivacyPolicy = () => {
    if (privacyLink) {
      Linking.openURL(privacyLink);
    } else {
      console.log('No privacy link available');
    }
  };
  // Form states
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    mobile: '',
    password: '',
    location: '',
    coordinates: { lat: null, lng: null }
  });
  
  const [validation, setValidation] = useState({
    firstname: false,
    lastname: false,
    email: false,
    mobile: false,
    password: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Initialize animations
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.ease,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true
      })
    ]).start();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validate in real-time
    switch(field) {
      case 'firstname':
        setValidation(prev => ({ ...prev, firstname: value.length > 1 }));
        break;
      case 'lastname':
        setValidation(prev => ({ ...prev, lastname: value.length > 1 }));
        break;
      case 'email':
        setValidation(prev => ({ ...prev, email: /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(value) }));
        break;
        case 'mobile':
        const isValid = /^[0-9]{0,15}$/.test(value);
        setValidation(prev => ({
          ...prev,
          mobile: {
            isValid: isValid && value.length <= 15,
            isTouched: true,
            message: isValid 
              ? (value.length === 15 ? 'Maximum 15 digits reached' : '') 
              : 'Only numbers allowed'
          }
        }));
        break;
      case 'password':
        setValidation(prev => ({ ...prev, password: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(value) }));
        break;
    }
  };

  const onPlaceSelected = (place) => {
    let lat, lng, address;
    
    if (place.coordinate) {
      lat = place.coordinate.latitude;
      lng = place.coordinate.longitude;
      address = place.formattedAddress;
    } else if (place.geometry && place.geometry.location) {
      lat = place.geometry.location.lat;
      lng = place.geometry.location.lng;
      address = place.formatted_address;
    }
    
    if (lat && lng) {
      setFormData(prev => ({
        ...prev,
        location: address,
        coordinates: { lat, lng }
      }));
    }
  };
  const sendOtp = async () => {
    if (!formData.email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    try {
      const response = await axios.post(`${BaseUrl}/otp`, { email: formData.email });
      setOtp(response.data.otp);
      Alert.alert('OTP Sent', 'Please check your email for the OTP');
    } catch (error) {
      Alert.alert('Error', error.message || 'OTP failed');
    }
  };
  const handleRegister = async () => {
    if (!isChecked) {
      Alert.alert('Accept Privacy Policy', 'Please accept our Privacy Policy to continue');
      return;
    }

    if (!Object.values(validation).every(v => v) || !formData.location) {
      Alert.alert('Error', 'Please fill all fields correctly');
      return;
    }

    setIsLoading(true);
    
    try {
      // Your API call here
      const email = formData.email;

      const response = await axios.post(`${BaseUrl}/register`, {
        first_name: formData.firstname,
        last_name: formData.lastname,
        name: `${formData.firstname} ${formData.lastname}`,
        email,
        phone: formData.mobile,
        password: formData.password,
        google_address: formData.location,
        lat: formData.coordinates.lat,
        lng: formData.coordinates.lng

        
      });
      const userId = response.data.user.id;

      console.log('user id is', userId);

      
      Alert.alert('Success', 'Registration successful!', [
        { text: 'OK', onPress: () => navigation.navigate('User Otp Verification' , { email, userId }) }
      ]);
    } catch (error) {
      if (error.response && error.response.status === 422) {
      const errors = error.response.data;

      // Extract first error message
      const firstError = Object.values(errors)[0][0]; 

      Alert.alert('Validation Error', firstError);

      // OPTIONAL: To show all errors at once
      // const allErrors = Object.values(errors).flat().join('\n');
      // Alert.alert('Validation Errors', allErrors);

    } else {
      Alert.alert('Error', error.message || 'Registration failed');
    }
    } finally {
      setIsLoading(false);
    }
  };
  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true
    }).start();
  };

  const renderInputField = (icon, placeholder, field, keyboardType = 'default', secure = false) => {
    const iconMap = {
      user: <FontAwesome name="user-o" color="#6a1b9a" size={20} />,
      email: <Fontisto name="email" color="#6a1b9a" size={20} />,
      mobile: <FontAwesome name="mobile" color="#6a1b9a" size={24} />,
      lock: <FontAwesome name="lock" color="#6a1b9a" size={20} />
    };

    return (
      <Animated.View 
        style={[
          styles.inputContainer, 
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }] 
          }
        ]}
      >
        <View style={styles.inputIcon}>{iconMap[icon]}</View>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#888"
          value={formData[field]}
          onChangeText={(text) => handleInputChange(field, text)}
          keyboardType={keyboardType}
          secureTextEntry={secure && !showPassword}
        />
        {formData[field] ? (
          validation[field] ? (
            <Feather name="check-circle" color="#4CAF50" size={20} />
          ) : (
            <MaterialIcons name="error" color="#F44336" size={20} />
          )
        ) : null}
        {secure && formData[field] ? (
          <TouchableOpacity 
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Feather 
              name={showPassword ? "eye" : "eye-off"} 
              color="#6a1b9a" 
              size={20} 
            />
          </TouchableOpacity>
        ) : null}
      </Animated.View>
    );
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <ImageBackground
        source={require('../../assets/images/app_background.png')}
        style={styles.background}
      >
        <View style={styles.container}>
          <Animated.View 
            style={[
              styles.logoContainer,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }] 
              }
            ]}
          >
            <Image
              style={styles.logo}
              source={require('../../assets/images/doc360logo.png')}
              resizeMode="contain"
            />
          </Animated.View>
          <Animated.View 
            style={[
              styles.formContainer,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }] 
              }
            ]}
          >
            <Text style={styles.header}>Create Account</Text>
            
            {renderInputField('user', 'First Name', 'firstname')}
            {!validation.firstname && formData.firstname ? (
              <Text style={styles.errorText}>First name should be more than 1 character</Text>
            ) : null}

            {renderInputField('user', 'Last Name', 'lastname')}
            {!validation.lastname && formData.lastname ? (
              <Text style={styles.errorText}>Last name should be more than 1 character</Text>
            ) : null}

            {renderInputField('email', 'Email', 'email', 'email-address')}
            {!validation.email && formData.email ? (
              <Text style={styles.errorText}>Please enter a valid email address</Text>
            ) : null}

            {renderInputField('mobile', 'Mobile (11 digits)', 'mobile', 'phone-pad')}
            {!validation.mobile && formData.mobile ? (
              <Text style={styles.errorText}>Please enter a valid 11-digit number</Text>
            ) : null}

            <Animated.View 
              style={[
                styles.locationContainer,
                { 
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }] 
                }
              ]}
            >
              <GooglePlacesAutocomplete
                placeholder="Location"
                placeholderTextColor="#888"
                fetchDetails={true}
                apiKey={API_KEY}
                onPlaceSelected={onPlaceSelected}
                autocompletionRequest={{
                  componentRestrictions: { country: ['ie'] },
                }}
                styles={{
                  textInput: styles.locationInput,
                  listView: styles.locationList,
                  description: styles.locationDescription,
                  row: styles.locationRow,
                }}
              />
            </Animated.View>

            {renderInputField('lock', 'Password', 'password', 'default', true)}
            {!validation.password && formData.password ? (
              <Text style={styles.errorText}>
                Must contain uppercase, lowercase, number, and 6+ characters
              </Text>
            ) : null}
          </Animated.View>

            {/* Privacy Policy Checkbox */}
            <Animated.View 
              style={[
                styles.checkboxContainer,
                { 
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }] 
                }
              ]}
            >
              <TouchableOpacity 
                style={styles.checkbox}
                onPress={() => setIsChecked(!isChecked)}
                activeOpacity={0.7}
              >
                {isChecked ? (
                  <Feather name="check-square" size={24} color="#6a1b9a" />
                ) : (
                  <Feather name="square" size={24} color="#888" />
                )}
              </TouchableOpacity>
              <Text style={styles.checkboxText}>
                I accept the{' '}
                <Text 
                  style={styles.linkText}
                  onPress={openPrivacyPolicy} 
                >
                  Privacy Policy
                </Text>
              </Text>
            </Animated.View>
          
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              onPress={handleRegister}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              disabled={isLoading}
              style={styles.registerButton}
            >
              <LinearGradient
                colors={['#274A8A', '#4527a0']}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Register</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity 
            onPress={() => navigation.navigate('Login')}
            style={styles.loginLink}
          >
            <Text style={styles.loginText}>
              Already have an account? <Text style={styles.loginLinkText}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    padding: 25,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 220,
    height: 110,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#274A8A',
    marginBottom: 25,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
    marginBottom: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#333',
    fontSize: 16,
    paddingVertical: 8,
  },
  eyeIcon: {
    marginLeft: 10,
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 15,
    marginLeft: 30,
  },
  locationContainer: {
    marginBottom: 15,
  },
  locationInput: {
    height: 40,
    color: '#333',
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
  },
  locationList: {
    backgroundColor: '#fff',
    marginTop: 10,
    borderRadius: 5,
    elevation: 5,
  },
  locationDescription: {
    color: '#333',
  },
  locationRow: {
    padding: 10,
  },
  registerButton: {
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#6a1b9a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    alignSelf: 'center',
  },
  loginText: {
    color: '#666',
  },
  loginLinkText: {
    color: '#6a1b9a',
    fontWeight: 'bold',
  },
   checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxText: {
    color: '#666',
    fontSize: 14,
  },
  linkText: {
    color: '#4527a0',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});

export default RegisterPage;