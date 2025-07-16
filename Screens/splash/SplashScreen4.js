// HomeScreen.js
import * as React from 'react';
import { View, Text, Button,ImageBackground } from 'react-native';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
  },
  button: {
    marginTop: 20,
    width:300,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    height:'auto',
   
  },
});
function SplashScreen4({ navigation }) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Login');
    }, 3000); // 3000 milliseconds = 3 seconds
    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [navigation]);
  return (
    <>
    
    <ImageBackground 
      source={require('../../assets/images/splash_screen4.png')} 
      style={styles.background}
    >
      
    </ImageBackground>
    </>
  
  );
}

export default SplashScreen4;
