import React, { useEffect, useState } from 'react';
import {ScrollView , View,Text, TextInput , ActivityIndicator , StyleSheet,Image, TouchableOpacity} from "react-native";
import { Padding, FontFamily, FontSize, Border, Color } from "../../GlobalStyles";
import { TouchEventType } from 'react-native-gesture-handler/lib/typescript/TouchEventType';
import { useNavigation } from "@react-navigation/native";
import { getDoctors } from '../../utils/Api';
import { getDiseases } from '../../utils/Api';
import { getSpecialist } from '../../utils/Api';
import { getHospitalList } from '../../utils/Api';
export default function DoctorsScreen({props}){
  const navigation = useNavigation();
  const[search, setSearch]= useState('');
  const [doctors, setDoctors] = useState([]);
  const[diseases, setDiseases]= useState([]);
  const[specialist, setSpecialist]= useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const loadDoctors = async () => {
      const response = await getDoctors();
      setDoctors(response.data);
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
  
  useEffect(() => {
    const fetchHospits = async () => {
      try {
        const response = await getHospitalList();
        setHospitals(response.data);
        
        //console.log(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHospits();
  }, []);
  

  if (loading) {
    return <Text>
      <ActivityIndicator size={"large"} style={{alignItems:'center'}}/>
    </Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }
  const handleSpecialistPress = (specialistId) => {
    navigation.navigate('DoctorsList', { specialistId });
  };
  const ShowDoctorsProfile = (doctorId) => {
    navigation.navigate('DoctorProfile', { doctorId });
  }
    return(
        <>
        <ScrollView vectorContainer>
        <View style={styles.iphone1415ProMax1}>
          <View style={[styles.frameParent, styles.framePosition]}>
           
            <View style={styles.findADoctorWrapper}>
              <Text style={[styles.findADoctor, styles.seeAllTypo]}>
                Find a Doctor
              </Text>
            </View>
          </View>
          <View style={[styles.iphone1415ProMax1Inner, styles.groupFrameFlexBox]}>
            <View style={styles.vectorParent}>
              <Image
                style={styles.vectorIcon}
                resizeMode="cover"
                source={require("../../assets/vector.png")}
              />
             
              <TextInput style={{fontSize: 28, height: '100%'}}
               name="search"
               placeholder='Search a Doctor'
               value={search}
               onChangeText={(text) => setSearch(text)}
              />

            
            </View>
          </View>
          <View style={[styles.frameGroup, styles.framePosition]}>
            <View style={styles.frameContainer}>
              <View style={[styles.frameView, styles.statusBarFlexBox]}>
                <View
                  style={[
                    styles.availableDoctorsWrapper,
                    styles.parentFrameSpaceBlock,
                  ]}
                >
                  <Text style={[styles.availableDoctors, styles.mbbsTypo]}>
                    Available Doctors
                  </Text>
                </View>
                <View style={[styles.seeAllParent, styles.parentFrameSpaceBlock]}>
                  <Text style={[styles.seeAll, styles.seeAllFlexBox]}>See All</Text>
                  <Image
                    style={[styles.frameItem, styles.frameIconLayout]}
                    resizeMode="cover"
                    source={require("../../assets/frame-511.png")}
                  />
                </View>
              </View>
              <ScrollView horizontal>
              <View style={[styles.frameParent1, styles.parentFrameSpaceBlock]}>
              {doctors.map((doctor, index) => (
                <TouchableOpacity key={index} onPress={() => ShowDoctorsProfile(doctor.id)}>
                  <View style={styles.frameWrapperShadowBox2}>

                    <View style={styles.groupParent}>
                      <View style={styles.image8IconLayout}>
                        <Image
                          style={[styles.image8Icon, styles.image8IconPosition]}
                          resizeMode="cover"
                          source={require("../../assets/image-8.png")}
                        />
                        <Image
                          style={[styles.groupChild, styles.groupLayout]}
                          resizeMode="cover"
                          source={require("../../assets/ellipse-23.png")}
                        />
                      </View>

                      <View style={styles.drLauraParent}>
                        <Text style={[styles.drLaura, styles.drNiaTypo]}>
                          {doctor.first_name} {doctor.last_name}
                        </Text>
                        <Text style={[styles.mbbs, styles.mbbsTypo]}>{doctor.specialist}</Text>
                      </View>

                    </View>

                  </View>

                </TouchableOpacity>
              )
              )
                    }
              </View>
              </ScrollView>
              
            </View>
            <View style={styles.frameParentSpaceBlock}>
              <View style={[styles.frameView, styles.statusBarFlexBox]}>
                <View style={styles.vectorParent}>
                  <Text style={[styles.availableDoctors, styles.mbbsTypo]}>
                    Top Diseases
                  </Text>
                </View>
                <View style={[styles.seeAllParent, styles.parentFrameSpaceBlock]}>
                  <Text style={[styles.seeAll, styles.seeAllFlexBox]}>See All</Text>
                  <Image
                    style={[styles.frameItem, styles.frameIconLayout]}
                    resizeMode="cover"
                    source={require("../../assets/frame-511.png")}
                  />
                </View>
              </View>
              <ScrollView horizontal>
              <View style={[styles.frameParent4, styles.parentFrameSpaceBlock]}>
              {diseases.map((disease, index) => (
                <View key={index} style={styles.frameWrapperShadowBox}>
                  <View style={styles.groupParent7}>
                    <Image
                      style={[styles.groupIcon, styles.iconLayout]}
                      resizeMode="cover"
                      source={require("../../assets/group-20.png")}
                    />
                    <View style={styles.frameWrapper9}>
                      <View style={styles.dengueFeverWrapper}>
                        <Text style={[styles.dengueFever, styles.feverTypo]}>
                         {disease.name}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )
              )
                }
                 
              </View>
              </ScrollView>
              
            </View>
           
            <View style={styles.frameParentSpaceBlock}>
              <View style={[styles.frameView, styles.statusBarFlexBox]}>
                <View style={styles.vectorParent}>
                  <Text style={[styles.availableDoctors, styles.mbbsTypo]}>
                    Common Symtoms
                  </Text>
                </View>
                <View style={[styles.seeAllParent, styles.parentFrameSpaceBlock]}>
                  <Text style={[styles.seeAll, styles.seeAllFlexBox]}>See All</Text>
                  <Image
                    style={[styles.frameItem, styles.frameIconLayout]}
                    resizeMode="cover"
                    source={require("../../assets/frame-511.png")}
                  />
                </View>
              </View>
              <ScrollView horizontal>
              <View style={[styles.frameParent4, styles.parentFrameSpaceBlock]}>
              {specialist.map((row, index) => (
                <TouchableOpacity key={index}  onPress={() => handleSpecialistPress(row.id)}>
                  <View style={styles.frameWrapperShadowBox}>
                  <View style={styles.frameWrapper14Layout}>
                    <Image
                      style={[styles.groupIcon, styles.iconLayout]}
                      resizeMode="cover"
                      source={require("../../assets/-x32-6-heart.png")}
                    />
                    <View style={styles.frameWrapper26}>
                      <View style={styles.dengueFeverWrapper}>
                        <Text style={[styles.dengueFever, styles.feverTypo]}>
                          {row.title}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                
                </TouchableOpacity>
                 )
                )
                  }
                
              </View>
              </ScrollView>
            </View>
            <View style={[styles.frameParent8, styles.frameParentSpaceBlock]}>
              <View style={[styles.frameView, styles.statusBarFlexBox]}>
                <View style={styles.vectorParent}>
                  <Text style={[styles.availableDoctors, styles.mbbsTypo]}>
                    Doctors Near You
                  </Text>
                </View>
                <View style={[styles.seeAllParent, styles.parentFrameSpaceBlock]}>
                  <Text style={[styles.seeAll, styles.seeAllFlexBox]}>See All</Text>
                  <Image
                    style={[styles.frameItem, styles.frameIconLayout]}
                    resizeMode="cover"
                    source={require("../../assets/frame-52.png")}
                  />
                </View>
              </View>
              <View style={[styles.frameParent4, styles.parentFrameSpaceBlock]}>
                <View style={styles.vectorParent}>
                  <View style={styles.frameWrapperShadowBox3}>
                    <View style={styles.dengueFeverWrapper}>
                      <View style={[styles.groupIcon, styles.iconLayout]}>
                        <Image
                          style={[styles.image8Icon1, styles.iconLayout]}
                          resizeMode="cover"
                          source={require("../../assets/image-81.png")}
                        />
                        <Image
                          style={styles.groupChild5}
                          resizeMode="cover"
                          source={require("../../assets/ellipse-232.png")}
                        />
                      </View>
                      <View style={styles.drLauraContainer}>
                        <Text style={[styles.drLaura2, styles.drLaura2Typo]}>
                          Dr. Laura
                        </Text>
                        <View style={styles.parentFlexBox1}>
                          <Image
                            style={[styles.frameChild9, styles.frameIconLayout]}
                            resizeMode="cover"
                            source={require("../../assets/frame-208.png")}
                          />
                          <Text style={[styles.kmAway, styles.kmAwayTypo]}>
                            2 km away
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.cross100975791Parent,
                            styles.parentFlexBox1,
                          ]}
                        >
                          <Image
                            style={[
                              styles.cross100975791Icon,
                              styles.frameIconLayout,
                            ]}
                            resizeMode="cover"
                            source={require("../../assets/cross-10097579-1.png")}
                          />
                          <Text style={[styles.dentist, styles.kmAwayTypo]}>
                            Dentist
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View
                    style={[styles.frameWrapper39, styles.frameWrapperShadowBox3]}
                  >
                    <View style={styles.dengueFeverWrapper}>
                      <View style={[styles.groupIcon, styles.iconLayout]}>
                        <Image
                          style={[styles.image8Icon1, styles.iconLayout]}
                          resizeMode="cover"
                          source={require("../../assets/image-81.png")}
                        />
                        <Image
                          style={styles.groupChild5}
                          resizeMode="cover"
                          source={require("../../assets/ellipse-232.png")}
                        />
                      </View>
                      <View style={styles.drLauraContainer}>
                        <Text style={[styles.drLaura2, styles.drLaura2Typo]}>
                          Dr. Laura
                        </Text>
                        <View style={styles.parentFlexBox1}>
                          <Image
                            style={[styles.frameChild9, styles.frameIconLayout]}
                            resizeMode="cover"
                            source={require("../../assets/frame-208.png")}
                          />
                          <Text style={[styles.kmAway, styles.kmAwayTypo]}>
                            2 km away
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.cross100975791Parent,
                            styles.parentFlexBox1,
                          ]}
                        >
                          <Image
                            style={[
                              styles.cross100975791Icon,
                              styles.frameIconLayout,
                            ]}
                            resizeMode="cover"
                            source={require("../../assets/cross-10097579-1.png")}
                          />
                          <Text style={[styles.dentist, styles.kmAwayTypo]}>
                            Dentist
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View
                    style={[styles.frameWrapper40, styles.frameWrapperShadowBox3]}
                  >
                    <View style={styles.dengueFeverWrapper}>
                      <View style={[styles.groupIcon, styles.iconLayout]}>
                        <Image
                          style={[styles.image8Icon1, styles.iconLayout]}
                          resizeMode="cover"
                          source={require("../../assets/image-81.png")}
                        />
                        <Image
                          style={styles.groupChild5}
                          resizeMode="cover"
                          source={require("../../assets/ellipse-232.png")}
                        />
                      </View>
                      <View style={styles.drLauraContainer}>
                        <Text style={[styles.drLaura2, styles.drLaura2Typo]}>
                          Dr. Laura
                        </Text>
                        <View style={styles.parentFlexBox1}>
                          <Image
                            style={[styles.frameChild9, styles.frameIconLayout]}
                            resizeMode="cover"
                            source={require("../../assets/frame-208.png")}
                          />
                          <Text style={[styles.kmAway, styles.kmAwayTypo]}>
                            2 km away
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.cross100975791Parent,
                            styles.parentFlexBox1,
                          ]}
                        >
                          <Image
                            style={[
                              styles.cross100975791Icon,
                              styles.frameIconLayout,
                            ]}
                            resizeMode="cover"
                            source={require("../../assets/cross-10097579-1.png")}
                          />
                          <Text style={[styles.dentist, styles.kmAwayTypo]}>
                            Dentist
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View
                    style={[styles.frameWrapper41, styles.frameWrapperShadowBox3]}
                  >
                    <View style={styles.dengueFeverWrapper}>
                      <View style={[styles.groupIcon, styles.iconLayout]}>
                        <Image
                          style={[styles.image8Icon1, styles.iconLayout]}
                          resizeMode="cover"
                          source={require("../../assets/image-81.png")}
                        />
                        <Image
                          style={styles.groupChild5}
                          resizeMode="cover"
                          source={require("../../assets/ellipse-232.png")}
                        />
                      </View>
                      <View style={styles.drLauraContainer}>
                        <Text style={[styles.drLaura2, styles.drLaura2Typo]}>
                          Dr. Laura
                        </Text>
                        <View style={styles.parentFlexBox1}>
                          <Image
                            style={[styles.frameChild9, styles.frameIconLayout]}
                            resizeMode="cover"
                            source={require("../../assets/frame-208.png")}
                          />
                          <Text style={[styles.kmAway, styles.kmAwayTypo]}>
                            2 km away
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.cross100975791Parent,
                            styles.parentFlexBox1,
                          ]}
                        >
                          <Image
                            style={[
                              styles.cross100975791Icon,
                              styles.frameIconLayout,
                            ]}
                            resizeMode="cover"
                            source={require("../../assets/cross-10097579-1.png")}
                          />
                          <Text style={[styles.dentist, styles.kmAwayTypo]}>
                            Dentist
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View
                    style={[styles.frameWrapper42, styles.frameWrapperShadowBox3]}
                  >
                    <View style={styles.dengueFeverWrapper}>
                      <View style={[styles.groupIcon, styles.iconLayout]}>
                        <Image
                          style={[styles.image8Icon1, styles.iconLayout]}
                          resizeMode="cover"
                          source={require("../../assets/image-81.png")}
                        />
                        <Image
                          style={styles.groupChild5}
                          resizeMode="cover"
                          source={require("../../assets/ellipse-232.png")}
                        />
                      </View>
                      <View style={styles.drLauraContainer}>
                        <Text style={[styles.drLaura2, styles.drLaura2Typo]}>
                          Dr. Laura
                        </Text>
                        <View style={styles.parentFlexBox1}>
                          <Image
                            style={[styles.frameChild9, styles.frameIconLayout]}
                            resizeMode="cover"
                            source={require("../../assets/frame-208.png")}
                          />
                          <Text style={[styles.kmAway, styles.kmAwayTypo]}>
                            2 km away
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.cross100975791Parent,
                            styles.parentFlexBox1,
                          ]}
                        >
                          <Image
                            style={[
                              styles.cross100975791Icon,
                              styles.frameIconLayout,
                            ]}
                            resizeMode="cover"
                            source={require("../../assets/cross-10097579-1.png")}
                          />
                          <Text style={[styles.dentist, styles.kmAwayTypo]}>
                            Dentist
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View
                    style={[styles.frameWrapper43, styles.frameWrapperShadowBox3]}
                  >
                    <View style={styles.dengueFeverWrapper}>
                      <View style={[styles.groupIcon, styles.iconLayout]}>
                        <Image
                          style={[styles.image8Icon1, styles.iconLayout]}
                          resizeMode="cover"
                          source={require("../../assets/image-81.png")}
                        />
                        <Image
                          style={styles.groupChild5}
                          resizeMode="cover"
                          source={require("../../assets/ellipse-232.png")}
                        />
                      </View>
                      <View style={styles.drLauraContainer}>
                        <Text style={[styles.drLaura2, styles.drLaura2Typo]}>
                          Dr. Laura
                        </Text>
                        <View style={styles.parentFlexBox1}>
                          <Image
                            style={[styles.frameChild9, styles.frameIconLayout]}
                            resizeMode="cover"
                            source={require("../../assets/frame-208.png")}
                          />
                          <Text style={[styles.kmAway, styles.kmAwayTypo]}>
                            2 km away
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.cross100975791Parent,
                            styles.parentFlexBox1,
                          ]}
                        >
                          <Image
                            style={[
                              styles.cross100975791Icon,
                              styles.frameIconLayout,
                            ]}
                            resizeMode="cover"
                            source={require("../../assets/cross-10097579-1.png")}
                          />
                          <Text style={[styles.dentist, styles.kmAwayTypo]}>
                            Dentist
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.frameParentSpaceBlock}>
              <View style={styles.frameContainer}>
                <View style={[styles.frameView, styles.statusBarFlexBox]}>
                  <View style={styles.vectorParent}>
                    <Text style={[styles.availableDoctors, styles.mbbsTypo]}>
                      Hospitals Near you
                    </Text>
                  </View>
                  <View style={[styles.seeAllParent, styles.parentFrameSpaceBlock]}>
                    <Text style={[styles.seeAll, styles.seeAllFlexBox]}>
                      See All
                    </Text>
                    <Image
                      style={[styles.frameItem, styles.frameIconLayout]}
                      resizeMode="cover"
                      source={require("../../assets/frame-52.png")}
                    />
                  </View>
                </View>
                <View style={[styles.frameParent4, styles.parentFrameSpaceBlock]}>
                  <View style={[styles.frameWrapper45, styles.frameWrapperBorder]}>
                    <View>
                      <View>
                        <View style={styles.parentFlexBox}>
                          <Image
                            style={styles.hospital1Icon}
                            resizeMode="cover"
                            source={require("../../assets/hospital-11.png")}
                          />
                          <View
                            style={[
                              styles.stJamessHospitalWrapper,
                              styles.parentFrameSpaceBlock,
                            ]}
                          >
                            <Text
                              style={[styles.stJamessHospital, styles.drLaura2Typo]}
                            >
                              St James's Hospital
                            </Text>
                          </View>
                        </View>
                        <View style={styles.frameParent22}>
                          <Image
                            style={[styles.frameChild16, styles.frameChildLayout]}
                            resizeMode="cover"
                            source={require("../../assets/frame-183.png")}
                          />
                          <View style={styles.dublin8D08Nhy1IrelandWrapper}>
                            <Text
                              style={[styles.dublin8D08, styles.dublin8D08Typo]}
                            >
                              Dublin 8, D08 NHY1, Ireland
                            </Text>
                          </View>
                        </View>
                        <View style={[styles.frameParent23, styles.parentFlexBox]}>
                          <View style={styles.vectorParent}>
                            <Image
                              style={styles.frameChildLayout}
                              resizeMode="cover"
                              source={require("../../assets/frame-186.png")}
                            />
                            <Text style={styles.doctors}>30 Doctors</Text>
                          </View>
                          <View style={styles.glyphParent}>
                            <Image
                              style={styles.frameIconLayout}
                              resizeMode="cover"
                              source={require("../../assets/glyph.png")}
                            />
                            <Text style={styles.doctors}>24 hrs</Text>
                          </View>
                        </View>
                      </View>
                      <View
                        style={[
                          styles.viewDetailsWrapper,
                          styles.frameWrapperBorder,
                        ]}
                      >
                        <Text style={[styles.viewDetails, styles.dublin8D08Typo]}>
                          View Details
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={[styles.frameWrapper46, styles.frameWrapperBorder]}>
                    <View>
                      <View>
                        <View style={styles.parentFlexBox}>
                          <Image
                            style={styles.hospital1Icon}
                            resizeMode="cover"
                            source={require("../../assets/hospital-11.png")}
                          />
                          <View
                            style={[
                              styles.stJamessHospitalWrapper,
                              styles.parentFrameSpaceBlock,
                            ]}
                          >
                            <Text
                              style={[styles.stJamessHospital, styles.drLaura2Typo]}
                            >
                              St James's Hospital
                            </Text>
                          </View>
                        </View>
                        <View style={styles.frameParent22}>
                          <Image
                            style={[styles.frameChild16, styles.frameChildLayout]}
                            resizeMode="cover"
                            source={require("../../assets/frame-183.png")}
                          />
                          <View style={styles.dublin8D08Nhy1IrelandWrapper}>
                            <Text
                              style={[styles.dublin8D08, styles.dublin8D08Typo]}
                            >
                              Dublin 8, D08 NHY1, Ireland
                            </Text>
                          </View>
                        </View>
                        <View style={[styles.frameParent23, styles.parentFlexBox]}>
                          <View style={styles.vectorParent}>
                            <Image
                              style={styles.frameChildLayout}
                              resizeMode="cover"
                              source={require("../../assets/frame-186.png")}
                            />
                            <Text style={styles.doctors}>30 Doctors</Text>
                          </View>
                          <View style={styles.glyphParent}>
                            <Image
                              style={styles.frameIconLayout}
                              resizeMode="cover"
                              source={require("../../assets/glyph.png")}
                            />
                            <Text style={styles.doctors}>24 hrs</Text>
                          </View>
                        </View>
                      </View>
                      <View
                        style={[
                          styles.viewDetailsWrapper,
                          styles.frameWrapperBorder,
                        ]}
                      >
                        <Text style={[styles.viewDetails, styles.dublin8D08Typo]}>
                          View Details
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={[styles.frameWrapper47, styles.frameWrapperBorder]}>
                    <View>
                      <View>
                        <View style={styles.parentFlexBox}>
                          <Image
                            style={styles.hospital1Icon}
                            resizeMode="cover"
                            source={require("../../assets/hospital-11.png")}
                          />
                          <View
                            style={[
                              styles.stJamessHospitalWrapper,
                              styles.parentFrameSpaceBlock,
                            ]}
                          >
                            <Text
                              style={[styles.stJamessHospital, styles.drLaura2Typo]}
                            >
                              St James's Hospital
                            </Text>
                          </View>
                        </View>
                        <View style={styles.frameParent22}>
                          <Image
                            style={[styles.frameChild16, styles.frameChildLayout]}
                            resizeMode="cover"
                            source={require("../../assets/frame-183.png")}
                          />
                          <View style={styles.dublin8D08Nhy1IrelandWrapper}>
                            <Text
                              style={[styles.dublin8D08, styles.dublin8D08Typo]}
                            >
                              Dublin 8, D08 NHY1, Ireland
                            </Text>
                          </View>
                        </View>
                        <View style={[styles.frameParent23, styles.parentFlexBox]}>
                          <View style={styles.vectorParent}>
                            <Image
                              style={styles.frameChildLayout}
                              resizeMode="cover"
                              source={require("../../assets/frame-186.png")}
                            />
                            <Text style={styles.doctors}>30 Doctors</Text>
                          </View>
                          <View style={styles.glyphParent}>
                            <Image
                              style={styles.frameIconLayout}
                              resizeMode="cover"
                              source={require("../../assets/glyph.png")}
                            />
                            <Text style={styles.doctors}>24 hrs</Text>
                          </View>
                        </View>
                      </View>
                      <View
                        style={[
                          styles.viewDetailsWrapper,
                          styles.frameWrapperBorder,
                        ]}
                      >
                        <Text style={[styles.viewDetails, styles.dublin8D08Typo]}>
                          View Details
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

        </View>
        </ScrollView>
        

      </>
    )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "left",
    justifyContent: "left",
    paddingHorizontal:15,
    paddingVertical:1,
  },
  textHeading:{
     textAlign:'center',
     fontSize:26,
     color:'green',
     fontWeight:'bold',
     marginBottom:20,
  },
  statusBarFlexBox: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  parentFrameSpaceBlock: {
    paddingHorizontal: 0,
    flexDirection: "row",
   
    
  },
  time1Layout: {
    height: 18,
    alignItems: "center",
  },
  framePosition: {
    width: 390,
    left: 20,
    position: "absolute",
    marginBottom:0,
  },
  vectorSpaceBlock: {
    padding: Padding.p_3xs,
    alignItems: "center",
  },
  seeAllTypo: {
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: "500",
  },
  groupFrameFlexBox: {
    paddingHorizontal: Padding.p_xs,
    alignItems: "center",
    flexDirection: "row",
  },
  findADoctor1Typo: {
    fontSize: FontSize.size_lg,
    textAlign: "center",
  },
  mbbsTypo: {
    fontFamily: FontFamily.poppinsSemiBold,
    fontWeight: "600",
  },
  seeAllFlexBox: {
    textAlign: "left",
    lineHeight: 16,
  },
  frameIconLayout: {
    height: 16,
    width: 16,
  },
  image8IconPosition: {
    borderRadius: Border.br_3xl,
    left: 0,
    position: "absolute",
  },
  groupLayout: {
    height: 7,
    width: 7,
    top: 0,
    position: "absolute",
  },
  drNiaTypo: {
    lineHeight: 16,
    fontSize: FontSize.size_sm,
    color: Color.blue1,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: "500",
    textAlign: "center",
  },
  frameWrapperShadowBox2: {
    paddingHorizontal: Padding.p_5xs,
    borderRadius: Border.br_5xs,
    shadowOpacity: 1,
    elevation: 15,
    shadowRadius: 15,
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowColor: "rgba(39, 74, 138, 0.11)",
    borderColor: Color.blueStroke,
    borderWidth: 1,
    borderStyle: "solid",
    paddingVertical: Padding.p_3xs,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: Color.white,
    marginLeft:5,
  },
  drNiaLayout: {
    width: 64,
    alignItems: "center",
  },
  iconLayout: {
    width: 36,
    height: 36,
  },
  feverTypo: {
    color: Color.blue2,
    lineHeight: 16,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: "500",
    textAlign: "center",
  },
  frameWrapperShadowBox: {
    paddingHorizontal: Padding.p_8xs,
    width: 130,
    shadowColor: "rgba(39, 74, 138, 0.1)",
    shadowOpacity: 1,
    elevation: 15,
    shadowRadius: 15,
    shadowOffset: {
      width: 2,
      height: 4,
    },
    borderColor: Color.blueStroke,
    borderRadius: Border.br_3xs,
    borderWidth: 1,
    borderStyle: "solid",
    paddingVertical: Padding.p_3xs,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Color.white,
    marginLeft:5,
  },
  frameWrapper14Layout: {
    width: 90,
    alignItems: "center",
  },
  frameParentSpaceBlock: {
    marginTop: 10,
    alignSelf: "stretch",
  },
  drLaura2Typo: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.poppinsSemiBold,
    fontWeight: "600",
    color: Color.blue1,
  },
  kmAwayTypo: {
    marginLeft: 3,
    fontSize: FontSize.size_xs,
    textAlign: "center",
  },
  parentFlexBox1: {
    marginTop: 3,
    alignItems: "center",
    flexDirection: "row",
  },
  frameWrapperShadowBox3: {
    borderRadius: Border.br_5xs,
    shadowOpacity: 1,
    elevation: 15,
    shadowRadius: 15,
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowColor: "rgba(39, 74, 138, 0.11)",
    borderColor: Color.blueStroke,
    padding: Padding.p_3xs,
    borderWidth: 1,
    borderStyle: "solid",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: Color.white,
  },
  frameWrapperBorder: {
    borderRadius: Border.br_7xs,
    borderWidth: 1,
    borderStyle: "solid",
  },
  frameChildLayout: {
    width: 18,
    height: 18,
  },
  dublin8D08Typo: {
    letterSpacing: 0.3,
    fontSize: FontSize.size_sm,
    textAlign: "left",
  },
  parentFlexBox: {
    width: 216,
    alignItems: "center",
    flexDirection: "row",
  },
  component1Border: {
    borderColor: Color.blueStroke,
    borderWidth: 1,
    borderStyle: "solid",
    position: "absolute",
  },
  time1: {
    fontSize: FontSize.size_mid,
    lineHeight: 22,
    width: 34,
    height: 18,
    display: "flex",
    textAlign: "center",
    color: Color.white,
    fontFamily: FontFamily.poppinsRegular,
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
    width: 25,
    opacity: 0.35,
    borderWidth: 1,
    borderStyle: "solid",
    left: "50%",
    position: "absolute",
  },
  capIcon: {
    height: "31.54%",
    marginLeft: 12.35,
    top: "36.92%",
    bottom: "31.54%",
    maxHeight: "100%",
    width: 1,
    opacity: 0.4,
    left: "50%",
    position: "absolute",
  },
  capacity: {
    height: "69.23%",
    marginLeft: -11.65,
    top: "15.38%",
    bottom: "15.38%",
    borderRadius: Border.br_10xs_5,
    width: 21,
    left: "50%",
    position: "absolute",
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
    marginLeft: -215,
    backgroundColor: Color.blue1,
    width: 430,
    height: 50,
    paddingRight: Padding.p_xl,
    left: "50%",
    top: 0,
    position: "absolute",
  },
  frameChild: {
    maxWidth: "100%",
    height: 15,
    overflow: "hidden",
  },
  vectorWrapper: {
    borderColor: Color.subHeading,
    height: 34,
    justifyContent: "center",
    backgroundColor: Color.fieldsBackground,
    padding: Padding.p_3xs,
    borderRadius: Border.br_xl,
    borderWidth: 1,
    borderStyle: "solid",
    width: 34,
  },
  findADoctor: {
    fontSize: FontSize.size_5xl,
    color: Color.blue1,
    
  },
  findADoctorWrapper: {
   
    paddingHorizontal: Padding.p_3xs,
    paddingVertical: 0,
   
    textAlign:'left',
    alignItems:'flex-start',
    justifyContent:'flex-start',
   
    flexDirection: "row",
  },
  frameParent: {
    top: 3,
   
    flexDirection: "row",
    
  },
  vectorIcon: {
    height: 24,
    width: 24,
  },
  findADoctor1: {
    lineHeight: 20,
    marginLeft: 10,
    color: Color.inActiveFieldsColor,
    fontFamily: FontFamily.poppinsRegular,
    fontSize: FontSize.size_lg,
  },
  vectorParent: {
    alignItems: "center",
    flexDirection: "row",
  },
  iphone1415ProMax1Inner: {
    top: 50,
    height: 52,
    paddingVertical: Padding.p_smi,
    borderColor: Color.blueStroke,
    borderWidth: 1,
    borderStyle: "solid",
    position: "absolute",
    borderRadius: Border.br_3xs,
    paddingHorizontal: Padding.p_xs,
    backgroundColor: Color.fieldsBackground,
    width: 360,
    left: 20,
  },
  availableDoctors: {
    fontSize: FontSize.size_lg,
    textAlign: "center",
    color: Color.blue1,
  },
  availableDoctorsWrapper: {
    paddingVertical: Padding.p_9xs,
    alignItems: "center",
  },
  seeAll: {
    fontSize: FontSize.size_mini,
    color: Color.colorMediumseagreen,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: "500",
  },
  frameItem: {
    borderRadius: Border.br_3xs_5,
    marginLeft: 4,
  },
  seeAllParent: {
    paddingVertical: Padding.p_3xs,
  },
  frameView: {
    alignSelf: "stretch",
  },
  image8Icon: {
    height: 42,
    width: 42,
    top: 0,
  },
  groupChild: {
    left: 31,
  },
  image8IconLayout: {
    height: 42,
    width: 42,
  },
  drLaura: {
    fontSize: FontSize.size_sm,
  },
  mbbs: {
    fontSize: FontSize.size_3xs,
    lineHeight: 10,
    color: Color.green2,
    alignSelf: "stretch",
    textAlign: "center",
  },
  drLauraParent: {
    marginTop: 8,
  },
  groupParent: {
    alignItems: "center",
  },
  groupItem: {
    left: 30,
  },
  drChloeParent: {
    marginTop: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  frameWrapper1: {
    marginLeft: 5,
  },
  drRach: {
    fontSize: FontSize.size_sm,
    lineHeight: 16,
    color: Color.blue1,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: "500",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
  },
  frameWrapper2: {
    marginLeft: 5,
  },
  drKateParent: {
    marginTop: 8,
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center",
  },
  frameWrapper3: {
    marginLeft: 5,
  },
  text: {
    letterSpacing: -2,
  },
  frameWrapper4: {
    marginLeft: 5,
  },
  image12Icon: {
    top: 1,
    height: 42,
    width: 42,
  },
  image12Parent: {
    height: 43,
    width: 42,
  },
  drNiaTxtContainer: {
    width: "100%",
  },
  drNia: {
    fontSize: FontSize.size_sm,
    lineHeight: 16,
    color: Color.blue1,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: "500",
    textAlign: "center",
    display: "flex",
  },
  frameWrapper5: {
    marginLeft: 5,
  },
  drKatieParent: {
    marginTop: 8,
    alignSelf: "stretch",
  },
  frameWrapper6: {
    marginLeft: 5,
  },
  frameWrapper7: {
    marginLeft: 5,
  },
  frameParent1: {
    height: 116,
    alignSelf: "stretch",
    paddingVertical: Padding.p_3xs,
    alignItems: "center",
  },
  frameContainer: {
    alignSelf: "stretch",
  },
  groupIcon: {
    height: 36,
  },
  dengueFever: {
    fontSize: FontSize.size_sm,
  },
  dengueFeverWrapper: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  frameWrapper9: {
    width: 98,
    marginTop: 8,
    justifyContent: "center",
  },
  groupParent7: {
    justifyContent: "center",
    alignItems: "center",
  },
  typhoidFever: {
    fontSize: FontSize.size_sm,
    marginTop: 8,
    alignSelf: "stretch",
  },
  groupParent8: {
    width: 99,
    alignItems: "center",
  },
  frameWrapper11: {
    justifyContent: "center",
  },
  frameWrapper10: {
    marginLeft: 5,
  },
  groupParent9: {
    width: 70,
    alignItems: "center",
  },
  frameWrapper14: {
    justifyContent: "center",
  },
  frameWrapper13: {
    marginLeft: 5,
  },
  migraine: {
    fontSize: FontSize.size_smi,
    marginTop: 8,
    alignSelf: "stretch",
  },
  groupParent10: {
    width: 58,
    alignItems: "center",
  },
  frameWrapper16: {
    marginLeft: 5,
  },
  frameChild4: {
    width: 28,
    height: 36,
  },
  groupParent11: {
    width: 55,
    alignItems: "center",
  },
  frameWrapper19: {
    marginLeft: 5,
  },
  groupParent12: {
    width: 112,
    alignItems: "center",
  },
  frameWrapper22: {
    marginLeft: 5,
  },
  frameParent4: {
    alignSelf: "stretch",
    paddingVertical: Padding.p_3xs,
    alignItems: "center",
  },
  frameWrapper26: {
    marginTop: 8,
    alignSelf: "stretch",
    justifyContent: "center",
  },
  skin77449491Icon: {
    height: 36,
    overflow: "hidden",
  },
  frameWrapper27: {
    marginLeft: 5,
  },
  groupParent13: {
    width: 77,
    alignItems: "center",
  },
  frameWrapper29: {
    marginLeft: 5,
  },
  groupParent14: {
    width: 62,
    alignItems: "center",
  },
  frameWrapper31: {
    marginLeft: 5,
  },
  frameWrapper33: {
    marginLeft: 5,
  },
  frameWrapper35: {
    marginLeft: 5,
  },
  image8Icon1: {
    height: 36,
    borderRadius: Border.br_3xl,
    left: 0,
    position: "absolute",
    top: 0,
  },
  groupChild5: {
    left: 27,
    width: 6,
    height: 6,
    top: 0,
    position: "absolute",
  },
  drLaura2: {
    textAlign: "left",
    lineHeight: 16,
  },
  frameChild9: {
    borderRadius: Border.br_xl,
  },
  kmAway: {
    color: Color.subHeading,
    width: 66,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: "500",
    height: 18,
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
  cross100975791Icon: {
    overflow: "hidden",
  },
  dentist: {
    fontFamily: FontFamily.poppinsSemiBold,
    fontWeight: "600",
    color: Color.inActiveFieldsColor,
  },
  cross100975791Parent: {
    justifyContent: "center",
  },
  drLauraContainer: {
    marginLeft: 6,
    justifyContent: "center",
  },
  frameWrapper39: {
    marginLeft: 5,
  },
  frameWrapper40: {
    marginLeft: 5,
  },
  frameWrapper41: {
    marginLeft: 5,
  },
  frameWrapper42: {
    marginLeft: 5,
  },
  frameWrapper43: {
    marginLeft: 5,
  },
  frameParent8: {
    overflow: "hidden",
  },
  hospital1Icon: {
    height: 30,
    width: 30,
    overflow: "hidden",
  },
  stJamessHospital: {
    textAlign: "center",
  },
  stJamessHospitalWrapper: {
    paddingVertical: Padding.p_10xs,
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  frameChild16: {
    borderRadius: Border.br_xl,
  },
  dublin8D08: {
    color: Color.inActiveFieldsColor,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: "500",
  },
  dublin8D08Nhy1IrelandWrapper: {
    marginLeft: 5,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  frameParent22: {
    marginTop: 8,
    alignSelf: "stretch",
    alignItems: "center",
    flexDirection: "row",
  },
  doctors: {
    letterSpacing: 0.2,
    fontSize: FontSize.size_xs,
    marginLeft: 5,
    textAlign: "left",
    color: Color.inActiveFieldsColor,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: "500",
  },
  glyphParent: {
    marginLeft: 40,
    alignItems: "center",
    flexDirection: "row",
  },
  frameParent23: {
    marginTop: 8,
  },
  viewDetails: {
    fontFamily: FontFamily.poppinsSemiBold,
    fontWeight: "600",
    color: Color.white,
    letterSpacing: 0.3,
  },
  viewDetailsWrapper: {
    backgroundColor: Color.green2,
    borderColor: Color.colorMediumseagreen,
    paddingHorizontal: Padding.p_31xl,
    paddingVertical: Padding.p_8xs,
    marginTop: 11,
    alignSelf: "stretch",
    height: 34,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  frameWrapper45: {
    shadowColor: "rgba(39, 74, 138, 0.1)",
    borderRadius: Border.br_7xs,
    shadowOpacity: 1,
    elevation: 15,
    shadowRadius: 15,
    shadowOffset: {
      width: 2,
      height: 4,
    },
    borderColor: Color.blueStroke,
    padding: Padding.p_3xs,
    backgroundColor: Color.white,
  },
  frameWrapper46: {
    marginLeft: 6,
    shadowColor: "rgba(39, 74, 138, 0.1)",
    borderRadius: Border.br_7xs,
    shadowOpacity: 1,
    elevation: 15,
    shadowRadius: 15,
    shadowOffset: {
      width: 2,
      height: 4,
    },
    borderColor: Color.blueStroke,
    padding: Padding.p_3xs,
    backgroundColor: Color.white,
  },
  frameWrapper47: {
    marginLeft: 6,
    shadowColor: "rgba(39, 74, 138, 0.1)",
    borderRadius: Border.br_7xs,
    shadowOpacity: 1,
    elevation: 15,
    shadowRadius: 15,
    shadowOffset: {
      width: 2,
      height: 4,
    },
    borderColor: Color.blueStroke,
    padding: Padding.p_3xs,
    backgroundColor: Color.white,
  },
  frameGroup: {
    top: 184,
    height: 678,
  },
  vectorIcon1: {
    height: 28,
    width: 28,
  },
  vectorContainer: {
    flexDirection: "row",
  },
  groupIcon1: {
    height: 28,
    width: 30,
  },
  groupWrapper: {
    paddingHorizontal: Padding.p_4xs,
    marginLeft: 58,
    paddingVertical: Padding.p_3xs,
  },
  groupIcon2: {
    height: 28,
    width: 24,
  },
  groupFrame: {
    marginLeft: 58,
    paddingVertical: Padding.p_3xs,
  },
  frameChild22: {
    width: 24,
    height: 13,
  },
  unionIcon: {
    marginTop: 1,
    width: 28,
    height: 15,
  },
  groupParent21: {
    height: 48,
    marginLeft: 58,
  },
  component1: {
    marginLeft: -215.5,
    bottom: 0,
    paddingHorizontal: Padding.p_13xl,
    paddingVertical: Padding.p_3xs,
    alignItems: "center",
    flexDirection: "row",
    left: "50%",
    backgroundColor: Color.white,
  },
  iphone1415ProMax1: {
    flex: 1,
    height: 932,
    overflow: "hidden",
    width: "100%",
    backgroundColor: Color.white,
  },
 
});