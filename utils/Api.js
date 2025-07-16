/* eslint-disable prettier/prettier */
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

//const API_URL = 'https://doctors-365.caesar.business/api';
import { BaseUrl } from './BaseApi';
const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return token;
  } catch (error) {
    console.error('Failed to retrieve token:', error);
    return null;
  }
};
export const login = (email, password) => {
  return axios.post(`${BaseUrl}/login`, {
    email,
    password,
  });
};
export const logout = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');

    if (token) {
      await axios.post(
        `${BaseUrl}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Remove token from AsyncStorage
      await AsyncStorage.removeItem('userToken');

      return {success: true}; // Ensure that success is always returned
    } else {
      // No token found, still handle the case
      return {success: false, message: 'No token found'};
    }
  } catch (error) {
    console.error('Logout error:', error);
    return {success: false, message: 'Logout failed due to an error'}; // Always return an object
  }
};
export const getDoctors = () => {
  return axios.get(`${BaseUrl}/get-doctors-list`);
};
export const getSpecialist = () => {
  return axios.get(`${BaseUrl}/get-specialists`);
};
export const getDoctorsBySpecialist = specialistId => {
  return axios.get(`${BaseUrl}/specialists/${specialistId}`);
};
export const getDiseases = () => {
  return axios.get(`${BaseUrl}/get-diseases`);
};
export const getDoctorById = doctorId => {
  return axios.get(`${BaseUrl}/doctors/${doctorId}`);
};
export const getHospitalList = () => {
  return axios.get(`${BaseUrl}/get-hospitals-list`);
};
export const getHospitalById = hospitalId => {
  return axios.get(`${BaseUrl}/hospital/${hospitalId}`);
};
export const CountDoctors = hospitalId => {
  return axios.get(`${BaseUrl}/hospitals/${hospitalId}/doctor-count`);
};
export const getDoctorTimeSlots = (doctorId, date) => {
  return axios.get(`${BaseUrl}/available-slots/${doctorId}/${date}`);
};
export const bookAppointment = data => {
  return axios.post(`${BaseUrl}/book-appointments`, data);
};
export const GetAppointmentsDetails = () => {
  return axios.get(`${BaseUrl}/appointment-detail`);
};
export const getDoctorReviews = doctorId => {
  return axios.get(`${BaseUrl}/doctors/${doctorId}/reviews`);
};
export const CountDoctorReviews = doctorId => {
  return axios.get(`${BaseUrl}/doctor/${doctorId}/reviews-count`);
};
export const getHealthCarePlans = () => {
  return axios.get(`${BaseUrl}/health-care-plans`);
};
export const getPregnancyCarePlans = () => {
  return axios.get(`${BaseUrl}/pregnancy-care-plans`);
};
export const getAvailableTests = () => {
  return axios.get(`${BaseUrl}/get-lab-tests`);
};
export const getLabById = labId => {
  return axios.get(`${BaseUrl}/get-lab/${labId}`);
};
export const getBlogCategories = () => {
  return axios.get(`${BaseUrl}/blog-categories`);
};
export const getAllBlogPosts = () => {
  return axios.get(`${BaseUrl}/blog-posts`);
};
export const getBlogDetailById = id => {
  return axios.get(`${BaseUrl}/blog-detail/${id}`);
};
export const postComment = commentData => {
  return axios.post(`${BaseUrl}/blogs/comments`, {comment: commentData});
};


