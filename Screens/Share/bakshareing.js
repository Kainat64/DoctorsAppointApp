import React from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import Share from 'react-native-share';

const AppShareScreen = () => {
    const shareAppInfo = async (platform) => {
        const commonOptions = {
          title: 'Share Our App',
          message: 'Check out this amazing app! Download it here: https://example.com/download',
          url: 'https://example.com/download',
        };
    
        let shareOptions = { ...commonOptions };
    
        // Adjust options based on platform
        if (platform === 'whatsapp') {
          shareOptions = { ...commonOptions, social: Share.Social.WHATSAPP };
        } else if (platform === 'sms') {
          shareOptions = { ...commonOptions, social: Share.Social.SMS };
        }
    
        try {
          await Share.open(shareOptions);
        } catch (error) {
          if (error && error.message !== 'User did not share') {
            Alert.alert('Error', 'Failed to share: ' + error.message);
          }
        }
      };
    
      return (
        <View style={styles.container}>
          <Button
            title="Share via SMS"
            onPress={() => shareAppInfo('sms')}
            color="#007AFF"
          />
          <Button
            title="Share via WhatsApp"
            onPress={() => shareAppInfo('whatsapp')}
            color="#25D366"
          />
          <Button
            title="Share via Other Platforms"
            onPress={() => shareAppInfo('general')}
            color="#6A5ACD"
          />
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F9F9F9',
      },
    });

export default AppShareScreen;
