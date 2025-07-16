/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import {ScrollView, Text, StyleSheet, View, Image, Pressable,Button,TouchableHighlight, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontFamily, Color, Padding, Border, FontSize } from "../../GlobalStyles";
import { getDoctorsBySpecialist } from '../../utils/Api';
import moment from 'moment';
export default function DoctorsList({ route }) {
  const navigation = useNavigation();
  

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDoctors = async (specialistId) => {
    try {
      const response = await getDoctorsBySpecialist(specialistId);
      setDoctors(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load doctors');
    }
  };

  useEffect(() => {
    const specialistId = route?.params?.specialistId;
    if (specialistId) {
      loadDoctors(specialistId);
    }
  }, [route?.params?.specialistId]);

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <>
     
      <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Text style={styles.heading}>Available Doctors</Text>
       
      </View>
     
      {doctors.map((doctor,index) => (
        <View key={index} style={styles.card}>
          <View style={styles.row}>
            <View style={styles.docImage}>
            <Image source={{
                        uri: doctor.image_url
                          ? doctor.image_url
                          : 'https://via.placeholder.com/100',
                      }} style={styles.image} />
            </View>
            <View style={styles.docTitle}>
            <Text style={styles.name}>{doctor.first_name} {doctor.last_name}</Text>
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
              <Text style={styles.text}>{doctor.experience}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.middleText}>Satisfaction</Text>
              <Text style={styles.text}>99%</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.frameParent8}>
              <View style={styles.frameParent5}>
              <View
                    style={[styles.frameWrapper3, styles.frameWrapperLayout1]}
                  >
                    <View style={styles.frameParent10}>
                      <View style={styles.frameWrapper2}>
                        <View style={styles.groupGroup}>
                          <Image
                            style={styles.groupIcon}
                            resizeMode="cover"
                            source={require("../../assets/group7.png")}
                          />
                          <Text
                            style={[
                              styles.videoConsultations,
                              styles.textFlexBox,
                            ]}
                          >
                            Video Consultations
                          </Text>
                        </View>
                      </View>
                      <View style={styles.frameParent11}>
                        <View style={styles.groupGroup}>
                          <Image
                            style={styles.groupIcon1}
                            resizeMode="cover"
                            source={require("../../assets/group8.png")}
                          />
                          <Text style={[styles.am1000pm, styles.textFlexBox]}>
                            {moment(doctor.start_time).format('hh:mm A')} - {moment(doctor.end_time).format('hh:mm A')}
                          </Text>
                        </View>
                        <View style={styles.drLauraParent}>
                          <Text style={[styles.text, styles.textFlexBox]}>
                            {doctor.checkup_fee}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View
                    style={[styles.frameWrapper5, styles.frameWrapperBorder]}
                  >
                    <View style={styles.frameParent10}>
                      <View style={styles.frameWrapper2}>
                        <View style={styles.groupGroup}>
                          <Image
                            style={styles.frameChild2}
                            resizeMode="cover"
                            source={require("../../assets/group-24.png")}
                          />
                          <Text
                            style={[
                              styles.videoConsultations,
                              styles.textFlexBox,
                            ]}
                          >
                            {doctor.hospital.hospital_name}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.frameParent11}>
                        <View style={styles.groupGroup}>
                          <Image
                            style={styles.groupIcon1}
                            resizeMode="cover"
                            source={require("../../assets/group8.png")}
                          />
                          <Text style={[styles.am1000pm, styles.textFlexBox]}>
                            11:00 AM- 10:00PM
                          </Text>
                        </View>
                        <View style={styles.vectorParent}>
                          
                          <View style={styles.rs1000Container}>
                            <Text style={[styles.text, styles.textFlexBox]}>
                              Rs. 1000
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
              </View>
            </View>
            
          </View>
          <View style={styles.row}>
           
          <View style={styles.frameParent14}>
            <TouchableHighlight onPress={() => {}}>
            <View
              style={[styles.frameWrapper7, styles.frameWrapperLayout]}
            >
              <View style={styles.frameWrapper2}>
                <Image
                  style={styles.groupIcon}
                  resizeMode="cover"
                  source={require("../../assets/group9.png")}
                />
                <Text
                  style={[styles.videoConsultaion, styles.rs1300Typo]}
                >
                  Video Consultaion
                </Text>
              </View>
            </View>

            </TouchableHighlight>
            <TouchableHighlight onPress={() => {}}>
              <View
              style={[styles.frameWrapper8, styles.frameWrapperLayout]}
            >
              
              <View style={styles.calendarPlus76026102Parent}>
                <Image
                  style={styles.groupIcon1}
                  resizeMode="cover"
                  source={require("../../assets/calendarplus-7602610-2.png")}
                />
                <Text
                  style={[styles.videoConsultaion, styles.rs1300Typo]}
                >
                  Book Appointment
                </Text>
              </View>
              
              
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
      color:'#274A8A',
      letterSpacing:1.3,
      
      
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
    color:'#274A8A',
    letterSpacing:1,
   
    
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
    color:'#274A8A',
    textAlign:'center',
    letterSpacing:1,
  },
  button: {
    backgroundColor: '#E12454', // Dark overlay for visibility
    borderRadius: 5,
    padding: 0,
    alignItems: 'center',
    color:'#fff',
    width:150,
    height:40,
    

  },
  bookbtn:{
    backgroundColor: '#274A8A', // Dark overlay for visibility
    borderRadius: 5,
    padding: 0,
    alignItems: 'center',
    color:'#fff',
    width:150,
    height:40,
   
  },
  frameParent8: {
    marginTop: 16,
    alignSelf: "stretch",
  },
  frameParent5: {
    alignSelf: "stretch",
  },
  frameWrapper3: {
    borderColor: Color.blueStroke,
    borderWidth: 1,
    borderStyle: "solid",
    alignSelf: "stretch",
  },
  frameWrapperLayout1: {
    padding: Padding.p_5xs,
    height: 70,
    borderRadius: Border.br_7xs,
    backgroundColor: Color.fieldsBackground,
  },
  frameParent10: {
    width: 340,
    height: 54,
    justifyContent: "center",
    alignItems: "center",
  },
  frameWrapper2: {
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
  },
  groupGroup: {
    width: 174,
    flexDirection: "row",
    alignItems: "center",
  },
  groupIcon: {
    height: 16,
    width: 21,
  },
  videoConsultations: {
    fontSize: FontSize.size_base,
    marginLeft: 8,
    color: Color.blue1,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: "500",
  },
  textFlexBox: {
    textAlign: "left",
    lineHeight: 24,
  },
  frameParent11: {
    marginTop: 5,
    justifyContent: "space-between",
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
  },
  groupIcon1: {
    width: 16,
    height: 16,
  },
  drLauraParent: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  frameWrapper5: {
    padding: Padding.p_5xs,
    height: 70,
    borderRadius: Border.br_7xs,
    backgroundColor: Color.fieldsBackground,
  },
  frameWrapperBorder: {
    marginTop: 10,
    borderColor: Color.blueStroke,
    borderWidth: 1,
    borderStyle: "solid",
    alignSelf: "stretch",
  },
  frameChild2: {
    height: 16,
    width: 18,
  },
  am1000pm: {
    width: 143,
    marginLeft: 13,
    fontSize: FontSize.size_base,
    color: Color.inActiveFieldsColor,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: "500",
    display: "flex",
    lineHeight: 24,
    alignItems: "center",
  },
  vectorParent: {
    flexDirection: "row",
    alignItems: "center",
  },
  frameParent14: {
    marginTop: 16,
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
  },
  frameWrapper7: {
    backgroundColor: '#E12454',
    borderRadius:20,
  },
  frameWrapperLayout: {
    paddingHorizontal: Padding.p_5xs,
    width: 176,
    borderRadius: Border.br_7xs,
    paddingVertical: Padding.p_3xs,
    justifyContent: "center",
    height: 40,
    alignItems: "center",
  },
  videoConsultaion: {
    marginLeft: 8,
    fontFamily: FontFamily.poppinsSemiBold,
    fontWeight: "600",
    color: Color.white,
    lineHeight: 18,
    fontSize: FontSize.size_sm,
  },
  rs1300Typo: {
    lineHeight: 18,
    fontSize: FontSize.size_sm,
    textAlign: "left",
  },
    frameWrapper8: {
    marginLeft: 6,
    backgroundColor: '#274A8A',
  },
  calendarPlus76026102Parent: {
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
  },
  loader:{
   flex:1,
   color:'red',
  
  },
});