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
  Button,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {FontFamily, Color, Padding, Border, FontSize} from '../../GlobalStyles';

import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-date-picker';
import {getDoctorById} from '../../utils/Api';
import {bookAppointment} from '../../utils/Api';
import moment from 'moment';
import axios from 'axios';
import {BaseUrl} from '../../utils/BaseApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function BookAppointment({route}) {
  const navigation = useNavigation();
  const {doctorId} = route.params;
  const [name, setName] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [date, setDate] = useState(new Date());
  const [mobile, setMobile] = useState('');
  const [time, setTime] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [error, setError] = useState(null);
  // const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const handleTimeSlotPress = timeSlot => {
    setSelectedTimeSlot(timeSlot);
  };
  useEffect(() => {
    if (route.params?.doctorId) {
      loadDoctorProfile(route.params.doctorId);
    }
  }, [route.params?.doctorId]);

  const loadDoctorProfile = async doctorId => {
    const response = await getDoctorById(doctorId);
    setDoctors(response.data);
  };

  const fetchTimeSlots = async selectedDate => {
    console.log('fetching date...');

    try {
      const formattedDate = selectedDate.toISOString().split('T')[0]; // Format to YYYY-MM-DD
      console.log(formattedDate);

      // Fetch the doctor's day-off schedule
      const dayOffResponse = await fetch(`${BaseUrl}/day-off/${doctorId}`);
      const dayOffs = await dayOffResponse.json();

      // Check if the selected date is a day-off
      const isDayOff = dayOffs.some(dayOff => dayOff.date === formattedDate);
      if (isDayOff) {
        setSlots([]); // Clear any existing slots
        // If it's a day-off, show a warning and exit the function
        Alert.alert('Doctor is not available on this day due to a day-off.');
        return; // Exit if day-off
      }

      // If it's not a day-off, proceed to fetch time slots
      const response = await fetch(
        `${BaseUrl}/available-slots/${doctorId}/${formattedDate}`,
      );
      if (!response.ok) {
        throw new Error('Failed to fetch doctor time slots.');
      }

      const data = await response.json();
      const formattedSlots = data.map(slot =>
        moment(slot, 'HH:mm').format('hh:mm A'),
      );
      setSlots(formattedSlots); // Update slots state
    } catch (error) {
      setError(error.message); // Set error message
      setSlots([]); // Clear any existing slots on error
      Alert.alert('Error fetching time slots:');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    if (doctorId && date) {
      fetchTimeSlots(date);
    }
  }, [doctorId, date]);

  const onChange = selectedDate => {
    console.log('selected date: ', selectedDate);
    const currentDate = selectedDate || date;
    console.log('current date', currentDate);
    setDate(currentDate);
    fetchTimeSlots(currentDate);
  };

  const handleSubmit = async () => {
    const data = {date: '2024-08-24', time: selectedTimeSlot};

    await bookAppointment(data);

    Alert.alert('Saved');
  };

  const bookAppointment = async () => {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    const timeSlot24Hour = moment(selectedTimeSlot, 'hh:mm A').format(
      'HH:mm:ss',
    );
    try {
      const token = await AsyncStorage.getItem('userToken'); // Retrieve this token from your authentication flow
      await axios.post(
        `${BaseUrl}/book-appointments`,
        {
          name: name,
          mobile: mobile,
          date: moment(date).format('YYYY-MM-DD'),
          time: timeSlot24Hour,
          doctor_id: doctorId,
          types: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      Alert.alert('Appointment booked successfully');
      fetchTimeSlots(date);
      setName('');
      setMobile('');
      navigation.navigate('Appointment Success');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
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
                      source={require('../../assets/group-209.png')}
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
                <View
                  style={[
                    styles.frameParent1,
                    styles.wrapperPosition,
                    styles.row,
                  ]}>
                  <View style={styles.boxFrame}>
                    <View style={styles.parent}>
                      <Text style={[styles.text, styles.textTypo]}>1</Text>
                      <Text style={[styles.waitTime, styles.waitTimeTypo]}>
                        Verified Doctor
                      </Text>
                    </View>
                  </View>
                  <View style={styles.boxFrame}>
                    <View style={styles.parent}>
                      <Text style={[styles.text, styles.textTypo]}>2</Text>
                      <Text style={[styles.waitTime, styles.waitTimeTypo]}>
                        Online Prescriptions
                      </Text>
                    </View>
                  </View>
                  <View style={styles.boxFrame}>
                    <View style={styles.parent}>
                      <Text style={[styles.text, styles.textTypo]}>3</Text>
                      <Text style={[styles.experience, styles.waitTimeTypo]}>
                        Free Chat With Doctor
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={[
                    styles.appointmentDateWrapper,
                    styles.wrapperPosition,
                  ]}>
                  <Text
                    style={[
                      styles.appointmentDate,
                      styles.appointmentDateTypo,
                    ]}>
                    Select Date:{' '}
                  </Text>
                </View>

                <View style={styles.formDateMargin}>
                  <DatePicker
                    style={styles.inputDatePicker}
                    date={date}
                    mode="date"
                    placeholder="Select Date"
                    format="YYYY-MM-DD"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    minDate="2020-01-01"
                    maxDate="2025-12-31"
                    onDateChange={onChange}
                  />
                </View>

                <View>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Your Name"
                    onChangeText={setName}
                    name="name"
                  />
                </View>
                <View>
                  <TextInput
                    style={styles.input}
                    keyboardType={'phone-pad'}
                    placeholder="030112345678"
                    onChangeText={setMobile}
                    name="mobile"
                  />
                </View>
                <View>
                  <Text style={{fontSize: 18, fontWeight: '500'}}>
                    Available Time Slots:
                  </Text>
                </View>
                <View style={styles.row}>
                  <View style={styles.frameParent4}>
                    {slots.map((slot, index) => (
                      <View key={index} style={styles.frameWrapperShadowBox}>
                        <View
                          style={[
                            styles.calendarPlus76026102Parent,
                            styles.frameGroupFlexBox,
                          ]}>
                          <TouchableOpacity
                            key={index}
                            style={[
                              styles.timeSlotButton,
                              selectedTimeSlot === slot &&
                                styles.selectedTimeSlotButton,
                            ]}
                            onPress={() => handleTimeSlotPress(slot)}>
                            <Image
                              style={styles.groupIcon1}
                              resizeMode="cover"
                              source={require('../../assets/timeslot.png')}
                            />
                            <Text
                              style={[
                                styles.timeSlotText,
                                selectedTimeSlot === slot &&
                                  styles.selectedTimeSlotText,
                              ]}>
                              {slot}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={styles.row}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={bookAppointment}
                    disabled={!selectedTimeSlot}>
                    <Text style={styles.buttonText}>Book Appointment</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </>
  );
}
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
  appointmentDateTypo: {
    fontSize: 18,
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
  },
  drLaura1: {
    lineHeight: 26,
    color: Color.blue1,
    textAlign: 'center',
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
    padding: 0,
    top: 5,
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
    padding: 3,
    height: 'auto',
    borderRadius: Border.br_3xs,
    shadowOpacity: 1,
    elevation: 15,
    shadowRadius: 15,
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowColor: 'rgba(39, 74, 138, 0.1)',
    width: 115,
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
  appointmentDate: {
    color: Color.blue2,
    textAlign: 'left',
    lineHeight: 24,
    fontWeight: '800',
  },
  appointmentDateWrapper: {
    top: 250,
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
    padding: 10,
    backgroundColor: '#274A8A',
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 10,
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
  formDate: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  formDateMargin: {
    marginTop: 250,
  },
  formType: {
    fontSize: 16,
    fontWeight: '600',
  },
  formDatePicker: {
    marginTop: 320,
  },
  btnSlot: {
    padding: 10,
    height: 40,
    width: 200,
    backgroundColor: 'blue',
  },
  Slotrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  timeSlotButton: {
    width: 110,
    height: 50,
    padding: 10,
    margin: 5,
    backgroundColor: '#274A8A',
    borderRadius: 5,
    flexWrap: 'wrap',
    marginHorizontal: 2,
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
  },
  timeSlotText: {
    fontSize: 16,
    color: '#fff', // Default text color
    marginRight: 10,
  },
  selectedTimeSlotButton: {
    backgroundColor: '#379956',
    color: 'white',
  },
  selectedTimeSlotText: {
    color: '#fff', // Text color when selected
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 10,
    margin: 20,
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
  frameParent4: {
    marginTop: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignSelf: 'stretch',
  },
  frameWrapperShadowBox: {},
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
  input: {
    borderColor: 'skyblue',
    borderWidth: 2,
    margin: 5,
    padding: 10,
    fontSize: 18,
    fontWeight: '500',
    borderRadius: 10,
    height: 45,
  },
  inputDatePicker: {
    borderColor: 'skyblue',
    borderWidth: 1,
    margin: 15,
    padding: 3,
    fontSize: 18,
    fontWeight: '500',
  },
  groupIcon1: {
    width: 16,
    height: 16,
    Color: 'white',
  },

  boxFrame: {
    width: 110,
    height: 90,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    shadowOpacity: 1,
    elevation: 15,
    shadowRadius: 15,
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowColor: 'rgba(39, 74, 138, 0.1)',
    borderColor: 'blue',
    borderWidth: 1,
    borderStyle: 'solid',
    marginLeft: 5,
  },
});
