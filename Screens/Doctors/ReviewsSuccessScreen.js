import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
export default function ReviewSuccessScreen() {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Image 
                    source={require('../../assets/calendarplusalt.png')} 
                    style={styles.icon} 
                />
            </View>
            <Text style={styles.title}>Appointment Successfully</Text>
            <Text style={styles.subtitle}>We value your opinion and appreciate your time.</Text>
            <TouchableOpacity 
                style={styles.button} 
                onPress={() => navigation.navigate('Home')}
            >
                <Text style={styles.buttonText}>Back To Home</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    iconContainer: {
        marginBottom: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 100, // Adjust size as per the icon used
        height: 100,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1D3557',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#A8A8A8',
        textAlign: 'center',
        marginBottom: 40,
    },
    button: {
        backgroundColor: '#1D3557',
        paddingVertical: 15,
        paddingHorizontal: 60,
        borderRadius: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
