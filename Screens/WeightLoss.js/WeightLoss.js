import React,  { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
import { useNavigation } from '@react-navigation/native';
import { BaseUrl } from '../../utils/BaseApi';
import { getDoctors } from '../../utils/Api';
const WeightLossDoctorList = () => {
    const navigation = useNavigation();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const loadDoctors = async () => {
        const response = await getDoctors();
        setDoctors(response.data);
      };
      loadDoctors();
    }, []);
    
  
    if (error) {
      return <Text>Error: {error}</Text>;
    }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weight Loss</Text>

      {/* Available Mentors Section */}
      <View style={styles.mentorsContainer}>
        <Text style={styles.sectionTitle}>Available Mentors</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {doctors.map((doctor, index) => (
            <View key={doctor.id} style={styles.mentorCard}>
              <Image  source={ {uri: doctor?.image_url ? doctor?.image_url : 'https://via.placeholder.com/100'}} style={styles.mentorImage} />
              <Text style={styles.mentorName} numberOfLines={1}>{doctor.first_name} {doctor.last_name}</Text>
              <Text style={styles.mentorQualification}>{doctor.degree}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Patients Reviewed Section */}
      <ScrollView>
      <View style={styles.patientsContainer}>
        <Text style={styles.sectionTitle}>Patients Reviewed</Text>
        {doctors.map((doctor, index) => (
          <View key={index} style={styles.reviewCard}>
            <View style={styles.patientInfo}>
              <Image  source={ {uri: doctor?.image_url ? doctor?.image_url : 'https://via.placeholder.com/100'}} style={styles.patientImage} />
              <View>
                <Text style={styles.patientName}>{doctor.first_name} {doctor.last_name}</Text>
                <Text style={styles.reviewDate}>15 days ago</Text>
              </View>
              <View style={styles.appointmentTag}>
                <Text style={styles.appointmentText}>Onsite Appointment</Text>
              </View>
            </View>
            <Text style={styles.feedbackTitle}>Patient Feedback:</Text>
            <Text style={styles.feedbackText}>{doctor?.reviews?.[0]?.comments || 'No feedback provided.'}</Text>
            <View style={styles.feedbackButtons}>
              <TouchableOpacity style={styles.feedbackButton}>
                <Text style={styles.buttonText}>Satisfied</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.feedbackButton}>
                <Text style={styles.buttonText}>No Waiting Time</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.feedbackButton}>
                <Text style={styles.buttonText}>Explain briefly</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
      </ScrollView>
      

      {/* Start Quiz Button */}
      <TouchableOpacity style={styles.startQuizButton}
      onPress={() => navigation.navigate('Weight Loss Tips')}
      >
        <Text style={styles.startQuizText}>Back To Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1c3b70',
    marginBottom: 16,
  },
  mentorsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  mentorCard: {
    width: width * 0.30,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent:'center',
    padding: 8,
    marginRight: 8,
  },
  mentorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 8,
  },
  mentorName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign:'center',
  },
  mentorQualification: {
    fontSize: 12,
    color: 'blue',
  },
  patientsContainer: {
    marginBottom: 16,
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  patientImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  patientName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  reviewDate: {
    fontSize: 12,
    color: '#777',
  },
  appointmentTag: {
    backgroundColor: '#28a745',
    padding: 4,
    borderRadius: 4,
    marginLeft: 'auto',
  },
  appointmentText: {
    fontSize: 12,
    color: '#fff',
  },
  feedbackTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  feedbackText: {
    fontSize: 12,
    color: '#555',
    marginBottom: 8,
  },
  feedbackButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  feedbackButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  buttonText: {
    fontSize: 12,
    color: '#333',
  },
  startQuizButton: {
    backgroundColor: '#1c3b70',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  startQuizText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WeightLossDoctorList;
