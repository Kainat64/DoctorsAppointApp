// SocialIcons.js
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Dimensions,
  StyleSheet,
  PixelRatio,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BaseUrl } from '../../utils/BaseApi';

const { width } = Dimensions.get('window');
const scale = width / 375;

function normalize(size) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

const SocialIcons = ({ onSettingsLoaded }) => {
  const [platforms, setPlatforms] = useState([]);
  const [appSetting, setAppSetting] = useState({});

  
  const fetchAppSettings = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.warn('User token not found');
        return;
      }

      const response = await axios.get(`${BaseUrl}/getsettings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const settings = response.data;
      setAppSetting(settings);

      // Detect platform and pass correct API key
      const selectedKey =
        Platform.OS === 'android'
          ? settings.android_sdk_api_key
          : settings.ios_sdk_api_key;

      // Pass the selected API key to parent if needed
      if (onSettingsLoaded && typeof onSettingsLoaded === 'function') {
        onSettingsLoaded(selectedKey);
      }

      const iconsData = [
        {
          name: 'logo-facebook',
          color: '#3b5998',
          label: 'Facebook',
          link: settings.facebook_link,
        },
        {
          name: 'logo-instagram',
          color: '#C13584',
          label: 'Instagram',
          link: settings.instagram_link,
        },
        {
          name: 'logo-twitter',
          color: '#000000',
          label: 'X',
          link: settings.x_link,
        },
        {
          name: 'logo-linkedin',
          color: '#0077B5',
          label: 'Linkedin',
          link: settings.linkedin_link,
        },
        {
          name: 'logo-youtube',
          color: '#FF0000',
          label: 'Youtube',
          link: settings.youtube_link,
        },
      ].filter(item => item.link); // Filter out empty/null links

      setPlatforms(iconsData);
    } catch (error) {
      console.error('Error fetching app settings:', error);
    }
  };

  useEffect(() => {
    fetchAppSettings();
  }, []);

  return (
    <View style={styles.iconsRow}>
      {platforms.map((platform, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => Linking.openURL(platform.link)}
          style={styles.iconWrapper}
          activeOpacity={0.7}
        >
          <Ionicons
            name={platform.name}
            size={normalize(28)}
            color={platform.color}
            style={styles.icon}
          />
          <Text style={styles.labelText} numberOfLines={1}>
            {platform.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  iconsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(16),
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconWrapper: {
    alignItems: 'center',
    width: `${100 / 5}%`,
  },
  icon: {
    marginBottom: normalize(5),
  },
  labelText: {
    fontSize: normalize(10),
    color: '#444',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default SocialIcons;
