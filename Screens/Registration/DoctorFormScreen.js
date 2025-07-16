import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { BaseUrl } from '../../utils/BaseApi';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import DocumentPicker from 'react-native-document-picker';
const { width } = Dimensions.get('window');

const DoctorForm = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    speciality: '',
    pmdc: '',
    message: '',
    gender: '',
    cv: 'null',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [documents, setDocuments] = useState([]);
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
 const handleSelectDocuments = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
      });
      setDocuments(result);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled document picker');
      } else {
        throw err;
      }
    }
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^[0-9]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async () => {
  if (!validateForm()) return;

  setIsLoading(true);
  try {
    const formDataToSend = new FormData();

    // Append regular fields
    formDataToSend.append('full_name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('city', formData.city);
    formDataToSend.append('speciality', formData.speciality);
    formDataToSend.append('gender', formData.gender);
    formDataToSend.append('pmdc', formData.pmdc);
    formDataToSend.append('message', formData.message);

    // Append single document (Laravel expects field name "documents")
    if (documents.length > 0) {
      const doc = documents[0]; // Laravel accepts one file only
      formDataToSend.append('documents', {
        uri: doc.uri,
        name: doc.name,
        type: doc.type,
      });
    }

    const token = await AsyncStorage.getItem('userToken');

    const response = await axios.post(
      `${BaseUrl}/save-doctor-query`,
      formDataToSend,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    Alert.alert(
      'Success',
      'Your information has been submitted successfully!',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      city: '',
      speciality: '',
      pmdc: '',
      message: '',
      gender: '',
    });
    setDocuments([]);
    setErrors({});
  } catch (error) {
    console.error('Submission error:', error);

    let errorMessage = 'Failed to submit. Please try again later.';

    if (error.response) {
      if (error.response.status === 422 && error.response.data.errors) {
        const serverErrors = error.response.data.errors;

        // Optional: show alert with combined errors
        const validationMessages = Object.values(serverErrors)
          .flat()
          .join('\n');

        Alert.alert('Validation Error', validationMessages);

        // Set specific field errors (optional if you show below fields)
        setErrors(serverErrors);
        return; // Stop here to avoid showing general error
      }
    }

    Alert.alert('Error', errorMessage);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <LinearGradient colors={['#f8f9fa', '#e9ecef']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
 >
              <Icon name="arrow-back" size={24} color="#007AFF" />
            </TouchableOpacity>
            <Animatable.View animation="fadeInDown" duration={800}>
              <Text style={styles.title}>Doctor Registration</Text>
              <Text style={styles.subtitle}>
                Join our network of healthcare professionals
              </Text>
            </Animatable.View>
          </View>

          <Animatable.View 
            animation="fadeInUp" 
            duration={800} 
            delay={300}
            style={styles.formContainer}
>
            {/* Personal Information Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal Information</Text> 
              <View style={styles.inputContainer}>
                <Icon name="person-outline" size={20} color="#6c757d" style={styles.inputIcon} />
                <TextInput
                  placeholder="Full Name *"
                  placeholderTextColor="#adb5bd"
                  value={formData.name}
                  onChangeText={(text) => handleChange('name', text)}
                  style={styles.input}
                />
              </View>
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              <View style={styles.inputContainer}>
                <Icon name="mail-outline" size={20} color="#6c757d" style={styles.inputIcon} />
                <TextInput
                  placeholder="Email *"
                  placeholderTextColor="#adb5bd"
                  value={formData.email}
                  onChangeText={(text) => handleChange('email', text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              <View style={styles.inputContainer}>
                <Icon name="call-outline" size={20} color="#6c757d" style={styles.inputIcon} />
                <TextInput
                  placeholder="Phone Number *"
                  placeholderTextColor="#adb5bd"
                  value={formData.phone}
                  onChangeText={(text) => handleChange('phone', text)}
                  keyboardType="phone-pad"
                  style={styles.input}
                />
              </View>
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

              <View style={styles.inputContainer}>
                <Icon name="location-outline" size={20} color="#6c757d" style={styles.inputIcon} />
                <TextInput
                  placeholder="City *"
                  placeholderTextColor="#adb5bd"
                  value={formData.city}
                  onChangeText={(text) => handleChange('city', text)}
                  style={styles.input}
                />
              </View>
              {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}

              <Text style={styles.label}>Gender *</Text>
              <View style={styles.radioContainer}>
                {['Male', 'Female'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.radioButton,
                      formData.gender === option && styles.radioButtonSelected,
                    ]}
                    onPress={() => handleChange('gender', option)}
                  >
                    <Icon 
                      name={option === 'Male' ? 'male-outline' : 'female-outline'} 
                      size={18} 
                      color={formData.gender === option ? '#fff' : '#007AFF'} 
                    />
                    <Text style={formData.gender === option ? styles.radioTextSelected : styles.radioText}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
            </View>

            {/* Professional Information Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Professional Information</Text>
              
              <View style={styles.inputContainer}>
                <Icon name="medkit-outline" size={20} color="#6c757d" style={styles.inputIcon} />
                <TextInput
                  placeholder="Specialty"
                  placeholderTextColor="#adb5bd"
                  value={formData.speciality}
                  onChangeText={(text) => handleChange('speciality', text)}
                  style={styles.input}
                />
              </View>

              <View style={styles.inputContainer}>
                <Icon name="document-text-outline" size={20} color="#6c757d" style={styles.inputIcon} />
                <TextInput
                  placeholder="IMC Registration Number"
                  placeholderTextColor="#adb5bd"
                  value={formData.pmdc}
                  onChangeText={(text) => handleChange('pmdc', text)}
                  style={styles.input}
                />
              </View>
            </View>
  <TouchableOpacity style={styles.addButton} onPress={handleSelectDocuments}>
        <MaterialIcons name="attach-file" size={20} color="#34C759" style={styles.buttonIcon} />
        <Text style={styles.addButtonText}>Attach CV</Text>
      </TouchableOpacity>
      {documents.length > 0 && (
        <Text style={{ marginTop: 8, marginLeft: 10, color: '#495057', fontSize: 15, marginBottom: 20 }}>
          Selected File: {documents[0]?.name}
        </Text>
      )}

            {/* Additional Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Information</Text>
              <View style={styles.inputContainer}>
               
                <TextInput
                  placeholder="Your Message"
                  placeholderTextColor="#adb5bd"
                  value={formData.message}
                  onChangeText={(text) => handleChange('message', text)}
                  multiline
                  numberOfLines={4}
                  style={[styles.input, styles.textArea]}
                />
              </View>
            </View>

            <TouchableOpacity 
              onPress={handleSubmit} 
              style={styles.submitButton}
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#007AFF', '#00A1FF']}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Icon name="send-outline" size={20} color="#fff" />
                    <Text style={styles.submitButtonText}>Submit Application</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animatable.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 25,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#343a40',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6c757d',
    marginTop: 5,
    marginBottom: 20,
  },
  formContainer: {
    paddingHorizontal: 25,
  },
  section: {
    marginBottom: 25,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  inputIcon: {
    position: 'absolute',
    left: 15,
    zIndex: 1,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    paddingHorizontal: 45,
    fontSize: 16,
    color: '#495057',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  label: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 10,
    fontWeight: '500',
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 10,
    width: '48%',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  radioText: {
    marginLeft: 8,
    color: '#495057',
    fontSize: 16,
  },
  radioTextSelected: {
    marginLeft: 8,
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 20,
  },
  gradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 14,
    marginTop: -10,
    marginBottom: 15,
    marginLeft: 5,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4', // light green background
    borderColor: '#34C759',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
   
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom:20
  },
  buttonIcon: {
    marginRight: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34C759',
  },
});

export default DoctorForm;