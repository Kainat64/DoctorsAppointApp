import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Animated,
  Easing,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Linking
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../../AuthContext';
import Feather from 'react-native-vector-icons/Feather';

const { width, height } = Dimensions.get('window');
const SERVICE_DURATION = 3000; // 3 seconds per service
import { Platform } from 'react-native';


const isSmallScreen = height < 700;
function LoginPage() {
  const navigation = useNavigation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentService, setCurrentService] = useState(0);
  
  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(30);
  const logoScale = new Animated.Value(0.8);
  const buttonScale = new Animated.Value(1);
  const serviceAnim = new Animated.Value(0);
  const slideX = useRef(new Animated.Value(0)).current;

  // Services data
  const services = [
    { icon: 'calendar', text: 'Online Booking', color: '#4a6fdc' },
    { icon: 'video', text: 'Video Consultation', color: '#3ab795' },
    { icon: 'flask', text: 'Book Lab Test', color: '#f7a44e' },
    { icon: 'file-text', text: 'Online Prescription', color: '#e9595d' }
  ];

  // Auto-advance services
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(slideX, {
        toValue: -width,
        duration: 500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        setCurrentService((prev) => (prev + 1) % services.length);
        slideX.setValue(width);
        Animated.timing(slideX, {
          toValue: 0,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }).start();
      });
    }, SERVICE_DURATION);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(serviceAnim, {
        toValue: 1,
        duration: 800,
        delay: 1000,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const profileComplete = await login(email, password);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Login failed. Please check your credentials.');
      Alert.alert('Error', 'Login failed. Please check your credentials.');
      console.error('Login error:', err);
    }
  };

  const renderService = (service, index) => {
    const isActive = index === currentService;
    const opacity = isActive ? 1 : 0;
    
    return (
      <Animated.View
        key={index}
        style={[
          styles.serviceItem,
          {
            opacity: isActive ? 1 : 0,
            transform: [
              { 
                translateX: isActive ? slideX : new Animated.Value(width) 
              }
            ]
          }
        ]}
      >
        <View style={[styles.serviceIconContainer, { backgroundColor: service.color }]}>
          <Feather name={service.icon} size={32} color="#fff" />
        </View>
        <Text style={styles.serviceText}>{service.text}</Text>
      </Animated.View>
    );
  };

  return (
    <ImageBackground
      source={require('../../assets/images/app_background.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Animated.View 
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: logoScale }]
            }
          ]}
        >
          <Image
            style={styles.logo}
            source={require('../../assets/images/doc360logo.png')}
          />
        </Animated.View>

        <Animated.View 
          style={[
            styles.loginContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.text_header}>Welcome Back!</Text>
          
          <Animated.View style={styles.action}>
            <FontAwesome name="user-o" color="#420475" style={styles.smallIcon} />
            <TextInput 
              placeholder="Mobile or Email" 
              placeholderTextColor="#888"
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </Animated.View>

          <Animated.View style={[styles.action, { marginTop: 20 }]}>
            <FontAwesome name="lock" color="#420475" style={styles.smallIcon} />
            <TextInput 
              placeholder="Password" 
              placeholderTextColor="#888"
              style={styles.textInput}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </Animated.View>

        
          <TouchableOpacity 
              style={styles.loginButton}
              onPress={handleLogin}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Log In</Text>
              )}
            </TouchableOpacity>
              <TouchableOpacity 
            style={styles.forgotPassword}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.buttonContainer}>
          
       
          <TouchableOpacity 
            style={styles.registerButton}
            onPress={() => navigation.navigate('Register')}
          >
             <Text style={styles.registerButtonText}>Don't have an account? Register</Text>
          </TouchableOpacity>
          
           <TouchableOpacity
           >
            <Text style={styles.linkText}>Powered By UNSI TECH</Text>
          </TouchableOpacity>
        </View>

        {/* Services Carousel */}
        
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    padding: 25,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: isSmallScreen ? 20 : 40, // Dynamic margin
    marginTop: isSmallScreen ? 10 : 0,
  },
  logo: {
    width: isSmallScreen ? 180 : 220, // Smaller on small screens
    height: isSmallScreen ? 90 : 110,
    resizeMode: 'contain',
  },
  loginContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 20,
    padding: isSmallScreen ? 15 : 25, // Reduced padding
    marginBottom: isSmallScreen ? 10 : 0, // Reduced margin
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  text_header: {
    color: '#420475',
    fontWeight: 'bold',
    fontSize: 28,
    marginBottom: 30,
    textAlign: 'center',
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
  },
  smallIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    color: '#333',
    fontSize: 16,
    paddingVertical: 5,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 15,
  },
  forgotPasswordText: {
    color: '#420475',
    fontWeight: '600',
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 30,
  },
  loginButton: {
    marginTop: 20,
    backgroundColor: '#274A8A',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#420475',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerButton: {

    marginTop: 20,
    padding: 10,
    alignItems: 'center',
     
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
   
   
   
  },
  registerButtonText: {
  
     fontSize: 14,
  fontWeight: 'bold',
  color: '#274A8A',
    
  },
  registerText: {
  
    fontSize: 14,
    fontWeight: 'bold',
    color: 'red',
  },
  servicesContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 20,
    
  },
  servicesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#420475',
    textAlign: 'center',
    marginBottom: 20,
  },
  carouselContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  serviceItem: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  serviceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#420475',
    width: 12,
  },
  linkText: {
    marginTop:100,
    justifyContent: 'center',
    
  textAlign: 'center',
  color: '#420475',
  
  fontSize: 8,
  fontWeight: 'bold',
},
});

export default LoginPage;