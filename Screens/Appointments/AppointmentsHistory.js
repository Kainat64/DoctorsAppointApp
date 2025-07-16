import React from "react";
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import moment from "moment";
import Icon from 'react-native-vector-icons/Ionicons';
  export default function AppointmentsHistory(){
    const appointments = [
        {
            id: '1',
            doctorName: 'Dr. Aine Murphy',
            hospital: 'Aadele Hospital',
            time: '06:00 PM - 29 July 2024',
            patient: 'John Doe',
            image: 'https://path/to/image.png', // Replace with your image path
          },
          {
            id: '2',
            doctorName: 'Dr. Aine Murphy',
            hospital: 'Aadele Hospital',
            time: '06:00 PM - 29 July 2024',
            patient: 'John Doe',
            image: 'https://path/to/image.png',
          },
      // Add more appointments here if needed
    ];
  
    const renderItem = ({ item }) => (
        <View style={styles.card}>
          <View style={styles.row}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.details}>
              <Text style={styles.name}>{item.doctorName}</Text>
              <Text style={styles.hospital}>{item.hospital}</Text>
              <Text style={styles.time}>{moment(item.time,'HH:mm').format('HH:mm a')}</Text>
              <Text style={styles.patient}>{item.patient}</Text>
            </View>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.chatButton}>
              <Text style={styles.chatText}>Chat with Doctor</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reviewButton}>
              <Text style={styles.reviewText}>Write Review</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    return(
        <>
        <View style={styles.container}>
      <FlatList
        data={appointments}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
        </>
    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      padding: 10,
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 15,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 2,
    },
    row: {
      flexDirection: 'row',
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: 25,
    },
    details: {
      marginLeft: 10,
      flex: 1,
    },
    name: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    },
    hospital: {
      fontSize: 14,
      color: '#666',
      marginVertical: 2,
    },
    time: {
      fontSize: 14,
      color: '#666',
    },
    patient: {
      fontSize: 14,
      color: '#666',
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    chatButton: {
      flex: 1,
      backgroundColor: '#e5e5e5',
      borderRadius: 5,
      paddingVertical: 8,
      alignItems: 'center',
      marginRight: 5,
    },
    reviewButton: {
      flex: 1,
      backgroundColor: '#fff',
      borderRadius: 5,
      paddingVertical: 8,
      alignItems: 'center',
      borderColor: '#ccc',
      borderWidth: 1,
    },
    chatText: {
      color: '#007bff',
      fontSize: 14,
    },
    reviewText: {
      color: '#28a745',
      fontSize: 14,
    },
  });