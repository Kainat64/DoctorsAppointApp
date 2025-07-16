/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-catch-shadow */
/* eslint-disable no-shadow */
/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  Linking,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {FontFamily, Color, Padding, Border, FontSize} from '../../GlobalStyles';
const Tab = createMaterialTopTabNavigator();
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import {getHospitalById} from '../../utils/Api';
import {CountDoctors} from '../utils/Api';
import {BaseUrl} from '../../utils/BaseApi';

const {width} = Dimensions.get('window');
import moment from 'moment';
const HospitalProfile = ({route}) => {
  const navigation = useNavigation();
  const {hospitalId} = route.params;
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctorCount, setDoctorCount] = useState(0);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    if (route.params?.hospitalId) {
      loadHospitalProfile(route.params.hospitalId);
    }
  }, [route.params?.hospitalId]);

  const loadHospitalProfile = async hospitalId => {
    try {
      const response = await getHospitalById(hospitalId);
      setHospitals(response.data);
      console.log('hospital profile', response.data);
      setLoading(false);
    } catch (error) {
      console.error('There was an error fetching the hospital profile!', error);
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    axios
      .get(`${BaseUrl}/hospitals/${hospitalId}/doctor-count`)
      .then(response => {
        setDoctorCount(response.data.doctor_count);
      })
      .catch(error => {
        console.error('There was an error fetching the doctor count!', error);
      });
  }, [hospitalId]);

  const ShowBookAppointment = doctorId => {
    navigation.navigate('Book Appointment', {doctorId});
  };

  const ShowVideoConsultation = hospitalId => {
    navigation.navigate('Video Consultation', {hospitalId});
  };

  const renderRatingStars = rating => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FontAwesome key={`full-${i}`} name="star" size={16} color="#FFD700" />,
      );
    }

    if (hasHalfStar) {
      stars.push(
        <FontAwesome
          key="half"
          name="star-half-full"
          size={16}
          color="#FFD700"
        />,
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FontAwesome
          key={`empty-${i}`}
          name="star-o"
          size={16}
          color="#FFD700"
        />,
      );
    }

    return stars;
  };

  const HomePageScreen = () => {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text>Loading Clinic information...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text>Error loading Clinic data. Please try again.</Text>
            </View>
          ) : hospitals && Array.isArray(hospitals) && hospitals.length > 0 ? (
            hospitals.map((hospital, index) => (
              <View key={hospital.id || index}>
                {/* Header with Back Button */}
                <View style={styles.header}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Doctors')}
                    style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color="#fff" />
                  </TouchableOpacity>
                  <Text style={styles.headerTitle}>Clinic Profile</Text>
                </View>

                {/* Hospital Cover Image */}

                {/* Profile Section */}
                <View style={styles.profileSection}>
                  <View>
                    <Image
                      source={{
                        uri:
                          hospital.image_url ||
                          'https://via.placeholder.com/100',
                      }}
                      style={styles.profileImage}
                    />
                    {console.log('image dkjfrkgjtrkgj', hospital.image_url)}
                    <View style={styles.infoBox}>
                      <View style={styles.infoTime}>
                        <MaterialIcons
                          name="access-time"
                          size={20}
                          color="#0056D2"
                        />

                        <Text style={styles.infoNumber}>24 hrs</Text>
                      </View>
                      <Text style={styles.infoNumber}> Open</Text>
                    </View>
                  </View>

                  <View style={styles.detailsSection}>
                    <Text style={styles.hospitalName}>
                      {hospital.hospital_name || 'Unknown Hospital'}
                    </Text>
                    <View style={styles.locationRow}>
                      <MaterialIcons
                        name="location-on"
                        size={16}
                        color="#666"
                      />
                      <Text style={styles.hospitalLocation}>
                        {hospital.google_address || 'No address provided'}
                      </Text>
                    </View>

                    <View style={styles.reviewSection}>
                      {renderRatingStars(4.5)}
                      <Text style={styles.reviews}> 865 Reviews</Text>
                      <FontAwesome
                        name="check-circle"
                        size={16}
                        color="#4CAF50"
                        style={styles.verifiedIcon}
                      />
                    </View>
                  </View>
                </View>

                {/* Info Section */}

                {/* About Section */}
                <View style={styles.aboutSection}>
                  <Text style={styles.sectionTitle}>About</Text>
                  <Text style={styles.aboutText}>
                    {hospital.about ||
                      'Our clinic is committed to delivering quality and compassionate healthcare to all our patients. With a team of skilled medical professionals and modern facilities, we offer a wide range of outpatient services, including general consultations, diagnostics, and specialized care. We focus on personalized treatment, patient comfort, and preventive care to ensure the well-being of every individual who walks through our doors.'}
                  </Text>
                </View>

                {/* Call Button */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.callButton}
                    onPress={() => Linking.openURL(`tel:${hospital.phone}`)}>
                    <Feather name="phone" size={20} color="#fff" />
                    <Text style={styles.callButtonText}>Call Helpline</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.callsButton}>
                    <Feather name="phone" size={20} color="#fff" />
                    <Text
                      style={styles.callButtonText}
                      onPress={() => ShowVideoConsultation(hospitalId)}>
                      Video Consultation
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No Clinic available</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  };

  return <HomePageScreen />;
};

const styles = StyleSheet.create({
  // Base styles
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFEBEE',
    borderRadius: 10,
    margin: 20,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },

  // Header styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#0056D2',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },

  // Cover image
  coverImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },

  // Profile section
  profileSection: {
    flexDirection: 'row',
    padding: 20,
    marginTop: 5,
    zIndex: 1,
  },
  iconSection: {
    width: 80,
    height: 80,
    borderRadius: 40,

    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  detailsSection: {
    flex: 1,
    marginLeft: 16,
  },
  hospitalName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  hospitalLocation: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  reviewSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviews: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  verifiedIcon: {
    marginLeft: 8,
  },

  // Info section
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#f8f9fa',
    marginHorizontal: 10,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  infoBox: {
    marginTop: 15,
    display: 'flex',
    flexDirection: 'col',
    alignItems: 'center',
  },
  infoTime: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    gap: 4,
  },
  infoNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0056D2',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },

  // Section styles
  sectionContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  aboutSection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },

  // Doctors preview
  doctorsScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  doctorPreviewCard: {
    width: 120,
    marginRight: 12,
    alignItems: 'center',
  },
  doctorPreviewImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#0056D2',
  },
  doctorPreviewName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
  doctorPreviewSpecialty: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },

  // Button container
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 1,
    marginTop: 24,
    marginBottom: 32,
  },
  callButton: {
    backgroundColor: '#E12454',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E12454',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  callsButton: {
    backgroundColor: '#274A8A',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#274A8A',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  callButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  // Doctors page styles
  pageHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0056D2',
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  doctorCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  doctorHeader: {
    flexDirection: 'row',
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  doctorInfo: {
    flex: 1,
    marginLeft: 16,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#0056D2',
    marginTop: 4,
  },
  doctorRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  doctorBio: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginTop: 12,
  },
  doctorStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0056D2',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  consultationOptions: {
    marginTop: 16,
  },
  optionCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0056D2',
    marginLeft: 8,
  },
  optionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E12454',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  videoButton: {
    backgroundColor: '#0056D2',
    marginRight: 8,
  },
  bookButton: {
    backgroundColor: '#E12454',
    marginLeft: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },

  // Departments page styles
  departmentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  departmentCard: {
    width: width / 2 - 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  departmentIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  departmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  departmentDoctors: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
});
export default HospitalProfile;
