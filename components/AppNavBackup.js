/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SplashScreen1 from '../Screens/splash/SplashScreen1';
import SplashScreen2 from '../Screens/splash/SplashScreen2';
import SplashScreen3 from '../Screens/splash/SplashScreen3';
import SplashScreen4 from '../Screens/splash/SplashScreen4';
import LoginPage from '../Screens/Login&Register/Login';
import RegisterPage from '../Screens/Login&Register/Register';
import HomeScreen from '../Screens/HomeScreen';
import HospitalScreen from '../Screens/Hospitals/HospitalsScreen';
import DoctorsScreen from '../Screens/Doctors/DoctorsScreen';
import MyAppointment from '../Screens/Appointments/MyAppointment';
import MyDoctorsScreen from '../Screens/Doctors/MyDoctorsScreen';
import ProfileScreen from '../Screens/Profile/ProfileScreen';
import DoctorsList from '../Screens/Doctors/DoctorsList';
import BookAppointment from '../Screens/BookingAppointments/BookAppointment';
import DoctorProfileDetails from '../Screens/Doctors/DoctorsProfileScreen';
import VideoConsultion from '../Screens/BookingAppointments/VideoConsultation';
import HospitalProfile from '../Screens/Hospitals/HospitalProfileScreen';
import MedicalRecordScreen from '../Screens/Prescriptions/MedicalRecordScreen';
import ChatScreen from '../Screens/Chat/ChatScreen';
import DocumentAttachment from '../Screens/Prescriptions/DocumentAttachment';
import DocumentsListScreen from '../Screens/Prescriptions/DocumentsListScreen';
import AddReviewScreen from '../Screens/Doctors/ReviewsScreen';
import ReviewSuccessScreen from '../Screens/Doctors/ReviewsSuccessScreen';
import HealthPlan from '../Screens/FamilyHealth/HealthPlan';
import FamilyHealthPlans from '../Screens/FamilyHealth/FamilyHealthPlan';
import PregnancyCareScreen from '../Screens/FamilyHealth/PregnancyPlan';
import AvailableTestsScreen from '../Screens/LabTest/AvailableTestsScreen';
import BookLabTestScreen from '../Screens/LabTest/BookLabTestScreen ';

import OtherScreen from '../Screens/LabTest/OtherScreen';
import ConfirmLabsTestScreen from '../Screens/LabTest/ConfirmLabsTestScreen';
import BlogPostScreen from '../Screens/Blog/BlogPostScreen';
import BlogDetailScreen from '../Screens/Blog/BlogDetailScreen';
import PlanScreen from '../Screens/WeightLoss.js/PlanScreen';
import WeightLossDoctorList from '../Screens/WeightLoss.js/WeightLoss';
import VoiceConsultationScreen from '../Screens/VoiceConsultation/VoiceConsultationScreen';
import BookVoiceConsultationScreen from '../Screens/VoiceConsultation/BookVoiceConsultationScreen';
import ZoomMeetScreen from '../Screens/VoiceConsultation/ZoomMeetScreen';
import JoinMeetingScreen from '../Screens/VoiceConsultation/JoinMeetScreen';
import PaymentScreen from '../Screens/VoiceConsultation/PaymentScreen ';
import StripeProviderScreen from '../Screens/VoiceConsultation/StripeProviderScreen';
import StripeCheckoutScreen from '../Screens/VoiceConsultation/StripeCheckoutScreen';
import PaymentSuccessScreen from '../Screens/VoiceConsultation/PaymentSuccessScreen';
import SearchDoctorScreen from '../Screens/Doctors/SearchDoctorScreen';
import DoctorsListScreen from '../Screens/Doctors/DoctorsListScreen';
import ContactScreen from '../Screens/ContactScreen';
import DoctorFormScreen from '../Screens/Registration/DoctorFormScreen';
import PrescriptionHistoryScreen from '../Screens/Prescription/PrescriptionScreen';
import PrescriptionDetailScreen from '../Screens/Prescription/PrescriptionDetailScreen';
import AppShareScreen from '../Screens/Share/AppShareScreen';
import CustomDrawer from '../Screens/CustomDrawer';
import {useAuth} from '../AuthContext'; // Correct import for AuthContext
import WeightLossTipsScreen from '../Screens/WeightLoss.js/WeightLossTipsScreen';
import ComingSoonScreen from '../Screens/FamilyHealth/ComingSoonScreen';
import ResetPasswordScreen from '../Screens/Login&Register/ResetPasswordScreen';
import ForgotPasswordScreen from '../Screens/Login&Register/ForgotPasswordScreen';
import SearchClinic from '../Screens/Hospitals/SearchClinic'
import Clinics from '../Screens/Hospitals/Clinics';
// Auth stack for login/register flows
const AuthStack = createNativeStackNavigator();
const AuthNavigator = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen
      name="Splash1"
      component={SplashScreen1}
      options={{headerShown: false}}
    />
    <AuthStack.Screen
      name="Splash2"
      component={SplashScreen2}
      options={{headerShown: false}}
    />
    <AuthStack.Screen
      name="Splash3"
      component={SplashScreen3}
      options={{headerShown: false}}
    />
    <AuthStack.Screen
      name="Splash4"
      component={SplashScreen4}
      options={{headerShown: false}}
    />
    <AuthStack.Screen
      name="Login"
      component={LoginPage}
      options={{headerShown: false}}
    />
    <AuthStack.Screen
      name="Register"
      component={RegisterPage}
      options={{headerShown: false}}
    />
    <AuthStack.Screen
      name="ResetPassword"
      component={ResetPasswordScreen}
      options={{headerShown: false}}
    />
    <AuthStack.Screen
      name="ForgotPassword"
      component={ForgotPasswordScreen}
      options={{headerShown: false}}
    />
  </AuthStack.Navigator>
);

// Main app stack for logged-in users
const Drawer = createDrawerNavigator();
const AppNavigator = () => (
  <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />}>
    <Drawer.Screen
      name="Home"
      component={HomeScreen}
      options={{
        headerShown: false,
        drawerIcon: ({color, size}) => (
          <FontAwesome name="home" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen
      name="My Profile"
      component={ProfileScreen}
      options={{
        drawerIcon: ({color, size}) => (
          <FontAwesome name="user" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen
      name="MyAppointment"
      component={MyAppointment}
      options={{
        drawerIcon: ({color, size}) => (
          <FontAwesome name="calendar" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen
      name="Prescription"
      component={PrescriptionHistoryScreen}
      options={{
        drawerIcon: ({color, size}) => (
          <FontAwesome name="medkit" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen
      name="Prescription Detail"
      component={PrescriptionDetailScreen}
      options={{
        drawerItemStyle: {display: 'none'},
      }}
    />
    <Drawer.Screen
      name="Doctors"
      component={DoctorsScreen}
      options={{
        title: 'Clinics',
        drawerItemStyle: {display: 'none'}, // This sets the displayed title
        drawerIcon: ({color, size}) => (
          <FontAwesome name="user-md" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen
      name="DoctorsList"
      component={DoctorsList}
      options={{
        drawerIcon: ({color, size}) => (
          <FontAwesome name="list" size={size} color={color} />
        ),
        drawerItemStyle: {display: 'none'},
      }}
    />
    <Drawer.Screen
      name="My Doctors"
      component={MyDoctorsScreen}
      options={{
        drawerItemStyle: {display: 'none'},
        drawerIcon: ({color, size}) => (
          <FontAwesome name="user-md" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen
      name="Clinics"
      component={HospitalScreen}
      options={{
        drawerItemStyle: {display: 'none'},
       
      }}
    />
        <Drawer.Screen
      name="Clinics List"
      component={Clinics}
      options={{
        drawerItemStyle: {display: 'none'},
       
      }}
    />
    <Drawer.Screen
      name="Hospital Profile"
      component={HospitalProfile}
      options={{
        title: 'Clinic Profile',
        drawerItemStyle: {display: 'none'},
      }}
    />
    <Drawer.Screen
      name="Search Clinic"
      component={SearchClinic}
      options={{
        drawerItemStyle: {display: 'none'},
      }}
    />
    <Drawer.Screen
      name="DoctorProfile"
      component={DoctorProfileDetails}
      options={{
        drawerItemStyle: {display: 'none'},
      }}
    />
    <Drawer.Screen
      name="Book Appointment"
      component={BookAppointment}
      options={{
        drawerItemStyle: {display: 'none'},
      }}
    />
    <Drawer.Screen
      name="Video Consultation"
      component={VideoConsultion}
      options={{
        drawerItemStyle: {display: 'none'},
      }}
    />
    <Drawer.Screen
      name="MedicalRecord"
      component={MedicalRecordScreen}
      options={{
        drawerItemStyle: {display: 'none'},
      }}
    />
    <Drawer.Screen
      name="Chat"
      component={ChatScreen}
      options={{
        drawerIcon: ({color, size}) => (
          <FontAwesome name="wechat" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen
      name="Attachment"
      component={DocumentAttachment}
      options={{
        drawerItemStyle: {display: 'none'},
      }}
    />
    <Drawer.Screen
      name="DocumentList"
      component={DocumentsListScreen}
      options={{
        drawerItemStyle: {display: 'none'},
      }}
    />
    <Drawer.Screen
      name="Reviews"
      component={AddReviewScreen}
      options={{
        drawerItemStyle: {display: 'none'},
      }}
    />
    <Drawer.Screen
      name="Appointment Success"
      component={ReviewSuccessScreen}
      options={{
        drawerItemStyle: {display: 'none'},
      }}
    />
    <Drawer.Screen
      name="HealthPlan"
      component={HealthPlan}
      options={{
        drawerItemStyle: {display: 'none'},
      }}
    />
    <Drawer.Screen
      name="Family Plan"
      component={FamilyHealthPlans}
      options={{
        drawerItemStyle: {display: 'none'},
      }}
    />
    <Drawer.Screen
      name="Pregnancy Plan"
      component={PregnancyCareScreen}
      options={{
        drawerItemStyle: {display: 'none'},
      }}
    />
    <Drawer.Screen
      name="Available Test"
      component={AvailableTestsScreen}
      options={{
        drawerItemStyle: {display: 'none'},
      }}
    />
    <Drawer.Screen
      name="Book Lab"
      component={BookLabTestScreen}
      options={{
        drawerItemStyle: {display: 'none'},
      }}
    />
    <Drawer.Screen
      name="OtherScreen"
      component={OtherScreen}
      options={{
        drawerItemStyle: {display: 'none'},
      }}
    />
    <Drawer.Screen
      name="Confirm Test"
      component={ConfirmLabsTestScreen}
      options={{
        drawerItemStyle: {display: 'none'},
      }}
    />
    <Drawer.Screen
      name="Blogs"
      component={BlogPostScreen}
      options={{
        drawerIcon: ({color, size}) => <Ionicons name="reader" size={22} />,
      }}
    />
    <Drawer.Screen
      name="Blog Detail"
      component={BlogDetailScreen}
      options={{
        drawerItemStyle: {display: 'none'},
      }}
    />
    <Drawer.Screen
      name="Weight Loss"
      component={PlanScreen}
      options={{
        drawerItemStyle: {display: 'none'},
      }}
    />
    <Drawer.Screen
      name="Weight Loss Reviews"
      component={WeightLossDoctorList}
      options={{
        drawerItemStyle: {display: 'none'},
      }}
    />
    <Drawer.Screen
      name="Voice Consultation"
      component={VoiceConsultationScreen}
      options={{
        drawerItemStyle: {display: 'none'},
      }}
    />
    <Drawer.Screen
      name="Book Voice Consultation"
      component={BookVoiceConsultationScreen}
      options={{
        drawerItemStyle: {display: 'none'},
      }}
    />
    <Drawer.Screen
      name="Zoom Meet"
      component={ZoomMeetScreen}
      options={{
        drawerItemStyle: {display: 'none'},
      }}
    />
    <Drawer.Screen
      name="Join Meet"
      component={JoinMeetingScreen}
      options={{
        drawerItemStyle: {display: 'none'},
      }}
    />
    <Drawer.Screen
      name="Payment Screen"
      component={PaymentScreen}
      options={{
        drawerItemStyle: {display: 'none'},
      }}
    />
    <Drawer.Screen
      name="Stripe Payment"
      component={StripeProviderScreen}
      options={{
        drawerItemStyle: {display: 'none'},
      }}
    />
    <Drawer.Screen
      name="StripeCheckoutScreen"
      component={StripeCheckoutScreen}
      options={{
        drawerItemStyle: {display: 'none'},
      }}
    />
    <Drawer.Screen
      name="Payment Success"
      component={PaymentSuccessScreen}
      options={{
        drawerItemStyle: {display: 'none'},
      }}
    />
    <Drawer.Screen
      name="Search Doctors"
      component={SearchDoctorScreen}
      options={{
        drawerItemStyle: {display: 'none'},
      }}
    />
    <Drawer.Screen
      name="Doctors List"
      component={DoctorsListScreen}
      options={{
        drawerItemStyle: {display: 'none'},
      }}
    />
    <Drawer.Screen
      name="Contact Us"
      component={ContactScreen}
      options={{
        drawerIcon: ({color, size}) => (
          <FontAwesome name="phone" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen
      name="Are You Doctor"
      component={DoctorFormScreen}
      options={{
        drawerIcon: ({color, size}) => (
          <FontAwesome name="user-md" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen
      name="Tell A Friend"
      component={AppShareScreen}
      options={{
        drawerIcon: ({color, size}) => (
          <Ionicons name="share-social-outline" size={22} />
        ),
      }}
    />
    <Drawer.Screen
      name="Weight Loss Tips"
      component={WeightLossTipsScreen}
      options={{
        drawerItemStyle: {display: 'none'},
        drawerIcon: ({color, size}) => (
          <Ionicons name="share-social-outline" size={22} />
        ),
      }}
    />
    <Drawer.Screen
      name="Coming Soon"
      component={ComingSoonScreen}
      options={{
        drawerItemStyle: {display: 'none'},
      }}
    />
  </Drawer.Navigator>
);

const AppNavigation = () => {
  const {user, loading} = useAuth(); // Get user and loading state from AuthContext

  // Debugging - Check user state from AuthContext
  console.log('AuthContext:', {user, loading});

  // If app is checking authentication status, show a loading screen
  if (loading) {
    return null; // You can replace this with a loading spinner or splash screen
  }

  // Based on whether a user exists, show AppNavigator or AuthNavigator
  return user ? <AppNavigator /> : <AuthNavigator />;
};

export default AppNavigation;
