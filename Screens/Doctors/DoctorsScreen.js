/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Padding, FontFamily, FontSize, Border, Color} from '../../GlobalStyles';
import {TouchEventType} from 'react-native-gesture-handler/lib/typescript/TouchEventType';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {getDoctors} from '../../utils/Api';
import {getDiseases} from '../../utils/Api';
import {getSpecialist} from '../../utils/Api';
import {getHospitalList} from '../../utils/Api';
import {BaseUrl} from '../../utils/BaseApi';
import Icon from 'react-native-vector-icons/Ionicons'; // or MaterialIcons, Feather, etc.

export default function DoctorsScreen({props}) {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [neardoctor, setNearbyDoctor] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [specialist, setSpecialist] = useState([]);
  const [hospitals, setHospitals] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const handleFocus = () => {
    navigation.navigate('Clinics'); // Replace 'SearchScreen' with your actual screen name
  };
  useEffect(() => {
    const loadDoctors = async () => {
      const response = await getDoctors();
      setDoctors(response.data);
      //console.log('available doctors :', response.data);
    };

    const fetchDiseases = async () => {
      try {
        const response = await getDiseases();
        setDiseases(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    const fetchSpecialists = async () => {
      try {
        const response = await getSpecialist();
        setSpecialist(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
    fetchDiseases();
    fetchSpecialists();
  }, []);

  // Fetch nearby doctors
  const fetchNearbyDoctors = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${BaseUrl}/nearby-doctors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Debug the API response
      //console.log('Nearby Doctors API Response:', response.data);

      // Filter and set the data
      setNearbyDoctor(response.data.filter(doctor => doctor && doctor.title));
    } catch (error) {
      console.error('Error fetching nearby doctors', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNearbyDoctors();
  }, []);
  //fetch near by hospitals
  const fetchNearbyHospitals = async () => {
    try {
      // Replace with your Laravel API endpoint for nearby doctors
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${BaseUrl}/nearby-hospitals`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHospitals(response.data);
      //console.log('near hospital', response.data);
    } catch (error) {
      console.error('Error fetching nearby hospitals', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchNearbyHospitals();
  }, []);

  if (loading) {
    return (
      <Text>
        <ActivityIndicator size={'large'} style={{alignItems: 'center'}} />
      </Text>
    );
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }
  const handleSpecialistPress = hospitalId => {
    navigation.navigate('Clinics', {consultationType: 'video'});
  };
  const ShowDoctorsProfile = hospitalId => {
    navigation.navigate('Hospital Profile', {hospitalId});
  };
  const ShowHospitalProfile = hospitalId => {
    navigation.navigate('Hospital Profile', {hospitalId});
  };
  const formatDoctorName = name => name;


  return (
 
       <>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <Icon
                name="arrow-back"
                size={wp(6)}
                color="#000"
                style={{marginRight: wp(2)}}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Find a Clinic</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInput}>
            <Image
              style={styles.searchIcon}
              source={require('../../assets/vector.png')}
            />
            <TextInput
              style={styles.searchTextInput}
              placeholder="Search a Clinic"
              value={search}
              onFocus={handleFocus}
              onChangeText={text => setSearch(text)}
            />
          </View>
        </View>

        {/* Available Clinics Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Clinics</Text>
            <Image
              source={require('../../assets/frame-511.png')}
              style={styles.seeAllIcon}
            />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {hospitals.map((doctor, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => ShowDoctorsProfile(doctor.id)}
                style={styles.cardContainer}>
                <View style={styles.clinicCard}>
                  <Image
                    style={styles.clinicImage}
                    source={{
                      uri: doctor.image_url || 'https://via.placeholder.com/100',
                    }}
                  />
                  <Text style={styles.clinicName} numberOfLines={2}>
                    {formatDoctorName(doctor.hospital_name)}
                  </Text>
                  <Text style={styles.clinicDistance}>
                    {parseFloat(doctor.distance).toFixed(1)} Km Away
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Top Diseases Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Diseases</Text>
            <Image
              source={require('../../assets/frame-511.png')}
              style={styles.seeAllIcon}
            />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {diseases.map((disease, index) => (
              <TouchableOpacity
                key={index}
                style={styles.diseaseCard}
                onPress={() =>
                  navigation.navigate('Clinics', {consultationType: 'video'})
                }>
                <Image
                  style={styles.diseaseImage}
                  source={{
                    uri: disease.image_url || 'https://via.placeholder.com/100',
                  }}
                />
                <Text style={styles.diseaseName} numberOfLines={1}>
                  {disease.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Common Symptoms Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Common Symptoms</Text>
            <Image
              source={require('../../assets/frame-511.png')}
              style={styles.seeAllIcon}
            />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {specialist.map((row, index) => (
              <TouchableOpacity
                key={index}
                style={styles.symptomCard}
                onPress={() => handleSpecialistPress(row.id)}>
                <Image
                  style={styles.symptomImage}
                  source={require('../../assets/-x32-6-heart.png')}
                />
                <Text style={styles.symptomName} numberOfLines={1}>
                  {row.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </>
  );
}
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'left',
//     justifyContent: 'left',
//     paddingHorizontal: 15,
//     paddingVertical: 1,
//   },
//   textHeading: {
//     textAlign: 'center',
//     fontSize: 26,
//     color: 'green',
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   statusBarFlexBox: {
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     flexDirection: 'row',
//   },
//   parentFrameSpaceBlock: {
//     paddingHorizontal: 0,
//     flexDirection: 'row',
//   },
//   time1Layout: {
//     height: 18,
//     alignItems: 'center',
//   },
//   framePosition: {
//     width: 390,
//     left: 20,
//     position: 'absolute',
//     marginBottom: 0,
//   },
//   vectorSpaceBlock: {
//     padding: Padding.p_3xs,
//     alignItems: 'center',
//   },
//   seeAllTypo: {
//     fontFamily: FontFamily.poppinsMedium,
//     fontWeight: '500',
//   },
//   groupFrameFlexBox: {
//     paddingHorizontal: Padding.p_xs,
//     alignItems: 'center',
//     flexDirection: 'row',
//   },
//   findADoctor1Typo: {
//     fontSize: FontSize.size_lg,
//     textAlign: 'center',
//   },
//   mbbsTypo: {
//     fontFamily: FontFamily.poppinsSemiBold,
//     fontWeight: '600',
//   },
//   seeAllFlexBox: {
//     textAlign: 'left',
//     lineHeight: 16,
//   },
//   frameIconLayout: {
//     height: 16,
//     width: 16,
//   },
//   image8IconPosition: {
//     borderRadius: Border.br_3xl,
//     left: 0,
//     position: 'absolute',
//   },
//   groupLayout: {
//     height: 7,
//     width: 7,
//     top: 0,
//     position: 'absolute',
//   },
//   drNiaTypo: {
//     lineHeight: 16,
//     fontSize: FontSize.size_sm,
//     color: Color.blue1,
//     fontFamily: FontFamily.poppinsMedium,
//     fontWeight: '500',
//     textAlign: 'center',
//   },
//   frameWrapperShadowBox2: {
//     width: 180, // Set your desired width
//     height: 120, // Set same value as width for square
//     paddingHorizontal: Padding.p_5xs,
//     borderRadius: Border.br_5xs,
//     shadowOpacity: 1,
//     elevation: 15,
//     shadowRadius: 15,
//     shadowOffset: {
//       width: 2,
//       height: 4,
//     },
//     shadowColor: 'rgba(39, 74, 138, 0.11)',
//     borderColor: Color.blueStroke,
//     borderWidth: 1,
//     borderStyle: 'solid',
//     paddingVertical: Padding.p_3xs,
//     alignItems: 'center',
//     flexDirection: 'row',
//     justifyContent:'center',
//     backgroundColor: '#ddeedf',
//     marginLeft: 5,
//   },
//   drNiaLayout: {
//     width: 64,
//     alignItems: 'center',
//   },
//   iconLayout: {
//     width: 36,
//     height: 36,
//   },
//   feverTypo: {
//     color: Color.blue2,
//     lineHeight: 16,
//     fontFamily: FontFamily.poppinsMedium,
//     fontWeight: '500',
//     textAlign: 'center',
//   },
//   frameWrapperShadowBox: {
//     paddingHorizontal: Padding.p_8xs,
//     width: 130,
//     shadowColor: 'rgba(39, 74, 138, 0.1)',
//     shadowOpacity: 1,
//     elevation: 15,
//     shadowRadius: 15,
//     shadowOffset: {
//       width: 2,
//       height: 4,
//     },
//     borderColor: Color.blueStroke,
//     borderRadius: Border.br_3xs,
//     borderWidth: 1,
//     borderStyle: 'solid',
//     paddingVertical: Padding.p_3xs,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#ddeedf',
//     marginLeft: 5,
//   },
//   frameWrapper14Layout: {
//     width: 90,
//     alignItems: 'center',
//   },
//   frameParentSpaceBlock: {
//     marginTop: 10,
//     alignSelf: 'stretch',
//     marginBottom:-20
//   },
//   drLaura2Typo: {
//     fontSize: FontSize.size_base,
//     fontFamily: FontFamily.poppinsSemiBold,
//     fontWeight: '600',
//     color: Color.blue1,
//   },
//   kmAwayTypo: {
//     marginLeft: 3,
//     fontSize: FontSize.size_xs,
//     textAlign: 'center',
//   },
//   parentFlexBox1: {
//     marginTop: 3,
//     alignItems: 'center',
//     flexDirection: 'row',
//   },
//   frameWrapperShadowBox3: {
//     borderRadius: Border.br_5xs,
//     shadowOpacity: 1,
//     elevation: 15,
//     shadowRadius: 15,
//     shadowOffset: {
//       width: 2,
//       height: 4,
//     },
//     shadowColor: 'rgba(39, 74, 138, 0.11)',
//     borderColor: Color.blueStroke,
//     padding: Padding.p_3xs,
//     borderWidth: 1,
//     borderStyle: 'solid',
//     alignItems: 'center',
//     flexDirection: 'row',
//     backgroundColor: Color.white,
//   },
//   frameWrapperBorder: {
//     borderRadius: Border.br_7xs,
//     borderWidth: 1,
//     borderStyle: 'solid',
//   },
//   frameChildLayout: {
//     width: 18,
//     height: 18,
//   },
//   dublin8D08Typo: {
//     letterSpacing: 0.3,
//     fontSize: FontSize.size_sm,
//     textAlign: 'left',
//   },
//   parentFlexBox: {
//     width: 216,
//     alignItems: 'center',
//     flexDirection: 'row',
//   },
//   component1Border: {
//     borderColor: Color.blueStroke,
//     borderWidth: 1,
//     borderStyle: 'solid',
//     position: 'absolute',
//   },
//   time1: {
//     fontSize: FontSize.size_mid,
//     lineHeight: 22,
//     width: 34,
//     height: 18,
//     display: 'flex',
//     textAlign: 'center',
//     color: Color.white,
//     fontFamily: FontFamily.poppinsRegular,
//     justifyContent: 'center',
//   },
//   time: {
//     width: 68,
//     height: 40,
//     paddingVertical: Padding.p_3xs,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   cellularConnectionIcon: {
//     width: 19,
//     height: 12,
//   },
//   wifiIcon: {
//     width: 17,
//     marginLeft: 7,
//     height: 12,
//   },
//   border: {
//     height: '100%',
//     marginLeft: -13.65,
//     top: '0%',
//     bottom: '0%',
//     borderRadius: Border.br_8xs_3,
//     borderColor: Color.white,
//     width: 25,
//     opacity: 0.35,
//     borderWidth: 1,
//     borderStyle: 'solid',
//     left: '50%',
//     position: 'absolute',
//   },
//   capIcon: {
//     height: '31.54%',
//     marginLeft: 12.35,
//     top: '36.92%',
//     bottom: '31.54%',
//     maxHeight: '100%',
//     width: 1,
//     opacity: 0.4,
//     left: '50%',
//     position: 'absolute',
//   },
//   capacity: {
//     height: '69.23%',
//     marginLeft: -11.65,
//     top: '15.38%',
//     bottom: '15.38%',
//     borderRadius: Border.br_10xs_5,
//     width: 21,
//     left: '50%',
//     position: 'absolute',
//     backgroundColor: Color.white,
//   },
//   battery: {
//     width: 27,
//     height: 13,
//     marginLeft: 7,
//   },
//   cellularConnectionParent: {
//     width: 78,
//     flexDirection: 'row',
//   },
//   statusBar: {
//     marginLeft: -215,
//     backgroundColor: Color.blue1,
//     width: 430,
//     height: 50,
//     paddingRight: Padding.p_xl,
//     left: '50%',
//     top: 0,
//     position: 'absolute',
//   },
//   frameChild: {
//     maxWidth: '100%',
//     height: 15,
//     overflow: 'hidden',
//   },
//   vectorWrapper: {
//     borderColor: Color.subHeading,
//     height: 34,
//     justifyContent: 'center',
//     backgroundColor: Color.fieldsBackground,
//     padding: Padding.p_3xs,
//     borderRadius: Border.br_xl,
//     borderWidth: 1,
//     borderStyle: 'solid',
//     width: 34,
//   },
//   findADoctor: {
//     fontSize: FontSize.size_5xl,
//     color: Color.blue1,
//   },
//   findADoctorWrapper: {
//     paddingHorizontal: Padding.p_3xs,
//     paddingVertical: 0,

//     textAlign: 'left',
//     alignItems: 'flex-start',
//     justifyContent: 'flex-start',

//     flexDirection: 'row',
//   },
//   frameParent: {
//     top: 3,

//     flexDirection: 'row',
//   },
//   vectorIcon: {
//     height: 16,
//     width: 16,
//     marginRight:8
//   },
//   findADoctor1: {
//     lineHeight: 20,
//     marginLeft: 10,
//     color: Color.inActiveFieldsColor,
//     fontFamily: FontFamily.poppinsRegular,
//     fontSize: FontSize.size_lg,
//   },
//   vectorParent: {
//     alignItems: 'center',
//     flexDirection: 'row',
//   },
//   iphone1415ProMax1Inner: {
//     top: 50,
//     height: 52,
//     paddingVertical: Padding.p_smi,
//     borderColor: Color.blueStroke,
//     borderWidth: 1,
//     borderStyle: 'solid',
//     position: 'absolute',
//     borderRadius: Border.br_3xs,
//     paddingHorizontal: Padding.p_xs,
//     backgroundColor: Color.fieldsBackground,
//     width: 360,
//     left: 20,
//   },
//   availableDoctors: {
//     fontSize: FontSize.size_lg,
//     textAlign: 'center',
//     color: Color.blue1,
//   },
//   availableDoctorsWrapper: {
//     paddingVertical: Padding.p_9xs,
//     alignItems: 'center',
//   },
//   seeAll: {
//     fontSize: FontSize.size_mini,
//     color: '#274A8A',
//     fontFamily: FontFamily.poppinsMedium,
//     fontWeight: '600',
//     marginRight: 15,
//   },
//   frameItem: {
//     borderRadius: Border.br_3xs_5,
//     marginLeft: 4,
//   },
//   seeAllParent: {
//     paddingVertical: Padding.p_3xs,
//   },
//   frameView: {
//     alignSelf: 'stretch',
//   },
//   image8Icon: {
//     height: 42,
//     width: 42,
//     top: 0,
//   },
//   groupChild: {
//     left: 31,
//   },
//   image8IconLayout: {
//     height: 42,
//     width: 42,
//   },
//   drLaura: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//     textAlign: 'center',
//     maxWidth: '100%',
   
//   },
//   mbbs: {
//     marginTop:5,
//     fontSize: FontSize.size_3xs,
//     lineHeight: 10,
//     color: Color.green2,
//     alignSelf: 'stretch',
//     textAlign: 'center',
//   },
//   drLauraParent: {
//     marginTop: 8,
//     alignItems:"center",
//     textAlign:'center'
//   },
//   groupParent: {
//     alignItems: 'center',
//   },
//   groupItem: {
   
//   },
//   drChloeParent: {
//     marginTop: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   frameWrapper1: {
//     marginLeft: 5,
//   },
//   drRach: {
//     fontSize: FontSize.size_sm,
//     lineHeight: 16,
//     color: Color.blue1,
//     fontFamily: FontFamily.poppinsMedium,
//     fontWeight: '500',
//     textAlign: 'center',
//     display: 'flex',
//     justifyContent: 'center',
//   },
//   frameWrapper2: {
//     marginLeft: 5,
//   },
//   drKateParent: {
//     marginTop: 8,
//     alignSelf: 'stretch',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   frameWrapper3: {
//     marginLeft: 5,
//   },
//   text: {
//     letterSpacing: -2,
//   },
//   frameWrapper4: {
//     marginLeft: 5,
//   },
//   image12Icon: {
//     top: 1,
//     height: 42,
//     width: 42,
//   },
//   image12Parent: {
//     height: 43,
//     width: 42,
//   },
//   drNiaTxtContainer: {
//     width: '100%',
//   },
//   drNia: {
//     fontSize: FontSize.size_sm,
//     lineHeight: 16,
//     color: Color.blue1,
//     fontFamily: FontFamily.poppinsMedium,
//     fontWeight: '500',
//     textAlign: 'center',
//     display: 'flex',
//   },
//   frameWrapper5: {
//     marginLeft: 5,
//   },
//   drKatieParent: {
//     marginTop: 8,
//     alignSelf: 'stretch',
//   },
//   frameWrapper6: {
//     marginLeft: 5,
//   },
//   frameWrapper7: {
//     marginLeft: 5,
//   },
//   frameParent1: {
//     height: 116,
//     alignSelf: 'stretch',
//     paddingVertical: Padding.p_3xs,
//     alignItems: 'center',
//   },
//   frameContainer: {
//     alignSelf: 'stretch',
//   },
//   groupIcon: {
//     height: 36,
//   },
//   dengueFever: {
//     fontSize: FontSize.size_sm,
//   },
//   dengueFeverWrapper: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection: 'row',
//   },
//   frameWrapper9: {
//     width: 98,
//     marginTop: 8,
//     justifyContent: 'center',
//   },
//   groupParent7: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   typhoidFever: {
//     fontSize: FontSize.size_sm,
//     marginTop: 8,
//     alignSelf: 'stretch',
//   },
//   groupParent8: {
//     width: 99,
//     alignItems: 'center',
//   },
//   frameWrapper11: {
//     justifyContent: 'center',
//   },
//   frameWrapper10: {
//     marginLeft: 5,
//   },
//   groupParent9: {
//     width: 70,
//     alignItems: 'center',
//   },
//   frameWrapper14: {
//     justifyContent: 'center',
//   },
//   frameWrapper13: {
//     marginLeft: 5,
//   },
//   migraine: {
//     fontSize: FontSize.size_smi,
//     marginTop: 8,
//     alignSelf: 'stretch',
//   },
//   groupParent10: {
//     width: 58,
//     alignItems: 'center',
//   },
//   frameWrapper16: {
//     marginLeft: 5,
//   },
//   frameChild4: {
//     width: 28,
//     height: 36,
//   },
//   groupParent11: {
//     width: 55,
//     alignItems: 'center',
//   },
//   frameWrapper19: {
//     marginLeft: 5,
//   },
//   groupParent12: {
//     width: 112,
//     alignItems: 'center',
//   },
//   frameWrapper22: {
//     marginLeft: 5,
//   },
//   frameParent4: {
//     alignSelf: 'stretch',
//     paddingVertical: Padding.p_3xs,
//     alignItems: 'center',
//   },
//   frameWrapper26: {
//     marginTop: 8,
//     alignSelf: 'stretch',
//     justifyContent: 'center',
//   },
//   skin77449491Icon: {
//     height: 36,
//     overflow: 'hidden',
//   },
//   frameWrapper27: {
//     marginLeft: 5,
//   },
//   groupParent13: {
//     width: 77,
//     alignItems: 'center',
//   },
//   frameWrapper29: {
//     marginLeft: 5,
//   },
//   groupParent14: {
//     width: 62,
//     alignItems: 'center',
//   },
//   frameWrapper31: {
//     marginLeft: 5,
//   },
//   frameWrapper33: {
//     marginLeft: 5,
//   },
//   frameWrapper35: {
//     marginLeft: 5,
//   },
//   image8Icon1: {
//     height: 36,
//     borderRadius: Border.br_3xl,
//     left: 0,
//     position: 'absolute',
//     top: 0,
//   },
//   groupChild5: {
//     left: 27,
//     width: 6,
//     height: 6,
//     top: 0,
//     position: 'absolute',
//   },
//   drLaura2: {
//     textAlign: 'left',
//     lineHeight: 16,
//   },
//   frameChild9: {
//     borderRadius: Border.br_xl,
//   },
//   kmAway: {
//     color: Color.subHeading,
//     width: 66,
//     fontFamily: FontFamily.poppinsMedium,
//     fontWeight: '500',
//     height: 18,
//     alignItems: 'center',
//     display: 'flex',
//     justifyContent: 'center',
//   },
//   cross100975791Icon: {
//     overflow: 'hidden',
//   },
//   dentist: {
//     fontFamily: FontFamily.poppinsSemiBold,
//     fontWeight: '600',
//     color: Color.inActiveFieldsColor,
//   },
//   cross100975791Parent: {
//     justifyContent: 'center',
//   },
//   drLauraContainer: {
//     marginLeft: 6,
//     justifyContent: 'center',
//   },
//   frameWrapper39: {
//     marginLeft: 5,
//   },
//   frameWrapper40: {
//     marginLeft: 5,
//   },
//   frameWrapper41: {
//     marginLeft: 5,
//   },
//   frameWrapper42: {
//     marginLeft: 5,
//   },
//   frameWrapper43: {
//     marginLeft: 5,
//   },
//   frameParent8: {
//     overflow: 'hidden',
//   },
//   hospital1Icon: {
//     height: 30,
//     width: 30,
//     overflow: 'hidden',
//   },
//   stJamessHospital: {
//     textAlign: 'center',
//   },
//   stJamessHospitalWrapper: {
//     paddingVertical: Padding.p_10xs,
//     marginLeft: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   frameChild16: {
//     borderRadius: Border.br_xl,
//   },
//   dublin8D08: {
//     color: Color.inActiveFieldsColor,
//     fontFamily: FontFamily.poppinsMedium,
//     fontWeight: '500',
//   },
//   dublin8D08Nhy1IrelandWrapper: {
//     marginLeft: 5,
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection: 'row',
//   },
//   frameParent22: {
//     marginTop: 8,
//     alignSelf: 'stretch',
//     alignItems: 'center',
//     flexDirection: 'row',
//   },
//   doctors: {
//     letterSpacing: 0.2,
//     fontSize: FontSize.size_xs,
//     marginLeft: 5,
//     textAlign: 'left',
//     color: Color.inActiveFieldsColor,
//     fontFamily: FontFamily.poppinsMedium,
//     fontWeight: '500',
//   },
//   glyphParent: {
//     marginLeft: 40,
//     alignItems: 'center',
//     flexDirection: 'row',
//   },
//   frameParent23: {
//     marginTop: 8,
//   },
//   viewDetails: {
//     fontFamily: FontFamily.poppinsSemiBold,
//     fontWeight: '600',
//     color: Color.white,
//     letterSpacing: 0.3,
//   },
//   viewDetailsWrapper: {
//     backgroundColor: Color.green2,
//     borderColor: Color.colorMediumseagreen,
//     paddingHorizontal: Padding.p_31xl,
//     paddingVertical: Padding.p_8xs,
//     marginTop: 11,
//     alignSelf: 'stretch',
//     height: 34,
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection: 'row',
//   },
//   frameWrapper45: {
//     shadowColor: 'rgba(39, 74, 138, 0.1)',
//     borderRadius: Border.br_7xs,
//     shadowOpacity: 1,
//     elevation: 15,
//     shadowRadius: 15,
//     shadowOffset: {
//       width: 2,
//       height: 4,
//     },
//     borderColor: Color.blueStroke,
//     padding: Padding.p_3xs,
//     backgroundColor: Color.white,
//   },
//   frameWrapper46: {
//     marginLeft: 6,
//     shadowColor: 'rgba(39, 74, 138, 0.1)',
//     borderRadius: Border.br_7xs,
//     shadowOpacity: 1,
//     elevation: 15,
//     shadowRadius: 15,
//     shadowOffset: {
//       width: 2,
//       height: 4,
//     },
//     borderColor: Color.blueStroke,
//     padding: Padding.p_3xs,
//     backgroundColor: Color.white,
//   },
//   frameWrapper47: {
//     marginLeft: 6,
//     shadowColor: 'rgba(39, 74, 138, 0.1)',
//     borderRadius: Border.br_7xs,
//     shadowOpacity: 1,
//     elevation: 15,
//     shadowRadius: 15,
//     shadowOffset: {
//       width: 2,
//       height: 4,
//     },
//     borderColor: Color.blueStroke,
//     padding: Padding.p_3xs,
//     backgroundColor: Color.white,
//   },
//   frameGroup: {
//     top: 105,
//     height: 678,
//   },
//   vectorIcon1: {
//     height: 28,
//     width: 28,
//   },
//   vectorContainer: {
//     flexDirection: 'row',
//   },
//   groupIcon1: {
//     height: 28,
//     width: 30,
//   },
//   groupWrapper: {
//     paddingHorizontal: Padding.p_4xs,
//     marginLeft: 58,
//     paddingVertical: Padding.p_3xs,
//   },
//   groupIcon2: {
//     height: 28,
//     width: 24,
//   },
//   groupFrame: {
//     marginLeft: 58,
//     paddingVertical: Padding.p_3xs,
//   },
//   frameChild22: {
//     width: 24,
//     height: 13,
//   },
//   unionIcon: {
//     marginTop: 1,
//     width: 28,
//     height: 15,
//   },
//   groupParent21: {
//     height: 48,
//     marginLeft: 58,
//   },
//   component1: {
//     marginLeft: -215.5,
//     bottom: 0,
//     paddingHorizontal: Padding.p_13xl,
//     paddingVertical: Padding.p_3xs,
//     alignItems: 'center',
//     flexDirection: 'row',
//     left: '50%',
//     backgroundColor: Color.white,
//   },
//   iphone1415ProMax1: {
//     flex: 1,
//     height: 932,
//     overflow: 'hidden',
//     width: '100%',
//     backgroundColor: Color.white,
//   },
// });

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingBottom: hp(2),
  },
  headerContainer: {
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: wp(6),
    color: Color.blue1,
    fontFamily: FontFamily.poppinsMedium,
    marginLeft: wp(2),
  },
  searchContainer: {
    paddingHorizontal: wp(5),
    marginTop: hp(2),
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.fieldsBackground,
    borderRadius: wp(3),
    borderWidth: 1,
    borderColor: Color.blueStroke,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
  },
  searchIcon: {
    width: wp(4),
    height: wp(4),
    marginRight: wp(3),
  },
  searchTextInput: {
    flex: 1,
    fontSize: wp(4),
    height: hp(5),
  },
  sectionContainer: {
    marginTop: hp(3),
    paddingHorizontal: wp(5),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1.5),
  },
  sectionTitle: {
    fontSize: wp(4.5),
    fontFamily: FontFamily.poppinsSemiBold,
    color: Color.blue1,
  },
  seeAllIcon: {
    width: wp(4),
    height: wp(4),
  },
  cardContainer: {
    marginRight: wp(4),
  },
  clinicCard: {
    width: wp(40),
    height: wp(40),
    backgroundColor: '#ddeedf',
    borderRadius: wp(3),
    borderWidth: 1,
    borderColor: Color.blueStroke,
    padding: wp(3),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(39, 74, 138, 0.11)',
    shadowOffset: {width: 2, height: 4},
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
  },
  clinicImage: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    marginBottom: hp(1),
  },
  clinicName: {
    fontSize: wp(3.8),
    fontFamily: FontFamily.poppinsSemiBold,
    color: '#333',
    textAlign: 'center',
    marginBottom: hp(0.5),
  },
  clinicDistance: {
    fontSize: wp(3),
    color: Color.green2,
    fontFamily: FontFamily.poppinsMedium,
  },
  diseaseCard: {
    width: wp(30),
    marginRight: wp(4),
    backgroundColor: '#ddeedf',
    borderRadius: wp(3),
    borderWidth: 1,
    borderColor: Color.blueStroke,
    padding: wp(3),
    alignItems: 'center',
    justifyContent: 'center',
  },
  diseaseImage: {
    width: wp(12),
    height: wp(12),
    marginBottom: hp(1),
  },
  diseaseName: {
    fontSize: wp(3.5),
    color: Color.blue2,
    fontFamily: FontFamily.poppinsMedium,
    textAlign: 'center',
  },
  symptomCard: {
    width: wp(25),
    marginRight: wp(4),
    backgroundColor: '#ddeedf',
    borderRadius: wp(3),
    borderWidth: 1,
    borderColor: Color.blueStroke,
    padding: wp(3),
    alignItems: 'center',
    justifyContent: 'center',
  },
  symptomImage: {
    width: wp(10),
    height: wp(10),
    marginBottom: hp(1),
  },
  symptomName: {
    fontSize: wp(3.2),
    color: Color.blue2,
    fontFamily: FontFamily.poppinsMedium,
    textAlign: 'center',
  },
});