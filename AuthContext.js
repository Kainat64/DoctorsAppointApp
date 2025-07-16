/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage for token management
import axios from 'axios';
import { BaseUrl } from './utils/BaseApi';
import { Alert } from 'react-native';

const AuthContext = createContext();

// Custom hook to access the context easily
export const useAuth = () => {
    return useContext(AuthContext);
};
 
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
 const [authState, setAuthState] = useState({
    user: null,
    loading: true,
    error: null,
  });
    const [userToken, setUserToken] = useState(null);
    const loadToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      setUserToken(token);
    };

    // Check authentication status on app start
    const loadAuthState = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          setAuthState(prev => ({...prev, loading: false}));
          return;
        }

        // Verify token and get user data
        const response = await axios.get(`${BaseUrl}/user`, {
          headers: {Authorization: `Bearer ${token}`},
        });

        if (response.data?.type !== 'user') {
          await AsyncStorage.removeItem('userToken');
          setAuthState({user: null, loading: false, error: null});
          return;
        }

        setAuthState({
          user: response.data,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Auth check error:', error);
        await AsyncStorage.removeItem('userToken');
        setAuthState({
          user: null,
          loading: false,
          error: 'Session expired. Please login again.',
        });
      }
    };
  useEffect(() => {
    
    
    loadAuthState();
    loadToken();
  }, []);

  const login = async (email, password) => {
    setAuthState(prev => ({...prev, loading: true, error: null}));

    try {
      const response = await axios.post(`${BaseUrl}/login`, {email, password});
      const {token, user} = response.data;

      if (user.type !== 'user') {
        Alert.alert(
          'Access Denied',
          'Only doctors can access this application',
          [{text: 'OK'}],
        );
        setAuthState(prev => ({...prev, loading: false}));
        return false;
      }

      await AsyncStorage.setItem('userToken', token);
      setAuthState({
        user,
        loading: false,
        error: null,
      });
      return true;
    } catch (error) {
      let errorMessage = 'Login failed. Please try again.';

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Invalid email or password';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      }

      Alert.alert('Login Error', errorMessage);
      setAuthState({
        user: null,
        loading: false,
        error: errorMessage,
      });
      return false;
    }
  };

    const signup = async (name, email, password) => {
        try {
            const response = await axios.post(`${BaseUrl}/signup`, { name, email, password });
            const { token, user } = response.data;

            // Save token to AsyncStorage
            await AsyncStorage.setItem('userToken', token);

            // Set user state
            setUser(user);
        } catch (error) {
            console.error("Signup error:", error);
            throw error; // You can return this error to handle it in the UI
        }
    };

    const logout = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        await axios.post(`${BaseUrl}/logout`, null, {
          headers: {Authorization: `Bearer ${token}`},
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await AsyncStorage.removeItem('userToken');
      setAuthState({
        user: null,
        loading: false,
        error: null,
      });
    }
  };

    return (
        <AuthContext.Provider value={{    user: authState.user,
        loading: authState.loading,
        error: authState.error,
        reloadUser: loadAuthState, // ✅ expose this
         login, signup, logout,setUserToken }}>
            {children}
        </AuthContext.Provider>
    );
};
