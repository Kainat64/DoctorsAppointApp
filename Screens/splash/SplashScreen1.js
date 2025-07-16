// HomeScreen.js
import * as React from 'react';
import {
  View,
  Text,
  Linking,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import {StyleSheet} from 'react-native';


function SplashScreen1({navigation}) {
 

 React.useEffect(() => {
   

   const timer = setTimeout(() => {
     navigation.navigate('Splash2');
   }, 4000);
   return () => clearTimeout(timer);
 }, [navigation]);
  return (
    <>
      <View style={styles.container}>
        <ImageBackground source={require('../../assets/images/splash_screen1.png')}
        style={styles.background}
        >
       
        </ImageBackground>
        
    
       
                 
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
   
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#274A8A',
    position: 'absolute',
    height:40,
    bottom: 0,
    width:'100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    height:'auto',
  },
   
});
export default SplashScreen1;
