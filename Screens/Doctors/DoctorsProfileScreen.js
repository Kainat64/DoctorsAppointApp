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
  Linking,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Color, FontSize, FontFamily, Padding, Border} from '../../GlobalStyles';
import {useNavigation} from '@react-navigation/native';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const Tab = createMaterialTopTabNavigator();
import {getDoctorById} from '../../utils/Api';
import {getDoctorReviews} from '../../utils/Api';
import {BaseUrl} from '../../utils/BaseApi';
import axios from 'axios';
import moment from 'moment';

const DoctorProfileDetails = ({route}) => {
  const navigation = useNavigation();
  const {doctorId} = route.params;

  const [doctors, setDoctors] = useState([]);
  const [doctorReviews, setDoctorReviews] = useState([]);
  const [countReview, setCountReview] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorRes, countRes] = await Promise.all([
          getDoctorById(doctorId),
         
          axios.get(`${BaseUrl}/doctor/${doctorId}/reviews-count`)
        ]);
        
        setDoctors([doctorRes.data]);
        console.log('doctor data :', doctorRes.data);
        setDoctorReviews(doctorRes.data.reviews);
        //console.log('reviews fetching...', doctorRes.data.reviews);
        setCountReview(countRes.data.review_count);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [doctorId]);

  const ShowBookAppointment = doctorId => {
    navigation.navigate('Book Appointment', {doctorId});
  };

  const ShowVideoConsultation = doctorId => {
    navigation.navigate('Video Consultation', {doctorId});
  };

  const handleOpenLocation = () => {
    Linking.openURL('https://maps.app.goo.gl/c29G5VyWN2fZaeMYA');
  };

  const services = [
    {name: 'Aesthetic Crown', icon: 'crown'},
    {name: 'Bleaching', icon: 'magic'},
    {name: 'Dental Fillings', icon: 'paste'},
    {name: 'Bone Grafting', icon: 'bone'},
    {name: 'Ceramic Braces', icon: 'braille'},
  ];

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const fullDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Ionicons key={i} name="star" size={16} color="#FFD700" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<Ionicons key={i} name="star-half" size={16} color="#FFD700" />);
      } else {
        stars.push(<Ionicons key={i} name="star-outline" size={16} color="#FFD700" />);
      }
    }
    
    return stars;
  };

  const HomeProfileScreen = () => {
    if (loading) return <ActivityIndicator size="large" color={Color.blue1} />;
    if (error) return <Text style={styles.errorText}>Error: {error}</Text>;

    return (
      <ScrollView style={styles.scrollView}>
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
        {doctors.map((doctor, index) => (
          <View key={doctor.id} style={styles.card}>
            <View style={styles.profileHeader}>
              <Image
                style={styles.profileImage}
                resizeMode="cover"
                source={{
                  uri: doctor.image_url || 'https://via.placeholder.com/100',
                }}
              />
              <View style={styles.profileInfo}>
                <View style={styles.nameContainer}>
                  <Text style={styles.doctorName}>
                    Dr. {doctor.first_name} {doctor.last_name}
                  </Text>
                  <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                </View>
                <Text style={styles.specialization}>
                  {doctor.specialist?.title || 'Dentist'}
                </Text>
                <Text style={styles.qualification}>
                  {doctor.degree || 'BDS, FCPS, ORTHODONTICS'}
                </Text>
              </View>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>89+</Text>
                <Text style={styles.statLabel}>Patients</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{countReview}+</Text>
                <Text style={styles.statLabel}>Reviews</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {doctor.experience || '5'}+
                </Text>
                <Text style={styles.statLabel}>Years Exp</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About Me</Text>
              <Text style={styles.aboutText}>
                {doctor.about_me ||
                  'Experienced dentist with specialization in orthodontics and cosmetic dentistry.'}
              </Text>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.videoButton]}
                onPress={() => ShowVideoConsultation(doctor.id)}>
                <Ionicons name="videocam" size={18} color="white" />
                <Text style={styles.actionButtonText}>Video Consultation</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.bookButton]}
                onPress={() => ShowBookAppointment(doctor.id)}>
                <FontAwesome name="calendar-plus-o" size={16} color="white" />
                <Text style={styles.actionButtonText}>Book Appointment</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  const ServicesScreen = () => {
    if (loading) return <ActivityIndicator size="large" color={Color.blue1} />;
    if (error) return <Text style={styles.errorText}>Error: {error}</Text>;

    return (
      <ScrollView style={styles.scrollView}>
        {doctors.map((doctor, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Services Offered</Text>
              <View style={styles.servicesGrid}>
                {services.map((service, index) => (
                  <View key={index} style={styles.serviceCard}>
                    <View style={styles.serviceIconContainer}>
                      <FontAwesome name={service.icon} size={20} color={Color.blue1} />
                    </View>
                    <Text style={styles.serviceName}>{service.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  const ReviewScreen = () => {
    if (loading) return <ActivityIndicator size="large" color={Color.blue1} />;
    if (error) return <Text style={styles.errorText}>Error: {error}</Text>;

    return (
      <ScrollView style={styles.scrollView}>
        {doctors.map((doctor, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.ratingSummary}>
              <Text style={styles.ratingNumber}>{countReview}</Text>
              <Text style={styles.ratingTitle}>Patient Reviews</Text>
              <View style={styles.starRating}>
                {renderStars(4.5)}
              </View>
              <Text style={styles.ratingSubtitle}>500+ Daily Visitors</Text>
            </View>

            {(doctorReviews?.length ?? 0) > 0 ? (
              doctorReviews.map((review, index) => (
                <View key={index} style={styles.reviewCard}>
                  <Image
                      source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}

                    style={styles.reviewUserImage}
                  />
                  <View style={styles.reviewContent}>
                    <View style={styles.reviewHeader}>
                      <Text style={styles.reviewUserName}>
                        {review.user?.name || 'Anonymous'}
                        <Ionicons name="checkmark-circle" size={14} color="#4CAF50" style={styles.verifiedIcon} />
                      </Text>
                      <Text style={styles.reviewDate}>
                      {moment(review.created_at).format('YYYY-MM-DD')}

                      </Text>
                    </View>
                    <View style={styles.reviewStars}>
                      {renderStars(review.rating || 5)}
                    </View>
                    <Text style={styles.reviewFeedbackTitle}>Patient Feedback:</Text>
                    <Text style={styles.reviewFeedbackText}>
                      {review.comments || 'No comments provided.'}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noReviewsText}>No reviews yet for this doctor.</Text>
            )}
          </View>
        ))}
      </ScrollView>
    );
  };

  const AvailabilityScreen = () => {
    if (loading) return <ActivityIndicator size="large" color={Color.blue1} />;
    if (error) return <Text style={styles.errorText}>Error: {error}</Text>;

    return (
      <ScrollView style={styles.scrollView}>
        {doctors.map((doctor, index) => (
         
          <View key={index} style={styles.card}>
           
            <View style={styles.clinicCard}>
              <View style={styles.clinicHeader}>
                <MaterialIcons name="medical-services" size={24} color={Color.blue1} />
                <Text style={styles.clinicTitle}>Consultation Fee</Text>
                <Text style={styles.clinicFee}>{doctor.checkup_fee}</Text>
              </View>

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="calendar" size={20} color={Color.blue1} 
                   style={styles.sectionIcon}
                  />
                  <Text style={styles.sectionTitle}>Availability Days</Text>
                </View>
                
                <View style={styles.daysContainer}>
                  {daysOfWeek.map((dayShort, index) => {
                    const fullDay = fullDays[index];
                    const isDayOff = doctor?.schedule?.some(
                      sched => sched.day === fullDay && sched.is_day_off === 1
                    );

                    return (
                      <View key={dayShort} style={[styles.dayPill, isDayOff ? styles.dayOff : styles.dayOn]}>
                        <Text style={[styles.dayText, isDayOff && styles.dayOffText]}>
                          {dayShort} {isDayOff && '(Off)'}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="time" size={20} color={Color.blue1} 
                  style={styles.sectionIcon}/>
                  <Text style={styles.sectionTitle}>Availability Time</Text>
                </View>
                <Text style={styles.timeText}>
                  {moment(doctor.start_time, 'HH:mm').format('hh:mm a')} - {moment(doctor.end_time, 'HH:mm').format('hh:mm a')}
                </Text>
              </View>
            </View>

            <View style={styles.clinicCard}>
              <View style={styles.clinicHeader}>
                <MaterialIcons name="local-hospital" size={24} color={Color.blue1} 
                style={styles.sectionIcon}/>
                <Text style={styles.clinicTitle}>{doctor.hospital?.hospital_name}</Text>
                <Text style={styles.clinicFee}></Text>
              </View>

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="calendar" size={20} color={Color.blue1} 
                  style={styles.sectionIcon}/>
                  <Text style={styles.sectionTitle}>Availability Days</Text>
                </View>
                
                <View style={styles.daysContainer}>
                  {daysOfWeek.map((dayShort, index) => (
                    <View key={dayShort} style={styles.dayPill}>
                      <Text style={styles.dayText}>{dayShort}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="time" size={20} color={Color.blue1} 
                  style={styles.sectionIcon}/>
                  <Text style={styles.sectionTitle}>Availability Time</Text>
                </View>
                <Text style={styles.timeText}>
                {moment(doctor.start_time, 'HH:mm').format('hh:mm a')} - {moment(doctor.end_time, 'HH:mm').format('hh:mm a')}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: Color.blue1,
          tabBarInactiveTintColor: Color.inActiveFieldsColor,
          tabBarLabelStyle: {fontSize: 14, fontWeight: '600'},
          tabBarStyle: {backgroundColor: 'white'},
          tabBarIndicatorStyle: {backgroundColor: Color.blue1, height: 3},
        }}>
        <Tab.Screen 
          name="Profile" 
          component={HomeProfileScreen} 
          options={{
            tabBarIcon: ({color}) => (
              <Ionicons name="person" size={20} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Timing" 
          component={AvailabilityScreen} 
          options={{
            tabBarIcon: ({color}) => (
              <Ionicons name="time" size={20} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Review" 
          component={ReviewScreen} 
          options={{
            tabBarIcon: ({color}) => (
              <Ionicons name="star" size={20} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Services" 
          component={ServicesScreen} 
          options={{
            tabBarIcon: ({color}) => (
              <MaterialIcons name="medical-services" size={20} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  scrollView: {
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
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Color.blue1,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 15,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorName: {
    fontSize: 20,
    fontWeight: '600',
    color: Color.blue1,
    marginRight: 5,
  },
  specialization: {
    fontSize: 16,
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
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
    width: '30%',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Color.blue1,
  },
  statLabel: {
    fontSize: 14,
    color: Color.inActiveFieldsColor,
    marginTop: 5,
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Color.blue1,
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 22,
    color: Color.inActiveFieldsColor,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    width: '48%',
  },
  videoButton: {
    backgroundColor: '#e74c3c',
  },
  bookButton: {
    backgroundColor: Color.blue1,
  },
  actionButtonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '500',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: '48%',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceIconContainer: {
    backgroundColor: 'rgba(62, 91, 166, 0.1)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  serviceName: {
    fontSize: 14,
    color: Color.blue1,
    fontWeight: '500',
  },
  ratingSummary: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 15,
  },
  ratingNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Color.blue1,
  },
  ratingTitle: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '600',
    marginVertical: 5,
  },
  starRating: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  ratingSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Color.inActiveFieldsColor,
    marginTop: 10,
  },
  reviewCard: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 15,
  },
  reviewUserImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  reviewContent: {
    flex: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  reviewUserName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Color.blue1,
  },
  verifiedIcon: {
    marginLeft: 5,
  },
  reviewDate: {
    fontSize: 12,
    color: '#A1A1A1',
  },
  reviewStars: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  reviewFeedbackTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Color.blue1,
    marginTop: 5,
  },
  reviewFeedbackText: {
    fontSize: 14,
    color: Color.inActiveFieldsColor,
    marginTop: 5,
    lineHeight: 20,
  },
  noReviewsText: {
    textAlign: 'center',
    color: Color.inActiveFieldsColor,
    marginVertical: 20,
  },
  clinicCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  clinicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  clinicTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Color.blue1,
    marginLeft: 10,
    flex: 1,
  },
  clinicFee: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dayPill: {
    backgroundColor: '#e8f5e9',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    margin: 5,
    minWidth: 70,
    alignItems: 'center',
  },
  dayOn: {
    backgroundColor: '#e8f5e9',
  },
  dayOff: {
    backgroundColor: '#ffebee',
  },
  dayText: {
    color: Color.blue1,
    fontWeight: '500',
  },
  dayOffText: {
    color: '#e53935',
  },
  timeText: {
    fontSize: 16,
    color: Color.inActiveFieldsColor,
    marginLeft: 30,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  sectionIcon: {
    marginRight: 10,
    marginTop: -10,
  }
});

export default DoctorProfileDetails;