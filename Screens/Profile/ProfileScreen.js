/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Platform,
  Image,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import {BaseUrl} from '../../utils/BaseApi';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import moment from 'moment';

export default function ProfileScreen({navigation}) {
  const [patient, setPatient] = useState({});
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [bloodGroups, setBloodGroups] = useState([]);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState(null);
  const [attachment, setAttachment] = useState(null);
  const [birthday, setBirthday] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [symptoms, setSymptoms] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [symptomInput, setSymptomInput] = useState('');
  const [diseaseInput, setDiseaseInput] = useState('');
const [phone, setPhone] = useState('');
  useEffect(() => {
    //fetchBloodGroups();
    getPatientProfile();
  }, []);

  useEffect(() => {
    if (patient) {
      setEmail(patient.user?.email || '');
    setPhone(patient.phone || ''); 
      setAddress(patient.address || '');
      setGender(patient.gender || '');
   
      setSelectedBloodGroup(patient.bloodgroup_id || '');
      setBirthday(new Date(patient.birthday || Date.now()));
      setSymptoms(patient.symptoms || []);
      setDiseases(patient.diseases || []);
    }
  }, [patient]);

 

  const getPatientProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'User token is missing. Please log in again.');
        return;
      }

      const response = await axios.get(`${BaseUrl}/get-patient-profile`, {
        headers: {Authorization: `Bearer ${token}`},
      });

      const {patient, bloodGroups} = response.data;

      setPatient(patient);
      setBloodGroups(bloodGroups || []);

      // Set the selected blood group if patient has one
      if (patient.bloodgroup_id) {
        setSelectedBloodGroup(patient.bloodgroup_id.toString());
      }

      console.log('Profile data:', response.data);
    } catch (error) {
      console.error('Error fetching patient profile:', error.message);
      Alert.alert('Error', 'Failed to fetch patient profile.');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setBirthday(selectedDate);
    }
    setShowDatePicker(false);
  };

  const handleAddSymptom = () => {
    if (symptomInput.trim()) {
      setSymptoms([...symptoms, symptomInput.trim()]);
      setSymptomInput('');
    }
  };

  const handleAddDisease = () => {
    if (diseaseInput.trim()) {
      setDiseases([...diseases, diseaseInput.trim()]);
      setDiseaseInput('');
    }
  };

  const pickAttachment = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
    });

    if (!result.didCancel && result.assets && result.assets.length > 0) {
      setAttachment(result.assets[0]);
    }
  };
  const capturePhoto = async () => {
    const result = await ImagePicker.launchCamera({
      mediaType: 'photo',
      cameraType: 'back',
    });
  
    if (!result.didCancel && result.assets && result.assets.length > 0) {
      setAttachment(result.assets[0]);
    }
  };
  

  const handleSubmit = async () => {
    const formData = new FormData();
     formData.append('email', email);
     formData.append('phone', phone);
    formData.append('address', address);
    formData.append('gender', gender);
    formData.append('birthday', birthday.toISOString().split('T')[0]);
    // formData.append('bloodgroup_id', selectedBloodGroup);
    // formData.append('married', married);
    symptoms.forEach((symptom, index) => {
      formData.append(`symptoms[${index}]`, symptom);
    });
    diseases.forEach((disease, index) => {
      formData.append(`diseases[${index}]`, disease);
    });
    if (attachment) {
      formData.append('attachment', {
        uri: attachment.uri,
        name: attachment.fileName,
        type: attachment.type,
      });
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'User token is missing. Please log in again.');
        return;
      }

      const response = await axios.post(
        `${BaseUrl}/update-patients`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'content-type': 'multipart/form-data',
          },
        },
      );

      Alert.alert('Success', response.data.message);
      navigation.navigate('Home', { refresh: Date.now() });

    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to save profile.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1, backgroundColor: '#f8f9fa'}}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={pickAttachment}
            style={styles.avatarContainer}>
            {attachment ? (
              <Image
                source={{ uri: attachment.uri }}
                style={styles.avatar}
              />
            ) : patient?.user?.image_url && patient.user.image_url.trim() !== '' ? (
              <Image
                source={{ uri: patient.user.image_url }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarIcon}>👤</Text>
              </View>
            )}
            {console.log('patient image :', patient?.user?.image_url)}
            <View style={styles.cameraOptions}>
                <TouchableOpacity 
                  style={[styles.cameraOption, styles.cameraOptionLeft]}
                  onPress={pickAttachment}>
                  <Text style={styles.cameraOptionText}>📁</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.cameraOption, styles.cameraOptionRight]}
                  onPress={capturePhoto}>
                  <Text style={styles.cameraOptionText}>📷</Text>
                </TouchableOpacity>
              </View>
          </TouchableOpacity>

          <Text style={styles.userName}>
            {patient.first_name} {patient.last_name}
          </Text>
          <Text style={styles.userEmail}>{email}</Text>
        </View>

        {/* Main Form Container */}
        <View style={styles.formContainer}>
          {/* Personal Information Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>👤</Text>
              <Text style={styles.sectionTitle}>Personal Information</Text>
            </View>
 {/* Email Input */}
<View style={styles.inputContainer}>
  <Text style={styles.inputIcon}>📧</Text>
  <TextInput
    style={styles.input}
    value={patient?.user?.email}
    onChangeText={setEmail}  // Fixed from setAddress to setEmail
    placeholder="Email"
    placeholderTextColor="#999"
    keyboardType="email-address"
  />
</View>

{/* Phone Number Input */}
<View style={styles.inputContainer}>
  <Text style={styles.inputIcon}>📱</Text>
  <TextInput
    style={styles.input}
    value={phone}
    onChangeText={setPhone}
    placeholder="Phone number"
    placeholderTextColor="#999"
    keyboardType="phone-pad"
  />
</View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>📍</Text>
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="Your address"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>⚧</Text>
              <View style={styles.picker}>
                <Picker
                  selectedValue={gender}
                  onValueChange={setGender}
                  dropdownIconColor="#666"
                  style={styles.pickerText}>
                  <Picker.Item label="Select Gender" value="" />
                  <Picker.Item label="Male" value="male" />
                  <Picker.Item label="Female" value="female" />
                  <Picker.Item label="Other" value="other" />
                </Picker>
              </View>
            </View>

            {/* <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>💍</Text>
              <View style={styles.picker}>
                <Picker
                  selectedValue={married}
                  onValueChange={setMarried}
                  dropdownIconColor="#666"
                  style={styles.pickerText}>
                  <Picker.Item label="Marital Status" value="" />
                  <Picker.Item label="Married" value="Married" />
                  <Picker.Item label="Unmarried" value="Un-Married" />
                </Picker>
              </View>
            </View> */}

            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>🎂</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.dateInput}>
                <Text style={styles.dateText}>
                  {moment(birthday).format('MMMM D, YYYY')}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={birthday}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>
{/* 
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>🩸</Text>
              <View style={styles.picker}>
                <Picker
                  selectedValue={selectedBloodGroup}
                  onValueChange={itemValue => setSelectedBloodGroup(itemValue)}
                  dropdownIconColor="#666"
                  style={styles.pickerText}>
                  <Picker.Item label="Select Blood Group" value="" />
                  {bloodGroups.map(group => (
                    <Picker.Item
                      key={group.id}
                      label={group.blood_group}
                      value={group.id.toString()}
                    />
                  ))}
                </Picker>
              </View>
            </View> */}
          </View>

          {/* Health Information Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🏥</Text>
              <Text style={styles.sectionTitle}>Health Information</Text>
            </View>

            <View style={styles.tagInputContainer}>
              <View style={styles.tagInputWrapper}>
                <TextInput
                  style={styles.tagInput}
                  value={symptomInput}
                  placeholder="Add symptoms"
                  placeholderTextColor="#999"
                  onChangeText={setSymptomInput}
                />
                <TouchableOpacity
                  style={styles.addTagButton}
                  onPress={handleAddSymptom}
                  disabled={!symptomInput.trim()}>
                  <Text style={styles.addTagButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.tagsContainer}>
                {symptoms.map((symptom, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{symptom}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setSymptoms(symptoms.filter((_, i) => i !== index));
                      }}>
                      <Text style={styles.tagRemove}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.tagInputContainer}>
              <View style={styles.tagInputWrapper}>
                <TextInput
                  style={styles.tagInput}
                  value={diseaseInput}
                  placeholder="Add medical conditions"
                  placeholderTextColor="#999"
                  onChangeText={setDiseaseInput}
                />
                <TouchableOpacity
                  style={styles.addTagButton}
                  onPress={handleAddDisease}
                  disabled={!diseaseInput.trim()}>
                  <Text style={styles.addTagButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.tagsContainer}>
                {diseases.map((disease, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{disease}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setDiseases(diseases.filter((_, i) => i !== index));
                      }}>
                      <Text style={styles.tagRemove}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Update Button */}
          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleSubmit}
            activeOpacity={0.8}>
            <Text style={styles.updateButtonText}>Update Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#274A8A',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarIcon: {
    fontSize: 40,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#0D7C66',
    borderRadius: 15,
    padding: 5,
    borderWidth: 2,
    borderColor: '#fff',
  },
  cameraIconText: {
    fontSize: 16,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0D7C66',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  inputIcon: {
    marginRight: 10,
    fontSize: 20,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#333',
    fontSize: 16,
  },
  picker: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
  },
  pickerText: {
    color: '#333',
    fontSize: 16,
  },
  dateInput: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
  },
  dateText: {
    color: '#333',
    fontSize: 16,
  },
  tagInputContainer: {
    marginBottom: 15,
  },
  tagInputWrapper: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  tagInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    color: '#333',
    fontSize: 16,
  },
  addTagButton: {
    width: 50,
    backgroundColor: '#274A8A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTagButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#274A8A',
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#fff',
    fontSize: 14,
    marginRight: 6,
  },
  tagRemove: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  updateButton: {
    backgroundColor: '#274A8A',
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 10,
    shadowColor: '#0D7C66',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  cameraOptions: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    flexDirection: 'row',
  },
  cameraOption: {
    backgroundColor: '#0D7C66',
    borderRadius: 15,
    padding: 5,
    borderWidth: 2,
    borderColor: '#fff',
  },
  cameraOptionLeft: {
    marginRight: 5,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  cameraOptionRight: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  cameraOptionText: {
    fontSize: 14,
  },
});
