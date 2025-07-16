import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { BaseUrl } from '../../utils/BaseApi';
const ResetPasswordScreen = ({ navigation, route }) => {
    const { email } = route.params;
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(60);

    useEffect(() => {
        const timer = countdown > 0 && setInterval(() => {
            setCountdown(countdown - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    const handleResetPassword = async () => {
        // Validate inputs
        if (!otp || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }
    
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
    
        setLoading(true);
        
        try {
            const response = await axios.post(
                `${BaseUrl}/reset-password`,
                {
                    email,
                    otp,
                    password: newPassword,
                    password_confirmation: confirmPassword
                },
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000 // 10 second timeout
                }
            );
    
            if (response.data.success) {
                Alert.alert('Success', 'Password reset successfully!', [
                    { 
                        text: 'OK', 
                        onPress: () => navigation.navigate('Login', {
                            email: email // Pass email back to login screen if needed
                        }) 
                    }
                ]);
            } else {
                Alert.alert('Error', response.data.message || 'Password reset failed');
            }
        } catch (error) {
            console.error('Reset password error:', error);
            
            let errorMessage = 'Password reset failed';
            
            if (error.response) {
                // Server responded with error status
                errorMessage = error.response.data?.message || 
                             error.response.statusText || 
                             `Server error (${error.response.status})`;
            } else if (error.request) {
                // Request was made but no response
                if (error.code === 'ECONNABORTED') {
                    errorMessage = 'Request timeout - please try again';
                } else {
                    errorMessage = 'No response from server - check your connection';
                }
            } else {
                // Other errors
                errorMessage = error.message || 'Network error';
            }
            
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = async () => {
        try {
            const response = await axios.post(`${BaseUrl}/resend-password-otp`, {
                email
            });

            if (response.data.success) {
                Alert.alert('Success', 'New OTP sent to your email');
                setCountdown(60);
            } else {
                Alert.alert('Error', response.data.message || 'Failed to resend OTP');
            }
        } catch (error) {
            console.error('Resend OTP error:', error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to resend OTP');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>Enter the OTP sent to {email}</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Enter OTP"
                placeholderTextColor="#888"
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
            />
            
            <TextInput
                style={styles.input}
                placeholder="New Password"
                placeholderTextColor="#888"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
            />
            
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#888"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />
            
            <TouchableOpacity 
                style={styles.button} 
                onPress={handleResetPassword}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Reset Password</Text>
                )}
            </TouchableOpacity>
            
            <TouchableOpacity 
                onPress={resendOtp} 
                disabled={countdown > 0}
                style={styles.resendButton}
            >
                <Text style={styles.resendText}>
                    {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                </Text>
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
        color: '#274A8A', // Primary color
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        color: '#333',
    },
    button: {
        backgroundColor: '#274A8A', // Primary color
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
        elevation: 2,
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
        color: '#274A8A', // Primary color
        fontSize: 16,
        fontWeight: '500',
    },
});

export default ResetPasswordScreen;