import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Icon } from 'react-native-paper';
import Share from 'react-native-share';
import Ionicons from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get('window');

const AppShareScreen = () => {
  // Share App Functionality
  const shareViaWhatsApp = async () => {
    try {
      const options = {
        message: 'Check out the Doctor365 app to consult doctors online!',
        url: 'https://doc-365.unsi.tech', // Your app link
        social: Share.Social.WHATSAPP,
      };

      const isWhatsAppAvailable = await Share.isPackageInstalled('com.whatsapp');

      if (isWhatsAppAvailable) {
        await Share.shareSingle(options);
      } else {
        // Fall back if WhatsApp is not installed
        shareViaWhatsAppFallback();
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Unable to share via WhatsApp.');
    }
  };

  // Fallback for WhatsApp using URL scheme
  const shareViaWhatsAppFallback = () => {
    const message = 'Check out the Marham app to consult doctors online! https://doc-365.unsi.tech';
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert('WhatsApp Not Installed', 'Please install WhatsApp to share this content.');
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => Alert.alert('Error', 'An error occurred while trying to open WhatsApp.'));
  };

  // General sharing for other platforms
  const shareViaOtherPlatforms = async () => {
    try {
      const options = {
        message: 'Check out the Doctor365 app to consult doctors online!',
        url: 'https://doc-365.unsi.tech', // Your app link
      };
      await Share.open(options);
    } catch (error) {
      Alert.alert('Error', error.message || 'Unable to share the link.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}

      <View style={styles.header}>
             
        <Text style={styles.headerText}>Invite Family and Friends</Text>
      </View>

      {/* Banner Section */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          Contribute to Building a Better
        </Text>
        <Text style={[styles.bannerText, { fontWeight: 'bold' }]}>
          Healthcare Future for Ireland
        </Text>
      </View>

      {/* Sharing Section */}
      <Text style={styles.shareText}>
        Share Doctor365 App with your friends and family.
      </Text>
      <Text style={styles.description}>
        Your one share can help your friends & family to find, book or consult
        verified doctors without any hassle.
      </Text>

      {/* Share Options */}
      <View style={styles.shareOptions}>
        <TouchableOpacity style={styles.shareButton} onPress={shareViaWhatsApp}>
          <Text style={styles.shareButtonText}>Share Via WhatsApp</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.copyButton}
          onPress={shareViaOtherPlatforms}
        >
          <Text style={styles.copyButtonText}>Copy Link</Text>
        </TouchableOpacity>
      </View>

      {/* Services Section */}
      <Text style={styles.servicesTitle}>Services of Doctor365</Text>
      <Text style={styles.servicesDescription}>
        Doctor365 has served over 1 million people in Ireland and offers the following services:
      </Text>

       {/* Service Icons */}
       <View style={styles.services}>
        <View style={styles.serviceBox}>
          <Ionicons name="medical-outline" size={30} color="#2d425a" />
          <Text style={styles.serviceText}>Doctors Appointment</Text>
        </View>
        <View style={styles.serviceBox}>
          <Ionicons name="chatbubbles-outline" size={30} color="#2d425a" />
          <Text style={styles.serviceText}>Online Consultation</Text>
        </View>
        <View style={styles.serviceBox}>
          <Ionicons name="flask-outline" size={30} color="#2d425a" />
          <Text style={styles.serviceText}>Book Lab Tests</Text>
        </View>
        <View style={styles.serviceBox}>
          <Ionicons name="cart-outline" size={30} color="#2d425a" />
          <Text style={styles.serviceText}>Order Medicines</Text>
        </View>
        <View style={styles.linkunsi}>
         
          <Text style={styles.linktext}>Powered by UNSI TECH</Text>
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2d425a',
  },
  banner: {
    backgroundColor: '#2d425a',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  shareText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
  },
  shareOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  shareButton: {
    backgroundColor: '#25D366',
    padding: 12,
    borderRadius: 8,
    width: width * 0.4,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  copyButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    width: width * 0.4,
    alignItems: 'center',
  },
  copyButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  servicesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  servicesDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
  },
  services: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  serviceBox: {
    width: width * 0.4,
    padding: 12,
    margin: 8,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
  },
  serviceText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  linkunsi: {
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
   
    
  },
  linktext: {
    fontSize: 10,
    color: '#420475',
    textAlign: 'center',
  },
});

export default AppShareScreen;
