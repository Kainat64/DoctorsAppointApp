import React,  { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, ScrollView } from 'react-native';

const { width } = Dimensions.get('window');
import { useNavigation } from '@react-navigation/native';
import { BaseUrl } from '../../utils/BaseApi';
import { getDoctors } from '../../utils/Api';


const PlanScreen = () => {
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
    <ScrollView style={styles.container}>
      <View style={styles.cardContainer}>
      {/* Background Shape using SVG */}
      <Image
          source={require("../../assets/weight-loss/background.png")} // Replace with actual image URL
          style={styles.backgroundImg}
        />

      {/* Content on Top of the Background */}
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Weight Loss</Text>
          <Text style={styles.subtitle}>Join the first European virtual weight loss clinic</Text>
        </View>
        <Image
          source={require("../../assets/weight-loss/weight-loss.png")} // Replace with actual image URL
          style={styles.image}
        />
      </View>
    </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Why Should You Choose Us?</Text>
        <View style={styles.benefitContainer}>
          <Text style={styles.benefitText}>✔️ Get Certified Doctors</Text>
          <Text style={styles.benefitText}>✔️ Pick Your Own Date And Time</Text>
          <Text style={styles.benefitText}>✔️ Reminders And Follow-Ups</Text>
          <Text style={styles.benefitText}>✔️ Get 10% Discount On 3 Months Subscription</Text>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Available Mentors</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mentorContainer}>
          {doctors.map((mentor, index) => (
            <View key={index} style={styles.mentorCard}>
              <Image
                //source={require("../../assets/image-8.png")}
                source={{ uri: mentor?.image_url ? mentor?.image_url : 'https://via.placeholder.com/100' }}
                style={styles.mentorImage}
              />
              <Text style={styles.mentorName}>{mentor.first_name} {mentor.last_name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity style={styles.quizButton} onPress={() => navigation.navigate('Weight Loss Reviews')}>
        <Text style={styles.quizButtonText}>Start Quiz</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cardContainer: {
    width: width * 0.9,
    height: 150,
    backgroundColor: '#FAF3E0', // Light cream background color
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'center',
    marginVertical: 20,
    position: 'relative',
  },
  svgBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    position: 'relative',
  },
  textContainer: {
    flex: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  backgroundImg:{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width:'100%',
    height:'auto',
  },
  image: {
    flex: 1,
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 8,
  },
  
  sectionContainer: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  stepContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  stepText: {
    fontSize: 14,
    marginBottom: 8,
  },
  benefitContainer: {
    backgroundColor: '#f0f8ff',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  benefitText: {
    fontSize: 14,
    marginBottom: 8,
  },
  mentorContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  mentorCard: {
    alignItems: 'center',
    marginRight: 16,
  },
  mentorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  mentorName: {
    marginTop: 4,
    fontSize: 12,
  },
  quizButton: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
    alignItems: 'center',
    alignSelf: 'center',
    width: width * 0.9,
  },
  quizButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PlanScreen;
