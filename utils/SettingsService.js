// src/services/settingsService.js
import axios from 'axios';
import { BaseUrl } from './BaseApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
// settingsService.js
let appSettings = null;
let isFetching = false;
let fetchPromise = null;

export const fetchAppSettings = async () => {
  if (isFetching) return fetchPromise;
  if (appSettings) return appSettings;

  isFetching = true;
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      console.warn('User token not found');
      return;
    }
    
    fetchPromise = axios.get(`${BaseUrl}/getsettings`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const response = await fetchPromise;
    appSettings = response.data;
    console.log("App settings loaded:", appSettings);
    return appSettings;
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw error;
  } finally {
    isFetching = false;
    fetchPromise = null;
  }
};

export const getSetting = (key, defaultValue = undefined) => {
  if (!appSettings) {
    console.warn('App settings not loaded. Call fetchAppSettings() first.');
    return defaultValue;
  }
  return appSettings[key] ?? defaultValue;
};

// Initialize settings when the module loads (optional)
fetchAppSettings().catch(console.error);
