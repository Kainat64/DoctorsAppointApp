import React, {useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen1 from '../Screens/splash/SplashScreen1';
import SplashScreen2 from '../Screens/splash/SplashScreen2';
import SplashScreen3 from '../Screens/splash/SplashScreen3';
import SplashScreen4 from '../Screens/splash/SplashScreen4';
import LoginPage from '../Screens/Login&Register/Login';
import RegisterPage from '../Screens/Login&Register/Register';

import { useAuth } from '../AuthContext';
const Stack = createStackNavigator();

const LoginStack = () => {
    const { updateAuthentication } = useAuth(); // Access the updateAuthentication function from the AuthContex
    return ( 
        <NavigationContainer>   
            <Stack.Navigator initialRouteName="Splash">
            <Stack.Screen name="Splash" component={SplashScreen1} 
             options={{ headerShown: false }} />
            <Stack.Screen name="Splash2" component={SplashScreen2} 
             options={{ headerShown: false }} />
            <Stack.Screen name="Splash3" component={SplashScreen3} 
             options={{ headerShown: false }} />
             <Stack.Screen name="Splash4" component={SplashScreen4} 
             options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginPage} 
           options={{ headerShown: false }}   />
          <Stack.Screen name="Register" component={RegisterPage} 
           options={{ headerShown: false }}/>
             
        </Stack.Navigator>
        </NavigationContainer>
      );
      
}
    
  
export default LoginStack;