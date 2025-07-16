import React, { useState, useEffect } from 'react';
import {Button, View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions, ActivityIndicator, Alert, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
const { width, height } = Dimensions.get('window');
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { BaseUrl } from '../../utils/BaseApi';
import { CheckBox } from 'react-native-elements';

import axios from 'axios';
const AvailableTestsScreen = () => {
  const navigation = useNavigation();
    const [tests, setTests] = useState([]);
    const [availabletest, setAvailabletest] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTests, setSelectedTests] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    
    useEffect(() => {
      
      
      fetchAvailableTests();
     
      
  }, []);
  const fetchAvailableTests = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`${BaseUrl}/get-lab-tests`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        console.log('fetching...');
        setTests(response.data);
        //console.log(response.data);
        setLoading(false);
    } catch (error) {
        Alert.alert('Error', 'Failed to fetch appointments');
        setLoading(false);
    }
    
};
  if (loading) {
    return <Text>
      <ActivityIndicator size={"large"}/>
    </Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }
 
  const filteredTests = tests.filter(test => 
    test.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to handle test selection
  const toggleTestSelection = (id) => {
    const updatedTests = tests.map(test => 
      test.id === id ? { ...test, selected: !test.selected } : test
    );
    setTests(updatedTests);
  };
  const submitSelectedTests =  () => {
    const selectedTests = tests.filter(test => test.selected);
      
    console.log(selectedTests);
   
    navigation.navigate('Book Lab')
  };
 
  return (
    <View style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity>
        <Icon name="arrow-back" size={30} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Available Tests</Text>
    </View>
    
    <View style={styles.tabContainer}>
      <TouchableOpacity style={styles.tabButton}>
        <Text style={styles.tabText}>Profile Details</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.tabButton, styles.activeTab]}>
        <Text style={[styles.tabText, styles.activeTabText]}>Available Test</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabButton}>
        <Text style={styles.tabText}>About Us</Text>
      </TouchableOpacity>
    </View>

    <TextInput
      style={styles.searchBar}
      placeholder="Search Tests"
      placeholderTextColor="#A9A9A9"
      value={searchQuery}
      onChangeText={text => setSearchQuery(text)}
    />

    <ScrollView style={styles.scrollView}>
      {filteredTests.map(test => (
        <View key={test.id} style={styles.testItem}>
          <View style={styles.testDetails}>
            <Text style={styles.testName}>{test.name}</Text>
            <Text style={styles.reportTime}>Report with in: {test.time}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.oldPrice}>${test.regular_price}</Text>
            <Text style={styles.newPrice}>${test.offer_price}</Text>
            <TouchableOpacity onPress={() => toggleTestSelection(test.id)}>
              <Icon name={test.selected ? "checkmark-circle" : "ellipse-outline"} size={30} color={test.selected ? "#37BAF1" : "#ccc"} />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>

    <View style={styles.footer}>
      <TouchableOpacity style={styles.reviewButton} >
        <Text style={styles.buttonText}>Review Selected</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.confirmButton} onPress={submitSelectedTests}>
        <Text style={styles.buttonText}>Confirm Booking</Text>
      </TouchableOpacity>
    </View>
    
  </View>

  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
  },
  header: {
    height: height * 0.08,
    backgroundColor: '#276EF1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
    marginLeft: width * 0.03,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#fff',
    paddingVertical: height * 0.015,
  },
  tabButton: {
    paddingVertical: height * 0.01,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#276EF1',
  },
  tabText: {
    fontSize: 16,
    color: '#555',
  },
  activeTabText: {
    color: '#276EF1',
  },
  searchBar: {
    margin: width * 0.05,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.03,
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  scrollView: {
    marginHorizontal: width * 0.05,
  },
  testItem: {
    backgroundColor: '#fff',
    padding: width * 0.03,
    marginBottom: height * 0.02,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  testDetails: {
    flex: 3,
  },
  testName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  reportTime: {
    fontSize: 14,
    color: '#888',
    marginTop: height * 0.005,
  },
  priceContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  oldPrice: {
    fontSize: 14,
    color: '#aaa',
    textDecorationLine: 'line-through',
  },
  newPrice: {
    fontSize: 16,
    color: '#276EF1',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  reviewButton: {
    backgroundColor: '#505BDA',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.15,
    borderRadius: 10,
  },
  confirmButton: {
    backgroundColor: '#00C853',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.15,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AvailableTestsScreen;
