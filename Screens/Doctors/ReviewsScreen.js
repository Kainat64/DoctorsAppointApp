import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import { BaseUrl } from '../../utils/BaseApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getDoctorById, getHospitalById } from '../../utils/Api';
import { useNavigation } from '@react-navigation/native';
const ReviewScreen = ({ route }) => {
    const navigation = useNavigation();
    const { hospitalId } = route.params;
    console.log('doctor id ', hospitalId);
    console.log(hospitalId);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [hospital, setHospital] = useState([]);
    const renderStars = () => {
        let stars = [];
        for (let i = 1; i <= 5; i++) {
          stars.push(
            <TouchableOpacity key={i} onPress={() => setRating(i)}>
              <FontAwesome 
                name={i <= rating ? "star" : "star-o"} 
                size={32} 
                color={i <= rating ? "#f1c40f" : "#d3d3d3"} 
              />
            </TouchableOpacity>
          );
        }
        return stars;
      };
      useEffect(() => {
        if (route.params?.hospitalId) {
            loadDoctorProfile(route.params.hospitalId);
        }
    }, [route.params?.hospitalId]);

    const loadDoctorProfile = async (hospitalId) => {
        const response = await getHospitalById(hospitalId);
        setHospital(response.data);
        console.log('hospial data',response.data);
       
    };
    const handleAddReview = async () => {
      
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.post(`${BaseUrl}/reviews`, {
                hospital_id: hospitalId,
                rating: rating,
                comment,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            if (response && response.data) {
                Alert.alert('Success', 'Review added successfully');
                navigation.navigate('Home')
             
               
            } else {
                throw new Error('Unexpected response format');
            }
           
        } catch (error) {
            if (error.response && error.response.data) {
                console.error('Error response:', error.response.data);
                Alert.alert('Error', error.response.data.message || 'Failed to add review');
            } else {
                console.error('Error:', error.message);
                Alert.alert('Error', 'Failed to add review');
            }
        }
    };

    return (
        <View style={styles.container}>
     

     
      {doctors.map((doctor, index) => (
      <View key={index}>
     
      <Image 
        source={{ uri: 'https://via.placeholder.com/150' }} // Replace with the actual image source
        style={styles.profileImage}
      />
      <Text style={styles.name}>{hospital.hospital_name} <FontAwesome name="check-circle" size={16} color="green" /></Text>
      <Text style={styles.specialization}>{hospital.address}</Text>
     
      </View>
     ))}
      <View style={styles.starsContainer}>
        {renderStars()}
      </View>

      <TextInput
        style={styles.textInput}
        placeholder="Enter here"
        placeholderTextColor={'gray'}
        multiline
        value={comment}
        onChangeText={setComment}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleAddReview}>
        <Text style={styles.submitButtonText}>Submit Review</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Appointment Success')}>
        <Text style={styles.submitButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
      },
      backButton: {
        backgroundColor: 'red',
        borderRadius: 8,
        paddingVertical: 15,
        marginTop: 20,
      },
      title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
      },
      profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignSelf: 'center',
        marginBottom: 10,
      },
      name: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
      },
      specialization: {
        fontSize: 16,
        textAlign: 'center',
        color: '#7d7d7d',
      },
      qualification: {
        fontSize: 14,
        textAlign: 'center',
        color: '#a9a9a9',
        marginBottom: 20,
      },
      ratingText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
       
      },
      starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
      },
      textInput: {
         color:'black',
        borderColor: '#d3d3d3',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        height: 100,
        textAlignVertical: 'top',
      },
      submitButton: {
        backgroundColor: '#1c5caa',
        borderRadius: 8,
        paddingVertical: 15,
        marginTop: 20,
      },
      submitButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
      },
  });
export default ReviewScreen;
