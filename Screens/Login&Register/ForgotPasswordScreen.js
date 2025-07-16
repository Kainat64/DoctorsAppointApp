import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { BaseUrl } from '../../utils/BaseApi';
const ForgotPasswordScreen = ({ navigation }) => {
    console. log('base url', BaseUrl);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async () => {
    // Basic validation
    if (!email) {
        Alert.alert('Error', 'Please enter your email address');
        return;
    }

    // Simple email format validation
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        Alert.alert('Error', 'Please enter a valid email address');
        return;
    }

    setLoading(true);
    try {
        const response = await axios.post(`${BaseUrl}/forgot-password`, { email }, {
            timeout: 10000 // 10 seconds timeout
        });

        if (response.data.success) {
            navigation.navigate('ResetPassword', { email });
        } else {
            Alert.alert('Error', response.data.message || 'Failed to send OTP');
        }
    } catch (error) {
        console.error('Forgot password error:', error);

        if (error.code === 'ECONNABORTED') {
            Alert.alert('Error', 'Request timeout. Please try again.');
        } else if (!error.response) {
            // Network error (no response)
            Alert.alert('Error', 'Network error. Please check your connection.');
        } else if (error.response.status === 422) {
            // Laravel Validation Error
            const errors = error.response.data.errors;
            const errorMessages = Object.values(errors).flat();
            Alert.alert('Validation Error', errorMessages[0] || 'Invalid input');
        } else {
            // Other server errors
            const errorMessage = error.response.data?.message || 
                              error.response.data?.error || 
                              'Failed to send OTP';
            Alert.alert('Error', errorMessage);
        }
    } finally {
        setLoading(false);
    }
};


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>Enter your email to receive a password reset OTP</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#888"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />
            
            <TouchableOpacity 
                style={styles.button} 
                onPress={handleSendOtp}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Send OTP</Text>
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
        marginBottom: 20,
        fontSize: 16,
        color: '#333',
    },
    button: {
        backgroundColor: '#274A8A', // Primary color
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        elevation: 2,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ForgotPasswordScreen;