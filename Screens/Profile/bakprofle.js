import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Platform, Image } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import { BaseUrl } from "../../utils/BaseApi";
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from '@react-native-picker/picker';
import { ScrollView } from "react-native-gesture-handler";

export default function ProfileScreen() {
  const [formData, setFormData] = useState({
    address: '',
    birthday: '',
    gender: '',
    bloodgroup_id: '',
    symptoms: [],
    diseases: [],
  });
  
  const [attachment, setAttachment] = useState(null);
  const [birthday, setBirthday] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [symptomInput, setSymptomInput] = useState('');
  const [diseaseInput, setDiseaseInput] = useState('');

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const pickAttachment = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
    });

    if (!result.didCancel && result.assets && result.assets.length > 0) {
      setAttachment(result.assets[0]);
    }
  };
  const handleAddSymptom = () => {
    if (symptomInput.trim()) {
      setFormData({ ...formData, symptoms: [...formData.symptoms, symptomInput.trim()] });
      setSymptomInput('');
    }
  };

  const handleAddDisease = () => {
    if (diseaseInput.trim()) {
      setFormData({ ...formData, diseases: [...formData.diseases, diseaseInput.trim()] });
      setDiseaseInput('');
    }
  };
  const handleSubmit = async () => {
    const form = new FormData();
    console.log('FormData being sent:', form);

    // Validate required fields
    if (!formData.address || !formData.birthday || !formData.gender || !formData.bloodgroup_id) {
      Alert.alert("Error", "All required fields must be filled.");
      return;
    }

    form.append('address', formData.address);
    form.append('birthday', birthday.toISOString().split('T')[0]);
    form.append('gender', formData.gender);
    form.append('bloodgroup_id', formData.bloodgroup_id);
    form.append('symptoms', JSON.stringify(formData.symptoms));
    form.append('diseases', JSON.stringify(formData.diseases));
   
    if (attachment) {
      form.append('attachment', {
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

      const response = await axios.put(`${BaseUrl}/update-patients`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',


         
        },
        body: formData,
      });

      Alert.alert('Success', response.data.message);
    } catch (error) {
      if (error.response) {
        console.error('Server Error:', error.response.data);
        Alert.alert('Error', `Failed to save: ${JSON.stringify(error.response.data.errors)}`);
      } else if (error.request) {
        console.error('No Response Received:', error.request);
        Alert.alert('Error', 'No response from the server.');
      } else {
        console.error('Request Error:', error.message);
        Alert.alert('Error', `Request failed: ${error.message}`);
      }
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setBirthday(selectedDate);
      handleInputChange('birthday', selectedDate.toISOString().split('T')[0]); // Save date in 'YYYY-MM-DD' format
    }
    setShowDatePicker(false); // Close date picker
  };

  return (
    <ScrollView>
      <View style={styles.container}>
      {/* Address Field */}
      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        value={formData.address}
        name="address"
        onChangeText={(text) => handleInputChange('address', text)}
        placeholder="Enter your address"
      />

      {/* Gender Picker */}
      <Text style={styles.label}>Gender</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.gender}
          name="gender"
          onValueChange={(itemValue) => handleInputChange('gender', itemValue)}
        >
          <Picker.Item label="Select Gender" value="" />
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
          <Picker.Item label="Other" value="other" />
        </Picker>
      </View>

      {/* Birthday Date Picker */}
      <Text style={styles.label}>Birthday</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
        <Text style={styles.dateText}>
          {formData.birthday || 'Select your birthday'}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={birthday}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {/* Blood Group ID Field */}
      <Text style={styles.label}>Blood Group ID</Text>
      <TextInput
        style={styles.input}
        value={formData.bloodgroup_id}
        keyboardType="numeric"
        onChangeText={(text) => handleInputChange('bloodgroup_id', text)}
        placeholder="Enter blood group ID"
      />
          {/* Symptoms */}
      <Text style={styles.label}>Symptoms</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, styles.flex]}
          value={symptomInput}
          placeholder="Add a symptom"
          onChangeText={setSymptomInput}
        />
        <Button title="Add" onPress={handleAddSymptom} />
      </View>
      {formData.symptoms.map((symptom, index) => (
        <Text key={index} style={styles.tag}>{symptom}</Text>
      ))}

      {/* Diseases */}
      <Text style={styles.label}>Diseases</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, styles.flex]}
          value={diseaseInput}
          placeholder="Add a disease"
          onChangeText={setDiseaseInput}
        />
        <Button title="Add" onPress={handleAddDisease} />
      </View>
      {formData.diseases.map((disease, index) => (
        <Text key={index} style={styles.tag}>{disease}</Text>
      ))}     
      {/* Attachment Picker */}
      <Button title="Pick Attachment" onPress={pickAttachment} />
      {attachment && attachment.type.startsWith('image/') && (
        <Image source={{ uri: attachment.uri }} style={styles.imagePreview} />
      )}

      {/* Submit Button */}
      <TouchableOpacity onPress={handleSubmit}>
        <Text style={styles.submit}>Update Profile</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
  },
  datePicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  dateText: {
    color: '#000',
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginTop: 10,
    marginBottom: 10,
  },
  submit: {
    color: '#fff',
    backgroundColor: 'blue',
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
  },
});
