import React, { useEffect, useState } from 'react';
import { ScrollView, Text, StyleSheet, View, Image, TouchableHighlight, ActivityIndicator, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import { BaseUrl } from '../../utils/BaseApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const DoctorsListScreen = ({ route }) => {
    const navigation = useNavigation();
    const { departmentId, specialistId } = route.params;
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDoctors();
    }, [departmentId, specialistId]);

    const fetchDoctors = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.get(
                `${BaseUrl}/get-doctors-list?department_id=${departmentId}&specialist_id=${specialistId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setDoctors(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setError(error.message);
            setLoading(false);
        }
    };

    const ShowBookAppointment = (doctorId) => {
        navigation.navigate('Book Appointment', { doctorId });
    };

    const ShowVideoConsultation = (doctorId) => {
        navigation.navigate('Video Consultation', { doctorId });
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#274A8A" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error loading doctors: {error}</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.headerContainer}>
                  {/* Back Button with Arrow and Text */}
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Doctors')}
                    style={styles.backButton}
                    activeOpacity={0.7}>
                    <View style={styles.backButtonContent}>
                      <FontAwesome
                        name="arrow-left"
                        size={20}
                        color="#274A8A"
                        style={styles.backIcon}
                      />
                      <Text style={styles.backText}>Back</Text>
                    </View>
                  </TouchableOpacity>
          
                  {/* Your other header content can go here */}
                </View>
            <View style={styles.header}>
                <Text style={styles.heading}>Available Doctors</Text>
            </View>

            {doctors.map((doctor, index) => (
                <View key={index} style={styles.card}>
                    <View style={styles.doctorHeader}>
                        <Image
                            source={{
                                uri: doctor.image_url || 'https://via.placeholder.com/100',
                            }}
                            style={styles.doctorImage}
                        />
                        <View style={styles.doctorInfo}>
                            <Text style={styles.doctorName}>
                                {doctor.first_name} {doctor.last_name}
                            </Text>
                            
                            <Text style={styles.doctorDegree}>{doctor.degree}</Text>
                        </View>
                    </View>

                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Patients</Text>
                            <Text style={styles.statValue}>10</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Experience</Text>
                            <Text style={styles.statValue}>{doctor.experience} yrs</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Satisfaction</Text>
                            <Text style={styles.statValue}>99%</Text>
                        </View>
                    </View>

                    <View style={styles.scheduleContainer}>
                        <View style={styles.scheduleItem}>
                            <View style={styles.scheduleHeader}>
                                <View style={styles.iconWrapper}>
                                    <Image
                                        style={styles.scheduleIcon}
                                        resizeMode="contain"
                                        source={require("../../assets/calendar-5254028-1.png")}
                                    />
                                </View>
                                <Text style={styles.scheduleTitle}>Availability</Text>
                            </View>
                            <View style={styles.scheduleDetails}>
                                <View style={styles.timeContainer}>
                                    <View style={styles.iconWrapper}>
                                        <Image
                                            style={styles.timeIcon}
                                            resizeMode="contain"
                                            source={require("../../assets/group8.png")}
                                        />
                                    </View>
                                    <Text style={styles.timeText}>
                                        {moment(doctor.start_time, 'HH:mm').format('hh:mm A')} -{' '}
                                        {moment(doctor.end_time, 'HH:mm').format('hh:mm A')}
                                    </Text>
                                </View>
                                <Text style={styles.feeText}>{doctor.checkup_fee}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.actionButtons}>
                        <TouchableHighlight
                            onPress={() => ShowVideoConsultation(doctor.id)}
                            style={[styles.button, styles.videoButton]}
                            underlayColor="#c0392b"
                        >
                            <View style={styles.buttonContent}>
                                <Image
                                    style={styles.buttonIcon}
                                    resizeMode="contain"
                                    source={require("../../assets/group9.png")}
                                />
                                <Text style={styles.buttonText}>Video Consultation</Text>
                            </View>
                        </TouchableHighlight>

                        <TouchableHighlight
                            onPress={() => ShowBookAppointment(doctor.id)}
                            style={[styles.button, styles.bookButton]}
                            underlayColor="#1D3F7A"
                        >
                            <View style={styles.buttonContent}>
                                <Image
                                    style={styles.buttonIcon}
                                    resizeMode="contain"
                                    source={require("../../assets/calendarplus-7602610-2.png")}
                                />
                                <Text style={styles.buttonText}>Book Appointment</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        paddingHorizontal: 15,
        backgroundColor: '#F8FAFC',
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      marginLeft:10,
    },
    backButton: {
      // Removed fixed width to allow content to determine size
    },
    backButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backIcon: {
      marginRight: 8, // Space between icon and text
    },
    backText: {
      color: '#274A8A',
      fontSize: 16,
      fontWeight: '500',
    },
    header: {
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    heading: {
        fontSize: 24,
        fontWeight: '700',
        color: '#274A8A',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#274A8A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    doctorHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    doctorImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#274A8A',
    },
    doctorInfo: {
        flex: 1,
        marginLeft: 15,
    },
    doctorName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#274A8A',
        marginBottom: 4,
    },
    doctorSpecialty: {
        fontSize: 14,
        color: '#4B5563',
        marginBottom: 4,
    },
    doctorDegree: {
        fontSize: 13,
        color: '#6B7280',
        fontStyle: 'italic',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 15,
        paddingHorizontal: 10,
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 5,
    },
    statValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#274A8A',
    },
    scheduleContainer: {
        marginVertical: 10,
    },
    scheduleItem: {
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        padding: 12,
    },
    scheduleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    iconWrapper: {
        width: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scheduleIcon: {
        width: 20,
        height: 16,
        tintColor: '#274A8A',
    },
    timeIcon: {
        width: 16,
        height: 16,
        tintColor: '#6B7280',
    },
    scheduleTitle: {
        fontSize: 15,
        fontWeight: '500',
        color: '#274A8A',
        marginLeft: 8,
    },
    scheduleDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
       
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 14,
        color: '#6B7280',
        marginLeft: 8,
    },
    feeText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#274A8A',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    button: {
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    videoButton: {
        backgroundColor: '#e74c3c',
        marginRight: 10,
    },
    bookButton: {
        backgroundColor: '#274A8A',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonIcon: {
        width: 18,
        height: 18,
        tintColor: '#FFFFFF',
        marginRight: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#e74c3c',
        textAlign: 'center',
    },
});

export default DoctorsListScreen;