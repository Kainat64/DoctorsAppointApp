
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  Image,
  Linking,
  TouchableOpacity,
} from 'react-native';
import {Color, FontSize, FontFamily, Padding, Border} from '../../GlobalStyles';
import {useNavigation} from '@react-navigation/native';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
  const [modalVisible, setModalVisible] = useState(false);
  const [doctorReviews, setDoctorReviews] = useState([]);
  const [countReview, setCountReview] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `${BaseUrl}/doctor/${doctorId}/reviews`,
        );
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }
        const data = await response.json();
        setDoctorReviews(response.data);
        console.log('reviews fetching...', response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
    //loadDoctorsProfile();
  }, [doctorId]);

  useEffect(() => {
    if (route.params?.doctorId) {
      loadDoctorProfile(route.params.doctorId);
    }
  }, [route.params?.doctorId]);

  const loadDoctorProfile = async doctorId => {
    const response = await getDoctorById(doctorId);
    setDoctors(response.data);
    console.log('doctor', response.data);
  };
  //set dayoff schedule
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  useEffect(() => {
    axios
      .get(`${BaseUrl}/doctor/${doctorId}/reviews-count`)
      .then(response => {
        setCountReview(response.data.review_count);
      })
      .catch(error => {
        console.error('There was an error fetching the doctor count!', error);
      });
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
    {
      name: '  Aesthetic Crown',
    },
    {
      name: '   Bleaching',
    },
    {
      name: '   Dental Fillings',
    },
    {
      name: ' Bone Grafting',
    },
    {
      name: ' Ceramic Braces',
    },
  ];
  const HomeProfileScreen = () => {
    return (
      <ScrollView vectorWrapper>
        {doctors.map((doctor, index) => (
          <View key={doctor.id} style={styles.card}>
            <View style={styles.row}>
              <View style={styles.doctorProfileDetails}>
                <View
                  style={[
                    styles.doctorProfileDetailsInner,
                    styles.wrapperPosition,
                  ]}>
                  <View style={[styles.groupParent, styles.groupParentFlexBox]}>
                    <Image
                      style={styles.frameInner}
                      resizeMode="cover"
                      source={{
                        uri: doctor.image_url
                          ? doctor.image_url
                          : 'https://via.placeholder.com/100',
                      }}
                    />
                    <View style={styles.frameView}>
                      <View
                        style={[
                          styles.drLauraParent,
                          styles.groupParentFlexBox,
                        ]}>
                        <Text style={[styles.drLaura1, styles.lauraTypo]}>
                          {doctor.first_name} {doctor.last_name}
                        </Text>
                        <Image
                          style={styles.check160199581Icon}
                          resizeMode="cover"
                          source={require('../../assets/check-16019958-1.png')}
                        />
                      </View>
                      <Text
                        style={[
                          styles.specialistDentist,
                          styles.specialistClr,
                        ]}>
                        Specialist: {doctor.specialist.title}
                      </Text>
                      <View
                        style={[
                          styles.bdsFcpsOrthodonticsWrapper,
                          styles.groupParentFlexBox,
                        ]}>
                        <Text
                          style={[
                            styles.bdsFcpsOrthodontics,
                            styles.specialistClr,
                          ]}>
                         {doctor.degree}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View
                  style={[
                    styles.frameParent1,
                    styles.wrapperPosition,
                    styles.row,
                  ]}>
                  <View style={styles.frameWrapper1}>
                    <View style={styles.parent}>
                      <Text style={[styles.text, styles.textTypo]}>89+</Text>
                      <Text style={[styles.waitTime, styles.waitTimeTypo]}>
                        Patient
                      </Text>
                    </View>
                  </View>
                  <View style={styles.frameWrapper1}>
                    <View style={styles.parent}>
                      <Text style={[styles.text, styles.textTypo]}>9+</Text>
                      <Text style={[styles.waitTime, styles.waitTimeTypo]}>
                        Review
                      </Text>
                    </View>
                  </View>
                  <View style={styles.frameWrapper1}>
                    <View style={styles.parent}>
                      <Text style={[styles.text, styles.textTypo]}>
                        {doctor.experience}
                      </Text>
                      <Text style={[styles.experience, styles.waitTimeTypo]}>
                        Experience
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={[styles.aboutMeWrapper, styles.wrapperPosition]}>
                  <Text style={[styles.aboutMe, styles.aboutMeTypo]}>
                    About me
                  </Text>
                </View>

                <View
                  style={[
                    styles.doctorProfileDetailsChild,
                    styles.frameParentPosition,
                  ]}>
                  <View
                    style={[styles.frameParent2, styles.groupParentFlexBox]}>
                    <View
                      style={[styles.frameParent2, styles.groupParentFlexBox]}>
                      <View
                        style={[
                          styles.frameWrapper3,
                          styles.frameWrapperLayout,
                        ]}>
                        <TouchableOpacity
                          onPress={() => ShowVideoConsultation(doctor.id)}>
                          <View style={styles.groupParentFlexBox}>
                            <Image
                              style={styles.groupIcon}
                              resizeMode="cover"
                              source={require('../../assets/group9.png')}
                            />
                            <Text
                              style={[
                                styles.videoConsultaion,
                                styles.btnbooking,
                              ]}>
                              Video Consultaion
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity
                        onPress={() => ShowBookAppointment(doctor.id)}>
                        <View
                          style={[
                            styles.frameWrapper4,
                            styles.frameWrapperLayout,
                          ]}>
                          <View
                            style={[
                              styles.drLauraParent,
                              styles.groupParentFlexBox,
                            ]}>
                            <Image
                              style={styles.calendarPlus76026102Icon}
                              resizeMode="cover"
                              source={require('../../assets/calendarplus-7602610-2.png')}
                            />
                            <Text
                              style={[
                                styles.videoConsultaion,
                                styles.btnbooking,
                              ]}>
                              Book Appointment
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View
                  style={[
                    styles.loremIpsumDolorSitAmetConWrapper,
                    styles.iconPosition,
                  ]}>
                  <Text style={[styles.loremIpsumDolor, styles.specialistClr]}>
                    {doctor.about_me}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  const ServicesScreen = () => {
    return (
      <ScrollView vectorWrapper>
        {doctors.map((doctor, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.row}>
              <View style={styles.doctorProfileDetails}>
                <View
                  style={[
                    styles.doctorProfileDetailsInner,
                    styles.wrapperPosition,
                  ]}>
                  <View style={[styles.groupParent, styles.groupParentFlexBox]}>
                    <Image
                      style={styles.frameInner}
                      resizeMode="cover"
                      source={{
                        uri: doctor.image_url
                          ? doctor.image_url
                          : 'https://via.placeholder.com/100',
                      }}
                    />
                    <View style={styles.frameView}>
                      <View
                        style={[
                          styles.drLauraParent,
                          styles.groupParentFlexBox,
                        ]}>
                        <Text style={[styles.drLaura1, styles.lauraTypo]}>
                          {doctor.first_name} {doctor.last_name}
                        </Text>
                        <Image
                          style={styles.check160199581Icon}
                          resizeMode="cover"
                          source={require('../../assets/check-16019958-1.png')}
                        />
                      </View>
                      <Text
                        style={[
                          styles.specialistDentist,
                          styles.specialistClr,
                        ]}>
                        Specialist: {doctor.specialist.title}
                      </Text>
                      <View
                        style={[
                          styles.bdsFcpsOrthodonticsWrapper,
                          styles.groupParentFlexBox,
                        ]}>
                        <Text
                          style={[
                            styles.bdsFcpsOrthodontics,
                            styles.specialistClr,
                          ]}>
                          BDS, FCPS, ORTHODONTICS
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.frameParentService}>
                  <View style={styles.frameGroupFlexBox}>
                    <Text style={styles.services2}>Services</Text>
                  </View>

                  <View style={styles.frameParent4}>
                    {services.map((service, index) => (
                      <View key={index} style={styles.frameWrapperShadowBox}>
                        <View
                          style={[
                            styles.calendarPlus76026102Parent,
                            styles.frameGroupFlexBox,
                          ]}>
                          <View style={styles.frameWrapper5FlexBox}>
                            <Image
                              style={styles.frameIcon}
                              resizeMode="cover"
                              source={require('../../assets/frame-347.png')}
                            />
                          </View>
                          <Text
                            style={[styles.aestheticCrown, styles.bracesTypo]}>
                            {service.name}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  const ReviewScreen = () => {
    return (
      <ScrollView vectorWrapper>
        {doctors.map((doctor, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.row}>
              <View style={styles.doctorProfileDetails}>
                <View
                  style={[
                    styles.doctorProfileDetailsInner,
                    styles.wrapperPosition,
                  ]}>
                  <View style={[styles.groupParent, styles.groupParentFlexBox]}>
                    <Image
                      style={styles.frameInner}
                      resizeMode="cover"
                      source={{
                        uri: doctor.image_url
                          ? doctor.image_url
                          : 'https://via.placeholder.com/100',
                      }}
                    />
                    <View style={styles.frameView}>
                      <View
                        style={[
                          styles.drLauraParent,
                          styles.groupParentFlexBox,
                        ]}>
                        <Text style={[styles.drLaura1, styles.lauraTypo]}>
                          {doctor.first_name} {doctor.last_name}
                        </Text>
                        <Image
                          style={styles.check160199581Icon}
                          resizeMode="cover"
                          source={require('../../assets/check-16019958-1.png')}
                        />
                      </View>
                      <Text
                        style={[
                          styles.specialistDentist,
                          styles.specialistClr,
                        ]}>
                        Specialist: {doctor.specialist.title}
                      </Text>
                      <View
                        style={[
                          styles.bdsFcpsOrthodonticsWrapper,
                          styles.groupParentFlexBox,
                        ]}>
                        <Text
                          style={[
                            styles.bdsFcpsOrthodontics,
                            styles.specialistClr,
                          ]}>
                          BDS, FCPS, ORTHODONTICS
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.card1}>
                  <View style={styles.row}>
                    <Text
                      style={{
                        fontSize: 32,
                        fontWeight: 600,
                        color: 'blue',
                        marginLeft: 130,
                      }}>
                      {countReview}
                    </Text>
                  </View>
                  <View style={[styles.row, styles.revHeading]}>
                    <Text
                      style={{fontSize: 22, color: 'green', fontWeight: '600'}}>
                      Positive Patient Reviews
                    </Text>
                  </View>
                  <View
                    style={[styles.vectorParent, styles.frameParentFlexBox1]}>
                    <Image
                      style={styles.vectorIconLayout}
                      resizeMode="cover"
                      source={require('../../assets/vector6.png')}
                    />
                    <Image
                      style={[styles.vectorIcon1, styles.vectorIconLayout]}
                      resizeMode="cover"
                      source={require('../../assets/vector6.png')}
                    />
                    <Image
                      style={[styles.vectorIcon1, styles.vectorIconLayout]}
                      resizeMode="cover"
                      source={require('../../assets/vector6.png')}
                    />
                    <Image
                      style={[styles.vectorIcon1, styles.vectorIconLayout]}
                      resizeMode="cover"
                      source={require('../../assets/vector6.png')}
                    />
                    <Image
                      style={[styles.vectorIcon1, styles.vectorIconLayout]}
                      resizeMode="cover"
                      source={require('../../assets/vector7.png')}
                    />
                  </View>
                  <View style={[styles.row, styles.revHeading]}>
                    <Text
                      style={{fontSize: 22, fontWeight: '600', marginTop: 50}}>
                      500 + Daily Visitors
                    </Text>
                  </View>
                </View>
                <ScrollView nestedScrollEnabled={true}>
                  {doctor.reviews.map((review, index) => (
                    <View key={index} style={styles.reviewCard}>
                      <Image
                        source={{uri: 'https://via.placeholder.com/50'}}
                        style={styles.userImage}
                      />
                      <View style={styles.reviewDetails}>
                        <Text style={styles.userName}>
                          {review.user?.name}{' '}
                          <Ionicons
                            name="checkmark-circle"
                            size={16}
                            color="green"
                          />
                        </Text>
                        <Text style={styles.reviewDate}>
                        {review.created_at && typeof review.created_at === 'string' 
                          ? review.created_at.split('T')[0] 
                          : 'Invalid date'
                          }
                        </Text>
                        <Text style={styles.feedbackTitle}>
                          Patient Feedback:
                        </Text>
                        <Text style={styles.feedbackText}>
                          {review.comments}
                        </Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };
  const AvailabilityScreen = () => {
    return (
      <ScrollView vectorWrapper>
        {doctors.map((doctor, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.row}>
              <View style={styles.doctorProfileDetails}>
                <View
                  style={[
                    styles.doctorProfileDetailsInner,
                    styles.wrapperPosition,
                  ]}>
                  <View style={[styles.groupParent, styles.groupParentFlexBox]}>
                    <Image
                      style={styles.frameInner}
                      resizeMode="cover"
                      source={{
                        uri: doctor.image_url
                          ? doctor.image_url
                          : 'https://via.placeholder.com/100',
                      }}
                    />
                    <View style={styles.frameView}>
                      <View
                        style={[
                          styles.drLauraParent,
                          styles.groupParentFlexBox,
                        ]}>
                        <Text style={[styles.drLaura1, styles.lauraTypo]}>
                          {doctor.first_name} {doctor.last_name}
                        </Text>
                        <Image
                          style={styles.check160199581Icon}
                          resizeMode="cover"
                          source={require('../../assets/check-16019958-1.png')}
                        />
                      </View>
                      <Text
                        style={[
                          styles.specialistDentist,
                          styles.specialistClr,
                        ]}>
                        Specialist: {doctor.specialist.title}
                      </Text>
                      <View
                        style={[
                          styles.bdsFcpsOrthodonticsWrapper,
                          styles.groupParentFlexBox,
                        ]}>
                        <Text
                          style={[
                            styles.bdsFcpsOrthodontics,
                            styles.specialistClr,
                          ]}>
                         {doctor.degree}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.card1}>
                  <View
                    style={[styles.frameWrapper5, styles.parentWrapperFlexBox]}>
                    <View style={styles.parentWrapperFlexBox}>
                      <View style={styles.frame}>
                        <Image
                          style={styles.vectorIcon}
                          resizeMode="cover"
                          source={require('../../assets/vector3.png')}
                        />
                      </View>
                      <Text
                        style={[
                          styles.videoConsultations,
                          styles.availableDayAndLayout,
                        ]}>
                        Consultaion Fee
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.rs1000Wrapper,
                        styles.parentWrapperFlexBox,
                      ]}>
                      <Text style={[styles.rs1000, styles.monTypo]}>
                        {doctor.chekup_fee}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.parentWrapperFlexBox}>
                    <Image
                      style={[styles.calendar52540281Icon, styles.iconLayout]}
                      resizeMode="cover"
                      source={require('../../assets/calendar-5254028-1.png')}
                    />
                    <Text style={[styles.availabilityDays, styles.monTypo]}>
                      Availability Days:
                    </Text>
                  </View>
                  <View style={[styles.component2Parent, styles.parentWrapperFlexBox]}>
                    {daysOfWeek.map((dayShort, index) => {
                      const fullDay = [
                        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
                      ][index];

                      const isDayOff = doctor?.schedule?.some(
                        sched => sched.day === fullDay && sched.is_day_off === 1
                      );

                      return (
                        <View key={dayShort} style={[styles.component3, styles.componentLayout]}>
                          <View
                            style={[
                              styles.monWrapper,
                              styles.wrapperFlexBox,
                              isDayOff ? { backgroundColor: '#ffdddd' } : { backgroundColor: '#ddffdd' },
                            ]}>
                            <Text style={[styles.mon, styles.monTypo]}>
                              {dayShort} {isDayOff ? '(Off)' : ''}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                  <View style={styles.frameParent9}>
                    <View
                      style={[
                        styles.frameWrapper5,
                        styles.parentWrapperFlexBox,
                      ]}>
                      <Image
                        style={styles.iconLayout}
                        resizeMode="cover"
                        source={require('../../assets/group11.png')}
                      />
                      <Text style={[styles.availabilityDays, styles.monTypo]}>
                        Availability Time:
                      </Text>
                    </View>
                    <View
                      style={[styles.am1000pmWrapper, styles.wrapperFlexBox]}>
                      <Text style={[styles.mon, styles.monTypo]}>
                        {moment(doctor.start_time, 'HH:mm').format('hh:mm a')} - {moment(doctor.end_time, 'HH:mm').format('hh:mm a')}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.card2}>
                  <View
                    style={[styles.frameWrapper5, styles.parentWrapperFlexBox]}>
                    <View style={styles.parentWrapperFlexBox}>
                      <View style={styles.frame}>
                        <Image
                          style={styles.vectorIcon}
                          resizeMode="cover"
                          source={require('../../assets/vector3.png')}
                        />
                      </View>
                      <Text
                        style={[
                          styles.videoConsultations,
                          styles.availableDayAndLayout,
                        ]}>
                        RYK HOSPITAL
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.rs1000Wrapper,
                        styles.parentWrapperFlexBox,
                      ]}>
                      <Text style={[styles.rs1000, styles.monTypo]}>
                        Rs. 1000
                      </Text>
                    </View>
                  </View>
                  <View style={styles.parentWrapperFlexBox}>
                    <Image
                      style={[styles.calendar52540281Icon, styles.iconLayout]}
                      resizeMode="cover"
                      source={require('../../assets/calendar-5254028-1.png')}
                    />
                    <Text style={[styles.availabilityDays, styles.monTypo]}>
                      Availability Days:
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.component2Parent,
                      styles.parentWrapperFlexBox,
                    ]}>
                    <View style={styles.componentLayout}>
                      <View style={[styles.monWrapper, styles.wrapperFlexBox]}>
                        <Text style={[styles.mon, styles.monTypo]}>Mon</Text>
                      </View>
                    </View>
                    <View style={[styles.component3, styles.componentLayout]}>
                      <View style={[styles.monWrapper, styles.wrapperFlexBox]}>
                        <Text style={[styles.mon1, styles.monTypo]}>Tue</Text>
                      </View>
                    </View>
                    <View style={[styles.component3, styles.componentLayout]}>
                      <View style={[styles.monWrapper, styles.wrapperFlexBox]}>
                        <Text style={[styles.mon, styles.monTypo]}>Wed</Text>
                      </View>
                    </View>
                    <View style={[styles.component3, styles.componentLayout]}>
                      <View style={[styles.monWrapper, styles.wrapperFlexBox]}>
                        <Text style={[styles.mon1, styles.monTypo]}>Thu</Text>
                      </View>
                    </View>
                    <View style={[styles.component3, styles.componentLayout]}>
                      <View style={[styles.monWrapper, styles.wrapperFlexBox]}>
                        <Text style={[styles.mon, styles.monTypo]}>Fri</Text>
                      </View>
                    </View>
                    <View style={[styles.component3, styles.componentLayout]}>
                      <View style={[styles.monWrapper, styles.wrapperFlexBox]}>
                        <Text style={[styles.mon1, styles.monTypo]}>Sat</Text>
                      </View>
                    </View>
                    <View style={[styles.component3, styles.componentLayout]}>
                      <View style={[styles.monWrapper, styles.wrapperFlexBox]}>
                        <Text style={[styles.mon, styles.monTypo]}>Sun</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.frameParent9}>
                    <View
                      style={[
                        styles.frameWrapper5,
                        styles.parentWrapperFlexBox,
                      ]}>
                      <Image
                        style={styles.iconLayout}
                        resizeMode="cover"
                        source={require('../../assets/group11.png')}
                      />
                      <Text style={[styles.availabilityDays, styles.monTypo]}>
                        Availability Time:
                      </Text>
                    </View>
                    <View
                      style={[styles.am1000pmWrapper, styles.wrapperFlexBox]}>
                      <Text style={[styles.mon, styles.monTypo]}>
                        11:00 AM - 10:00PM
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator>
        <Tab.Screen name="Profile" component={HomeProfileScreen} />
        <Tab.Screen name="Timing" component={AvailabilityScreen} />
        <Tab.Screen name="Review" component={ReviewScreen} />
        <Tab.Screen name="Services" component={ServicesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
  },
  card: {
    width: '95%', // Adjust width as needed
    height: 'auto',
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  card1: {
    width: '95%', // Adjust width as needed
    height: 250,
    marginTop: 150,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  card2: {
    width: '95%', // Adjust width as needed
    height: 250,
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  card3: {
    width: '95%', // Adjust width as needed
    height: 'auto',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  servicecard: {
    width: '95%', // Adjust width as needed
    height: 'auto',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  column33: {
    width: '33%', // Adjust width as needed
    left: 0,
    textAlign: 'left',
    alignItems: 'left',
    justifyContent: 'left',
  },

  frameParentPosition: {
    width: 430,
    left: 0,
    position: 'absolute',
  },
  statusBarFlexBox: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupParentFlexBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  capIconPosition: {
    left: '50%',
    position: 'absolute',
  },
  frameLayout: {
    maxWidth: '100%',
    overflow: 'hidden',
  },
  lauraClr: {
    color: Color.blue1,
    textAlign: 'center',
  },
  availabilityTypo: {
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
  },
  wrapperFlexBox: {
    paddingVertical: Padding.p_8xs,
    borderRadius: Border.br_5xs,
    paddingHorizontal: Padding.p_3xs,
    backgroundColor: Color.fieldsBackground,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrapperPosition: {
    left: 10,
    flexDirection: 'row',
    alignItems: 'left',
    position: 'absolute',

    display: 'flex',
  },
  lauraTypo: {
    fontFamily: FontFamily.poppinsSemiBold,
    fontWeight: '600',
  },
  specialistClr: {
    color: Color.inActiveFieldsColor,
    textAlign: 'left',
  },
  textTypo: {
    color: Color.colorMediumseagreen,
    lineHeight: 24,
    fontFamily: FontFamily.poppinsSemiBold,
    fontWeight: '600',
    fontSize: FontSize.size_lg,
  },
  waitTimeTypo: {
    marginTop: 3,
    fontSize: FontSize.size_base,
    textAlign: 'left',
    color: Color.inActiveFieldsColor,
    lineHeight: 24,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
  },
  groupShadowBox: {
    marginLeft: 15,
    paddingVertical: Padding.p_xl,
    height: 90,
    borderColor: Color.blueStroke,
    borderRadius: Border.br_3xs,
    shadowOpacity: 1,
    elevation: 15,
    shadowRadius: 15,
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowColor: 'rgba(39, 74, 138, 0.1)',
    borderWidth: 1,
    borderStyle: 'solid',
    alignItems: 'center',
  },
  aboutMeTypo: {
    fontSize: FontSize.size_xl,
    lineHeight: 24,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
  },
  frameWrapperLayout: {
    left: -20,
    paddingHorizontal: Padding.p_5xs,
    height: 42,
    width: 170,
    borderRadius: Border.br_7xs,
    paddingVertical: Padding.p_3xs,
    justifyContent: 'left',
    alignItems: 'left',
  },
  iconPosition: {
    marginLeft: -170,
    borderRadius: Border.br_3xs,
    left: '50%',
    position: 'absolute',
    width: 340,
  },
  time1: {
    fontSize: FontSize.size_mid,
    lineHeight: 22,
    height: 18,
    width: 34,
    display: 'flex',
    textAlign: 'center',
    color: Color.white,
    fontFamily: FontFamily.poppinsRegular,
    justifyContent: 'center',
    alignItems: 'center',
  },
  time: {
    width: 68,
    height: 40,
    paddingHorizontal: 0,
    paddingVertical: Padding.p_3xs,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellularConnectionIcon: {
    width: 19,
    height: 12,
  },
  wifiIcon: {
    width: 17,
    marginLeft: 7,
    height: 12,
  },
  border: {
    height: '100%',
    marginLeft: -13.65,
    top: '0%',
    bottom: '0%',
    borderRadius: Border.br_8xs_3,
    borderColor: Color.white,
    width: 25,
    opacity: 0.35,
    borderWidth: 1,
    borderStyle: 'solid',
    left: '50%',
    position: 'absolute',
  },
  capIcon: {
    height: '31.54%',
    marginLeft: 12.35,
    top: '36.92%',
    bottom: '31.54%',
    maxHeight: '100%',
    width: 1,
  },
  capacity: {
    height: '69.23%',
    marginLeft: -11.65,
    top: '15.38%',
    bottom: '15.38%',
    borderRadius: Border.br_10xs_5,
    width: 21,
    backgroundColor: Color.white,
  },
  battery: {
    width: 27,
    height: 13,
    marginLeft: 7,
  },
  cellularConnectionParent: {
    width: 78,
    height: 18,
    flex: 1,
  },
  statusBar: {
    height: 50,
    paddingRight: Padding.p_xl,
    backgroundColor: Color.blue1,
    alignSelf: 'stretch',
  },
  frameChild: {
    height: 15,
    overflow: 'hidden',
  },
  vectorWrapper: {
    borderRadius: Border.br_xl,
    borderColor: Color.subHeading,
    height: 34,
    padding: Padding.p_3xs,
    backgroundColor: Color.fieldsBackground,
    borderWidth: 1,
    borderStyle: 'solid',
    width: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drLaura: {
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
    fontSize: FontSize.size_5xl,
    color: Color.blue1,
  },
  drLauraWrapper: {
    paddingVertical: 0,
    paddingHorizontal: Padding.p_3xs,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  frameItem: {
    overflow: 'hidden',
    height: 18,
    alignSelf: 'stretch',
    width: '100%',
  },
  frameContainer: {
    paddingHorizontal: Padding.p_10xs,
    paddingVertical: Padding.p_5xs,
  },
  frameGroup: {
    marginTop: 14,
    width: 350,
  },
  frameWrapper: {
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  profileDetails: {
    color: Color.blue1,
    textAlign: 'center',
  },
  availability: {
    color: Color.subHeading,
    textAlign: 'center',
  },
  availabilityWrapper: {
    marginLeft: 14,
  },
  component10: {
    marginTop: 20,
    width: 350,
  },
  frameParent: {
    top: 0,
    alignItems: 'center',
  },
  frameInner: {
    width: 100,
    height: 100,
    borderRadius: Border.br_3xs,
  },
  drLaura1: {
    lineHeight: 26,
    color: Color.blue1,
    textAlign: 'left',
    marginLeft: -30,
    fontSize: FontSize.size_5xl,
  },
  check160199581Icon: {
    width: 18,
    marginLeft: 8,
    overflow: 'hidden',
    height: 18,
  },
  drLauraParent: {
    justifyContent: 'center',
  },
  specialistDentist: {
    marginTop: 6,
    textAlign: 'left',
    lineHeight: 24,
    fontSize: FontSize.size_xl,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
  },
  bdsFcpsOrthodontics: {
    textAlign: 'left',
    lineHeight: 24,
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
  },
  bdsFcpsOrthodonticsWrapper: {
    marginTop: 6,
    justifyContent: 'center',
  },
  frameView: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  groupParent: {
    flex: 1,
  },
  doctorProfileDetailsInner: {
    top: 15,
    width: '100%',
  },
  text: {
    textAlign: 'center',
    alignSelf: 'stretch',
  },
  waitTime: {
    alignSelf: 'stretch',
    textAlign: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  experience: {
    alignSelf: 'stretch',
    textAlign: 'center',
    alignItems: 'center',
  },
  parent: {
    width: 85,
    alignItems: 'center',
  },
  frameWrapper1: {
    padding: Padding.p_xl,
    height: 90,
    borderRadius: Border.br_3xs,
    shadowOpacity: 1,
    elevation: 15,
    shadowRadius: 15,
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowColor: 'rgba(39, 74, 138, 0.1)',
    width: '33.3%',
    borderColor: 'blue',
    borderWidth: 1,
    borderStyle: 'solid',

    alignItems: 'center',
    marginHorizontal: 10,
    marginLeft: -1,
  },
  frameWrapper2: {
    paddingHorizontal: Padding.p_base,
    width: 120,
    paddingVertical: Padding.p_xl,
  },
  text1: {
    textAlign: 'left',
  },
  group: {
    paddingHorizontal: Padding.p_xs,
    justifyContent: 'center',
  },
  frameParent1: {
    top: 115,
    display: 'flex',
    width: 300,
  },
  frameParentabout: {
    top: 297,
    display: 'flex',
    width: 300,
  },
  aboutMe: {
    color: Color.blue2,
    textAlign: 'left',
    lineHeight: 24,
  },
  aboutMeWrapper: {
    top: 217,
  },
  locationWrapper: {
    top: 470,
  },
  groupIcon: {
    height: 16,
    width: 21,
  },
  videoConsultaion: {
    fontSize: FontSize.size_mini,
    lineHeight: 18,
    textAlign: 'left',
    marginLeft: 8,
    color: Color.white,
    fontWeight: '600',
  },
  frameWrapper3: {
    backgroundColor: 'red',
  },
  calendarPlus76026102Icon: {
    width: 16,
    height: 16,
  },
  frameWrapper4: {
    marginLeft: 10,
    backgroundColor: Color.blue1,
  },
  frameParent2: {
    alignSelf: 'stretch',
    marginTop: 40,
  },
  doctorProfileDetailsChild: {
    top: 440,
    bottom: 0,
    backgroundColor: Color.colorGray,
    height: 69,
    paddingHorizontal: Padding.p_xl,
    paddingVertical: Padding.p_mini,
  },
  loremIpsumDolor: {
    width: 340,

    marginLeft: 12,
    fontSize: FontSize.size_sm,
    textAlign: 'left',
    lineHeight: 24,
    display: 'flex',
    fontFamily: FontFamily.poppinsRegular,
    color: Color.inActiveFieldsColor,
    alignItems: 'center',
  },
  loremIpsumDolorSitAmetConWrapper: {
    top: 240,

    borderColor: Color.blueStroke,
    marginLeft: -210,
    padding: Padding.p_3xs,
    backgroundColor: Color.fieldsBackground,
    borderWidth: 1,
    borderStyle: 'solid',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    top: 663,
    height: 183,
    width: 390,
  },
  doctorProfileDetailsItem: {
    top: 751,
    left: 277,
    width: 20,
    height: 20,
    position: 'absolute',
  },
  frameChild1: {
    width: 30,
    height: 30,
  },
  drLaura2: {
    fontSize: FontSize.size_sm,
    lineHeight: 18,
    color: Color.blue1,
    textAlign: 'center',
  },
  specialistDentist1: {
    fontSize: FontSize.size_sm,
    lineHeight: 18,
    textAlign: 'left',
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
  },
  frameParent3: {
    marginLeft: 8,
  },
  doctorProfileDetailsInner1: {
    top: 695,
    left: 183,
    paddingVertical: Padding.p_7xs,
    borderRadius: Border.br_7xs,
    borderColor: Color.blueStroke,
    shadowOpacity: 1,
    elevation: 15,
    shadowRadius: 15,
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowColor: 'rgba(39, 74, 138, 0.1)',
    paddingHorizontal: Padding.p_3xs,
    borderWidth: 1,
    borderStyle: 'solid',
    position: 'absolute',
    backgroundColor: Color.white,
  },
  doctorProfileDetails: {
    height: 932,
    width: '100%',
    flex: 1,
    backgroundColor: Color.white,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  button: {
    top: 10,
    padding: 10,
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
  },
  parentWrapperFlexBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  frameWrapper5: {
    alignSelf: 'stretch',
  },
  videoConsultations: {
    textAlign: 'left',
    marginLeft: 8,
    fontFamily: FontFamily.poppinsSemiBold,
    fontWeight: '600',
    fontSize: FontSize.size_lg,
    color: Color.mainBlue,
  },
  availableDayAndLayout: {
    lineHeight: 24,
    textAlign: 'left',
  },
  rs1000Wrapper: {
    marginLeft: 50,

    justifyContent: 'center',
  },
  rs1000: {
    fontFamily: FontFamily.poppinsSemiBold,
    fontWeight: '600',
    color: Color.mainBlue,
  },
  monTypo: {
    fontSize: FontSize.size_base,
    textAlign: 'left',
    lineHeight: 24,
  },
  availabilityDays: {
    color: Color.inActiveFieldsColor,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
    marginLeft: 8,
    marginTop: 10,
    marginBottom: 5,
    padding: 3,
  },
  calendar52540281Icon: {
    overflow: 'hidden',
  },
  component2Parent: {
    marginTop: 10,
    alignSelf: 'stretch',
  },
  componentLayout: {
    height: 44,
    width: 44,
  },
  monWrapper: {
    right: '0%',
    left: '0%',
    paddingHorizontal: Padding.p_8xs,
    bottom: '0%',
    top: '0%',
    height: '100%',
    borderRadius: Border.br_xs,
    paddingVertical: Padding.p_3xs,
    position: 'absolute',
    width: '100%',
  },
  mon: {
    color: Color.inActiveFieldsColor,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
  },
  monTypo: {
    fontSize: FontSize.size_base,
    textAlign: 'left',
    lineHeight: 24,
  },
  component3: {
    marginLeft: 2,
  },
  mon1: {
    color: Color.blueStroke,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
  },
  frameParent9: {
    width: 172,
    marginTop: 14,
  },
  revHeading: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  vectorParent: {
    marginTop: 20,
  },
  frameParentFlexBox1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vectorIconLayout: {
    height: 20,
    width: 21,
  },
  vectorIcon1: {
    marginLeft: 10,
  },
  frameParent7: {
    height: 298,
    marginTop: 16,
    alignSelf: 'stretch',
  },
  frameParent10: {
    width: 127,
    marginLeft: 10,
  },
  johnSmithParent: {
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  johnSmith: {
    fontSize: FontSize.size_lg,
    color: Color.mainBlue,
    textAlign: 'left',
  },
  daysAgoTypo1: {
    lineHeight: 20,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
  },
  check160199581Icon1: {
    marginLeft: 6,
  },
  check160199581IconLayout: {
    width: 18,
    overflow: 'hidden',
    height: 18,
  },
  frameWrapper6: {
    backgroundColor: Color.mainGreen,
    paddingHorizontal: Padding.p_8xs,
    paddingVertical: Padding.p_10xs,
    borderRadius: Border.br_5xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  frameIconLayout: {
    height: 24,
    width: 24,
  },
  reviewsTypo: {
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
  },
  frameParent12: {
    marginTop: 12,
  },
  frameParent33: {
    alignSelf: 'stretch',
  },
  patientFeedback: {
    fontSize: FontSize.size_base,
    color: Color.mainBlue,
    textAlign: 'left',
    alignSelf: 'stretch',
  },
  loremIpsumDolor: {
    marginTop: 5,
    lineHeight: 24,
    fontFamily: FontFamily.poppinsRegular,
    fontSize: FontSize.size_sm,
  },
  daysAgoTypo: {
    fontSize: FontSize.size_sm,
    color: Color.inActiveFieldsColor,
    textAlign: 'left',
    alignSelf: 'stretch',
  },
  frameWrapperSpaceBlock: {
    marginTop: 10,
    alignSelf: 'stretch',
  },
  wrapperBorder: {
    borderColor: Color.mainGreen,
    backgroundColor: Color.colorMediumseagreen_100,
    borderRadius: Border.br_6xs,
    paddingVertical: Padding.p_8xs,
    paddingHorizontal: Padding.p_3xs,
    borderWidth: 1,
    borderStyle: 'solid',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  satisfied: {
    fontSize: FontSize.size_smi,
    color: Color.mainGreen,
    textAlign: 'left',
  },
  noWaitingTimeWrapper: {
    marginLeft: 5,
  },
  frameParent15: {
    marginTop: 5,
  },
  frameGroupFlexBox: {
    flexDirection: 'row',
    alignItems: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  services2: {
    color: Color.blue2,
    lineHeight: 24,
    fontSize: FontSize.size_xl,
    textAlign: 'left',
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
    marginTop: 130,
    fontSize: 22,
    fontWeight: '700',
  },
  frameParent4: {
    marginTop: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignSelf: 'stretch',
  },
  frameWrapperShadowBox: {
    borderColor: Color.blueStroke,
    shadowOpacity: 1,
    elevation: 15,
    shadowRadius: 15,
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowColor: 'rgba(39, 74, 138, 0.1)',
    flexWrap: 'wrap',
    width: 175,
    borderRadius: Border.br_5xs,
    padding: Padding.p_3xs,
    borderWidth: 1,
    borderStyle: 'solid',
    flexDirection: 'row',
    backgroundColor: Color.white,
  },
  calendarPlus76026102Parent: {
    justifyContent: 'center',
  },
  frameWrapper5FlexBox: {
    padding: Padding.p_8xs,
    borderRadius: Border.br_5xs,
    backgroundColor: Color.fieldsBackground,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  aestheticCrown: {
    marginLeft: 6,
  },
  frameIcon: {
    height: 24,
    width: 24,
  },
  bracesTypo: {
    lineHeight: 20,
    fontSize: FontSize.size_xs,
    textAlign: 'left',
    color: Color.mainBlue,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
  },
  frameParentService: {
    marginTop: 20,
    alignSelf: 'stretch',
  },
  reviewCard: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 10,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  reviewDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3E5BA6',
  },
  reviewDate: {
    fontSize: 12,
    color: '#A1A1A1',
    marginBottom: 5,
  },
  feedbackTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  feedbackText: {
    fontSize: 14,
    color: '#3E5BA6',
    marginVertical: 5,
  },
  feedbackTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#E1F7E7',
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
    marginTop: 5,
    fontSize: 12,
    color: '#6AC259',
  },
});

export default DoctorProfileDetails;