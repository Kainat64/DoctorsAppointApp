import React, { useEffect, useState } from 'react';
import {ScrollView, Text, StyleSheet, View, Image, Pressable,Button,TouchableHighlight } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontFamily, Color, Padding, Border, FontSize } from "../GlobalStyles";
export default function DoctorsList({ route }) {
  const navigation = useNavigation();
  const { specialistId } = route.params;

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchSpecialists = async () => {
      try {
        const response = await fetch(`https://doctors-365.caesar.business/api/specialists/${specialistId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }
        const data = await response.json();
        setDoctors(data);
        //console.log(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSpecialists();
  }, [specialistId]);

  const data = [
    {
      id: 1,
      name: 'John Doe',
      image: 'https://example.com/image1.jpg',
      text: 'This is some example text.',
    },
    {
      id: 2,
      name: 'Jane Smith',
      image: 'https://example.com/image2.jpg',
      text: 'This is another example text.',
    },
    // Add more data as needed
  ];
  return (
    <>
      {doctors.map((doctor) => (
        <View>

          <Text>{doctor.first_name}</Text>
        </View>

      )
      )
      }
      <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Text style={styles.heading}>Available Doctors</Text>
      </View>
      {doctors.map((doctor) => (
        <View key={doctor.id} style={styles.card}>
          <View style={styles.row}>
            <View style={styles.docImage}>
            <Image source={require("../assets/image-8.png")} style={styles.image} />
            </View>
            <View style={styles.docTitle}>
            <Text style={styles.name}>{doctor.first_name}</Text>
            <Text style={[styles.text, styles.docTitle]}>Specialist: {doctor.specialist}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>BDS, M.Phil (Oral Pathology & Microbiology ) Aesthetic Crown & Bridge</Text>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
             <Text style={styles.middleText}>Patient</Text>
             <Text style={styles.text}>10</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.middleText}>Experience</Text>
              <Text style={styles.text}>5 Year</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.middleText}>Satisfaction</Text>
              <Text style={styles.text}>99%</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <TouchableHighlight onPress={() => { }}>
                <View style={styles.button}>

                  <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', paddingTop: 8 }}>Book Appointment</Text>
                </View>
              </TouchableHighlight>
            </View>
            <View style={styles.column}>
              <TouchableHighlight onPress={() => { }}>
                <View style={styles.bookbtn}>

                  <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', paddingTop: 8 }}>Book Appointment</Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        
         
        </View>
      ))}
      </ScrollView>
     
    </>
  )
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    backgroundColor:'#fff',
  },
  heading: {
      fontSize:22,
      textAlign:'center',
      fontWeight:'800',
      
      
  },
  card: {
    width: '95%', // Adjust width as needed
    height:'auto',
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 50,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color:'blue',
   
    
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  column: {
    width: '33%', // Adjust width as needed
    left:0,
    textAlign:'left',
    alignItems:'left',
    justifyContent:'left',
  },
  docImage:{
    width: '33%', // Adjust width as needed
    left:0,
   
  },
  docTitle:{
    width: '66%', // Adjust width as needed
    left:0,
    textAlign:'left',
    alignItems:'left',
    justifyContent:'left',
  },
  text: {
    fontSize: 14,
    marginTop: 5,
    fontWeight:'500',
    textAlign:'center',
  },
  middleText:{
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
    color:'blue',
    textAlign:'center',
  },
  button: {
    backgroundColor: 'red', // Dark overlay for visibility
    borderRadius: 5,
    padding: 0,
    alignItems: 'center',
    color:'#fff',
    width:150,
    height:40,
    

  },
  bookbtn:{
    backgroundColor: 'green', // Dark overlay for visibility
    borderRadius: 5,
    padding: 0,
    alignItems: 'center',
    color:'#fff',
    width:150,
    height:40,
   
  },
});