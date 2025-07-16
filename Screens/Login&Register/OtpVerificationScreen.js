import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseUrl } from '../../utils/BaseApi';

const OtpVerificationScreen = ({ navigation, route }) => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const { email, userId, token } = route.params;

    useEffect(() => {
        // Start countdown timer for resend OTP
        const timer = countdown > 0 && setInterval(() => {
            setCountdown(countdown - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    const verifyOtp = async () => {
        if (otp.length !== 6) {
            Alert.alert('Error', 'Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${BaseUrl}/verify-otp`, {
                otp,
                email,
                user_id: userId
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                Alert.alert('Success', 'Account verified successfully!');
                // Store token and navigate to login
                await AsyncStorage.setItem('userToken', token);
                navigation.navigate('Login');
            } else {
                Alert.alert('Error', response.data.message || 'OTP verification failed');
            }
        } catch (error) {
            console.error('OTP verification error:', error);
            Alert.alert('Error', error.response?.data?.message || 'An error occurred during verification');
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = async () => {
        setResendLoading(true);
        try {
            const response = await axios.post(`${BaseUrl}/resend-otp`, {
                email,
                user_id: userId
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                Alert.alert('Success', 'New OTP sent to your email');
                setCountdown(60); // Reset countdown
            } else {
                Alert.alert('Error', response.data.message || 'Failed to resend OTP');
            }
        } catch (error) {
            console.error('Resend OTP error:', error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Verify Your Email</Text>
            <Text style={styles.subtitle}>We've sent a 6-digit code to {email}</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Enter OTP"
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
                autoFocus
            />
            
            <TouchableOpacity 
                style={styles.button} 
                onPress={verifyOtp}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Verify</Text>
                )}
            </TouchableOpacity>
            
            <TouchableOpacity 
                onPress={resendOtp} 
                disabled={countdown > 0 || resendLoading}
                style={styles.resendButton}
            >
                {resendLoading ? (
                    <ActivityIndicator color="#007AFF" />
                ) : (
                    <Text style={styles.resendText}>
                        {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 18,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#6a1b9a', // Matching your purple theme
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resendButton: {
        alignItems: 'center',
    },
    resendText: {
        color: '#6a1b9a', // Matching your purple theme
        fontSize: 16,
    },
});

export default OtpVerificationScreen;