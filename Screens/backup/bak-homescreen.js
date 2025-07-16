import { ScrollView, StyleSheet, Text, TextInput, TextComponent, Button, View, TouchableOpacity, Pressable, Image, PermissionsAndroid, Platform } from "react-native";
import React, { useState, useEffect } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { Padding, Color, FontSize, FontFamily, Border } from "../GlobalStyles";
import axios from 'axios';
import DoctorsScreen from "./DoctorsScreen";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserDetails } from "./Login&Register/authService";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from "react-native-safe-area-context";
import Geolocation from 'react-native-geolocation-service';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';


import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HospitalScreen from "./HospitalsScreen";
import MyAppointment from "./MyAppointment";
import ProfileScreen from "./ProfileScreen";
const Tab = createBottomTabNavigator();

export default function HomeScreen({ props }) {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Retrieve the token from AsyncStorage
        const token = await AsyncStorage.getItem('userToken');

        if (token) {
          // Set the token in the Axios header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          // Make a request to your Laravel API to get the current user
          const response = await axios.get('https://doctors-365.caesar.business/api/user');
          setUsers(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, [])

  useEffect(() => {
    if (Platform.OS === 'android') {

    } else {

    }
  }, []);
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "This app needs access to your location.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getLocation();
      } else {
        console.log("Location permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const getLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        setLocation(position);
      },
      (error) => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  
  const HomePage = () => {
    
  };
 
  
  return (

    <>
 <SafeAreaView style={{ flex: 1 }}>
 <ScrollView vectorContainer>

<View style={[styles.homepageScreen, styles.homepageScreenLayout]}>
  <View style={[styles.statusBarParent, styles.iconParentPosition]}>
    <View style={styles.frameParent}>
      <View style={styles.frameParent}>
        <View style={styles.frameParent}>
          <View style={styles.frameParent}>
            <View style={[styles.frameWrapper, styles.frameWrapperBorder]}>
              <View
                style={[styles.frameParent1, styles.frameParentFlexBox]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                  <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Text style={{ fontSize: 18 }}>
                      <FontAwesome name="bars" color="#420475" style={{ marginLeft: 10, fontSize: 24 }} />
                    </Text>
                  </TouchableOpacity>
                  <Image
                    source={require('../assets/doc365-logo.png')} // Add the path to your logo image
                    style={{ width: 160, height: 40, resizeMode: 'contain', marginLeft: 60 }}
                  />

                  <Image
                    style={{ width: 23, height: 28, marginLeft: 30 }}
                    resizeMode="cover"
                    source={require("../assets/frame.png")}
                  />

                  <Image
                    style={styles.frameChild}
                    resizeMode="cover"
                    source={require("../assets/ellipse-21.png")}
                  />
                  <Image
                    style={[styles.arrowsIcon, styles.arrowsIconLayout]}
                    resizeMode="cover"
                    source={require("../assets/arrows.png")}
                  />




                </View>
              </View>
            </View>
            <View style={[styles.frameParent3, styles.parentSpaceBlock]}>
              <View style={styles.ellipseParent}>


                <View>
                  <Text style={[styles.helloJohn, styles.helloJohnClr]}>
                    {users ? (
                      <Text style={{ fontSize: 17 }}>Hi, {users.name}</Text>
                    ) : (
                      <Text>Loading user details...</Text>
                    )}
                  </Text>
                </View>


              </View>
              <Pressable
                style={styles.ellipseParent}
                onPress={() => navigation.navigate("LocationAccessScreen")}
              >
                <Image
                  style={styles.placeholder2325871Icon}
                  resizeMode="cover"
                  source={require("../assets/placeholder-232587-1.png")}
                />

                <View style={styles.frameParent4}>
                  <View style={styles.galwayWrapper}>

                    <Text style={[styles.galway, styles.galwayTypo]}>
                      <Text>Location not available</Text>
                    </Text>


                  </View>
                  <Image
                    style={[styles.arrowsIcon1, styles.arrowsIconLayout]}
                    resizeMode="cover"
                    source={require("../assets/arrows1.png")}
                  />
                </View>

              </Pressable>
            </View>
          </View>
          <View style={[styles.frameWrapper3, styles.wrapperFlexBox]}>
            <View style={styles.ellipseParent}>
              <Image
                style={styles.vectorIcon}
                resizeMode="cover"
                source={require("../assets/vector.png")}
              />
              <TextInput
                style={{ fontSize: 18, height: '100%' }}
                name="search"
                value={search}
                placeholder="Search Here"
                onChangeText={(text) => setSearch(text)}
              />
            </View>
          </View>
        </View>
        <View style={styles.frameParent5}>
          <View style={[styles.frameParent6, styles.frameParentFlexBox]}>
            <View style={styles.ellipseParent}>
              <View
                style={[
                  styles.calendarPlusAltWrapper,
                  styles.wrapperBorder1,
                ]}
              >
                <Image
                  style={[
                    styles.calendarPlusAltIcon,
                    styles.homepageScreenLayout,
                  ]}
                  resizeMode="cover"
                  source={require("../assets/calendarplusalt.png")}
                />
              </View>
              <Text
                style={[styles.upcomingAppointment, styles.medicineTypo]}
              >
                Upcoming Appointment
              </Text>
            </View>
            <View style={[styles.seeAllParent, styles.parentSpaceBlock]}>
              <Text style={[styles.seeAll, styles.seeAllTypo]}>
                See All
              </Text>
              <Image
                style={styles.frameItem}
                resizeMode="cover"
                source={require("../assets/frame-51.png")}
              />
            </View>
          </View>
          <View style={styles.frameParent8}>
            <View
              style={[
                styles.howCanWeHelpYouTodayWrapper,
                styles.parentSpaceBlock,
              ]}
            >
              <Text style={[styles.howCanWe, styles.galwayTypo]}>
                How can we help you today?
              </Text>
            </View>
            <View style={styles.frameParent8}>
              <View
                style={[styles.frameParent6, styles.frameParentFlexBox]}
              >
                <Pressable
                  style={styles.groupLayout}
                  onPress={() => navigation.navigate("Doctors")}
                >
                  <View
                    style={[styles.groupChild, styles.groupChildShadowBox]}
                  />
                  <Image
                    style={[styles.maskGroupIcon, styles.groupIconPosition]}
                    resizeMode="cover"
                    source={require("../assets/mask-group.png")}
                  />
                  <View
                    style={[
                      styles.frameParent10,
                      styles.frameParentPosition,
                    ]}
                  >

                    <View style={styles.frameParent11}>
                      <View style={styles.videoConsultaionWrapper}>
                        <Text
                          style={[
                            styles.videoConsultaion,
                            styles.medicineTypo,
                          ]}
                        >
                          Video Consultaion
                        </Text>
                      </View>
                      <View style={styles.qualifiedDoctorsWrapper}>
                        <Text
                          style={[
                            styles.qualifiedDoctors,
                            styles.dailyTipsForTypo,
                          ]}
                        >
                          Qualified Doctors
                        </Text>
                      </View>
                    </View>


                    <Image
                      style={[
                        styles.portraitConfidentYoungMedicIcon,
                        styles.portraitIconSpaceBlock,
                      ]}
                      resizeMode="cover"
                      source={require("../assets/portraitconfidentyoungmedicaldoctorwhitebackgroundholdingtablethishands-1.png")}
                    />

                  </View>
                </Pressable>
                <View style={styles.groupLayout}>
                  <Pressable
                    style={styles.groupLayout}
                    onPress={() => navigation.navigate("Doctors")}
                  >
                    <View
                      style={[styles.groupItem, styles.groupChildShadowBox]}
                    />
                    <Image
                      style={[styles.maskGroupIcon, styles.groupIconPosition]}
                      resizeMode="cover"
                      source={require("../assets/mask-group1.png")}
                    />
                    <View style={styles.frameParentPosition}>
                      <View style={styles.frameParent11}>
                        <View style={styles.videoConsultaionWrapper}>
                          <Text
                            style={[
                              styles.videoConsultaion,
                              styles.medicineTypo,
                            ]}
                          >
                            Doctor Appointment
                          </Text>
                        </View>
                        <View style={styles.qualifiedDoctorsWrapper}>
                          <Text
                            style={[
                              styles.qualifiedDoctors,
                              styles.dailyTipsForTypo,
                            ]}
                          >
                            Qualified Doctors
                          </Text>
                        </View>
                      </View>
                      <Image
                        style={[
                          styles.portraitSmilingYoungWomanDIcon,
                          styles.portraitIconSpaceBlock,
                        ]}
                        resizeMode="cover"
                        source={require("../assets/portraitsmilingyoungwomandoctorhealthcaremedicalworkerpointingfingersleftshowingclini-1.png")}
                      />
                    </View>
                  </Pressable>

                </View>
              </View>
              <View style={styles.frameParent8}>
                <View
                  style={[styles.frameParent6, styles.frameParentFlexBox]}
                >
                  <View style={styles.rectangleLayout}>
                    <View
                      style={[styles.groupInner, styles.rectangleLayout]}
                    />
                    <View
                      style={[
                        styles.maskGroupParent,
                        styles.groupIconLayout,
                      ]}
                    >
                      <Image
                        style={[
                          styles.maskGroupIcon2,
                          styles.groupIconLayout,
                        ]}
                        resizeMode="cover"
                        source={require("../assets/mask-group2.png")}
                      />
                      <View style={styles.groupWrapper}>
                        <View
                          style={[
                            styles.groupView,
                            styles.groupIconPosition,
                          ]}
                        >
                          <View
                            style={[
                              styles.frameParent15,
                              styles.iconParentPosition,
                            ]}
                          >
                            <View style={styles.ellipseParent}>
                              <Text style={styles.labTestTypo}>
                                Family Care
                              </Text>
                            </View>
                            <View style={styles.qualifiedDoctorsWrapper}>
                              <Text
                                style={[
                                  styles.qualifiedDoctors,
                                  styles.dailyTipsForTypo,
                                ]}
                              >
                                Subscription Plan
                              </Text>
                            </View>
                          </View>
                          <Image
                            style={styles.fullLengthPortraitSmilingFIcon}
                            resizeMode="cover"
                            source={require("../assets/fulllengthportraitsmilingfamilywithchild-1.png")}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={styles.rectangleLayout}>
                    <View
                      style={[styles.rectangleView, styles.rectangleLayout]}
                    />
                    <View
                      style={[
                        styles.maskGroupParent,
                        styles.groupIconLayout,
                      ]}
                    >
                      <Image
                        style={[
                          styles.maskGroupIcon2,
                          styles.groupIconLayout,
                        ]}
                        resizeMode="cover"
                        source={require("../assets/mask-group3.png")}
                      />
                      <TouchableOpacity onPress={() => navigation.navigate("Hospitals")}>
                        <View style={styles.groupWrapper}>
                          <View
                            style={[
                              styles.frameParent16,
                              styles.groupIconPosition,
                            ]}
                          >
                            <View
                              style={[
                                styles.frameParent15,
                                styles.iconParentPosition,
                              ]}
                            >
                              <View style={styles.videoConsultaionWrapper}>
                                <Text style={styles.labTestTypo}>
                                  Find Hospitals
                                </Text>
                              </View>
                              <View style={styles.qualifiedDoctorsWrapper}>
                                <Text
                                  style={[
                                    styles.qualifiedDoctors,
                                    styles.dailyTipsForTypo,
                                  ]}
                                >
                                  Hospitals near you
                                </Text>
                              </View>
                            </View>
                            <Image
                              style={styles.hospital1Icon}
                              resizeMode="cover"
                              source={require("../assets/hospital-1.png")}
                            />
                          </View>
                        </View>
                      </TouchableOpacity>

                    </View>
                  </View>
                </View>
                <View style={styles.frameParent18}>
                  <View style={styles.frameChildLayout}>
                    <View
                      style={[styles.frameInner, styles.frameChildLayout]}
                    />
                    <Text style={[styles.labTest, styles.labTestTypo]}>
                      Lab Test
                    </Text>
                    <Image
                      style={[styles.groupIcon, styles.groupIconLayout]}
                      resizeMode="cover"
                      source={require("../assets/group-19.png")}
                    />
                  </View>
                  <View
                    style={[styles.frameWrapper4, styles.frameChildLayout]}
                  >
                    <View
                      style={[
                        styles.rectangleParent3,
                        styles.frameChildLayout,
                      ]}
                    >
                      <View
                        style={[
                          styles.frameChild1,
                          styles.frameChildLayout,
                        ]}
                      />
                      <Image
                        style={[styles.groupIcon, styles.groupIconLayout]}
                        resizeMode="cover"
                        source={require("../assets/mask-group4.png")}
                      />
                      <Text style={[styles.labTest, styles.labTestTypo]}>
                        Health Blog
                      </Text>
                      <Image
                        style={styles.medicines1Icon}
                        resizeMode="cover"
                        source={require("../assets/medicines-1.png")}
                      />
                    </View>
                  </View>
                  <View
                    style={[styles.frameWrapper4, styles.frameChildLayout]}
                  >
                    <View
                      style={[styles.frameChild2, styles.frameChildLayout]}
                    />
                    <Image
                      style={[styles.groupIcon, styles.groupIconLayout]}
                      resizeMode="cover"
                      source={require("../assets/mask-group5.png")}
                    />
                    <Text style={[styles.labTest, styles.labTestTypo]}>
                      Weight Loss
                    </Text>
                    <View style={styles.cheerfulGirlLostWeightRejo} />
                    <Image
                      style={styles.happyWomanWithScalesGreenIcon}
                      resizeMode="cover"
                      source={require("../assets/happywomanwithscalesgreenapple-1.png")}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  </View>
</View>
</ScrollView>
 </SafeAreaView>


      
     

    </>

  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "left",
    justifyContent: "left",
    paddingHorizontal: 15,
    paddingVertical: 1,
  },
  DrawerButton: {
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  row: {
    flexDirection: "row"
  },
  "1col": {
    backgroundColor: "#fff",
    borderColor: "#fff",
    borderWidth: 1,
    flex: 1
  },
  "2col": {
    backgroundColor: "#fff",
    borderColor: "#fff",
    borderWidth: 1,
    flex: 2
  },
  "3col": {
    backgroundColor: "#fff",
    borderColor: "#fff",
    borderWidth: 1,
    flex: 3
  },
  "4col": {
    flex: 4
  },
  homepageScreenLayout: {
    width: "100%",
    flex: 1,
    overflow: "hidden",
    marginLeft: -10,
    right: 0,
  },
  iconParentPosition: {
    left: 0,
    top: 0,
  },
  frameParentFlexBox: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  parentSpaceBlock: {
    paddingHorizontal: 0,
    paddingVertical: Padding.p_3xs,
    flexDirection: "row",
  },
  time1Layout: {
    height: 18,
    alignItems: "center",
  },
  capIconPosition: {
    left: "50%",
    position: "absolute",
  },
  frameWrapperBorder: {
    borderColor: Color.blueStroke,
    borderStyle: "solid",
  },
  arrowsIconLayout: {
    height: 25,
    width: 25,
  },
  helloJohnClr: {
    color: Color.headingColor,
    textAlign: "center",
  },
  galwayTypo: {
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: "500",
    lineHeight: 20,
  },
  wrapperFlexBox: {
    paddingHorizontal: Padding.p_xs,
    alignItems: "center",
    flexDirection: "row",
  },
  wrapperBorder1: {
    backgroundColor: Color.fieldsBackground,
    borderColor: Color.blueStroke,
    borderWidth: 1,
    borderStyle: "solid",
  },
  medicineTypo: {
    fontFamily: FontFamily.poppinsSemiBold,
    fontWeight: "600",
  },
  seeAllTypo: {
    fontSize: FontSize.size_mini,
    textAlign: "left",
  },
  groupChildShadowBox: {
    shadowOpacity: 1,
    elevation: 11,
    shadowRadius: 11,
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowColor: "rgba(39, 74, 138, 0.1)",
    borderRadius: Border.br_3xs,
    borderColor: Color.blueStroke,
    borderWidth: 1,
    borderStyle: "solid",
    left: 0,
    top: 0,
    position: "absolute",
  },
  groupIconPosition: {
    left: 1,
    top: 1,
  },
  frameParentPosition: {
    alignItems: "flex-end",
    height: 182,
    width: 176,
    left: 7,
    top: 7,
    position: "absolute",
  },
  dailyTipsForTypo: {
    fontSize: FontSize.size_xs,
    textAlign: "left",
    color: Color.blue1,
  },
  portraitIconSpaceBlock: {
    marginTop: 6,
    height: 138,
  },
  rectangleLayout: {
    height: 90,
    width: 190,
  },
  groupIconLayout: {
    height: 88,
    position: "absolute",
  },
  frameChildLayout: {
    width: 123,
    height: 90,
  },
  labTestTypo: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.poppinsSemiBold,
    fontWeight: "600",
    textAlign: "left",
    color: Color.blue1,
  },
  frameWrapperLayout: {
    height: 91,
    width: 245,
    padding: Padding.p_3xs,
    borderRadius: Border.br_3xs,
    borderColor: Color.blueStroke,
    borderWidth: 1,
    borderStyle: "solid",
    flexDirection: "row",
    backgroundColor: Color.white,
  },
  closeUpDoctorWithStethoscoGroupLayout: {
    width: 224,
    height: 70,
    alignItems: "center",
    flexDirection: "row",
  },
  wrapperBorder: {
    paddingVertical: Padding.p_10xs,
    paddingHorizontal: Padding.p_7xs,
    borderColor: Color.green2,
    backgroundColor: Color.colorHoneydew_100,
    borderRadius: Border.br_8xs,
    borderWidth: 1,
    borderStyle: "solid",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  time1: {
    fontSize: FontSize.size_mid,
    lineHeight: 22,
    fontFamily: FontFamily.poppinsRegular,
    color: Color.white,
    display: "flex",
    width: 34,
    textAlign: "center",
    justifyContent: "center",
  },
  time: {
    width: 68,
    height: 40,
    paddingVertical: Padding.p_3xs,
    justifyContent: "center",
    alignItems: "center",
  },
  cellularConnectionIcon: {
    width: 19,
    height: 12,
  },
  wifiIcon: {
    width: 17,
    marginLeft: 7,
    height: 12,
  },
  border: {
    height: "100%",
    marginLeft: -13.65,
    top: "0%",
    bottom: "0%",
    borderRadius: Border.br_8xs_3,
    borderColor: Color.white,
    opacity: 0.35,
    width: 25,
    borderStyle: "solid",
    borderWidth: 1,
    left: "50%",
    position: "absolute",
  },
  capIcon: {
    height: "31.54%",
    marginLeft: 12.35,
    top: "36.92%",
    bottom: "31.54%",
    width: 1,
    opacity: 0.4,
    maxHeight: "100%",
  },
  capacity: {
    height: "69.23%",
    marginLeft: -11.65,
    top: "15.38%",
    bottom: "15.38%",
    borderRadius: Border.br_10xs_5,
    width: 21,
    backgroundColor: Color.white,
  },
  battery: {
    width: 27,
    height: 13,
    marginLeft: 7,
  },
  cellularConnectionParent: {
    width: 78,
    flexDirection: "row",
  },
  statusBar: {
    backgroundColor: Color.blue1,
    height: 50,
    paddingRight: Padding.p_xl,
    flexDirection: "row",
    alignSelf: "stretch",
  },
  icon: {
    width: 29,
    height: 22,
  },
  iconWrapper: {
    width: 33,
    paddingHorizontal: 2,
    paddingVertical: Padding.p_8xs,
    justifyContent: "center",
  },
  image1Icon: {
    borderRadius: Border.br_5xs,
    width: 35,
    height: 34,
    position: "absolute",
  },
  image7Icon: {
    top: 9,
    left: 40,
    width: 104,
    height: 17,
    position: "absolute",
  },
  image1Parent: {
    width: 144,
    height: 34,
  },
  frameIcon: {
    width: 23,
    height: 28,
  },
  frameChild: {
    width: 26,
    height: 26,
  },
  arrowsIcon: {
    marginLeft: 2,
  },
  ellipseParent: {
    alignItems: "center",
    flexDirection: "row",
  },
  frameWrapper1: {
    borderRadius: Border.br_xl,
    padding: Padding.p_9xs,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: Color.blueStroke,
  },
  frameParent2: {
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",


  },
  frameParent1: {
    width: 370,
    flexDirection: "row",

  },
  frameWrapper: {
    borderBottomWidth: 1,
    paddingHorizontal: Padding.p_xl,
    paddingVertical: 14,
    alignSelf: "stretch",
  },
  helloJohn: {
    fontSize: FontSize.size_5xl,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: "500",
    lineHeight: 25,
  },
  placeholder2325871Icon: {
    width: 22,
    height: 22,
    overflow: "hidden",
  },
  galway: {
    textAlign: "left",
    color: Color.blue1,
  },
  galwayWrapper: {
    paddingVertical: 3,
    paddingHorizontal: Padding.p_9xs,
    alignItems: "center",
    flexDirection: "row",
  },
  arrowsIcon1: {
    marginLeft: 6,
  },
  frameParent4: {
    marginLeft: 2,
    alignItems: "center",
    flexDirection: "row",
  },
  frameParent3: {
    marginTop: 10,
    width: 390,
    paddingVertical: Padding.p_3xs,
    justifyContent: "space-between",
    alignItems: "center",

  },
  frameParent: {
    alignItems: "center",
    alignSelf: "stretch",
  },
  vectorIcon: {
    height: 24,
    width: 24,
  },
  findADoctor: {
    color: Color.inActiveFieldsColor,
    marginLeft: 10,
    textAlign: "center",
  },
  frameWrapper3: {
    height: 52,
    paddingVertical: Padding.p_smi,
    backgroundColor: Color.fieldsBackground,
    borderColor: Color.blueStroke,
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: Border.br_3xs,
    paddingHorizontal: Padding.p_xs,
    marginTop: 10,
    width: 350,
    marginLeft: -30,
  },
  calendarPlusAltIcon: {
    maxWidth: "100%",
    maxHeight: "100%",
    alignSelf: "stretch",
    overflow: "hidden",
  },
  calendarPlusAltWrapper: {
    borderRadius: Border.br_7xs,
    width: 38,
    height: 38,
    padding: Padding.p_7xs,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  upcomingAppointment: {
    fontSize: FontSize.size_mini,
    textAlign: "left",
    color: Color.blue1,
    lineHeight: 20,
    marginLeft: 10,
  },
  seeAll: {
    lineHeight: 15,
    color: Color.colorMediumseagreen,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: "500",
  },
  frameItem: {
    borderRadius: 8,
    width: 15,
    marginLeft: 4,
    height: 15,
  },
  seeAllParent: {
    paddingVertical: Padding.p_3xs,
  },
  frameParent6: {
    flexDirection: "row",
    alignSelf: "stretch",
  },
  howCanWe: {
    color: Color.blue1,
    textAlign: "center",
  },
  howCanWeHelpYouTodayWrapper: {
    paddingVertical: Padding.p_3xs,
    justifyContent: "center",
    alignItems: "center",
  },
  groupChild: {
    backgroundColor: "#f1f8fe",
    height: 190,
    width: 190,
  },
  maskGroupIcon: {
    height: 188,
    width: 188,
    position: "absolute",
  },
  videoConsultaion: {
    fontSize: FontSize.size_base,
    lineHeight: 24,
    textAlign: "left",
    color: Color.blue1,
  },
  videoConsultaionWrapper: {
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  qualifiedDoctors: {
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: "500",
  },
  qualifiedDoctorsWrapper: {
    marginTop: -4,

    flexDirection: "row",
  },
  frameParent11: {
    alignSelf: "stretch",
  },
  portraitConfidentYoungMedicIcon: {
    width: 94,
  },
  frameParent10: {
    justifyContent: "center",
  },
  groupLayout: {
    height: 190,
    width: 190,
  },
  groupItem: {
    backgroundColor: "#ffeef2",
    height: 190,
    width: 190,
  },
  portraitSmilingYoungWomanDIcon: {
    width: 127,
    borderBottomRightRadius: Border.br_7xs,
  },
  groupInner: {
    backgroundColor: "rgba(203, 255, 218, 0.52)",
    shadowOpacity: 1,
    elevation: 11,
    shadowRadius: 11,
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowColor: "rgba(39, 74, 138, 0.1)",
    borderRadius: Border.br_3xs,
    borderColor: Color.blueStroke,
    borderWidth: 1,
    borderStyle: "solid",
    left: 0,
    top: 0,
    position: "absolute",
  },
  maskGroupIcon2: {
    zIndex: 0,
    width: 188,
    left: 0,
    top: 0,
  },
  frameParent15: {
    position: "absolute",
  },
  fullLengthPortraitSmilingFIcon: {
    left: 96,
    borderBottomRightRadius: Border.br_4xs,
    width: 86,
    height: 87,
    top: 0,
    position: "absolute",
  },
  groupView: {
    width: 182,
    height: 87,
    position: "absolute",
  },
  groupWrapper: {
    width: 179,
    zIndex: 1,
    height: 87,
    marginTop: 10,
  },
  maskGroupParent: {
    paddingVertical: 0,
    width: 188,
    left: 1,
    top: 1,
    paddingHorizontal: Padding.p_9xs,
  },
  rectangleView: {
    backgroundColor: "rgba(244, 234, 255, 0.52)",
    shadowOpacity: 1,
    elevation: 11,
    shadowRadius: 11,
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowColor: "rgba(39, 74, 138, 0.1)",
    borderRadius: Border.br_3xs,
    borderColor: Color.blueStroke,
    borderWidth: 1,
    borderStyle: "solid",
    left: 0,
    top: 0,
    position: "absolute",
  },
  hospital1Icon: {
    top: 16,
    left: 108,
    width: 75,
    height: 71,
    position: "absolute",
  },
  frameParent16: {
    width: 183,
    height: 87,
    position: "absolute",
  },
  frameInner: {
    backgroundColor: "rgba(255, 235, 223, 0.52)",
    shadowOpacity: 1,
    elevation: 11,
    shadowRadius: 11,
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowColor: "rgba(39, 74, 138, 0.1)",
    borderRadius: Border.br_3xs,
    borderColor: Color.blueStroke,
    borderWidth: 1,
    borderStyle: "solid",
    left: 0,
    top: 0,
    position: "absolute",
  },
  labTest: {
    top: 5,
    left: 5,
    position: "absolute",
  },
  groupIcon: {
    width: 121,
    left: 1,
    top: 1,
  },
  frameChild1: {
    backgroundColor: "#e0ffff",
    shadowOpacity: 1,
    elevation: 11,
    shadowRadius: 11,
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowColor: "rgba(39, 74, 138, 0.1)",
    borderRadius: Border.br_3xs,
    borderColor: Color.blueStroke,
    borderWidth: 1,
    borderStyle: "solid",
    left: 0,
    top: 0,
    position: "absolute",
  },
  medicines1Icon: {
    top: 32,
    left: 20,
    width: 102,
    height: 57,
    position: "absolute",
  },
  rectangleParent3: {
    left: 0,
    top: 0,
    position: "absolute",
  },
  frameWrapper4: {
    marginLeft: 10,
  },
  frameChild2: {
    backgroundColor: "#fff1d3",
    shadowOpacity: 1,
    elevation: 11,
    shadowRadius: 11,
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowColor: "rgba(39, 74, 138, 0.1)",
    borderRadius: Border.br_3xs,
    borderColor: Color.blueStroke,
    borderWidth: 1,
    borderStyle: "solid",
    left: 0,
    top: 0,
    position: "absolute",
  },
  cheerfulGirlLostWeightRejo: {
    top: 20,
    left: 62,
    width: 58,
    height: 69,
    position: "absolute",
  },
  happyWomanWithScalesGreenIcon: {
    top: 15,
    left: 67,
    width: 52,
    height: 74,
    borderBottomRightRadius: Border.br_7xs,
    position: "absolute",
  },
  frameParent18: {
    marginTop: 10,
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  frameParent8: {
    marginTop: 10,
    alignSelf: "stretch",
  },
  frameParent5: {
    marginTop: 15,
    width: 340,
    marginLeft: -45,
  },
  healthBlogs: {
    color: Color.headingColor,
    textAlign: "center",
  },
  femaleHandsShowingPlushHeaIcon: {
    borderRadius: Border.br_4xs,
    width: 70,
    height: 70,
  },
  dailyTipsFor: {
    fontFamily: FontFamily.poppinsSemiBold,
    fontWeight: "600",
  },
  dailyTipsForPrioritizingYoWrapper: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  medicine: {
    fontSize: FontSize.size_3xs,
    color: Color.green2,
    textAlign: "left",
  },
  tipsWrapper: {
    marginLeft: 8,
  },
  frameParent22: {
    marginTop: 10,
    alignItems: "center",
    flexDirection: "row",
  },
  frameParent21: {
    width: 149,
    marginLeft: 6,
  },
  femaleHandsShowingPlushHeaParent: {
    height: 70,
  },
  frameWrapper5: {
    padding: Padding.p_3xs,
  },
  frameWrapper6: {
    padding: Padding.p_3xs,
    marginLeft: 10,
  },
  closeUpDoctorWithStethoscoGroup: {
    height: 70,
    justifyContent: "center",
  },
  frameParent19: {
    marginTop: 10,
    width: 390,
  },
  statusBarParent: {
    width: 430,
    position: "absolute",
  },
  vectorIcon1: {
    width: 28,
    height: 28,
  },
  vectorWrapper: {
    padding: Padding.p_3xs,
    alignItems: "center",
    flexDirection: "row",
  },
  groupIcon1: {
    width: 30,
    height: 28,
  },
  groupWrapper1: {
    paddingHorizontal: Padding.p_4xs,
    marginLeft: 58,
    paddingVertical: Padding.p_3xs,
  },
  groupIcon2: {
    width: 24,
    height: 28,
  },
  groupWrapper2: {
    marginLeft: 58,
    paddingVertical: Padding.p_3xs,
  },
  frameChild3: {
    width: 24,
    height: 13,
  },
  unionIcon: {
    marginTop: 1,
    width: 28,
    height: 15,
  },
  groupParent1: {
    height: 48,
    marginLeft: 58,
    padding: Padding.p_3xs,
    alignItems: "center",
  },
  component1: {
    marginLeft: -215.5,
    bottom: 0,
    paddingHorizontal: Padding.p_13xl,
    borderWidth: 1,
    borderColor: Color.blueStroke,
    left: "50%",
    position: "absolute",
    paddingVertical: Padding.p_3xs,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: Color.white,
  },
  homepageScreen: {
    height: 960,
    overflow: "hidden",
    backgroundColor: Color.white,
  },

  smallIcon: {
    fontSize: 40,
    // marginRight: 10,
  },



});
