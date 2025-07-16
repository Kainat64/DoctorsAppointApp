import React, { useState, useCallback } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { BaseUrl } from '../../utils/BaseApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import { RefreshControl } from 'react-native';

const ZoomMeetScreen = ({ route }) => {
  const navigation = useNavigation();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${BaseUrl}/get-zoom-meeting`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMeetings(response.data.meetings);
      setError(null);
    } catch (error) {
      console.error('Error fetching meetings:', error);
      Alert.alert('Error', 'Failed to fetch Zoom meetings');
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMeetings().then(() => setRefreshing(false));
  };

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        console.log('🎯 Screen re-focused');
        fetchMeetings();
      });

      return () => unsubscribe(); // Clean up
    }, [navigation])
  );

  const handleImageError = error => {
    console.log('Image load error:', error.nativeEvent.error);
  };

  const handleJoinMeet = meetingId => {
    navigation.navigate('Join Meet', { meetingId });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
        activeOpacity={0.7}
      >
        <Icon name="arrow-back" size={24} color="#274A8A" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Zoom Meetings</Text>
      <View style={styles.headerRight} />
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#274A8A" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        {renderHeader()}
        <View style={styles.errorContainer}>
          <Icon name="warning-outline" size={50} color="#ff4444" />
          <Text style={styles.errorText}>Failed to load meetings</Text>
          <Text style={styles.errorSubText}>{error}</Text>
          <TouchableOpacity 
            style={styles.refreshButton} 
            onPress={fetchMeetings}
            activeOpacity={0.7}
          >
            <Icon name="refresh" size={24} color="#274A8A" />
            <Text style={styles.refreshButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (meetings.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        {renderHeader()}
        <View style={styles.emptyContainer}>
          <Icon name="calendar-outline" size={60} color="#888" />
          <Text style={styles.emptyText}>No upcoming Zoom meetings</Text>
          <TouchableOpacity 
            style={styles.refreshButton} 
            onPress={fetchMeetings}
            activeOpacity={0.7}
          >
            <Icon name="refresh" size={24} color="#274A8A" />
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderHeader()}
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <View style={styles.container}>
          {meetings.map((item, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.profileSection}>
                <Image
                  source={{
                    uri: item?.hospital_image || 'https://via.placeholder.com/100',
                    cache: 'force-cache',
                  }}
                  style={styles.profileImage}
                  onError={handleImageError}
                  resizeMode="cover"
                />
                <View style={styles.profileInfo}>
                  <Text style={styles.doctorName}>
                    {item?.hospital_name || 'NA'}
                  </Text>
                </View>
              </View>

              <View style={styles.detailsSection}>
                <View style={styles.detailRow}>
                  <Icon name="calendar" size={18} color="#555" style={styles.icon} />
                  <Text style={styles.detailText}>
                    {moment(item.appointment_date, 'YYYY-MM-DD').format('MMMM Do, YYYY')}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <FontAwesome name="clock-o" size={18} color="#555" style={styles.icon} />
                  <Text style={styles.detailText}>{item.meet_time}</Text>
                </View>
                <View style={styles.detailRow}>
                    <FontAwesome name="file-text-o" size={18} color="#555" style={styles.icon} />
                  <Text style={styles.detailText}>{item.topic}</Text>
                </View>
                <View style={styles.detailRow}>
                  <FontAwesome
                    name="clock-o"
                    size={18}
                    color={item.remaining_days >= 0 ? '#4CAF50' : '#F44336'}
                    style={styles.icon}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      { color: item.remaining_days >= 0 ? '#4CAF50' : '#F44336' },
                    ]}
                  >
                    {item.remaining_days > 0
                      ? `${item.remaining_days} days remaining`
                      : item.remaining_days === 0
                      ? 'Meeting is today'
                      : `${Math.abs(item.remaining_days)} days ago`}
                  </Text>
                  
                </View>
                <View>
                <Text style={{ color: '#dc3545', fontSize: 14, marginTop: 8 }}>
                  Note: This meeting link will expire 30 minutes after the scheduled start time.
                </Text>

                </View>
              </View>

              {item.remaining_days >= 0 && (
                <TouchableOpacity
                  style={styles.joinButton}
                  onPress={() => handleJoinMeet(item.meeting_id)}
                  activeOpacity={0.8}
                >
                  <Icon name="videocam-outline" size={20} color="#FFF" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Join Meeting</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    backgroundColor: '#FFF',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#274A8A',
  },
  headerRight: {
    width: 24,
  },
  scrollContainer: {
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#ff4444',
    marginTop: 10,
    fontWeight: 'bold',
  },
  errorSubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    marginTop: 15,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingBottom: 15,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#274A8A',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 15,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  detailsSection: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
    width: 20,
    textAlign: 'center',
  },
  detailText: {
    fontSize: 15,
    color: '#555',
    flex: 1,
  },
  statusText: {
    fontSize: 15,
    fontWeight: '500',
  },
  joinButton: {
    backgroundColor: '#274A8A',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  refreshButtonText: {
    marginLeft: 8,
    color: '#274A8A',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ZoomMeetScreen;