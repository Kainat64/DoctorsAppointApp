import React, { useEffect, useState } from 'react';
import {
  View,
  ActivityIndicator,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BaseUrl } from '../../utils/BaseApi';
import Icon from 'react-native-vector-icons/Ionicons';
import { WebView } from 'react-native-webview';

const JoinMeetingScreen = ({ route, navigation }) => {
  const { meetingId } = route.params;

  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const fetchMeetingDetails = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${BaseUrl}/join-meeting/${meetingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMeeting(response.data);
      setError(null);

      const zoomUrl = response.data.join_url || `zoomus://zoom.us/join?confno=${meetingId}`;
      const supported = await Linking.canOpenURL(zoomUrl);

      if (supported) {
        Linking.openURL(zoomUrl);
        setUsingFallback(false);
      } else {
        setUsingFallback(true);
      }
    } catch (err) {
      console.error('Error fetching meeting:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetingDetails();
  }, [meetingId]);

  const handleOpenInBrowser = () => {
    if (meeting?.join_url) {
      Linking.openURL(meeting.join_url.replace('zoomus://', 'https://'));
    } else {
      Linking.openURL(`https://zoom.us/j/${meetingId}`);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#274A8A" />
          <Text style={styles.loadingText}>Connecting to meeting...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.errorContainer}>
          <View style={styles.iconContainer}>
            <Icon name="warning-outline" size={50} color="#FF4757" />
          </View>
          <Text style={styles.errorTitle}>Meeting Connection Failed</Text>
          <Text style={styles.errorText}>{error}</Text>
          
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={fetchMeetingDetails}
          >
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (usingFallback || !meeting?.join_url) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.fallbackContainer}>
          <View style={styles.meetingHeader}>
            <View style={styles.iconCircle}>
              <Icon name="videocam" size={32} color="#274A8A" />
            </View>
            <Text style={styles.meetingTitle}>Zoom Meeting</Text>
            <Text style={styles.meetingId}>ID: {meetingId}</Text>
          </View>

          <View style={styles.meetingDetails}>
            <Text style={styles.meetingTopic}>
              {meeting?.topic || 'No topic specified'}
            </Text>
            {meeting?.start_time && (
              <Text style={styles.meetingTime}>
                {new Date(meeting.start_time).toLocaleString()}
              </Text>
            )}
          </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={handleOpenInBrowser}
            >
              <Icon name="globe-outline" size={20} color="white" style={styles.buttonIcon} />
              <Text style={styles.primaryButtonText}>Join in Browser</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryButton} 
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        source={{ uri: meeting.join_url.replace('zoomus://', 'https://') }}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.webviewLoading}>
            <ActivityIndicator size="large" color="#2D8CFF" />
          </View>
        )}
        style={{ flex: 1 }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
          setUsingFallback(true);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
    
   
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#555',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    backgroundColor: '#FFEEEE',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  fallbackContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  meetingHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E6F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  meetingTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  meetingId: {
    fontSize: 16,
    color: '#718096',
  },
  meetingDetails: {
    marginBottom: 32,
    alignItems: 'center',
  },
  meetingTopic: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 8,
  },
  meetingTime: {
    fontSize: 14,
    color: '#718096',
  },
  buttonGroup: {
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#274A8A',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2D8CFF',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#cf0934ff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginRight: 8,
  },
  webviewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  retryButton: {
    backgroundColor: '#2D8CFF',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default JoinMeetingScreen;