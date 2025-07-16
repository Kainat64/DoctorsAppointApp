// HomeScreen.js
import * as React from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Animated,
  Easing
} from 'react-native';
import {StyleSheet} from 'react-native';
const {width, height} = Dimensions.get('window');
import LinearGradient from 'react-native-linear-gradient';
function SplashScreen1({navigation}) {
  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1500,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      })
    ]).start();

    const timer = setTimeout(() => {
      navigation.navigate('Splash3');
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../../assets/images/app_background.png')}
        style={styles.background}
      >
        <View style={styles.contentContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/doc360logo.png')}
              style={styles.logo}
            />
          </View>
          
          <Animated.View style={[
            styles.imageContainer, 
            {
              transform: [{ scale: scaleAnim }]
            }
          ]}>
            <View style={styles.circleGradient}>
              <View style={styles.circleOuter}>
                <View style={styles.circleInner}>
                  <Image
                    source={require('../../assets/images/doctor_img.png')}
                    style={styles.doctorImage}
                  />
                </View>
              </View>
            </View>
          </Animated.View>
          
          <View style={styles.textContainer}>
            <Animated.Text 
              style={[
                styles.welcomeText,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }
              ]}>
              Lots of Doctors Available
            </Animated.Text>
            <Animated.Text 
              style={[
                styles.appNameText,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }
              ]}>
              Whenever You Need
            </Animated.Text>
          </View>
        </View>
      </ImageBackground>
      
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 30,
  },
  logoContainer: {
    marginTop: 20,
  },
  logo: {
    width: 220,
    height: 110,
    resizeMode: 'contain',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  circleGradient: {
    width: 300,
    height: 300,
    borderRadius: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#274A8A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  circleOuter: {
    width: 280,
    height: 280,
    borderRadius: 140,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 2,
    borderColor: 'rgba(196, 187, 240, 0.5)',
  },
  circleInner: {
    width: 250,
    height: 250,
    borderRadius: 125,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  doctorImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    marginTop: 20, // Adjust this based on your image
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: '600',
    color: '#274A8A',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.05)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  appNameText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#274A8A',
    textAlign: 'center',
    marginTop: 8,
    textShadowColor: 'rgba(0,0,0,0.05)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  button: {
    backgroundColor: '#274A8A',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 40,
  },
  gradientButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default SplashScreen1;