import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { BaseUrl } from '../../utils/BaseApi';
import AsyncStorage from '@react-native-async-storage/async-storage';


const ReviewScreen = ({ route }) => {
    const { doctorId } = route.params;
    console.log(doctorId);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const handleAddReview = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.post(`${BaseUrl}/reviews`, {
                doctor_id: doctorId,
                rating: rating,
                comment,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            if (response && response.data) {
                Alert.alert('Success', 'Review added successfully');
               
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
            <View style={styles.header}></View>
            <Text>Write a review</Text>
            <TextInput
                value={String(rating)}
                onChangeText={text => setRating(Number(text))}
                keyboardType="numeric"
                maxLength={1}
                style={{ borderBottomWidth: 1, marginBottom: 20 }}
            />
            <Text>Comment:</Text>
            <TextInput
                value={comment}
                onChangeText={setComment}
                placeholder="Write a review..."
                multiline
                style={{ borderWidth: 1, padding: 10, height: 100 }}
            />
            <Button title="Submit Review" onPress={handleAddReview} />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingTop: 10,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    row:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex:1,
    },
    backButton: {
      marginRight: 10,
    },
    backText: {
      fontSize: 24,
      color: '#007AFF',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    tabs: {
      flexDirection: 'row',
      marginBottom: 30,
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: '#007AFF',
      paddingHorizontal: 15,
      paddingVertical: 5,
    },
    inactiveTab: {
      paddingHorizontal: 15,
      paddingVertical: 5,
    },
    activeTabText: {
      fontSize: 16,
      color: '#333',
    },
    inactiveTabText: {
      fontSize: 16,
      color: '#aaa',
    },
    content: {
      alignItems: 'center',
      marginBottom: 30,
    },
    folderImage: {
      width: 100,
      height: 100,
      marginBottom: 20,
    },
    mainText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 10,
    },
    subText: {
      fontSize: 14,
      color: '#666',
      marginBottom: 10,
    },
    linkText: {
      fontSize: 14,
      color: '#34C759',
      marginBottom: 5,
    },
    addButton: {
      backgroundColor: '#E5F8E8',
      borderWidth: 1,
      borderColor: '#34C759',
      paddingVertical: 10,
      paddingHorizontal: 40,
      borderRadius: 25,
    },
    addCameraButton: {
      backgroundColor: '#E5F8E8',
      borderWidth: 1,
      borderColor: '#34C759',
      paddingVertical: 10,
      paddingHorizontal: 40,
      borderRadius: 25,
      marginTop: 10,
    },
    uploadButton: {
      backgroundColor: '#274A8A',
      borderWidth: 2,
      borderColor: '#34C759',
      paddingVertical: 10,
      paddingHorizontal: 40,
      borderRadius: 25,
      marginTop: 10,
    },
    addButtonText: {
      fontSize: 16,
      color: '#34C759',
    },
  });
export default ReviewScreen;
