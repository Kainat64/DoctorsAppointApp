/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import FAstImage from 'react-native-fast-image';
import {useCallback} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Pressable,
  Image,
  Alert,
   Animated,
  Modal,
  Dimensions,
  PixelRatio,
  StatusBar,
  Platform,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
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
import MyDoctorsScreen from './Doctors/MyDoctorsScreen';
import DocumentsListScreen from './Prescriptions/DocumentsListScreen';
import ReviewScreen from './Doctors/ReviewsScreen';
import ZoomMeetScreen from './VoiceConsultation/ZoomMeetScreen';
import JoinMeetingScreen from './VoiceConsultation/JoinMeetScreen';

// Utils & Context
import {BaseUrl} from '../utils/BaseApi';
import {useAuth} from '../AuthContext';
import io from 'socket.io-client';

// Constants
import {Padding, Color, FontSize, FontFamily, Border} from '../GlobalStyles';
import SubscribeNewsletter from './Subscribe';
import LinearGradient from 'react-native-linear-gradient';

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

const socket = io('http://localhost:3000/');

export default function HomeScreen({props}) {
  // State management
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState(null);
  const [location, setLocation] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [cityName, setCityName] = useState('');
  const [refreshing, setRefreshing] = useState(false);
const [modalVisible, setModalVisible] = useState(false);
const [modalsVisible, setModalsVisible] = useState(false);
  const [email, setEmail] = useState('');
const [isSubscribed, setIsSubscribed] = useState(false);
const [subscribedEmail, setSubscribedEmail] = useState('');

const fadeAnim = useState(new Animated.Value(0))[0];

const handleSubscribe = async () => {
  try {
    if (!email || !email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }
    
    await axios.post(`${BaseUrl}/save-subscriber`, { email }, {
      headers: { 'Content-Type': 'application/json' },
    });
 console.log('Subscribed successfully');
    setSubscribedEmail(email);
    setEmail('');
    setModalsVisible(false);
    showSuccessMessage();
  } catch (error) {
    console.error('Subscription error:', error);
    Alert.alert('Error', 'Subscription failed. Please try again.');
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

  // Hooks
  const navigation = useNavigation();
  const {user, logout} = useAuth();

  // Handlers
  const handleFocus = () => navigation.navigate('Search Clinic');
  const handleBellClick = () => setShowNotifications(!showNotifications);

  const ShowDoctorsProfile = doctorId => {
    navigation.navigate('Clinics', {doctorId});
  };
  // Socket setup
  const setupSocket = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        socket.emit('join', userToken);
        socket.on(
          'appointments-channel:App\\Events\\AppointmentConfirmed',
          data => {
            Alert.alert('Notification', data.message);
          },
        );
      }
    } catch (error) {
      console.error('Failed to set up socket:', error);
    }
  };

  // API calls
  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${BaseUrl}/get-user-notifications`, {
        headers: {Authorization: `Bearer ${token}`},
      });
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unread_count);
      console.log('Notifications fetched:', response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

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
  };

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get(`${BaseUrl}/user`);
        setUsers(response.data);
        console.log('Users fetched:', response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const checkProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'Please log in again.');
        return false; // Explicit return
      }

      const response = await axios.get(`${BaseUrl}/check-profile-complete`, {
        headers: {Authorization: `Bearer ${token}`},
      });

      // Explicit check for false (not just undefined)
      if (response.data?.profile_complete === false) {
        Alert.alert(
          'Profile Incomplete',
          'Please complete your profile to continue.',
        );
        console.log('helloooooo Profile ', response.data)
        navigation.navigate('My Profile');
        return false;
      }

      return true; // Profile is complete
    } catch (error) {
      console.error('Profile check error:', error);
      Alert.alert('Error', 'Failed to verify profile. Please try again.');
      return false;
    }
  };

  const fetchNearbyDoctors = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${BaseUrl}/nearby-hospitals`, {
        headers: {Authorization: `Bearer ${token}`},
      });
      setHospitals(response.data);
      console.log('Nearby Hospitals response:', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error fetching nearby Hospitals', error);
    } finally {
      setLoading(false);
    }
  };

  const getBlogs = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${BaseUrl}/blog-posts`, {
        headers: {Authorization: `Bearer ${token}`},
      });
      setBlogs(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch Blog Detail');
    } finally {
      setLoading(false);
    }
  };
  const getSaveSubscriber = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${BaseUrl}/save-subscriber`, {
        headers: {Authorization: `Bearer ${token}`},
      });
      setBlogs(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch Blog Detail');
    } finally {
      setLoading(false);
    }
  };
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

  const getCityNameFromCoords = async (latitude, longitude) => {
    const API_KEY = 'AIzaSyBhVTUgGfUX_wRVPYAJVItDqxbhZgMDHok';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results.length > 0) {
        const cityName = data.results[0].address_components.find(component =>
          component.types.includes('locality'),
        ).long_name;
        setCityName(cityName);
      } else {
        setCityName('City not found');
      }
    } catch (error) {
      console.error('Error in reverse geocoding: ', error);
    }
  };

  // Effects
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadHomeData = async () => {
        // Optional delay to give time for server/storage sync
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (Platform.OS === 'android' || Platform.OS === 'ios') {
          await getCurrentLocation();
        }

        await Promise.all([
          checkProfile(),
          fetchUser(),
          fetchNotifications(),
          setupSocket(),
          fetchNearbyDoctors(),
          getBlogs(),
        ]);

        if (isActive) setLoading(false);
      };

      loadHomeData();

      return () => {
        isActive = false;
        socket.disconnect();
      };
    }, []),
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
        <TouchableOpacity style={styles.closedButton} onPress={handleCloseModal}>
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
            <Image
              source={{uri: `${user.image_url}?updated=${user.updated_at}`}}
              style={styles.profileImage}
            />
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
     <TouchableOpacity onPress={() => navigation.navigate('Chat')} style={styles.chatButton}>
  <View style={styles.chatContent }>
    <Text style={styles.sectionTitle}>Chat with us</Text>
    <Ionicons name="chatbubbles-outline" size={24} color="blue" />
  </View>
</TouchableOpacity>

    </View>

      <View style={styles.gridContainer}>
        {/* First Row */}
        <View style={styles.gridRow}>
          <View style={styles.shadowWrap}><Pressable
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
            onPress={() => navigation.navigate('Clinics', {consultationType: 'voice'})}>
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
    onPress={() => navigation.navigate('Clinics', { consultationType: 'walk' })}
  >
    <ImageBackground
      source={require('../assets/images/main_card_4.png')}
      resizeMode="cover"
      style={{
        width: (width - normalize(30)) / 2,
        height: normalize(98),
        borderRadius: normalize(8),
        overflow: 'hidden',
      }}
      imageStyle={{ borderRadius: 8 }}
    >
      <View style={[styles.grid, styles.familyCareBg]}>
        <Text
          style={[styles.gridItemTitleClinic, styles.familyCareTitle]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
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
          <Pressable style={styles.gridI} onPress={() => navigation.navigate('Clinics List')}>
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
          <View style={styles.shadowWrap}>
          <Pressable
            onPress={() => navigation.navigate('Available Test')}
            style={styles.smallGridItemWrapper}>
            <ImageBackground
              source={require('../assets/images/lab_test.png')}
              resizeMode="cover"
              style={styles.smallGridImageBackground}>
              <View style={[styles.smallGridItem, styles.labTestBg]}>
                <Text style={styles.gridItemTitle}>Lab Test</Text>
              </View>
            </ImageBackground>
          </Pressable>
</View>
 <View style={styles.shadowWrap}>
          <Pressable
            onPress={() => navigation.navigate('Blogs')}
            style={styles.smallGridItemWrapper}>
            <ImageBackground
              source={require('../assets/images/mask-group4.png')}
              resizeMode="cover"
              style={styles.smallGridImageBackground}>
              <View style={[styles.smallGridItem]}>
                <Text style={styles.gridItemTitle}>Blogs</Text>
                <View style={styles.imageContainer}>
                  <Image
                    source={require('../assets/images/medicines.png')}
                    style={styles.weightLossImage}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </ImageBackground>
          </Pressable>
</View>
 <View style={styles.shadowWrap}>
          <Pressable
            onPress={() => navigation.navigate('Weight Loss')}
            style={styles.smallGridItemWrapper}>
            <ImageBackground
              source={require('../assets/weight-loss/background.png')}
              style={styles.smallGridImageBackground}
              imageStyle={styles.backgroundImageStyle}>
              <View style={styles.smallGridItem}>
                <Text style={styles.gridItemTitle}>Weight Loss</Text>

                <View style={styles.imageContainer}>
                  <Image
                    source={require('../assets/weight-loss/weight-loss.png')}
                    style={styles.weightLossImage}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </ImageBackground>
          </Pressable>
          </View>
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
{console.log("Image hospital", hospital.image_url)}
             <View style={{ alignItems: 'center', width: '100%' }}>
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

  const AreYouDoctorSection = () => (
   
    <LinearGradient
       colors={['#1f4037','#99f2c8', ]}
       start={{ x: 0, y: 0 }}
       end={{ x: 1, y: 0 }}
       style={styles.featuredContainer}
     >
      <View style={styles.featureContainer}>
        <View style={styles.leftColumn}>
          <Text style={styles.headerText}>Are You a Doctor?</Text>
          <Text style={styles.subText}>Join our platform to reach more patients.</Text>
          <Text style={styles.subText}>Click below to get started.</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Are You Doctor')}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rightColumn}>
          <Image
            source={require('../assets/doctorss.png')}
            style={styles.featureImage}
            resizeMode="contain"
          />
        </View>
      </View>
   </LinearGradient>
  );
const TellaFriend = () => (
<LinearGradient
  colors={['#418c9f','#43bfc7','#43bfc7', ]}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 0 }}
  style={tellaFriendStyles.gradientBackground}
>

    <View style={tellaFriendStyles.container}>
      <View style={tellaFriendStyles.imageContainer}>
        <Image
          source={require('../assets/doctor.png')}
          style={tellaFriendStyles.image}
          resizeMode="contain"
        />
      </View>

      <View style={tellaFriendStyles.textContainer}>
        <Text style={tellaFriendStyles.title}>Enjoying the App?</Text>
        <Text style={tellaFriendStyles.subtitle}>Help your friends discover it too.</Text>
        <Text style={tellaFriendStyles.subtitle}>Tap below to send them an invite!</Text>
        <TouchableOpacity
          style={tellaFriendStyles.button}
          onPress={() => navigation.navigate("Tell A Friend")}
        >
          <Text style={tellaFriendStyles.buttonText}>Invite a Friend</Text>
        </TouchableOpacity>
      </View>
    </View>
  </LinearGradient>
);

// const SubscribeNewsletter = () => (
//  <View style={styles.featuredContainer}>
//       <View style={styles.featureContainer}>
//         <View style={styles.leftColumn}>
//           <Text style={styles.headerText}>Stay Updated!</Text>
//           <Text style={styles.subText}>Subscribe to newsletter for latest updates.</Text>
//           <Text style={styles.subText}>Don’t miss out — sign up now.</Text>
//           <TouchableOpacity
//             style={styles.button}
//             onPress={() => setModalsVisible(true)}
//           >
//             <Text style={styles.buttonText}>Subscribe</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.rightColumn}>
//           <Image
//             source={require('../assets/doctors.png')}
//             style={styles.featureImage}
//             resizeMode="contain"
//           />
//         </View>
//       </View>

//     <Modal
//   visible={modalsVisible}
//   onRequestClose={() => setModalsVisible(false)}
//   // Add these props to prevent accidental dismissal
//   transparent={true}
//   hardwareAccelerated={true}
// >
//   <View style={styles.modalOverlay}>
//     <View style={styles.modalContainer}>
//       <View style={styles.modalHeader}>
//         <Text style={styles.modalTitle}>Subscribe to Newsletter</Text>
//         <TouchableOpacity onPress={() => setModalsVisible(false)}>
//           <Text style={styles.closeIcon}>✕</Text>
//         </TouchableOpacity>
//       </View>

//      <TextInput
//         placeholder="Enter your email"
//         style={styles.input}
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//         onSubmitEditing={handleSubscribe}
//       />
// <TouchableOpacity 
//   style={styles.button} 
//   onPress={handleSubscribe}
//   disabled={!email}  // Optional: disable button when empty
// >
//   <Text style={styles.buttonText}>Submit</Text>
// </TouchableOpacity>
//     </View>
//   </View>
// </Modal>
// {isSubscribed && (
//   <Animated.View style={[styles.successContainer, { opacity: fadeAnim }]}>
//     <Text style={styles.successText}>
//       🎉 Success! Thank you for subscribing, {subscribedEmail}!
//     </Text>
//     <TouchableOpacity onPress={hideSuccessMessage} style={styles.closeButton}>
//       <Text style={styles.closeButtonText}>×</Text>
//     </TouchableOpacity>
//   </Animated.View>
// )}
//     </View>
    
// );


const SocialMediaSection = () => {
  const { width } = Dimensions.get('window');
  
  // Responsive sizing calculations
  const iconSize = width * 0.075;
  const countFontSize = width * 0.035;
  const labelFontSize = width * 0.028;
  const headerFontSize = width * 0.045;

  const platforms = [
    { name: 'logo-facebook', color: '#007cb9', count: '3.5K', label: 'Followers' },
    { name: 'logo-youtube', color: '#bc2525', count: '10K', label: 'Subscribers' },
    { name: 'logo-instagram', color: '#2e79ba', count: '5.8K', label: 'Followers' },
    { name: 'logo-tiktok', color: '#081f37', count: '1M', label: 'Followers' },
  ];

  return (
    <View style={styles.socialMediaContainer}>
      <Text style={[styles.socialMediaHeader, { fontSize: headerFontSize }]}>
        Follow Us
      </Text>
      <View style={styles.iconsRow}>
        {platforms.map((platform, index) => (
          <View key={index} style={styles.iconWrapper}>
            <Ionicons
              name={platform.name}
              size={iconSize}
              color={platform.color}
              style={styles.icon}
            />
            <Text style={[styles.countText, { fontSize: countFontSize }]}>
              {platform.count}
            </Text>
            <Text style={[styles.labelText, { fontSize: labelFontSize }]}>
              {platform.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};


  const HomePage = () => (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#274A8A" />
      <ScrollView>
        <View style={styles.container}>
          <TopBar />
          <UserInfoRow />
          <SearchBar />
          <UpcomingAppointmentRow />
          <HelpSection />
         
          <AreYouDoctorSection/>
          <TellaFriend/>
          <SubscribeNewsletter/>
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
      </Tab.Navigator>
    </NavigationContainer>
  );
}

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: wp('1%'),
    marginRight: 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingBottom: hp('2%'),
  },
  bottomSection: {
    marginBottom: hp('1%'),
  },
  containertop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: wp('2%'),
  },
  sectionTitle: {
    fontSize: hp('2.2%'),
    fontWeight: 'bold',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp('2%'),
    backgroundColor: '#fff',
    elevation: 4,
  },
  menuIcon: {
    marginLeft: wp('2%'),
    fontSize: hp('3%'),
  },
  logoImage: {
    width: wp('40%'),
    height: hp('5%'),
    resizeMode: 'contain',
    marginLeft: wp('15%'),
  },
  profileImageContainer: {
    width: wp('10%'),
    height: hp('5%'),
    borderRadius: wp('5%'),
  },
  bellIcon: {
    fontSize: hp('3%'),
  },
  headerText: {
    fontSize: hp('2%'),
  },
  userInfoRow: {
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1%'),
  },
  userName: {
    fontSize: hp('2%'),
  },
  locationIcon: {
    fontSize: hp('2%'),
    marginRight: wp('1%'),
  },
  userLocation: {
    fontSize: hp('2%'),
  },
  searchContainer: {
    borderRadius: wp('2%'),
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('3%'),
    marginVertical: hp('1.5%'),
    width: wp('92%'),
  },
  searchIcon: {
    fontSize: hp('2.5%'),
    marginRight: wp('2%'),
  },
  searchInput: {
    fontSize: hp('1.8%'),
  },
  upcomingAppointmentRow: {
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1.5%'),
    marginHorizontal: wp('2%'),
    borderRadius: wp('1.5%'),
  },
  calendarIcon: {
    fontSize: hp('3%'),
    marginRight: wp('2%'),
  },
  upcomingText: {
    fontSize: hp('1.8%'),
  },
  seeAllText: {
    fontSize: hp('1.8%'),
  },
  gridRow: {
    marginBottom: hp('1%'),
    paddingHorizontal: wp('2%'),
  },
  smallGridRow: {
    marginBottom: hp('2%'),
    gap: wp('1%'),
  },
  smallGridItemWrapper: {
    width: itemWidth,
    height: hp('8%'),
  },
  smallGridImageBackground: {
    height: hp('9%'),
    borderRadius: wp('2%'),
  },
  gridItem: {
    width: wp('45%'),
    height: hp('25%'),
  },
  gridI: {
    width: wp('45%'),
    height: hp('12%'),
  },
  gridItemInner: {
    padding: wp('2%'),
  },
  gridItemTitle: {
    fontSize: hp('2%'),
  },
  gridItemTitleClinic: {
    fontSize: hp('1.8%'),
  },
  gridItemSubtitle: {
    fontSize: hp('1.5%'),
  },
  blogSection: {
    margin: wp('2%'),
  },
  blogCard: {
    width: wp('40%'),
    height: hp('25%'),
    marginRight: wp('3%'),
    borderRadius: wp('2%'),
    padding: wp('1%'),
  },
  blogImage: {
    height: hp('15%'),
    borderRadius: wp('2%'),
  },
  blogTitle: {
    fontSize: hp('1.8%'),
  },
  doctorsSection: {
    marginTop: hp('3%'),
    paddingHorizontal: wp('2%'),
  },
  doctorCard: {
    width: wp('45%'),
    height: hp('20%'),
    marginRight: wp('3%'),
    borderRadius: wp('2%'),
    padding: wp('2%'),
  },
  doctorImage: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('10%'),
    marginBottom: hp('1%'),
  },
  doctorName: {
    fontSize: hp('1.8%'),
  },
  distance: {
    fontSize: hp('1.5%'),
  },
  featureContainer: {
    paddingTop: hp('1%'),
  },
  featuredContainer: {
    margin: wp('2%'),
    borderRadius: wp('2%'),
  },
  leftColumn: {
    paddingLeft: wp('2%'),
  },
  featureImage: {
    width: wp('40%'),
    height: wp('30%'),
  },
  socialMediaContainer: {
    paddingVertical: hp('2%'),
  },
  socialMediaHeader: {
    marginTop: hp('2%'),
    marginBottom: hp('2%'),
  },
  notificationModal: {
    width: wp('85%'),
    maxHeight: hp('70%'),
    borderRadius: wp('5%'),
    padding: wp('5%'),
  },
  notificationText: {
    fontSize: hp('1.8%'),
  },
  // Add responsive conversions for remaining styles
});

const tellaFriendStyles = StyleSheet.create({
  image: {
    width: wp('30%'),
    height: wp('30%'),
  },
  title: {
    fontSize: hp('2%'),
    marginBottom: hp('1%'),
  },
  subtitle: {
    fontSize: hp('1.8%'),
    marginBottom: hp('0.5%'),
  },
  button: {
    marginVertical: hp('1%'),
    paddingVertical: hp('1%'),
    width: wp('30%'),
    borderRadius: wp('1.5%'),
  },
  buttonText: {
    fontSize: hp('1.8%'),
  },
  // Add other responsive conversions
});
