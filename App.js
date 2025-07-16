/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React,{useEffect, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import "react-native-gesture-handler";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigation from './components/AppNavigation';
import { AuthProvider } from './AuthContext';

function App() {
   
  return (
    <>
      <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigation />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
    </>
  );
}

export default App;
