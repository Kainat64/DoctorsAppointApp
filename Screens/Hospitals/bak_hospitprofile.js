import React,{useState, useEffect} from 'react';
import {ScrollView, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from "@react-navigation/native";
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { FontFamily, Color, Padding, Border, FontSize } from "../../GlobalStyles";
const Tab = createMaterialTopTabNavigator();
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { getHospitalById } from '../../utils/Api';
import { CountDoctors } from '../utils/Api';
import { BaseUrl } from '../../utils/BaseApi';
const HospitalProfile = ({route}) => {
    const navigation = useNavigation();
    const { hospitalId } = route.params;
   const [hospitals, setHospitals] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [doctorCount, setDoctorCount] = useState(0)
   const [departments, setDepartments] = useState([]);

  useEffect(() => {
    if (route.params?.hospitalId) {
      loadHospitalProfile(route.params.hospitalId);
    
    }
  }, [route.params?.hospitalId]);
  const loadHospitalProfile = async (hospitalId) => {
    try {
    const response = await getHospitalById(hospitalId);
    console.log('hospital profile',response.data);
    //const data = await response.json();
    setHospitals(response.data);
    } catch (error) {
      console.error("There was an error fetching the hospital profile!", error);
    }

  };

  
  useEffect(() => {
    // Replace 'http://your-api-url.com' with your actual API URL
    axios.get(`${BaseUrl}/hospitals/${hospitalId}/doctor-count`)
        .then(response => {
            setDoctorCount(response.data.doctor_count);
        })
        .catch(error => {
            console.error("There was an error fetching the doctor count!", error);
        });
}, [hospitalId]);

  const HomePageScreen = () => {
    return (
      <ScrollView>
        {hospitals && hospitals.length > 0 ? (
        hospitals.map((hospital, index) => (
          <View key={hospital.id} style={styles.container}>
            <View style={styles.profileSection}>
              <View style={styles.iconSection}>
                <FontAwesome name="hospital-o" size={50} color="#0056D2" />
              </View>
              <View style={styles.detailsSection}>
                <Text style={styles.hospitalName}>{hospital.hospital_name}</Text>
                <Text style={styles.hospitalLocation}>{hospital.address}</Text>
                <View style={styles.reviewSection}>
                  <Text style={styles.reviews}>865 Reviews</Text>
                  <FontAwesome name="check-circle" size={16} color="green" />
                </View>
              </View>
            </View>

            <View style={styles.infoSection}>
              <View style={styles.infoBox}>
                <Text style={styles.infoNumber}>24 hrs</Text>
                <Text style={styles.infoText}>Open</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.infoNumber}>{doctorCount}</Text>
                <Text style={styles.infoText}>Doctors</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.infoNumber}>04</Text>
                <Text style={styles.infoText}>Departments</Text>
              </View>
            </View>

            <View style={styles.aboutSection}>
              <Text style={styles.aboutTitle}>About</Text>
              <Text style={styles.aboutText}>
                Lorem ipsum dolor sit amet consectetur. Aliquam nibh auctor pretium id. Ut arcu varius hac sit. Aenean ac
                curabitur enim blandit facilisis quisque. Nunc quis et orci aliquam in in ut. Id molestie amet et cursus amet.
                In nascetur convallis dignissim tincidunt nulla scelerisque enim praesent sit.
              </Text>
            </View>

            <View style={styles.locationSection}>
              <Text style={styles.locationTitle}>Available Doctors</Text>
              <View style={styles.doctorCard}>
                {hospital.doctor.map((doc, index) => (
                  <View key={index} style={styles.departmentBadge}>

                    <Text>{doc.first_name} {doc.last_name}</Text>

                  </View>
                ))}
              </View >
            </View>



            <TouchableOpacity style={styles.callButton}>
              <Text style={styles.callButtonText}>Call Helpline</Text>
            </TouchableOpacity>

          </View>

    ))
  ) : (
    <Text>No departments available</Text>
  )}
      </ScrollView>
    )
  }
  const DoctorPage = () => {
    return (
      <>
      <ScrollView>
      {hospitals.map((hospital, index) => (
      <ScrollView contentContainerStyle={styles.container}>
      
      <View>
        <Text style={styles.heading}>Available Doctors</Text>
       
      </View>
      {hospital.doctor.map((doc, index) => (
        <View key={doc.id} style={styles.card}>
          <View style={styles.row}>
            <View style={styles.docImage}>
            <Image source={require("../../assets/image-8.png")} style={styles.image} />
            </View>
            <View style={styles.docTitle}>
            <Text style={styles.name}>{doc.first_name} {doc.last_name}</Text>
            <Text style={[styles.text, styles.docTitle]}>Specialist: {doc.specialist}</Text>
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
              <Text style={styles.text}>{doc.experience}</Text>
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
                            11:00 AM- 10:00PM
                          </Text>
                        </View>
                        <View style={styles.drLauraParent}>
                          <Text style={[styles.text, styles.textFlexBox]}>
                            Rs. 1000
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
            <TouchableOpacity onPress={() => {}}>
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

            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
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
            </TouchableOpacity>
          </View>
          
          </View>
        
          
        </View>
      ))}
  
      </ScrollView>
        ))}
      </ScrollView>
      
      </>
    )
  }
  const DepartmentPage = () => {
    return (
      <>
      <View style={{backgroundColor:'#fff'}}>
      <View style={{padding:20, alignItems:'center'}}>
        <Text style={{fontSize:20, fontWeight:'600',color:''}}>Departments</Text>
      </View>
      <View style={styles.frameParent4}>
      { hospitals.departments && Array.isArray(hospitals.departments) && hospitals.departments.length > 0 ? (

    hospitals.departments.map((department) => (
      
      <View style={styles.frameWrapperShadowBox} key={department.id}>
        {console.log('dep id:',department.id)}
        <View
          style={[
            styles.calendarPlus76026102Parent,
            styles.frameGroupFlexBox,
          ]}
        >
          <View style={styles.frameWrapper5FlexBox}>
            <Image
              style={styles.frameIcon}
              resizeMode="cover"
              source={require("../../assets/frame-347.png")}
            />
          </View>
          <Text style={[styles.aestheticCrown, styles.bracesTypo]}>
            {department.title}
          </Text>
        </View>
      </View>
    ))
  ) : (
    <Text>No departments available</Text>
  )}
</View>
      </View>
      
      </>
    )
  }
    return (
      
      <NavigationContainer independent={true}>
      <Tab.Navigator>
     <Tab.Screen name="Profile" component={HomePageScreen} />
     <Tab.Screen name="Doctors" component={DoctorPage} />
     <Tab.Screen name="Department" component={DepartmentPage} />
    
     

    
   </Tab.Navigator>
    </NavigationContainer>
        
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 50,
      paddingBottom: 10,
      backgroundColor: '#0056D2',
    },
    headerTitle: {
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold',
      marginLeft: 20,
    },
    profileSection: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
    },
    iconSection: {
      marginRight: 20,
    },
    detailsSection: {
      flex: 1,
    },
    hospitalName: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    hospitalLocation: {
      fontSize: 16,
      color: '#777',
    },
    reviewSection: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
    },
    reviews: {
      fontSize: 14,
      marginRight: 5,
      color: '#777',
    },
    infoSection: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 20,
      backgroundColor: '#f7f7f7',
    },
    infoBox: {
      alignItems: 'center',
    },
    infoNumber: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    infoText: {
      fontSize: 14,
      color: '#777',
    },
    aboutSection: {
      padding: 20,
    },
    aboutTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    aboutText: {
      fontSize: 14,
      color: '#777',
      lineHeight: 20,
    },
    locationSection: {
      padding: 20,
    },
    locationTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    map: {
      width: '100%',
      height: 200,
    },
    callButton: {
      backgroundColor: '#D0021B',
      paddingVertical: 15,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 20,
      borderRadius: 10,
    },
    callButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
    doctorCard:{
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 3,


    },
    departmentBadge: {
      backgroundColor: '#EFEFEF',
      borderRadius: 5,
      padding: 5,
      marginRight: 5,
      marginBottom: 5,
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
  frameParent4: {
    marginTop: 10,
    flexWrap: "wrap",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  frameWrapperShadowBox: {
    borderColor: Color.blueStroke,
    shadowOpacity: 1,
    elevation: 15,
    shadowRadius: 15,
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowColor: "rgba(39, 74, 138, 0.1)",
    flexWrap: "wrap",
    width: 175,
    borderRadius: Border.br_5xs,
    padding: Padding.p_3xs,
    borderWidth: 1,
    borderStyle: "solid",
    flexDirection: "row",
    backgroundColor: Color.white,
  },
  });
  
  export default HospitalProfile;