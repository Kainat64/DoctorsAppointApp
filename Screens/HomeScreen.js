import React, {useState, useEffect, useCallback,useRef} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {AppState} from 'react-native';
const POLLING_INTERVAL = 15000; // 15 seconds
import isEqual from 'lodash/isEqual';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { ScrollView, StyleSheet, Text, TextInput, View, TouchableOpacity, Pressable, Image, Alert, Animated, Modal, Dimensions, PixelRatio, StatusBar, Platform, ImageBackground, ActivityIndicator, useWindowDimensions } from 'react-native';

import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import GetLocation from 'react-native-get-location';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';

// Screens
import MyAppointment from './Appointments/MyAppointment';
import ProfileScreen from './Profile/ProfileScreen';
import MedicalRecordScreen from './Prescriptions/MedicalRecordScreen';
import ReviewScreen from './Doctors/ReviewsScreen';
import ZoomMeetScreen from './VoiceConsultation/ZoomMeetScreen';
import JoinMeetingScreen from './VoiceConsultation/JoinMeetScreen';
// Utils & Context
import {BaseUrl} from '../utils/BaseApi';
import {useAuth} from '../AuthContext';
import io from 'socket.io-client';
// Constants
import {Color, FontFamily} from '../GlobalStyles';
import ReviewSuccessScreen from './Doctors/ReviewsSuccessScreen';
import FeatureSection from './homeCards';
import SmallGridItem from './SmallCards';
const Tab = createBottomTabNavigator();
const {width, height} = Dimensions.get('window');
const scale = width / 375; // iPhone 11 width, used as baseline

const normalize = size => {
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
};

//small item grid
const gap = 10;
const totalGaps = 2 * gap;
const itemWidth = (width - totalGaps - 20) / 3; // 20 is padding/margin
// Responsive font
const rf = size => PixelRatio.roundToNearestPixel((size * width) / 375);
import { RefreshControl } from 'react-native';

const socket = io('http://localhost:3000/');
import SocialIcons from './SocialLink/SocialLinkScreen';
export default function HomeScreen({props}) {
  
  // State management
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [userData, setUserData] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [cityName, setCityName] = useState('');

  const [modalsVisible, setModalsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState('');
  const {width: windowWidth, height: windowHeight} = useWindowDimensions();
  const isLandscape = windowWidth > windowHeight;
 const pollingRef = useRef(null);
   const isMountedRef = useRef(true);
  const lastFetchTime = useRef(0);

 
  // Responsive layout calculations
  const cardWidth = isLandscape ? windowWidth * 0.4 : windowWidth * 0.45;
  const smallCardWidth = (windowWidth - 40) / 3;
  const gridGap = 8;
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [refreshing, setRefreshing] = React.useState(false);

 //refresh control
  const onRefresh = React.useCallback(() => {
  setRefreshing(true);
  
  // Simulate network request
  setTimeout(() => {
    setRefreshing(false);
    // Add your actual data refresh logic here
  }, 2000);
}, []);
 const [sdkKey, setSdkKey] = useState(null);

  const handleSettingsLoaded = (key) => {
    console.log('Loaded platform-specific Google Maps Key:', key);
    setSdkKey(key);
  };
  // Hooks
  const navigation = useNavigation();
  const {user, logout} = useAuth();

  // Handlers
  const handleFocus = () => navigation.navigate('Search Clinic');
  const handleBellClick = () => setShowNotifications(!showNotifications);

  const ShowDoctorsProfile = doctorId => {
    navigation.navigate('Hospital Profile', {doctorId});
  };
  

  // Other fetch functions with similar optimizations
  const fetchNotifications = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${BaseUrl}/get-user-notifications`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { t: Date.now() } // Cache busting
      });
      
      if (isMountedRef.current) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unread_count);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, []);

  const MarkAllReadNotification = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(
        `${BaseUrl}/mark-read-user-notifications`,
        {},
        {headers: {Authorization: `Bearer ${token}`}},
      );

      if (response.data.success) {
        setNotifications(prevNotifications =>
          prevNotifications.map(notification => ({
            ...notification,
            status: 'read',
          })),
        );
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const handleCloseModal = () => {
    setShowNotifications(false);
    MarkAllReadNotification();
    fetchNotifications();
  };
  // Fetch user data with real-time updates
  const fetchUser = useCallback(async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      console.warn('User token not found');
      return;
    }

    const now = Date.now();
    if (now - lastFetchTime.current < 10000 && userData?.image_url) {
      return;
    }

    const response = await axios.get(`${BaseUrl}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      },
    });

    const updatedUser = response.data;

    // Normalize to full URL
    const fullUrl = `${updatedUser.image_url}`;
    console.log('fullurl', fullUrl);

    if (
      userData?.image_url &&
      fullUrl.split('?')[0] !== userData.image_url.split('?')[0]
    ) {
      updatedUser.image_url = `${fullUrl}?t=${now}`;
    } else {
      updatedUser.image_url = fullUrl;
    }
     console.log("user profile image url", updatedUser.image_url);
    if (isMountedRef.current) {
      setUserData(updatedUser);
      await AsyncStorage.setItem('authUser', JSON.stringify(updatedUser));
      lastFetchTime.current = now;
    }
  } catch (error) {
    console.error('Failed to fetch user:', error);
    if (isMountedRef.current) {
      Alert.alert('Update Error', 'Could not fetch user profile. Please try again.', [
        { text: 'OK' },
      ]);
    }
  }
}, [userData]);


  // Location functions
  
  const getCurrentLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(location => {
        const {latitude, longitude} = location;
        getCityNameFromCoords(latitude, longitude);
      })
      .catch(error => {
        console.warn(error.code, error.message);
      });
  };
  
  

  const getCityNameFromCoords = useCallback(async (latitude, longitude) => {
    const googleMapsApiKey = sdkKey;
    console.log("sdkkey", sdkKey);

    if (!googleMapsApiKey) {
      console.warn('Google Maps API key not found');
      return;
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapsApiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.results?.length > 0) {
        const cityComponent = data.results[0].address_components.find(component =>
          component.types.includes('locality'),
        );
        
        if (cityComponent) {
          setCityName(cityComponent.long_name);
        } else {
          setCityName('City not found');
        }
      }
    } catch (error) {
      console.error('Error in reverse geocoding: ', error);
    }
  }, [sdkKey]);
useEffect(() => {
  if (sdkKey) {
    getCurrentLocation(); // now it will have sdkKey available
  }
}, [sdkKey]);

  // Check profile completeness
  const checkProfile = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'Please log in again.');
        return false;
      }

      const response = await axios.get(`${BaseUrl}/check-profile-complete`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.profile_complete === false) {
        Alert.alert(
          'Profile Incomplete',
          'Please complete your profile to continue.',
        );
        navigation.navigate('My Profile');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Profile check error:', error);
      Alert.alert('Error', 'Failed to verify profile. Please try again.');
      return false;
    }
  }, [navigation])

  const fetchNearbyDoctors = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${BaseUrl}/nearby-hospitals`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { t: Date.now() } // Cache busting
      });
      
      if (isMountedRef.current) {
        setHospitals(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching nearby Hospitals', error);
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);
  //navigation to single clinic 

  const getBlogs = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${BaseUrl}/blog-posts`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { t: Date.now() } // Cache busting
      });
      
      if (isMountedRef.current) {
        setBlogs(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);
  
  

const fetchAllData = useCallback(async (silent = false) => {
  if (!silent) setLoading(true);
  
  try {
    const results = await Promise.all([
      
      //fetchUser(),
      fetchNotifications(),
      fetchNearbyDoctors(),
      getBlogs(),
    ]);
    
    return results;
  } catch (error) {
    if (error.response?.status === 429) {
      // Handle rate limiting
      const retryAfter = error.response.headers['retry-after'] || 30;
      console.warn(`Rate limited - retrying after ${retryAfter} seconds`);
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      return fetchAllData(silent);
    }
    console.error('Error in fetchAllData:', error);
  } finally {
    if (!silent && isMountedRef.current) {
      setLoading(false);
    }
  }
}, [fetchUser, fetchNotifications, fetchNearbyDoctors, getBlogs]);

const startPolling = useCallback(() => {
  // Initial fetch
  fetchAllData();
  
  // Set up interval with error handling
  pollingRef.current = setInterval(async () => {
    if (AppState.currentState === 'active') {
      try {
        await fetchAllData(true); // silent refresh
      } catch (error) {
        console.error('Polling error:', error);
      }
    }
  }, POLLING_INTERVAL);
}, [fetchAllData]);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }
  }, []);

  // Handle app state changes
  useEffect(() => {
   // fetchAppSettings();
    checkProfile();
     //getCurrentLocation();
    fetchUser();
    fetchNotifications();
    fetchNearbyDoctors();
    getBlogs();
  }, []);

 useFocusEffect(
  useCallback(() => {
    fetchUser(); // force fetch on screen focus
    fetchNotifications();
  }, [fetchUser, fetchNotifications])
);

  // Components
  const NotificationModal = () => (
    <Modal
      visible={showNotifications}
      transparent={true}
      animationType="fade"
      onRequestClose={handleCloseModal}>
      <View style={styles.modalBackground}>
        <View style={styles.notificationModal}>
          <TouchableOpacity
            style={styles.closedButton}
            onPress={handleCloseModal}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>

          <Text style={styles.notifyText}>Notifications</Text>

          <ScrollView contentContainerStyle={styles.notificationList}>
            {notifications.length > 0 ? (
              notifications.map((item, index) => (
                <View key={index} style={styles.notificationItem}>
                  <Text style={styles.notificationText}>{item.message}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noNotifications}>No notifications</Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const TopBar = () => (
    <View style={styles.topBar}>
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <FontAwesome name="bars" color="#420475" style={styles.menuIcon} />
      </TouchableOpacity>

      <Image
        source={require('../assets/doc365-logo.png')}
        style={styles.logoImage}
      />

      <View style={styles.topRight}>
        <TouchableOpacity
          style={styles.bellContainer}
          onPress={handleBellClick}>
          <FontAwesome name="bell" color="#420475" style={styles.bellIcon} />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('My Profile')}>
          <View style={styles.profileImageContainer}>
              {userData?.image_url && (
            <Image 
              source={{ uri: userData?.image_url }} 
              style={styles.profileImage }
            />
           
          )}
         
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const UserInfoRow = () => (
    <View style={styles.userInfoRow}>
      <Text style={styles.userName}>Hi, {user?.name || 'User'}</Text>
      <View style={styles.locationContainer}>
        <FontAwesome
          name="map-marker"
          color="#f95959"
          style={styles.locationIcon}
        />
        <Text style={styles.userLocation}>{cityName}</Text>
      </View>
    </View>
  );

  const SearchBar = () => (
    <View style={styles.searchContainer}>
      <FontAwesome name="search" color="#666" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search appointments, doctors..."
        placeholderTextColor="#666"
        onFocus={handleFocus}
        onChangeText={setSearchText}
        value={searchText}
      />
    </View>
  );

  const UpcomingAppointmentRow = () => (
    <View style={styles.upcomingAppointmentRow}>
      <TouchableOpacity onPress={() => navigation.navigate('MyAppointment')}>
        <View style={styles.upcomingLeft}>
          <FontAwesome
            name="calendar"
            color="#420475"
            style={styles.calendarIcon}
          />
          <Text style={styles.upcomingText}>Upcoming Appointment</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('MyAppointment')}>
        <Text style={styles.seeAllText}>See All</Text>
      </TouchableOpacity>
    </View>
  );

  const HelpSection = () => (
    <View style={styles.helpSection}>
      <View style={styles.containertop}>
        <Text style={styles.sectionTitle}>Can We Assist You?</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Chat')}
          style={styles.chatButton}>
          <View style={styles.chatContent}>
            <Text style={styles.sectionTitle}>Chat with us</Text>
            <Ionicons name="chatbubbles-outline" size={24} color="blue" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.gridContainer}>
        {/* First Row */}
        <View style={styles.gridRow}>
          <View style={styles.shadowWrap}>
            <Pressable
              style={styles.gridItem}
              onPress={() => navigation.navigate('Doctors')}>
              <ImageBackground
                source={require('../assets/images/main_card_1.png')}
                resizeMode="cover"
                style={{
                  width: (width - normalize(30)) / 2,
                  height: height * 0.25,
                  borderRadius: normalize(10),
                  overflow: 'hidden',
                }}>
                <View style={[styles.gridItemInner, styles.videoConsultBg]}>
                  <Text style={styles.gridItemTitle}>Video Consultation</Text>
                  <Text style={styles.gridItemSubtitle}>Qualified Doctors</Text>
                  <Image
                    source={require('../assets/portraitconfidentyoungmedicaldoctorwhitebackgroundholdingtablethishands-1.png')}
                    style={styles.gridItemImage}
                  />
                </View>
              </ImageBackground>
            </Pressable>
          </View>
          <View style={styles.shadowWrap}>
            <Pressable
              style={styles.gridItem}
              onPress={() =>
                navigation.navigate('Clinics', {consultationType: 'voice'})
              }>
              <ImageBackground
                source={require('../assets/images/main_card_2.png')}
                resizeMode="cover"
                style={{
                  width: (width - normalize(30)) / 2,
                  height: height * 0.25,
                  borderRadius: normalize(10),
                  overflow: 'hidden',
                }}>
                <View style={[styles.gridItemInner, styles.appointmentBg]}>
                  <Text style={styles.gridItemTitle}>Voice Consultation</Text>
                  <Text style={styles.gridItemSubtitle}>Qualified Doctors</Text>
                  <Image
                    source={require('../assets/doctor.png')}
                    style={styles.gridItemImageVoice}
                    resizeMode="contain"
                  />
                </View>
              </ImageBackground>
            </Pressable>
          </View>
        </View>

        {/* Second Row */}
        <View style={styles.gridRow}>
          <View style={styles.shadowWrap}>
            <Pressable
              style={styles.gridI}
              onPress={() =>
                navigation.navigate('Clinics', {consultationType: 'walk'})
              }>
              <ImageBackground
                source={require('../assets/images/main_card_4.png')}
                resizeMode="cover"
                style={{
                  width: (width - normalize(30)) / 2,
                  height: normalize(98),
                  borderRadius: normalize(8),
                  overflow: 'hidden',
                }}
                imageStyle={{borderRadius: 8}}>
                <View style={[styles.grid, styles.familyCareBg]}>
                  <Text
                    style={[styles.gridItemTitleClinic, styles.familyCareTitle]}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    In-Clinic Consultation
                  </Text>
                  <Text style={styles.gridItemSubtitle}></Text>
                  <Image
                    source={require('../assets/images/walkin.png')}
                    style={styles.gridItemImageR}
                  />
                </View>
              </ImageBackground>
            </Pressable>
          </View>
          <View style={styles.shadowWrap}>
            <Pressable
              style={styles.gridI}
              onPress={() => navigation.navigate('Clinics List')}>
              <ImageBackground
                source={require('../assets/images/main_card_3.png')}
                resizeMode="cover"
                style={{
                  width: (width - normalize(30)) / 2,
                  height: normalize(98),
                  borderRadius: normalize(8),
                  overflow: 'hidden',
                }}>
                <View style={[styles.grid, styles.familyCareBg]}>
                  <Text style={[styles.gridItemTitle, styles.familyCareTitle]}>
                    Clinics
                  </Text>
                  <Image
                    source={require('../assets/hospitals.png')}
                    style={styles.gridItemImageRight}
                  />
                </View>
              </ImageBackground>
            </Pressable>
          </View>
        </View>

        {/* Third Row */}
        <View style={[styles.gridRow, styles.smallGridRow]}>
          <SmallGridItem
            title="Lab Test"
            backgroundImage={require('../assets/images/lab_test.png')}
            onPress={() => navigation.navigate('Available Test')}
            styles={styles}
          />
          <SmallGridItem
            title="Blogs"
            backgroundImage={require('../assets/images/mask-group4.png')}
            iconImage={require('../assets/images/medicines.png')}
            onPress={() => navigation.navigate('Blogs')}
            styles={styles}
          />
          <SmallGridItem
            title="Prescription"
            backgroundImage={require('../assets/weight-loss/background.png')}
            iconImage={require('../assets/images/onlinee.png')}
            customBgStyle={styles.backgroundImageStyle}
            onPress={() => navigation.navigate('Online Prescription')}
            styles={styles}
          />
        </View>
      </View>
    </View>
  );

  const BlogSection = () => (
    <View style={styles.blogSection}>
      <Text style={styles.sectionTitle}>Health Blog</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {blogs.map(blog => (
          <TouchableOpacity
            key={blog.id}
            onPress={() => navigation.navigate('Blog Detail', {id: blog.id})}>
            <View style={styles.blogCard}>
              <Image
                source={{uri: blog?.image_url || ''}}
                style={styles.blogImage}
              />
              <Text style={styles.blogTitle} numberOfLines={2}>
                {blog.title}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const DoctorsSection = () => (
    <View style={styles.doctorsSection}>
      <Text style={styles.sectionTitle}>Near By Clinics In {cityName}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {hospitals.map(hospital => (
          <TouchableOpacity
            key={hospital.id}
            onPress={() => ShowDoctorsProfile(hospital.id)}>
            <View style={styles.doctorCard}>
              <Image
                source={{
                  uri: hospital.image_url || 'https://via.placeholder.com/100',
                }}
                style={styles.doctorImage}
              />
           
              <View style={{alignItems: 'center', width: '100%'}}>
                <Text style={styles.doctorName} numberOfLines={1}>
                  {hospital.hospital_name}
                </Text>
                <Text style={styles.distance}>
                  {parseFloat(hospital.distance).toFixed(1)} Km Away
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
  const FeaturesSection = () => (
    <View style={styles.featureContainer}>
      <View style={styles.leftColumn}>
        <Text style={styles.headerText}>Why Doctors365?</Text>
        {[
          'PMC Verified Doctors\n30,000+ Doctors Available',
          '12/7 Customer Support\nWell-Trained Team',
          'Secure Online Payments\nSSL-encrypted',
        ].map((text, index) => (
          <View key={index} style={styles.featureRow}>
            <View style={styles.serialNumberContainer}>
              <Text style={styles.serialNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.featureText}>{text}</Text>
          </View>
        ))}
      </View>
      <View style={styles.rightColumn}>
        <Image
          source={{uri: 'https://via.placeholder.com/150'}}
          style={styles.featureImage}
          resizeMode="contain"
        />
      </View>
    </View>
  );

  const SocialMediaSection = () => {
    const {width} = Dimensions.get('window');

    // Responsive sizing calculations
    const iconSize = width * 0.075;
    const countFontSize = width * 0.035;
    const labelFontSize = width * 0.028;
    const headerFontSize = width * 0.045;

    

    return (
      <View style={styles.socialMediaContainer}>
        <Text style={[styles.socialMediaHeader, {fontSize: headerFontSize}]}>
          Follow Us
        </Text>
        <View style={styles.iconsRow}>
               <SocialIcons onSettingsLoaded={handleSettingsLoaded} />

        </View>
      </View>
    );
  };

  const HomePage = () => {
     

 return (
    
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#274A8A" />
      <ScrollView
       refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        // Customize these as needed:
        colors={['#274A8A']} // Android
        tintColor="#274A8A" // iOS
        progressBackgroundColor="#ffffff"
      />
    }
  >
        <View style={styles.container}>
          <TopBar />
          <UserInfoRow />
          <SearchBar />
          <UpcomingAppointmentRow />
          <HelpSection />
          <FeatureSection
            title="Are You a Doctor?"
            subTexts={[
              'Join our platform to reach more patients.',
              'Click below to get started.',
            ]}
            buttonText="Register"
            buttonTextColor="#1f4037"
            gradientColors={['#1f4037', '#99f2c8']}
            imageSource={require('../assets/doctorss.png')}
            onPress={() => navigation.navigate('Are You Doctor')}
          />
          <FeatureSection
            title="Enjoying the App?"
            subTexts={[
              'Help your friends discover it too.',
              'Tap below to send them an invite!',
            ]}
            buttonText="Invite a Friend"
            buttonTextColor="#43bfc7"
            gradientColors={['#418c9f', '#43bfc7', '#43bfc7']}
            imageSource={require('../assets/doctor.png')}
            onPress={() => navigation.navigate('Tell A Friend')}
          />
          <FeatureSection
            title="Stay Updated!"
            subTexts={[
              'Subscribe to newsletter for updates.',
              'Don’t miss out — sign up now.',
            ]}
            buttonText="Subscribe"
            buttonTextColor="#c31432"
            gradientColors={['#c31432', '#240b36']}
            imageSource={require('../assets/doctors.png')}
            isSubscription
          />

          <View style={styles.bottomSection}>
            <DoctorsSection />
            <BlogSection />
            <SocialMediaSection />
          </View>
        </View>
      </ScrollView>
      <NotificationModal />
    </SafeAreaView>
 );
};

  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          tabBarStyle: {
            backgroundColor: '#274A8A',
          },
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#ddd',
        }}>
        <Tab.Screen
          name="Home"
          component={HomePage}
          options={{
            drawerItemStyle: {display: 'none'},
            headerShown: false,
            tabBarIcon: ({color}) => (
              <FontAwesome name="home" color={color} style={styles.tabIcon} />
            ),
          }}
        />
        <Tab.Screen
          name="Appointment"
          component={MyAppointment}
          options={{
            tabBarIcon: ({color}) => (
              <FontAwesome
                name="calendar"
                color={color}
                style={styles.tabIcon}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({color}) => (
              <FontAwesome name="user" color={color} style={styles.tabIcon} />
            ),
          }}
        />
        <Tab.Screen
          name="Zoom Meet"
          component={ZoomMeetScreen}
          options={{
            tabBarIcon: ({color}) => (
              <FontAwesome
                name="video-camera"
                color={color}
                style={styles.tabIcon}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Reviews"
          component={ReviewScreen}
          options={{
            tabBarButton: () => <View style={{width: 0, height: 0}} />,
          }}
        />
        <Tab.Screen
          name="Join Meet"
          component={JoinMeetingScreen}
          options={{
            tabBarButton: () => <View style={{width: 0, height: 0}} />,
          }}
        />
        <Tab.Screen
          name="MedicalRecord"
          component={MedicalRecordScreen} // Your report component
          options={{
            tabBarButton: () => null, // Hides from tab bar
            headerShown: false, // Optional: Hide header if needed
          }}
        />
        <Tab.Screen
          name="Appointment Success"
          component={ReviewSuccessScreen} // Your report component
          options={{
            tabBarButton: () => null, // Hides from tab bar
            headerShown: false, // Optional: Hide header if needed
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  // Base styles

  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 5,
    marginRight: 0,
  },
  distance: {
    color: '#274A8A',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingBottom: 20,
  },
  bottomSection: {
    marginBottom: 10,
  },

  containertop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chatButton: {
    marginLeft: 10,
  },
  // Top bar styles
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    elevation: 4,
  },
  menuIcon: {
    marginLeft: 10,
    fontSize: 24,
  },
  logoImage: {
    width: 160,
    height: 40,
    resizeMode: 'contain',
    marginLeft: 60,
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#274A8A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bellContainer: {
    position: 'relative',
    marginRight: 15,
  },
  bellIcon: {
    fontSize: 24,
  },
  headerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  notifyText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  chatButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  chatContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  subText: {
    fontSize: 12,
    color: 'white',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 10,
    backgroundColor: 'white',
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginBottom: 15,
    width: width * 0.2,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4}, // Push shadow to bottom
    shadowOpacity: 0.15, // Lower opacity for a softer look
    shadowRadius: 4, // Tighter radius to keep shadow under control
    elevation: 4, // Required for Android
  },
  buttonText: {
    color: '#1f4037',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },

  // User info styles
  userInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f8f8f8',
  },
  userName: {
    fontSize: 17,
    color: '#333',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  userLocation: {
    fontSize: 16,
    color: '#666',
  },

  // Search bar styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: rf(8),
    paddingVertical: Platform.OS === 'ios' ? 6 : 4,
    paddingHorizontal: rf(14),
    marginVertical: rf(12),
    borderWidth: 1,
    borderColor: '#274A8A',
    width: width * 0.92, // 92% of screen width for padding on sides
    alignSelf: 'center',
    elevation: 3,
    shadowColor: 'blue',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },

  // Appointment row styles
  upcomingAppointmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#e7eaf6',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginHorizontal: 10,
    borderRadius: 7,

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,

    // Android shadow
    elevation: 4,
  },

  upcomingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  upcomingText: {
    fontSize: 16,
    color: '#333',
  },
  seeAllText: {
    fontSize: 16,
    color: '#274A8A',
    fontWeight: 'bold',
  },

  // Help section styles
  helpSection: {
    marginTop: 10,
  },
  gridContainer: {
    marginTop: 10,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  smallGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 5, // Reduced gap for small grid items
  },
  smallGridItemWrapper: {
    flex: 1, // fill the wrapper
    width: itemWidth,
    height: normalize(64),
  },
  smallGridImageBackground: {
    width: '100%',
    height: 70,
    borderRadius: 10,
    overflow: 'hidden',
  },

  shadowWrap: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4}, // Push shadow to bottom
    shadowOpacity: 0.15, // Lower opacity for a softer look
    shadowRadius: 4, // Tighter radius to keep shadow under control
    elevation: 4, // Required for Android
    borderRadius: 10,
    backgroundColor: '#fff', // Required for iOS shadow
    marginBottom: 10,
  },
  gridItem: {
    width: width * 0.46, // 45% of screen width
    height: height * 0.25, // 25% of screen height
    fontSize: rf(16),
  },
  gridI: {
    width: width * 0.46, // 45% of screen width
    height: height * 0.13, // 25% of screen height
    fontSize: rf(16),
  },

  gridItemInner: {
    height: '100%',
    width: '100%',
    padding: 10,
  },

  familyCareBg: {
    height: normalize(99),
  },
  hospitalBg: {
    height: normalize(90),
  },
  imageContainer: {
    width: 60, // Adjust based on your image aspect ratio
    height: 60, // Adjust based on your image aspect ratio
    justifyContent: 'center',
    alignItems: 'center',
    left: 50,
    top: -15,
  },
  weightLossImage: {
    width: '100%',
    height: '100%',
  },

  gridItemTitle: {
    fontSize: rf(16),
    fontWeight: '700',
    color: Color.blue1,
    marginBottom: 4,
    padding: normalize(2),
  },
  gridItemTitleClinic: {
    fontSize: rf(16),
    fontWeight: '700',
    color: Color.blue1,
    marginBottom: 4,
    padding: normalize(2),
    width: '80%',
  },
  samllgridItemTitle: {
    fontSize: rf(14),
    fontWeight: '600',
    color: Color.blue1,
    marginBottom: 4,
    padding: normalize(2),
  },

  gridItemSubtitle: {
    fontSize: rf(12),
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
    color: Color.blue1,
  },
  familyCareTitle: {
    padding: normalize(5),
  },
  gridItemImage: {
    position: 'absolute',
    right: normalize(10),
    bottom: 0,
    width: 94,
    height: 138,
  },
  gridItemImageVoice: {
    position: 'absolute',
    right: normalize(0),
    bottom: 0,
    width: normalize(88),
    height: normalize(138),
    zIndex: 1,
  },
  gridItemImageRight: {
    position: 'absolute',
    right: normalize(10),
    bottom: 0,
    width: normalize(86),
    height: normalize(87),
  },
  gridItemImageR: {
    position: 'absolute',
    right: normalize(4),
    bottom: 0,
    width: normalize(80),
    height: normalize(96),
    zIndex: 1,
  },
  hospitalIcon: {
    position: 'absolute',
    right: normalize(0),
    top: normalize(16),
    width: normalize(75),
    height: normalize(71),
  },

  // Small grid items
  smallGridItem: {
    width: '100%',
    height: '100%',

    padding: 3,
  },

  smallGridItemImage: {
    position: 'absolute',
    right: 5,
    bottom: 5,
    width: 121,
    height: 90,
  },

  // Section titles
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    paddingHorizontal: 10,
  },

  // Blog section
  blogSection: {
    marginTop: 0,
    margin: 9,
  },
  blogCard: {
    width: width * 0.3,

    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4}, // Push shadow to bottom
    shadowOpacity: 0.15, // Lower opacity for a softer look
    shadowRadius: 4, // Tighter radius to keep shadow under control
    elevation: 4, // Required for Android
    // Required for iOS shadow
    marginBottom: 10,
    backgroundColor: '#ddeedf',
  },
  blogImage: {
    width: 100,
    height: 50,
    borderRadius: 5,
    marginBottom: 8,
    marginRight: 3,
    justifyContent: 'center',
    marginLeft: 2,
  },
  blogTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Doctors section
  doctorsSection: {
    marginTop: 24,
    paddingHorizontal: 10,
  },
  doctorCard: {
    width: width * 0.45,

    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4}, // Push shadow to bottom
    shadowOpacity: 0.15, // Lower opacity for a softer look
    shadowRadius: 4, // Tighter radius to keep shadow under control
    elevation: 4, // Required for Android
    // Required for iOS shadow
    marginBottom: 10,
    backgroundColor: '#ddeedf',
  },
  doctorImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  doctorName: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
  },

  // Features section
  featureContainer: {
    flexDirection: 'row',
    flex: 1, // Ensures it takes available vertical space
    paddingTop: 10,
  },
  featuredContainer: {
    flexDirection: 'row',
    overflow: 'hidden',
    margin: 10,
    marginVertical: 20,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4}, // Push shadow to bottom
    shadowOpacity: 0.15, // Lower opacity for a softer look
    shadowRadius: 4, // Tighter radius to keep shadow under control
    elevation: 4, // Required for Android
    // Required for iOS shadow
    marginBottom: 10,
    backgroundColor: '#ddeedf',
    alignItems: 'center',
  },
  leftColumn: {
    flex: 2,
    paddingLeft: 10,
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
    resizeMode: 'contain',
  },

  // Social media section
  socialMediaContainer: {
    paddingVertical: 16,
  },
  socialMediaHeader: {
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 16,
    color: '#333',
  },
  iconsRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
  },
  iconWrapper: {
    alignItems: 'center',
    flex: 1,
    maxWidth: '24%',
  },
  icon: {
    marginBottom: 8,
  },
  countText: {
    fontWeight: '600',
    color: '#2d2d2d',
    marginBottom: 2,
  },
  labelText: {
    color: '#666',
    textAlign: 'center',
  },

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
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  closedButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 1,
  },
  closeText: {
    fontSize: 24,
    color: '#aaa',
  },

  notificationList: {
    paddingVertical: 10,
  },
  notificationItem: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  notificationText: {
    color: '#444',
    fontSize: 16,
  },
  noNotifications: {
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
    fontSize: 16,
    marginTop: 20,
  },

  // Tab bar
  tabIcon: {
    fontSize: 24,
    fontWeight: 'bold',
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
    shadowOffset: {width: 0, height: 2},
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
const tellaFriendStyles = StyleSheet.create({
  gradientBackground: {
    flex: 1,

    borderRadius: 10,
    margin: 10,
  },
  container: {
    flexDirection: 'row',
    flex: 1,

    justifyContent: 'space-between',
  },
  imageContainer: {
    justifyContent: 'flex-end',
  },
  image: {
    width: width * 0.3, // 40% of screen width
    height: width * 0.3, // adjust as needed
  },
  textContainer: {
    flex: 0,
    paddingLeft: 10,
    alignItems: 'flex-start', // CHANGED from 'flex-end'
    paddingRight: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  button: {
    marginVertical: 10,

    paddingVertical: 5,
    paddingHorizontal: 5,
    width: width * 0.3,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4}, // Push shadow to bottom
    shadowOpacity: 0.15, // Lower opacity for a softer look
    shadowRadius: 4, // Tighter radius to keep shadow under control
    elevation: 4, // Required for Android
    backgroundColor: '#fff',
  },
  buttonText: {
    color: '#418c9f',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
  },
});
