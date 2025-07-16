import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
const Tab = createMaterialTopTabNavigator();
import {BaseUrl} from '../../utils/BaseApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {GetAppointmentsDetails} from '../../utils/Api';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MedicalRecordScreen from '../Prescriptions/MedicalRecordScreen';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import ChatScreen from '../Chat/ChatScreen';
const MyAppointment = () => {
  const navigation = useNavigation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`${BaseUrl}/appointment-detail`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAppointments(response.data.appointments);
        //console.log(response.data.appointments);
        setLoading(false);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch appointments');
        setLoading(false);
      }
    };
  const handleDocumentUpload = async appointmentId => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      const formData = new FormData();
      formData.append('document', {
        uri: res.uri,
        type: res.type,
        name: res.name,
      });
      console.log(formData);
      const response = await axios.post(
        `${BaseUrl}/appointments/${appointmentId}/documents`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      Alert.alert('Success', 'Document uploaded successfully');
      // Optionally, update the state to refresh the appointment list
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('Cancelled', 'Document upload cancelled');
      } else {
        Alert.alert('Error', `Failed to upload document: ${err.message}`);
      }
    }
  };
  const AppointmentDetail = () => {
    return (
      <ScrollView vectorContainer>
        <View style={styles.container}>
          {appointments.map((item, index) => (
            <View key={index} style={styles.appointmentContainer}>
              <View style={styles.profileContainer}>
                {/* User Profile Image */}
                <Image
                  source={require('../../assets/group-209.png')}
                  style={styles.profileImage}
                />
                {/* User Name and Info */}
                <View style={styles.profileTextContainer}>
                  <Text style={styles.doctorName}>
                    Dr.{item.doctor?.first_name || 'NA'}{' '}
                    {item.doctor?.last_name || 'NA'}
                  </Text>
                  <Text style={styles.hospitalName}>
                    {item.doctor?.hospital?.hospital_name || 'NA'}
                  </Text>
                  <Text style={styles.hospitalAddress}>
                    {item.doctor?.hospital?.address || 'NA'}
                  </Text>
                </View>
              </View>

              <View style={styles.detailsContainer}>
                {/* Appointment Date with Icon */}
                <View style={styles.row}>
                  <Icon
                    name="calendar"
                    size={20}
                    color="#333"
                    style={styles.icon}
                  />
                  <Text style={styles.text}>{item.date}</Text>
                </View>
                {/* time */}
                <View style={styles.row}>
                  <FontAwesome
                    name="clock-o"
                    size={20}
                    color="green"
                    style={styles.icon}
                  />
                  <Text style={styles.text}>
                    {moment(item.time, 'HH:mm').format('HH:mm a')}
                  </Text>
                </View>
                {/* get user details */}
                <View style={styles.row}>
                  <FontAwesome
                    name="user"
                    size={20}
                    color="#333"
                    style={styles.icon}
                  />
                  <Text style={styles.text}>{item.user?.name || 'NA'}</Text>
                </View>

                {/* Remaining Days with Icon */}
                <View style={styles.row}>
                  <FontAwesome
                    name="clock-o"
                    size={20}
                    color="red"
                    style={styles.icon}
                  />
                  <Text style={styles.remainingDays}>
                    {item.remaining_days > 0
                      ? `${item.remaining_days} days remaining`
                      : item.remaining_days === 0
                      ? 'Today'
                      : `${Math.abs(item.remaining_days)} days overdue`}
                  </Text>
                </View>
                <Button
                  title="Upload Document"
                  onPress={() => handleDocumentUpload(item.id)}
                />
                <View style={styles.actionsContainer}>
                  <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Appointment Details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                      navigation.navigate('MedicalRecord', {
                        AppointmentIdid: item.id,
                      })
                    }>
                    <Text style={styles.buttonReportText}>Attach Reports</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };
  const AppointmentList = () => {
    return (
      <View style={styles.container}>
        <FlatList
          data={appointments}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <View style={styles.appointmentContainer}>
              <View style={styles.profileContainer}>
                {/* User Profile Image */}
                <Image
                  source={require('../../assets/group-209.png')}
                  style={styles.profileImage}
                />
                {/* User Name and Info */}
                <View style={styles.profileTextContainer}>
                  <Text style={styles.doctorName}>
                    Dr.{item.doctor?.first_name || 'NA'}{' '}
                    {item.doctor?.last_name || 'NA'}
                  </Text>
                  <Text style={styles.hospitalName}>
                    {item.doctor?.hospital?.hospital_name || 'NA'}
                  </Text>
                  <Text style={styles.hospitalAddress}>
                    {item.doctor?.hospital?.address || 'NA'}
                  </Text>
                </View>
              </View>

              <View style={styles.detailsContainer}>
                {/* Appointment Date with Icon */}
                <View style={styles.row}>
                  <Icon
                    name="calendar"
                    size={20}
                    color="#333"
                    style={styles.icon}
                  />
                  <Text style={styles.text}>{item.date}</Text>
                </View>
                {/* time */}
                <View style={styles.row}>
                  <FontAwesome
                    name="clock-o"
                    size={20}
                    color="green"
                    style={styles.icon}
                  />
                  <Text style={styles.text}>
                    {moment(item.time, 'HH:mm').format('HH:mm a')}
                  </Text>
                </View>
                {/* get user details */}
                <View style={styles.row}>
                  <FontAwesome
                    name="user"
                    size={20}
                    color="#333"
                    style={styles.icon}
                  />
                  <Text style={styles.text}>{item.user?.name || 'NA'}</Text>
                </View>

                {/* Remaining Days with Icon */}
                <View style={styles.row}>
                  <FontAwesome
                    name="clock-o"
                    size={20}
                    color="red"
                    style={styles.icon}
                  />
                  <Text style={styles.remainingDays}>
                    {item.remaining_days > 0
                      ? `${item.remaining_days} days remaining`
                      : item.remaining_days === 0
                      ? 'Today'
                      : `${Math.abs(item.remaining_days)} days overdue`}
                  </Text>
                </View>
                <View style={styles.actionsContainer}>
                  <TouchableOpacity
                    style={styles.buttonChat}
                    onPress={() => navigation.navigate('Chat')}>
                    <Text style={[styles.buttonText, styles.textWhite]}>
                      Chat
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonReview}>
                    <Text style={[styles.textWhite]}>Review</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      </View>
    );
  };
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator>
        <Tab.Screen name="Appointment Detail" component={AppointmentDetail} />
        <Tab.Screen name="Past" component={AppointmentList} />
        <Tab.Screen
          name="Attachment"
          component={MedicalRecordScreen}
          options={{
            tabBarStyle: {display: 'none'},
          }}
        />
        <Tab.Screen
          name="Chat"
          component={props => <ChatScreen {...props} />}
          options={{
            tabBarStyle: {display: 'none'},
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  button: {
    marginLeft: 16,
  },
  buttonReportText: {
    fontWeight: 'bold',
    color: 'green',
  },
  buttonText: {
    color: '#555',
    fontWeight: 'bold',
  },
  buttonChat: {
    marginLeft: 16,
    width: 150,
    backgroundColor: '#2F5FB3',
    height: 40,
    borderRadius: 5,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonReview: {
    marginLeft: 16,
    width: 150,
    backgroundColor: '#0D7C66',
    height: 40,
    borderRadius: 5,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWhite: {
    color: '#fff',
  },

  appointmentContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
    border: 2,
    borderColor: 'blue',
  },
  profileTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  hospitalName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  hospitalAddress: {
    fontSize: 14,
    color: '#666',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  detailsContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginRight: 10,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333',
  },
  appointmentTime: {
    fontSize: 16,
    color: '#666',
  },
  status: {
    fontSize: 14,
    color: '#888',
  },
  remainingDays: {
    fontSize: 14,
    color: '#ff0000',
    fontWeight: 'bold',
  },
});

export default MyAppointment;
