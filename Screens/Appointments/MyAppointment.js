/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useState, useCallback, memo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {BaseUrl} from '../../utils/BaseApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import isEqual from 'lodash/isEqual';
import moment from 'moment';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const Tab = createMaterialTopTabNavigator();

const AppointmentCard = memo(({ item, navigation, getStatusStyle }) => {
  return (
    <View style={styles.appointmentContainer}>
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: item.hospital?.image_url || 'https://placehold.co/100x100/E0E0E0/333333?text=Hospital',
          }}
          style={styles.profileImage}
        />

        <View style={styles.profileTextContainer}>
          <Text style={styles.doctorName}>
            {item.hospital?.hospital_name || 'N/A'}
          </Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.row}>
          <Icon name="calendar" size={20} color="#333" style={styles.icon} />
          <Text style={styles.text}>
            {moment(item.date, 'YYYY-MM-DD').format('MMMM Do, YYYY')}
          </Text>
        </View>

        {Number(item.types) !== 1 && (
          <View style={styles.row}>
            <FontAwesome name="clock-o" size={20} color="green" style={styles.icon} />
            <Text style={styles.text}>
              {item.time ? moment(item.time, 'HH:mm').format('hh:mm a') : 'Time not available'}
            </Text>
          </View>
        )}

        <View style={styles.row}>
          {Number(item.types) === 1 ? (
            <>
              <FontAwesome name="building" size={20} color="#3498db" style={styles.icon} />
              <Text style={styles.text}>On-site Consultation</Text>
            </>
          ) : Number(item.types) === 2 ? (
            <>
              <FontAwesome name="video-camera" size={20} color="#e74c3c" style={styles.icon} />
              <Text style={styles.text}>Video Consultation</Text>
            </>
          ) : (
            <>
              <FontAwesome name="phone" size={20} color="#2ecc71" style={styles.icon} />
              <Text style={styles.text}>Voice Consultation</Text>
            </>
          )}
        </View>

        <View style={styles.row}>
          <FontAwesome name="user" size={20} color="#333" style={styles.icon} />
          <Text style={styles.text}>{item.user?.name || 'N/A'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Icon
            name="alert-circle-outline"
            size={18}
            color={parseInt(item.status) === 1 ? 'green' : 'red'}
            style={{marginRight: 8, fontWeight: '700'}}
          />
          <Text style={getStatusStyle(item.status)}>
            {parseInt(item.status) === 1 ? 'Confirmed' : 'Pending'}
          </Text>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.buttonSecondary}
            onPress={() =>
              navigation.navigate('MedicalRecord', {
                appointmentId: item.id,
              })
            }>
            <Text style={styles.buttonTextWhite}>Attach Reports</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

const PastAppointmentCard = memo(({ item, navigation }) => {
  return (
    <View style={styles.appointmentContainer}>
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: item.hospital?.image_url || 'https://placehold.co/100x100/E0E0E0/333333?text=Hospital',
          }}
          style={styles.profileImage}
        />
        <View style={styles.profileTextContainer}>
          <Text style={styles.doctorName}>
            {item.hospital?.hospital_name || 'N/A'}
          </Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.row}>
          <Icon name="calendar" size={20} color="#333" style={styles.icon} />
          <Text style={styles.text}>{moment(item.date, 'YYYY-MM-DD').format('MMMM Do, YYYY')}</Text>
        </View>
        <View style={styles.row}>
          <FontAwesome name="clock-o" size={20} color="green" style={styles.icon} />
          <Text style={styles.text}>
            {item.time ? moment(item.time, 'HH:mm').format('hh:mm a') : 'Time not available'}
          </Text>
        </View>
        <View style={styles.row}>
          <FontAwesome name="user" size={20} color="#333" style={styles.icon} />
          <Text style={styles.text}>{item.user?.name || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          {Number(item.types) === 1 ? (
            <>
              <FontAwesome name="building" size={20} color="#3498db" style={styles.icon} />
              <Text style={styles.text}>On-site Consultation</Text>
            </>
          ) : Number(item.types) === 2 ? (
            <>
              <FontAwesome name="video-camera" size={20} color="#e74c3c" style={styles.icon} />
              <Text style={styles.text}>Video Consultation</Text>
            </>
          ) : (
            <>
              <FontAwesome name="phone" size={20} color="#2ecc71" style={styles.icon} />
              <Text style={styles.text}>Voice Consultation</Text>
            </>
          )}
        </View>

        <View style={styles.row}>
          <FontAwesome name="clock-o" size={20} color="red" style={styles.icon} />
          <Text style={styles.remainingDays}>
            {item.remaining_days > 0
              ? `${item.remaining_days} days remaining`
              : item.remaining_days === 0
              ? 'Today'
              : `${Math.abs(item.remaining_days)} days ago`}
          </Text>
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.buttonReview}
            onPress={() =>
              navigation.navigate('Reviews', {
                hospitalId: item.hospital_id,
              })
            }>
            <Text style={styles.buttonTextWhite}>Review</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

const FilterModal = ({
  visible,
  onClose,
  dateFilter,
  setDateFilter,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  resetFilters,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleBackdropPress = () => {
    if (!showDatePicker) {
      onClose();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleBackdropPress}>
      <Pressable 
        style={styles.centeredView} 
        onPress={handleBackdropPress}>
        <Pressable style={styles.modalView} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.modalTitle}>Filter Appointments</Text>
          
          {/* Date Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Date:</Text>
            <TouchableOpacity 
              style={styles.dateInput} 
              onPress={() => setShowDatePicker(true)}>
              <Text>
                {dateFilter ? moment(dateFilter).format('MMMM Do, YYYY') : 'Select date'}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={dateFilter || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setDateFilter(selectedDate);
                  }
                }}
              />
            )}
            {dateFilter && (
              <TouchableOpacity 
                style={styles.clearFilterButton}
                onPress={() => setDateFilter(null)}>
                <Text style={styles.clearFilterText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {/* Status Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Status:</Text>
            <Picker
              selectedValue={statusFilter}
              style={styles.picker}
              onValueChange={(itemValue) => setStatusFilter(itemValue)}>
              <Picker.Item label="All" value="all" />
              <Picker.Item label="Confirmed" value="1" />
              <Picker.Item label="Pending" value="0" />
            </Picker>
          </View>
          
          {/* Type Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Type:</Text>
            <Picker
              selectedValue={typeFilter}
              style={styles.picker}
              onValueChange={(itemValue) => setTypeFilter(itemValue)}>
              <Picker.Item label="All" value="all" />
              <Picker.Item label="On-site" value="1" />
              <Picker.Item label="Video" value="2" />
              <Picker.Item label="Voice" value="3" />
            </Picker>
          </View>
          
          <View style={styles.modalButtons}>
            <Pressable
              style={[styles.button, styles.resetButton]}
              onPress={resetFilters}>
              <Text style={styles.buttonText}>Reset Filters</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.applyButton]}
              onPress={onClose}>
              <Text style={styles.buttonText}>Apply Filters</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const AppointmentListWithFilters = ({ 
  appointments, 
  loading, 
  error, 
  onRetry, 
  navigation, 
  getStatusStyle,
  isPastAppointments = false,
  dateFilter,
  setDateFilter,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  resetFilters,
  onClearFilters,
  onRefresh,
  refreshing
}) => {
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Combined refresh that resets filters and reloads data
  const handleRefresh = async () => {
    await onClearFilters();  // Reset filters first
    await onRefresh();       // Then refresh data
  };

  const handleClearFilters = async () => {
    await onClearFilters();
    setFilterModalVisible(false);
  };

  // Show loading only on initial load, not during refreshes
  if (loading && !refreshing && appointments.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>
          {isPastAppointments ? 'Loading past appointments...' : 'Loading upcoming appointments...'}
        </Text>
      </View>
    );
  }

  if (error && appointments.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Always show the filter header */}
      <View style={styles.filterHeader}>
        <Text style={styles.filterResultsText}>
          Showing {appointments.length} appointment(s)
        </Text>
        <View style={styles.filterActions}>
          {/* Refresh button now resets filters AND reloads data */}
          <TouchableOpacity 
            style={styles.refreshButtonSmall}
            onPress={handleRefresh}>
            <Icon name="refresh" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setFilterModalVisible(true)}>
            <Icon name="filter" size={20} color="#fff" />
            <Text style={styles.filterButtonText}>Filter</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        resetFilters={resetFilters}
      />
      
      <FlatList
        data={appointments}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          isPastAppointments ? (
            <PastAppointmentCard
              item={item}
              navigation={navigation}
            />
          ) : (
            <AppointmentCard
              item={item}
              navigation={navigation}
              getStatusStyle={getStatusStyle}
            />
          )
        )}
        contentContainerStyle={[
          styles.flatListContentContainer,
          appointments.length === 0 && styles.emptyFlatListContent
        ]}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {dateFilter || statusFilter !== 'all' || typeFilter !== 'all' 
                ? 'No appointments match your filters'
                : isPastAppointments 
                  ? 'No past appointments found' 
                  : 'No upcoming appointments found'}
            </Text>
            {(dateFilter || statusFilter !== 'all' || typeFilter !== 'all') && (
              <TouchableOpacity 
                onPress={handleClearFilters}
                style={styles.clearFiltersButton}>
                <Text style={styles.clearFiltersButtonText}>Clear Filters</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              onPress={handleRefresh}
              style={styles.refreshButton}>
              <Text style={styles.refreshButtonText}>Refresh Data</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const MyAppointment = () => {
  const navigation = useNavigation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Separate filter states for each tab
  const [upcomingFilters, setUpcomingFilters] = useState({
    date: null,
    status: 'all',
    type: 'all'
  });
  
  const [pastFilters, setPastFilters] = useState({
    date: null,
    status: 'all',
    type: 'all'
  });

  const getStatusStyle = useCallback(status => {
    return {
      color: parseInt(status) === 1 ? 'green' : 'red',
      fontWeight: '600',
    };
  }, []);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${BaseUrl}/appointment-detail`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const newAppointments = response.data.appointments;

      if (!isEqual(newAppointments, appointments)) {
        setAppointments(newAppointments);
      }
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
      setError('Failed to fetch upcoming appointments.');
      setLoading(false);
    }
  }, []);

  const fetchPastAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${BaseUrl}/past-appointments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const newPastAppointments = response.data.appointments;

      if (!isEqual(newPastAppointments, pastAppointments)) {
        setPastAppointments(newPastAppointments);
      }
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch past appointments:', err);
      setError('Failed to fetch past appointments.');
      setLoading(false);
    }
  }, [pastAppointments]);

  const clearFiltersAndReload = useCallback(async () => {
    resetUpcomingFilters();
    resetPastFilters();
    
    setRefreshing(true);
    await Promise.all([fetchAppointments(), fetchPastAppointments()]);
    setRefreshing(false);
  }, [fetchAppointments, fetchPastAppointments]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchAppointments(), fetchPastAppointments()]);
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchAppointments, fetchPastAppointments]);

  useEffect(() => {
    fetchAppointments();
    fetchPastAppointments();

    return () => {
      // Cleanup if needed
    };
  }, [fetchAppointments, fetchPastAppointments]);

  const filterAppointments = (appointments, filters, isPast = false) => {
    return appointments.filter(appointment => {
      if (filters.date && moment(appointment.date).format('YYYY-MM-DD') !== moment(filters.date).format('YYYY-MM-DD')) {
        return false;
      }
      
      if (!isPast && filters.status !== 'all' && parseInt(appointment.status) !== parseInt(filters.status)) {
        return false;
      }
      
      if (filters.type !== 'all' && parseInt(appointment.types) !== parseInt(filters.type)) {
        return false;
      }
      
      return true;
    });
  };

  const resetUpcomingFilters = () => {
    setUpcomingFilters({
      date: null,
      status: 'all',
      type: 'all'
    });
  };

  const resetPastFilters = () => {
    setPastFilters({
      date: null,
      status: 'all',
      type: 'all'
    });
  };

  // Clear filters for a specific tab
  const clearTabFilters = (isPast) => {
    if (isPast) {
      resetPastFilters();
    } else {
      resetUpcomingFilters();
    }
  };

  const AppointmentDetail = () => (
    <AppointmentListWithFilters
      appointments={filterAppointments(appointments, upcomingFilters)}
      loading={loading}
      error={error}
      onRetry={fetchAppointments}
      navigation={navigation}
      getStatusStyle={getStatusStyle}
      isPastAppointments={false}
      dateFilter={upcomingFilters.date}
      setDateFilter={(date) => setUpcomingFilters(prev => ({...prev, date}))}
      statusFilter={upcomingFilters.status}
      setStatusFilter={(status) => setUpcomingFilters(prev => ({...prev, status}))}
      typeFilter={upcomingFilters.type}
      setTypeFilter={(type) => setUpcomingFilters(prev => ({...prev, type}))}
      resetFilters={() => resetUpcomingFilters()}
      onClearFilters={() => {
        resetUpcomingFilters();
        handleRefresh();
      }}
      onRefresh={handleRefresh}
      refreshing={refreshing}
    />
  );

  const PastAppointmentList = () => (
    <AppointmentListWithFilters
      appointments={filterAppointments(pastAppointments, pastFilters, true)}
      loading={loading}
      error={error}
      onRetry={fetchPastAppointments}
      navigation={navigation}
      isPastAppointments={true}
      dateFilter={pastFilters.date}
      setDateFilter={(date) => setPastFilters(prev => ({...prev, date}))}
      statusFilter={pastFilters.status}
      setStatusFilter={(status) => setPastFilters(prev => ({...prev, status}))}
      typeFilter={pastFilters.type}
      setTypeFilter={(type) => setPastFilters(prev => ({...prev, type}))}
      resetFilters={() => resetPastFilters()}
      onClearFilters={() => {
        resetPastFilters();
        handleRefresh();
      }}
      onRefresh={handleRefresh}
      refreshing={refreshing}
    />
  );

  return (
     <NavigationContainer independent={true}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#007BFF',
          tabBarInactiveTintColor: '#888',
          tabBarIndicatorStyle: {
            backgroundColor: '#007BFF',
            height: 3,
          },
          tabBarStyle: {
            backgroundColor: '#fff',
            elevation: 4,
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 4,
          },
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: 'bold',
          },
        }}
      >
        <Tab.Screen name="Upcoming" component={AppointmentDetail} />
        <Tab.Screen name="Past" component={PastAppointmentList} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  flatListContentContainer: {
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  noDataText: {
    fontSize: 16,
    color: '#888',
  },
  appointmentContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginRight: 15,
    borderWidth: 2,
    borderColor: 'blue',
  },
  profileTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 3,
    color: '#333',
  },
  detailsContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  icon: {
    marginRight: 10,
  },
  remainingDays: {
    fontSize: 14,
    color: '#ff0000',
    fontWeight: 'bold',
  },
  buttonSecondary: {
    backgroundColor: '#28A745',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginRight: 10,
    flex: 1,
    alignItems: 'center',
  },
  buttonVideo: {
    backgroundColor: '#DC3545',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  buttonReview: {
    backgroundColor: '#0D7C66',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  buttonTextWhite: {
    color: '#fff',
    fontWeight: '600',
  },
  confirmedStatus: {
    fontSize: 14,
    color: '#155724',
    fontWeight: 'bold',
  },
  pendingStatus: {
    fontSize: 14,
    color: 'red',
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterResultsText: {
    fontSize: 14,
    color: '#555',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  filterButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  filterSection: {
    marginBottom: 15,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
  },
  picker: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    width: '48%',
  },
  resetButton: {
    backgroundColor: '#e74c3c',
  },
  applyButton: {
    backgroundColor: '#2ecc71',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  clearFilterButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  clearFilterText: {
    color: '#3498db',
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#555',
  },
  emptySubText: {
    fontSize: 14,
    color: '#888',
    marginTop: 10,
  },
  filterActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshButtonSmall: {
    backgroundColor: 'green',
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  refreshButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'center',
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  clearFiltersButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'center',
  },
  clearFiltersButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyFlatListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
});
export default MyAppointment;