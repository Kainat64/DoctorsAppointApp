import React from "react";
import {StyleSheet, Text, View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import "react-native-gesture-handler";
import { createDrawerNavigator } from "@react-navigation/drawer";
const Drawer = createDrawerNavigator();
import SplashScreen1 from "../Screens/splash/SplashScreen1";
import SplashScreen2 from '../Screens/splash/SplashScreen2';
import SplashScreen3 from '../Screens/splash/SplashScreen3';
import SplashScreen4 from '../Screens/splash/SplashScreen4';
import LoginPage from '../Screens/Login&Register/Login';
import RegisterPage from '../Screens/Login&Register/Register';
import HomeScreen from '../Screens/HomeScreen';
import HospitalScreen from "../Screens/Hospitals/HospitalsScreen";
import DoctorsScreen from "../Screens/Doctors/DoctorsScreen";
import MyAppointment from "../Screens/Appointments/MyAppointment";
import MyDoctorsScreen from "../Screens/Doctors/MyDoctorsScreen";
import ProfileScreen from "../Screens/Profile/ProfileScreen";
import CustomDrawer from '../Screens/CustomDrawer';
import DoctorsList from "../Screens/Doctors/DoctorsList";
import BookAppointment from "../Screens/BookingAppointments/BookAppointment";
import DoctorProfileDetails from "../Screens/Doctors/DoctorsProfileScreen";
import VideoConsultion from "../Screens/BookingAppointments/VideoConsultation";
import HospitalProfile from "../Screens/Hospitals/HospitalProfileScreen";
const AppNavigation = () => {
    return (
        <Drawer.Navigator initialRouteName='Splash' drawerContent={(props) => <CustomDrawer {...props} />}>
        <Drawer.Screen name="Splash" component={SplashScreen1} 
            options={{
              drawerItemStyle: { display: 'none' } , headerShown:false
            }}
            />
            <Drawer.Screen name="Splash2" component={SplashScreen2} 
            options={{
              drawerItemStyle: { display: 'none' } , headerShown:false
            }}/>
            <Drawer.Screen name="Splash3" component={SplashScreen3} 
            options={{
              drawerItemStyle: { display: 'none' } , headerShown:false
            }}/>
             <Drawer.Screen name="Splash4" component={SplashScreen4} 
            options={{
              drawerItemStyle: { display: 'none' } , headerShown:false
            }}/>
            <Drawer.Screen name="Login" component={LoginPage} 
    
            options={{
              drawerItemStyle: { display: 'none' }, headerShown:false
            }}/>
            <Drawer.Screen name="Register" component={RegisterPage} 
    
            options={{
              drawerItemStyle: { display: 'none' } , headerShown:false
            }}/>
    
             <Drawer.Screen  name="Home"  component={HomeScreen} options={{ headerShown: false, alignItems:'center' }}
            />
            
            <Drawer.Screen name="MyAppointment" component={MyAppointment} />
            <Drawer.Screen name="Doctors" component={DoctorsScreen} />
            <Drawer.Screen name="DoctorsList" component={DoctorsList} />
            <Drawer.Screen name="My Doctors" component={MyDoctorsScreen} />
            <Drawer.Screen name="Hospitals" component={HospitalScreen} />
            <Drawer.Screen name="Hospital Profile" component={HospitalProfile} 
           
    
           options={{
             drawerItemStyle: { display: 'none' }
           }}/>
            <Drawer.Screen name="My Profile" component={ProfileScreen} />
           <Drawer.Screen name="DoctorProfile" component={DoctorProfileDetails} 
           
    
            options={{
              drawerItemStyle: { display: 'none' }
            }}/>
             <Drawer.Screen name="Book Appointment" component={BookAppointment} 
           
    
           options={{
             drawerItemStyle: { display: 'none' }
           }}/>
            <Drawer.Screen name="Video Consultation" component={VideoConsultion} 
           
    
           options={{
             drawerItemStyle: { display: 'none' }
           }}/>
            
          </Drawer.Navigator>
    );
}
export default AppNavigation;