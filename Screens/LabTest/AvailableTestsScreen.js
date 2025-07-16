import React, { useState, useEffect } from 'react';
import {Button, View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions, ActivityIndicator, Alert, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
const { width, height } = Dimensions.get('window');
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { BaseUrl } from '../../utils/BaseApi';
import { CheckBox } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
    const [selectedGender, setSelectedGender] = useState(null);
    
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
 
 // Filter tests based on search query and gender
 const filteredTests = tests.filter(test => {
  const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase());
  const matchesGender = selectedGender !== null ? Number(test.gender_id) === selectedGender : true;

  return matchesSearch && matchesGender;
});

// Update gender filter
const handleGenderFilter = (genderId) => {
  setSelectedGender(genderId);
};

const clearGenderFilter = () => {
  setSelectedGender(null);
};

  // Function to handle test selection
  const toggleTestSelection = (id) => {
    const updatedTests = tests.map(test => 
      test.id === id ? { ...test, selected: !test.selected } : test
    );
    setTests(updatedTests);
  };
  const submitSelectedTests =  () => {
    const selectedTests = tests.filter(test => test.selected);
    if (selectedTests.length === 0) {
      Alert.alert('No Tests Selected', 'Please select at least one test to proceed.');
      return; // Prevent navigation if no tests are selected
    }
    console.log(selectedTests);
    navigation.navigate('Book Lab',{tests:selectedTests})
  };
 
  return (
    <View style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity onPress={navigation.goBack}>
        <Icon name="arrow-back" size={30} color="#fff" />
      </TouchableOpacity >
      <Text style={styles.headerTitle}>Available Tests</Text>
    </View>
      {/* Gender Filter Buttons */}
      <View style={styles.genderFilterContainer}>
      {/* Male Button with Icon */}
      <TouchableOpacity
        style={[styles.genderButton, selectedGender === 1 && styles.activeGenderButton]}
        onPress={() => handleGenderFilter(1)}
      >
        <View style={styles.genderButtonContent}>
        <Ionicons 
        name="male" 
        size={26} 
        color={selectedGender === 2 ? '#fff' : '#E91E63'} 
      />
          <Text style={[
      styles.genderButtonText,
      selectedGender === 1 && styles.activeGenderButtonText
    ]}>Male</Text>
        </View>
      </TouchableOpacity>

      {/* Female Button with Icon */}
      <TouchableOpacity
        style={[styles.genderButton, selectedGender === 2 && styles.activeGenderButton]}
        onPress={() => handleGenderFilter(2)}
      >
        <View style={styles.genderButtonContent}>
        <Ionicons 
        name="female" 
        size={26} 
        color={selectedGender === 1 ? '#fff' : '#1E88E5'} 
      />
          <Text style={styles.genderButtonText}>Female</Text>
        </View>
      </TouchableOpacity>

      {/* Clear Button */}
      <TouchableOpacity 
        style={styles.clearButton} 
        onPress={clearGenderFilter}
      >
        <Text style={styles.clearButtonText}>Clear</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.searchBarContainer}>
        <Icon name="search" size={20} color="#A9A9A9" style={styles.icon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search Tests"
          placeholderTextColor="#A9A9A9"
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
      </View>

    <ScrollView style={styles.scrollView}>
      {filteredTests.map(test => (
        <View key={test.id} style={styles.testItem}>
          <View style={styles.testDetails}>
            <Text style={styles.testName}>{test.name}</Text>
            <Text style={styles.reportTime}>Report with in: {test.time}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.oldPrice}>€{test.regular_price}</Text>
            <Text style={styles.newPrice}>€{test.offer_price}</Text>
            <TouchableOpacity onPress={() => toggleTestSelection(test.id)}>
              <Icon name={test.selected ? "checkmark-circle" : "ellipse-outline"} size={30} color={test.selected ? "#37BAF1" : "#ccc"} />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>

    <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.reviewButton} onPress={navigation.goBack}>
          <Text style={styles.buttonText}>Go Back</Text>
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
    backgroundColor: '#274A8A',
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
  genderFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  genderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeGenderButton: {
    backgroundColor: '#274A8A',
    borderColor: '#0D7C66',
  },
  genderButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  genderIcon: {
    fontSize: 18,
    marginRight: 5,
    color: '#333',
  },
  genderButtonText: {
    fontSize: 14,
    color: '#333',
  },
  activeGenderButtonText: {
    color: '#fff',
  },
  clearButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  clearButtonText: {
    fontSize: 14,
    color: '#333',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    margin: width * 0.05,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.03,
    width: '90%',
  },
  icon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
    color: '#000',
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
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff' },
  reviewButton: { flex: 1, marginRight: 8, padding: 16, borderRadius: 8, backgroundColor: '#3f51b5', alignItems: 'center' },
  confirmButton: { flex: 1, marginLeft: 8, padding: 16, borderRadius: 8, backgroundColor: '#4caf50', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default AvailableTestsScreen;
