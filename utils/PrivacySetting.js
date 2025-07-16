// src/services/settingsService.js
import axios from 'axios';
import { BaseUrl } from './BaseApi';
let privacyUrl = {};

export const fetchPrivacyPolicy = async () => {
 try {
    
    const response = await axios.get(`${BaseUrl}/get-privacy-url`);
    privacyUrl = response.data;
    console.log("privacy setting", response.data);
    return response.data;
  } catch (error) {
    console.error('Error to fetch settings:', error);
    throw error;
  }
};

export const getPrivacyPolicy = (key) => {
  if (!privacyUrl) {
    throw new Error('Privacy URL not loaded. Call fetchPrivacyPolicy() first.');
  }
  //return privacyUrl;
   return privacyUrl[key];
};
